import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Loader2
} from 'lucide-react';

// Mock Data
const GAMES = [
  { 
    id: 'basket-random', 
    title: "Basket Random Unblocked", 
    category: "Sports", 
    image: "https://taptapshots.net/uploads/2025/8/basket-random.webp", 
    rating: 4.9,
    url: "https://ubg98.github.io/BasketRandom/"
  },
  {
    id: 'hoops-and-fruits',
    title: "Hoops & Fruits",
    category: "Drawing",
    image: "https://img.gamepix.com/games/hoops-and-fruits/icon/hoops-and-fruits.png?w=105",
    rating: 4.8,
    url: "https://play.gamepix.com/hoops-and-fruits/embed?sid=VCOSN"
  },
  {
    id: 'funny-shooter-2',
    title: "Funny Shooter 2 unblock",
    category: "Shooter",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReRQw36C3zJ2i13AdaEkJniN4NCTvig3nM-w&s",
    rating: 4.7,
    url: "https://play.gamepix.com/funny-shooter-2/embed?sid=VCOSN"
  },
  {
    id: 'epic-duck',
    title: "Epic Duck Unblocked",
    category: "Arcade",
    image: "https://play-lh.googleusercontent.com/4btOwsNG-fLmSqmbpjmDEdJQDlRCmKWcnV2CRYI23-O-_U88IB_QqQhgE9k56vVwBwjmbRMx1ZIJ3I8MFXum",
    rating: 4.6,
    url: "https://play.gamepix.com/epic-duck/embed?sid=VCOSN"
  },
  {
    id: 'stickman-street-fighting',
    title: "Stickman Street Fighting 3D Unblocked",
    category: "Fighting",
    image: "https://www.friv2online.com/files/images/ba/ba980ba53e51b6b64db4fb2340ccfbe2.jpg",
    rating: 4.8,
    url: "https://play.gamepix.com/stickman-street-fighting/embed?sid=VCOSN"
  },
  {
    id: 'penalty-kick-wiz',
    title: "Penalty Kick Wiz Unblocked",
    category: "Sports",
    image: "https://a.silvergames.com/j/b/world-cup-penalty-shootout.jpg",
    rating: 4.8,
    url: "https://play.gamepix.com/penalty-kick-wiz/embed?sid=VCOSN"
  },
  {
    id: 'moto-x3m-spooky-land',
    title: "Moto X3M: Spooky Land Unblocked",
    category: "Racing",
    image: "https://img.poki-cdn.com/cdn-cgi/image/q=78,scq=50,width=1200,height=1200,fit=cover,f=png/3f8a297822df891a1c158576b6461014/moto-x3m-spooky-land.png",
    rating: 4.9,
    url: "https://play.gamepix.com/moto-x3m-spooky-land/embed?sid=VCOSN"
  },
  {
    id: 'merge-mine-idle-clicker',
    title: "Merge Mine - Idle Clicker Unblocked",
    category: "Adventure",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4pwoUFYJ3RCEHfZh8RrVUgNmk6EYcBtP-Gg&s",
    rating: 4.7,
    url: "https://play.gamepix.com/merge-mine-idle-clicker/embed?sid=VCOSN"
  },
  {
    id: 'evil-invader',
    title: "Evil Invader",
    category: "Arcade",
    image: "https://img.gamepix.com/games/evil-invader/icon/evil-invader.png?w=105",
    rating: 4.7,
    url: "https://play.gamepix.com/evil-invader/embed?sid=VCOSN"
  },
  {
    id: 'hoop-world',
    title: "Hoop World Unblocked",
    category: "Sports",
    image: "https://play-lh.googleusercontent.com/b0MjOypDwP6KNeXyGX253avRT8cfRmxwv-RSy7rmQYt4f21lE4OqwgBjNkE5TAeIGqo",
    rating: 4.8,
    url: "https://play.gamepix.com/hoop-world/embed?sid=VCOSN"
  },
  {
    id: 'goal-skibidi-goal',
    title: "Goal Skibidi Goal",
    category: "Sports",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlj5I8XPSSFtWZmDixk15POYBMne2P51HsQg&s",
    rating: 4.8,
    url: "https://play.gamepix.com/goal-skibidi-goal/embed?sid=VCOSN"
  },
  {
    id: 'samurai-brawling',
    title: "Samurai Brawling Unblocked",
    category: "Fighting",
    image: "https://imgcdn.stablediffusionweb.com/2024/10/20/9a451112-66fa-4549-b2cf-c5ff9c41afe2.jpg",
    rating: 4.9,
    url: "https://play.gamepix.com/samurai-brawling/embed?sid=VCOSN"
  },
  {
    id: 'gta-san-andreas',
    title: "Grand Theft Auto: San Andreas Unblocked",
    category: "Multiplayer",
    image: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c4/GTASABOX.jpg/250px-GTASABOX.jpg",
    rating: 5.0,
    url: "https://st.8games.net/10/igra-gta-san-andreas/",
    description: "Grand Theft Auto: San Andreas (2004) is an open-world action-adventure game developed by Rockstar North. Set in 1992, players control Carl \"CJ\" Johnson, who returns to the fictional state of San Andreas to restore his street gang to power, fight corrupt cops, and solve his mother's murder. The game is acclaimed for its massive, diverse map covering three major cities, deep character customization, and iconic 90s-themed gameplay."
  },
  {
    id: 'retro-bowl',
    title: "Retro Bowl Unblocked",
    category: "Sports",
    image: "https://picsum.photos/seed/retrobowl/400/300",
    rating: 4.9,
    url: "https://game316009.konggames.com/game.html",
    description: "Retro Bowl is the perfect game for the armchair quarterback to finally prove a point. Presented in a glorious retro style, the game has simple roster management, including press duties and the handling of fragile egos, while on the field you get to call the shots."
  },
  {
    id: 'slope',
    title: "Slope Unblocked",
    category: "Racing",
    image: "https://picsum.photos/seed/slope/400/300",
    rating: 4.8,
    url: "https://kdata1.com/2020/05/slope/",
    description: "Slope is the ultimate running game that will put your skills to the test. Speed down on a random slope. The farther you go, the faster your ball travels. This game might look simple but playing this will give you extreme adrenaline rush."
  },
  {
    id: 'tunnel-rush',
    title: "Tunnel Rush Unblocked",
    category: "Arcade",
    image: "https://picsum.photos/seed/tunnelrush/400/300",
    rating: 4.7,
    url: "https://play.gamepix.com/tunnel-rush/embed?sid=VCOSN"
  },
  {
    id: 'drive-mad',
    title: "Drive Mad Unblocked",
    category: "Racing",
    image: "https://picsum.photos/seed/drivemad/400/300",
    rating: 4.8,
    url: "https://play.gamepix.com/drive-mad/embed?sid=VCOSN"
  },
  {
    id: 'snow-rider-3d',
    title: "Snow Rider 3D Classroom 6x",
    category: "Racing",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_DVKF0NH5HT4lbRiRCv4_ey4q3gUXQS0zEQ&s",
    rating: 4.9,
    url: "https://itsvijaysingh.github.io/Snow-Rider3D/",
    description: "Snow Rider 3D Classroom 6x is an exhilarating 3D racing game where you slide down snowy slopes, dodge obstacles, and collect gifts. Experience the thrill of high-speed sledding with stunning graphics and smooth gameplay, perfectly unblocked for school and work."
  },
  {
    id: 'ragdoll-archers',
    title: "Ragdoll Archers Classroom 6x",
    category: "Action",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQChhAQo9os5fZ3QLUY5gILDlhWrf-jYgwDIA&s",
    rating: 4.9,
    url: "https://bitlifeonline.github.io/ragdoll-archers/",
    description: "Ragdoll Archers Classroom 6x is a physics-based archery game where you control a ragdoll archer in intense battles. Aim carefully, account for gravity, and defeat your opponents in this addictive unblocked game. Play solo or with a friend in 2-player mode!"
  }
];

