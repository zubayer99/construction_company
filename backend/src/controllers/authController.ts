import { Request, Response, NextFunction } from 'express';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { PrismaClient, OrganizationType, UserRole } from '@prisma/client';
import { AuthenticatedRequest } from '../types'; 
import catchAsync from '../utils/catchAsync.js';
import { config } from '../config/config.js';
import { EmailService } from '../services/emailService.js'; 
import { AppError } from './../utils/appError.js';
import { logger } from '../utils/logger.js';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

const prisma = new PrismaClient();
const emailService = new EmailService();

const generateToken = (userId: string, secret: Secret, expiresIn: string | number): string => {
  const options: SignOptions = { expiresIn: expiresIn as any }; 
  return jwt.sign({ id: userId }, secret, options);
};

export const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, organizationName, userType, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return next(new AppError('Email, password, firstName, and lastName are required', 400));
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return next(new AppError('User already exists with this email', 409)); // 409 Conflict
  }

  const passwordHash = await bcrypt.hash(password, config.security.bcryptRounds);

  const role: UserRole = Object.values(UserRole).includes(userType as UserRole) ? userType as UserRole : UserRole.SUPPLIER;

  const userCreateData: any = { 
    email,
    passwordHash,
    firstName,
    lastName,
    role: role,
    emailVerified: false,
  };

  if (organizationName) {
    let organization = await prisma.organization.findFirst({ 
      where: { name: organizationName }, 
    });

    if (!organization) {
      try {
        let orgType: OrganizationType = OrganizationType.SUPPLIER; 
        if (role === UserRole.PROCUREMENT_OFFICER) {
            orgType = OrganizationType.GOVERNMENT_AGENCY;
        }
        if (req.body.organizationType && Object.values(OrganizationType).includes(req.body.organizationType as OrganizationType)) {
            orgType = req.body.organizationType as OrganizationType;
        }


        organization = await prisma.organization.create({
          data: { 
            name: organizationName, 
            type: orgType,
            registrationNumber: `${organizationName.replace(/\s+/g, '-').toLowerCase().substring(0,20)}-${crypto.randomBytes(4).toString('hex')}`, // Placeholder unique value
            address: req.body.organizationAddress || 'N/A', 
            city: req.body.organizationCity || 'N/A', 
            state: req.body.organizationState || 'N/A', 
            zipCode: req.body.organizationZipCode || 'N/A', 
            country: req.body.organizationCountry || 'Bangladesh', // Default from schema
            contactEmail: req.body.organizationContactEmail || email, 
            contactPhone: req.body.organizationContactPhone || 'N/A', 
          },
        });
      } catch (orgError: any) {
        logger.error('Error creating organization:', orgError);
        if (orgError.code === 'P2002') { 
            return next(new AppError(`An organization with some of the provided unique details (e.g., registration number) already exists.`, 409));
        }
        return next(new AppError('Could not create or associate organization. Please ensure all organization details are correct and unique where required.', 500));
      }
    }
    userCreateData.organizationId = organization.id;
  }

  const user = await prisma.user.create({ data: userCreateData });

  const verificationToken = crypto.randomBytes(32).toString('hex');
  const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await prisma.user.update({
      where: { id: user.id },
      data: { 
          emailVerificationToken: verificationToken,
          emailVerificationTokenExpires: verificationTokenExpires 
      },
  });

  try {
    await emailService.sendVerificationEmail(user.email, verificationToken);
  } catch (emailError) {
    logger.error('Failed to send verification email:', emailError);
  }

  const authToken = generateToken(user.id, config.jwt.secret, config.jwt.expiresIn);
  const authRefreshToken = generateToken(user.id, config.jwt.refreshSecret, config.jwt.refreshExpiresIn);

  res.status(201).json({
    status: 'success',
    message: 'User registered successfully. Please check your email to verify your account.',
    token: authToken,
    refreshToken: authRefreshToken,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      organizationId: user.organizationId,
    },
  });
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Email and password are required', 400));
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { organization: true }, 
  });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    if (user) {
        const attempts = (user.loginAttempts || 0) + 1;
        let lockUpdate: any = { loginAttempts: attempts };
        if (attempts >= 5) { // Lock after 5 attempts
            lockUpdate.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 mins
        }
        await prisma.user.update({ where: { id: user.id }, data: lockUpdate });
    }
    return next(new AppError('Invalid email or password', 401));
  }

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    return next(new AppError(`Account locked. Try again after ${user.lockedUntil.toLocaleTimeString()}`, 403));
  }
  
  if (!user.emailVerified) {
    return next(new AppError('Email not verified. Please check your inbox or request a new verification email.', 403));
  }

  // Reset login attempts on successful login pre-MFA
  if (user.loginAttempts && user.loginAttempts > 0) {
    await prisma.user.update({ where: { id: user.id }, data: { loginAttempts: 0, lockedUntil: null } });
  }


  if (user.mfaEnabled && user.mfaSecret) {
    logger.info(`MFA required for user: ${user.id}.`);
    return res.status(202).json({ 
        message: 'MFA required',
        userId: user.id 
    }); 
  }

  // Update lastLogin on successful login
  await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });

  const authToken = generateToken(user.id, config.jwt.secret, config.jwt.expiresIn);
  const authRefreshToken = generateToken(user.id, config.jwt.refreshSecret, config.jwt.refreshExpiresIn);

  res.status(200).json({
    status: 'success',
    token: authToken,
    refreshToken: authRefreshToken,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      organization: user.organization,
      mfaEnabled: user.mfaEnabled,
      lastLogin: user.lastLogin
    },
  });
});


