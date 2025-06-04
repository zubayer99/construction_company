import winston from 'winston';
import { config } from '../config/config.js';

const { combine, timestamp, errors, json, colorize, simple } = winston.format;

// Create logs directory if it doesn't exist
const logsDir = './logs';

const logger = winston.createLogger({
  level: config.env === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    errors({ stack: true }),
    json()
  ),
  defaultMeta: {
    service: 'government-procurement-api',
    environment: config.env,
  },
  transports: [
    // Write to all logs with level 'info' and below to 'combined.log'
    new winston.transports.File({
      filename: `${logsDir}/error.log`,
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: `${logsDir}/combined.log`,
      maxsize: 10485760, // 10MB
      maxFiles: 10,
    }),
  ],
});

// If we're not in production, log to the console with a simple format
if (config.env !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: combine(
        colorize(),
        simple(),
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
          return `${timestamp} [${level}]: ${message} ${
            Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
          }`;
        })
      ),
    })
  );
}

// Create a stream object for Morgan HTTP request logging
export const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

export { logger };
