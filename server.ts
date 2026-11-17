import { config } from 'dotenv';

config({ path: '.env.local', quiet: true });
config({ quiet: true });
import express from 'express';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const chatHandler = require('./api/chat.js');
const contactHandler = require('./api/contact.js');

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '64kb' }));
  app.all('/api/contact', (req, res) => contactHandler(req, res));

  // Mount the exact same CommonJS Vercel handler for local dev / preview
  app.all('/api/chat', (req, res) => {
    return chatHandler(req, res);
  });

  if (process.env.NODE_ENV === 'production') {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Portfolio server running at http://localhost:${port}`);
  });
}

startServer();
