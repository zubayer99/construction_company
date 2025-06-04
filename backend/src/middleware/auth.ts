import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { config } from '../config/config.js';
import { AppError } from './errorHandler.js';

const prisma = new PrismaClient();

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    organizationId?: string;
    isActive: boolean;
    isMfaEnabled: boolean;
    permissions: string[];
  };
}

export const authMiddleware = async (
  req: Request,
  _res: Response, // Prefixed unused res
  next: NextFunction
) => {
  try {
    const authenticatedReq = req as AuthenticatedRequest;
    // 1) Getting token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    // 2) Verification token
    const decoded = jwt.verify(token, config.jwt.secret) as any;

    // 3) Check if user still exists
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        organization: true,
      },
    });

    if (!currentUser) {
      return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }

    // 4) Check if user is active
    if (!currentUser.isActive) {
      return next(new AppError('Your account has been deactivated. Please contact support.', 401));
    }

    // 5) For now, we'll skip password change check since passwordChangedAt field doesn't exist in schema
    // 6) Set user data on request
    const userForRequest: AuthenticatedRequest['user'] = {
      id: currentUser.id,
      email: currentUser.email,
      role: currentUser.role as string,
      isActive: currentUser.isActive,
      isMfaEnabled: currentUser.mfaEnabled,
      permissions: [], // For now, empty permissions - role-based access control
    };
    if (currentUser.organizationId) {
      userForRequest.organizationId = currentUser.organizationId;
    }
    authenticatedReq.user = userForRequest;

    next();
  } catch (error) {
    return next(new AppError('Invalid token. Please log in again!', 401));
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => { // Prefixed unused res
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user || !roles.includes(authReq.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

export const requirePermission = (permission: string) => {
  return (req: Request, _res: Response, next: NextFunction) => { // Prefixed unused res
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user || !authReq.user.permissions.includes(permission)) {
      return next(new AppError('You do not have the required permission to perform this action', 403));
    }
    next();
  };
};

export const requireOrganization = (req: Request, _res: Response, next: NextFunction) => {
  const authReq = req as AuthenticatedRequest;
  if (!authReq.user || !authReq.user.organizationId) {
    return next(new AppError('You must be associated with an organization to perform this action', 403));
  }
  next();
};

export const requireMFA = (req: Request, _res: Response, next: NextFunction) => {
  const authReq = req as AuthenticatedRequest;
  if (!authReq.user || !authReq.user.isMfaEnabled) {
    return next(new AppError('Multi-factor authentication is required for this action', 403));
  }
  next();
};

export const requireAdmin = restrictTo('admin');
