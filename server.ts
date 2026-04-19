import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Domain Protection & Canonical 301 Redirection for SEO
  app.use((req, res, next) => {
    const hostname = req.hostname;
    
    // Safety check: Avoid redirecting in local development or AI studio preview environments
    const isDevelopment = hostname === 'localhost' || 
                         hostname === '127.0.0.1' || 
                         hostname.includes('asia-east1.run.app') || 
                         hostname.includes('webcontainer.io');

    if (!isDevelopment && hostname !== "classroom6x.store") {
      // Return a true HTTP 301 Moved Permanently redirect
      console.log(`Redirecting from ${hostname} to classroom6x.store (SEO 301)`);
      return res.redirect(301, `https://classroom6x.store${req.originalUrl}`);
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
