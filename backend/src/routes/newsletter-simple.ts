import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/v1/newsletter - Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
  try {
    const { email, firstName, lastName } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email }
    });

    if (existing) {
      if (existing.isActive) {
        return res.status(400).json({
          success: false,
          error: 'Email is already subscribed'
        });
      } else {
        // Reactivate subscription
        const subscriber = await prisma.newsletterSubscriber.update({
          where: { email },
          data: {
            firstName,
            lastName,
            isActive: true,
            subscribedAt: new Date()
          }
        });

        return res.json({
          success: true,
          data: subscriber,
          message: 'Subscription reactivated successfully'
        });
      }
    }

    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email,
        firstName,
        lastName,
        isActive: true,
        subscribedAt: new Date()
      }
    });

    return res.status(201).json({
      success: true,
      data: subscriber,
      message: 'Subscribed to newsletter successfully'
    });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to subscribe to newsletter'
    });
  }
});

// GET /api/v1/newsletter - Get all subscribers (admin only)
router.get('/', async (_req, res) => {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        subscribedAt: 'desc'
      }
    });

    res.json({
      success: true,
      data: subscribers
    });
  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch newsletter subscribers'
    });
  }
});

export default router;
