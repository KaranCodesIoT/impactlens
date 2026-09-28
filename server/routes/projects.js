import { Router } from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import Project from '../models/Project.js';
import Media from '../models/Media.js';
import cloudinary from '../config/cloudinary.js';
import { analyzeMedia } from '../services/gemini.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});

const router = Router();

// GET /api/projects — List all projects
router.get('/', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        error: 'Database not connected. Please verify your MONGODB_URI in .env or start MongoDB service.'
      });
    }
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    next(err);
  }
});

// POST /api/projects — Create a new project
router.post('/', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        error: 'Database not connected. Please verify your MONGODB_URI in .env or start MongoDB service.'
      });
    }
    const { name, description, location, category } = req.body;
    const project = await Project.create({ name, description, location, category });
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
});

// GET /api/projects/:id — Get project details
router.get('/:id', async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    // Recompute live stats
    const [totalMedia, analyzedMedia] = await Promise.all([
      Media.countDocuments({ project: project._id }),
      Media.countDocuments({ project: project._id, 'analysis.status': 'ready' })
    ]);

    const findingsAgg = await Media.aggregate([
      { $match: { project: project._id, 'analysis.status': 'ready' } },
      {
        $project: {
          count: {
            $add: [
              { $size: { $ifNull: ['$analysis.result.evidenceReferences', []] } },
              { $size: { $ifNull: ['$analysis.result.visualSignals', []] } },
              { $size: { $ifNull: ['$analysis.result.observations', []] } }
            ]
          }
        }
      },
      { $group: { _id: null, total: { $sum: '$count' } } }
    ]);

    project.stats = {
      totalMedia,
      analyzedMedia,
      findings: findingsAgg[0]?.total || 0
    };
    await project.save();

    res.json(project);
  } catch (err) {
    next(err);
  }
});

// PUT /api/projects/:id — Update project
router.put('/:id', async (req, res, next) => {
  try {
    const { name, description, location, category, coverImage } = req.body;
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { name, description, location, category, coverImage },
      { new: true, runValidators: true }
    );
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/projects/:id — Delete project + all media
router.delete('/:id', async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    // Delete all media records for this project
    await Media.deleteMany({ project: project._id });

    await project.deleteOne();
    res.json({ message: 'Project and all associated media deleted' });
  } catch (err) {
    next(err);
  }
});

// GET /api/projects/:id/media — List media for a project (with filters)
router.get('/:id/media', async (req, res, next) => {
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
router.post('/:id/media', async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const {
      public_id, cloudinaryId,
      secure_url, cloudinaryUrl, url,
      resource_type, resourceType,
      format, bytes, width, height,
      original_filename, originalFilename,
      tags
    } = req.body;

    const mediaId = cloudinaryId || public_id;
    const mediaUrl = cloudinaryUrl || secure_url || url;

    if (!mediaId || !mediaUrl) {
      return res.status(400).json({ error: 'Missing required cloudinaryId (or public_id) and cloudinaryUrl (or secure_url)' });
    }

    const media = await Media.create({
      project: project._id,
      cloudinaryId: mediaId,
      cloudinaryUrl: mediaUrl,
      resourceType: resourceType || resource_type || 'image',
      format,
      bytes,
      width,
      height,
      originalFilename: originalFilename || original_filename,
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

// POST /api/projects/:id/upload — Direct authenticated server-side upload to Cloudinary
router.post('/:id/upload', upload.single('file'), async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (!req.file) return res.status(400).json({ error: 'No file provided' });

    const isVideo = req.file.mimetype.startsWith('video/');
    const resourceType = isVideo ? 'video' : 'image';

    // Upload buffer directly to Cloudinary using authenticated SDK
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `impactlens/${project.slug || project._id}`,
          resource_type: resourceType,
          tags: [project._id.toString()]
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload_stream error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(req.file.buffer);
    });

    const media = await Media.create({
      project: project._id,
      cloudinaryId: uploadResult.public_id,
      cloudinaryUrl: uploadResult.secure_url,
      resourceType: uploadResult.resource_type || resourceType,
      format: uploadResult.format,
      bytes: uploadResult.bytes,
      width: uploadResult.width,
      height: uploadResult.height,
      originalFilename: req.file.originalname,
      tags: uploadResult.tags || [],
      analysis: { status: 'pending' }
    });

    // Auto-trigger AI analysis in background
    analyzeMedia(media._id).catch(err => {
      console.error(`Background analysis failed for ${media._id}:`, err.message);
    });

    res.status(201).json(media);
  } catch (err) {
    console.error('Server upload error:', err);
    next(err);
  }
});

export default router;
