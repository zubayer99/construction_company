import express, { Request, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Validation rules for newsletter subscription
const subscriptionValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('firstName').optional(),
  body('lastName').optional(),
];

// Validation rules for bulk email
const bulkEmailValidation = [
  body('subject').notEmpty().withMessage('Subject is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('htmlContent').optional(),
];

// POST /api/v1/newsletter/subscribe - Subscribe to newsletter (public)
router.post('/subscribe', subscriptionValidation, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const { email, firstName, lastName } = req.body;

    // Check if already subscribed
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return res.status(409).json({
          success: false,
          error: 'Email is already subscribed to our newsletter',
        });
      } else {
        // Reactivate subscription
        const updatedSubscriber = await prisma.newsletterSubscriber.update({
          where: { email },
          data: {
            isActive: true,
            firstName,
            lastName,
          },
        });

        return res.status(200).json({
          success: true,
          data: updatedSubscriber,
          message: 'Newsletter subscription reactivated successfully!',
        });
      }
    }

    // Create new subscription
    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email,
        firstName,
        lastName,
        isActive: true,
      },
    });

    return res.status(201).json({
      success: true,
      data: subscriber,
      message: 'Successfully subscribed to our newsletter!',
    });
  } catch (error) {
    console.error('Error creating newsletter subscription:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to subscribe to newsletter',
    });
  }
});

// POST /api/v1/newsletter/unsubscribe - Unsubscribe from newsletter (public)
router.post('/unsubscribe', [
  body('email').isEmail().withMessage('Valid email is required'),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const { email } = req.body;

    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        error: 'Email not found in our newsletter subscribers',
      });
    }

    if (!subscriber.isActive) {
      return res.status(409).json({
        success: false,
        error: 'Email is already unsubscribed',
      });
    }

    const updatedSubscriber = await prisma.newsletterSubscriber.update({
      where: { email },
      data: { isActive: false },
    });

    return res.json({
      success: true,
      data: updatedSubscriber,
      message: 'Successfully unsubscribed from newsletter',
    });
  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to unsubscribe from newsletter',
    });
  }
});

// GET /api/v1/newsletter/admin/subscribers - Get all subscribers (admin only)
router.get('/admin/subscribers', requireAdmin, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('active').optional().isBoolean().withMessage('Active must be a boolean'),
  query('search').optional(),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const active = req.query.active === 'true' ? true : req.query.active === 'false' ? false : undefined;
    const search = req.query.search as string;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (active !== undefined) {
      where.isActive = active;
    }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [subscribers, total] = await Promise.all([
      prisma.newsletterSubscriber.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.newsletterSubscriber.count({ where }),
    ]);

    return res.json({
      success: true,
      data: {
        subscribers,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch newsletter subscribers',
    });
  }
});

// DELETE /api/v1/newsletter/admin/subscribers/:id - Delete subscriber (admin only)
router.delete('/admin/subscribers/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'ID parameter is required',
      });
    }

    await prisma.newsletterSubscriber.delete({
      where: { id },
    });

    return res.json({
      success: true,
      message: 'Newsletter subscriber deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting newsletter subscriber:', error);
    if ((error as any).code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Newsletter subscriber not found',
      });
    }
    return res.status(500).json({
      success: false,
      error: 'Failed to delete newsletter subscriber',
    });
  }
});

// GET /api/v1/newsletter/admin/stats - Get newsletter statistics (admin only)
router.get('/admin/stats', requireAdmin, async (_req: Request, res: Response) => {
  try {
    const [
      totalSubscribers,
      activeSubscribers,
      inactiveSubscribers,
      todaySubscribers,
      weekSubscribers,
      monthSubscribers,
    ] = await Promise.all([
      prisma.newsletterSubscriber.count(),
      prisma.newsletterSubscriber.count({ where: { isActive: true } }),
      prisma.newsletterSubscriber.count({ where: { isActive: false } }),
      prisma.newsletterSubscriber.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      prisma.newsletterSubscriber.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.newsletterSubscriber.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    return res.json({
      success: true,
      data: {
        total: totalSubscribers,
        active: activeSubscribers,
        inactive: inactiveSubscribers,
        byPeriod: {
          today: todaySubscribers,
          week: weekSubscribers,
          month: monthSubscribers,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching newsletter stats:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch newsletter statistics',
    });
  }
});

// POST /api/v1/newsletter/admin/send-bulk - Send bulk email (admin only)
router.post('/admin/send-bulk', requireAdmin, bulkEmailValidation, [
  body('targetType').isIn(['all', 'active', 'inactive']).withMessage('Invalid target type'),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const { subject, content, htmlContent, targetType } = req.body;

    // Build where clause based on target type
    const where: any = {};
    if (targetType === 'active') {
      where.isActive = true;
    } else if (targetType === 'inactive') {
      where.isActive = false;
    }

    const subscribers = await prisma.newsletterSubscriber.findMany({
      where,
      select: { email: true, firstName: true, lastName: true },
    });

    // Here you would integrate with your email service
    // For now, we'll just return success with the count
    return res.json({
      success: true,
      data: {
        subject,
        content,
        htmlContent,
        targetType,
        recipientCount: subscribers.length,
      },
      message: `Bulk email queued for ${subscribers.length} recipients`,
    });
  } catch (error) {
    console.error('Error sending bulk email:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to send bulk email',
    });
  }
});

// GET /api/v1/newsletter/admin/export - Export subscribers (admin only)
router.get('/admin/export', requireAdmin, [
  query('format').optional().isIn(['csv', 'xlsx']).withMessage('Format must be csv or xlsx'),
  query('active').optional().isBoolean().withMessage('Active must be a boolean'),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const active = req.query.active === 'true' ? true : req.query.active === 'false' ? false : undefined;

    // Build where clause
    const where: any = {};
    if (active !== undefined) {
      where.isActive = active;
    }

    const subscribers = await prisma.newsletterSubscriber.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return res.json({
      success: true,
      data: subscribers,
      message: 'Newsletter subscribers exported successfully',
    });
  } catch (error) {
    console.error('Error exporting newsletter subscribers:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to export newsletter subscribers',
    });
  }
});

export default router;
