import { Request } from 'express';

// Extend Express Request to include user
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

// API Error class
export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// JWT Payload interface
export interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

// Enum types matching Prisma schema
export enum UserRole {
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  PROCUREMENT_OFFICER = 'PROCUREMENT_OFFICER',
  SUPPLIER = 'SUPPLIER',
  EVALUATOR = 'EVALUATOR',
  AUDITOR = 'AUDITOR',
  CITIZEN = 'CITIZEN'
}

export enum OrganizationType {
  GOVERNMENT = 'GOVERNMENT',
  PRIVATE = 'PRIVATE',
  PUBLIC_PRIVATE = 'PUBLIC_PRIVATE',
  INTERNATIONAL = 'INTERNATIONAL'
}

export enum TenderStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  SUBMISSION_OPEN = 'SUBMISSION_OPEN',
  SUBMISSION_CLOSED = 'SUBMISSION_CLOSED',
  EVALUATION = 'EVALUATION',
  AWARDED = 'AWARDED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export enum BidStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  EVALUATED = 'EVALUATED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN'
}

export enum ContractStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  COMPLETED = 'COMPLETED',
  TERMINATED = 'TERMINATED'
}

export enum VerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED'
}

export enum NotificationType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  IN_APP = 'IN_APP',
  PUSH = 'PUSH'
}

export enum NotificationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}
