import { Router, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest, restrictTo } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';
import { catchAsync, AppError } from '../middleware/errorHandler.js';

const router = Router();
const prisma = new PrismaClient();

// Validation schemas
const createBidValidation = [
  body('tenderId').isLength({ min: 25, max: 25 }).withMessage('Valid tender ID is required'),
  body('proposedPrice').isFloat({ min: 0 }).withMessage('Proposed price must be a positive number'),
  body('technicalProposal').trim().isLength({ min: 50 }).withMessage('Technical proposal must be at least 50 characters'),
  body('deliveryTimeframe').optional().trim().isLength({ min: 1 }).withMessage('Delivery timeframe is required if provided'),
  body('validityPeriod').optional().isInt({ min: 1 }).withMessage('Validity period must be a positive number'),
  body('terms').optional().trim().isLength({ min: 10 }).withMessage('Terms must be at least 10 characters if provided'),
];

// Get all bids for current user/organization
router.get('/', catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const { status, tenderId, page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where: any = {};

  // Apply role-based filtering
  if (req.user?.role === 'SUPPLIER') {
    where.organizationId = req.user.organizationId;
  } else if (req.user?.role === 'PROCUREMENT_OFFICER') {
    // Show bids for tenders from their organization
    where.tender = {
      organizationId: req.user.organizationId,
    };
  }

  if (status) {
    where.status = status;
  }

  if (tenderId) {
    where.tenderId = tenderId;
  }

  const [bids, total] = await Promise.all([
    prisma.bid.findMany({
      where,
      include: {        tender: {
          select: {
            title: true,
            id: true,
            submissionDeadline: true,
            estimatedValue: true,
          },
        },
        organization: {
          select: {
            name: true,
          },
        },
      },      orderBy: {
        submittedAt: 'desc',
      },
      skip,
      take: Number(limit),
    }),
    prisma.bid.count({ where }),
  ]);

  res.status(200).json({
    status: 'success',
    results: bids.length,
    totalResults: total,
    totalPages: Math.ceil(total / Number(limit)),
    currentPage: Number(page),
    data: {
      bids,
    },
  });
}));

// Get bid by ID
router.get('/:id', catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const bid = await prisma.bid.findUnique({
    where: { id: req.params.id! },
    include: {
      tender: {
        include: {
          createdBy: {
            select: {
              organizationId: true,
            },
          },
        },
      },
      organization: {
        select: {
          name: true,
          taxId: true,
        },
      },
      documents: true,
    },
  });

  if (!bid) {
    return next(new AppError('Bid not found', 404));
  }

  // Check access permissions
  if (req.user?.role === 'SUPPLIER' && bid.organizationId !== req.user.organizationId) {
    return next(new AppError('You can only access your organization\'s bids', 403));
  }
  if (req.user?.role === 'PROCUREMENT_OFFICER' && bid.tender.createdBy.organizationId !== req.user.organizationId) {
    return next(new AppError('You can only access bids for your organization\'s tenders', 403));
  }

  res.status(200).json({
    status: 'success',
    data: {
      bid,
    },
  });
}));

// Create new bid
router.post('/',
  restrictTo('SUPPLIER'),
  createBidValidation,
  validateRequest,  catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { tenderId, proposedPrice, technicalProposal, deliveryTimeframe: _deliveryTimeframe, validityPeriod: _validityPeriod, terms: _terms } = req.body;

    // Check if user has an organization
    if (!req.user?.organizationId) {
      return next(new AppError('User must be associated with an organization to submit bids', 400));
    }

    // Verify tender exists and is open for bidding
    const tender = await prisma.tender.findUnique({
      where: { id: tenderId },
    });

    if (!tender) {
      return next(new AppError('Tender not found', 404));
    }

    if (tender.status !== 'PUBLISHED') {
      return next(new AppError('Tender is not open for bidding', 400));
    }    if (tender.submissionDeadline < new Date()) {
      return next(new AppError('Bidding deadline has passed', 400));
    }

    // Check if organization has already submitted a bid
    const existingBid = await prisma.bid.findFirst({
      where: {
        tenderId,
        organizationId: req.user!.organizationId!,
      },
    });

    if (existingBid) {
      return next(new AppError('Your organization has already submitted a bid for this tender', 400));
    }    // Create the bid with all provided data
    const bid = await prisma.bid.create({
      data: {
        tenderId,
        organizationId: req.user!.organizationId!,
        totalAmount: parseFloat(proposedPrice),
        proposal: technicalProposal,
        status: 'SUBMITTED',
      },
      include: {
        tender: {
          select: {
            title: true,
            id: true,
          },
        },
        organization: {
          select: {
            name: true,
          },
        },
      },
    });

    res.status(201).json({
      status: 'success',
      data: {
        bid,
      },
    });
  })
);