const FAQS = [
  {
    question: "What is Basket Random Unblocked?",
    answer: "Basket Random Unblocked is a chaotic, physics-based 2-player basketball game where every round brings new surprises. From changing fields to different players and balls, the goal remains the same: score 5 points to win!"
  },
  {
    question: "How do I play Basket Random?",
    answer: "The controls are incredibly simple! You only need one key to jump and throw. In 2-player mode, one player uses the 'W' key while the other uses the 'Up Arrow'. The randomness of the physics is what makes it fun!"
  },
  {
    question: "Can I play Basket Random with a friend?",
    answer: "Yes! Basket Random features a dedicated 2-player mode on the same keyboard, making it one of the best local multiplayer games for school or home."
  },
  {
    question: "Why is it called 'Random'?",
    answer: "The game is called 'Random' because almost everything changes every time a basket is scored. You might find yourself playing with long arms, on an icy court, or using a bowling ball instead of a basketball."
  },
  {
    question: "Is Basket Random Unblocked free to play?",
    answer: "Absolutely. You can play the full version of Basket Random Unblocked directly in your browser without any downloads or hidden costs."
  },
  {
    question: "Does the game work on mobile?",
    answer: "Yes, Basket Random is built with HTML5 technology, meaning it works seamlessly on both desktop browsers and mobile devices."
  },
  {
    question: "What is Hoops & Fruits?",
    answer: "Hoops & Fruits is a whimsical arcade game where you toss hoops to catch colorful, fruity targets. It combines addictive drag-and-drop gameplay with charming graphics and a captivating soundtrack."
  },
  {
    question: "How do I score big in Hoops & Fruits?",
    answer: "The key to high scores is hooping multiple fruits at once! Master the drag-and-drop mechanics to clear levels and achieve the highest possible score."
  },
  {
    question: "What is Funny Shooter 2 unblock?",
    answer: "Funny Shooter 2 is a zany first-person shooter where you face off against quirky enemies in a whimsical world. It features endless customization and action-packed gameplay."
  },
  {
    question: "Is Funny Shooter 2 unblocked for school?",
    answer: "Yes! Our platform provides the unblocked version of Funny Shooter 2, allowing you to enjoy the hilarious chaos anywhere, including school or work."
  },
  {
    question: "What is Epic Duck Unblocked?",
    answer: "Epic Duck is an adventurous arcade game where you navigate charming levels, uncover hidden keys, and unlock doorways. It's a delightful test of strategy and reflexes."
  },
  {
    question: "How do I play Epic Duck?",
    answer: "Use your keyboard or touch controls to move the duck through the levels. Explore the environment to find keys and reach the exit while avoiding obstacles."
  },
  {
    question: "What is Stickman Street Fighting 3D Unblocked?",
    answer: "Stickman Street Fighting 3D is an intense brawler where you play as a fearless stickman dominating the streets. It features strategic combat, power-ups, and various weapons."
  },
  {
    question: "How do I win in Stickman Street Fighting?",
    answer: "Defeat all enemies in each level using quick reflexes and strategic blows. Break objects to find power-ups and weapons that give you an edge in combat."
  },
  {
    question: "What is Penalty Kick Wiz Unblocked?",
    answer: "Penalty Kick Wiz is an adrenaline-filled sports game where you engage in a penalty shootout duel. It tests your precision, anticipation, and split-second decision-making as both a shooter and a goalkeeper."
  },
  {
    question: "How do I play Penalty Kick Wiz?",
    answer: "Use your mouse or touch screen to aim and shoot. When defending, react quickly to your opponent's shots to make saves. Timing and strategy are key to winning the tournament."
  },
  {
    question: "What is Moto X3M: Spooky Land Unblocked?",
    answer: "Moto X3M: Spooky Land is a high-octane bike racing game with a spooky theme. It features challenging tracks filled with supernatural obstacles, gravity-defying stunts, and eerie environments."
  },
  {
    question: "How do I control the bike in Moto X3M?",
    answer: "Use the Arrow keys or WASD to control your bike. The Up arrow is to accelerate, Down to brake, and Left/Right arrows to tilt and perform flips. Performing flips reduces your time!"
  },
  {
    question: "Is Moto X3M: Spooky Land free to play?",
    answer: "Yes, you can play Moto X3M: Spooky Land Unblocked for free directly in your browser on our platform with no downloads required."
  },
  {
    question: "What is Merge Mine - Idle Clicker Unblocked?",
    answer: "Merge Mine - Idle Clicker is a strategic mining game where you tap to mine diamonds, upgrade tools, and merge them to increase your mining efficiency. It's an addictive idle game that lets you build a massive mining empire."
  },
  {
    question: "How do I play Merge Mine?",
    answer: "Tap the screen to mine resources. Use your earnings to buy new tools. Merge two identical tools to create a more powerful version. Automate your mining process to keep earning even when you're not clicking!"
  },
  {
    question: "What is Evil Invader?",
    answer: "Evil Invader is an intense survival shooter set in a dystopian battlefield. You must fight off relentless monstrous foes using a variety of weapons and power-ups while mastering enemy patterns to survive."
  },
  {
    question: "How do I survive in Evil Invader?",
    answer: "Success in Evil Invader requires quick reflexes and strategic use of power-ups. Master the movement and attack patterns of different enemies, and level up to unlock more powerful weapons to handle the increasing difficulty."
  },
  {
    question: "What is Hoop World Unblocked?",
    answer: "Hoop World is a dynamic 3D basketball game where you perform aerial acrobatics and flipping dunks. It combines simple mouse-click controls with spectacular moves for a thrilling sports experience."
  },
  {
    question: "How do I play Hoop World?",
    answer: "Use your mouse to time your jumps and flips. Click to soar through the air and perform dunks. Precision and timing are key to mastering the aerial stunts and outshining your opponents with style."
  },
  {
    question: "What is Goal Skibidi Goal?",
    answer: "Goal Skibidi Goal is a zany, physics-based soccer game where you use head motions to navigate and outwit opponents in dynamic duels filled with unpredictability."
  },
  {
    question: "How do I play Goal Skibidi Goal?",
    answer: "Navigate using nimble head motions, leveraging clever jumps, ducks, and slides. Master power-ups to outwit opponents in dynamic duels filled with exhilarating momentum."
  },
  {
    question: "What is Samurai Brawling Unblocked?",
    answer: "Samurai Brawling is an exhilarating 3D adventure where you play as Arashin, a fierce Yakuza warrior. Engage in strategic battles against samurais and ninjas in a gripping storyline."
  },
  {
    question: "How do I play Samurai Brawling?",
    answer: "Master special moves and evolving abilities to defeat formidable foes. The game features pulse-pounding combat and a deep narrative set in a world of intrigue."
  },
  {
    question: "What is A Small World Cup on Classroom 6x?",
    answer: "A Small World Cup is a hilarious, physics-based soccer game available on Classroom 6x. It features simple controls where you slam your player into the ball to score goals in a miniature tournament format."
  },
  {
    question: "Is Classroom 6x safe to use?",
    answer: "Yes, Classroom 6x is a safe platform for playing browser-based games. We do not require downloads or account creation, which minimizes security risks for our users."
  },
  {
    question: "What happened to Classroom 6x?",
    answer: "Classroom 6x has evolved over the years, moving from older Flash-based platforms to modern HTML5 technology to ensure games remain playable in all modern browsers after the end of Flash support."
  },
  {
    question: "Why is Classroom 6x not working?",
    answer: "If the site isn't working, it might be due to a strict school or office firewall. Try clearing your browser cache or using a different mirror link. We strive to keep our unblocked games accessible at all times."
  },
  {
    question: "How to play What Beats Rock game unblocked at Classroom 6x?",
    answer: "What Beats Rock is a creative logic game. You can play it on our site by typing in objects that you think would logically defeat the previous one. It's a great test of wit and imagination."
  },
  {
    question: "Can I play Retro Bowl on Classroom 6x?",
    answer: "Absolutely! Retro Bowl unblocked on Classroom 6x is one of our most popular titles. You can manage your team and lead them to victory right in your browser."
  },
  {
    question: "Is Slope unblocked available here?",
    answer: "Yes, Slope unblocked on Classroom 6x is a fan favorite. Experience the high-speed neon ball run and test your reflexes on our platform."
  },
  {
    question: "What is Grand Theft Auto: San Andreas Unblocked?",
    answer: "Grand Theft Auto: San Andreas Unblocked is a legendary open-world action-adventure game. Set in the early 90s, you follow the story of CJ as he navigates the streets of San Andreas. Our version is unblocked and ready to play in your browser."
  },
  {
    question: "How can I play GTA San Andreas unblocked at school?",
    answer: "You can play GTA San Andreas right here on Classroom 6x. We provide a browser-compatible version that bypasses most school filters, allowing you to enjoy the classic Rockstar title anywhere."
  },
  {
    question: "Is GTA San Andreas Multiplayer available?",
    answer: "While the original single-player story is the main focus, many unblocked versions and mods allow for various multiplayer experiences. Check out our Multiplayer category for more similar games."
  },
  {
    question: "What is Snow Rider 3D Classroom 6x?",
    answer: "Snow Rider 3D Classroom 6x is a fast-paced 3D sledding game where you navigate through a snowy landscape filled with obstacles. It's designed to provide an immersive winter sports experience directly in your browser."
  },
  {
    question: "How do I play Snow Rider 3D?",
    answer: "Use the Arrow keys or WASD to steer your sled. Avoid hitting trees, rocks, and other obstacles while collecting gifts to unlock new sleds. The goal is to go as far as possible and achieve a high score."
  },
  {
    question: "Can I unlock new sleds in Snow Rider 3D?",
    answer: "Yes! By collecting gifts during your run, you can save up to purchase different types of sleds, each with its own unique look and feel."
  },
  {
    question: "Is Snow Rider 3D unblocked for school?",
    answer: "Absolutely. Our version of Snow Rider 3D is optimized for Classroom 6x, ensuring it's unblocked and playable in restricted environments like schools or offices."
  },
  {
    question: "What is Ragdoll Archers Classroom 6x?",
    answer: "Ragdoll Archers Classroom 6x is a physics-based archery game featuring ragdoll characters. Players must use their archery skills to defeat enemies in various game modes, including 1-player, 2-player, and survival modes."
  },
  {
    question: "How do I play Ragdoll Archers?",
    answer: "Use your mouse or touch screen to aim and shoot. Click and drag to adjust the power and angle of your shot. In 2-player mode, players take turns or compete simultaneously depending on the selected mode. Collect power-ups and upgrade your archer to become more powerful."
  },
  {
    question: "What makes Ragdoll Archers unique?",
    answer: "The game's physics-based ragdoll mechanics add a layer of unpredictability and humor to the combat. Every hit affects the character's movement realistically, making for dynamic and engaging battles."
  },
  {
    question: "Is Ragdoll Archers unblocked for school?",
    answer: "Yes! Ragdoll Archers Classroom 6x is fully unblocked and optimized for school and work environments. You can enjoy the game directly in your browser without any restrictions."
  }
];

