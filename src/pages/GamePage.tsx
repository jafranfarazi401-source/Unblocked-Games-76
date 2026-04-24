import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronRight, X, Play, Loader2 } from 'lucide-react';
import { GAMES } from '../data';

const GamePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const game = GAMES.find(g => g.id === id);

  useEffect(() => {
    if (game) {
      document.title = `${game.title} Unblocked - Play on Classroom 6x`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', game.description || `Play ${game.title} for free at Classroom 6x! Experience the best unblocked games on our platform.`);
      }
      window.scrollTo(0, 0);
      setIsPlaying(false);
    } else {
      navigate('/');
    }
  }, [game, navigate]);

  if (!game) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
        <Link to="/" className="hover:text-brand-purple transition-colors">Home</Link>
        <ChevronRight size={10} />
        <Link to={`/category/${game.category.toLowerCase()}`} className="hover:text-brand-purple transition-colors">{game.category} Games</Link>
        <ChevronRight size={10} />
        <span className="text-slate-900">{game.title}</span>
      </nav>

      {/* Game Player Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img 
              src={game.image} 
              className="w-12 h-12 rounded-xl object-cover shadow-lg" 
              alt="" 
              referrerPolicy="no-referrer"
              onError={(e) => { e.currentTarget.src = "https://picsum.photos/seed/game/100/100"; }}
            />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{game.title}</h1>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">{game.category} • {game.rating} Rating</p>
            </div>
          </div>
          <Link 
            to="/"
            className="px-6 py-2 glass rounded-xl hover:bg-black/5 transition-all flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-600"
          >
            <X size={18} /> Back to Home
          </Link>
        </div>
        
        <div className="w-full max-w-[1000px] aspect-video mx-auto glass rounded-3xl overflow-hidden relative bg-black shadow-2xl group border border-white/5">
          {/* Background Pre-loader / Iframe */}
          <iframe 
            src={game.url} 
            className={`absolute inset-0 w-full h-full border-none z-10 transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            title={game.title}
            allowFullScreen
          />

          {!isPlaying && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6">
              <img 
                src={game.image} 
                className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-30 scale-110" 
                alt="" 
              />
              <div className="relative z-30 flex flex-col items-center gap-6">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-24 h-24 bg-brand-purple rounded-full flex items-center justify-center purple-glow cursor-pointer shadow-2xl"
                  onClick={() => setIsPlaying(true)}
                >
                  <Play fill="currentColor" size={40} className="ml-2 text-white" />
                </motion.div>
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-white uppercase tracking-widest drop-shadow-lg">{game.title}</h2>
                  <p className="text-white/60 text-sm font-bold uppercase tracking-widest flex items-center gap-2 justify-center">
                    <Loader2 size={16} className="animate-spin" />
                    Optimizing assets for instant delivery...
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-12">
          {/* Game Description & SEO Article */}
          <section className="glass rounded-3xl p-8 space-y-8">
            <div className="space-y-6">
              <h2 className="text-4xl font-display uppercase tracking-tight text-gradient">
                {game.id === 'hoops-and-fruits' ? 'Hoops & Fruits: A Whimsical Tossing Adventure' : 
                 game.id === 'funny-shooter-2' ? 'Funny Shooter 2: Zany Chaos and Hilarious Combat' :
                 game.id === 'epic-duck' ? 'Epic Duck: An Adventurous Journey of Exploration' :
                 game.id === 'stickman-street-fighting' ? 'Stickman Street Fighting 3D: Dominate the Streets' :
                 game.id === 'penalty-kick-wiz' ? 'Penalty Kick Wiz: Master the Art of the Shootout' :
                 game.id === 'moto-x3m-spooky-land' ? 'Moto X3M: Spooky Land - Eerie Thrills and Supernatural Stunts' :
                 game.id === 'merge-mine-idle-clicker' ? 'Merge Mine - Idle Clicker: Build Your Mining Empire' :
                 game.id === 'evil-invader' ? 'Evil Invader: Survive the Dystopian Battlefield' :
                 game.id === 'hoop-world' ? 'Hoop World: Master the Art of Aerial Dunks' :
                 game.id === 'goal-skibidi-goal' ? 'Goal Skibidi Goal: Zany Physics and Frenetic Soccer' :
                 game.id === 'samurai-brawling' ? 'Samurai Brawling: Arashin\'s Path of Vengeance and Honor' :
                 game.id === 'slope' ? 'Slope Unblocked Classroom 6x: The Ultimate 3D Speed Challenge' :
                 game.id === 'tunnel-rush' ? 'Tunnel Rush Unblocked Classroom 6x: High-Speed Reflex Odyssey' :
                 game.id === 'drive-mad' ? 'Drive Mad Unblocked Classroom 6x: Master the Physics of Racing' :
                 game.id === 'its-taxi' ? 'Its taxi by artast Unblocked Classroom 6x: The Pixel-Perfect Taxi Sim' :
                 game.id === 'retro-bowl' ? 'Retro Bowl Unblocked Classroom 6x: The Ultimate Football Management Simulation' :
                 game.id === 'bitlife' ? 'BitLife Unblocked: Experience a Life of Infinite Possibilities' :
                 game.id === '1v1-lol' ? '1v1.LOL Unblocked: Master the Art of Competitive Building and Combat' :
                 game.id === 'geometry-dash-og' ? 'Geometry Dash OG Unblocked: Rhythm, Precision, and Geometric Chaos' :
                 game.id === 'super-mario-64' ? 'Super Mario 64 Unblocked Games Classroom 6x: The 3D Adventure That Changed Gaming' :
                 `The Chaotic Joy of ${game.title}`}
              </h2>
              <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4">
                {game.id === 'hoops-and-fruits' ? (
                  <>
                    <p>Step into the vibrant and playful world of <strong>Hoops & Fruits</strong>, a delightful arcade game that challenges your precision and timing. tossed hoops to capture a variety of colorful, fruity targets.</p>
                    <p>The game features intuitive drag-and-drop mechanics that are easy to learn but difficult to master. As you progress, you'll encounter increasingly complex arrangements of fruits. Charming graphics and soundtrack create an immersive atmosphere.</p>
                  </>
                ) : game.id === 'funny-shooter-2' ? (
                  <>
                    <p>Dive into the zany chaos of <strong>Funny Shooter 2 unblock</strong>, where every battle is a laugh-filled thrill ride. combines fast-paced action with a whimsical world bursting with personality.</p>
                    <p>face off against quirky enemies. vibrant, colorful environments provide the perfect backdrop for high-octane combat.</p>
                  </>
                ) : game.id === 'epic-duck' ? (
                  <>
                    <p>Embark on an adventurous journey with <strong>Epic Duck Unblocked</strong>, where clever exploration and precise timing lead to success. charming arcade game of puzzles and platforming.</p>
                    <p>take control of a brave little duck on a mission. Navigate through beautifully designed levels, find hidden keys that unlock the path to the next stage.</p>
                  </>
                ) : game.id === 'stickman-street-fighting' ? (
                  <>
                    <p>Get ready to dominate the streets as a fearless stickman in <strong>Stickman Street Fighting 3D Unblocked</strong>! crush foes with strategic blows and quick reflexes.</p>
                    <p>experience high-octane combat in urban environments. navigate through waves of enemies, using your martial arts prowess to emerge victorious.</p>
                  </>
                ) : game.id === 'slope' ? (
                  <>
                    <p><strong>Slope Unblocked Classroom 6x</strong> is the definitive 3D space-running game. Test your reflexes as you navigate a high-speed ball through a neon-lit futuristic world.</p>
                    <p>Avoid obstacles, master the tilt, and achieve the highest score in this addictive, school-friendly unblocked game. The minimalist design ensures smooth performance on any hardware.</p>
                  </>
                ) : game.id === 'retro-bowl' ? (
                  <>
                    <p><strong>Retro Bowl Unblocked</strong> is the ultimate retro-style football management simulation. Lead your team to victory in this addictive 8-bit aesthetic masterpiece.</p>
                    <p>Manage your roster, lead your squad, and experience the most reliable retro bowl unblocked experience, perfect for school Chromebooks and restricted networks.</p>
                  </>
                ) : (
                  <div className="space-y-4">
                    <p>Experience the thrill of <strong>{game.title}</strong> directly in your browser. This {game.category.toLowerCase()} masterpiece is designed to provide high-speed entertainment without any downloads or installations.</p>
                    <p>{game.shortDesc}</p>
                    <p>At Classroom 6x, we prioritize performance and safety. Every game in our library, including <em>{game.title}</em>, is vetted to ensure it works perfectly on school Chromebooks and restricted networks. No plugins required—just instant, unblocked fun.</p>
                    {game.description && <p className="whitespace-pre-line">{game.description}</p>}
                  </div>
                )}
              </div>
            </div>
            
            <div className="pt-8 border-t border-black/5 flex flex-wrap gap-4">
               {['unblocked', 'classroom 6x', game.category.toLowerCase(), 'free games', 'no download'].map(tag => (
                 <span key={tag} className="px-3 py-1 bg-black/5 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-400">
                   #{tag.replace(' ', '-')}
                 </span>
               ))}
            </div>
          </section>

          {/* Related Games Suggestions */}
          <section className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
               <div className="w-1.5 h-6 bg-brand-purple rounded-full" />
               More {game.category} Games
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {GAMES.filter(g => g.category === game.category && g.id !== game.id).slice(0, 3).map(relatedGame => (
                <Link key={relatedGame.id} to={`/game/${relatedGame.id}`} className="group space-y-3">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden glass group-hover:shadow-xl transition-all duration-500">
                    <img 
                      src={relatedGame.image} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      alt="" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-brand-purple transition-colors text-center truncate px-2">{relatedGame.title}</h4>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="glass p-6 rounded-3xl space-y-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Game Controls</h3>
            <div className="space-y-3">
              {[
                { key: 'Mouse/Click', action: 'Navigate & Interact' },
                { key: 'Arrows/WASD', action: 'Movement' },
                { key: 'Space', action: 'Jump/Primary Action' },
                { key: 'P', action: 'Pause Game' }
              ].map(control => (
                <div key={control.key} className="flex items-center justify-between py-2 border-b border-black/5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{control.key}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900">{control.action}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-6 rounded-3xl space-y-6 sticky top-28">
             <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Popular Right Now</h3>
             <div className="space-y-4">
                {GAMES.slice(0, 5).map(g => (
                  <Link key={`sidebar-${g.id}`} to={`/game/${g.id}`} className="flex items-center gap-3 group">
                    <img 
                      src={g.image} 
                      className="w-12 h-12 rounded-lg object-cover group-hover:scale-105 transition-transform" 
                      alt="" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-brand-purple transition-colors truncate">{g.title}</h4>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">{g.category}</p>
                    </div>
                  </Link>
                ))}
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default GamePage;
