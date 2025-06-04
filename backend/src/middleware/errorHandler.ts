import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export class AppError extends Error implements ApiError {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const handlePrismaError = (error: PrismaClientKnownRequestError): ApiError => {
  let message = 'Database error';
  let statusCode = 500;

  switch (error.code) {
    case 'P2002':
      message = 'Duplicate field value entered';
      statusCode = 400;
      break;
    case 'P2014':
      message = 'Invalid ID';
      statusCode = 400;
      break;
    case 'P2003':
      message = 'Invalid input data';
      statusCode = 400;
      break;
    case 'P2025':
      message = 'Record not found';
      statusCode = 404;
      break;
    default:
      message = 'Database operation failed';
      statusCode = 500;
  }

  return new AppError(message, statusCode);
};

const handleJWTError = (): ApiError =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = (): ApiError =>
  new AppError('Your token has expired! Please log in again.', 401);

const sendErrorDev = (err: ApiError, req: Request, res: Response): void => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode || 500).json({
      status: 'error',
      error: err,
      message: err.message,
      stack: err.stack,
    });
    return;
  }
  
  // Default response for non-API routes
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message,
  });
};

const sendErrorProd = (err: ApiError, req: Request, res: Response): void => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      res.status(err.statusCode || 500).json({
        status: 'error',
        message: err.message,
      });
      return;
    }
    
    // Programming or other unknown error: don't leak error details
    logger.error('ERROR 💥', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
    return;
  }
  
  // Default response for non-API routes
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
  });
};

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let error = { ...err } as ApiError;
  error.message = err.message;

  // Log error
  logger.error(`${req.method} ${req.path} - ${err.message}`, {
    error: err.stack,
    userId: (req as any).user?.id,
    ip: req.ip,
  });

  // Prisma errors
  if (err instanceof PrismaClientKnownRequestError) {
    error = handlePrismaError(err);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = handleJWTError();
  }
  if (err.name === 'TokenExpiredError') {
    error = handleJWTExpiredError();
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    error = new AppError('Invalid input data', 400);
  }

  // Mongoose cast errors
  if (err.name === 'CastError') {
    error = new AppError('Invalid data format', 400);
  }

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, req, res);
  } else {
    sendErrorProd(error, req, res);
  }
};

export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
