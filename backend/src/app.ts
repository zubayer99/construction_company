import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { config } from './config/config.js';
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authMiddleware } from './middleware/auth.js';
import { auditMiddleware } from './middleware/audit.js';
import passport from './config/passport.js';

// Routes
import authRoutes from './routes/auth.js';
import tenderRoutes from './routes/tenders.js';
import bidRoutes from './routes/bids.js';
import contractRoutes from './routes/contracts.js';
import userRoutes from './routes/users.js';
import organizationRoutes from './routes/organizations.js';
import notificationRoutes from './routes/notifications.js';
import adminRoutes from './routes/admin.js';
import publicRoutes from './routes/public.js';

// Business Routes
import companyRoutes from './routes/company-simple.js';
import servicesRoutes from './routes/services-simple.js';
import projectsRoutes from './routes/projects-simple.js';
import teamRoutes from './routes/team-simple.js';
import testimonialsRoutes from './routes/testimonials-simple.js';
import blogRoutes from './routes/blog-simple.js';
import contactRoutes from './routes/contact-simple.js';
import newsletterRoutes from './routes/newsletter-simple.js';

const app = express();

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.security.rateLimitWindowMs,
  max: config.security.rateLimitMaxRequests,
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());

// Passport middleware
app.use(passport.initialize());

// Audit middleware (log all API calls)
app.use('/api', auditMiddleware);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: config.env,
  });
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/public', publicRoutes);
app.use('/api/v1/tenders', authMiddleware, tenderRoutes);
app.use('/api/v1/bids', authMiddleware, bidRoutes);
app.use('/api/v1/contracts', authMiddleware, contractRoutes);
app.use('/api/v1/users', authMiddleware, userRoutes);
app.use('/api/v1/organizations', authMiddleware, organizationRoutes);
app.use('/api/v1/notifications', authMiddleware, notificationRoutes);
app.use('/api/v1/admin', authMiddleware, adminRoutes);

// Business API routes
app.use('/api/v1/company', companyRoutes);
app.use('/api/v1/services', servicesRoutes);
app.use('/api/v1/projects', projectsRoutes);
app.use('/api/v1/team', teamRoutes);
app.use('/api/v1/testimonials', testimonialsRoutes);
app.use('/api/v1/blog', blogRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/newsletter', newsletterRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use(errorHandler);

// Graceful shutdown handling
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Unhandled promise rejection handler
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Uncaught exception handler
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

export default app;
