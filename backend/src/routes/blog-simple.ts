import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/v1/blog - Get all blog posts
router.get('/', async (_req, res) => {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        status: 'PUBLISHED'
      },
      include: {
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });

    res.json({
      success: true,
      data: posts
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch blog posts'
    });
  }
});

// GET /api/v1/blog/:id - Get a specific blog post
router.get('/:id', async (req, res) => {
  try {
    const post = await prisma.blogPost.findUnique({
      where: {
        id: req.params.id!
      },
      include: {
        category: true
      }
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      });
    }

    return res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch blog post'
    });
  }
});

export default router;
