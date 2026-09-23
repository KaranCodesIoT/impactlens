import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import errorHandler from './middleware/errorHandler.js';
import projectRoutes from './routes/projects.js';
import mediaRoutes from './routes/media.js';
import analysisRoutes from './routes/analysis.js';
import webhookRoutes from './routes/webhook.js';
import reportRoutes from './routes/reports.js';

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/api/reports', reportRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
