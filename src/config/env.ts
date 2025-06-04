// Environment configuration and constants
export const ENV = {
  NODE_ENV: import.meta.env.MODE || 'development',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1',
  APP_NAME: 'Al Fatah Enterprise',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  CONTACT_EMAIL: import.meta.env.VITE_CONTACT_EMAIL || 'info@alfatahenterprise.com',
  CONTACT_PHONE: import.meta.env.VITE_CONTACT_PHONE || '+971-4-123-4567',
  COMPANY_ADDRESS: import.meta.env.VITE_COMPANY_ADDRESS || 'Dubai, United Arab Emirates',
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_ERROR_REPORTING: import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true',
  LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL || (import.meta.env.MODE === 'production' ? 'error' : 'debug'),
} as const;

export const isProduction = ENV.NODE_ENV === 'production';
export const isDevelopment = ENV.NODE_ENV === 'development';

// Feature flags
export const FEATURES = {
  ENABLE_AUTH: import.meta.env.VITE_ENABLE_AUTH !== 'false',
  ENABLE_NEWSLETTER: import.meta.env.VITE_ENABLE_NEWSLETTER !== 'false',
  ENABLE_BLOG: import.meta.env.VITE_ENABLE_BLOG !== 'false',
  ENABLE_TESTIMONIALS: import.meta.env.VITE_ENABLE_TESTIMONIALS !== 'false',
  ENABLE_PROJECTS_GALLERY: import.meta.env.VITE_ENABLE_PROJECTS_GALLERY !== 'false',
} as const;

// API Configuration
export const API_CONFIG = {
  BASE_URL: ENV.API_BASE_URL,
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  RETRY_ATTEMPTS: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS || '3'),
  RETRY_DELAY: parseInt(import.meta.env.VITE_API_RETRY_DELAY || '1000'),
} as const;

// UI Configuration
export const UI_CONFIG = {
  TOAST_DURATION: 4000,
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 300,
  PAGINATION_SIZE: 12,
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
} as const;

// Business Information
export const BUSINESS_INFO = {
  NAME: ENV.APP_NAME,
  TAGLINE: 'Industrial Equipment & Solutions Provider',
  DESCRIPTION: 'Leading industrial equipment supplier and solutions provider in UAE. We offer comprehensive industrial distribution, supply chain management, and technical consulting services.',
  EMAIL: ENV.CONTACT_EMAIL,
  PHONE: ENV.CONTACT_PHONE,
  ADDRESS: ENV.COMPANY_ADDRESS,
  BUSINESS_HOURS: 'Sunday - Thursday: 8:00 AM - 6:00 PM',
  ESTABLISHED_YEAR: '2010',
  WEBSITE: 'https://alfatahenterprise.com',
  SOCIAL_MEDIA: {
    LINKEDIN: import.meta.env.VITE_LINKEDIN_URL || '',
    TWITTER: import.meta.env.VITE_TWITTER_URL || '',
    FACEBOOK: import.meta.env.VITE_FACEBOOK_URL || '',
    INSTAGRAM: import.meta.env.VITE_INSTAGRAM_URL || '',
  },
} as const;

// Validation
const validateConfig = () => {
  const requiredEnvVars = [
    'VITE_API_BASE_URL',
  ];

  const missingVars = requiredEnvVars.filter(
    varName => !import.meta.env[varName] && ENV.NODE_ENV === 'production'
  );

  if (missingVars.length > 0) {
    console.warn(
      `Missing required environment variables in production: ${missingVars.join(', ')}`
    );
  }
};

// Run validation
if (isProduction) {
  validateConfig();
}

export default ENV;
