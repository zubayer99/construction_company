import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all projects (public)
router.get('/', async (_req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });
    res.json({
      status: 'success',
      data: {
        projects
      }
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch projects'
    });
  }
});

export default router;