export const verifyEmail = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { token: verificationTokenFromQuery } = req.query; 

  if (!verificationTokenFromQuery || typeof verificationTokenFromQuery !== 'string') {
    return next(new AppError('Verification token is required and must be a string.', 400));
  }
  
  const userToVerify = await prisma.user.findFirst({ 
    where: { 
        emailVerificationToken: verificationTokenFromQuery,
        emailVerificationTokenExpires: { gt: new Date() } 
    } 
  });

  if (!userToVerify) {
    logger.warn(`Invalid or expired email verification token attempt: ${verificationTokenFromQuery}`);
    return next(new AppError('Invalid or expired verification token.', 400));
  }

  await prisma.user.update({
    where: { id: userToVerify.id },
    data: { 
        emailVerified: true, 
        emailVerificationToken: null,
        emailVerificationTokenExpires: null
    }, 
  });

  res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
});

export const refreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { token: oldRefreshToken } = req.body;

  if (!oldRefreshToken) {
    return next(new AppError('Refresh token is required', 401));
  }

  try {
    const storedToken = await prisma.refreshToken.findUnique({
        where: { token: oldRefreshToken },
        include: { user: true }
    });

    if (!storedToken || !storedToken.user || storedToken.expiresAt < new Date()) {
        if(storedToken) await prisma.refreshToken.delete({ where: { id: storedToken.id }}); // Delete expired/invalid token
        return next(new AppError('Invalid or expired refresh token. Please log in again.', 401));
    }
    
    if (!storedToken.user.isActive) {
        return next(new AppError('User account is inactive. Please contact support.', 403));
    }


    const newAccessToken = generateToken(storedToken.userId, config.jwt.secret, config.jwt.expiresIn);
    // const newRefreshToken = generateToken(storedToken.userId, config.jwt.refreshSecret, config.jwt.refreshExpiresIn);
    // await prisma.refreshToken.update({ where: { id: storedToken.id }, data: { token: newRefreshToken, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }});


    return res.status(200).json({ 
      accessToken: newAccessToken,
      // refreshToken: newRefreshToken, // if rotating
      refreshToken: oldRefreshToken, // if not rotating and it\'s still valid for its full duration
    }); 
  } catch (error) {
    logger.error('Error refreshing token:', error);
    return next(new AppError('Could not refresh token due to an unexpected error.', 500));
  }
});

