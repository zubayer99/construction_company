import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, restrictTo } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';
import { body } from 'express-validator';
import catchAsync from '../utils/catchAsync.js';

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const companyInfoValidation = [
  body('name').notEmpty().withMessage('Company name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('state').notEmpty().withMessage('State is required'),
  body('zipCode').notEmpty().withMessage('Zip code is required'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('email').isEmail().withMessage('Valid email is required'),
];

// Get company info (public)
router.get('/', catchAsync(async (_req, res) => {
  const companyInfo = await prisma.companyInfo.findFirst({
    where: { isActive: true }
  });

  res.json({
    status: 'success',
    data: {
      company: companyInfo
    }
  });
}));

// Create/Update company info (admin only)
router.post('/', 
  authMiddleware,
  restrictTo('SUPER_ADMIN', 'ADMIN'),
  companyInfoValidation,
  validateRequest,
  catchAsync(async (req, res) => {
    const {
      name,
      tagline,
      description,
      mission,
      vision,
      founded,
      address,
      city,
      state,
      zipCode,
      country,
      phone,
      email,
      website,
      logoUrl,
      bannerUrl,
      socialMedia,
      businessHours
    } = req.body;

    // Check if company info already exists
    const existingCompany = await prisma.companyInfo.findFirst({
      where: { isActive: true }
    });

    let companyInfo;

    if (existingCompany) {
      // Update existing
      companyInfo = await prisma.companyInfo.update({
        where: { id: existingCompany.id },
        data: {
          name,
          tagline,
          description,
          mission,
          vision,
          founded: founded ? new Date(founded) : null,
          address,
          city,
          state,
          zipCode,
          country,
          phone,
          email,
          website,
          logoUrl,
          bannerUrl,
          socialMedia,
          businessHours
        }
      });
    } else {
      // Create new
      companyInfo = await prisma.companyInfo.create({
        data: {
          name,
          tagline,
          description,
          mission,
          vision,
          founded: founded ? new Date(founded) : null,
          address,
          city,
          state,
          zipCode,
          country: country || 'Bangladesh',
          phone,
          email,
          website,
          logoUrl,
          bannerUrl,
          socialMedia,
          businessHours
        }
      });
    }

    res.status(existingCompany ? 200 : 201).json({
      status: 'success',
      data: {
        company: companyInfo
      }
    });
  })
);

export default router;
