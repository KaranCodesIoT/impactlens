import { Router } from 'express';
import Media from '../models/Media.js';
import { analyzeMedia, queryProject, compareMedia } from '../services/gemini.js';

const router = Router();

// POST /api/media/:mediaId/analyze — Trigger/re-trigger AI analysis
router.post('/media/:mediaId/analyze', async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.mediaId);
    if (!media) return res.status(404).json({ error: 'Media not found' });

    // Run analysis (will update the media doc)
    const result = await analyzeMedia(media._id);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// POST /api/projects/:id/query — Natural language Q&A
router.post('/projects/:id/query', async (req, res, next) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: 'Question is required' });

    const answer = await queryProject(req.params.id, question);
    res.json(answer);
  } catch (err) {
    next(err);
  }
});

// POST /api/projects/:id/compare — Compare two media assets
router.post('/projects/:id/compare', async (req, res, next) => {
  try {
    const { beforeId, afterId } = req.body;
    if (!beforeId || !afterId) {
      return res.status(400).json({ error: 'beforeId and afterId are required' });
    }

    const result = await compareMedia(beforeId, afterId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