// Update bid (only if not yet submitted or in draft)
router.patch('/:id',
  restrictTo('SUPPLIER'),
  catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const bid = await prisma.bid.findUnique({
      where: { id: req.params.id! },
      include: {
        tender: true,
      },
    });

    if (!bid) {
      return next(new AppError('Bid not found', 404));
    }

    if (bid.organizationId !== req.user!.organizationId) {
      return next(new AppError('You can only update your organization\'s bids', 403));
    }

    if (bid.status !== 'DRAFT' && bid.status !== 'SUBMITTED') {
      return next(new AppError('Cannot update bid in current status', 400));
    }    if (bid.tender.submissionDeadline < new Date()) {
      return next(new AppError('Bidding deadline has passed', 400));
    }

    const updatedBid = await prisma.bid.update({
      where: { id: req.params.id! },
      data: req.body,
      include: {
        tender: {
          select: {
            title: true,
            id: true,
          },
        },
        organization: {
          select: {
            name: true,
          },
        },
      },
    });

    res.status(200).json({
      status: 'success',
      data: {
        bid: updatedBid,
      },
    });
  })
);

// Withdraw bid
router.patch('/:id/withdraw',
  restrictTo('SUPPLIER'),
  catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // const { reason } = req.body; // Field doesn't exist in schema

    const bid = await prisma.bid.findUnique({
      where: { id: req.params.id! },
      include: {
        tender: true,
      },
    });

    if (!bid) {
      return next(new AppError('Bid not found', 404));
    }

    if (bid.organizationId !== req.user!.organizationId) {
      return next(new AppError('You can only withdraw your organization\'s bids', 403));
    }

    if (bid.status !== 'SUBMITTED') {
      return next(new AppError('Only submitted bids can be withdrawn', 400));
    }    if (bid.tender.submissionDeadline < new Date()) {
      return next(new AppError('Cannot withdraw bid after deadline', 400));
    }

    const updatedBid = await prisma.bid.update({
      where: { id: req.params.id! },
      data: {
        status: 'REJECTED',
        // Note: withdrawalReason field doesn't exist in schema
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'Bid withdrawn successfully',
      data: {
        bid: updatedBid,
      },
    });
  })
);

// Evaluate bid (procurement officers only)
router.patch('/:id/evaluate',
  restrictTo('PROCUREMENT_OFFICER'),
  catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { technicalScore, financialScore, status } = req.body;

    const bid = await prisma.bid.findUnique({
      where: { id: req.params.id! },
      include: {
        tender: {
          include: {
            createdBy: {
              select: {
                organizationId: true,
              },
            },
          },
        },
      },
    });

    if (!bid) {
      return next(new AppError('Bid not found', 404));
    }

    if (bid.tender.createdBy.organizationId !== req.user!.organizationId) {
      return next(new AppError('You can only evaluate bids for your organization\'s tenders', 403));
    }

    if (bid.tender.status !== 'EVALUATED') {
      return next(new AppError('Tender is not in evaluation phase', 400));
    }

    const updateData: any = {};
    if (technicalScore !== undefined) {
      updateData.technicalScore = parseFloat(technicalScore);
    }
    if (financialScore !== undefined) {
      updateData.financialScore = parseFloat(financialScore);
    }
    if (status) {
      updateData.status = status;
    }

    const updatedBid = await prisma.bid.update({
      where: { id: req.params.id! },
      data: updateData,
    });

    res.status(200).json({
      status: 'success',
      message: 'Bid evaluated successfully',
      data: {
        bid: updatedBid,
      },
    });
  })
);

// Delete bid (only drafts)
router.delete('/:id',
  restrictTo('SUPPLIER'),
  catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const bid = await prisma.bid.findUnique({
      where: { id: req.params.id! },
    });

    if (!bid) {
      return next(new AppError('Bid not found', 404));
    }

    if (bid.organizationId !== req.user!.organizationId) {
      return next(new AppError('You can only delete your organization\'s bids', 403));
    }

    if (bid.status !== 'DRAFT') {
      return next(new AppError('Only draft bids can be deleted', 400));
    }

    await prisma.bid.delete({
      where: { id: req.params.id! },
    });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  })
);

export default router;
