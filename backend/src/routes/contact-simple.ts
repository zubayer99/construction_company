import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/v1/contact - Submit contact inquiry
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, company, subject, message, serviceInterest } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, subject, and message are required'
      });
    }

    const inquiry = await prisma.contactInquiry.create({
      data: {
        name,
        email,
        phone,
        company,
        subject,
        message,
        serviceInterest,
        status: 'NEW'
      }
    });

    return res.status(201).json({
      success: true,
      data: inquiry,
      message: 'Contact inquiry submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting contact inquiry:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to submit contact inquiry'
    });
  }
});

// GET /api/v1/contact - Get all contact inquiries (admin only)
router.get('/', async (_req, res) => {
  try {
    const inquiries = await prisma.contactInquiry.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      data: inquiries
    });
  } catch (error) {
    console.error('Error fetching contact inquiries:', error);
        res.status(500).json({
      success: false,
      error: 'Failed to fetch contact inquiries'
    });
  }
});

export default router;
