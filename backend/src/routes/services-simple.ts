import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all services (public)
router.get('/', async (_req, res) => {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });
    res.json({
      status: 'success',
      data: {
        services
      }
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch services'
    });
  }
});

export default router;
