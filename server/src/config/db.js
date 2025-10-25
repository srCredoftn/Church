import mongoose from 'mongoose';

const DEFAULT_LOCAL = 'mongodb://127.0.0.1:27017/cotonou';
const LOCAL_URI = process.env.MONGODB_URI_LOCAL || DEFAULT_LOCAL;
const FALLBACK_URI = process.env.MONGODB_URI_FALLBACK || process.env.MONGODB_URI || '';
const PRIMARY = (process.env.MONGO_PRIMARY || 'local').toLowerCase(); // 'local' | 'cloud'
const MAX_RETRIES = Number(process.env.DB_MAX_RETRIES || 3);
const BASE_DELAY_MS = Number(process.env.DB_RETRY_BASE_DELAY_MS || 500);

let activeUriLabel = 'unconnected';

function wait(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function tryConnect(uri, label) {
  const opts = {
    serverSelectionTimeoutMS: Number(process.env.DB_SERVER_SELECTION_TIMEOUT_MS || 5000),
    maxPoolSize: Number(process.env.DB_MAX_POOL_SIZE || 10)
  };
  await mongoose.connect(uri, opts);
  activeUriLabel = label;
}

async function connectWithRetries(uri, label) {
  let attempt = 0;
  while (attempt < MAX_RETRIES) {
    try {
      await tryConnect(uri, label);
      return;
    } catch (err) {
      attempt += 1;
      const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
      if (attempt >= MAX_RETRIES) throw err;
      // eslint-disable-next-line no-console
      console.warn(`[db] ${label} connect failed (attempt ${attempt}). Retrying in ${delay}ms`);
      await wait(delay);
    }
  }
}

export async function connectWithFallback() {
  const order = PRIMARY === 'cloud'
    ? [{ uri: FALLBACK_URI, label: 'cloud' }, { uri: LOCAL_URI, label: 'local' }]
    : [{ uri: LOCAL_URI, label: 'local' }, { uri: FALLBACK_URI, label: 'cloud' }];

  let lastErr;
  for (const target of order) {
    if (!target.uri) continue; // skip empty
    try {
      // eslint-disable-next-line no-console
      console.log(`[db] Trying ${target.label}`);
      await connectWithRetries(target.uri, target.label);
      // eslint-disable-next-line no-console
      console.log(`[db] Connected via ${target.label}`);
      return;
    } catch (err) {
      lastErr = err;
      // eslint-disable-next-line no-console
      console.error(`[db] Failed ${target.label}:`, err.message);
      try { await mongoose.disconnect(); } catch (_) {}
    }
  }
  throw lastErr || new Error('No database URI available');
}

export function getDbState() {
  const state = mongoose.connection.readyState; // 0=disconnected,1=connected,2=connecting,3=disconnecting,99=uninitialized
  return {
    readyState: state,
    activeUri: activeUriLabel,
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || null
  };
}

export function gracefulShutdown(server) {
  return () => {
    // eslint-disable-next-line no-console
    console.log('\n[server] Shutting down...');
    server.close(async () => {
      try {
        await mongoose.connection.close(false);
      } catch (_) {}
      // eslint-disable-next-line no-console
      console.log('[server] Closed. Bye.');
      process.exit(0);
    });
  };
}
