import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { GAMES, BLOGS, FAQS } from "./src/data";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Essential for accurate req.hostname and req.protocol when behind a proxy
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
      // HSTS
      res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

      // Canonical 301 Redirection to non-trailing slash URLs
      if (req.path.length > 1 && req.path.endsWith('/')) {
        const query = req.url.slice(req.path.length);
        const safePath = req.path.slice(0, -1);
        return res.redirect(301, safePath + query);
      }

      // Specific SEO Fixes
      const pathFixes: Record<string, string> = {
        '/contact': '/contact-us',
        '/classroom6x.store': '/',
        '/classroom6x.store/': '/'
      };
      
      if (pathFixes[req.path]) {
        return res.redirect(301, pathFixes[req.path]);
      }

      if (hostname !== "classroom6x.store" || protocol !== "https") {
        return res.redirect(301, `https://classroom6x.store${req.originalUrl}`);
      }
    }
    next();
  });

  let vite: any;
  if (process.env.NODE_ENV !== "production") {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
  }

  // SEO Injection Logic
  app.get('*', async (req, res) => {
    try {
      const url = req.originalUrl;
      const baseUrl = "https://classroom6x.store";
      const fullUrl = `${baseUrl}${url.split('?')[0]}`;
      
      let html: string;
      if (process.env.NODE_ENV !== "production") {
        html = fs.readFileSync(path.resolve(__dirname, "index.html"), "utf-8");
        html = await vite.transformIndexHtml(url, html);
      } else {
        html = fs.readFileSync(path.resolve(__dirname, "dist/index.html"), "utf-8");
      }

      // Determine content based on path
      let title = "Classroom 6x - Hub for Unblocked Games 6x & Best School Games";
      let description = "Classroom 6x Hub: Play the best unblocked games 6x for school. Enjoy Slope, Retro Bowl, Duck Duck Clicker, and more with zero lag.";
      let schema: any[] = [];
      let breadcrumbs: any = null;

      // Base Schemas
      const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Classroom 6x",
        "url": baseUrl,
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${baseUrl}/?s={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      };

      const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Classroom 6x",
        "url": baseUrl,
        "logo": `${baseUrl}/logo.png`,
        "description": "Play free unblocked browser games online at school or anywhere.",
        "sameAs": ["https://facebook.com/classroom6x"]
      };

      schema.push(websiteSchema, organizationSchema);

      // Path based logic
      const pathOnly = url.split('?')[0].toLowerCase();
      const gameMatch = pathOnly.match(/^\/game\/(.+)$/i) || pathOnly.match(/^\/([a-z0-9-/]+)$/i);
      const blogMatch = pathOnly.match(/^\/blog\/([a-z0-9-]+)$/i);
      const catMatch = pathOnly.match(/^\/category\/([a-z0-9-]+)$/i);

      // List of static pages to exclude from game matching if using the root /id format
      const staticPages = ["contact-us", "about-us", "privacy-policy", "terms-of-service", "blogs"];

      if (gameMatch && !staticPages.includes(gameMatch[1])) {
        const id = gameMatch[1];
        const game = GAMES.find(g => g.id.toLowerCase() === id.toLowerCase());
        if (game) {
          title = `${game.title} Unblocked - Play Online | Classroom 6x`;
          description = game.description || `Play ${game.title} unblocked for free on Classroom 6x. The best school-friendly mirror for ${game.category} games.`;
          
          // Force /game/ prefix in canonical for games to be consistent with sitemap
          const canonicalUrl = `${baseUrl}/game/${game.id.toLowerCase()}`;
          
          schema.push({
            "@context": "https://schema.org",
            "@type": "VideoGame",
            "name": game.title,
            "description": description,
            "genre": game.category,
            "operatingSystem": "Browser",
            "applicationCategory": "Game",
            "image": game.image,
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": game.rating || "4.8",
              "ratingCount": "1250",
              "bestRating": "5",
              "worstRating": "1"
            },
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          });

          breadcrumbs = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
              { "@type": "ListItem", "position": 2, "name": game.category, "item": `${baseUrl}/category/${game.category.toLowerCase()}` },
              { "@type": "ListItem", "position": 3, "name": game.title, "item": fullUrl }
            ]
          };
        }
      } else if (blogMatch) {
        const id = blogMatch[1];
        const blog = BLOGS.find(b => b.id.toLowerCase() === id.toLowerCase());
        if (blog) {
          title = `${blog.title} | Classroom 6x Guides`;
          description = blog.excerpt;
          schema.push({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": blog.title,
            "description": blog.excerpt,
            "author": { "@type": "Organization", "name": "Classroom 6x Team" },
            "publisher": organizationSchema,
            "datePublished": "2026-04-19T08:00:00Z",
            "dateModified": "2026-05-09T19:00:00Z",
            "image": "https://classroom6x.store/logo.png"
          });

          breadcrumbs = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
              { "@type": "ListItem", "position": 2, "name": "Blogs", "item": `${baseUrl}/blogs` },
              { "@type": "ListItem", "position": 3, "name": blog.title, "item": fullUrl }
            ]
          };
        }
      } else if (catMatch) {
        const cat = catMatch[1];
        title = `Best ${cat.charAt(0).toUpperCase() + cat.slice(1)} Unblocked Games | Classroom 6x`;
        description = `Explore our curated selection of the best ${cat} unblocked games. Play online for free at school on Classroom 6x.`;
        breadcrumbs = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
            { "@type": "ListItem", "position": 2, "name": cat.charAt(0).toUpperCase() + cat.slice(1), "item": fullUrl }
          ]
        };
      } else if (req.path === '/contact-us') {
        title = "Contact Us | Classroom 6x";
        description = "Get in touch with the Classroom 6x team for support, game requests, or feedback.";
      } else if (req.path === '/about-us') {
        title = "About Us | Classroom 6x Hub";
        description = "Learn more about the mission behind Classroom 6x and how we provide the best unblocked games.";
      } else if (req.path === '/privacy-policy') {
        title = "Privacy Policy | Classroom 6x";
        description = "Read our privacy policy to understand how we protect your data while you enjoy unblocked games.";
      } else if (req.path === '/terms-of-service') {
        title = "Terms of Service | Classroom 6x";
        description = "Review the terms and conditions for using the Classroom 6x unblocked games platform.";
      } else if (req.path === '/blogs') {
        title = "Unblocked Games Blog & Guides | Classroom 6x";
        description = "Stay updated with the latest gaming trends, school-safe tips, and unblocked game reviews on our official blog.";
      } else if (req.path === '/') {
        // FAQ Schema for homepage
        const faqSchema = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": FAQS.slice(0, 10).map(f => ({
            "@type": "Question",
            "name": f.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": f.answer.replace(/<[^>]*>?/gm, '') // Strip HTML for schema
            }
          }))
        };
        schema.push(faqSchema);
      }

      if (breadcrumbs) schema.push(breadcrumbs);

      // Construct injection string
      // Final fallback for canonical if not already specialized
      const finalCanonical = (gameMatch && GAMES.find(g => g.id.toLowerCase() === gameMatch[1].toLowerCase())) 
        ? `${baseUrl}/game/${GAMES.find(g => g.id.toLowerCase() === gameMatch[1].toLowerCase())?.id.toLowerCase()}`
        : (blogMatch && BLOGS.find(b => b.id.toLowerCase() === blogMatch[1].toLowerCase()))
          ? `${baseUrl}/blog/${blogMatch[1].toLowerCase()}`
          : fullUrl.toLowerCase();

      const seoInjections = `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${finalCanonical}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${finalCanonical}" />
    <meta property="twitter:title" content="${title}" />
    <meta property="twitter:description" content="${description}" />
    <meta property="twitter:url" content="${finalCanonical}" />
    ${schema.map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n    ')}
  `;

      // Since index.html is now empty of these tags, we just inject before </head>
      html = html.replace('</head>', `${seoInjections}\n  </head>`);

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e: any) {
      vite?.ssrFixStacktrace(e);
      res.status(500).end(e.message);
    }
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
