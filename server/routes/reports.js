import { Router } from 'express';
import Media from '../models/Media.js';
import { generateReport } from '../services/report.js';

const router = Router();

// POST /api/projects/:id/report — Generate report
router.post('/projects/:id/report', async (req, res, next) => {
  try {
    const { format = 'html', mediaIds, title } = req.body;
    const projectId = req.params.id;

    // Fetch analyzed media (optionally filtered by specific IDs)
    const filter = {
      project: projectId,
      'analysis.status': 'ready'
    };
    if (mediaIds && mediaIds.length > 0) {
      filter._id = { $in: mediaIds };
    }

    const media = await Media.find(filter)
      .populate('project', 'name description location category')
      .sort({ createdAt: 1 });

    if (media.length === 0) {
      return res.status(400).json({ error: 'No analyzed media found for this project' });
    }

    const report = await generateReport(media, { format, title });

    if (format === 'html') {
      res.setHeader('Content-Type', 'text/html');
      res.send(report);
    } else {
      // PDF will be handled in Day 3
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="impactlens-report.pdf"');
      res.send(report);
    }
  } catch (err) {
    next(err);
  }
});

export default router;
