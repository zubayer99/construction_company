import { Router } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';

const router = Router();

// Registration validation
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('role')
    .isIn(['PROCUREMENT_OFFICER', 'SUPPLIER', 'AUDITOR', 'CITIZEN'])
    .withMessage('Invalid role specified'),
];

// Login validation
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// MFA validation
const mfaValidation = [
  body('token')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('MFA token must be 6 digits'),
];

// Password reset validation
const forgotPasswordValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
];

const resetPasswordValidation = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
];

// Authentication routes
router.post('/register', registerValidation, validateRequest, authController.register);
router.post('/login', loginValidation, validateRequest, authController.login);
router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshToken);

// Email verification
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/resend-verification', forgotPasswordValidation, validateRequest, authController.resendVerificationEmail);

// Password reset
router.post('/forgot-password', forgotPasswordValidation, validateRequest, authController.forgotPassword);
router.patch('/reset-password/:token', resetPasswordValidation, validateRequest, authController.resetPassword);

// Protected routes (require authentication)
router.use(authMiddleware);

// MFA routes
router.post('/setup-mfa', authController.setupMFA);
router.post('/verify-mfa', mfaValidation, validateRequest, authController.verifyMFA);
router.post('/disable-mfa', mfaValidation, validateRequest, authController.disableMFA);

// Profile management
router.get('/profile', authController.getProfile);
router.patch('/update-profile', authController.updateProfile);
router.patch('/change-password', authController.changePassword);

// Session management
router.get('/sessions', authController.getSessions);
router.delete('/sessions/:sessionId', authController.revokeSession);
router.delete('/sessions', authController.revokeAllSessions);

export default router;
