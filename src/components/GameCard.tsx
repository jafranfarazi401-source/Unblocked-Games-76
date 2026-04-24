import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Play, Star, ChevronRight } from 'lucide-react';
import { Game } from '../data';

interface GameCardProps {
  game: Game;
  index: number;
}

const GameCard: React.FC<GameCardProps> = ({ game, index }) => {
  return (
    <Link to={`/game/${game.id}`}>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ delay: index * 0.05 }}
        className="group relative bg-[#1A1A2E]/40 backdrop-blur-xl rounded-[2rem] overflow-hidden border border-white/5 hover:border-brand-purple/50 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(118,75,217,0.15)] flex flex-col h-full active:scale-95"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img 
            src={game.image} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
            alt={game.title}
            referrerPolicy="no-referrer"
            onError={(e) => { e.currentTarget.src = "https://picsum.photos/seed/game/400/300"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F1A] via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
          
          <div className="absolute top-4 left-4 flex gap-2">
            <div className="px-3 py-1 bg-brand-purple/90 backdrop-blur-md rounded-full flex items-center gap-1">
              <Star size={10} className="text-yellow-400 fill-yellow-400" />
              <span className="text-[10px] font-bold text-white">{game.rating}</span>
            </div>
            <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
              <span className="text-[10px] font-bold text-white/90 uppercase tracking-wider">{game.category}</span>
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100">
            <div className="w-16 h-16 bg-brand-purple rounded-full flex items-center justify-center purple-glow shadow-2xl">
              <Play fill="white" className="text-white ml-1" size={24} />
            </div>
          </div>
        </div>

        <div className="p-6 space-y-3 flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-white group-hover:text-brand-purple transition-colors line-clamp-1">
            {game.title}
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
            {game.shortDesc}
          </p>
          <div className="pt-2 mt-auto flex items-center justify-between">
            <span className="text-[10px] font-bold text-brand-purple uppercase tracking-[0.2em]">Play Now</span>
            <ChevronRight className="text-brand-purple group-hover:translate-x-1 transition-transform" size={16} />
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default GameCard;
