import { Router } from 'express';
import { getDbState } from '../config/db.js';

const router = Router();

router.get('/', (_req, res) => {
  const db = getDbState();
  const ok = db.readyState === 1;
  res.status(ok ? 200 : 503).json({
    status: ok ? 'ok' : 'degraded',
    db
  });
});

export default router;
