import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, restrictTo } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';
import { body, param } from 'express-validator';
import catchAsync from '../utils/catchAsync.js';

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const projectValidation = [
  body('title').notEmpty().withMessage('Project title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('shortDesc').optional().isString(),
  body('serviceId').optional().isString(),
  body('client').optional().isString(),
  body('startDate').optional().isISO8601().withMessage('Start date must be valid'),
  body('endDate').optional().isISO8601().withMessage('End date must be valid'),
  body('status').optional().isIn(['PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED']),
  body('imageUrl').optional().isURL().withMessage('Image URL must be valid'),
  body('gallery').optional().isArray(),
  body('technologies').optional().isArray(),
  body('projectUrl').optional().isURL().withMessage('Project URL must be valid'),
  body('githubUrl').optional().isURL().withMessage('GitHub URL must be valid'),
  body('isFeatured').optional().isBoolean(),
  body('sortOrder').optional().isInt().withMessage('Sort order must be an integer'),
];

// Get all projects (public)
router.get('/', catchAsync(async (req, res) => {
  const { serviceId, featured, limit } = req.query;
  
  const where: any = { isActive: true };
  if (serviceId) where.serviceId = serviceId as string;
  if (featured === 'true') where.isFeatured = true;
  const projects = await prisma.project.findMany({
    where,
    orderBy: [
      { isFeatured: 'desc' },
      { sortOrder: 'asc' },
      { createdAt: 'desc' }
    ],
    include: {
      service: {
        select: {
          id: true,
          title: true
        }
      }
    },
    ...(limit && { take: parseInt(limit as string) })
  });

  res.json({
    status: 'success',
    results: projects.length,
    data: {
      projects
    }
  });
}));

// Get project by ID (public)
router.get('/:id', catchAsync(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      status: 'error',
      message: 'Project ID is required'
    });
  }

  const project = await prisma.project.findFirst({
    where: { 
      id,
      isActive: true 
    },
    include: {
      service: {
        select: {
          id: true,
          title: true
        }
      }
    }
  });

  if (!project) {
    return res.status(404).json({
      status: 'error',
      message: 'Project not found'
    });
  }

  return res.json({
    status: 'success',
    data: {
      project
    }
  });
}));

// Create project (admin only)
router.post('/',
  authMiddleware,
  restrictTo('SUPER_ADMIN', 'ADMIN'),
  projectValidation,
  validateRequest,
  catchAsync(async (req, res) => {
    const {
      title,
      description,
      shortDesc,
      serviceId,
      client,
      startDate,
      endDate,
      status,
      imageUrl,
      gallery,
      technologies,
      projectUrl,
      githubUrl,
      isFeatured,
      sortOrder
    } = req.body;

    const project = await prisma.project.create({
      data: {
        title,
        description,
        shortDesc,
        serviceId,
        client,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        status: status || 'COMPLETED',
        imageUrl,
        gallery,
        technologies,
        projectUrl,
        githubUrl,
        isFeatured: isFeatured || false,
        sortOrder: sortOrder || 0
      },
      include: {
        service: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    res.status(201).json({
      status: 'success',
      data: {
        project
      }
    });
  })
);

// Update project (admin only)
router.put('/:id',
  authMiddleware,
  restrictTo('SUPER_ADMIN', 'ADMIN'),
  param('id').isString().withMessage('Project ID is required'),
  projectValidation,
  validateRequest,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const {
      title,
      description,
      shortDesc,
      serviceId,
      client,
      startDate,
      endDate,
      status,
      imageUrl,
      gallery,
      technologies,
      projectUrl,
      githubUrl,
      isFeatured,
      sortOrder,
      isActive
    } = req.body;

    if (!id) {
      return res.status(400).json({
        status: 'error',
        message: 'Project ID is required'
      });
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        shortDesc,
        serviceId,
        client,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        status,
        imageUrl,
        gallery,
        technologies,
        projectUrl,
        githubUrl,
        isFeatured,
        sortOrder,
        isActive: isActive !== undefined ? isActive : undefined
      },
      include: {
        service: {
          select: {
            id: true,
            title: true
          }
        }      }
    });

    return res.json({
      status: 'success',
      data: {
        project
      }
    });
  })
);

// Delete project (admin only)
router.delete('/:id',
  authMiddleware,
  restrictTo('SUPER_ADMIN', 'ADMIN'),
  param('id').isString().withMessage('Project ID is required'),
  validateRequest,
  catchAsync(async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: 'error',
        message: 'Project ID is required'
      });
    }    await prisma.project.update({
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
