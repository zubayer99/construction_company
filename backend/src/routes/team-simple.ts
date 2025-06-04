import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all team members (public)
router.get('/', async (_req, res) => {
  try {
    const teamMembers = await prisma.teamMember.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });
    res.json({
      status: 'success',
      data: {
        teamMembers
      }
    });
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch team members'
    });
  }
});

export default router;