export const forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError('Email is required for password reset.', 400));
  }
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    logger.info(`Password reset request for non-existent or unconfirmed email: ${email}`);
    return res.status(200).json({ message: 'If your email is registered with us, you will receive a password reset link.'});
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  
  const expiresIn = config.jwt.passwordResetExpiresIn;
  let expiresMillis: number;
  if (typeof expiresIn === 'string') {
    const unit = expiresIn.slice(-1);
    const value = parseInt(expiresIn.slice(0, -1), 10);
    if (unit === 's') expiresMillis = value * 1000;
    else if (unit === 'm') expiresMillis = value * 60 * 1000;
    else if (unit === 'h') expiresMillis = value * 60 * 60 * 1000;
    else if (unit === 'd') expiresMillis = value * 24 * 60 * 60 * 1000;
    else expiresMillis = 10 * 60 * 1000; // Default to 10 minutes if format is unexpected
  } else if (typeof expiresIn === 'number') {
    expiresMillis = expiresIn * 1000; // Assuming number is in seconds
  } else {
    expiresMillis = 10 * 60 * 1000; // Default to 10 minutes
  }
  const passwordResetExpires = new Date(Date.now() + expiresMillis);

  await prisma.user.update({
    where: { email: user.email },
    data: {
      passwordResetToken,
      passwordResetExpires,
    },
  });

  try {
    await emailService.sendPasswordResetEmail(user.email, resetToken); 
    res.status(200).json({ message: 'Password reset link sent to your email.' });
  } catch (err) {
    logger.error('Error sending password reset email:', err);
    await prisma.user.update({
      where: { email: user.email }, 
      data: {
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });
    return next(new AppError('There was an error sending the password reset email. Please try again later.', 500));
  }
});

export const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { token: resetTokenFromParams } = req.params; 
  const { password } = req.body;

  if (!resetTokenFromParams || typeof resetTokenFromParams !== 'string') {
    return next(new AppError('Reset token is invalid or missing from URL.', 400));
  }
  if (!password || password.length < 8) {
    return next(new AppError('New password is required and must be at least 8 characters long.', 400));
  }

  const hashedToken = crypto.createHash('sha256').update(resetTokenFromParams).digest('hex');

  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: { gt: new Date() },
    },
  });

  if (!user) {
    return next(new AppError('Password reset token is invalid or has expired.', 400));
  }

  const passwordHash = await bcrypt.hash(password, config.security.bcryptRounds);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      passwordResetToken: null,
      passwordResetExpires: null,
      emailVerified: true,
      mfaEnabled: false,
      mfaSecret: null, 
      loginAttempts: 0,
      lockedUntil: null,
    },
  });
  
  await prisma.refreshToken.deleteMany({ where: { userId: user.id } });


  res.status(200).json({ message: 'Password has been reset successfully. Please log in with your new password.' });
});

const authenticatedCatchAsync = (fn: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req as AuthenticatedRequest, res, next).catch(next);
  };
};

export const changePassword = authenticatedCatchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user?.id; // From AuthenticatedRequest

  if (!userId) {
    return next(new AppError('User not authenticated. Session may have expired.', 401));
  }
   if (!currentPassword || !newPassword) {
    return next(new AppError('Current password and new password are required.', 400));
  }
   if (newPassword.length < 8) {
    return next(new AppError('New password must be at least 8 characters long.', 400));
  }


  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) { 
    return next(new AppError('Authenticated user not found in database.', 404));
  }

  if (!(await bcrypt.compare(currentPassword, user.passwordHash))) {
    return next(new AppError('Incorrect current password.', 401));
  }
  
  const passwordHash = await bcrypt.hash(newPassword, config.security.bcryptRounds);
  await prisma.user.update({
    where: { id: userId },
    data: { 
        passwordHash,
    },
  }); 
  await prisma.refreshToken.deleteMany({ where: { userId: userId, NOT: { token: req.cookies?.refreshToken } }}); // Example if refresh token is in cookie


  res.status(200).json({ message: 'Password changed successfully.' });
});


export const setupMFA = authenticatedCatchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('User not found for MFA setup', 401));

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return next(new AppError('User not found in database', 404));

    if (user.mfaEnabled && user.mfaSecret) {
        return res.status(400).json({ message: 'MFA is already enabled for this account.' });
    }
    
    const secret = speakeasy.generateSecret({ 
        name: `${config.mfa.issuer} (${user.email})`,
        issuer: config.mfa.issuer 
    });

    await prisma.user.update({
        where: { id: userId },
        data: { mfaSecret: secret.base32 }, // Store the base32 secret
    });
    
    if (!secret.otpauth_url) {
        logger.error('OTPAuth URL is undefined after generating secret for user:', userId);
        await prisma.user.update({ where: { id: userId }, data: { mfaSecret: null }})
            .catch(rollbackError => logger.error('Error rolling back mfaSecret after OTPAuth URL failure for user:', userId, rollbackError));
        return next(new AppError('Could not generate MFA setup details. OTPAuth URL was not created.', 500));
    }

    qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
        if (err) {
            logger.error('Error generating QR code for MFA setup for user:', userId, err);
            prisma.user.update({ where: { id: userId }, data: { mfaSecret: null }})
              .catch(rollbackError => logger.error('Error rolling back mfaSecret after QR code failure for user:', userId, rollbackError));
            return next(new AppError('Could not generate QR code for MFA setup.', 500));
        }
        res.status(200).json({
            message: 'MFA setup initiated. Scan the QR code with your authenticator app and verify the token. Also, save the secret key securely.',
            qrCode: data_url, 
            secret: secret.base32,
        });
    });
});

