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
      const url = req.path;
      const baseUrl = "https://classroom6x.store";

      // Explicitly handle sitemap.xml here to avoid issues with standard routes
      if (url === '/sitemap.xml' || url === '/sitemap') {
        const lastMod = new Date().toISOString().split('T')[0];
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
        xml += `\n  <url>\n    <loc>${baseUrl}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>`;
        xml += `\n  <url>\n    <loc>${baseUrl}/blogs</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`;
        GAMES.forEach(game => {
          xml += `\n  <url>\n    <loc>${baseUrl}/game/${game.id.toLowerCase()}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.9</priority>\n  </url>`;
        });
        BLOGS.forEach(blog => {
          xml += `\n  <url>\n    <loc>${baseUrl}/blog/${blog.id.toLowerCase()}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`;
        });
        const categories = ["action", "sports", "racing", "arcade", "puzzle", "shooter", "multiplayer", "fighting", "adventure", "drawing"];
        categories.forEach(cat => {
          xml += `\n  <url>\n    <loc>${baseUrl}/category/${cat}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>`;
        });
        ["/about-us", "/contact-us", "/privacy-policy", "/terms-of-service"].forEach(pth => {
          xml += `\n  <url>\n    <loc>${baseUrl}${pth}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.5</priority>\n  </url>`;
        });
        xml += '\n</urlset>';
        res.set("Content-Type", "application/xml; charset=utf-8");
        return res.status(200).send(xml);
      }

      const fullUrl = `${baseUrl}${url}`;
      
      let html: string;
      if (process.env.NODE_ENV !== "production") {
        html = fs.readFileSync(path.resolve(__dirname, "index.html"), "utf-8");
        html = await vite.transformIndexHtml(url, html);
      } else {
        html = fs.readFileSync(path.resolve(__dirname, "dist/index.html"), "utf-8");
      }

      // Determine content based on path
      let title = "Classroom 6x - Hub for Unblocked Games 6x & Best School Games";
      let description = "Classroom 6x Hub: The #1 destination for unblocked games 6x of 2026. Play Slope, Retro Bowl, Basket Random, and hundreds of best school games with zero lag.";
      let schema: any[] = [];
      let breadcrumbs: any = null;
      let rootContent = "";

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
      const pathFixes: Record<string, string> = {
        '/blogs': '/blogs',
        '/contact-us': '/contact-us',
        '/about-us': '/about-us',
        '/privacy-policy': '/privacy-policy',
        '/terms-of-service': '/terms-of-service'
      };

      const blogMatch = pathOnly.match(/^\/blog\/([a-z0-9-]+)$/i);
      const catMatch = pathOnly.match(/^\/category\/([a-z0-9-]+)$/i);
      const gameStrictMatch = pathOnly.match(/^\/game\/(.+)$/i);
      const gameBroadMatch = pathOnly.match(/^\/([a-z0-9-]+)$/i);

      if (gameStrictMatch || (gameBroadMatch && !pathFixes[pathOnly] && !catMatch && !blogMatch && pathOnly !== '/')) {
        const id = gameStrictMatch ? gameStrictMatch[1] : (gameBroadMatch ? gameBroadMatch[1] : "");
        const game = GAMES.find(g => g.id.toLowerCase() === id.toLowerCase());
        if (game) {
          title = `${game.title} Unblocked - Play Online | Classroom 6x`;
          description = game.description || `Play ${game.title} unblocked for free on Classroom 6x. The best school-friendly mirror for ${game.category} games of 2026.`;
          
          const canonicalUrl = `${baseUrl}/game/${game.id.toLowerCase()}`;
          
          rootContent = `
            <article style="padding: 20px; font-family: sans-serif; max-width: 800px; margin: 0 auto; line-height: 1.6;">
              <header>
                <h1>${game.title} Unblocked - Classroom 6x</h1>
                <p>Play <strong>${game.title}</strong> unblocked on Classroom 6x Hub. This game is optimized for performance and safety in school and work environments.</p>
              </header>
              <section>
                <h2>Game Information & Features</h2>
                <p>${game.description || `Experience the excitement of ${game.title} on our high-speed servers. This ${game.category} game has been highly requested by the community.`}</p>
                <ul>
                  <li><strong>Category:</strong> ${game.category}</li>
                  <li><strong>Rating:</strong> ${game.rating || "4.8"}/5</li>
                  <li><strong>Platform:</strong> Web Browser (Chromebook, Desktop, Tablet)</li>
                  <li><strong>Publisher:</strong> Featured on Classroom 6x</li>
                </ul>
              </section>
              <section>
                <h2>How to Play ${game.title} at School?</h2>
                <p>Navigating school firewalls can be tricky, but Classroom 6x provides a reliable mirror for <strong>${game.title} unblocked</strong>. Simply load this page, wait for the assets to fetch, and start playing immediately with zero downloads required. Our platform is built on advanced CDN technology to ensure minimal lag and high accessibility for chromebook students in 2026.</p>
              </section>
              <section>
                <h2>Why Choose Classroom 6x Hub?</h2>
                <p>Classroom 6x Hub is the #1 destination for <strong>unblocked games 6x</strong>. We curate the best school games, ensuring they are safe, fun, and educational. From Slope to Retro Bowl, we have everything a pro gamer needs to unwind during breaks. Join millions of users who trust our platform for its uptime and diverse game library.</p>
              </section>
              <footer>
                <a href="/">Explore More Unblocked Games on Classroom 6x Home</a>
              </footer>
            </article>
          `;

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
              "ratingCount": "1250"
            },
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
          });

          breadcrumbs = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
              { "@type": "ListItem", "position": 2, "name": game.category, "item": `${baseUrl}/category/${game.category.toLowerCase()}` },
              { "@type": "ListItem", "position": 3, "name": game.title, "item": canonicalUrl }
            ]
          };
        }
      } else if (blogMatch) {
        const id = blogMatch[1];
        const blog = BLOGS.find(b => b.id.toLowerCase() === id.toLowerCase());
        if (blog) {
          title = `${blog.title} | Classroom 6x Guides`;
          description = blog.excerpt;
          
          rootContent = `
            <article style="padding: 20px; font-family: sans-serif; max-width: 800px; margin: 0 auto; line-height: 1.6;">
              <header>
                <h1>${blog.title} - Classroom 6x Guide</h1>
                <p>Published by the Classroom 6x Editorial Team on April 19, 2026. Stay ahead with the latest in <strong>unblocked games 6x</strong>.</p>
              </header>
              <section>
                <div class="excerpt" style="font-weight: bold; margin-bottom: 20px; color: #555;">
                  ${blog.excerpt}
                </div>
                <div class="content">
                  ${blog.content}
                </div>
              </section>
              <section style="margin-top: 40px; background: #f9f9f9; padding: 20px; border-radius: 8px;">
                <h2>About Classroom 6x Blogs</h2>
                <p>Welcome to the official <strong>Classroom 6x Hub</strong> blog section. We provide in-depth guides, reviews, and latest news about <strong>unblocked games 6x</strong> and <strong>unblocked6x</strong> platforms. Our mission is to help students find safe and high-quality browser games that work on school networks and Chromebooks without the need for a VPN.</p>
              </section>
              <footer style="margin-top: 30px;">
                <a href="/blogs">Back to All Classroom 6x Guides</a>
              </footer>
            </article>
          `;

          schema.push({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": blog.title,
            "description": blog.excerpt,
            "author": { "@type": "Organization", "name": "Classroom 6x Team" },
            "publisher": organizationSchema,
            "datePublished": "2026-04-19T08:00:00Z",
            "image": "https://classroom6x.store/logo.png"
          });

          breadcrumbs = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
              { "@type": "ListItem", "position": 2, "name": "Blogs", "item": `${baseUrl}/blogs` },
              { "@type": "ListItem", "position": 3, "name": blog.title, "item": `${baseUrl}/blog/${blog.id}` }
            ]
          };
        }
      } else if (catMatch) {
        const catId = catMatch[1];
        const catName = catId.charAt(0).toUpperCase() + catId.slice(1);
        title = `Best ${catName} Unblocked Games | Classroom 6x Library`;
        description = `Explore our curated selection of the best ${catName} unblocked games. Play ${catName} online for free at school on Classroom 6x.`;
        
        rootContent = `
          <div style="padding: 20px; font-family: sans-serif; max-width: 800px; margin: 0 auto;">
            <h1>Best ${catName} Unblocked Games</h1>
            <p>Welcome to the <strong>${catName}</strong> category on Classroom 6x. Discover the most popular and latest ${catName} unblocked games for school.</p>
            <ul>
              ${GAMES.filter(g => g.category.toLowerCase() === catId).slice(0, 10).map(g => `<li><a href="/game/${g.id}">${g.title}</a></li>`).join('\n')}
            </ul>
            <a href="/">Back Home</a>
          </div>
        `;

        breadcrumbs = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
            { "@type": "ListItem", "position": 2, "name": catName, "item": `${baseUrl}/category/${catId}` }
          ]
        };
      } else if (pathOnly === '/contact-us') {
        title = "Contact Us | Classroom 6x Hub";
        description = "Get in touch with the Classroom 6x team for support, game requests, or feedback.";
        rootContent = `<div style="padding: 20px;"><h1>Contact Classroom 6x</h1><p>Email us at support@classroom6x.com</p></div>`;
      } else if (pathOnly === '/about-us') {
        title = "About Us | Classroom 6x Mission";
        description = "Learn more about the mission behind Classroom 6x and how we provide the best unblocked games.";
        rootContent = `<div style="padding: 20px;"><h1>About Classroom 6x</h1><p>The mission behind the games.</p></div>`;
      } else if (pathOnly === '/privacy-policy') {
        title = "Privacy Policy | Classroom 6x";
        description = "Read our privacy policy to understand how we protect your data while you enjoy unblocked games.";
        rootContent = `<div style="padding: 20px;"><h1>Privacy Policy</h1><p>Your privacy matters.</p></div>`;
      } else if (pathOnly === '/terms-of-service') {
        title = "Terms of Service | Classroom 6x";
        description = "Review the terms and conditions for using the Classroom 6x unblocked games platform.";
        rootContent = `<div style="padding: 20px;"><h1>Terms of Service</h1><p>Rules of the game.</p></div>`;
      } else if (pathOnly === '/blogs') {
        title = "Unblocked Games Blog & Guides | Classroom 6x Hub";
        description = "Stay updated with the latest gaming trends, school-safe tips, and unblocked game reviews on our official blog.";
        rootContent = `
          <div style="padding: 20px;">
            <h1>Unblocked Games Blog & Guides</h1>
            <ul>
              ${BLOGS.map(b => `<li><a href="/blog/${b.id}">${b.title}</a></li>`).join('\n')}
            </ul>
          </div>
        `;
      } else {
        // Home page
        rootContent = `
          <div style="padding: 20px; font-family: sans-serif; max-width: 800px; margin: 0 auto; line-height: 1.6;">
            <header>
              <h1>Classroom 6x Hub - The Ultimate Destination for Unblocked Games 6x</h1>
              <p>Welcome to <strong>Classroom 6x Hub</strong>, the premiere destination for <strong>unblocked games 6x</strong> and <strong>unblocked6x</strong> content in 2026. We provide a curated selection of high-performance browser games optimized for school and work environments. Play Slope, Retro Bowl, Basket Random, and hundreds of best school games with zero lag and no downloads.</p>
            </header>
            
            <section>
              <h2>Top Popular Unblocked Games</h2>
              <p>Discover our most played titles this week. These games are guaranteed to work on most school Chromebooks.</p>
              <ul style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                ${GAMES.slice(0, 40).map(g => `<li><a href="/game/${g.id.toLowerCase()}" title="${g.title} Unblocked">${g.title}</a></li>`).join('\n')}
              </ul>
            </section>

            <section>
              <h2>Games by Category</h2>
              <p>Browse our extensive library by genre to find exactly what you are looking for.</p>
              <ul style="display: flex; flex-wrap: wrap; gap: 15px; list-style: none; padding: 0;">
                ${["action", "sports", "racing", "arcade", "puzzle", "shooter", "multiplayer", "fighting", "adventure", "drawing"].map(cat => `<li><a href="/category/${cat}" style="text-transform: capitalize; font-weight: bold;">${cat} Games Unblocked</a></li>`).join('\n')}
              </ul>
            </section>

            <section>
              <h2>Unblocked Gaming Guides & Blog</h2>
              <p>Learn how to master your favorite games and stay updated with school gaming trends.</p>
              <ul>
                ${BLOGS.slice(0, 15).map(b => `<li><a href="/blog/${b.id.toLowerCase()}">${b.title}</a></li>`).join('\n')}
                <li><a href="/blogs">Visit the Classroom 6x Hub Blog Hub</a></li>
              </ul>
            </section>

            <section>
              <h2>Why Classroom 6x is the Best Choice for Students</h2>
              <p>Classroom 6x is designed from the ground up to be the most resilient and fast <strong>unblocked games 6x</strong> platform. Unlike other sites that get blocked easily, we use multiple mirrors and advanced proxy techniques to keep the games accessible. Whether you are looking for <strong>survivor io unblocked classroom 6x</strong> or <strong>mario 64 classroom 6x</strong>, our Hub is your safe haven for gaming.</p>
              <p>Our commitment to quality means no annoying pop-ups, no invasive tracking, and a clean interface that respects your time and school environment. Bookmark <strong>Classroom 6x Store</strong> today and never be bored during your study breaks again.</p>
            </section>
          </div>
        `;
        
        const faqSchema = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": FAQS.slice(0, 10).map(f => ({
            "@type": "Question",
            "name": f.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": f.answer.replace(/<[^>]*>?/gm, '')
            }
          }))
        };
        schema.push(faqSchema);
      }

      if (breadcrumbs) schema.push(breadcrumbs);

      // Final fallback for canonical if not already specialized correctly
      let finalCanonical = fullUrl.toLowerCase().replace(/\/+$/, '') || baseUrl;
      if (gameStrictMatch || (gameBroadMatch && !pathFixes[pathOnly] && !catMatch && !blogMatch && pathOnly !== '/')) {
        const id = gameStrictMatch ? gameStrictMatch[1] : (gameBroadMatch ? gameBroadMatch[1] : "");
        const game = GAMES.find(g => g.id.toLowerCase() === id.toLowerCase());
        if (game) finalCanonical = `${baseUrl}/game/${game.id.toLowerCase()}`;
      } else if (blogMatch) {
         const id = blogMatch[1];
         const blog = BLOGS.find(b => b.id.toLowerCase() === id.toLowerCase());
         if (blog) finalCanonical = `${baseUrl}/blog/${blog.id.toLowerCase()}`;
      } else if (catMatch) {
         finalCanonical = `${baseUrl}/category/${catMatch[1].toLowerCase()}`;
      }

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

      // Define a standard footer link block for SSR to prevent orphan pages
      const ssrFooter = `
        <nav style="margin-top: 50px; padding: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
          <h3>Unblocked Games Library</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px;">
            ${GAMES.map(g => `<a href="/game/${g.id.toLowerCase()}">${g.title}</a>`).join('')}
          </div>
          
          <h3>Game Categories</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 15px;">
            ${["action", "sports", "racing", "arcade", "puzzle", "shooter", "multiplayer", "fighting", "adventure", "drawing"].map(cat => `<a href="/category/${cat}">${cat.charAt(0).toUpperCase() + cat.slice(1)} Games Unblocked</a>`).join('')}
          </div>

          <h3>Gaming Guides & Knowledge</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 15px;">
            ${BLOGS.map(b => `<a href="/blog/${b.id.toLowerCase()}">${b.title}</a>`).join('')}
            <a href="/blogs">All Blogs</a>
          </div>

          <h3>Site Information</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 15px;">
            <a href="/about-us">About Us</a>
            <a href="/contact-us">Contact Us</a>
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/terms-of-service">Terms of Service</a>
            <a href="/sitemap.xml">Sitemap</a>
            <a href="/">Home</a>
          </div>
        </nav>
      `;

      const finalRootContent = rootContent + ssrFooter;

      // Robust replacement using stable markers
      html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
      html = html.replace('<meta name="seo-meta-tag" content="injection-point" />', seoInjections);
      html = html.replace('SSR_CONTENT_STUB', finalRootContent);

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
