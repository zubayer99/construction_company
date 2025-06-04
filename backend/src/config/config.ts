import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  
  database: {
    url: process.env.DATABASE_URL || '',
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || '',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshSecret: process.env.JWT_REFRESH_SECRET || '',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    passwordResetExpiresIn: process.env.JWT_PASSWORD_RESET_EXPIRES_IN || '10m', // Added password reset expiration
  },
  
  encryption: {
    key: process.env.ENCRYPTION_KEY || '',
    algorithm: 'aes-256-gcm',
  },
  
  mfa: {
    serviceName: process.env.MFA_SERVICE_NAME || 'Government Procurement System',
    issuer: process.env.MFA_ISSUER || 'Government',
  },
  
  email: {
    host: process.env.EMAIL_HOST || '',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASSWORD || '',
    from: process.env.EMAIL_FROM || '',
  },
  
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true,
  },
  
  security: {
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    sessionSecret: process.env.SESSION_SECRET || '',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
  },
  
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB
    allowedMimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png',
      'image/gif',
    ],
    uploadPath: process.env.UPLOAD_PATH || './uploads',
  },
  
  audit: {
    retentionDays: parseInt(process.env.AUDIT_RETENTION_DAYS || '2555', 10), // 7 years
  },
  
  notifications: {
    enableEmail: process.env.ENABLE_EMAIL_NOTIFICATIONS !== 'false',
    enableSMS: process.env.ENABLE_SMS_NOTIFICATIONS === 'true',
  },
  
  government: {
    publicationDelay: parseInt(process.env.TENDER_PUBLICATION_DELAY || '24', 10), // hours
    minBidTime: parseInt(process.env.MIN_BID_TIME || '168', 10), // hours (7 days)
    maxContractValue: parseInt(process.env.MAX_CONTRACT_VALUE || '10000000', 10), // $10M
  },
};

// Validate required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'ENCRYPTION_KEY',
  'SESSION_SECRET',
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}
