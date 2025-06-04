import { Router } from 'express';

const router = Router();

// TODO: Implement contract management routes
// - GET / (list contracts)
// - GET /:id (get contract details)
// - POST / (create contract)
// - PATCH /:id (update contract)
// - PATCH /:id/approve (approve contract)
// - PATCH /:id/execute (execute contract)
// - POST /:id/milestones (add milestone)
// - PATCH /:id/milestones/:milestoneId (update milestone)

router.get('/', (_req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Contract routes - Coming soon',
    data: { contracts: [] }
  });
});

export default router;
