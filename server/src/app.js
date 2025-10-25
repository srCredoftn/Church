import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { connectWithFallback, getDbState, gracefulShutdown } from './config/db.js';
import healthRouter from './routes/health.js';
import apiRouter from './routes/index.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('tiny'));

// Health first
app.use('/api/health', healthRouter);

// API routes
app.use('/api', apiRouter);

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await connectWithFallback();
    const server = app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`[server] Listening on http://localhost:${PORT}`);
    });

    const shutdown = gracefulShutdown(server);
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[server] Failed to start:', err);
    process.exit(1);
  }
})();
