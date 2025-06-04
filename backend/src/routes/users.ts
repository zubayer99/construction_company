import { Router } from 'express';

const router = Router();

// TODO: Implement user management routes
// - GET / (list users)
// - GET /:id (get user details)
// - PATCH /:id (update user)
// - DELETE /:id (delete user)
// - PATCH /:id/activate (activate user)
// - PATCH /:id/deactivate (deactivate user)

router.get('/', (_req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'User routes - Coming soon',
    data: { users: [] }
  });
});

export default router;
