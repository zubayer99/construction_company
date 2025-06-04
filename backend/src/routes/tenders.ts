import { Router, Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest, restrictTo } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';
import catchAsync from '../utils/catchAsync.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();
const prisma = new PrismaClient();

// Validation schemas
const createTenderValidation = [
  body('title').trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('description').trim().isLength({ min: 20, max: 5000 }).withMessage('Description must be between 20 and 5000 characters'),
  body('estimatedValue').isFloat({ min: 0 }).withMessage('Estimated value must be a positive number'),
  body('submissionDeadline').isISO8601().withMessage('Submission deadline must be a valid date'),
  body('category').isIn(['GOODS', 'SERVICES', 'WORKS', 'CONSULTANCY']).withMessage('Invalid category'),
];

// Get all tenders (with filters)
router.get('/', catchAsync(async (req: Request, res: Response) => {
  const authenticatedReq = req as AuthenticatedRequest;
  const { status, category, page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where: any = {};

  // Apply role-based filtering
  if (authenticatedReq.user?.role === 'SUPPLIER') {
    where.status = 'PUBLISHED';
  } else if (authenticatedReq.user?.role === 'PROCUREMENT_OFFICER') {
    where.createdById = authenticatedReq.user.id;
  }

  if (status) {
    where.status = status;
  }

  if (category) {
    where.category = category;
  }

  const [tenders, total] = await Promise.all([
    prisma.tender.findMany({
      where,
      include: {
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
            organization: {
              select: {
                name: true,
                type: true,
              },
            },
          },
        },
        _count: {
          select: {
            bids: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: Number(limit),
    }),
    prisma.tender.count({ where }),
  ]);

  res.status(200).json({
    status: 'success',
    results: tenders.length,
    totalResults: total,
    totalPages: Math.ceil(total / Number(limit)),
    currentPage: Number(page),
    data: {
      tenders,
    },
  });
}));

// Get tender by ID
router.get('/:id', catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const authenticatedReq = req as AuthenticatedRequest;
  const tender = await prisma.tender.findUnique({
    where: { id: req.params.id! },
    include: {
      createdBy: {
        select: {
          firstName: true,
          lastName: true,
          organization: {
            select: {
              name: true,
              type: true,
            },
          },
        },
      },
      documents: true,
      bids: authenticatedReq.user?.role === 'PROCUREMENT_OFFICER' || authenticatedReq.user?.role === 'AUDITOR' ? {
        include: {
          organization: {
            select: {
              name: true,
            },
          },
        },
      } : false,
    },
  });

  if (!tender) {
    return next(new AppError('Tender not found', 404));
  }

  // Check access permissions
  if (authenticatedReq.user?.role === 'PROCUREMENT_OFFICER' && tender.createdById !== authenticatedReq.user.id) {
    return next(new AppError('You can only access tenders you created', 403));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tender,
    },
  });
}));

