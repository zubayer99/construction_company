import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get company info (public)
router.get('/', async (_req, res) => {
  try {
    const companyInfo = await prisma.companyInfo.findFirst();
    res.json({
      status: 'success',
      data: {
        company: companyInfo
      }
    });
  } catch (error) {
    console.error('Error fetching company info:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch company info'
    });
  }
});

export default router;