export const verifyMFA = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { token: mfaVerificationCode, userId } = req.body; 

    if (!userId) {
        return next(new AppError('User ID is required for MFA verification.', 400));
    }
    if (!mfaVerificationCode) {
        return next(new AppError('MFA verification code (token) is required.', 400));
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.mfaSecret) { 
        return next(new AppError('MFA not set up for this user, or mfaSecret is missing.', 400));
    }
        
    const isVerified = speakeasy.totp.verify({ 
        secret: user.mfaSecret, 
        encoding: 'base32', 
        token: mfaVerificationCode, 
        window: 1
    });

    if (!isVerified) {
        return next(new AppError('Invalid MFA code.', 401));
    }

    if (!user.mfaEnabled) { 
        await prisma.user.update({
            where: { id: userId },
            data: { mfaEnabled: true }, 
        });
        return res.status(200).json({ message: 'MFA enabled successfully! You can now use MFA for future logins.' });
    }
    
    await prisma.user.update({ 
        where: { id: user.id }, 
        data: { 
            lastLogin: new Date(), 
            loginAttempts: 0,
            lockedUntil: null
        } 
    });

    const authToken = generateToken(user.id, config.jwt.secret, config.jwt.expiresIn);
    const authRefreshToken = generateToken(user.id, config.jwt.refreshSecret, config.jwt.refreshExpiresIn);
    
    let refreshExpiresMillis: number;
    const expiresInString = config.jwt.refreshExpiresIn;
    const expiresInValue = parseInt(expiresInString.slice(0, -1), 10);
    const expiresInUnit = expiresInString.slice(-1).toLowerCase();

    if (isNaN(expiresInValue)) {
        logger.warn(`Invalid format for refreshExpiresIn: ${expiresInString}. Defaulting to 7 days.`);
        refreshExpiresMillis = 7 * 24 * 60 * 60 * 1000;
    } else {
        if (expiresInUnit === 's') refreshExpiresMillis = expiresInValue * 1000;
        else if (expiresInUnit === 'm') refreshExpiresMillis = expiresInValue * 60 * 1000;
        else if (expiresInUnit === 'h') refreshExpiresMillis = expiresInValue * 60 * 60 * 1000;
        else if (expiresInUnit === 'd') refreshExpiresMillis = expiresInValue * 24 * 60 * 60 * 1000;
        else {
            logger.warn(`Unknown unit for refreshExpiresIn: ${expiresInUnit}. Defaulting to 7 days.`);
            refreshExpiresMillis = 7 * 24 * 60 * 60 * 1000;
        }
    }

    await prisma.refreshToken.create({
        data: {
            token: authRefreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + refreshExpiresMillis)
        }
    });

    res.status(200).json({
        status: 'success',
        message: 'MFA verified, login successful.',
        token: authToken,
        refreshToken: authRefreshToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          organizationId: user.organizationId, 
          mfaEnabled: user.mfaEnabled,
        },
    });
});


export const disableMFA = authenticatedCatchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) return next(new AppError('User not authenticated for MFA disable', 401));

    const { mfaToken: mfaVerificationCodeFromUser } = req.body; 
     if (!mfaVerificationCodeFromUser) {
        return next(new AppError('MFA code (mfaToken) is required to disable MFA.', 400));
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.mfaEnabled || !user.mfaSecret) {
        return next(new AppError('MFA is not enabled for this user or mfaSecret is missing.', 400));
    }
    
    const isVerified = speakeasy.totp.verify({ 
        secret: user.mfaSecret, 
        encoding: 'base32', 
        token: mfaVerificationCodeFromUser,
        window: 1
    });

    if (!isVerified) {
        return next(new AppError('Invalid MFA code.', 401));
    }

    await prisma.user.update({
        where: { id: userId },
        data: { 
            mfaEnabled: false, 
            mfaSecret: null,
        },
    });

    res.status(200).json({ message: 'MFA disabled successfully.' });
});

