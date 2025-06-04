import { Router } from 'express';

const router = Router();

// TODO: Implement notification routes
// - GET / (get user notifications)
// - PATCH /:id/read (mark notification as read)
// - PATCH /read-all (mark all as read)
// - DELETE /:id (delete notification)

router.get('/', (_req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Notification routes - Coming soon',
    data: { notifications: [] }
  });
});

export default router;