// Create new tender
router.post('/', 
  restrictTo('PROCUREMENT_OFFICER'), 
  createTenderValidation, 
  validateRequest,
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authenticatedReq = req as AuthenticatedRequest;
    const { title, description, estimatedValue, submissionDeadline, category, procurementMethod, eligibilityCriteria, evaluationCriteria, termsConditions } = req.body;

    // Validate submission deadline
    const deadline = new Date(submissionDeadline);
    const minDeadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    if (deadline < minDeadline) {
      return next(new AppError('Submission deadline must be at least 7 days from now', 400));
    }

    // Set opening date to one day after submission deadline
    const openingDate = new Date(deadline.getTime() + 24 * 60 * 60 * 1000);

    const tender = await prisma.tender.create({
      data: {
        title,
        description,
        estimatedValue: parseFloat(estimatedValue),
        submissionDeadline: deadline,
        openingDate,
        category,
        procurementMethod: procurementMethod || 'OPEN_TENDER',
        eligibilityCriteria: eligibilityCriteria || {},
        evaluationCriteria: evaluationCriteria || {},
        termsConditions,
        createdById: authenticatedReq.user!.id,
        status: 'DRAFT',
      },
      include: {
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
            organization: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json({
      status: 'success',
      data: {
        tender,
      },
    });
  })
);

// Update tender
router.patch('/:id',
  restrictTo('PROCUREMENT_OFFICER'),
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authenticatedReq = req as AuthenticatedRequest;
    const tender = await prisma.tender.findUnique({
      where: { id: req.params.id! },
    });

    if (!tender) {
      return next(new AppError('Tender not found', 404));
    }

    if (tender.createdById !== authenticatedReq.user!.id) {
      return next(new AppError('You can only update tenders you created', 403));
    }

    if (tender.status === 'PUBLISHED') {
      return next(new AppError('Cannot update published tender', 400));
    }

    const updatedTender = await prisma.tender.update({
      where: { id: req.params.id! },
      data: req.body,
      include: {
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
            organization: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json({
      status: 'success',
      data: {
        tender: updatedTender,
      },
    });
  })
);

// Publish tender
router.patch('/:id/publish',
  restrictTo('PROCUREMENT_OFFICER'),
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authenticatedReq = req as AuthenticatedRequest;
    const tender = await prisma.tender.findUnique({
      where: { id: req.params.id! },
    });

    if (!tender) {
      return next(new AppError('Tender not found', 404));
    }

    if (tender.createdById !== authenticatedReq.user!.id) {
      return next(new AppError('You can only publish tenders you created', 403));
    }

    if (tender.status !== 'DRAFT') {
      return next(new AppError('Only draft tenders can be published', 400));
    }

    const updatedTender = await prisma.tender.update({
      where: { id: req.params.id! },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'Tender published successfully',
      data: {
        tender: updatedTender,
      },
    });
  })
);

// Cancel tender
router.patch('/:id/cancel',
  restrictTo('PROCUREMENT_OFFICER'),
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authenticatedReq = req as AuthenticatedRequest;
    const tender = await prisma.tender.findUnique({
      where: { id: req.params.id! },
    });

    if (!tender) {
      return next(new AppError('Tender not found', 404));
    }

    if (tender.createdById !== authenticatedReq.user!.id) {
      return next(new AppError('You can only cancel tenders you created', 403));
    }

    const updatedTender = await prisma.tender.update({
      where: { id: req.params.id! },
      data: {
        status: 'CANCELLED',
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'Tender cancelled successfully',
      data: {
        tender: updatedTender,
      },
    });
  })
);

// Delete tender (only drafts)
router.delete('/:id',
  restrictTo('PROCUREMENT_OFFICER'),
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authenticatedReq = req as AuthenticatedRequest;
    const tender = await prisma.tender.findUnique({
      where: { id: req.params.id! },
    });

    if (!tender) {
      return next(new AppError('Tender not found', 404));
    }

    if (tender.createdById !== authenticatedReq.user!.id) {
      return next(new AppError('You can only delete tenders you created', 403));
    }

    if (tender.status !== 'DRAFT') {
      return next(new AppError('Only draft tenders can be deleted', 400));
    }

    await prisma.tender.delete({
      where: { id: req.params.id! },
    });    res.status(204).json({
      status: 'success',
      data: null,
    });
  })
);

// Get bids for a tender
router.get('/:id/bids',
  restrictTo('PROCUREMENT_OFFICER', 'AUDITOR'),
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authenticatedReq = req as AuthenticatedRequest;
    const tender = await prisma.tender.findUnique({
      where: { id: req.params.id! },
    });

    if (!tender) {
      return next(new AppError('Tender not found', 404));
    }

    // Check access permissions
    if (authenticatedReq.user?.role === 'PROCUREMENT_OFFICER' && tender.createdById !== authenticatedReq.user.id) {
      return next(new AppError('You can only access bids for tenders you created', 403));
    }

    const bids = await prisma.bid.findMany({
      where: { tenderId: req.params.id! },
      include: {
        organization: {
          select: {
            name: true,
            type: true,
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });

    res.status(200).json({
      status: 'success',
      results: bids.length,
      data: {
        bids,
      },
    });
  })
);

export default router;
