import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Trophy, Search } from 'lucide-react';
import { GAMES, CATEGORY_DESCRIPTIONS } from '../data';
import GameCard from '../components/GameCard';

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  
  const categoryName = categoryId 
    ? categoryId.charAt(0).toUpperCase() + categoryId.slice(1)
    : '';

  const filteredGames = GAMES.filter(g => g.category.toLowerCase() === categoryId?.toLowerCase());

  useEffect(() => {
    if (filteredGames.length > 0) {
      document.title = `Best ${categoryName} Unblocked Games | Classroom 6x`;
      window.scrollTo(0, 0);
    } else {
      navigate('/');
    }
  }, [categoryName, filteredGames.length, navigate]);

  if (filteredGames.length === 0) return null;

  return (
    <div className="space-y-12 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Category Header */}
      <div className="glass rounded-[3rem] p-8 md:p-16 space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/5 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="relative z-10 space-y-6">
          <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-purple/60">
            <Link to="/" className="hover:text-brand-purple transition-colors">Home</Link>
            <ChevronRight size={10} />
            <span className="text-brand-purple">{categoryName} Games</span>
          </nav>
          <div className="flex items-center gap-4">
             <div className="w-16 h-16 bg-brand-purple rounded-2xl flex items-center justify-center purple-glow">
                <Trophy size={32} className="text-white" />
             </div>
             <h1 className="text-4xl md:text-6xl font-display uppercase tracking-tight text-gradient leading-tight">
               Best {categoryName} <br/> Unblocked Games
             </h1>
          </div>
          <p className="text-slate-500 text-lg leading-relaxed max-w-3xl font-medium">
            {CATEGORY_DESCRIPTIONS[categoryName] || `Explore our hand-picked selection of the most popular ${categoryName} games. All titles are unblocked for school and optimized for immediate browser play.`}
          </p>
        </div>
      </div>

      {/* Games Grid */}
      <section className="space-y-8">
        <div className="flex items-center gap-2 text-slate-900 px-4">
           <div className="w-8 h-8 glass rounded-lg flex items-center justify-center">
              <Search size={16} className="text-slate-400" />
           </div>
           <h2 className="text-sm font-bold uppercase tracking-widest">Found {filteredGames.length} Results</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredGames.map((game, index) => (
              <GameCard key={game.id} game={game} index={index} />
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Suggestion Section */}
      <section className="text-center py-12 space-y-6">
         <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs">Didn't find what you were looking for?</h3>
         <Link to="/" className="inline-flex items-center gap-2 px-8 py-3 glass rounded-2xl hover:bg-black/5 transition-all text-sm font-bold uppercase tracking-widest text-slate-900">
            Browse All Categories <ChevronRight size={16} />
         </Link>
      </section>
    </div>
  );
};

export default CategoryPage;
