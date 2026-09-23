import { Router } from 'express';
import Project from '../models/Project.js';
import Media from '../models/Media.js';

const router = Router();

// GET /api/projects — List all projects
router.get('/', async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    next(err);
  }
});

// POST /api/projects — Create a new project
router.post('/', async (req, res, next) => {
  try {
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
      { $project: { obsCount: { $size: { $ifNull: ['$analysis.result.observations', []] } } } },
      { $group: { _id: null, total: { $sum: '$obsCount' } } }
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

export default router;
