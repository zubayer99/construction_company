import { PrismaClient } from '@prisma/client';
import app from './app.js';
import { config } from './config/config.js';
import { logger } from './utils/logger.js';
import fs from 'fs';

const prisma = new PrismaClient();

// Create necessary directories
const createDirectories = () => {
  const dirs = ['./logs', './uploads', './uploads/documents', './uploads/images'];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      logger.info(`Created directory: ${dir}`);
    }
  });
};

// Database connection check
const connectDatabase = async () => {
  try {
    await prisma.$connect();
    logger.info('✅ Connected to database successfully');
    
    // Test the connection
    await prisma.$queryRaw`SELECT 1`;
    logger.info('✅ Database query test successful');
  } catch (error) {
    logger.error('❌ Failed to connect to database:', error);
    process.exit(1);
  }
};

// Initialize default data
const initializeDefaultData = async () => {
  try {
    // TODO: Add permission system to schema
    // For now, using simple role-based access control
    // Check if admin user exists
    const adminUser = await prisma.user.findFirst({
      where: { role: 'SUPER_ADMIN' },
    });
    
    if (!adminUser) {
      logger.info('No admin user found. Please create one using the registration endpoint with role SUPER_ADMIN');
    }
    
  } catch (error) {
    logger.error('Failed to initialize default data:', error);
    // Don't exit on this error, just log it
  }
};

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);
  
  try {
    // Close database connection
    await prisma.$disconnect();
    logger.info('✅ Database connection closed');
    
    // Exit process
    process.exit(0);
  } catch (error) {
    logger.error('❌ Error during graceful shutdown:', error);
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  try {
    // Create directories
    createDirectories();
    
    // Connect to database
    await connectDatabase();
    
    // Initialize default data
    await initializeDefaultData();
      // Start HTTP server
    const server = app.listen(config.port, () => {
      logger.info(`🚀 Server running on port ${config.port}`);
      logger.info(`📖 Environment: ${config.env}`);
      logger.info(`🌐 API Base URL: http://localhost:${config.port}/api/v1`);
      logger.info(`❤️  Health Check: http://localhost:${config.port}/health`);
      logger.info(`🔧 Config port: ${config.port}`);
      logger.info(`🔧 Process PORT env: ${process.env.PORT}`);
    });
    
    // Handle server errors
    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`❌ Port ${config.port} is already in use`);
      } else {
        logger.error('❌ Server error:', error);
      }
      process.exit(1);
    });
    
    // Setup graceful shutdown handlers
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('❌ Uncaught Exception:', error);
      gracefulShutdown('uncaughtException');
    });
    
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
      gracefulShutdown('unhandledRejection');
    });
    
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the application
startServer();
