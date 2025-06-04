import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import catchAsync from '../utils/catchAsync.js';

const router = Router();
const prisma = new PrismaClient();

// Public endpoints that don't require authentication

// Get public tender information
router.get('/tenders', catchAsync(async (_req: Request, res: Response) => {
  const tenders = await prisma.tender.findMany({
    where: {
      status: 'PUBLISHED',
      submissionDeadline: {
        gt: new Date(),
      },
    },
    select: {
      id: true,
      title: true,
      description: true,
      estimatedValue: true,
      submissionDeadline: true,
      publishedAt: true,
      category: true,
      createdBy: {
        select: {
          organization: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      publishedAt: 'desc',
    },
  });

  res.status(200).json({
    status: 'success',
    results: tenders.length,
    data: {
      tenders,
    },
  });
}));

// Get specific tender details
router.get('/tenders/:id', catchAsync(async (req: Request, res: Response) => {
  const tender = await prisma.tender.findFirst({
    where: {
      id: req.params.id!,
      status: 'PUBLISHED',
    },
    include: {
      createdBy: {
        select: {
          organization: {
            select: {
              name: true,
              type: true,
            }
          }
        },
      },
      documents: true,
    },
  });

  if (!tender) {
    return res.status(404).json({
      status: 'error',
      message: 'Tender not found or not published',
    });
  }
  return res.status(200).json({
    status: 'success',
    data: {
      tender,
    },
  });
}));

// Get tender statistics
router.get('/stats', catchAsync(async (_req: Request, res: Response) => {
  const [
    totalTenders,
    activeTenders,
    totalOrganizations,
    totalContracts
  ] = await Promise.all([
    prisma.tender.count(),
    prisma.tender.count({
      where: {
        status: 'PUBLISHED',
        submissionDeadline: {
          gt: new Date(),
        },
      },
    }),
    prisma.organization.count({}),
    prisma.contract.count({
      where: {
        status: 'ACTIVE',
      },
    }),
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats: {
        totalTenders,
        activeTenders,
        totalOrganizations,
        totalContracts,
      },
    },
  });
}));

// Search tenders
router.get('/search/tenders', catchAsync(async (req: Request, res: Response) => {
  const { q, category, minValue, maxValue } = req.query;

  const where: any = {
    status: 'PUBLISHED',
    submissionDeadline: {
      gt: new Date(),
    },
  };

  if (q) {
    where.OR = [
      {
        title: {
          contains: q as string,
          mode: 'insensitive',
        },
      },
      {
        description: {
          contains: q as string,
          mode: 'insensitive',
        },
      },
    ];
  }

  if (category) {
    where.category = category;
  }

  if (minValue || maxValue) {
    where.estimatedValue = {};
    if (minValue) {
      where.estimatedValue.gte = parseFloat(minValue as string);
    }
    if (maxValue) {
      where.estimatedValue.lte = parseFloat(maxValue as string);
    }
  }

  const tenders = await prisma.tender.findMany({
    where,
    select: {
      id: true,
      title: true,
      description: true,
      estimatedValue: true,
      submissionDeadline: true,
      publishedAt: true,
      category: true,
      createdBy: {
        select: {
          organization: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      publishedAt: 'desc',
    },
    take: 50, // Limit results
  });

  res.status(200).json({
    status: 'success',
    results: tenders.length,
    data: {
      tenders,
    },
  });
}));

export default router;