const NAV_TABS = ["Home", "Action", "Multiplayer", "Sports", "Shooter", "Drawing", "Arcade", "Fighting", "Racing", "Adventure"];

export default function App() {
  const [activeTab, setActiveTab] = useState("Home");
  const [activePage, setActivePage] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
    if (selectedGame) {
      setIsPlaying(false); // Reset play state when changing games
      document.title = `${selectedGame.title} - Play Online Free at Classroom 6x`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        const description = selectedGame.description || `Play ${selectedGame.title} for free at Classroom 6x! Experience the best unblocked games on our platform. No downloads, unblocked for school and work.`;
        metaDesc.setAttribute('content', description);
      }
    } else if (activePage) {
      document.title = `${activePage} - Classroom 6x`;
    } else {
      document.title = "Classroom 6x - Play Free Unblocked Games Online";
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', "Play Classroom 6x for free! The best destination for unblocked games, including Ragdoll Archers, Snow Rider 3D, Retro Bowl, Slope, GTA San Andreas Unblocked, and more. Unblocked games for school and work. No downloads required.");
      }
    }
  }, [selectedGame, activePage]);

  const handleLogoClick = () => {
    setSelectedGame(null);
    setIsPlaying(false);
    setActiveTab("Home");
    setActivePage(null);
  };

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

      {/* Navbar - Redesigned for a cleaner, more premium look */}
      <nav className="sticky top-0 z-50 px-6 py-4 mx-4 mt-4 glass rounded-2xl border border-black/10 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={handleLogoClick}>
          <div className="w-10 h-10 bg-brand-purple rounded-xl flex items-center justify-center purple-glow group-hover:scale-110 transition-transform">
            <Gamepad2 className="text-white" size={24} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-xl tracking-wider text-slate-900">CLASSROOM</span>
            <span className="font-display text-sm tracking-[0.2em] text-brand-purple">6X</span>
          </div>
        </div>

        {/* Center: Navigation (Hidden on mobile) */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={handleLogoClick}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === "Home" && !selectedGame 
                ? "bg-brand-purple text-white shadow-lg shadow-brand-purple/20" 
                : "text-slate-500 hover:text-slate-900 hover:bg-black/5"
            }`}
          >
            Home
          </button>

          <div className="relative categories-dropdown-container">
            <button
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
                isCategoriesOpen || (activeTab !== "Home" && !selectedGame)
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
                    {NAV_TABS.filter(tab => tab !== "Home").map((tab) => (
                      <button
                        key={tab}
                        onClick={() => {
                          setActiveTab(tab);
                          setSelectedGame(null);
                          setIsCategoriesOpen(false);
                        }}
                        className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all text-left ${
                          activeTab === tab && !selectedGame 
                            ? "bg-brand-purple/10 text-brand-purple" 
                            : "text-slate-500 hover:bg-black/5 hover:text-slate-900"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
              {NAV_TABS.map((tab) => (
                <button
                  key={tab}
                  className={`text-left py-3 px-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${
                    activeTab === tab && !selectedGame 
                      ? "bg-brand-purple text-white shadow-lg" 
                      : "text-slate-500 hover:text-slate-900 hover:bg-black/5"
                  }`}
                  onClick={() => {
                    setActiveTab(tab);
                    setSelectedGame(null);
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
                    setActivePage(page);
                    setSelectedGame(null);
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
                onClick={() => setActivePage(null)}
                className="p-3 glass rounded-2xl hover:bg-black/5 transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="prose prose-slate max-w-none text-slate-600 space-y-8">
              {activePage === "Contact Us" && (
                <div className="space-y-6">
                  <p className="text-lg">Have questions or feedback? We'd love to hear from you! Reach out to our team using the information below.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="glass p-6 rounded-2xl space-y-2">
                      <h3 className="font-bold text-slate-900">Email Support</h3>
                      <p className="text-brand-purple">support@classroom6x.com</p>
                    </div>
                    <div className="glass p-6 rounded-2xl space-y-2">
                      <h3 className="font-bold text-slate-900">Business Inquiries</h3>
                      <p className="text-brand-purple">business@classroom6x.com</p>
                    </div>
                  </div>
                  <div className="glass p-8 rounded-3xl space-y-6">
                    <h3 className="text-xl font-bold text-slate-900">Send us a Message</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="text" placeholder="Your Name" className="bg-black/5 border border-black/10 rounded-xl px-4 py-3 outline-none focus:border-brand-purple/50" />
                      <input type="email" placeholder="Your Email" className="bg-black/5 border border-black/10 rounded-xl px-4 py-3 outline-none focus:border-brand-purple/50" />
                    </div>
                    <textarea placeholder="Your Message" rows={4} className="w-full bg-black/5 border border-black/10 rounded-xl px-4 py-3 outline-none focus:border-brand-purple/50 resize-none"></textarea>
                    <button className="w-full py-4 bg-brand-purple text-white font-bold rounded-xl shadow-lg shadow-brand-purple/20 hover:brightness-110 transition-all">
                      Send Message
                    </button>
                  </div>
                </div>
              )}

              {activePage === "Privacy Policy" && (
                <div className="space-y-6">
                  <p>At Classroom 6x, we take your privacy seriously. This policy describes how we collect, use, and protect your information.</p>
                  <h3 className="text-xl font-bold text-slate-900">1. Information Collection</h3>
                  <p>We do not require user accounts to play games. We may collect anonymous usage data to improve our platform performance and user experience.</p>
                  <h3 className="text-xl font-bold text-slate-900">2. Cookies</h3>
                  <p>We use cookies to remember your game progress and preferences. These are stored locally on your device.</p>
                  <h3 className="text-xl font-bold text-slate-900">3. Third-Party Services</h3>
                  <p>Our games are provided by various developers and may contain their own tracking or advertising scripts. We encourage you to review their respective privacy policies.</p>
                </div>
              )}

              {activePage === "Terms of Service" && (
                <div className="space-y-6">
                  <p>By using Classroom 6x, you agree to the following terms and conditions.</p>
                  <h3 className="text-xl font-bold text-slate-900">1. Usage</h3>
                  <p>Our platform is intended for entertainment purposes only. You agree to use the site responsibly and in accordance with local laws.</p>
                  <h3 className="text-xl font-bold text-slate-900">2. Content</h3>
                  <p>All games and media on this site are the property of their respective owners. We do not claim ownership of third-party content.</p>
                  <h3 className="text-xl font-bold text-slate-900">3. Disclaimer</h3>
                  <p>The site is provided "as is" without warranties of any kind. We are not responsible for any issues arising from the use of our platform.</p>
                </div>
              )}
            </div>
          </motion.div>
        ) : selectedGame ? (
          <div className="space-y-8">
            {/* Game Player Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={selectedGame.image} className="w-12 h-12 rounded-xl object-cover shadow-lg" alt="" />
                  <div>
                    <h1 className="text-3xl font-bold">{selectedGame.title}</h1>
                    <p className="text-slate-500 text-sm">{selectedGame.category} • {selectedGame.rating} Rating</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setSelectedGame(null);
                    setIsPlaying(false);
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
                    <h2 className="text-4xl font-display uppercase tracking-tight text-gradient">
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
                       `The Chaotic Joy of ${selectedGame.title}`}
                    </h2>
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
                  <h3 className="font-bold text-xl">Recent Uploads</h3>
                  <div className="space-y-4">
                    {GAMES.filter(g => g.id !== selectedGame.id).map(game => (
                      <div 
                        key={game.id} 
                        className="flex gap-4 group cursor-pointer"
                        onClick={() => setSelectedGame(game)}
                      >
                        <img src={game.image} className="w-16 h-16 rounded-lg object-cover group-hover:scale-105 transition-transform" alt="" />
                        <div>
                          <h4 className="font-bold group-hover:text-brand-purple transition-colors text-slate-900">{game.title}</h4>
                          <p className="text-xs text-slate-500">{game.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
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
                        const gta = GAMES.find(g => g.id === 'gta-san-andreas');
                        if (gta) setSelectedGame(gta);
                      }}
                      className="relative z-10 px-8 py-4 bg-brand-purple text-white rounded-xl font-bold uppercase tracking-widest purple-glow hover:scale-110 transition-all shadow-2xl shadow-brand-purple/20 translate-y-40"
                    >
                      Play GTA Now
                    </button>
                  </div>
                </motion.div>

                {/* Center: Text Content */}
                <div className="lg:col-span-5 space-y-2 text-center lg:text-left -mt-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h1 className="font-display text-4xl md:text-5xl xl:text-6xl uppercase tracking-tighter text-gradient leading-none">
                      CLASSROOM 6X
                    </h1>
                  </motion.div>

                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-slate-600 text-base leading-relaxed max-w-xl mx-auto lg:mx-0"
                  >
                    Welcome to the ultimate destination for unblocked gaming. Classroom 6x brings you the best 
                    collection of unblocked games, including Ragdoll Archers, Retro Bowl, Slope, Snow Rider 3D, and thousands of other titles.
                  </motion.p>
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
                        onClick={() => setSelectedGame(game)}
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
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-heading font-bold flex items-center gap-3">
                    <Clock className="text-brand-purple" />
                    {activeTab === "Home" ? "Recent Uploaded Games" : `${activeTab} Games`}
                    {searchQuery && ` - Search: "${searchQuery}"`}
                  </h2>
                  <button 
                    onClick={() => {
                      setActiveTab("Home");
                      setSearchQuery("");
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-sm text-slate-500 hover:text-brand-purple flex items-center gap-1 transition-colors"
                  >
                    View All <ChevronRight size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {filteredGames.length > 0 ? (
                    filteredGames.map((game, idx) => (
                      <motion.div
                        key={game.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => setSelectedGame(game)}
                        className="glass rounded-xl overflow-hidden group cursor-pointer hover:border-brand-purple/30 transition-all"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img 
                            src={game.image} 
                            alt={game.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            referrerPolicy="no-referrer"
                            loading="lazy"
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
                            <p className="text-[10px] text-slate-500">{game.category}</p>
                          </div>
                        </div>
                      </motion.div>
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

              {/* Home Page Blog & FAQ - Added for better visibility and SEO */}
              <div className="space-y-12 pt-12 border-t border-white/5">
                <section className="glass rounded-3xl p-8 space-y-8">
                  <div className="space-y-6">
                    <h2 className="text-4xl font-display uppercase tracking-tight text-gradient">Classroom 6x: Your Ultimate Guide to Unblocked Games</h2>
                    <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-6">
                      <p>
                        Welcome to <strong>Classroom 6x</strong>, the premier destination for students and gamers looking to enjoy their favorite titles without restrictions. Whether you're at school, in the office, or just looking for a quick gaming fix, our platform offers a massive collection of <strong>unblocked games</strong> that are ready to play instantly in your browser.
                      </p>
                      
                      <h3 className="text-2xl font-bold text-slate-900 mt-8">Why Classroom 6x is the Best Choice</h3>
                      <p>
                        In today's world, many networks block popular gaming sites. That's where <strong>Classroom 6x</strong> comes in. Our site is specifically designed to bypass these filters, providing you with access to <strong>unblocked games</strong>. We focus on high-quality HTML5 games that don't require any downloads, making them safe and easy to access.
                      </p>
                      <p>
                        From the classic <strong>Classroom 6x</strong> experience to the latest releases, we curate our library to ensure there's something for everyone. Whether you're searching for <strong>unblocked games</strong> or a specific title like <strong>retro bowl unblocked</strong>, you'll find it here.
                      </p>

                      <h3 className="text-2xl font-bold text-slate-900 mt-8">Popular Titles on Classroom 6x</h3>
                      <p>
                        Our users love the variety we offer. Some of the most searched terms on our site include <strong>slope unblocked</strong>, <strong>ragdoll archers classroom 6x</strong>, and <strong>snow rider 3d classroom 6x</strong>, which offer thrilling, fast-paced experiences. If you're a fan of sports, you might be looking for <strong>basketball unblocked</strong> or <strong>soccer games unblocked</strong>. We even have specialized titles like <strong>crazy cattle 3d unblocked</strong> and <strong>100 meter sprint unblocked</strong> for those who enjoy unique challenges.
                      </p>
                      <p>
                        For fans of American football, <strong>retro bowl unblocked</strong> is a must-play. It combines retro aesthetics with deep management gameplay. If you prefer the court, <strong>basketball stars unblocked</strong> provides intense 1v1 action. We also cater to those who love speed with our <strong>car games unblocked</strong> category.
                      </p>

                      <h3 className="text-2xl font-bold text-slate-900 mt-8">The Variety of Classroom 6x Games</h3>
                      <p>
                        The beauty of <strong>Classroom 6x</strong> is the sheer diversity. You can jump from a high-speed <strong>parkour games unblocked</strong> session to a precision-based <strong>slice master unblocked</strong> level in seconds. Our platform is built to handle this variety, ensuring smooth transitions and fast loading times.
                      </p>
                      <p>
                        We understand that gamers are always looking for the latest <strong>unblocked game</strong> links. That's why we constantly update our site with new mirrors and titles. Whether you're a fan of the original <strong>Classroom 6x</strong> or looking for something new, we've got you covered.
                      </p>

                      <h3 className="text-2xl font-bold text-slate-900 mt-8">How to Access Classroom 6x at School</h3>
                      <p>
                        Accessing <strong>Classroom 6x</strong> at school can sometimes be tricky. However, because we use modern web technologies and frequently update our domains, we remain one of the most reliable sources for <strong>unblocked games</strong>. Simply visit our site, browse the categories, and click play. No complicated setups or VPNs are usually required.
                      </p>
                      <p>
                        Our commitment to providing <strong>unblocked games</strong> means we prioritize user experience. The site is optimized for both desktop and mobile, so you can play <strong>Classroom 6x</strong> on any device.
                      </p>

                      <h3 className="text-2xl font-bold text-slate-900 mt-8">Safety and Security</h3>
                      <p>
                        One of the most common questions we get is: "Is <strong>Classroom 6x</strong> safe?" The answer is a resounding yes. We don't ask for personal information, and our games are served over secure connections. We know that when you're looking for <strong>unblocked games</strong>, you want a worry-free experience, and that's exactly what we provide.
                      </p>

                      <h3 className="text-2xl font-bold text-slate-900 mt-8">Conclusion</h3>
                      <p>
                        Whether you're here for <strong>retro bowl unblocked</strong>, <strong>slope unblocked</strong>, or just to explore the world of <strong>Classroom 6x</strong>, we're glad you're here. <strong>Classroom 6x</strong> is more than just a website; it's a community of gamers who value freedom and fun. Dive into our collection of <strong>unblocked games</strong> today and see why we're the #1 choice for unblocked gaming!
                      </p>
                      <p>
                        Remember to bookmark us and share with your friends so everyone can enjoy the best <strong>unblocked games</strong> available on the web. From <strong>basketball stars unblocked</strong> to <strong>slice master unblocked</strong>, the fun never ends at <strong>Classroom 6x</strong>.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="space-y-8">
                  <h2 className="text-3xl font-heading font-bold flex items-center gap-3 text-slate-900">
                    <Clock className="text-brand-purple" />
                    General FAQ
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
            </div>
          </div>
        )}
      </main>

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
          </div>
          
          <div>
            <h4 className="font-bold mb-6">Categories</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li className="hover:text-brand-purple cursor-pointer transition-colors">Action Games</li>
              <li className="hover:text-brand-purple cursor-pointer transition-colors">Sports Games</li>
              <li className="hover:text-brand-purple cursor-pointer transition-colors">Multiplayer</li>
              <li className="hover:text-brand-purple cursor-pointer transition-colors">Puzzle Games</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Support</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li 
                onClick={() => {
                  setActivePage("Contact Us");
                  setSelectedGame(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-brand-purple cursor-pointer transition-colors"
              >
                Contact Us
              </li>
              <li className="hover:text-brand-purple cursor-pointer transition-colors">FAQ</li>
              <li 
                onClick={() => {
                  setActivePage("Privacy Policy");
                  setSelectedGame(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-brand-purple cursor-pointer transition-colors"
              >
                Privacy Policy
              </li>
              <li 
                onClick={() => {
                  setActivePage("Terms of Service");
                  setSelectedGame(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-brand-purple cursor-pointer transition-colors"
              >
                Terms of Service
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Newsletter</h4>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-black/5 border border-black/10 rounded-xl px-4 py-2 text-sm flex-1 outline-none focus:border-brand-purple/50 text-slate-900 placeholder:text-slate-400"
              />
              <button className="p-2 bg-brand-purple rounded-xl hover:brightness-110 transition-all">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
        <div className="container mx-auto mt-12 pt-8 border-t border-black/5 text-center text-xs text-slate-400">
          © 2024 Classroom 6x. All rights reserved. Design inspired by cinematic excellence.
        </div>
      </footer>
    </div>
  );
}
