import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, restrictTo } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';
import { body, param } from 'express-validator';
import catchAsync from '../utils/catchAsync.js';

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const serviceValidation = [
  body('title').notEmpty().withMessage('Service title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('shortDesc').optional().isString(),
  body('imageUrl').optional().isURL().withMessage('Image URL must be valid'),
  body('iconName').optional().isString(),
  body('features').optional().isArray(),
  body('price').optional().isDecimal().withMessage('Price must be a valid number'),
  body('currency').optional().isString(),
  body('sortOrder').optional().isInt().withMessage('Sort order must be an integer'),
];

// Get all services (public)
router.get('/', catchAsync(async (_req, res) => {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: [
      { sortOrder: 'asc' },
      { createdAt: 'desc' }
    ],
    include: {
      projects: {
        where: { isActive: true },
        take: 3,
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  res.json({
    status: 'success',
    results: services.length,
    data: {
      services
    }
  });
}));

// Get service by ID (public)
router.get('/:id', catchAsync(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      status: 'error',
      message: 'Service ID is required'
    });
  }

  const service = await prisma.service.findFirst({
    where: { 
      id,
      isActive: true 
    },
    include: {
      projects: {
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!service) {
    return res.status(404).json({
      status: 'error',
      message: 'Service not found'
    });
  }

  return res.json({
    status: 'success',
    data: {
      service
    }
  });
}));

// Create service (admin only)
router.post('/',
  authMiddleware,
  restrictTo('SUPER_ADMIN', 'ADMIN'),
  serviceValidation,
  validateRequest,
  catchAsync(async (req, res) => {
    const {
      title,
      description,
      shortDesc,
      imageUrl,
      iconName,
      features,
      price,
      currency,
      sortOrder
    } = req.body;

    const service = await prisma.service.create({
      data: {
        title,
        description,
        shortDesc,
        imageUrl,
        iconName,
        features,
        price: price ? parseFloat(price) : null,
        currency: currency || 'BDT',
        sortOrder: sortOrder || 0
      }
    });

    res.status(201).json({
      status: 'success',
      data: {
        service
      }
    });
  })
);

// Update service (admin only)
router.put('/:id',
  authMiddleware,
  restrictTo('SUPER_ADMIN', 'ADMIN'),
  param('id').isString().withMessage('Service ID is required'),
  serviceValidation,
  validateRequest,  catchAsync(async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: 'error',
        message: 'Service ID is required'
      });
    }

    const {
      title,
      description,
      shortDesc,
      imageUrl,
      iconName,
      features,
      price,
      currency,
      sortOrder,
      isActive
    } = req.body;

    const service = await prisma.service.update({
      where: { id },
      data: {
        title,
        description,
        shortDesc,
        imageUrl,
        iconName,
        features,
        price: price ? parseFloat(price) : null,
        currency: currency || 'BDT',
        sortOrder: sortOrder || 0,
        isActive: isActive !== undefined ? isActive : undefined      }
    });

    return res.json({
      status: 'success',
      data: {
        service
      }
    });
  })
);

// Delete service (admin only)
router.delete('/:id',
  authMiddleware,
  restrictTo('SUPER_ADMIN', 'ADMIN'),
  param('id').isString().withMessage('Service ID is required'),
  validateRequest,  catchAsync(async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: 'error',
        message: 'Service ID is required'
      });
    }    await prisma.service.update({
      where: { id },
      data: { isActive: false }
    });

    return res.status(204).json({
      status: 'success',
      data: null
    });
  })
);

export default router;
