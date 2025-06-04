import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, restrictTo } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Validation rules for testimonial
const testimonialValidation = [
  body('clientName').notEmpty().withMessage('Client name is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('clientCompany').optional(),
  body('position').optional(),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  body('displayOrder').optional().isInt({ min: 0 }).withMessage('Display order must be a non-negative integer'),
];

// GET /api/v1/testimonials - Get all testimonials (public)
router.get('/', async (_req: Request, res: Response) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return res.json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch testimonials',
    });
  }
});

// GET /api/v1/testimonials/:id - Get single testimonial (public)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'ID parameter is required',
      });
    }

    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        error: 'Testimonial not found',
      });
    }

    return res.json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch testimonial',
    });
  }
});

// POST /api/v1/testimonials - Create new testimonial (admin only)
router.post('/', authMiddleware, restrictTo('SUPER_ADMIN', 'ADMIN'), testimonialValidation, async (req: Request, res: Response) => {
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
      clientName,
      content,
      rating,
      clientCompany,
      position,
      isActive = true,
      displayOrder = 0,
    } = req.body;    const testimonial = await prisma.testimonial.create({
      data: {
        name: clientName,
        clientName,
        content,
        rating,
        clientCompany,
        position,
        isActive,
        displayOrder,
      },
    });

    return res.status(201).json({
      success: true,
      data: testimonial,
      message: 'Testimonial created successfully',
    });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create testimonial',
    });
  }
});

// PUT /api/v1/testimonials/:id - Update testimonial (admin only)
router.put('/:id', authMiddleware, restrictTo('SUPER_ADMIN', 'ADMIN'), testimonialValidation, async (req: Request, res: Response) => {
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
    const {
      clientName,
      content,
      rating,
      clientCompany,
      position,
      isActive,
      displayOrder,
    } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'ID parameter is required',
      });
    }

    const updatedTestimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        clientName,
        content,
        rating,
        clientCompany,
        position,
        isActive,
        displayOrder,
      },
    });

    return res.json({
      success: true,
      data: updatedTestimonial,
      message: 'Testimonial updated successfully',
    });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    if ((error as any).code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Testimonial not found',
      });
    }
    return res.status(500).json({
      success: false,
      error: 'Failed to update testimonial',
    });
  }
});

// DELETE /api/v1/testimonials/:id - Delete testimonial (admin only)
router.delete('/:id', authMiddleware, restrictTo('SUPER_ADMIN', 'ADMIN'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'ID parameter is required',
      });
    }

    await prisma.testimonial.delete({
      where: { id },
    });

    return res.json({
      success: true,
      message: 'Testimonial deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    if ((error as any).code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Testimonial not found',
      });
    }
    return res.status(500).json({
      success: false,
      error: 'Failed to delete testimonial',
    });
  }
});

// GET /api/v1/testimonials/admin/all - Get all testimonials including inactive (admin only)
router.get('/admin/all', authMiddleware, restrictTo('SUPER_ADMIN', 'ADMIN'), async (_req: Request, res: Response) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return res.json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    console.error('Error fetching all testimonials:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch testimonials',
    });
  }
});

// GET /api/v1/testimonials/stats - Get testimonial statistics
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const [totalTestimonials, activeTestimonials, averageRating] = await Promise.all([
      prisma.testimonial.count(),
      prisma.testimonial.count({ where: { isActive: true } }),
      prisma.testimonial.aggregate({
        _avg: { rating: true },
        where: { isActive: true },
      }),
    ]);

    return res.json({
      success: true,
      data: {
        total: totalTestimonials,
        active: activeTestimonials,
        averageRating: averageRating._avg.rating || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching testimonial stats:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch testimonial statistics',
    });
  }
});

export default router;
