// Simple server test to check if everything is working
import { PrismaClient } from '@prisma/client';
import express from 'express';

const app = express();
const prisma = new PrismaClient();

// Simple health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Test database connection
app.get('/test-db', async (req, res) => {
  try {
    await prisma.$connect();
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    await prisma.$disconnect();
    res.json({ status: 'db ok', result });
  } catch (error) {
    res.status(500).json({ status: 'db error', error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`DB test: http://localhost:${PORT}/test-db`);
});
