import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';
import { AuthenticatedRequest } from '../types/index.js';

const prisma = new PrismaClient();

export const auditMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Skip audit for health checks and static files
  if (req.path === '/health' || req.path.startsWith('/static')) {
    return next();
  }

  const startTime = Date.now();
  
  // Store original res.json to capture response
  const originalJson = res.json;

  res.json = function (data: any) {
    return originalJson.call(this, data);
  };

  // Continue with request
  res.on('finish', async () => {
    const endTime = Date.now();
    const duration = endTime - startTime;
    const authenticatedRequest = req as AuthenticatedRequest;

    const auditLogData: any = {
      action: `${req.method} ${req.path}`,
      tableName: req.path.split('/')[3] || 'unknown', // Extract resource from /api/v1/resource
      recordId: req.params.id || 'unknown',
      ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      timestamp: new Date(startTime),
      newValues: {
        method: req.method,
        path: req.path,
        query: req.query,
        params: req.params,
        body: req.method !== 'GET' ? sanitizeBody(req.body) : undefined,
        statusCode: res.statusCode,
        duration,
        contentLength: res.get('content-length'),
      },
    };

    if (authenticatedRequest.user && authenticatedRequest.user.id) {
      auditLogData.userId = authenticatedRequest.user.id;
    }

    try {
      // Create audit log entry
      await prisma.auditLog.create({
        data: auditLogData,
      });

      // Log to application logs as well
      logger.info('API Request', {
        userId: authenticatedRequest.user?.id,
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
      });
    } catch (error) {
      // Don't fail the request if audit logging fails
      logger.error('Failed to create audit log:', error);
    }
  });

  next();
};

// Sanitize request body to remove sensitive information
function sanitizeBody(body: any): any {
  if (!body || typeof body !== 'object') {
    return body;
  }

  const sensitiveFields = ['password', 'token', 'secret', 'key', 'auth'];
  const sanitized = { ...body };

  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  }

  return sanitized;
}
