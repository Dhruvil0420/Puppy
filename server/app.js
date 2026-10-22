import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import path from 'path';
import { fileURLToPath } from 'url';

import mountRoutes from './routes/index.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* ── Trust proxy (Render / Nginx / etc.) ───────────────────────── */
app.set('trust proxy', 1);

/* ── Security ──────────────────────────────────────────────────── */
app.use(helmet());
app.use(mongoSanitize());

/* ── CORS ──────────────────────────────────────────────────────── */
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

/* ── Global rate limiting ──────────────────────────────────────── */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, // Allow 1000 requests per 15 minutes for smooth SPA browsing
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
});
app.use('/api', globalLimiter);

/* ── Body parsing (1 MB limit) ─────────────────────────────────── */
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

/* ── Compression ───────────────────────────────────────────────── */
app.use(compression());

/* ── Logging ───────────────────────────────────────────────────── */
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

/* ── Health check ──────────────────────────────────────────────── */
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  });
});

/* ── API routes ────────────────────────────────────────────────── */
mountRoutes(app);

/* ── 404 + central error handler ───────────────────────────────── */
app.use(notFound);
app.use(errorHandler);

export default app;
