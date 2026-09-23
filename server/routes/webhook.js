import { Router } from 'express';

const router = Router();

// POST /api/webhook/cloudinary — Cloudinary upload notification
// This is a backup mechanism; primary flow is frontend posting to /api/projects/:id/media
router.post('/cloudinary', async (req, res, next) => {
  try {
    console.log('Cloudinary webhook received:', JSON.stringify(req.body, null, 2));
    // For now, just acknowledge — primary registration happens via frontend
    res.json({ received: true });
  } catch (err) {
    next(err);
  }
});

export default router;
