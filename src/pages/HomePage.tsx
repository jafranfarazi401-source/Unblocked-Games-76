import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Flame, Clock, Gamepad2, Search, Star, ChevronRight } from 'lucide-react';
import { GAMES, FAQS } from '../data';
import GameCard from '../components/GameCard';

interface HomePageProps {
  searchQuery: string;
}

const HomePage: React.FC<HomePageProps> = ({ searchQuery }) => {
  const [activeTab, setActiveTab] = useState("Home");

  const filteredGames = GAMES.filter(game => {
    const matchesCategory = activeTab === "Home" || game.category === activeTab;
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          game.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ["Home", "Action", "Multiplayer", "Sports", "Shooter", "Drawing", "Arcade", "Fighting", "Racing", "Adventure"];

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] rounded-[3rem] overflow-hidden group">
        <img 
          src={GAMES[0].image} 
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-10000" 
          alt="Featured Game"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F0F1A] via-[#0F0F1A]/80 to-transparent flex flex-col justify-center px-8 md:px-16 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-brand-purple"
          >
            <Star size={16} fill="currentColor" />
            <span className="text-xs font-bold uppercase tracking-[0.3em]">Editor's Choice</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-display uppercase tracking-tight text-white leading-none max-w-2xl"
          >
            Classroom <span className="text-brand-purple">6X</span> Premium
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 max-w-lg text-lg leading-relaxed"
          >
            Experience the next generation of unblocked gaming. High-performance, school-optimized, and free forever.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4 pt-4"
          >
            <button 
              onClick={() => document.getElementById('games-grid')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-brand-purple text-white font-bold rounded-2xl shadow-xl shadow-brand-purple/20 hover:scale-105 transition-all uppercase tracking-widest text-xs flex items-center gap-2"
            >
              <Gamepad2 size={18} /> Explore Games
            </button>
            <div className="hidden sm:flex -space-x-2">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0F0F1A] overflow-hidden bg-slate-800">
                  <img src={`https://i.pravatar.cc/100?u=${i}`} alt="" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-[#0F0F1A] bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400">
                +2k
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Filter */}
      <section id="games-grid" className="space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-slate-900">
            <div className="w-10 h-10 glass rounded-xl flex items-center justify-center purple-glow">
              <Trophy size={20} className="text-brand-purple" />
            </div>
            <h2 className="text-2xl font-bold uppercase tracking-tight">Main Directory</h2>
          </div>

          <div className="flex items-center gap-2 p-1.5 glass rounded-2xl overflow-x-auto no-scrollbar max-w-full">
            {categories.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
                  activeTab === tab 
                    ? "bg-brand-purple text-white shadow-lg shadow-brand-purple/20 translate-y-[-2px]" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-black/5"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredGames.length > 0 ? (
              filteredGames.map((game, index) => (
                <GameCard key={game.id} game={game} index={index} />
              ))
            ) : (
              <div className="col-span-full py-20 flex flex-col items-center justify-center space-y-4">
                <Search size={48} className="text-slate-200" />
                <p className="text-slate-400 font-bold uppercase tracking-widest">No games match your search...</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="glass rounded-[3rem] p-8 md:p-16 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
              <Flame className="text-emerald-500" size={24} />
            </div>
            <h2 className="text-4xl md:text-5xl font-display uppercase tracking-tight text-slate-900 leading-tight">
               Unblocked Access <br/> <span className="text-brand-purple">Reinvented</span>
            </h2>
            <div className="space-y-4 text-slate-500 text-lg leading-relaxed font-medium">
              <p>
                Classroom 6x is not just another game portal. We've optimized every line of code to circumvent network restrictions while maintaining enterprise-level performance. 
              </p>
              <p>
                Whether it's physics-heavy titles like <em>Slope</em> or competitive brawlers like <em>1v1.LOL</em>, our proprietary mirroring system ensures you get the full experience without the lag, ads, or intrusive tracking found on legacy sites.
              </p>
            </div>
            <div className="flex items-center gap-8 pt-4">
               <div className="flex flex-col">
                  <span className="text-3xl font-bold text-slate-900 tracking-tighter">99.9%</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Uptime</span>
               </div>
               <div className="w-px h-12 bg-black/5" />
               <div className="flex flex-col">
                  <span className="text-3xl font-bold text-slate-900 tracking-tighter">0.5s</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Load Speed</span>
               </div>
               <div className="w-px h-12 bg-black/5" />
               <div className="flex flex-col">
                  <span className="text-3xl font-bold text-slate-900 tracking-tighter">24/7</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Monitoring</span>
               </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-4">
                <div className="h-40 glass rounded-3xl overflow-hidden bg-brand-purple/5 p-8 flex flex-col justify-end">
                   <Gamepad2 className="text-brand-purple mb-4" size={32} />
                   <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Library</div>
                   <div className="text-lg font-bold text-slate-900">5,000+ Titles</div>
                </div>
                <div className="h-64 glass rounded-3xl overflow-hidden group">
                   <img src={GAMES[2].image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" referrerPolicy="no-referrer" />
                </div>
             </div>
             <div className="space-y-4 pt-8">
                <div className="h-64 glass rounded-3xl overflow-hidden group">
                   <img src={GAMES[1].image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" referrerPolicy="no-referrer" />
                </div>
                <div className="h-40 glass rounded-3xl overflow-hidden bg-brand-purple/5 p-8 flex flex-col justify-end">
                   <Trophy className="text-brand-purple mb-4" size={32} />
                   <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Weekly</div>
                   <div className="text-lg font-bold text-slate-900">Top Rankings</div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq-section" className="space-y-8">
        <div className="flex items-center gap-2 text-slate-900">
          <div className="w-10 h-10 glass rounded-xl flex items-center justify-center purple-glow">
            <Clock size={20} className="text-brand-purple" />
          </div>
          <h2 className="text-2xl font-bold uppercase tracking-tight">Frequently Asked Questions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FAQS.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass p-6 rounded-3xl space-y-3 cursor-help group border-l-4 border-transparent hover:border-brand-purple transition-all"
            >
              <h3 className="font-bold text-slate-900 group-hover:text-brand-purple transition-colors">{faq.question}</h3>
              <p className="text-slate-500 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: faq.answer }} />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
