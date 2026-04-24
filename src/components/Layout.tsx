import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gamepad2, 
  Search, 
  ChevronRight, 
  Menu, 
  X, 
  Facebook, 
  Youtube,
  Loader2
} from 'lucide-react';
import { NAV_TABS, GAMES } from '../data';

interface LayoutProps {
  children: React.ReactNode;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, searchQuery, setSearchQuery }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const location = useLocation();

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

  // Handle section scrolling
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentTab = location.pathname.startsWith('/category/') 
    ? location.pathname.replace('/category/', '').charAt(0).toUpperCase() + location.pathname.replace('/category/', '').slice(1)
    : location.pathname === '/' ? 'Home' : '';

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Mouse Follower Object */}
      <div 
        className="mouse-follower hidden lg:block"
        style={{ 
          left: `${mousePos.x}px`, 
          top: `${mousePos.y}px` 
        }}
      />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 px-6 py-4 mx-4 mt-4 glass rounded-2xl border border-black/10 flex items-center justify-between">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-3 cursor-pointer group shrink-0" onClick={() => { setSearchQuery(""); window.scrollTo(0,0); }}>
          <div className="w-10 h-10 bg-brand-purple rounded-xl flex items-center justify-center shrink-0 purple-glow group-hover:scale-110 transition-transform">
            <Gamepad2 className="text-white" size={24} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-xl tracking-wider text-slate-900">CLASSROOM</span>
            <span className="font-display text-sm tracking-[0.2em] text-brand-purple">6X</span>
          </div>
        </Link>

        {/* Center: Navigation */}
        <div className="hidden md:flex items-center gap-4 text-xs font-bold uppercase tracking-widest">
          <Link
            to="/"
            onClick={() => { setSearchQuery(""); window.scrollTo(0,0); }}
            className={`px-4 py-2 rounded-xl transition-all ${
              location.pathname === "/" && !searchQuery
                ? "bg-brand-purple text-white shadow-lg shadow-brand-purple/20" 
                : "text-slate-500 hover:text-slate-900 hover:bg-black/5"
            }`}
          >
            Home
          </Link>

          <button
            onClick={() => {
              if (location.pathname !== '/') {
                navigate('/');
                setTimeout(() => scrollToSection('games-grid'), 100);
              } else {
                scrollToSection('games-grid');
              }
            }}
            className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-black/5 border border-transparent hover:border-black/5 transition-all text-xs font-bold uppercase tracking-widest"
          >
            Directory
          </button>

          <div className="relative categories-dropdown-container">
            <button
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                isCategoriesOpen || (location.pathname.startsWith('/category/'))
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
                      <Link
                        key={tab}
                        to={`/category/${tab.toLowerCase()}`}
                        onClick={() => setIsCategoriesOpen(false)}
                        className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all text-left ${
                          location.pathname === `/category/${tab.toLowerCase()}`
                            ? "bg-brand-purple/10 text-brand-purple" 
                            : "text-slate-500 hover:bg-black/5 hover:text-slate-900"
                        }`}
                      >
                        {tab}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            to="/blogs"
            className={`px-4 py-2 rounded-xl transition-all ${
              location.pathname === "/blogs" || location.pathname.startsWith('/blog/')
                ? "bg-brand-purple text-white shadow-lg shadow-brand-purple/20" 
                : "text-slate-500 hover:text-slate-900 hover:bg-black/5"
            }`}
          >
            Blogs
          </Link>
        </div>

        {/* Right: Actions */}
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
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (location.pathname !== '/') navigate('/');
                    }}
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
              <Link 
                to="/"
                onClick={() => {
                  setIsMenuOpen(false);
                  setTimeout(() => scrollToSection('games-grid'), 100);
                }}
                className="text-left py-3 px-4 rounded-xl text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 hover:bg-black/5 transition-all border border-black/5"
              >
                Browse All Directory
              </Link>
              {NAV_TABS.map((tab) => (
                <Link
                  key={tab}
                  to={tab === "Home" ? "/" : tab === "Blogs" ? "/blogs" : `/category/${tab.toLowerCase()}`}
                  className={`text-left py-3 px-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${
                    (tab === "Home" && location.pathname === "/") || 
                    (tab === "Blogs" && location.pathname === "/blogs") ||
                    (location.pathname === `/category/${tab.toLowerCase()}`)
                      ? "bg-brand-purple text-white shadow-lg" 
                      : "text-slate-500 hover:text-slate-900 hover:bg-black/5"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {tab}
                </Link>
              ))}
              <div className="h-px bg-black/5 mx-4 my-2" />
              <Link to="/contact" className="text-left py-3 px-4 rounded-xl text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-black/5" onClick={() => setIsMenuOpen(false)}>Contact Us</Link>
              <Link to="/privacy" className="text-left py-3 px-4 rounded-xl text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-black/5" onClick={() => setIsMenuOpen(false)}>Privacy Policy</Link>
              <Link to="/terms" className="text-left py-3 px-4 rounded-xl text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-black/5" onClick={() => setIsMenuOpen(false)}>Terms of Service</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 container mx-auto px-4 py-4 relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-12 glass py-12 px-6">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-purple rounded-lg flex items-center justify-center">
                <Gamepad2 size={18} className="text-white" />
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
            <ul className="space-y-3 text-sm text-slate-500 font-bold uppercase tracking-[0.1em]">
              <li><Link to="/category/action" className="hover:text-brand-purple transition-colors">Action Games</Link></li>
              <li><Link to="/category/sports" className="hover:text-brand-purple transition-colors">Sports Games</Link></li>
              <li><Link to="/category/racing" className="hover:text-brand-purple transition-colors">Racing Games</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-slate-900 uppercase tracking-widest text-xs">Popular Searches</h4>
            <div className="flex flex-wrap gap-2 pr-4">
              {['Slope', 'Retro Bowl', 'Run 3', 'Sniper', 'Soccer', 'Basketball', 'Driving', 'Car'].map(term => (
                <button 
                  key={term}
                  onClick={() => {
                    setSearchQuery(term);
                    navigate('/');
                    setTimeout(() => scrollToSection('games-grid'), 100);
                  }}
                  className="text-[10px] font-bold text-slate-400 hover:text-brand-purple border border-slate-200 px-2 py-0.5 rounded transition-colors uppercase tracking-tighter"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-slate-900 uppercase tracking-widest text-xs">Support</h4>
            <ul className="space-y-3 text-sm text-slate-500 font-bold uppercase tracking-[0.1em]">
               <li><Link to="/about" className="hover:text-brand-purple transition-colors">About Us</Link></li>
               <li><Link to="/contact" className="hover:text-brand-purple transition-colors">Contact Us</Link></li>
               <li><Link to="/privacy" className="hover:text-brand-purple transition-colors">Privacy Policy</Link></li>
               <li><Link to="/terms" className="hover:text-brand-purple transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div className="md:col-span-1">
             <h4 className="font-bold mb-6 text-slate-900 uppercase tracking-widest text-xs">Stay Updated</h4>
             <div className="space-y-4">
               <p className="text-[10px] text-slate-500 leading-relaxed font-bold uppercase tracking-tight">Subscribe for <span className="text-brand-purple">Unblocked Games school</span> updates.</p>
               <div className="flex gap-2">
                 <input 
                   type="email" 
                   placeholder="Email address" 
                   className="bg-black/5 border border-black/10 rounded-xl px-4 py-2 text-sm flex-1 outline-none focus:border-brand-purple/50 text-slate-900 placeholder:text-slate-400 min-w-0"
                 />
                 <button className="p-2 bg-brand-purple text-white rounded-xl hover:brightness-110 transition-all shrink-0">
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
              <Link 
                key={`footer-map-${game.id}`}
                to={`/game/${game.id}`}
                className="text-[11px] text-slate-400 hover:text-brand-purple transition-colors truncate"
              >
                {game.title}
              </Link>
            ))}
          </div>
        </div>

        <div className="container mx-auto mt-12 pt-8 border-t border-black/5 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          © 2024-2026 Classroom 6x - The Best Destination for Unblocked Games school Students and Teachers.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
