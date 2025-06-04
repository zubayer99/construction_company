import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all testimonials (public)
router.get('/', async (_req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });
    res.json({
      status: 'success',
      data: {
        testimonials
      }
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch testimonials'
    });
  }
});

export default router;
