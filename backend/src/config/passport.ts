import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { config } from './config.js';

const prisma = new PrismaClient();

// Local Strategy for username/password authentication
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
          include: {
            organization: true,
          },
        });

        if (!user) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        // Check if user is active
        if (!user.isActive) {
          return done(null, false, { message: 'Account is deactivated' });
        }        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        // Return user object
        return done(null, {
          id: user.id,
          email: user.email,
          role: user.role,
          organizationId: user.organizationId,
          isActive: user.isActive,
          isMfaEnabled: user.mfaEnabled,
          permissions: [], // Using role-based permissions for now
        });
      } catch (error) {
        return done(error);
      }
    }
  )
);

// JWT Strategy for token-based authentication
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwt.secret,
    },
    async (jwtPayload, done) => {
      try {        const user = await prisma.user.findUnique({
          where: { id: jwtPayload.id },
          include: {
            organization: true,
          },
        });

        if (!user) {
          return done(null, false);
        }

        if (!user.isActive) {
          return done(null, false);
        }

        return done(null, {
          id: user.id,
          email: user.email,
          role: user.role,
          organizationId: user.organizationId,
          isActive: user.isActive,
          isMfaEnabled: user.mfaEnabled,
          permissions: [], // Using role-based permissions for now
        });
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export default passport;
