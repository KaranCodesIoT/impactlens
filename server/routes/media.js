import { Router } from 'express';
import Media from '../models/Media.js';
import Project from '../models/Project.js';
import { deleteFromCloudinary } from '../services/cloudinary.js';
import { analyzeMedia } from '../services/gemini.js';

const router = Router();

// GET /api/projects/:id/media — List media for a project (with filters)
router.get('/projects/:id/media', async (req, res, next) => {
  try {
    const { tag, status, type } = req.query;
    const filter = { project: req.params.id };

    if (tag) filter.tags = tag;
    if (status) filter['analysis.status'] = status;
    if (type) filter.resourceType = type;

    const media = await Media.find(filter).sort({ createdAt: -1 });
    res.json(media);
  } catch (err) {
    next(err);
  }
});

// POST /api/projects/:id/media — Register media after Cloudinary upload
router.post('/projects/:id/media', async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const {
      public_id, secure_url, resource_type, format,
      bytes, width, height, original_filename, tags
    } = req.body;

    const media = await Media.create({
      project: project._id,
      cloudinaryId: public_id,
      cloudinaryUrl: secure_url,
      resourceType: resource_type || 'image',
      format,
      bytes,
      width,
      height,
      originalFilename: original_filename,
      tags: tags || [],
      analysis: { status: 'pending' }
    });

    // Auto-trigger AI analysis in background (don't await)
    analyzeMedia(media._id).catch(err => {
      console.error(`Background analysis failed for ${media._id}:`, err.message);
    });

    res.status(201).json(media);
  } catch (err) {
    next(err);
  }
});

// GET /api/media/:mediaId — Get single media with analysis
router.get('/:mediaId', async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.mediaId).populate('project', 'name slug');
    if (!media) return res.status(404).json({ error: 'Media not found' });
    res.json(media);
  } catch (err) {
    next(err);
  }
});

// PUT /api/media/:mediaId — Update caption, tags, comparison group
router.put('/:mediaId', async (req, res, next) => {
  try {
    const { caption, tags, comparisonGroup, sequenceOrder, capturedAt } = req.body;
    const media = await Media.findByIdAndUpdate(
      req.params.mediaId,
      { caption, tags, comparisonGroup, sequenceOrder, capturedAt },
      { new: true, runValidators: true }
    );
    if (!media) return res.status(404).json({ error: 'Media not found' });
    res.json(media);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/media/:mediaId — Delete from DB + Cloudinary
router.delete('/:mediaId', async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.mediaId);
    if (!media) return res.status(404).json({ error: 'Media not found' });

    // Delete from Cloudinary
    await deleteFromCloudinary(media.cloudinaryId, media.resourceType);

    await media.deleteOne();
    res.json({ message: 'Media deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
