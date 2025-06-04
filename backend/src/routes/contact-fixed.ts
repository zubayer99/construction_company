import express, { Request, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Validation rules for contact inquiry
const contactValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').optional(),
  body('company').optional(),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').notEmpty().withMessage('Message is required'),
  body('serviceInterest').optional(),
];

// Validation rules for inquiry status update
const statusUpdateValidation = [
  body('status').isIn(['NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).withMessage('Invalid status'),
];

// POST /api/v1/contact - Submit contact inquiry (public)
router.post('/', contactValidation, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const {
      name,
      email,
      phone,
      company,
      subject,
      message,
      serviceInterest,
    } = req.body;

    const inquiry = await prisma.contactInquiry.create({
      data: {
        name,
        email,
        phone,
        company,
        subject,
        message,
        serviceInterest,
        status: 'NEW',
      },
    });

    return res.status(201).json({
      success: true,
      data: inquiry,
      message: 'Your inquiry has been submitted successfully. We will get back to you soon!',
    });
  } catch (error) {
    console.error('Error creating contact inquiry:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to submit inquiry',
    });
  }
});

// GET /api/v1/contact/admin/inquiries - Get all contact inquiries (admin only)
router.get('/admin/inquiries', requireAdmin, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).withMessage('Invalid status'),
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
    const status = req.query.status as string;
    const search = req.query.search as string;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [inquiries, total] = await Promise.all([
      prisma.contactInquiry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.contactInquiry.count({ where }),
    ]);

    return res.json({
      success: true,
      data: {
        inquiries,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching contact inquiries:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch contact inquiries',
    });
  }
});

// GET /api/v1/contact/admin/inquiries/:id - Get single contact inquiry (admin only)
router.get('/admin/inquiries/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'ID parameter is required',
      });
    }

    const inquiry = await prisma.contactInquiry.findUnique({
      where: { id },
    });

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        error: 'Contact inquiry not found',
      });
    }

    return res.json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    console.error('Error fetching contact inquiry:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch contact inquiry',
    });
  }
});

// PUT /api/v1/contact/admin/inquiries/:id/status - Update inquiry status (admin only)
router.put('/admin/inquiries/:id/status', requireAdmin, statusUpdateValidation, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'ID parameter is required',
      });
    }

    const updatedInquiry = await prisma.contactInquiry.update({
      where: { id },
      data: { status },
    });

    return res.json({
      success: true,
      data: updatedInquiry,
      message: 'Inquiry status updated successfully',
    });
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    if ((error as any).code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Contact inquiry not found',
      });
    }
    return res.status(500).json({
      success: false,
      error: 'Failed to update inquiry status',
    });
  }
});

// DELETE /api/v1/contact/admin/inquiries/:id - Delete contact inquiry (admin only)
router.delete('/admin/inquiries/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'ID parameter is required',
      });
    }

    await prisma.contactInquiry.delete({
      where: { id },
    });

    return res.json({
      success: true,
      message: 'Contact inquiry deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting contact inquiry:', error);
    if ((error as any).code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Contact inquiry not found',
      });
    }
    return res.status(500).json({
      success: false,
      error: 'Failed to delete contact inquiry',
    });
  }
});

// GET /api/v1/contact/admin/stats - Get contact inquiry statistics (admin only)
router.get('/admin/stats', requireAdmin, async (_req: Request, res: Response) => {
  try {
    const [
      totalInquiries,
      newInquiries,
      inProgressInquiries,
      resolvedInquiries,
      closedInquiries,
      todayInquiries,
      weekInquiries,
      monthInquiries,
    ] = await Promise.all([
      prisma.contactInquiry.count(),
      prisma.contactInquiry.count({ where: { status: 'NEW' } }),
      prisma.contactInquiry.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.contactInquiry.count({ where: { status: 'RESOLVED' } }),
      prisma.contactInquiry.count({ where: { status: 'CLOSED' } }),
      prisma.contactInquiry.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      prisma.contactInquiry.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.contactInquiry.count({
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
        total: totalInquiries,
        byStatus: {
          new: newInquiries,
          inProgress: inProgressInquiries,
          resolved: resolvedInquiries,
          closed: closedInquiries,
        },
        byPeriod: {
          today: todayInquiries,
          week: weekInquiries,
          month: monthInquiries,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching contact inquiry stats:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch contact inquiry statistics',
    });
  }
});

// GET /api/v1/contact/admin/export - Export contact inquiries (admin only)
router.get('/admin/export', requireAdmin, [
  query('format').optional().isIn(['csv', 'xlsx']).withMessage('Format must be csv or xlsx'),
  query('status').optional().isIn(['NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).withMessage('Invalid status'),
  query('startDate').optional().isISO8601().withMessage('Start date must be valid'),
  query('endDate').optional().isISO8601().withMessage('End date must be valid'),
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

    const status = req.query.status as string;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    // Build where clause
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    const inquiries = await prisma.contactInquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return res.json({
      success: true,
      data: inquiries,
      message: 'Contact inquiries exported successfully',
    });
  } catch (error) {
    console.error('Error exporting contact inquiries:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to export contact inquiries',
    });
  }
});

export default router;
