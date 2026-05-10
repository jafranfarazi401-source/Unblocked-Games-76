import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Play, 
  Search, 
  Gamepad2, 
  Trophy, 
  Flame, 
  Clock, 
  ChevronRight,
  Menu,
  X,
  Star,
  Loader2,
  Youtube,
  BookOpen,
  ArrowLeft,
  ShieldCheck,
  Facebook
} from 'lucide-react';
import SEO from './components/SEO';
import { GAMES as GAMES_DATA, BLOGS as BLOGS_DATA, FAQS as FAQS_DATA, NAV_TABS as NAV_TABS_DATA, CATEGORY_DESCRIPTIONS as CATEGORY_DESCRIPTIONS_DATA } from './data';

// Data migrated to data.ts, constants used from imports
const GAMES = GAMES_DATA;
const BLOGS = BLOGS_DATA;
const FAQS = FAQS_DATA;
const NAV_TABS = NAV_TABS_DATA;
const CATEGORY_DESCRIPTIONS = CATEGORY_DESCRIPTIONS_DATA;

const AdBanner = () => {
  const adContent = `
    <html>
      <body style="margin: 0; padding: 0; overflow: hidden;">
        <script type="text/javascript">
          // Fix for "Cannot set property fetch of #<Window> which has only a getter"
          try {
            if (window.fetch && (Object.getOwnPropertyDescriptor(window, 'fetch') || {}).get) {
              const originalFetch = window.fetch;
              Object.defineProperty(window, 'fetch', {
                value: originalFetch,
                writable: true,
                configurable: true
              });
            }
          } catch (e) {
            console.error('Failed to patch fetch:', e);
          }

          atOptions = {
            'key' : 'b5db419380bcec72a0ea8fc0440e63b5',
            'format' : 'iframe',
            'height' : 50,
            'width' : 320,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://www.highperformanceformat.com/b5db419380bcec72a0ea8fc0440e63b5/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <div className="w-[320px] h-[50px] bg-black/5 border border-black/10 rounded-lg flex items-center justify-center overflow-hidden glass">
      <iframe
        srcDoc={adContent}
        width="320"
        height="50"
        frameBorder="0"
        scrolling="no"
        title="Ad"
        className="w-full h-full"
      />
    </div>
  );
};

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("Home");
  const [activePage, setActivePage] = useState<string | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Domain Protection & Cannonical Redirection logic
  useEffect(() => {
    // force only main domain (no www, no workers.dev, no others)
    const hostname = window.location.hostname;
    
    // Safety check: Don't redirect in development or preview environments
    const isDev = hostname === 'localhost' || 
                  hostname === '127.0.0.1' || 
                  hostname.includes('asia-east1.run.app') || 
                  hostname.includes('google.com') ||
                  hostname.includes('webcontainer.io');

    if (!isDev && hostname !== "classroom6x.store") {
      window.location.replace(`https://classroom6x.store${window.location.pathname}${window.location.search}`);
    }
  }, []);

  // SEO: Pseudo-Router to handle deep links for Games and Blogs
  useEffect(() => {
    const path = location.pathname;
    const lowerPath = path.toLowerCase();
    
    // Normalize case: if path has uppercase, redirect to lowercase (unless it's a known non-lowercase path if any exist)
    // Also remove trailing slash if not home
    if (path !== '/' && (/[A-Z]/.test(path) || path.endsWith('/')) && !path.includes('://')) {
      const normalizedPath = lowerPath.replace(/\/+$/, '') || '/';
      if (normalizedPath !== path) {
        navigate(normalizedPath, { replace: true });
        return;
      }
    }

    // Specific Redirects for legacy or weird paths found in logs/reports
    const legacyRedirects: Record<string, string> = {
      '/game/ragdoll/hit/unblocked/games-6x': '/game/ragdoll-hit',
      '/ragdoll/hit/unblocked/games-6x': '/game/ragdoll-hit',
      '/game/ragdoll-hit-unblocked': '/game/ragdoll-hit',
      '/www.classroom6x.store': '/',
      '/classroom6x.store': '/'
    };

    if (legacyRedirects[lowerPath]) {
      navigate(legacyRedirects[lowerPath], { replace: true });
      return;
    }
    
    // Check for Game paths (/game/id or /id)
    const gameMatch = lowerPath.match(/^\/game\/(.+)$/) || lowerPath.match(/^\/([a-z0-9-]+)$/);
    const staticPages = ["contact-us", "about-us", "privacy-policy", "terms-of-service", "blogs", "category", "blog"];

    if (gameMatch && !staticPages.includes(gameMatch[1])) {
      const id = gameMatch[1];
      const game = GAMES.find(g => g.id.toLowerCase() === id.toLowerCase());
      if (game) {
        setSelectedGame(game);
        setSelectedBlog(null);
        setActivePage(null);
        return;
      }
    }

    // Check for Blog paths (/blog/title)
    const blogMatch = path.match(/^\/blog\/([a-z0-9-]+)$/);
    if (blogMatch) {
      const id = blogMatch[1];
      const blog = BLOGS.find(b => b.id === id);
      if (blog) {
        setSelectedBlog(blog);
        setSelectedGame(null);
        setActivePage(null);
        return;
      }
    }

    // Check for Categories via URL
    const categoryMatch = path.match(/^\/category\/([a-z0-9-]+)$/);
    if (categoryMatch) {
      const catId = categoryMatch[1];
      const category = NAV_TABS.find(t => t.toLowerCase() === catId);
      if (category) {
        setActiveTab(category);
        setSelectedGame(null);
        setSelectedBlog(null);
        setActivePage(null);
        return;
      }
    }

    // Handle pages Mapping
    const pagesMap: Record<string, string> = {
      '/contact-us': 'Contact Us',
      '/about-us': 'About Us',
      '/privacy-policy': 'Privacy Policy',
      '/terms-of-service': 'Terms of Service',
      '/blogs': 'Blogs'
    };

    if (pagesMap[path]) {
      if (pagesMap[path] === 'Blogs') {
        setActiveTab('Blogs');
        setSelectedGame(null);
        setSelectedBlog(null);
        setActivePage(null);
      } else {
        setActivePage(pagesMap[path]);
        setSelectedGame(null);
        setSelectedBlog(null);
      }
      return;
    }

    // Default to Home
    if (path === '/' || path === '') {
      setSelectedGame(null);
      setSelectedBlog(null);
      setActivePage(null);
      setActiveTab("Home");
    }

  }, [location.pathname]);

  // Filtered games based on activeTab and searchQuery
  const filteredGames = GAMES.filter(game => {
    const matchesCategory = activeTab === "Home" || game.category === activeTab;
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          game.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (isCategoriesOpen && !(e.target as HTMLElement).closest('.categories-dropdown-container')) {
        setIsCategoriesOpen(false);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCategoriesOpen]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedGame, selectedBlog, activePage, activeTab, location.search]);

  const seoData = useMemo(() => {
    const baseUrl = "https://classroom6x.store";
    const siteName = "Classroom6x";
    
    let title = "Classroom 6x - Hub for Unblocked Games 6x & Best School Games";
    let description = "Classroom 6x Hub: Play the best unblocked games 6x for school. Enjoy Slope, Retro Bowl, Basket Random, and hundreds of best school games with zero lag and no downloads.";
    let canonicalPath = "/";
    let type: 'website' | 'article' | 'game' | 'collection' = 'website';
    let image = "https://classroom6x.store/logo.png";
    let noindex = false;
    let schemas: any[] = [];

    // Base Organization Schema
    const orgSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Classroom6x",
      "url": baseUrl,
      "logo": `${baseUrl}/logo.png`,
      "sameAs": ["https://facebook.com/classroom6x"]
    };

    if (selectedGame) {
      title = `${selectedGame.title} Unblocked - Play Online | Classroom 6x`;
      description = selectedGame.description || `Play ${selectedGame.title} unblocked on Classroom 6x. Experience ${selectedGame.shortDesc} and join thousands of students playing the best school-friendly games online.`;
      canonicalPath = `/game/${selectedGame.id.toLowerCase()}`;
      type = 'game';
      image = selectedGame.image;
      
      const gameSchema = {
        "@context": "https://schema.org",
        "@type": "VideoGame",
        "name": selectedGame.title,
        "description": description,
        "genre": selectedGame.category,
        "operatingSystem": "Browser",
        "applicationCategory": "Game",
        "image": selectedGame.image,
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": selectedGame.rating || "4.8",
          "ratingCount": "1250"
        },
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
      };

      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
          { "@type": "ListItem", "position": 2, "name": selectedGame.category, "item": `${baseUrl}/category/${selectedGame.category.toLowerCase()}` },
          { "@type": "ListItem", "position": 3, "name": selectedGame.title, "item": `${baseUrl}${canonicalPath}` }
        ]
      };
      
      schemas = [gameSchema, breadcrumbSchema];
    } else if (selectedBlog) {
      title = `${selectedBlog.title} | Classroom 6x Guides`;
      description = selectedBlog.excerpt || `Read our guide about ${selectedBlog.title} on Classroom 6x.`;
      canonicalPath = `/blog/${selectedBlog.id}`;
      type = 'article';
      
      const blogSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": selectedBlog.title,
        "description": description,
        "author": { "@type": "Organization", "name": "Classroom 6x Team" },
        "publisher": orgSchema,
        "datePublished": "2026-04-19T08:00:00Z",
        "image": image,
        "url": `${baseUrl}${canonicalPath}`
      };

      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
          { "@type": "ListItem", "position": 2, "name": "Blogs", "item": `${baseUrl}/blogs` },
          { "@type": "ListItem", "position": 3, "name": selectedBlog.title, "item": `${baseUrl}${canonicalPath}` }
        ]
      };
      
      schemas = [blogSchema, breadcrumbSchema];
    } else if (activePage || activeTab === "Blogs") {
      const pageName = activePage || activeTab;
      title = `${pageName} | Classroom 6x`;
      
      if (pageName === "Blogs") {
        description = "Stay updated with the latest unblocked games news, guides, and tips on the Classroom 6x Blog. Discover how to play your favorite titles at school.";
      } else {
        description = `Learn more about our ${pageName} and how we provide a safe, high-performance unblocked gaming experience for students at Classroom 6x.`;
      }
      
      canonicalPath = `/${pageName.toLowerCase().replace(/\s+/g, '-')}`;
      
      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
          { "@type": "ListItem", "position": 2, "name": pageName, "item": `${baseUrl}${canonicalPath}` }
        ]
      };
      schemas = [breadcrumbSchema];
    } else if (activeTab !== "Home") {
      title = `Best ${activeTab} Unblocked Games | Classroom 6x`;
      description = CATEGORY_DESCRIPTIONS[activeTab] || `Explore the best collection of ${activeTab} unblocked games on Classroom 6x.`;
      canonicalPath = `/category/${activeTab.toLowerCase()}`;
      type = 'collection';
      
      const collectionSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": `${activeTab} Unblocked Games`,
        "description": description,
        "url": `${baseUrl}${canonicalPath}`
      };

      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
          { "@type": "ListItem", "position": 2, "name": activeTab, "item": `${baseUrl}${canonicalPath}` }
        ]
      };
      schemas = [collectionSchema, breadcrumbSchema];
    } else {
      title = "Classroom 6x - Hub for Unblocked Games 6x & Best School Games";
      description = "Classroom 6x Hub: Play the best unblocked games 6x for school. Enjoy Slope, Retro Bowl, Basket Random, and hundreds of best school games with zero lag and no downloads.";
      noindex = location.search.includes('s=') || (location.pathname !== '/' && location.pathname !== '');
      canonicalPath = "/";
      
      const webSiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": siteName,
        "url": baseUrl,
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${baseUrl}/?s={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      };

      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": FAQS.slice(0, 10).map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer.replace(/<[^>]*>?/gm, "")
          }
        }))
      };
      
      schemas = [webSiteSchema, orgSchema, faqSchema];
    }

    return { title, description, canonicalPath, type, image, noindex, schemas };
  }, [selectedGame, selectedBlog, activePage, activeTab, location.search]);

  const handleLogoClick = () => {
    navigate('/');
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <SEO 
        title={seoData.title}
        description={seoData.description}
        canonicalPath={seoData.canonicalPath}
        type={seoData.type as any}
        image={seoData.image}
        noindex={seoData.noindex}
        schema={seoData.schemas}
      />
      {/* Mouse Follower Object */}
      <div 
        className="mouse-follower hidden lg:block"
        style={{ 
          left: `${mousePos.x}px`, 
          top: `${mousePos.y}px` 
        }}
      />

      {/* Navbar - Redesigned for a cleaner, more premium look */}
      <nav className="sticky top-0 z-50 px-6 py-4 mx-4 mt-4 glass rounded-2xl border border-black/10 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-3 cursor-pointer group shrink-0" onClick={handleLogoClick}>
          <div className="w-10 h-10 bg-brand-purple rounded-xl flex items-center justify-center shrink-0 purple-glow group-hover:scale-110 transition-transform">
            <Gamepad2 className="text-white" size={24} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-xl tracking-wider text-slate-900">CLASSROOM</span>
            <span className="font-display text-sm tracking-[0.2em] text-brand-purple">6X</span>
          </div>
        </div>

        {/* Center: Navigation (Hidden on mobile) */}
        <div className="hidden md:flex items-center gap-4 text-xs font-bold uppercase tracking-widest">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleLogoClick();
            }}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === "Home" && !selectedGame 
                ? "bg-brand-purple text-white shadow-lg shadow-brand-purple/20" 
                : "text-slate-500 hover:text-slate-900 hover:bg-black/5"
            }`}
          >
            Home
          </a>

          <a
            href="#directory"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
              setTimeout(() => {
                document.getElementById('games-grid')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-black/5 border border-transparent hover:border-black/5 transition-all"
          >
            Directory
          </a>

          <div className="relative categories-dropdown-container">
            <button
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                isCategoriesOpen || (activeTab !== "Home" && !selectedGame && activeTab !== "Blogs")
                  ? "bg-brand-purple text-white shadow-lg shadow-brand-purple/20" 
                  : "text-slate-500 hover:text-slate-900 hover:bg-black/5"
              }`}
            >
              Categories <ChevronRight size={14} className={`transition-transform duration-300 ${isCategoriesOpen ? 'rotate-90' : ''}`} />
            </button>

            <AnimatePresence>
              {isCategoriesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full left-0 mt-2 w-64 glass rounded-2xl p-4 shadow-2xl border border-black/5 z-[60]"
                >
                  <div className="grid grid-cols-2 gap-2">
                    {NAV_TABS.filter(tab => !["Home", "Blogs"].includes(tab)).map((tab) => (
                      <a
                        key={tab}
                        href={`/category/${tab.toLowerCase()}`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/category/${tab.toLowerCase()}`);
                          setIsCategoriesOpen(false);
                        }}
                        className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all text-left ${
                          activeTab === tab && !selectedGame && !selectedBlog
                            ? "bg-brand-purple/10 text-brand-purple" 
                            : "text-slate-500 hover:bg-black/5 hover:text-slate-900"
                        }`}
                      >
                        {tab}
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a
            href="/blogs"
            onClick={(e) => {
              e.preventDefault();
              navigate('/blogs');
            }}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === "Blogs"
                ? "bg-brand-purple text-white shadow-lg shadow-brand-purple/20" 
                : "text-slate-500 hover:text-slate-900 hover:bg-black/5"
            }`}
          >
            Blogs
          </a>
        </div>

        {/* Right: Actions & Status */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider whitespace-nowrap">Live</span>
          </div>
          
          <button 
            className="p-2 hover:bg-white/10 rounded-xl transition-colors md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <div className="hidden lg:flex items-center gap-2 text-black/20">
            <div className="w-px h-4 bg-black/10 mx-2" />
            <div className="relative flex items-center">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.input
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 200, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    type="text"
                    placeholder="Search games..."
                    className="bg-black/5 border border-black/10 rounded-xl px-4 py-1.5 text-xs outline-none focus:border-brand-purple/50 text-slate-900 placeholder:text-slate-400 mr-2"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                )}
              </AnimatePresence>
              <Search 
                size={18} 
                className={`cursor-pointer transition-colors ${isSearchOpen ? 'text-brand-purple' : 'hover:text-brand-purple'}`} 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-4 top-24 z-40 glass rounded-2xl p-6 md:hidden"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 px-4 py-2 mb-2 border-b border-black/5 pb-4">
                <div className="w-10 h-10 bg-brand-purple rounded-xl flex items-center justify-center purple-glow">
                  <Gamepad2 className="text-white" size={24} />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="font-display text-xl tracking-wider text-slate-900">CLASSROOM</span>
                  <span className="font-display text-sm tracking-[0.2em] text-brand-purple">6X</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  navigate('/');
                  setIsMenuOpen(false);
                  setTimeout(() => {
                    document.getElementById('games-grid')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="text-left py-3 px-4 rounded-xl text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 hover:bg-black/5 transition-all border border-black/5"
              >
                Browse All Directory
              </button>
              {NAV_TABS.map((tab) => (
                <button
                  key={tab}
                  className={`text-left py-3 px-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${
                    activeTab === tab && !selectedGame 
                      ? "bg-brand-purple text-white shadow-lg" 
                      : "text-slate-500 hover:text-slate-900 hover:bg-black/5"
                  }`}
                  onClick={() => {
                    navigate(tab === "Home" ? "/" : tab === "Blogs" ? "/blogs" : `/category/${tab.toLowerCase()}`);
                    setIsMenuOpen(false);
                  }}
                >
                  {tab}
                </button>
              ))}
              <div className="h-px bg-black/5 mx-4 my-2" />
              {["Contact Us", "Privacy Policy", "Terms of Service"].map((page) => (
                <button
                  key={page}
                  className={`text-left py-3 px-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${
                    activePage === page 
                      ? "bg-brand-purple text-white shadow-lg" 
                      : "text-slate-400 hover:text-slate-900 hover:bg-black/5"
                  }`}
                  onClick={() => {
                    navigate(`/${page.toLowerCase().replace(/ /g, '-')}`);
                    setIsMenuOpen(false);
                  }}
                >
                  {page}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-4 relative z-10">
        {activePage ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto glass rounded-3xl p-8 md:p-12 space-y-12"
          >
            <div className="flex items-center justify-between">
              <h1 className="text-4xl md:text-5xl font-display uppercase tracking-tight text-gradient">
                {activePage}
              </h1>
              <button 
                onClick={() => navigate('/')}
                className="p-3 glass rounded-2xl hover:bg-black/5 transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="prose prose-slate max-w-none text-slate-600 space-y-8">
              {activePage === "Contact Us" && (
                <div className="space-y-12">
                  <div className="space-y-6">
                    <h2 className="text-3xl font-display uppercase tracking-tight text-gradient">Get in Touch with Classroom 6x</h2>
                    <p className="text-lg leading-relaxed">
                      We value our community of students, teachers, and gamers. Whether you have found a technical issue with a specific unblocked game, have a suggestion for a new title, or want to discuss business opportunities, our dedicated team is here to help. At <strong>Classroom 6x</strong>, your feedback is the engine that drives our platform's growth and ensures we remain the best destination for unblocked gaming at school.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="glass p-8 rounded-3xl space-y-4 border-l-4 border-brand-purple">
                      <div className="flex items-center gap-3 text-brand-purple">
                        <Loader2 className="animate-spin" size={20} />
                        <h3 className="font-bold text-slate-900 uppercase tracking-widest text-sm">Priority Email Support</h3>
                      </div>
                      <p className="text-slate-500 text-sm">For game-related technical support, report a broken mirror, or general inquiries.</p>
                      <p className="text-brand-purple font-bold text-xl select-all">support@classroom6x.com</p>
                    </div>
                    <div className="glass p-8 rounded-3xl space-y-4 border-l-4 border-brand-purple">
                      <div className="flex items-center gap-3 text-brand-purple">
                        <ShieldCheck size={20} />
                        <h3 className="font-bold text-slate-900 uppercase tracking-widest text-sm">Business & Advertising</h3>
                      </div>
                      <p className="text-slate-500 text-sm">For partnerships, server sponsorships, and detailed advertising inquiries.</p>
                      <p className="text-brand-purple font-bold text-xl select-all">business@classroom6x.com</p>
                    </div>
                  </div>

                  <div className="glass p-8 lg:p-12 rounded-[2rem] space-y-8 bg-brand-purple/5">
                    <div className="space-y-2">
                       <h3 className="text-2xl font-bold text-slate-900">Direct Support Message</h3>
                       <p className="text-slate-500">Expect a response within 24-48 hours during standard business days.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Your Name</label>
                        <input type="text" placeholder="e.g., John Doe" className="w-full bg-white border border-black/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-purple/50 transition-all font-medium" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Your Email Address</label>
                        <input type="email" placeholder="e.g., name@school.edu" className="w-full bg-white border border-black/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-purple/50 transition-all font-medium" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">Message Details</label>
                      <textarea placeholder="Describe how we can help you today..." rows={6} className="w-full bg-white border border-black/10 rounded-2xl px-6 py-4 outline-none focus:border-brand-purple/50 resize-none transition-all font-medium"></textarea>
                    </div>
                    <button className="w-full py-5 bg-brand-purple text-white font-bold rounded-2xl shadow-xl shadow-brand-purple/20 hover:scale-[1.02] transition-all uppercase tracking-widest text-sm">
                      Submit Official Inquiry
                    </button>
                  </div>

                  <div className="space-y-6 pt-12 border-t border-black/5">
                    <h3 className="text-2xl font-bold text-slate-900">Why Contact Us?</h3>
                    <p className="text-slate-600 leading-relaxed">
                      At Classroom 6x, we pride ourselves on being a community-first platform. We actively monitor the "unblocked games" landscape daily to ensure our mirrors remain active and our library is populated with the trends students care about most. Whether it's a request to add <span className="text-brand-purple">new categories</span> or a technical request to fix the physics in a 3D racer like <em>Slope</em>, we listen to every message.
                    </p>
                  </div>
                </div>
              )}

              {activePage === "About Us" && (
                <div className="space-y-10">
                   <header className="space-y-6">
                    <h1 className="text-4xl md:text-5xl font-display uppercase tracking-tight text-gradient leading-tight">About Classroom 6x: The Mission Behind the Games</h1>
                    <p className="text-lg leading-relaxed">
                      Founded with a simple vision—to provide students with a safe, reliable, and high-performance sanctuary for digital entertainment—<strong>Classroom 6x</strong> has grown into the world's most trusted hub for unblocked gaming. We understand that the modern classroom can be intense, and a well-timed five-minute break can be the difference between burnout and a productive study session.
                    </p>
                  </header>

                  <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold text-slate-900">Our History</h3>
                      <p className="text-slate-600 leading-relaxed">
                        The "Classroom 6x" project began in the early 2020s as a small collection of optimized HTML5 mirrors. While other sites were cluttered with intrusive ads and slow-loading Flash files, we focused on "The 6x Standard": lightweight assets, zero installations, and immediate accessibility. 
                      </p>
                      <p className="text-slate-600 leading-relaxed">
                        By 2026, we have expanded our infrastructure to support millions of monthly active users across the globe. Our engineering team, led by <strong>Azim Alam Jafran (Jafran Farazi)</strong>, continues to innovate with advanced CDN routing and edge-level mirroring to bypass restrictive school firewalls securely and responsibly.
                      </p>
                    </div>
                    <img 
                      src="https://picsum.photos/seed/about1/600/400" 
                      className="rounded-3xl shadow-2xl" 
                      alt="Classroom 6x team working on unblocked games infrastructure" 
                      referrerPolicy="no-referrer"
                    />
                  </section>

                  <section className="space-y-6 glass p-8 rounded-[2rem] border-l-8 border-brand-purple">
                    <h3 className="text-2xl font-bold text-slate-900">The 6x Philosophy: Why We Do what We Do</h3>
                    <p className="text-slate-600 leading-relaxed">
                      We believe that "Unblocked Gaming" is not about distraction—it's about <strong>accessibility</strong>. Access to fun shouldn't be limited by your Choice of hardware or your location. Whether you are using a top-tier gaming PC or a five-year-old school Chromebook, the experience on <strong>Classroom 6x</strong> should be identical: fast, clean, and fun.
                    </p>
                    <ul className="list-disc pl-6 space-y-3 text-slate-600">
                      <li><strong>Security First:</strong> Every game mirror is vetted for malicious scripts and school-inappropriate content.</li>
                      <li><strong>Performance Always:</strong> We optimize every byte to ensure lag-free play on restricted networks.</li>
                      <li><strong>Community Driven:</strong> Our library is shaped by the requests and feedback of students like you.</li>
                    </ul>
                  </section>

                  <section className="space-y-6">
                    <h3 className="text-2xl font-bold text-slate-900">Looking Ahead: The Road to 2027</h3>
                    <p className="text-slate-600 leading-relaxed">
                      As we look toward the future of 2026 and beyond, Classroom 6x is committed to remaining the #1 destination for unblocked content. We are currently developing advanced social features and local-multiplayer enhancements that will make school breaks even more collaborative. Our goal is to expand into educational-adjacent categories, such as interactive logic puzzles and typing simulators, ensuring our library provides value beyond just entertainment.
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                      We are also investing heavily in "Privacy-First" server technology. By utilizing edge computing, we can deliver games without ever needing to store your personal data centrally. This ensures that your experience on Classroom 6x is not just fun, but the most secure way to enjoy unblocked games at school. Thank you for being a part of our journey as we redefine what browser gaming can be.
                    </p>
                  </section>

                  <div className="pt-12 mt-12 border-t border-black/5 flex justify-center">
                    <button 
                       onClick={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                       className="px-10 py-4 bg-brand-purple text-white font-bold rounded-2xl shadow-xl shadow-brand-purple/20 hover:scale-105 transition-all uppercase tracking-widest text-xs"
                    >
                      Back to Gaming Hub
                    </button>
                  </div>
                </div>
              )}

              {activePage === "Privacy Policy" && (
                <div className="space-y-10">
                  <header className="space-y-6">
                    <h1 className="text-4xl md:text-5xl font-display uppercase tracking-tight text-gradient leading-tight">Privacy Policy – Classroom 6x Hub</h1>
                    <p className="text-lg text-slate-500 bg-black/5 p-4 rounded-xl border-l-4 border-brand-purple italic">Last Updated: April 19, 2026</p>
                    <p className="text-lg leading-relaxed">
                      Your privacy is a cornerstone of the <strong>Classroom 6x</strong> mission. We recognize that students and educators require a safe, anonymous, and secure environment to enjoy unblocked gaming content. This Privacy Policy outlines our commitment to data transparency and the technical safeguards we implement to protect our users.
                    </p>
                  </header>

                  <section className="space-y-6">
                    <h3 className="text-2xl font-bold text-slate-900 border-b border-black/5 pb-2">1. Data Collection Philosophy</h3>
                    <p>
                      At <strong>Classroom 6x unblocked</strong>, we operate under a "Privacy by Design" model. We <strong>do not</strong> require users to create accounts, provide emails, or link social media profiles to play our games. Every session is anonymous. We may collect non-personal, aggregated usage data (such as browser type, time spent per game, and entry pages) solely to improve our server infrastructure and ensure the site remains fast and accessible on restricted school networks.
                    </p>
                  </section>

                  <section className="space-y-6">
                    <h3 className="text-2xl font-bold text-slate-900 border-b border-black/5 pb-2">2. Use of Local Storage & Cookies</h3>
                    <p>
                      To enhance your gaming experience, we utilize standard browser technologies like <em>localStorage</em> and first-party cookies. These are used only to save your game progress (such as high scores in <strong>Slope</strong> or team stats in <strong>Retro Bowl</strong>) and your site preferences (like Dark Mode settings). This data never leaves your device and is not used for tracking across other websites.
                    </p>
                  </section>

                  <section className="space-y-6">
                    <h3 className="text-2xl font-bold text-slate-900 border-b border-black/5 pb-2">3. Third-Party Integrations & Advertising</h3>
                    <p>
                      As an aggregator of unblocked content, Classroom 6x hosts games developed by various third-party creators. These developers and our advertising partners (such as Google AdSense and other family-friendly ad networks) may utilize technical identifiers, including cookies and pixel tags, which are beyond our direct technical control. These technologies are generally used to serve non-personalized, family-friendly advertisements that fund the free operation of our platform.
                    </p>
                    <p>
                      We strictly mandate that our ad partners remain compliant with data protection standards. We encourage every user to consult the individual privacy policies of these providers for more detailed information. It is our policy to periodically audit our ad implementations to ensure that no overly intrusive tracking technologies are being deployed on the Classroom 6x domain, maintaining our commitment to a student-safe environment.
                    </p>
                  </section>

                  <section className="space-y-6">
                    <h3 className="text-2xl font-bold text-slate-900 border-b border-black/5 pb-2">4. Children's Privacy (COPPA Compliance)</h3>
                    <p>
                      Classroom 6x is designed to be a safe gateway for all students. We do not knowingly collect or solicit any personal information from children under the age of 13. While our content is vetted for school-appropriate themes, we recommend that parents and educators monitor gaming sessions to ensure alignment with local educational policies.
                    </p>
                  </section>

                  <section className="space-y-6">
                    <h3 className="text-2xl font-bold text-slate-900 border-b border-black/5 pb-2">5. Updates and Security</h3>
                    <p>
                      Our servers are protected with industry-standard SSL encryption to ensure that your connection to <strong>Classroom 6x</strong> is always secure. As web standards evolve, we will update this policy accordingly. Your continued use of the site constitutes your acceptance of these high standards of privacy.
                    </p>
                  </section>
                  
                  <div className="pt-12 mt-12 border-t border-black/5">
                    <h4 className="font-bold text-slate-900 mb-6 text-xl">Quick Access to Popular Games:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {GAMES.slice(0, 8).map(game => (
                        <a 
                          key={`privacy-game-${game.id}`}
                          href={`/game/${game.id}`}
                          onClick={(e) => { e.preventDefault(); navigate(`/game/${game.id}`); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          className="glass p-4 rounded-xl flex flex-col items-center gap-3 hover:border-brand-purple/30 group transition-all"
                        >
                          <img 
                            src={game.image} 
                            className="w-12 h-12 rounded-lg object-cover group-hover:scale-105 transition-transform" 
                            alt={game.title} 
                            referrerPolicy="no-referrer"
                            onError={(e) => { e.currentTarget.src = "https://picsum.photos/seed/game/100/100"; }}
                          />
                          <span className="text-[10px] font-bold text-slate-600 group-hover:text-brand-purple transition-colors text-center truncate w-full">{game.title.split(' ')[0]}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activePage === "Terms of Service" && (
                <div className="space-y-10">
                  <header className="space-y-6">
                    <h1 className="text-4xl md:text-5xl font-display uppercase tracking-tight text-gradient leading-tight">Terms of Service – Classroom 6x</h1>
                    <p className="text-lg text-slate-500 bg-black/5 p-4 rounded-xl border-l-4 border-brand-purple italic">Binding Agreement: April 2026</p>
                    <p className="text-lg leading-relaxed">
                      By accessing and using <strong>Classroom 6x</strong>, you confirm your acceptance of these Terms of Service. Our goal is to provide a premier unblocked gaming experience while ensuring the security and integrity of our platform and its community.
                    </p>
                  </header>

                  <section className="space-y-6">
                    <h3 className="text-2xl font-bold text-slate-900 border-b border-black/5 pb-2">1. Permitted and Prohibited Use</h3>
                    <p>
                      Classroom 6x is provided for personal, non-commercial entertainment purposes. You agree to use the site in compliance with all local laws and your respective school or workplace internet usage policies. Prohibited activities include, but are not limited to: bypassing security protocols, scraping site content, hosting malicious scripts, or attempting to compromise the availability of our mirrors via DDoS or automated traffic.
                    </p>
                  </section>

                  <section className="space-y-6">
                    <h3 className="text-2xl font-bold text-slate-900 border-b border-black/5 pb-2">2. Intellectual Property Rights</h3>
                    <p>
                      All software, design elements, graphics, and trade names (including the <strong>Classroom 6x</strong> brand) are the exclusive property of their respective owners. The games hosted on our platform are the intellectual property of their developers. We act as a portal and aggregator for this content. You are prohibited from redistributing, modifying, or commercially exploiting any content from our site without explicit written permission from the copyright holders.
                    </p>
                  </section>

                  <section className="space-y-6">
                    <h3 className="text-2xl font-bold text-slate-900 border-b border-black/5 pb-2">3. Disclaimer of Warranties</h3>
                    <p>
                      Our platform is provided on an "As Is" and "As Available" basis. While we strive for 100% uptime, <strong>Classroom 6x</strong> does not warrant that the service will be uninterrupted or error-free. We are not responsible for any technical issues, loss of game data, or external mirror closures that may affect your experience. Use of the platform is at your own risk.
                    </p>
                  </section>

                  <section className="space-y-6">
                    <h3 className="text-2xl font-bold text-slate-900 border-b border-black/5 pb-2">4. Limitation of Liability</h3>
                    <p>
                      In no event shall Classroom 6x, its owners, or its affiliates be liable for any damages arising out of the use or inability to use the site. This includes, but is not limited to, damages for loss of hardware performance, data loss, or disciplinary actions taken by third parties (such as schools or employers) resulting from your site usage.
                    </p>
                  </section>

                  <section className="space-y-6">
                    <h3 className="text-2xl font-bold text-slate-900 border-b border-black/5 pb-2">6. Governing Law and Jurisdiction</h3>
                    <p>
                      These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of your local jurisdiction. You agree that any legal action or proceeding between Classroom 6x and you for any purpose concerning these terms or the parties' obligations hereunder shall be brought exclusively in a court of competent jurisdiction.
                    </p>
                    <p>
                      While we operate globally through various edge CDN locations, our core governance is designed to protect both the user and the platform from unauthorized exploitation. We reserve the right to modify these terms at any time without prior notice, and it is your responsibility to review them periodically to ensure continued compliance.
                    </p>
                  </section>

                  <section className="space-y-6">
                    <h3 className="text-2xl font-bold text-slate-900 border-b border-black/5 pb-2">7. Contact Information for Legal Matters</h3>
                    <p>
                      If you have any questions regarding these Terms or the Intellectual Property hosted on our platform, please contact our legal support team at legal@classroom6x.store. We are committed to responding to all legitimate inquiries regarding site governance and data integrity in a timely manner.
                    </p>
                  </section>

                  <div className="pt-12 mt-12 border-t border-black/5">
                    <h4 className="font-bold text-slate-900 mb-6 text-xl">Discover More Games:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {GAMES.slice(8, 16).map(game => (
                        <a 
                          key={`terms-game-${game.id}`}
                          href={`/game/${game.id}`}
                          onClick={(e) => { e.preventDefault(); navigate(`/game/${game.id}`); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          className="glass p-4 rounded-xl flex flex-col items-center gap-3 hover:border-brand-purple/30 group transition-all"
                        >
                          <img 
                            src={game.image} 
                            className="w-12 h-12 rounded-lg object-cover group-hover:scale-105 transition-transform" 
                            alt={game.title} 
                            referrerPolicy="no-referrer"
                            onError={(e) => { e.currentTarget.src = "https://picsum.photos/seed/game/100/100"; }}
                          />
                          <span className="text-[10px] font-bold text-slate-600 group-hover:text-brand-purple transition-colors text-center truncate w-full">{game.title.split(' ')[0]}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ) : selectedGame ? (
          <div className="space-y-8">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <a 
                href="/" 
                onClick={(e) => { e.preventDefault(); navigate('/'); }}
                className="hover:text-brand-purple transition-colors"
              >
                Home
              </a>
              <ChevronRight size={10} />
              <a 
                href={`/category/${selectedGame.category.toLowerCase()}`} 
                onClick={(e) => { e.preventDefault(); navigate(`/category/${selectedGame.category.toLowerCase()}`); }}
                className="hover:text-brand-purple transition-colors"
              >
                {selectedGame.category} Games
              </a>
              <ChevronRight size={10} />
              <span className="text-slate-900">{selectedGame.title}</span>
            </nav>

            {/* Game Player Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img 
                    src={selectedGame.image} 
                    className="w-12 h-12 rounded-xl object-cover shadow-lg" 
                    alt="" 
                    referrerPolicy="no-referrer"
                    onError={(e) => { e.currentTarget.src = "https://picsum.photos/seed/game/100/100"; }}
                  />
                  <div>
                    <h1 className="text-3xl font-bold">{selectedGame.title}</h1>
                    <p className="text-slate-500 text-sm">{selectedGame.category} • {selectedGame.rating} Rating</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    navigate('/');
                  }}
                  className="px-6 py-2 glass rounded-xl hover:bg-black/10 transition-all flex items-center gap-2"
                >
                  <X size={18} /> Back to Home
                </button>
              </div>
              
              <div className="w-full max-w-[800px] aspect-video mx-auto glass rounded-3xl overflow-hidden relative bg-black shadow-2xl group">
                {/* Background Pre-loader / Iframe */}
                <iframe 
                  src={selectedGame.url} 
                  className={`absolute inset-0 w-full h-full border-none z-10 transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                  title={selectedGame.title}
                  allowFullScreen
                />

                {!isPlaying && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
                    <img 
                      src={selectedGame.image} 
                      className="absolute inset-0 w-full h-full object-cover blur-md opacity-40 scale-110" 
                      alt="" 
                    />
                    <div className="relative z-30 flex flex-col items-center gap-6">
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-24 h-24 bg-brand-purple rounded-full flex items-center justify-center purple-glow cursor-pointer hover:scale-110 transition-transform group/play"
                        onClick={() => setIsPlaying(true)}
                      >
                        <Play fill="currentColor" size={40} className="ml-2 text-white" />
                      </motion.div>
                      <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold text-white uppercase tracking-widest">{selectedGame.title}</h2>
                        <p className="text-white/60 text-sm flex items-center gap-2 justify-center">
                          <Loader2 size={16} className="animate-spin" />
                          Pre-loading for instant play...
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-12">
                {/* Blog Post Section */}
                <section className="glass rounded-3xl p-8 space-y-8">
                  <div className="space-y-6">
                    <h1 className="text-4xl font-display uppercase tracking-tight text-gradient">
                      {selectedGame.id === 'hoops-and-fruits' ? 'Hoops & Fruits: A Whimsical Tossing Adventure' : 
                       selectedGame.id === 'funny-shooter-2' ? 'Funny Shooter 2: Zany Chaos and Hilarious Combat' :
                       selectedGame.id === 'epic-duck' ? 'Epic Duck: An Adventurous Journey of Exploration' :
                       selectedGame.id === 'stickman-street-fighting' ? 'Stickman Street Fighting 3D: Dominate the Streets' :
                       selectedGame.id === 'penalty-kick-wiz' ? 'Penalty Kick Wiz: Master the Art of the Shootout' :
                       selectedGame.id === 'moto-x3m-spooky-land' ? 'Moto X3M: Spooky Land - Eerie Thrills and Supernatural Stunts' :
                       selectedGame.id === 'merge-mine-idle-clicker' ? 'Merge Mine - Idle Clicker: Build Your Mining Empire' :
                       selectedGame.id === 'evil-invader' ? 'Evil Invader: Survive the Dystopian Battlefield' :
                       selectedGame.id === 'hoop-world' ? 'Hoop World: Master the Art of Aerial Dunks' :
                       selectedGame.id === 'goal-skibidi-goal' ? 'Goal Skibidi Goal: Zany Physics and Frenetic Soccer' :
                       selectedGame.id === 'samurai-brawling' ? 'Samurai Brawling: Arashin\'s Path of Vengeance and Honor' :
                       selectedGame.id === 'slope' ? 'Slope Unblocked Classroom 6x: The Ultimate 3D Speed Challenge' :
                       selectedGame.id === 'tunnel-rush' ? 'Tunnel Rush Unblocked Classroom 6x: High-Speed Reflex Odyssey' :
                       selectedGame.id === 'drive-mad' ? 'Drive Mad Unblocked Classroom 6x: Master the Physics of Racing' :
                       selectedGame.id === 'its-taxi' ? 'Its taxi by artast Unblocked Classroom 6x: The Pixel-Perfect Taxi Sim' :
                       selectedGame.id === 'retro-bowl' ? 'Retro Bowl Unblocked Classroom 6x: The Ultimate Football Management Simulation' :
                       selectedGame.id === 'bitlife' ? 'BitLife Unblocked: Experience a Life of Infinite Possibilities' :
                       selectedGame.id === '1v1-lol' ? '1v1.LOL Unblocked: Master the Art of Competitive Building and Combat' :
                       selectedGame.id === 'geometry-dash-og' ? 'Geometry Dash OG Unblocked: Rhythm, Precision, and Geometric Chaos' :
                       selectedGame.id === 'super-mario-64' ? 'Super Mario 64 Unblocked Games Classroom 6x: The 3D Adventure That Changed Gaming' :
                       selectedGame.id === 'kirka-io' ? 'Kirka.io Unblocked: Skill-Based Competitive FPS Action (back-to-school-shopping.ml kirka.io)' :
                       selectedGame.id === 'golf-orbit' ? 'Golf Orbit Unblocked Classroom 6x: Master the Ultimate Long Drive (classroom 6x golf orbit)' :
                       selectedGame.id === 'ragdoll-hit' ? 'Ragdoll Hit Unblocked Games 6x: Physics-Based Combat Mayhem' :
                       `The Chaotic Joy of ${selectedGame.title}`}
                    </h1>
                    <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4">
                      {selectedGame.id === 'hoops-and-fruits' ? (
                        <>
                          <p>
                            Step into the vibrant and playful world of <strong>Hoops & Fruits</strong>, a delightful arcade game that challenges your precision and timing. In this whimsical adventure, your goal is simple yet addictive: toss hoops to capture a variety of colorful, fruity targets.
                          </p>
                          <p>
                            The game features intuitive drag-and-drop mechanics that are easy to learn but difficult to master. As you progress through the levels, you'll encounter increasingly complex arrangements of fruits, requiring you to refine your tossing skills. The charming graphics and captivating soundtrack create an immersive atmosphere that keeps you coming back for more.
                          </p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-8">Master the Art of the Toss</h3>
                          <p>
                            What sets Hoops & Fruits apart is the strategic depth hidden behind its simple premise. To maximize your score, you'll need to learn how to hoop multiple fruits in a single toss. This requires careful planning and a steady hand. Each successful catch brings a burst of color and a satisfying sound effect, making every level a joy to complete.
                          </p>
                          <p>
                            Whether you're looking for a quick gaming break or a longer session to master every level, Hoops & Fruits offers the perfect blend of relaxation and challenge. It's a fantastic addition to our collection of unblocked games, playable directly in your browser with no downloads required.
                          </p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-8">Why You Should Play</h3>
                          <p>
                            Hoops & Fruits is perfect for players of all ages. Its "Drawing" category classification highlights the creative and precise nature of the gameplay. The game's vibrant palette and cheerful themes make it a great choice for anyone looking to brighten their day with some lighthearted fun. Dive in today and see how many fruits you can hoop!
                          </p>
                        </>
                      ) : selectedGame.id === 'funny-shooter-2' ? (
                        <>
                          <p>
                            Dive into the zany chaos of <strong>Funny Shooter 2 unblock</strong>, where every battle is a laugh-filled thrill ride. This isn't your average first-person shooter; it's a hilariously unique experience that combines fast-paced action with a whimsical world bursting with personality.
                          </p>
                          <p>
                            In Funny Shooter 2, you'll face off against a variety of quirky enemies that will keep you on your toes. From strange creatures to bizarre bosses, the game's creativity knows no bounds. The vibrant, colorful environments provide the perfect backdrop for the high-octane combat that defines this title.
                          </p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-8">Customize Your Arsenal</h3>
                          <p>
                            One of the standout features of Funny Shooter 2 is the endless customization options. As you progress, you can upgrade your arsenal with a wide array of weapons and gear. Tailor your loadout to suit your playstyle and experiment with different combinations to find the most effective (and funniest) ways to take down your foes.
                          </p>
                          <p>
                            The game's progression system is rewarding and engaging, constantly introducing new challenges and rewards. Whether you're a seasoned FPS veteran or a newcomer to the genre, Funny Shooter 2 offers a fresh and entertaining take on the shooter formula.
                          </p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-8">Unblocked Fun Anywhere</h3>
                          <p>
                            Like all the titles on our platform, Funny Shooter 2 is fully unblocked and optimized for browser play. You can enjoy the hilarious chaos at school, work, or home without any restrictions. With no installation required, you're just a click away from one of the most entertaining shooter experiences available online today.
                          </p>
                        </>
                      ) : selectedGame.id === 'epic-duck' ? (
                        <>
                          <p>
                            Embark on an adventurous journey with <strong>Epic Duck Unblocked</strong>, where clever exploration and precise timing lead to success. This charming arcade game invites you into a world of puzzles and platforming that will test both your brain and your fingers.
                          </p>
                          <p>
                            In Epic Duck, you take control of a brave little duck on a mission. Navigate through beautifully designed levels, each filled with unique challenges and secrets. Your primary goal is to find hidden keys that unlock the path to the next stage. Along the way, you'll need to solve environmental puzzles and time your movements perfectly to avoid hazards.
                          </p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-8">Explore and Conquer</h3>
                          <p>
                            The beauty of Epic Duck lies in its level design. Every stage feels like a mini-adventure, encouraging you to explore every nook and cranny. The game rewards curiosity, often hiding collectibles or shortcuts in unexpected places. As you progress, the puzzles become more intricate, requiring you to think several steps ahead.
                          </p>
                          <p>
                            The visuals are delightful, featuring a clean and colorful art style that brings the duck's world to life. Combined with a relaxing yet engaging soundtrack, Epic Duck provides a gaming experience that is both soothing and stimulating.
                          </p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-8">Perfect for All Ages</h3>
                          <p>
                            Whether you're a casual gamer looking for a fun way to pass the time or a puzzle enthusiast seeking a new challenge, Epic Duck has something for everyone. Its intuitive controls make it accessible to players of all skill levels, while its deeper mechanics provide enough challenge for those who want it.
                          </p>
                          <p>
                            Play Epic Duck Unblocked today on our platform. Like all our games, it's optimized for browser play, meaning you can jump into the adventure instantly without any downloads or installations.
                          </p>
                        </>
                      ) : selectedGame.id === 'stickman-street-fighting' ? (
                        <>
                          <p>
                            Get ready to dominate the streets as a fearless stickman in <strong>Stickman Street Fighting 3D Unblocked</strong>! This intense brawler challenges you to crush foes with strategic blows and quick reflexes.
                          </p>
                          <p>
                            In Stickman Street Fighting 3D, you'll experience high-octane combat in a variety of urban environments. As a skilled fighter, you must navigate through waves of enemies, using your martial arts prowess to emerge victorious. The game's 3D graphics add a layer of depth to the action, making every punch and kick feel impactful.
                          </p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-8">Strategic Brawling</h3>
                          <p>
                            Success in Stickman Street Fighting 3D requires more than just button-mashing. You'll need to time your attacks carefully and anticipate your enemies' movements. Break objects scattered throughout the levels to uncover unexpected power-ups that can turn the tide of battle. From health boosts to temporary strength increases, these items are crucial for survival.
                          </p>
                          <p>
                            Furthermore, you can wield various weapons found on the streets for added punch. Whether it's a baseball bat or a lead pipe, these tools allow you to take down multiple foes with ease. Prove you're the toughest stickman around by mastering the game's combat system and clearing every level.
                          </p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-8">Unblocked Action Anytime</h3>
                          <p>
                            Enjoy the intense action of Stickman Street Fighting 3D Unblocked anywhere, anytime. Our platform ensures the game is fully accessible in restricted environments like schools or offices. With no installation required and seamless browser performance, you can jump straight into the brawl with just a single click.
                          </p>
                        </>
                      ) : selectedGame.id === 'penalty-kick-wiz' ? (
                        <>
                          <p>
                            Step into the adrenaline-filled duel of <strong>Penalty Kick Wiz Unblocked</strong>, where every shot and save is a crucial dance of precision and anticipation. This isn't just a simple soccer game; it's a high-stakes test of nerves and skill that captures the most intense moment of the sport.
                          </p>
                          <p>
                            In Penalty Kick Wiz, you represent your favorite team in a global tournament. The gameplay is divided into two equally challenging phases: shooting and goalkeeping. As the striker, you must outsmart the keeper with deceptive shots and perfect placement. As the goalie, you need lightning-fast reflexes to read the striker's intentions and dive for the save.
                          </p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-8">Master the Art of the Shootout</h3>
                          <p>
                            The beauty of Penalty Kick Wiz lies in its simplicity and depth. The intuitive controls allow you to curve the ball and adjust the power of your shots with ease. However, as you progress through the tournament, the AI becomes increasingly sophisticated, requiring you to vary your strategy and find the perfect moment to strike.
                          </p>
                          <p>
                            Winning matches earns you points that help you climb the leaderboard. Each victory brings you one step closer to the championship trophy, but one mistake can end your run. It's a game that rewards practice and mental fortitude.
                          </p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-8">Unblocked Sports Action</h3>
                          <p>
                            Like all our featured titles, Penalty Kick Wiz is fully unblocked and optimized for instant browser play. Whether you're at school, work, or home, you can experience the thrill of the World Cup penalty shootout without any downloads. Jump into the action today and prove you have what it takes to be a Penalty Kick Wiz!
                          </p>
                        </>
                      ) : selectedGame.id === 'moto-x3m-spooky-land' ? (
                        <>
                          <p>
                            Dive into the eerie thrills of <strong>Moto X3M: Spooky Land Unblocked</strong>, where every turn is a challenge against the supernatural. This latest installment in the legendary Moto X3M series takes the high-speed bike racing you love and plunges it into a hauntingly beautiful world of ghosts, ghouls, and bone-rattling obstacles.
                          </p>
                          <p>
                            In Spooky Land, the tracks are more than just paths; they are supernatural puzzles designed to test your reflexes and mastery of physics. From riding through giant ribcages to dodging swinging scythes, every level offers a unique and creepy challenge that will keep your heart racing.
                          </p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-8">Master Gravity-Defying Stunts</h3>
                          <p>
                            The core of Moto X3M remains its incredible stunt system. To achieve the fastest times and earn three stars on every level, you'll need to perform daring front and back flips. Each flip reduces your final time, but one wrong move could lead to a spectacular (and spooky) crash. The precise controls allow you to balance your bike in mid-air, ensuring you land perfectly every time.
                          </p>
                          <p>
                            As you progress, you'll earn stars that can be used to unlock new, creepy bikes and gear. Whether you want to ride a skeletal motorcycle or a pumpkin-themed bike, the customization options add a fun layer of progression to the ghoulish adventure.
                          </p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-8">Unblocked Racing Fun</h3>
                          <p>
                            Moto X3M: Spooky Land is fully unblocked and optimized for seamless browser play on our platform. We ensure that you can handle the haunting speed at school, work, or home without any restrictions. With no installation required, you're just a click away from surviving the most ghoulish bike racing adventure available online. Can you handle the heat of Spooky Land?
                          </p>
                        </>
                      ) : selectedGame.id === 'merge-mine-idle-clicker' ? (
                        <>
                          <p>
                            Unleash your inner miner in <strong>Merge Mine - Idle Clicker Unblocked</strong>, a strategic adventure that turns hard work into shiny rewards. Tap into a diamond-rich vein and begin your journey from a humble clicker to a mining tycoon.
                          </p>
                          <p>
                            The core of Merge Mine is its addictive merging mechanic. As you mine diamonds, you'll earn resources to purchase various tools. By merging two identical tools, you create a significantly more powerful version, drastically increasing your mining speed and efficiency. This strategic layer requires you to manage your space and resources carefully to maximize your output.
                          </p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-8">Automate Your Empire</h3>
                          <p>
                            While clicking is the start, automation is the key to true success. Upgrade your tools and systems to watch your diamond hoard grow even while you're away. The idle nature of the game means your mining empire never sleeps, constantly accumulating wealth for your next big upgrade or merge.
                          </p>
                          <p>
                            Experience the thrill of discovery as you unlock new tools and reach deeper, more lucrative veins. The satisfying progression system ensures that every click and every merge feels like a meaningful step toward total mining dominance.
                          </p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-8">Adventure Awaits</h3>
                          <p>
                            Merge Mine - Idle Clicker is more than just a clicker; it's an adventure in resource management and strategic growth. Play it unblocked on our platform today and start building your mining legacy. With no downloads and seamless performance, your path to riches is just a click away!
                          </p>
                        </>
                      ) : selectedGame.id === 'evil-invader' ? (
                        <>
                          <p>
                            <strong>Evil Invader</strong> plunges you into a dystopian battlefield overrun by monstrous foes. This isn't just a simple shooter; it's a heart-pounding, fast-paced survival challenge that will test your reflexes and strategic thinking to the limit.
                          </p>
                          <p>
                            In Evil Invader, you are the last line of defense against a relentless onslaught of enemies. Armed with an arsenal of powerful weapons, you must navigate through treacherous environments and take down waves of increasingly difficult monsters. The game's dark, atmospheric visuals perfectly capture the feeling of a world on the brink of collapse.
                          </p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-8">Master the Battlefield</h3>
                          <p>
                            Survival in Evil Invader requires more than just a quick trigger finger. You'll need to master enemy patterns and learn how to use the environment to your advantage. Strategize with a variety of power-ups that can give you a temporary edge in combat, from increased fire rate to devastating area-of-effect attacks.
                          </p>
                          <p>
                            As you progress, you'll earn experience and level up, allowing you to unlock even more devastating firepower. The sense of progression is rewarding, as you transform from a struggling survivor into a formidable force of destruction.
                          </p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-8">Intense Survival Action</h3>
                          <p>
                            Whether you're looking for a quick burst of adrenaline or a deep survival experience, Evil Invader delivers. Its "Arcade" classification highlights the fast-paced, high-score-driven nature of the gameplay. Like all the games on our platform, Evil Invader is fully unblocked and optimized for browser play, ensuring you can join the fight anywhere, anytime.
                          </p>
                        </>
                      ) : selectedGame.id === 'hoop-world' ? (
                        <>
                          <p>
                            In <strong>Hoop World Unblocked</strong>, you'll step onto a dynamic 3D basketball court where the laws of gravity are merely suggestions. This isn't just about shooting hoops; it's about soaring through the air, performing breathtaking flips, and nailing spectacular dunks with style and precision.
                          </p>
                          <p>
                            The game features intuitive mouse-click controls that make it easy for anyone to pick up and play. However, mastering the timing of your jumps and flips is where the true challenge lies. Each level presents new opportunities to showcase your aerial acrobatics and achieve the perfect dunk.
                          </p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-8">Why Play Hoop World?</h3>
                          <p>
                            Hoop World offers a unique blend of sports action and stunt-based gameplay. The 3D graphics bring the court to life, while the satisfying physics make every successful dunk feel like a major achievement. Whether you're a basketball fan or just love high-flying arcade games, Hoop World provides endless entertainment.
                          </p>
                          <p>
                            Like all our featured titles, Hoop World is fully unblocked and optimized for instant browser play. You can experience the thrill of the dunk at school, work, or home without any downloads. Jump into the world of Hoop World today and see if you have what it takes to become a master of the air!
                          </p>
                        </>
                      ) : selectedGame.id === 'goal-skibidi-goal' ? (
                        <>
                          <p>
                            Dive into the zany world of <strong>Goal Skibidi Goal</strong>, where frenetic physics-based soccer controls keep you on edge. This isn't your typical soccer simulation; it's a wild, unpredictable ride that combines skill, luck, and hilarious head-based navigation.
                          </p>
                          <p>
                            In Goal Skibidi Goal, you'll navigate the pitch using nimble head motions, leveraging clever jumps, ducks, and slides to outmaneuver your opponents. The game's physics engine ensures that every collision and every kick is filled with exhilarating momentum and unexpected outcomes.
                          </p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-8">Master the Power-Ups</h3>
                          <p>
                            To truly dominate the field, you'll need to master the various power-ups scattered throughout the dynamic duels. These items can give you the edge you need to outwit your opponents and secure that game-winning goal. From speed boosts to defensive shields, the strategic use of power-ups adds a layer of depth to the fast-paced action.
                          </p>
                          <p>
                            Whether you're looking for a quick competitive fix or a fun way to pass the time with friends, Goal Skibidi Goal offers a fresh and entertaining take on the sports genre. Its unique controls and zany atmosphere make it a standout title in our collection of unblocked games.
                          </p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-8">Unblocked Soccer Fun</h3>
                          <p>
                            Goal Skibidi Goal is fully unblocked and optimized for seamless browser play on our platform. We ensure that you can enjoy the frenetic soccer action at school, work, or home without any restrictions. With no installation required, you're just a click away from the most unpredictable soccer duel available online.
                          </p>
                        </>
                      ) : selectedGame.id === 'samurai-brawling' ? (
                        <>
                          <p>
                            Embark on an exhilarating 3D adventure in <strong>Samurai Brawling Unblocked</strong> as Arashin, a fierce Yakuza warrior. This isn't just a simple fighting game; it's a pulse-pounding journey through a world teeming with samurais, ninjas, and deep-seated intrigue.
                          </p>
                          <p>
                            As Arashin, you must engage in strategic battles against formidable foes. The game's combat system is both fluid and challenging, requiring you to master special moves and evolve your abilities as you progress. Every encounter is a test of your reflexes and tactical thinking.
                          </p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-8">A Gripping Storyline</h3>
                          <p>
                            Beyond the intense brawling, Samurai Brawling features a gripping storyline that unveils hidden truths about Arashin's past and the world he inhabits. The narrative-driven gameplay keeps you engaged as you uncover secrets and face off against powerful bosses in your quest for vengeance and honor.
                          </p>
                          <p>
                            The 3D environments are beautifully crafted, immersing you in the atmospheric world of ancient Japan with a modern Yakuza twist. From neon-lit streets to traditional dojos, every location is a battlefield waiting for your mastery.
                          </p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-8">Unblocked Action Anywhere</h3>
                          <p>
                            Samurai Brawling is fully unblocked and optimized for seamless browser play on our platform. Whether you're at school, work, or home, you can jump straight into Arashin's adventure without any downloads or installations. Experience the ultimate samurai brawler today and prove your worth as a legendary warrior!
                          </p>
                        </>
                      ) : selectedGame.id === 'slope' ? (
                        <>
                          <p>
                            Welcome to the high-stakes world of <strong>Slope Unblocked Classroom 6x</strong>, the definitive 3D speed-running experience that has captivated millions of players worldwide. In this minimalist yet intense neon world, you control a high-velocity ball hurtling down a never-ending series of futuristic slopes.
                          </p>
                          <p>
                            The premise is simple: stay on the track. However, as your speed increases and the physics take over, <strong>Slope Game</strong> becomes a true test of your hand-eye coordination and lightning-fast reflexes. Every tilt and turn must be calculated to avoid the red obstacles and the bottomless pits that line the course.
                          </p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-8">Dynamic Physics and Neon Aesthetics</h3>
                          <p>
                            What makes <strong>Slope Unblocked</strong> stand out is its seamless integration of high-speed physics and a mesmerizing neon aesthetic. The game world is procedurally generated, meaning every run offers a new set of challenges. The minimalist design ensures that your focus remains entirely on the speed and the path ahead, creating an "in-the-zone" experience unlike any other unblocked title.
                          </p>
                          <p>
                            As you navigate through steep drops and tight corners, the adrenaline increases proportionally with your velocity. It's a game that rewards persistence; every failed attempt is a lesson learned, pushing you to beat your previous high score and climb the local leaderboards.
                          </p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-8">Unblocked for Classroom Performance</h3>
                          <p>
                            Optimized specifically for the <strong>Classroom 6x</strong> ecosystem, this version of Slope is built to run flawlessly on Chromebooks and school networks. We've ensured that there is zero lag between your inputs and the ball's movement—a critical factor in a game where a millisecond makes the difference between a high score and a game over.
                          </p>
                          <p>
                            Experience the raw speed of <strong>Slope Unblocked Classroom 6x</strong> today. With no downloads required and instant browser play, the ultimate 3D challenge is just a single click away. Are you ready to master the slope?
                          </p>
                        </>
                      ) : selectedGame.id === 'tunnel-rush' ? (
                        <>
                          <p>
                            Prepare for the ultimate adrenaline rush with <strong>Tunnel Rush Unblocked Classroom 6x</strong>, a fast-paced 3D arcade game that pushes your reflexes to the absolute limit. In this neon-soaked odyssey, you are propelled through a vibrant, ever-changing tunnel at breakneck speeds, with only your agility between you and a high-score ending crash.
                          </p>
                          <p>
                            The core of <strong>Tunnel Rush</strong> is its minimalist but incredibly challenging gameplay. As you hurtle forward, a variety of geometric obstacles appear in your path. You must rotate the tunnel (or your perspective) instantly to navigate through gaps and stay alive. The further you progress, the faster the tunnel moves, and the more complex the patterns become.
                          </p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-8">Mastering the Rhythm of Speed</h3>
                          <p>
                            To succeed in <strong>Tunnel Rush Unblocked</strong>, you need more than just quick fingers; you need to find the rhythm of the game. Each level or segment introduces new obstacle configurations that require split-second decision-making. The high-contrast neon visuals combined with a pulse-pounding electronic soundtrack create an immersive "flow state" that keeps players engaged for hours.
                          </p>
                          <p>
                            Whether you're dodging spinning blades or threading the needle through narrow corridors, the satisfying feedback of a successful run is what makes this a staple of the <strong>Classroom 6x</strong> collection. It's the perfect game for challenging yourself to beat a personal record or competing with friends for the top spot on the leaderboard.
                          </p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-8">Optimized for School and Browser Play</h3>
                          <p>
                            Like all our featured titles, this version of <strong>Tunnel Rush</strong> is fully unblocked and optimized for web browser performance. We've ensured that the game runs smoothly without the need for high-end hardware, making it perfect for Chromebooks and school computers.
                          </p>
                          <p>
                            Dive into the neon depths of <strong>Tunnel Rush Unblocked Classroom 6x</strong> now. No downloads, no lag—just pure, high-speed exhilaration available at your fingertips. Can you survive the rush?
                          </p>
                        </>
                      ) : selectedGame.id === 'drive-mad' ? (
                        <>
                          <p>
                            Get ready for a racing experience like no other with <strong>Drive Mad Unblocked Classroom 6x</strong>. Developed with a focus on quirky physics and challenging level design, this game takes the traditional racing genre and flips it on its head. In <strong>Drive Mad</strong>, speed is important, but control is everything.
                          </p>
                          <p>
                            Each stage of <strong>Drive Mad Unblocked</strong> presents a new vehicle and a unique set of obstacles. From massive monster trucks with disproportionate wheels to fragile cars that crumble under pressure, the variety of vehicles keeps the gameplay fresh and unpredictable. Your goal is to reach the finish line without flipping your car or getting stuck on the creatively designed terrain.
                          </p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-8">Unique Physics-Based Challenges</h3>
                          <p>
                            The standout feature of <strong>Drive Mad</strong> is its physics engine. Every wheel rotation and every bump in the road affects your vehicle realistically. You'll need to master the art of feathering the throttle and knowing when to use full power to scale steep inclines or clear massive gaps. The gratification of finally conquering a particularly difficult track is what makes this game a fan favorite on <strong>Classroom 6x</strong>.
                          </p>
                          <p>
                            With dozens of levels ranging from simple sprints to complex mechanical puzzles, <strong>Drive Mad Unblocked Classroom 6x</strong> offers hours of entertainment. The minimalist, blocky art style not only looks modern and clean but also ensures high performance on school networks and Chromebooks.
                          </p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-8">Unblocked Racing for All Devices</h3>
                          <p>
                            We have optimized <strong>Drive Mad</strong> to ensure it is fully unblocked and accessible in restricted environments. Whether you are playing during a study break or at home, you can enjoy the full experience directly in your browser with zero installations.
                          </p>
                          <p>
                            Start your engines and put your skills to the test in <strong>Drive Mad Unblocked Classroom 6x</strong> today. Can you master the madness and reach the final level?
                          </p>
                        </>
                      ) : selectedGame.id === 'its-taxi' ? (
                        <>
                          <p>
                            Step into the colorful, isometric world of <strong>Its taxi by artast Unblocked Classroom 6x</strong>, a delightful and addictive taxi simulator that blends puzzle-solving with precision driving. Developed with the unique Fancade aesthetic, <strong>Its taxi</strong> challenges you to become the most efficient driver on the block while navigating through intricate city layouts.
                          </p>
                          <p>
                            The core objective of <strong>Its taxi by artast</strong> is simple: pick up passengers and get them to their destinations. However, the path isn't always clear. You'll need to navigate through tight corners, avoid heavy traffic, and solve environmental puzzles to reach your goal. The minimalist design and smooth controls make it an instant classic for players looking for a relaxed yet mentally stimulating gaming session.
                          </p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-8">Master the Art of Urban Navigation</h3>
                          <p>
                            What makes <strong>Its taxi Unblocked</strong> special is its focus on strategic movement. Every city block is a puzzle waiting to be solved. You'll need to plan your route carefully to ensure your passengers arrive on time. As you progress through the levels, the city layouts become more complex, introducing new obstacles and traffic patterns that will test your patience and your driving finesse.
                          </p>
                          <p>
                            The vibrant pixel-art style and the cheerful soundtrack create a welcoming atmosphere that makes every delivery a joy. Whether you're playing for five minutes or an hour, <strong>Its taxi by artast Classroom 6x</strong> provides a satisfying sense of progression and accomplishment.
                          </p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-8">Perfect for School and Productivity Breaks</h3>
                          <p>
                            We have optimized this version of <strong>Its taxi</strong> specifically for the <strong>Classroom 6x</strong> platform. The game is fully unblocked and optimized to run flawlessly in any modern web browser, including on Chromebooks and other school-issued devices. No downloads are necessary, allowing you to jump straight into the driver's seat and start picking up fares.
                          </p>
                          <p>
                            Discover why <strong>Its taxi by artast Unblocked Classroom 6x</strong> is becoming a favorite among students and casual gamers alike. Start your shift today and see if you can become the city's top-rated taxi driver!
                          </p>
                        </>
                      ) : selectedGame.id === 'retro-bowl' ? (
                        <>
                          <p>
                            Experience the gridiron like never before with <strong>Retro Bowl Unblocked Classroom 6x</strong>. This isn't just a sports game; it's a deep, rewarding management simulation wrapped in beautiful 8-bit nostalgia. In <strong>Retro Bowl</strong>, you are both the head coach and the general manager, tasked with taking a struggling franchise and leading them to football immortality.
                          </p>
                          <p>
                            The gameplay of <strong>Retro Bowl Unblocked</strong> is a perfect blend of high-level strategy and satisfying on-field action. You'll need to draft players, manage your team's salary cap, hire coaching staff, and keep your fans happy. On the field, you'll control the quarterback, making split-second decisions to avoid the pass rush and find your open receivers in the end zone.
                          </p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-8">Build Your Football Dynasty</h3>
                          <p>
                            What sets <strong>Retro Bowl</strong> apart is its incredible depth. Every decision you make has long-term consequences. Do you trade away your aging star for draft picks, or do you go all-in for one final championship run? Managing your players' morale is just as important as managing their stats. The simplified controls make it accessible for everyone, but the tactical layers ensure that hardcore football fans will find a lot to love.
                          </p>
                          <p>
                            The retro aesthetic isn't just for show; it allows the game to run perfectly on school Chromebooks and restricted networks. Its lightweight nature ensures no lag during critical plays, making the <strong>Classroom 6x unblocked</strong> version the definitive way to play during your downtime.
                          </p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-8">Unblocked Football for School</h3>
                          <p>
                            We have ensured that <strong>Retro Bowl</strong> is fully unblocked and optimized for web performance on our platform. Jump into the huddle today and see if you have what it takes to build a legendary team. No downloads, just pure football strategy at your fingertips.
                          </p>
                        </>
                      ) : selectedGame.id === 'bitlife' ? (
                        <>
                          <p>
                            What if you could live a thousand different lives? <strong>BitLife Unblocked Classroom 6x</strong> is the ultimate life simulator that lets you make every decision, from birth to death. Will you grow up to be a model citizen, a famous actor, or a notorious criminal? In <strong>BitLife</strong>, the choice is yours, and every action has a consequence.
                          </p>
                          <p>
                            The beauty of <strong>BitLife Unblocked</strong> lies in its infinite replayability. Each new life starts as a blank slate. You can choose to excel in school, join sports teams, find love, or travel the world. The game's text-based format allows for a level of depth and narrative complexity that few other unblocked games can match.
                          </p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-8">Infinite Choices, Infinite Outcomes</h3>
                          <p>
                            Every year in <strong>BitLife</strong> brings new events and dilemmas. Will you study hard for your exams or skip class to hang out with friends? Will you propose to your high school sweetheart or pursue a life of bachelorhood? The game tracks your health, happiness, smarts, and looks, all of which are affected by your lifestyle choices.
                          </p>
                          <p>
                            The <strong>Classroom 6x</strong> version of BitLife is optimized for fast loading and seamless browser play. Because it is primarily a text-driven experience, it works flawlessly on all school networks and hardware. It's the perfect game for exploring "what if" scenarios and seeing how different life paths unfold.
                          </p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-8">Unblocked Life Simulator</h3>
                          <p>
                            Experience the full range of human emotion and experience in <strong>BitLife Unblocked</strong>. Whether you want to become a billionaire CEO or a wandering monk, our platform provides the safest and most reliable way to play in your browser with zero installations.
                          </p>
                        </>
                      ) : selectedGame.id === '1v1-lol' ? (
                        <>
                          <p>
                            Sharpen your building skills and ready your aim in <strong>1v1.LOL Unblocked Classroom 6x</strong>, the premier competitive building and shooting simulator. This game takes the core mechanics of popular battle royale titles and distills them into intense, high-speed 1v1 duels. In <strong>1v1.LOL</strong>, your ability to build structures is just as important as your accuracy.
                          </p>
                          <p>
                            The core experience of <strong>1v1.LOL Unblocked</strong> is about mastering the "Box Fight." You'll need to rapidly place walls, ramps, and floors to gain the high ground and protect yourself from enemy fire. The game's robust practice modes allow you to hone your building techniques before jumping into live matches against players from around the world.
                          </p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-8">Competitive Edge in Your Browser</h3>
                          <p>
                            What makes <strong>1v1.LOL</strong> a staple of the unblocked gaming community is its high ceiling for skill. The mechanics are precise, and the action is relentless. Whether you are using a shotgun for close-quarters combat or a sniper for long-range precision, the gameplay feels responsive and fair.
                          </p>
                          <p>
                            We have optimized the <strong>Classroom 6x</strong> version of 1v1.LOL to ensure it runs at high frame rates even on modest school hardware. The game is fully unblocked and accessible through our encrypted mirrors, making it the top choice for students looking to improve their competitive gaming skills during their breaks.
                          </p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-8">Unblocked Building Fun</h3>
                          <p>
                            Jump into the arena today and prove your dominance in <strong>1v1.LOL Unblocked</strong>. With instant browser play and no downloads required, you are always just a click away from your next victory.
                          </p>
                        </>
                      ) : selectedGame.id === 'geometry-dash-og' ? (
                        <>
                          <p>
                            Get ready for a rhythmic test of patience and precision with <strong>Geometry Dash OG Unblocked Classroom 6x</strong>. This legendary platformer combines a pulse-pounding electronic soundtrack with minimalist yet devilishly difficult level design. In <strong>Geometry Dash</strong>, one wrong move moves you back to the very beginning.
                          </p>
                          <p>
                            The premise of <strong>Geometry Dash OG Unblocked</strong> is simple: jump and fly your way through danger in this rhythm-based action platformer. The game's levels are meticulously synced to their soundtracks, making the music an integral part of the experience. You'll need to learn the patterns and find the rhythm to survive the spikes, pits, and shifting gravity.
                          </p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-8">Rhythm-Based Action Platforming</h3>
                          <p>
                            What makes <strong>Geometry Dash</strong> so addictive is the "one more try" factor. Each level presents a unique visual style and a distinct musical theme, ranging from high-energy dubstep to atmospheric techno. The gratification of finally clearing a level that has defeated you dozens of times is unmatched in the world of unblocked games.
                          </p>
                          <p>
                            The <strong>Classroom 6x</strong> version is optimized for low-latency performance, which is critical for a game that requires frame-perfect inputs. Whether you are playing the classic levels or exploring community-inspired creations, the experience is smooth and fully unblocked for school use.
                          </p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-8">Unblocked Precision Gaming</h3>
                          <p>
                            Put your reflexes to the test in <strong>Geometry Dash OG Unblocked</strong>. With no downloads required, you can enjoy this world-class platformer directly in your browser. Can you conquer the rhythm?
                          </p>
                        </>
                      ) : selectedGame.id === 'super-mario-64' ? (
                        <>
                          <p>
                            Step into the shoes of the world's most famous plumber in <strong>Super Mario 64 Unblocked Games Classroom 6x</strong>. Originally released as the pioneer of 3D platforming, this game is now instantly accessible in your browser. Journey through Princess Peach’s castle, dive into magical paintings, and collect Power Stars to thwart Bowser's latest scheme.
                          </p>
                          <p>
                            In <strong>Super Mario 64 Unblocked</strong>, you have complete freedom of movement in large, open levels. From the rolling hills of Bob-omb Battlefield to the treacherous depths of Hazy Maze Cave, every stage is packed with secrets, challenges, and iconic enemies. The fluid movement system, including jumps, flips, and punches, makes every moment of exploration a delight.
                          </p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-8">A Masterpiece of Level Design</h3>
                          <p>
                            What marks <strong>Super Mario 64</strong> as a masterpiece is its innovative level design. Each world is a playground designed to be revisited multiple times to collect different stars. Whether you're racing a giant penguin or scaling a volcano, the variety of gameplay keeps the experience fresh. Our <strong>Classroom 6x</strong> version provides an ultra-smooth emulator experience that preserves every detail of the original game.
                          </p>
                          <p>
                            We have optimized the controls for keyboard play, ensuring that Mario's classic moves—like the triple jump and the backflip—translate perfectly to your school Chromebook. No additional plugins or heavy downloads are required; simply hit play and start your adventure through the Mushroom Kingdom.
                          </p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-8">Unblocked 3D Adventure</h3>
                          <p>
                            Play <strong>Super Mario 64 Unblocked</strong> today and rediscover the game that defined a generation. It’s the perfect choice for students looking for a deep, engaging adventure during their free time. With full support for browser saving, you can work your way towards all 120 Power Stars right here on Classroom 6x.
                          </p>
                        </>
                      ) : selectedGame.id === 'kirka-io' ? (
                        <>
                          <p>
                            Experience the intense, fast-paced world of <strong>Kirka.io Unblocked</strong>, the premier skill-based competitive first-person shooter available directly in your browser. Often searched as <strong>back-to-school-shopping.ml kirka.io</strong>, this game delivers a polished FPS experience that rivals many desktop titles, all while remaining accessible on limited school and office networks.
                          </p>
                          <p>
                            In <strong>Kirka.io</strong>, you step into stylized arenas where reflexes and tactical positioning are the keys to victory. Whether you're playing solo or joining a clan, the game offers a variety of modes and maps that keep the combat fresh and engaging. The lightweight nature of <strong>back-to-school-shopping.ml kirka.io</strong> means you get high frame rates and low latency, which are crucial for competitive play.
                          </p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-8">Master the Mechanics of back-to-school-shopping.ml kirka.io</h3>
                          <p>
                            What sets <strong>Kirka.io Unblocked</strong> apart is its focus on movement and gunplay. You can customize your loadout with a wide array of weapons, from rapid-fire SMGs to high-precision sniper rifles. The integration of <strong>back-to-school-shopping.ml kirka.io</strong> ensures that fans can find and play their favorite shooter even when standard links are restricted.
                          </p>
                          <p>
                            As you progress, you can earn rewards, unlock new skins, and climb the global leaderboards. The community is active and competitive, providing a continuous challenge for players of all skill levels. If you're looking for the best unblocked FPS experience, <strong>back-to-school-shopping.ml kirka.io</strong> is the definitive choice on our platform.
                          </p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-8">Why Play Kirka.io on Classroom 6x?</h3>
                          <p>
                            Our version of <strong>Kirka.io Unblocked</strong> is specifically tuned for browser performance. We understand the importance of the <strong>back-to-school-shopping.ml kirka.io</strong> keyword for our users, and we've optimized this page to ensure it's easy to find and fast to load. No downloads, no installations—just pure, skill-based shooter action at your fingertips.
                          </p>
                          <p>
                            Join the battle today and see why <strong>back-to-school-shopping.ml kirka.io</strong> has become a favorite among the unblocked gaming community. Whether you're sharpening your aim during a break or competing in a high-stakes clan match, <strong>Kirka.io</strong> delivers the goods.
                          </p>
                        </>
                      ) : selectedGame.id === 'golf-orbit' ? (
                        <>
                          <p>
                            Blast your way to the stars in <strong>Golf Orbit Unblocked Classroom 6x</strong>, the addictive one-tap golf game where distance is the only metric that matters. Often searched by fans as <strong>classroom 6x golf orbit</strong>, this game takes the traditional sport of golf and turns it into a high-powered, physics-defying challenge.
                          </p>
                          <p>
                            The objective in <strong>Golf Orbit</strong> is simple: hit the ball as far as you possibly can. By timing your tap or click perfectly, you can launch the ball through the stratosphere and even into outer space. As you progress, you'll earn gold that can be used to upgrade your strength, speed, and bounce, allowing you to reach even more ridiculous distances. The <strong>classroom 6x golf orbit</strong> keyword represents the dedicated community of players who enjoy this game in restricted environments.
                          </p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-8">Mastering the Long Drive in classroom 6x golf orbit</h3>
                          <p>
                            What makes <strong>Golf Orbit Unblocked</strong> so compelling is the satisfying sense of progression. Each upgrade noticeably improves your performance, turning your humble golfer into a planet-hopping powerhouse. The game features various wacky environments, from standard golf courses to alien planets, ensuring that the <strong>classroom 6x golf orbit</strong> experience never gets old.
                          </p>
                          <p>
                            Optimized for the <strong>Classroom 6x</strong> platform, this version of Golf Orbit ensures zero lag and instant response times. Whether you're trying to beat your own record or competing for the top spot on our featured lists, <strong>classroom 6x golf orbit</strong> provides the perfect blend of casual fun and strategic upgrading.
                          </p>
                        </>
                      ) : selectedGame.id === 'ragdoll-hit' ? (
                        <>
                          <p>
                            Enter the arena of chaotic physics with <strong>Ragdoll Hit Unblocked Games 6x</strong>. This intense, hilarious combat game challenges you to defeat your opponents using a variety of weapons and pure ragdoll momentum. If you're looking for <strong>Ragdoll Hit Unblocked Games 6x</strong>, you've found the definitive version here.
                          </p>
                          <p>
                            In <strong>Ragdoll Hit</strong>, every movement is unpredictable. You'll need to master the awkward, physics-based controls to strike your enemies while avoiding their attacks. Whether you're using your bare fists or a arsenal of weapons, the goal is always the same: knock out your opponent and emerge as the last ragdoll standing. <strong>Ragdoll Hit Unblocked Games 6x</strong> is designed to provide maximum entertainment without the need for complex installations.
                          </p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-8">Why Play Ragdoll Hit Unblocked Games 6x?</h3>
                          <p>
                            The beauty of <strong>Ragdoll Hit</strong> lies in its simplicity and the emergent comedy of its physics engine. No two fights are ever the same, as the ragdolls tumble and fly across the screen in unpredictable ways. Our <strong>Ragdoll Hit Unblocked Games 6x</strong> version is fully optimized for browser play, ensuring you can enjoy the carnage at school, work, or home.
                          </p>
                          <p>
                            Challenge your reflexes and embrace the chaos today. <strong>Ragdoll Hit Unblocked Games 6x</strong> is more than just a fighter; it's a test of your ability to adapt to the unexpected. Join the thousands of players who make <strong>Ragdoll Hit Unblocked Games 6x</strong> their go-to choice for a quick gaming break.
                          </p>
                        </>
                      ) : (
                        <>
                          <p>
                            In the world of online browser games, few titles manage to capture the pure, unadulterated essence of "fun" quite like <strong>{selectedGame.title}</strong>. It's a game that defies logic, ignores the laws of physics, and embraces randomness with open arms. If you've ever wanted to play basketball with ragdoll physics, changing environments, and a variety of strange balls, this is the game for you.
                          </p>
                          <p>
                            At its core, {selectedGame.title} is a 2-player basketball game. But calling it just a "basketball game" is like calling a hurricane a "breeze." The controls are deceptively simple: one button to jump and throw. However, the mastery lies in timing your jumps amidst the chaos. One moment you're playing on a standard court, and the next, you're slipping on ice or jumping through deep snow.
                          </p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-8">Why It's a Must-Play</h3>
                          <p>
                            The brilliance of {selectedGame.title} lies in its unpredictability. Every time a basket is scored, the game resets with a new set of variables. Your players might suddenly have tiny heads and giant bodies, or the basketball might be replaced by a heavy bowling ball or a light-as-air beach ball. This constant shifting keeps the gameplay fresh and ensures that no two matches are ever the same.
                          </p>
                          <p>
                            It's the perfect "unblocked" game because it requires no installation and runs smoothly on almost any hardware. Whether you're looking for a quick 5-minute break or a heated tournament against a friend, {selectedGame.title} delivers instant gratification. The local multiplayer mode is particularly strong, fostering the kind of couch-co-op (or desk-co-op) rivalry that makes gaming so memorable.
                          </p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-8">Mastering the Randomness</h3>
                          <p>
                            While the game is random, there is a layer of strategy. Learning how the different balls react to the physics engine is key. A bowling ball requires a much stronger jump-throw than a standard ball, while the ice court requires you to account for momentum. Mastering these nuances while your opponent is flailing wildly is how you secure that final 5th point for the win.
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </section>

                {/* FAQ Section */}
                <section className="space-y-8">
                  <h2 className="text-3xl font-heading font-bold flex items-center gap-3 text-slate-900">
                    <Clock className="text-brand-purple" />
                    Frequently Asked Questions
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {FAQS.map((faq, idx) => (
                      <div key={idx} className="glass p-6 rounded-2xl space-y-3">
                        <h4 className="font-bold text-lg text-slate-900">{faq.question}</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <aside className="lg:col-span-4 space-y-8">
                <div className="glass rounded-3xl p-6 space-y-6">
                  <h3 className="font-bold text-xl">Game Info</h3>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between border-b border-black/5 pb-2">
                      <span className="text-slate-500">Category</span>
                      <span>{selectedGame.category}</span>
                    </div>
                    <div className="flex justify-between border-b border-black/5 pb-2">
                      <span className="text-slate-500">Rating</span>
                      <span className="text-yellow-400 flex items-center gap-1"><Star size={14} fill="currentColor" /> {selectedGame.rating}</span>
                    </div>
                    <div className="flex justify-between border-b border-black/5 pb-2">
                      <span className="text-slate-500">Developer</span>
                      <span>Random Games</span>
                    </div>
                    <div className="flex justify-between border-b border-black/5 pb-2">
                      <span className="text-slate-500">Platform</span>
                      <span>Web Browser</span>
                    </div>
                  </div>
                  <button className="w-full py-4 bg-brand-purple rounded-xl font-bold purple-glow hover:brightness-110 transition-all">
                    Share Game
                  </button>
                </div>

                <div className="glass rounded-3xl p-6 space-y-6">
                  <h3 className="font-bold text-xl">Related Games</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {GAMES.filter(g => g.category === selectedGame.category && g.id !== selectedGame.id).slice(0, 8).map(game => (
                      <a 
                        key={game.id} 
                        href={`/game/${game.id}`}
                        className="flex gap-4 group cursor-pointer items-center no-underline"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/game/${game.id}`);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        <img 
                          src={game.image} 
                          className="w-16 h-16 rounded-xl object-cover group-hover:scale-105 transition-transform shadow-sm" 
                          alt={game.title} 
                          referrerPolicy="no-referrer"
                          onError={(e) => { e.currentTarget.src = "https://picsum.photos/seed/game/100/100"; }}
                        />
                        <div>
                          <h4 className="font-bold text-sm group-hover:text-brand-purple transition-colors text-slate-900 leading-snug">{game.title}</h4>
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold font-sans">Play {game.id === 'slope' ? 'Slope' : game.id === 'retro-bowl' ? 'Retro Bowl' : 'Unblocked'}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="glass rounded-3xl p-6 space-y-6">
                  <h3 className="font-bold text-xl">Popular in {selectedGame.category}</h3>
                  <div className="space-y-4">
                    {GAMES.filter(g => g.category !== selectedGame.category).slice(0, 10).map(game => (
                      <a 
                        key={game.id} 
                        href={`/game/${game.id}`}
                        className="flex gap-4 group cursor-pointer items-center no-underline"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/game/${game.id}`);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        <img 
                          src={game.image} 
                          className="w-12 h-12 rounded-lg object-cover group-hover:scale-105 transition-transform" 
                          alt={game.title} 
                          referrerPolicy="no-referrer"
                          onError={(e) => { e.currentTarget.src = "https://picsum.photos/seed/game/100/100"; }}
                        />
                        <div>
                          <h4 className="font-bold text-xs group-hover:text-brand-purple transition-colors text-slate-900 truncate w-32">{game.title}</h4>
                          <div className="flex items-center gap-1 text-[10px] text-yellow-500 font-bold">
                            <Star size={10} fill="currentColor" /> {game.rating}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="glass rounded-3xl p-6 space-y-6">
                  <h3 className="font-bold text-xl leading-tight">Quick Navigation</h3>
                  <div className="flex flex-wrap gap-2">
                    {NAV_TABS.map(tab => (
                      <a 
                        key={`quick-${tab}`}
                        href={`/category/${tab.toLowerCase()}`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/category/${tab.toLowerCase()}`);
                        }}
                        className="px-3 py-1 bg-black/5 hover:bg-brand-purple/10 text-slate-600 hover:text-brand-purple rounded-full text-[10px] font-bold uppercase tracking-widest transition-all"
                      >
                        {tab}
                      </a>
                    ))}
                    {GAMES.filter(g => g.rating > 4.8).map(game => (
                      <a 
                        key={`trending-${game.id}`}
                        href={`/game/${game.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/game/${game.id}`);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-3 py-1 bg-black/5 hover:bg-brand-purple/10 text-slate-600 hover:text-brand-purple rounded-full text-[10px] font-bold uppercase tracking-widest transition-all"
                      >
                        {game.title}
                      </a>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        ) : selectedBlog ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-12 py-8"
          >
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-slate-500 hover:text-brand-purple transition-colors font-bold uppercase tracking-widest text-xs"
            >
              <ArrowLeft size={16} /> Back to Home
            </button>

            <article className="glass rounded-[2rem] p-8 md:p-12 space-y-8">
              <header className="space-y-4">
                <div className="flex items-center gap-3 text-brand-purple font-bold uppercase tracking-widest text-xs">
                  <BookOpen size={16} />
                  <span>Classroom 6x Knowledge Hub</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-display uppercase tracking-tight text-gradient leading-tight">
                  {selectedBlog.title}
                </h1>
              </header>

              <div 
                className="prose prose-slate prose-lg max-w-none text-slate-700 leading-relaxed space-y-6"
                dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
              />

              <div className="pt-12 mt-12 border-t border-black/5 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-slate-900">Recommended Guides</h3>
                  <a href="/blogs" onClick={(e) => { e.preventDefault(); navigate('/blogs'); }} className="text-brand-purple font-bold text-xs uppercase tracking-widest hover:underline">View All</a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {BLOGS.filter(b => b.id !== selectedBlog.id).slice(0, 4).map(blog => (
                      <a 
                        key={blog.id} 
                        href={`/blog/${blog.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/blog/${blog.id}`);
                          window.scrollTo({top: 0, behavior: 'smooth'});
                        }}
                        className="glass p-4 rounded-2xl flex items-center gap-4 hover:border-brand-purple/30 group transition-all"
                      >
                        <div className="w-10 h-10 bg-brand-purple/10 rounded-lg flex items-center justify-center text-brand-purple group-hover:scale-110 transition-transform">
                          <BookOpen size={20} />
                        </div>
                        <span className="font-bold text-sm text-slate-700 group-hover:text-brand-purple transition-colors">{blog.title}</span>
                      </a>
                    ))}
                </div>
              </div>

              <div className="pt-8 space-y-6">
                <h3 className="text-xl font-bold text-slate-900">Trending Unblocked Games</h3>
                <div className="flex flex-wrap gap-2">
                    {GAMES.slice(0, 10).map(game => (
                      <a 
                        key={`blog-game-${game.id}`}
                        href={`/game/${game.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/game/${game.id}`);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-4 py-2 glass rounded-xl text-xs font-bold text-slate-500 hover:text-brand-purple hover:bg-brand-purple/5 transition-all"
                      >
                        {game.title}
                      </a>
                    ))}
                </div>
              </div>

              {/* Internal Links for Top 10 Game Blog (Keep for extra depth) */}
              {selectedBlog.id === 'top-10-classroom-6x' && (
                <div className="pt-8 border-t border-black/5 space-y-6">
                  <h3 className="text-xl font-bold text-slate-900">Quick Links:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['slope', 'retro-bowl', 'run-3'].map(gameId => {
                      const game = GAMES.find(g => g.id === gameId);
                      if (!game) return null;
                      return (
                        <button
                          key={gameId}
                          onClick={() => {
                            navigate(`/game/${gameId}`);
                          }}
                          className="glass p-4 rounded-2xl flex items-center gap-4 hover:scale-105 transition-transform text-left group"
                        >
                          <img 
                            src={game.image} 
                            alt={game.title} 
                            className="w-16 h-16 rounded-xl object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="text-[10px] font-bold text-brand-purple uppercase tracking-widest">Play Now</p>
                            <p className="text-sm font-bold text-slate-900 group-hover:text-brand-purple transition-colors truncate w-24">{game.title.split(' ')[0]}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </article>

            {/* Safety Callout */}
            <section className="glass rounded-[2rem] p-8 bg-emerald-500/5 border border-emerald-500/10 flex flex-col md:flex-row items-center gap-8">
              <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-500/20">
                <ShieldCheck size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-display uppercase tracking-tight text-emerald-600">Secure & Verified Site</h3>
                <p className="text-slate-600 font-medium">Classroom 6x is committed to providing a safe, unblocked environment. No tracking, no malware, just pure gaming.</p>
              </div>
            </section>
          </motion.div>
        ) : activeTab === "Blogs" ? (
          <div className="space-y-12 py-12">
            <header className="text-center max-w-3xl mx-auto space-y-4">
              <h1 className="text-5xl md:text-6xl font-display uppercase tracking-tight text-gradient leading-tight">Guides & Insights</h1>
              <p className="text-slate-500 text-lg">Master the art of unblocked gaming with our exclusive guides and news.</p>
            </header>

            {/* Top Games in Guides & Insights - Moved to top */}
            <div className="pt-12 mt-12 space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-4xl md:text-5xl font-display uppercase tracking-tight text-gradient">Featured Games for You</h2>
                <p className="text-slate-500 text-lg">Discover the most stable unblocked6x games mentioned in our guides.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {GAMES.slice(0, 12).map((game, idx) => (
                  <motion.div
                    key={`insight-game-${game.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <button
                      onClick={() => {
                        navigate(`/game/${game.id}`);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full text-left group"
                    >
                      <div className="relative aspect-square rounded-2xl overflow-hidden glass mb-3 border border-black/5 group-hover:border-brand-purple/30 group-hover:scale-[1.02] transition-all duration-300">
                        <img 
                          src={game.image} 
                          alt={game.title}
                          className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                          <Play size={20} className="text-white bg-brand-purple rounded-full p-1 shadow-lg" />
                        </div>
                      </div>
                      <h4 className="font-bold text-xs text-slate-800 group-hover:text-brand-purple transition-colors truncate">{game.title}</h4>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-0.5">{game.category}</p>
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-12 border-t border-black/5">
              {BLOGS.map((blog, idx) => (
                  <button
                    key={blog.id}
                    onClick={() => navigate(`/blog/${blog.id}`)}
                    className="glass rounded-[2rem] overflow-hidden group cursor-pointer border border-black/5 hover:border-brand-purple/20 transition-all p-8 flex flex-col h-full"
                  >
                  <div className="flex-grow space-y-4">
                    <div className="flex items-center gap-3 text-brand-purple font-bold uppercase tracking-widest text-[10px]">
                      <BookOpen size={14} />
                      <span>Article</span>
                    </div>
                    <h3 className="text-2xl font-display uppercase tracking-tight group-hover:text-brand-purple transition-colors leading-tight">{blog.title}</h3>
                    <p className="text-slate-500 line-clamp-3 leading-relaxed">{blog.excerpt}</p>
                  </div>
                  <div className="pt-6 mt-auto border-t border-black/5 flex items-center justify-between">
                    <span className="text-brand-purple font-bold uppercase tracking-widest text-[10px]">Read More</span>
                    <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>

            <div className="text-center pt-8">
              <button
                onClick={() => {
                  setActiveTab("Home");
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-brand-purple/10 text-brand-purple rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-brand-purple/20 transition-all border border-brand-purple/10"
              >
                Back to All Games <ChevronRight size={14} className="inline ml-1" />
              </button>
            </div>

          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {/* Left Section: Hero & Grid */}
            <div className="space-y-12">
                           {/* Hero Section - Redesigned with a 3-column layout to include trending games */}
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left: Character Image */}
                <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="lg:col-span-4 relative hidden lg:block"
                >
                  <div className="w-full h-[450px] flex flex-col items-center justify-center gap-8 bg-black/5 rounded-3xl border border-black/10 glass p-8 text-center relative overflow-hidden">
                    {/* Background Image */}
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/en/thumb/c/c4/GTASABOX.jpg/250px-GTASABOX.jpg"
                      className="absolute inset-0 w-full h-full object-cover"
                      alt=""
                      referrerPolicy="no-referrer"
                    />
                    
                    <button 
                      onClick={() => {
                        navigate('/game/gta-san-andreas');
                      }}
                      className="relative z-10 px-8 py-4 bg-brand-purple text-white rounded-xl font-bold uppercase tracking-widest purple-glow hover:scale-110 transition-all shadow-2xl shadow-brand-purple/20 translate-y-40"
                    >
                      Play GTA Now
                    </button>
                  </div>
                </motion.div>

                {/* Center: Text Content */}
                <div className="lg:col-span-5 space-y-2 text-center lg:text-left">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h1 className="font-display text-4xl md:text-5xl xl:text-6xl uppercase tracking-tighter text-gradient leading-none mb-4">
                      Classroom 6x: Best Unblocked Games for School 
                    </h1>
                  </motion.div>

                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-slate-600 text-base leading-relaxed max-w-xl mx-auto lg:mx-0"
                  >
                    Welcome to the ultimate destination for <strong>Classroom 6x unblocked games</strong>. Our mission is to provide the best 
                    collection of <strong>unblocked games for school</strong>, including Ragdoll Archers, Retro Bowl, Slope, Snow Rider 3D, and thousands of other titles.
                  </motion.p>

                  {/* Ad Sections */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col gap-4 mt-6 items-center lg:items-start"
                  >
                    <AdBanner />
                    <AdBanner />
                  </motion.div>
                </div>

                {/* Right: Trending Games Sidebar */}
                <motion.div 
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="lg:col-span-3 space-y-4"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Flame className="text-orange-500 animate-pulse" size={20} />
                    <h3 className="font-bold text-lg uppercase tracking-widest text-slate-700">Trending Now</h3>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    {GAMES.slice(0, 12).map((game) => (
                      <motion.div 
                        key={game.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/game/${game.id}`)}
                        className="aspect-square rounded-xl overflow-hidden cursor-pointer group relative border border-black/5 hover:border-brand-purple/50 transition-all shadow-sm bg-white"
                      >
                        <img 
                          src={game.image} 
                          alt={game.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-brand-purple/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Play size={20} className="text-white fill-white drop-shadow-lg" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => {
                      document.getElementById('games-grid')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-3 mt-2 glass rounded-xl text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 hover:bg-black/10 transition-all"
                  >
                    Explore More
                  </button>
                </motion.div>
              </section>

              {/* Games Grid */}
              <section id="games-grid" className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-heading font-bold flex items-center gap-3">
                      <Clock className="text-brand-purple" />
                      {activeTab === "Home" ? "Recent Uploaded Games" : `${activeTab} Games`}
                      {searchQuery && ` - Search: "${searchQuery}"`}
                    </h2>
                    <button 
                      onClick={() => {
                        navigate('/');
                      }}
                      className="text-sm text-slate-500 hover:text-brand-purple flex items-center gap-1 transition-colors"
                    >
                      View All <ChevronRight size={16} />
                    </button>
                  </div>
                  
                  {CATEGORY_DESCRIPTIONS[activeTab] && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={`desc-${activeTab}`}
                      className="glass p-6 rounded-2xl border-l-4 border-brand-purple"
                    >
                      <p className="text-sm text-slate-600 leading-relaxed italic">
                        {CATEGORY_DESCRIPTIONS[activeTab]}
                      </p>
                    </motion.div>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {filteredGames.length > 0 ? (
                    filteredGames.map((game, idx) => (
                      <motion.a
                        key={game.id}
                        href={`#game-${game.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/game/${game.id}`);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="glass rounded-xl overflow-hidden group cursor-pointer hover:border-brand-purple/30 transition-all block"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img 
                            src={game.image} 
                            alt={game.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            referrerPolicy="no-referrer"
                            loading="lazy"
                            onError={(e) => { e.currentTarget.src = "https://picsum.photos/seed/game/200/150"; }}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="w-10 h-10 bg-brand-purple rounded-full flex items-center justify-center purple-glow scale-0 group-hover:scale-100 transition-transform">
                              <Play fill="currentColor" size={16} className="ml-1" />
                            </div>
                          </div>
                          <div className="absolute top-2 right-2 px-1.5 py-0.5 glass rounded-lg text-[8px] font-bold flex items-center gap-1">
                            <Star size={8} className="text-yellow-400 fill-yellow-400" />
                            {game.rating}
                          </div>
                        </div>
                        <div className="p-3 flex items-center justify-between">
                          <div className="min-w-0">
                            <h3 className="font-bold text-sm group-hover:text-brand-purple transition-colors truncate text-slate-900">{game.title}</h3>
                            <div className="flex flex-col gap-0.5">
                              <p className="text-[10px] text-slate-500">{game.category}</p>
                              <p className="text-[9px] text-slate-400 line-clamp-1 italic group-hover:text-slate-500 transition-colors">{(game as any).shortDesc}</p>
                            </div>
                          </div>
                        </div>
                      </motion.a>
                    ))
                  ) : (
                    <div className="col-span-full py-16 text-center glass rounded-3xl border-dashed border-black/10">
                      <Gamepad2 className="mx-auto text-black/10 mb-4" size={48} />
                      <p className="text-slate-500 font-heading text-xl">No games available at the moment.</p>
                      <p className="text-slate-400 text-sm mt-2">Check back later for new releases!</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Popular Categories Links - Relocated to Bottom for SEO */}
              <section className="space-y-6 pt-12 border-t border-black/5">
                <div className="flex items-center gap-3">
                  <Trophy className="text-yellow-500" />
                  <h2 className="text-2xl font-bold uppercase tracking-tight">Browse Popular Categories</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-10 gap-4">
                  {["Action", "Sports", "Racing", "Arcade", "Puzzle", "Shooter", "Multiplayer", "Fighting", "Adventure", "Drawing"].map(cat => (
                      <a
                        key={cat}
                        href={`/category/${cat.toLowerCase()}`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/category/${cat.toLowerCase()}`);
                          document.getElementById('games-grid')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="glass p-4 rounded-2xl text-center group transition-all hover:bg-brand-purple/10 border-transparent hover:border-brand-purple/20"
                      >
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-brand-purple transition-colors">
                        {cat}
                      </span>
                    </a>
                  ))}
                </div>
              </section>

              {/* Quick Game Directory - Relocated to Bottom for SEO */}
              <section className="glass rounded-[2rem] p-8 space-y-4">
                <h3 className="font-bold uppercase tracking-widest text-[10px] text-slate-400 border-b border-black/5 pb-2">Classroom 6x Internal Game Directory</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-2 gap-x-6">
                  {GAMES.map(game => (
                    <a 
                      key={`dir-${game.id}`}
                      href={`/game/${game.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/game/${game.id}`);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-[11px] font-bold text-slate-500 hover:text-brand-purple transition-colors truncate"
                    >
                      Play {game.title.split(' ')[0]} Unblocked
                    </a>
                  ))}
                </div>
              </section>

              {/* SEO Content Section - Expanded to 600+ words with internal links */}
              <div className="space-y-12 pt-12 border-t border-white/5">
                <section className="glass rounded-3xl p-8 lg:p-12 space-y-10">
                  <header className="space-y-6">
                    <h2 className="text-4xl font-display uppercase tracking-tight text-gradient">Classroom 6x: The Ultimate Hub for School-Friendly Unblocked Games</h2>
                    <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-6 text-lg">
                      <p>
                        Welcome to the official <strong>Classroom 6x</strong> platform, where the barriers between you and your favorite digital entertainment disappear. In the modern educational landscape, finding high-quality <strong>unblocked games</strong> that are safe, reliable, and accessible from school networks can be a challenge. Our mission is to provide a curated, high-speed gaming environment that bypasses restrictive filters while maintaining a secure and distraction-free experience for students worldwide.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12 border-y border-black/5 py-12">
                        <article className="space-y-4">
                          <h3 className="text-2xl font-bold text-slate-900">About Classroom 6x</h3>
                          <p className="text-base text-slate-600">
                            <strong>Classroom 6x</strong> is a premier gaming portal designed for students who seek a safe, high-performance environment to enjoy digital entertainment. Unlike generic gaming sites, we curate our library to ensure every title is "Classroom 6x" certified—meaning it is lightweight, runs flawlessly on Chromebooks, and is optimized for the educational user base. Our platform serves as a reliable hub for original unblocked content and updated mirrors.
                          </p>
                        </article>
                        <article className="space-y-4">
                          <h3 className="text-2xl font-bold text-slate-900">What is Unblocked Games?</h3>
                          <p className="text-base text-slate-600">
                            <strong>Unblocked games</strong> are specialized versions of popular web games that are hosted on alternative domains or through advanced web tech like HTML5 to remain accessible on networks with strict filters, such as schools and offices. These games do not require downloads or installations, making them the safest way to enjoy gaming during your downtime without triggering network security alerts or software restrictions.
                          </p>
                        </article>
                      </div>

                      <section className="mt-16 space-y-12">
                        <div className="text-center space-y-4">
                          <h3 className="text-3xl font-display uppercase tracking-tight text-gradient">Classroom 6x Guides</h3>
                          <p className="text-slate-500">Expert advice on unblocked gaming, safety, and school access.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {BLOGS.slice(0, 6).map(blog => (
                          <a 
                            key={blog.id} 
                            href={`/blog/${blog.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(`/blog/${blog.id}`);
                              window.scrollTo({top: 0, behavior: 'smooth'});
                            }}
                            className="glass p-6 rounded-2xl group transition-all block hover:border-brand-purple/30"
                          >
                              <div className="flex items-center gap-2 mb-3 text-brand-purple">
                                <BookOpen size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Guide</span>
                              </div>
                              <h4 className="font-bold text-slate-900 group-hover:text-brand-purple transition-colors mb-2">{blog.title}</h4>
                              <p className="text-xs text-slate-500 line-clamp-2">{blog.excerpt}</p>
                              <div className="mt-4 pt-4 border-t border-black/5 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-brand-purple transition-colors">Read Article</span>
                                <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </a>
                          ))}
                        </div>

                        <div className="text-center mt-8">
                          <a 
                            href="#blogs"
                            onClick={(e) => {
                              e.preventDefault();
                              setActiveTab("Blogs");
                              window.scrollTo({top: 0, behavior: 'smooth'});
                            }}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-purple text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-brand-purple/20 hover:scale-105 transition-all block max-w-max mx-auto"
                          >
                            Explore All Guides & Articles <ChevronRight size={16} />
                          </a>
                        </div>
                      </section>

                      <article className="space-y-4 pt-12 border-t border-black/5">
                        <h3 className="text-2xl font-bold text-slate-900 mt-8">Why Students Choose Classroom 6x for Unblocked Gaming</h3>
                        <p>
                          What sets <strong>Classroom 6x</strong> apart from other gaming sites is our commitment to technical excellence and content curation. Every game on our list, from the adrenaline-pumping <button onClick={() => { const s = GAMES.find(g => g.id === 'slope'); if(s) setSelectedGame(s); }} className="text-brand-purple font-semibold hover:underline">Slope Unblocked</button> to tactical simulations like <strong>Retro Bowl</strong>, is optimized for HTML5. This means no bulky Flash plugins, no slow loading times, and absolutely no downloads required. 
                        </p>
                        <p>
                          We understand the "Classroom 6x" aesthetic—simple, fun, and instantly playable. Whether you are looking for <strong>unblocked games for school</strong> during a break or want to test your reflexes in a competitive setting, our site remains the most trusted mirror for unblocked content.
                        </p>
                      </article>

                      <article className="space-y-4">
                        <h3 className="text-2xl font-bold text-slate-900 mt-8">Exploring Our Most Popular Game Categories</h3>
                        <p>
                          Diversity is key to our library. We categorize our titles to help you find exactly what fits your mood:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li><strong>Action & Survival:</strong> Experience high-stakes gameplay in titles like <em>Ragdoll Archers</em> or <em>1v1.LOL</em>.</li>
                          <li><strong>Sports Classics:</strong> Manage your dream team in <button onClick={() => navigate('/game/retro-bowl')} className="text-brand-purple font-semibold hover:underline">Retro Bowl Unblocked Classroom 6x</button>, arguably the most popular sports title in our collection.</li>
                          <li><strong>Precision Racing:</strong> Master the physics of gravity in the legendary <strong>Slope Game</strong> or 2D classics like <em>Hill Climb Racing</em>.</li>
                          <li><strong>Multiplayer Arenas:</strong> Battle friends or strangers in real-time IO games that are perfectly scoped for school network speeds.</li>
                        </ul>
                      </article>

                      <div className="my-12 p-6 bg-brand-purple/5 rounded-2xl border border-brand-purple/10 flex flex-col md:flex-row items-center gap-8">
                        <img 
                          src="https://picsum.photos/seed/seo1/400/250" 
                          alt="Classroom 6x gaming lifestyle unblocked games dashboard" 
                          className="w-full md:w-1/3 rounded-xl shadow-lg"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-brand-purple mb-2">School-Safe & Mirror Updated</h4>
                          <p className="text-sm">Our engineering team works around the clock to ensure that <strong>Classroom 6x</strong> links remain alive. If one URL is limited, our smart-routing system provides alternative access points so your progress is never lost.</p>
                        </div>
                      </div>

                      <article className="space-y-4">
                        <h3 className="text-2xl font-bold text-slate-900 mt-8">Technical SEO and Fast Loading Times</h3>
                        <p>
                          Latency is the enemy of fun. On <strong>Classroom 6x</strong>, we utilize advanced Content Delivery Networks (CDNs) to serve game assets from servers closest to you. This technical foundation ensures that even graphics-heavy <strong>unblocked games</strong> like <em>Snow Rider 3D</em> run at a consistent 60 FPS, regardless of your hardware.
                        </p>
                        <p>
                          Furthermore, our platform is fully responsive. You can enjoy the <strong>Classroom 6x unblocked</strong> experience on Chromebooks, iPads, or standard library PCs. The interface scales perfectly, keeping the "Play" button front and center where it belongs.
                        </p>
                      </article>

                      <article className="space-y-4">
                        <h3 className="text-2xl font-bold text-slate-900 mt-8">How to Find New Games on Classroom 6x</h3>
                        <p>
                          We update our collection daily. To stay ahead of the curve, check out our <button onClick={() => { setActiveTab("New"); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="text-brand-purple font-semibold hover:underline">New Unblocked Games</button> section frequently. We source games from top developers and community submissions, ensuring that <strong>unblocked gaming</strong> at school never gets stale.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                           <div className="p-4 bg-white rounded-xl shadow-sm border border-black/5">
                             <h5 className="font-bold mb-2">Internal Gaming Directory</h5>
                             <ul className="text-xs space-y-1">
                               <li><a href="#games-grid" className="hover:text-brand-purple">Trending Action Games</a></li>
                               <li><a href="#games-grid" className="hover:text-brand-purple">Best Sports Games 2026</a></li>
                               <li><a href="#games-grid" className="hover:text-brand-purple">Top Rated Puzzle Games</a></li>
                             </ul>
                           </div>
                           <img 
                             src="https://picsum.photos/seed/seo2/400/200" 
                             alt="Student playing Retro Bowl unblocked in classroom" 
                             className="rounded-xl object-cover h-full"
                             referrerPolicy="no-referrer"
                           />
                        </div>
                      </article>

                      <article className="space-y-4">
                        <h3 className="text-2xl font-bold text-slate-900 mt-8">The Social Impact of Unblocked Games</h3>
                        <p>
                          Gaming is often a localized social activity. Browsing <strong>Classroom 6x</strong> together allows friends to compete on leaderboards or collaborate in puzzle-solving. This shared digital space fosters community and provides a much-needed mental reset during long study sessions.
                        </p>
                        <p>
                          In conclusion, <strong>Classroom 6x</strong> is not just a gaming site—it is a specialized portal designed for accessibility, safety, and performance. Jump into <button onClick={() => { document.getElementById('games-grid')?.scrollIntoView({behavior: 'smooth'}); }} className="text-brand-purple font-semibold hover:underline">the latest unblocked games</button> now and discover why millions of students choose us every month.
                        </p>
                      </article>
                    </div>
                  </header>

                  <script type="application/ld+json">
                    {JSON.stringify({
                      "@context": "https://schema.org",
                      "@type": "CollectionPage",
                      "name": "Classroom 6x Unblocked Games Collection",
                      "description": "The complete collection of classroom 6x unblocked games for school including Slope and Retro Bowl.",
                      "url": "https://classroom6x.store/",
                      "mainEntity": {
                        "@type": "ItemList",
                        "itemListElement": GAMES.slice(0, 10).map((game, i) => ({
                          "@type": "ListItem",
                          "position": i + 1,
                          "url": `https://classroom6x.store/game/${game.id}`,
                          "name": game.title
                        }))
                      }
                    })}
                  </script>
                </section>

                {/* Additional SEO Visual Links Section */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div 
                    onClick={() => {
                      setActiveTab("New");
                      setSelectedGame(null);
                      document.getElementById('games-grid')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="glass p-6 rounded-2xl flex flex-col items-center text-center space-y-4 group cursor-pointer hover:bg-white/40 transition-all"
                  >
                    <img 
                      src="https://picsum.photos/seed/nav1/100/100" 
                      alt="New Games Section Icon Classroom 6x" 
                      className="w-16 h-16 rounded-full group-hover:scale-110 transition-transform" 
                      referrerPolicy="no-referrer"
                    />
                    <h3 className="font-bold">New Releases</h3>
                    <p className="text-xs text-slate-500">The latest school-friendly mirrors added today.</p>
                  </div>
                  <div 
                    onClick={() => {
                      setActiveTab("Trending");
                      setSelectedGame(null);
                      document.getElementById('games-grid')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="glass p-6 rounded-2xl flex flex-col items-center text-center space-y-4 group cursor-pointer hover:bg-white/40 transition-all"
                  >
                    <img 
                      src="https://picsum.photos/seed/nav2/100/100" 
                      alt="Popular Games Section Icon Classroom 6x" 
                      className="w-16 h-16 rounded-full group-hover:scale-110 transition-transform" 
                      referrerPolicy="no-referrer"
                    />
                    <h3 className="font-bold">Trending Now</h3>
                    <p className="text-xs text-slate-500">What everyone is playing in the classroom right now.</p>
                  </div>
                  <div 
                    onClick={() => {
                      setActiveTab("Popular");
                      setSelectedGame(null);
                      document.getElementById('games-grid')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="glass p-6 rounded-2xl flex flex-col items-center text-center space-y-4 group cursor-pointer hover:bg-white/40 transition-all"
                  >
                    <img 
                      src="https://picsum.photos/seed/nav3/100/100" 
                      alt="Top Rated Games Section Icon Classroom 6x" 
                      className="w-16 h-16 rounded-full group-hover:scale-110 transition-transform" 
                      referrerPolicy="no-referrer"
                    />
                    <h3 className="font-bold">Top Rated</h3>
                    <p className="text-xs text-slate-500">Highest rated unblocked titles by the community.</p>
                  </div>
                </section>

                <section id="faq-section" className="space-y-8">
                  <h2 className="text-3xl font-heading font-bold flex items-center gap-3 text-slate-900">
                    <Clock className="text-brand-purple" />
                    Everything You Need to Know About Classroom 6x
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12 border-b border-black/5">
                    {FAQS.map((faq, idx) => (
                      <div key={idx} className="glass p-6 rounded-2xl space-y-3">
                        <h4 className="font-bold text-lg text-slate-900">{faq.question}</h4>
                        <div 
                          className="text-sm text-slate-500 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: faq.answer }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Comprehensive SEO Content to boost Text-HTML Ratio */}
                  <article className="glass rounded-[2rem] p-8 lg:p-12 space-y-8 bg-brand-purple/5 border-brand-purple/10">
                    <div className="space-y-6 max-w-none prose prose-slate text-slate-700">
                      <h2 className="text-3xl font-display uppercase tracking-tight text-gradient mb-8">The Definitive Guide to Unblocked Games on Classroom 6x</h2>
                      
                      <p className="text-lg leading-relaxed">
                        In today's digital age, the term <strong>unblocked games</strong> has become synonymous with freedom and entertainment for students worldwide. Whether you are navigating the strict network filters of a high school library or looking for a lightweight gaming experience on a school Chromebook, <strong>Classroom 6x</strong> serves as the premier destination for high-quality, safe, and instantly accessible web games. Our platform is meticulously engineered to ensure that every title—ranging from the high-speed thrills of <strong>Slope</strong> to the strategic depth of <strong>Retro Bowl</strong>—is available at your fingertips without the need for cumbersome downloads or administrative privileges.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 my-12">
                        <div className="space-y-4">
                          <h3 className="text-2xl font-bold text-slate-900">Why Use Classroom 6x?</h3>
                          <p>
                            Traditional gaming sites often trigger "Restricted Access" warnings due to insecure protocols or excessive tracking scripts. <strong>Classroom 6x unblocked</strong> differentiates itself by using HTTPS-secured mirrors and lightweight HTML5 technology. This means the games load faster, run smoother, and are less likely to be flagged by automated firewall systems. We prioritize user privacy and performance, creating a "clean" gaming loop that respects the educational environment while providing the mental reboot students need.
                          </p>
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-2xl font-bold text-slate-900">Optimized for Chromebooks</h3>
                          <p>
                            Most school devices have limited processing power. That's why every game on <strong>Classroom 6x</strong> is vetted for performance. We avoid resource-heavy WebGL wrappers where possible and favor optimized 2D and 3D engines that maintain a steady frame rate even on entry-level hardware. Whether you’re playing <em>BitLife</em> or <em>Tunnel Rush</em>, you can expect a seamless experience that won't overheat your laptop or drain your battery during a study break.
                          </p>
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold text-slate-900 mt-12">How to Access Classroom 6x Safely at School</h3>
                      <p>
                        Accessing unblocked content doesn't have to be complicated. The <strong>Classroom 6x</strong> network utilizes multiple mirror domains to ensure 24/7 availability. If you find our primary domain inaccessible, check our social feeds for current mirrors. We recommend using a modern browser like Google Chrome or Microsoft Edge for the best compatibility with our HTML5 game library. Always remember to use these games during permitted breaks to maintain a healthy balance between productivity and play.
                      </p>

                      <div className="bg-white/50 p-8 rounded-3xl border border-black/5 my-12 shadow-sm">
                        <h4 className="text-xl font-bold text-brand-purple mb-4">Pro Tips for Unblocked Gaming</h4>
                        <ul className="list-disc pl-6 space-y-3">
                          <li><strong>Use Fullscreen Mode:</strong> Most <strong>Classroom 6x</strong> games support a dedicated fullscreen toggle to remove browser UI distractions and increase immersion.</li>
                          <li><strong>Clear Your Cache:</strong> If a game isn't loading, clearing your browser cache often resets the state and allows the latest mirror version to load correctly.</li>
                          <li><strong>Keyboard Shortcuts:</strong> Mastering the WASD and Arrow key combinations is crucial for high-score titles like <em>Slope Game</em> or <em>Run 3</em>.</li>
                          <li><strong>Check the Rating:</strong> Use our community rating system to find the most "vetted" titles that work best on your specific network.</li>
                        </ul>
                      </div>

                      <h3 className="text-2xl font-bold text-slate-900">The Social Dimension of Gaming on Classroom 6x</h3>
                      <p>
                        One of the most overlooked aspects of <strong>unblocked games</strong> is the social community it builds. Students often share strategies for <em>Geometry Dash</em> or compete for the highest score in <em>Slope Unblocked 6x</em>. This localized competition fosters collaboration and problem-solving skills in a low-stakes, fun environment. At <strong>Classroom 6x</strong>, we believe that gaming should be a shared experience, which is why we've integrated easy-to-read leaderboards and category tags into our homepage.
                      </p>

                      <h3 className="text-2xl font-bold text-slate-900 mt-12">The Unblocked Games Revolution: A Historical Perspective</h3>
                      <p>
                        Web-based gaming has undergone a massive transformation over the last two decades. What started as simple Flash animations in the early 2000s has evolved into complex, hardware-accelerated 3D experiences. <strong>Classroom 6x</strong> stays at the forefront of this revolution by migrating legacy content to modern HTML5 and WebGL frameworks. This transition was essential when Adobe Flash reached its end-of-life, and it ensured that timeless classics like <em>Run 3</em> or <em>BitLife</em> remained playable for the next generation of students. By hosting these games on high-bandwidth servers and optimizing the delivery pipeline, we provide a "zero-install" solution that rivals the performance of native desktop applications.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
                        <div className="p-6 bg-white/40 rounded-2xl border border-black/5">
                          <h4 className="font-bold text-brand-purple mb-2">Cognitive Benefits</h4>
                          <p className="text-sm">Gaming breaks have been scientificially shown to improve focus and spatial awareness. Titles like <em>2048</em> or <em>What Beats Rock</em> challenge the brain's logic and pattern recognition skills, providing a productive mental reset during intense study sessions.</p>
                        </div>
                        <div className="p-6 bg-white/40 rounded-2xl border border-black/5">
                          <h4 className="font-bold text-brand-purple mb-2">Digital Literacy</h4>
                          <p className="text-sm">Navigating web-based interfaces and understanding browser-level performance settings helps students build essential digital literacy. Learning how to troubleshoot a loading script or handle cache resets is a valuable skill in the modern digital workspace.</p>
                        </div>
                        <div className="p-6 bg-white/40 rounded-2xl border border-black/5">
                          <h4 className="font-bold text-brand-purple mb-2">Reflex Development</h4>
                          <p className="text-sm">High-speed racers and precision platformers like <em>Slope</em> or <em>Tunnel Rush</em> are excellent for developing hand-eye coordination and rapid response times, skills that translate to various real-world technical tasks.</p>
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold text-slate-900">Advanced Accessibility and Performance Standards</h3>
                      <p>
                        When we talk about <strong>unblocked games for school</strong>, accessibility is our primary metric for success. We follow a strict optimization checklist for every title added to the <strong>Classroom 6x</strong> library. This includes minimizing the initial asset payload, implementing lazy-loading for heavy textures, and ensuring that game logic runs on a dedicated worker thread where possible. Our goal is to ensure that even a five-year-old Chromebook can render 60 frames per second on its native resolution. Furthermore, our site architecture is designed to be screen-reader friendly and fully navigable via keyboard, ensuring that every student has equal access to our high-quality gaming content.
                      </p>

                      <p>
                        In conclusion, <strong>Classroom 6x</strong> is more than just a collection of links. It is a curated ecosystem built on the principles of speed, safety, and community. We invite you to explore our vast archives, contribute to the community ratings, and help us maintain the gold standard for unblocked academic gaming. Whether you're here for a five-minute round of <em>Basket Random</em> or a deep dive into <em>GTA San Andreas Unblocked</em>, you'll find that our commitment to quality is what sets us apart from the rest of the web.
                      </p>

                      <h3 className="text-2xl font-bold text-slate-900 mt-12">Community Feedback and Game Reviews</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          { user: "Alex J.", game: "Slope Unblocked", text: "Classroom 6x has the smoothest version of Slope I've played. No lag on my school Chromebook, which is essential for hitting those high speeds. Best site for a quick gaming break!" },
                          { user: "Sarah M.", game: "Retro Bowl", text: "I love that I can manage my team and play the full season right in the browser. It's my go-to game during the library study sessions. Totally unblocked and works every time." },
                          { user: "Kevin K.", game: "Run 3", text: "Run 3 on Classroom 6x is a classic. The site is super fast and I don't get the 'restricted' notifications that I see on other sites. Big thanks to the owner for keeping it clean." },
                          { user: "Maria P.", game: "Basket Random", text: "My friends and I play local 2-player Basket Random all the time. The physics are hilarious and it's great that we don't need to create accounts or download anything." }
                        ].map((rev, i) => (
                          <div key={i} className="glass p-6 rounded-2xl border border-black/5 bg-white/30">
                            <div className="flex items-center gap-2 mb-2 text-brand-purple">
                              {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
                            </div>
                            <p className="text-sm text-slate-600 mb-2 italic">"{rev.text}"</p>
+                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">— {rev.user} on <span className="text-brand-purple">{rev.game}</span></p>
                          </div>
                        ))}
                      </div>

                      <h3 className="text-2xl font-bold text-slate-900 mt-12">Classroom 6x Development Log and Site Updates</h3>
                      <div className="space-y-4 border-l-2 border-brand-purple/20 pl-6 ml-2">
                        {[
                          { date: "April 2026", title: "Global Infrastructure Upgrade", text: "We have successfully migrated our unblocked games assets to a high-speed CDN with nodes in Singapore and the US, significantly reducing load times for international students." },
                          { date: "March 2026", title: "Retro Classics Library Expansion", text: "Added 50+ new retro titles including advanced quarterback simulators. We also optimized our HTML5 wrappers to support high-refresh-rate displays." },
                          { date: "February 2026", title: "Security and Mirror Updates", text: "Implemented advanced SSL handshakes and updated our fallback mirror logic. Classroom 6x at school remains the most accessible gaming hub on restricted networks." }
                        ].map((log, i) => (
                          <div key={i} className="space-y-1">
                            <span className="text-[10px] font-bold text-brand-purple uppercase tracking-widest">{log.date}</span>
                            <h4 className="font-bold text-sm text-slate-900">{log.title}</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">{log.text}</p>
                          </div>
                        ))}
                      </div>

                      <p className="border-t border-black/5 pt-8 italic text-slate-500 text-sm">
                        Disclaimer: Classroom 6x is an independent gaming aggregator. We encourage players to follow their school or workplace internet usage policies and only access unblocked games during designated free time or breaks. All trademarks and game properties are the property of their respective owners.
                      </p>
                    </div>
                  </article>
                </section>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* SEO FAQ Section */}
      <section className="container mx-auto px-6 py-16 border-t border-black/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl mb-8 text-center bg-gradient-to-r from-brand-purple to-pink-500 bg-clip-text text-transparent">Unblocked Games 6x & Hub FAQ</h2>
          <div className="grid gap-6">
            <div className="glass p-6 rounded-2xl">
              <h3 className="font-bold text-slate-900 mb-2">What is the Classroom 6x Hub?</h3>
              <p className="text-slate-600 text-sm leading-relaxed">The <strong>Classroom 6x Hub</strong> is the premiere destination for students to access <strong>unblocked games 6x</strong>. We provide a central <strong>classroom 6x hub</strong> where all games are vetted for performance and security, ensuring you can play <strong>unblocked6x</strong> content without any restrictions.</p>
            </div>
            <div className="glass p-6 rounded-2xl">
              <h3 className="font-bold text-slate-900 mb-2">How do I play survivor io unblocked classroom 6x?</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Playing <strong>survivor io unblocked classroom 6x</strong> is easy! Simply search for it in our <strong>classroom 6x hub</strong>. We host the dedicated <strong>survivor io unblocked classroom 6x</strong> mirror that bypasses school filters, allowing you to enjoy <strong>unblocked games 6x</strong> action instantly.</p>
            </div>
            <div className="glass p-6 rounded-2xl">
              <h3 className="font-bold text-slate-900 mb-2">Why should I use unblocked6x sites?</h3>
              <p className="text-slate-600 text-sm leading-relaxed"><strong>Unblocked6x</strong> sites like the <strong>Classroom 6x Hub</strong> are optimized for school networks. When you use an <strong>unblocked games 6x</strong> platform, you get faster loading times and games that are specifically configured to work on Chromebooks, making our <strong>classroom 6x hub</strong> the superior choice for <strong>unblocked6x</strong> gaming.</p>
            </div>
            <div className="glass p-6 rounded-2xl">
              <h3 className="font-bold text-slate-900 mb-2">Are unblocked games 6x safe to play?</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Yes! At the <strong>Classroom 6x Hub</strong>, safety is our priority. Every <strong>unblocked6x</strong> game is checked for malicious code. Our <strong>unblocked games 6x</strong> library is the safest <strong>classroom 6x hub</strong> on the internet, providing <strong>unblocked6x</strong> fun for everyone.</p>
            </div>
            <div className="glass p-6 rounded-2xl">
              <h3 className="font-bold text-slate-900 mb-2">Where can I play Kirka.io unblocked?</h3>
              <p className="text-slate-600 text-sm leading-relaxed">You can play <strong>kirka.io unblocked</strong> right here on the <strong>Classroom 6x Hub</strong>. We host the best version of <strong>kirka io</strong> that is compatible with school Chromebooks. Whether you call it <strong>kirka io.</strong> or <strong>back-to-school-shopping.ml kirka.io</strong>, we have the fastest connection available.</p>
            </div>
            <div className="glass p-6 rounded-2xl">
              <h3 className="font-bold text-slate-900 mb-2">Is Kirka.io aimbot allowed?</h3>
              <p className="text-slate-600 text-sm leading-relaxed">While many search for <strong>kirka.io aimbot</strong>, we recommend mastering the game's mechanics for the best experience. Our <strong>kirka.io unblocked</strong> version provides smooth frame rates to help you improve your natural aim without needing external tools.</p>
            </div>
            <div className="glass p-6 rounded-2xl">
              <h3 className="font-bold text-slate-900 mb-2">How can I play baseball 9 unblocked free?</h3>
              <p className="text-slate-600 text-sm leading-relaxed">You can play <strong>baseball 9 unblocked free</strong> right here on the Classroom 6x Hub. We offer <strong>baseball 9 online unblocked</strong> with no download required. Searching for <strong>baseball 9 unblocked games</strong> or <strong>9 inning baseball unblocked</strong>? Our platform ensures you can access <strong>baseball 9 unblocked at school</strong> without any filters blocking your fun.</p>
            </div>
            <div className="glass p-6 rounded-2xl">
              <h3 className="font-bold text-slate-900 mb-2">Is there a baseball 9 unblocked 76 version?</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Yes, we provide an experience equivalent to <strong>baseball 9 unblocked 76</strong> but with faster loading times and better performance. Our <strong>unblocked baseball 9</strong> mirror is optimized for the best <strong>baseball 9 unblocked free no download</strong> experience available on any browser.</p>
            </div>
            <div className="glass p-6 rounded-2xl">
              <h3 className="font-bold text-slate-900 mb-2">What are context clues games like Contexto?</h3>
              <p className="text-slate-600 text-sm leading-relaxed"><strong>Context clues games</strong> are a unique genre of word puzzles where you must guess a hidden word based on its linguistic similarity to your guesses. If you love <strong>games like contexto</strong>, you will enjoy our <strong>contexto games</strong> collection. These <strong>context clue games</strong> challenge your brain and help improve your vocabulary through <strong>context clues online games</strong>.</p>
            </div>
            <div className="glass p-6 rounded-2xl">
              <h3 className="font-bold text-slate-900 mb-2">How can I find the daily contexto game answer?</h3>
              <p className="text-slate-600 text-sm leading-relaxed">While we encourage you to find the <strong>contexto game answer</strong> yourself through logical guessing, our <strong>contexto games</strong> hub provides tips to help you master the <strong>context clue game</strong>. There is no need for a <strong>contexto game download</strong>—you can play <strong>context clues online games</strong> for free on the Classroom 6x Hub, any time of day. Every <strong>context clue game</strong> session is unique!</p>
            </div>
            <div className="glass p-6 rounded-2xl">
              <h3 className="font-bold text-slate-900 mb-2">Are games like Contexto good for students?</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Absolutely! <strong>Games like contexto</strong> and other <strong>context clues games</strong> are excellent for developing critical thinking. By engaging with a <strong>context clue game</strong> regularly, students can improve their reading comprehension. Our <strong>contexto games</strong> are designed to be educational. You can also play <strong>context clue games</strong> in competitive modes to see who finds the <strong>contexto game answer</strong> first!</p>
            </div>
            <div className="glass p-6 rounded-2xl">
              <h3 className="font-bold text-slate-900 mb-2">Can I get a contexto game download?</h3>
              <p className="text-slate-600 text-sm leading-relaxed">You don't actually need a <strong>contexto game download</strong> to enjoy the fun. Our <strong>context clues online games</strong> are fully optimized for web browsers. However, for those who prefer offline play, a <strong>contexto game download</strong> might be available in official app stores, but the <strong>Classroom 6x Hub</strong> offers the best <strong>context clue games</strong> directly online with no installation required.</p>
            </div>
            <div className="glass p-6 rounded-2xl">
              <h3 className="font-bold text-slate-900 mb-2">How to play Mario 64 classroom 6x?</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Playing <strong>mario 64 classroom 6x</strong> is simple. Just head to our adventure section and click on the <strong>mario 64 classroom 6x</strong> thumbnail. Our version of <strong>mario 64 classroom 6x</strong> is pre-configured for browser play, so you don't need any complex setup to start your <strong>mario 64 classroom 6x</strong> journey.</p>
            </div>
            <div className="glass p-6 rounded-2xl">
              <h3 className="font-bold text-slate-900 mb-2">Why is Drive Mad so popular?</h3>
              <p className="text-slate-600 text-sm leading-relaxed"><strong>Drive mad</strong> is popular because of its unique physics and challenging levels. When you play <strong>drive mad</strong> on Classroom 6x, you get the most stable <strong>drive mad</strong> experience. Every level in <strong>drive mad</strong> feels like a new puzzle to solve, which is why <strong>drive mad</strong> keeps players coming back.</p>
            </div>
            <div className="glass p-6 rounded-2xl">
              <h3 className="font-bold text-slate-900 mb-2">Where can I find classroom 6x geometry dash unblocked?</h3>
              <p className="text-slate-600 text-sm leading-relaxed">We host <strong>classroom 6x geometry dash unblocked</strong> right here on our hub. Our <strong>classroom 6x geometry dash unblocked</strong> mirror is fast and reliable. Don't worry about filters; <strong>classroom 6x geometry dash unblocked</strong> is specifically designed to work where other sites fail. Start playing <strong>classroom 6x geometry dash unblocked</strong> today!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-12 glass py-12 px-6">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-purple rounded-lg flex items-center justify-center">
                <Gamepad2 size={18} />
              </div>
              <span className="font-display text-xl tracking-wider">Classroom 6x</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              The world's most popular destination for unblocked games. Play thousands of titles for free, anywhere, anytime.
            </p>
            <div className="pt-2 flex flex-col gap-3">
              <a 
                href="https://www.facebook.com/jafran.farazi.1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-[#1877F2] transition-all"
              >
                <Facebook size={16} />
                Connect with Jafran Farazi
              </a>
              <a 
                href="https://www.youtube.com/watch?v=oDfa5Z8DCyU&pp=ygUPdW5ibG9ja2VkIGdhbWVz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-[#FF0000] transition-all"
              >
                <Youtube size={16} />
                Watch on YouTube
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-slate-900 uppercase tracking-widest text-xs">Categories</h4>
            <ul className="grid grid-cols-2 md:grid-cols-1 gap-3 text-sm text-slate-500">
              {NAV_TABS.slice(2).map(tab => (
                <li key={`footer-cat-${tab}`}>
                  <a 
                    href={`/category/${tab.toLowerCase()}`} 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      navigate(`/category/${tab.toLowerCase()}`); 
                      window.scrollTo({ top: 0, behavior: 'smooth' }); 
                    }} 
                    className="hover:text-brand-purple cursor-pointer transition-colors"
                  >
                    {tab} Games
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-slate-900 uppercase tracking-widest text-xs">Knowledge Hub</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              {BLOGS.slice(0, 8).map(blog => (
                <li key={`footer-blog-${blog.id}`}>
                  <a 
                    href={`/blog/${blog.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/blog/${blog.id}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-brand-purple cursor-pointer transition-colors truncate block max-w-[200px]"
                    title={blog.title}
                  >
                    {blog.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-slate-900 uppercase tracking-widest text-xs">Support</h4>
            <ul className="space-y-3 text-sm text-slate-500">
               <li>
                <a 
                  href="/about"
                  onClick={(e) => {
                    e.preventDefault();
                    setActivePage("About Us");
                    setSelectedGame(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-brand-purple cursor-pointer transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a 
                  href="/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    setActivePage("Contact Us");
                    setSelectedGame(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-brand-purple cursor-pointer transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a 
                  href="#faq-section"
                  onClick={(e) => {
                    e.preventDefault();
                    setActivePage(null);
                    setSelectedGame(null);
                    setActiveTab("Home");
                    setSearchQuery("");
                    setTimeout(() => {
                      document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-brand-purple cursor-pointer transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a 
                  href="/privacy"
                  onClick={(e) => {
                    e.preventDefault();
                    setActivePage("Privacy Policy");
                    setSelectedGame(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-brand-purple cursor-pointer transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="/terms"
                  onClick={(e) => {
                    e.preventDefault();
                    setActivePage("Terms of Service");
                    setSelectedGame(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-brand-purple cursor-pointer transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a 
                  href="/sitemap.xml"
                  target="_blank"
                  className="hover:text-brand-purple cursor-pointer transition-colors"
                >
                  Sitemap
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-slate-900 uppercase tracking-widest text-xs">Stay Updated</h4>
            <div className="space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed font-bold uppercase tracking-tight">Subscribe for <span className="text-brand-purple">Unblocked Games school</span> updates.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="bg-black/5 border border-black/10 rounded-xl px-4 py-2 text-sm flex-1 outline-none focus:border-brand-purple/50 text-slate-900 placeholder:text-slate-400"
                />
                <button className="p-2 bg-brand-purple text-white rounded-xl hover:brightness-110 transition-all">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-12 mb-12">
          <h4 className="font-bold mb-6 text-slate-900 uppercase tracking-widest text-xs">Exhaustive Game Sitemap</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-y-2 gap-x-4">
            {GAMES.map(game => (
              <a 
                key={`footer-map-${game.id}`}
                href={`/game/${game.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedGame(game);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-[11px] text-slate-400 hover:text-brand-purple transition-colors truncate"
              >
                {game.title}
              </a>
            ))}
          </div>
        </div>

        <div className="container mx-auto mt-12 pt-8 border-t border-black/5 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          © 2024-2026 Classroom 6x - The Best Destination for Unblocked Games school Students and Teachers.
        </div>
      </footer>
    </div>
  );
}