export const getMe = authenticatedCatchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) {
        return next(new AppError('User not found or not authenticated', 401));
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true, 
            organizationId: true,
            emailVerified: true,
            mfaEnabled: true,
            lastLogin: true,
            createdAt: true,
            updatedAt: true,
            organization: { 
                select: {
                    id: true,
                    name: true,
                    type: true,
                }
            }
        }
    });

    if (!user) {
        return next(new AppError('Authenticated user not found in database.', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            user,
        },
    });
});

export const resendVerificationEmail = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    if (!email) {
        return next(new AppError('Email is required', 400));
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return res.status(200).json({ message: 'If your email is registered and not verified, a new verification link will be sent.' });
    }

    if (user.emailVerified) {
        return res.status(400).json({ message: 'Email is already verified.' });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.user.update({
        where: { id: user.id },
        data: { 
            emailVerificationToken: verificationToken, 
            emailVerificationTokenExpires: verificationTokenExpires 
        },
    });

    try {
        await emailService.sendVerificationEmail(user.email, verificationToken);
        res.status(200).json({ message: 'New verification email sent. Please check your inbox.' });
    } catch (emailError) {
        logger.error('Failed to resend verification email:', emailError);
        await prisma.user.update({
            where: { id: user.id },
            data: { 
                emailVerificationToken: null, 
                emailVerificationTokenExpires: null 
            }, 
        });
        next(new AppError('Failed to send verification email. Please try again later.', 500));
    }
});

// Logout function
export const logout = authenticatedCatchAsync(async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Invalidate the current session/token
    // In a production environment, you might want to blacklist the token
    // or maintain a session store with Redis
    
    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (error) {
    return next(new AppError('Logout failed', 500));
  }
});

// Get user profile
export const getProfile = authenticatedCatchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new AppError('User not authenticated', 401));
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        organizationId: true,
        role: true,
        emailVerified: true,
        mfaEnabled: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
        organization: {
          select: {
            id: true,
            name: true,
            type: true
          }
        }
      }
    });

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    return next(new AppError('Failed to fetch profile', 500));
  }
});

// Update user profile
export const updateProfile = authenticatedCatchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new AppError('User not authenticated', 401));
    }

    const { firstName, lastName, phone } = req.body;

    // Validate input
    if (!firstName || !lastName) {
      return next(new AppError('First name and last name are required', 400));
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        firstName,
        lastName,
        phone: phone || null,
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        organizationId: true,
        role: true,
        emailVerified: true,
        mfaEnabled: true,
        updatedAt: true,
        organization: {
          select: {
            id: true,
            name: true,
            type: true
          }
        }
      }
    });

    res.status(200).json({
      status: 'success',
      data: { user: updatedUser },
      message: 'Profile updated successfully'
    });
  } catch (error) {
    return next(new AppError('Failed to update profile', 500));
  }
});

// Get user sessions (placeholder - would need session store implementation)
export const getSessions = authenticatedCatchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new AppError('User not authenticated', 401));
    }

    // In a real implementation, you would fetch sessions from Redis or a session store
    // For now, return the current session info
    const currentSession = {
      id: 'current',
      userId: req.user.id,
      userAgent: req.headers['user-agent'] || 'Unknown',
      ipAddress: req.ip || req.connection.remoteAddress,
      createdAt: new Date(),
      lastAccessedAt: new Date(),
      isCurrent: true
    };

    res.status(200).json({
      status: 'success',
      data: {
        sessions: [currentSession]
      }
    });
  } catch (error) {
    return next(new AppError('Failed to fetch sessions', 500));
  }
});

// Revoke a specific session
export const revokeSession = authenticatedCatchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return next(new AppError('Session ID is required', 400));
    }

    // In a real implementation, you would remove the session from Redis or session store
    // For now, just return success
    res.status(200).json({
      status: 'success',
      message: 'Session revoked successfully'
    });
  } catch (error) {
    return next(new AppError('Failed to revoke session', 500));
  }
});

// Revoke all sessions except current
export const revokeAllSessions = authenticatedCatchAsync(async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // In a real implementation, you would remove all sessions for the user from Redis or session store
    // except the current one
    
    res.status(200).json({
      status: 'success',
      message: 'All sessions revoked successfully'
    });
  } catch (error) {
    return next(new AppError('Failed to revoke sessions', 500));
  }
});
