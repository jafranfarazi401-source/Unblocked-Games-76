import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Essential for accurate req.hostname and req.protocol when behind a proxy (like Cloud Run/Cloudflare)
  app.set('trust proxy', true);

  // Domain Protection & Canonical 301 Redirection for SEO
  app.use((req, res, next) => {
    const host = req.get('host') || '';
    const protocol = req.get('x-forwarded-proto') || req.protocol;
    const hostname = req.hostname;
    
    // Safety check: Avoid redirecting in local development or AI studio preview environments
    const isDevelopment = host.includes('localhost') || 
                         host.includes('127.0.0.1') || 
                         host.includes('asia-east1.run.app') || 
                         host.includes('webcontainer.io');

    if (!isDevelopment) {
      // HSTS (HTTP Strict Transport Security) - Ensures browsers only use HTTPS
      res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

      // Canonical 301 Redirection to non-trailing slash URLs (except home)
      if (req.path.length > 1 && req.path.endsWith('/')) {
        const query = req.url.slice(req.path.length);
        const safePath = req.path.slice(0, -1);
        console.log(`[SEO 301] Trailing Slash Redirect: ${req.url} -> ${safePath}${query}`);
        return res.redirect(301, safePath + query);
      }

      // Specific SEO Fixes for reported issues
      const pathFixes: Record<string, string> = {
        '/contact': '/contact-us',
        '/classroom6x.store': '/',
        '/classroom6x.store/': '/'
      };
      
      if (pathFixes[req.path]) {
        console.log(`[SEO 301] Path Fix: ${req.path} -> ${pathFixes[req.path]}`);
        return res.redirect(301, pathFixes[req.path]);
      }

      if (hostname !== "classroom6x.store" || protocol !== "https") {
        console.log(`[SEO 301] Force Redirect: ${protocol}://${host}${req.originalUrl} -> https://classroom6x.store${req.originalUrl}`);
        return res.redirect(301, `https://classroom6x.store${req.originalUrl}`);
      }
    }
    next();
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    
    // SPA Fallback
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
