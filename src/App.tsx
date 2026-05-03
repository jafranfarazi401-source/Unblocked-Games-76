import React, { useState, useEffect } from 'react';
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

// Mock Data
const GAMES = [
  { 
    id: 'basket-random', 
    title: "Basket Random Unblocked", 
    category: "Sports", 
    image: "https://taptapshots.net/uploads/2025/8/basket-random.webp", 
    rating: 4.9,
    url: "https://ubg98.github.io/BasketRandom/",
    shortDesc: "Experience chaotic 2-player basketball physics with random courts and players.",
    description: "Basket Random Unblocked is a hilarious physics-based 2-player basketball game where every round brings new surprises. Whether you're looking for basket random unblocked 76, basket random unblocked 66, or unblocked games basket random on github, this version has it all. Experience the best unblocked basket random games with crazy 2 player physics and random courts. Play two player games unblocked basket random now and enjoy the zany action with friends! Keywords: basket random unblocked github, basket random unblocked games, unblocked games g+ basket random, basket random unblocked 2 player games."
  },
  {
    id: 'hoops-and-fruits',
    title: "Hoops & Fruits Classroom 6x",
    category: "Drawing",
    image: "https://img.gamepix.com/games/hoops-and-fruits/icon/hoops-and-fruits.png?w=105",
    rating: 4.8,
    url: "https://play.gamepix.com/hoops-and-fruits/embed?sid=VCOSN",
    shortDesc: "A whimsical arcade game where you toss hoops to catch colorful, fruity targets."
  },
  {
    id: 'funny-shooter-2',
    title: "Funny Shooter 2 Classroom 6x",
    category: "Shooter",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReRQw36C3zJ2i13AdaEkJniN4NCTvig3nM-w&s",
    rating: 4.7,
    url: "https://play.gamepix.com/funny-shooter-2/embed?sid=VCOSN",
    shortDesc: "Zany first-person shooter featuring quirky enemies and whimsical action.",
    description: "Funny Shooter 2 Classroom 6x is the ultimate upgrade to the hit FPS game. Battle weird enemies, upgrade your arsenal, and enjoy smooth performance on any school device. If you're looking for funny shooter 2 classroom 6x unblocked, you've found the best version."
  },
  {
    id: 'epic-duck',
    title: "Epic Duck Unblocked Classroom 6x",
    category: "Arcade",
    image: "https://play-lh.googleusercontent.com/4btOwsNG-fLmSqmbpjmDEdJQDlRCmKWcnV2CRYI23-O-_U88IB_QqQhgE9k56vVwBwjmbRMx1ZIJ3I8MFXum",
    rating: 4.6,
    url: "https://play.gamepix.com/epic-duck/embed?sid=VCOSN",
    shortDesc: "Adventurous duck quest through charming levels filled with keys and secrets."
  },
  {
    id: 'stickman-street-fighting',
    title: "Stickman Street Fighting 3D Unblocked Classroom 6x",
    category: "Fighting",
    image: "https://www.friv2online.com/files/images/ba/ba980ba53e51b6b64db4fb2340ccfbe2.jpg",
    rating: 4.8,
    url: "https://play.gamepix.com/stickman-street-fighting/embed?sid=VCOSN",
    shortDesc: "Fearless stickman brawler with strategic 3D street combat and power-ups."
  },
  {
    id: 'penalty-kick-wiz',
    title: "Penalty Kick Wiz Unblocked Classroom 6x",
    category: "Sports",
    image: "https://eazegames.com/_next/image?url=https%3A%2F%2Feazegames.com%2Fstorage%2Fgames%2Fcommon%2FFree_Kick_Shooter%2Fpreview%2Fmobile-thumbnail%402x.webp&w=384&q=85",
    rating: 4.8,
    url: "https://play.gamepix.com/penalty-kick-wiz/embed?sid=VCOSN",
    shortDesc: "Precision sports game testing your skills as shooter and goalkeeper."
  },
  {
    id: 'moto-x3m-spooky-land',
    title: "Moto X3M: Spooky Land Unblocked Classroom 6x",
    category: "Racing",
    image: "https://img.poki-cdn.com/cdn-cgi/image/q=78,scq=50,width=1200,height=1200,fit=cover,f=png/3f8a297822df891a1c158576b6461014/moto-x3m-spooky-land.png",
    rating: 4.9,
    url: "https://play.gamepix.com/moto-x3m-spooky-land/embed?sid=VCOSN",
    shortDesc: "Spooky bike racing through supernatural tracks filled with stunts and flips."
  },
  {
    id: 'merge-mine-idle-clicker',
    title: "Merge Mine - Idle Clicker Unblocked Classroom 6x",
    category: "Adventure",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4pwoUFYJ3RCEHfZh8RrVUgNmk6EYcBtP-Gg&s",
    rating: 4.7,
    url: "https://play.gamepix.com/merge-mine-idle-clicker/embed?sid=VCOSN",
    shortDesc: "Addictive mining clicker where you merge tools to build a massive diamond empire."
  },
  {
    id: 'evil-invader',
    title: "Evil Invader Classroom 6x",
    category: "Arcade",
    image: "https://img.gamepix.com/games/evil-invader/icon/evil-invader.png?w=105",
    rating: 4.7,
    url: "https://play.gamepix.com/evil-invader/embed?sid=VCOSN",
    shortDesc: "Dystopian survival shooter against relentless monsters and powerful weapons."
  },
  {
    id: 'hoop-world',
    title: "Hoop World Unblocked Classroom 6x",
    category: "Sports",
    image: "https://play-lh.googleusercontent.com/b0MjOypDwP6KNeXyGX253avRT8cfRmxwv-RSy7rmQYt4f21lE4OqwgBjNkE5TAeIGqo",
    rating: 4.8,
    url: "https://play.gamepix.com/hoop-world/embed?sid=VCOSN",
    shortDesc: "Dynamic 3D basketball with aerial acrobatics and spectacular flipping dunks."
  },
  {
    id: 'goal-skibidi-goal',
    title: "Goal Skibidi Goal Classroom 6x",
    category: "Sports",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlj5I8XPSSFtWZmDixk15POYBMne2P51HsQg&s",
    rating: 4.8,
    url: "https://play.gamepix.com/goal-skibidi-goal/embed?sid=VCOSN",
    shortDesc: "Zany head-motion soccer duels with physics-based unpredictability."
  },
  {
    id: 'samurai-brawling',
    title: "Samurai Brawling Unblocked Classroom 6x",
    category: "Fighting",
    image: "https://imgcdn.stablediffusionweb.com/2024/10/20/9a451112-66fa-4549-b2cf-c5ff9c41afe2.jpg",
    rating: 4.9,
    url: "https://play.gamepix.com/samurai-brawling/embed?sid=VCOSN",
    shortDesc: "Strategic action adventure following a fierce Yakuza warrior's journey."
  },
  {
    id: 'gta-san-andreas',
    title: "Grand Theft Auto: San Andreas Unblocked Classroom 6x",
    category: "Multiplayer",
    image: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c4/GTASABOX.jpg/250px-GTASABOX.jpg",
    rating: 5.0,
    url: "https://st.8games.net/10/igra-gta-san-andreas/",
    shortDesc: "Classic open-world action adventure featuring Carl Johnson's iconic story.",
    description: "Grand Theft Auto: San Andreas (2004) is an open-world action-adventure game developed by Rockstar North. Set in 1992, players control Carl \"CJ\" Johnson, who returns to the fictional state of San Andreas to restore his street gang to power, fight corrupt cops, and solve his mother's murder. The game is acclaimed for its massive, diverse map covering three major cities, deep character customization, and iconic 90s-themed gameplay."
  },
  {
    id: 'retro-bowl',
    title: "Retro Bowl Unblocked Google Classroom 6x",
    category: "Sports",
    image: "https://ozogames.com/uploads/2025/11/Retro-Bowl-College-image.webp",
    rating: 4.9,
    url: "https://game316009.konggames.com/gamez/0031/6009/live/index.html",
    shortDesc: "The ultimate retro-style football management and quarterback simulation.",
    description: "Retro Bowl Unblocked Google Classroom 6x is the classic football management game you love, now optimized for the Classroom 6x hub. Manage your roster, call the plays, and win the big game. Whether you call it classroom 6x retrobowl or retro bowl unblocked google classroom 6x, we provide the smoothest experience. Classroom 6x retrobowl is perfect for school Chromebooks."
  },
  {
    id: 'slope',
    title: "Slope Unblocked Classroom 6x",
    category: "Racing",
    image: "https://play-lh.googleusercontent.com/Mh8fn59cPlFcqNOop1KllhKCIw1id8ZkvupMTM8-1Q7u8HSD58sEXmUIMjfJrRZtC0E",
    rating: 4.8,
    url: "https://kdata1.com/2020/05/slope/",
    shortDesc: "High-speed 3D ball runner through neon tunnels and complex obstacles.",
    description: "Slope Unblocked Classroom 6x is the definitive 3D space-running game. Test your reflexes as you navigate a high-speed ball through a neon-lit futuristic world. Avoid obstacles, master the tilt, and achieve the highest score in this addictive, school-friendly unblocked game."
  },
  {
    id: 'tunnel-rush',
    title: "Tunnel Rush Unblocked Classroom 6x",
    category: "Arcade",
    image: "https://play-lh.googleusercontent.com/KwF38WdLVxmnEC3FgMN3GpWY16XhZGu6fkLAPInrltPvUXnycG5IjTvazosfhtGmA_OPYV3O-PfoVSKYOApGbA=w526-h296-rw",
    rating: 4.7,
    url: "https://play.gamepix.com/tunnel-rush/embed?sid=VCOSN",
    shortDesc: "Heart-pounding 3D tunnel racer with intense neon obstacles and reflexes.",
    description: "Tunnel Rush Unblocked Classroom 6x is a high-speed, heart-pounding 3D racing game where you navigate through a neon tunnel of infinite obstacles. Test your reflexes and agility in this addictive arcade title, perfectly optimized for school and work browsers."
  },
  {
    id: 'drive-mad',
    title: "Drive Mad Unblocked Classroom 6x",
    category: "Racing",
    image: "https://drivemad3.io/data/image/game/drive-mad-unblocked.png",
    rating: 4.8,
    url: "https://play.fancade.com/5F084A0BCE06B710?max_w=999999&max_h=9999999&istart=1",
    shortDesc: "Physics-based driving challenge across creative tracks and monster trucks.",
    description: "Drive Mad Unblocked Classroom 6x is a physics-based car racing game where you test your driving skills across increasingly difficult tracks. Experience unique vehicle mechanics, massive wheels, and mind-bending obstacles in this school-safe arcade classic."
  },
  {
    id: 'snow-rider-3d',
    title: "Snowrider Classroom 6x",
    category: "Racing",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_DVKF0NH5HT4lbRiRCv4_ey4q3gUXQS0zEQ&s",
    rating: 4.9,
    url: "https://itsvijaysingh.github.io/Snow-Rider3D/",
    shortDesc: "Immersive 3D winter sledding adventure with high-speed slope action.",
    description: "Snowrider Classroom 6x (also known as Snow Rider 3D) is an exhilarating 3D racing game where you slide down snowy slopes, dodge obstacles, and collect gifts. Experience the thrill of high-speed sledding with stunning graphics and smooth gameplay. Snowrider classroom 6x unblocked is optimized for school keyboards and Chromebooks."
  },
  {
    id: 'its-taxi',
    title: "Its taxi by artast Unblocked Classroom 6x",
    category: "Racing",
    image: "https://play-lh.googleusercontent.com/eme5H81HUS8hGMIKLdI8nxxDbM8vWkbtjYmkNuAE9U7PK0yyxSVLGsfTW-s_6_yCONxI8iNPBllk5tD8dm1qqw",
    rating: 4.8,
    url: "https://play.fancade.com/622C3C5036AF773F?max_w=999999&max_h=9999999&istart=1",
    shortDesc: "Isometric city taxi simulator featuring pixel-perfect driving physics.",
    description: "Its taxi by artast Unblocked Classroom 6x is a charming and challenging taxi simulator where you navigate isometric city streets. Master the art of picking up passengers and delivering them safely in this pixel-perfect puzzle-racer, optimized for school and work browsers."
  },
  {
    id: 'run-3',
    title: "Run 3 Unblocked Classroom 6x",
    category: "Arcade",
    image: "https://www.virlan.co/unblocked-games/wp-content/uploads/2022/03/Run-3-1.jpg",
    rating: 4.9,
    url: "https://play.gamepix.com/run-3/embed?sid=VCOSN",
    shortDesc: "Classic gravity-defying endless runner in a vast space tunnel system.",
    description: "Run 3 Unblocked Classroom 6x is the ultimate gravity-defying endless runner. Navigate through a vast tunnel system in space, switching gravity to run on walls and ceilings. A classic unblocked game perfect for school and home play."
  },
  {
    id: 'ragdoll-archers',
    title: "Ragdoll Archers Classroom 6x",
    category: "Action",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQChhAQo9os5fZ3QLUY5gILDlhWrf-jYgwDIA&s",
    rating: 4.9,
    url: "https://bitlifeonline.github.io/ragdoll-archers/",
    shortDesc: "Intense physics-based archery battles with funny ragdoll mechanics.",
    description: "Ragdoll Archers Classroom 6x is a physics-based archery game where you control a ragdoll archer in intense battles. Experience the best classroom 6x fun ragdoll arena with funny physics. Aim carefully, account for gravity, and defeat your opponents in this addictive unblocked game. Play solo or with a friend in 2-player mode on the most stable classroom 6x fun ragdoll arena version available."
  },
  {
    id: 'duck-duck-clicker',
    title: "Duck Duck Clicker Classroom 6x",
    category: "Arcade",
    image: "https://img.gamepix.com/games/duck-duck-clicker/icon/duck-duck-clicker.png?w=200",
    rating: 4.8,
    url: "https://play.gamepix.com/duck-duck-clicker/embed?sid=VCOSN",
    shortDesc: "The ultimate clicker experience where you hatch and upgrade ducks.",
    description: "Duck Duck Clicker Classroom 6x is the addictive clicking game everyone is searching for. Hatch thousands of ducks, upgrade your duck production, and become the ultimate duck tycoon. Whether you call it duck duck clicker unblocked or duck duck clicker classroom 6x, we have the fastest, unblocked version here."
  },
  {
    id: 'golf-orbit',
    title: "Golf Orbit Unblocked Classroom 6x",
    category: "Sports",
    image: "https://img.gamepix.com/games/golf-orbit/icon/golf-orbit.png?w=200",
    rating: 4.7,
    url: "https://play.gamepix.com/golf-orbit/embed?sid=VCOSN",
    shortDesc: "Hit the ball into orbit in this over-the-top arcade golf challenge.",
    description: "Golf Orbit Unblocked Classroom 6x is a one-button arcade golf game that takes you to the stars. Aim your shot, power up, and send your golf ball out of this world. Perfect for quick sessions at school, golf orbit unblocked 6x is optimized for high performance."
  },
  {
    id: 'survivor-io',
    title: "Survivor.io Unblocked Classroom 6x",
    category: "Action",
    image: "https://img.gamepix.com/games/survivor-io/icon/survivor-io.png?w=200",
    rating: 4.9,
    url: "https://play.gamepix.com/survivor-io/embed?sid=VCOSN",
    shortDesc: "Battle infinite waves of zombies in this Roguelike survival masterpiece.",
    description: "Survivor io unblocked classroom 6x brings the hit mobile roguelike survival game to your browser. Face off against thousands of dangerous zombies and find the best weapon combinations on our classroom 6x hub. If you need survivor io unblocked classroom 6x, this is the most reliable unblocked games 6x version available."
  },
  {
    id: 'obby-climb',
    title: "Classroom 6x Obby Climb",
    category: "Adventure",
    image: "https://play-lh.googleusercontent.com/I6PZpT1P9X7Gq5_0V9G_f7I8O-Z6o8S6V6X4V6X4V6X4V6X4V6X4V6X4V6X4V6X=w240-h480-rw",
    rating: 4.7,
    url: "https://play.gamepix.com/obby-climb/embed?sid=VCOSN",
    shortDesc: "Master the obstacle course and climb to new heights in this 3D challenge.",
    description: "Classroom 6x Obby Climb is the premier parkour and obstacle course simulator. Test your agility and precision as you climb higher and higher. Searching for classroom 6x obby climb? You've found the unblocked hub for the best parkour action."
  },
  {
    id: 'slice-master',
    title: "Slice Master Classroom 6x",
    category: "Arcade",
    image: "https://img.gamepix.com/games/slice-master/icon/slice-master.png?w=200",
    rating: 4.8,
    url: "https://play.gamepix.com/slice-master/embed?sid=VCOSN",
    shortDesc: "Flip the knife and slice through everything in this satisfying arcade game.",
    description: "Slice Master Classroom 6x is a satisfying physics-based game where you flip a blade to cut through fruits, obstacles, and more. Master the timing and achieve the highest scores on slice master classroom 6x unblocked, the ultimate browser version."
  },
  {
    id: 'big-shot-boxing',
    title: "Big Shot Boxing Unblocked",
    category: "Fighting",
    image: "https://blockblastonline.com/upload/imgs/big-shot-boxing.jpeg",
    rating: 4.8,
    url: "https://htmlxm.github.io/h2/big-shot-boxing/",
    shortDesc: "Step into the ring and become a legend in this classic retro-style boxing simulation.",
    description: "Big Shot Boxing Unblocked is the ultimate retro-style boxing simulation game for school and work. Train your fighter, climb the rankings, and win the world championship belt. If you're looking for Big Shot Boxing unblocked 76, Big Shot Boxing 66, or the best boxing games on Classroom 6x, this is the perfect version for you. Master your jabs, hooks, and uppercuts while managing your stamina to survive every round. Experience high-octane fighting action with smooth performance on any school Chromebook. Keywords: big shot boxing hacks, big shot boxing cheats, unblocked fighting games classroom 6x, retro boxing unblocked."
  },
  {
    id: 'super-mario-64',
    title: "Super Mario 64 Unblocked Games Classroom 6x",
    category: "Adventure",
    image: "https://class-room.pages.dev/assets/upload/UCBGgames/super-mario-64.png",
    rating: 5.0,
    url: "https://script.google.com/macros/s/AKfycbyB8Cg09IyL5iA01VRMcp6GXWBsHJDyytzuovDyiHdgIUmtHuNM7x27VlBnJjYt26F-/exec",
    shortDesc: "Experience the legendary 3D platformer where Mario explores Peach's castle to rescue her from Bowser.",
    description: "Super Mario 64 Unblocked Games Classroom 6x brings the revolutionary 3D platformer directly to your browser for free. Whether you are looking for Super Mario 64 unblocked 76, Super Mario 64 unblocked 66, or the best version of Super Mario 64 unblocked games classroom 6x, our high-performance mirror ensures lag-free play on school Chromebooks. Explore Peach's castle, collect Power Stars, and defeat Bowser in this iconic adventure. Play Super Mario 64 online free with no download required. Keywords: super mario 64 unblocked github, super mario 64 unblocked 76, super mario 64 unblocked games, play super mario 64 unblocked at school."
  },
  {
    id: 'revolution-idle',
    title: "Revolution Idle 6x",
    category: "Arcade",
    image: "https://play-lh.googleusercontent.com/9v8X9_7_7X_7_7X_7_7X_7_7X_7_7X_7_7X_7_7X_7_7X_7_7X_7_7X_7_7X_7_7=w240-h480-rw",
    rating: 4.7,
    url: "https://play.gamepix.com/revolution-idle/embed?sid=VCOSN",
    shortDesc: "Experience the ultimate incremental progress in this addictive idle game.",
    description: "Revolution Idle 6x is an abstract incremental game where your goal is to fill up circles and trigger powerful resets. Specially optimized for the unblocked games 6x hub, revolution idle 6x is a top choice for students."
  },
  {
    id: 'kirka-io',
    title: "Kirka.io Unblocked",
    category: "Shooter",
    image: "https://imgs.crazygames.com/kirka-io_1x1/20260116015838/kirka-io_1x1-cover?format=auto&quality=100&metadata=none&width=1200",
    rating: 4.9,
    url: "https://kirka.io/",
    shortDesc: "Competitive pixelated FPS with fast-paced action and multiple game modes.",
    description: "Kirka.io unblocked is the ultimate competitive FPS you can play on the Classroom 6x Hub. Whether you are looking for kirka.io, kirka io, or kirka io., we provide the most stable version for school. Master your aim with kirka.io aimbot compatible settings and experience lag-free kirka.io unblocked gameplay. This version is also known as back-to-school-shopping.ml kirka.io among pro players. Jump into the arena and dominate Kirka.io today!"
  },
  {
    id: 'baseball-9',
    title: "Baseball 9 Unblocked",
    category: "Sports",
    image: "https://play-lh.googleusercontent.com/Y9GghCslNNk-nWccWvxgCDYvd7yLSwkw0hZ3NVTkSJqigY0ZozK3lv85jR02XOJSDPQ",
    rating: 4.8,
    url: "https://nealfun.app/game/baseball-bros/",
    shortDesc: "Experience the thrill of home runs in this immersive unblocked baseball simulation.",
    description: "Baseball 9 unblocked is the most exciting sports game available on the Classroom 6x Hub. Whether you're searching for baseball 9 unblocked 76 or baseball 9 unblocked games, we have the fastest version. Play baseball 9 unblocked free with no download required, perfect for school breaks. Experience unblocked baseball 9 or 9 inning baseball unblocked today. This baseball 9 online unblocked version is optimized for school Chromebooks, making baseball 9 unblocked at school a breeze."
  },
  {
    id: 'contexto',
    title: "Context Clues Games",
    category: "Puzzle",
    image: "https://play-lh.googleusercontent.com/NzNAuWG_MAkM1Evy1fSbt5lUDST9RqINPGt3EY7iwSvMQ2OPBoKv4sqmuJZVXA6w8xg",
    rating: 4.8,
    url: "https://contexto.me/en/daily",
    shortDesc: "A brain-teasing puzzle where you find the secret word using AI-powered context clues.",
    description: "Experience the viral sensation with context clues games right here. If you enjoy games like contexto, our platform offers the best contexto games experience. Challenge your vocabulary with the daily context clue game and see how you rank. No need for a contexto game download—play context clues online games directly in your browser. Master every context clue games level and find the daily contexto game answer on the Classroom 6x Hub."
  },
  {
    id: 'geometry-dash',
    title: "Classroom 6x Geometry Dash Unblocked",
    category: "Arcade",
    image: "https://play-lh.googleusercontent.com/yO_Y96Zf5X4X5X4X5X4X5X4X5X4X5X4X5X4X5X4X5X4X5X4X5X4X5X4X5X4X5X4X=w240-h480-rw",
    rating: 4.9,
    url: "https://geometry-dash.io/game/geometry-dash-lite/",
    shortDesc: "Jump and fly your way through danger in this rhythm-based action platformer.",
    description: "Classroom 6x geometry dash unblocked is the ultimate rhythm-based platformer available on the Classroom 6x Hub. Test your reflexes as you jump, fly, and flip your way through dangerous passages and spiky obstacles. If you're looking for classroom 6x geometry dash unblocked, you've found the best and most stable version. Master every level in classroom 6x geometry dash unblocked today!"
  }
];

const BLOGS = [
  {
    id: 'what-are-unblocked-games',
    title: "What are Unblocked Games? (Complete Guide)",
    excerpt: "Everything you need to know about the world of unblocked gaming and why they are so popular in schools.",
    content: `
      <h2>The Rise of Unblocked Gaming</h2>
      <p>Unblocked games are essentially web-based games that can be accessed on networks that typically restrict gaming sites, such as schools or workplaces. These games are hosted on mirror sites or using technologies that bypass standard firewalls.</p>
      <p>Platforms like <a href="/" class="text-brand-purple font-bold">Classroom 6x</a> have specialized in providing these titles, ensuring that students have access to high-quality entertainment during their breaks. From simple arcade games to complex 3D runners like <a href="/game/slope" class="text-brand-purple">Slope Unblocked</a>, the variety is immense.</p>
      <h3>Why Students Love Them</h3>
      <p>The main appeal lies in accessibility. When standard platforms like Steam or Epic Games are blocked, unblocked sites offer a seamless way to play instantly in the browser with no downloads required. Check our <a href="/category/sports" class="text-brand-purple">Sports Unblocked</a> or <a href="/category/action" class="text-brand-purple">Action Games</a> for more.</p>
    `
  },
  {
    id: 'how-unblocked-games-work',
    title: "How Unblocked Games Work in School Networks",
    excerpt: "A deep dive into the technology behind bypassing school firewalls and web filters.",
    content: `
      <h2>Understanding Web Filters</h2>
      <p>Most school networks use web filters to block specific categories of websites, including 'Gaming'. Unblocked sites work by using several methods:</p>
      <ul>
        <li><strong>Mirror Sites:</strong> Hosting the game on a less obvious URL.</li>
        <li><strong>Google Sites/GitHub Pages:</strong> Using trusted domains that schools rarely block.</li>
        <li><strong>Embedded Players:</strong> Using iframes to pull game data from external servers.</li>
      </ul>
      <p><a href="/" class="text-brand-purple font-bold">Classroom 6x at school</a> works efficiently because it's optimized to load quickly even on restricted connections, providing a smooth <a href="/category/arcade" class="text-brand-purple">unblocked arcade experience</a> for everyone.</p>
    `
  },
  {
    id: 'is-classroom-6x-safe',
    title: "Is Classroom 6x Safe? Everything You Need to Know",
    excerpt: "Safety and security are our priorities. Learn why Classroom 6x is the most trusted source for games.",
    content: `
      <h2>Your Safety First</h2>
      <p>At Classroom 6x, we understand that safety is a major concern for students and parents alike. Unlike many other sites that are cluttered with intrusive ads or malicious scripts, we curate our library with care.</p>
      <h3>Why Trust Classroom 6x?</h3>
      <ul>
        <li><strong>No Downloads:</strong> You never have to download files that could contain viruses.</li>
        <li><strong>Secure Hosting:</strong> We use reliable servers to ensure a safe browsing experience.</li>
        <li><strong>Hand-Picked Games:</strong> Every game is tested for quality and safety before being added, including classics like <a href="/game/run-3" class="text-brand-purple">Run 3</a>.</li>
      </ul>
      <p>Play <a href="/category/adventure" class="text-brand-purple">Adventurous Games</a> with peace of mind knowing that Classroom 6x is designed to be a safe haven for gamers.</p>
    `
  },
  {
    id: 'how-to-play-2026',
    title: "How to Play Unblocked Games at School (2026 Guide)",
    excerpt: "The latest tips and tricks for accessing your favorite games on restricted school networks in 2026.",
    content: `
      <h2>Accessing Games in 2026</h2>
      <p>As school firewalls become more sophisticated, the methods to access games also evolve. This 2026 guide covers the most reliable ways to stay connected to <strong>Classroom 6x at school</strong>.</p>
      <h3>Top Methods:</h3>
      <ol>
        <li><strong>Search for Specific Engines:</strong> Using direct links like <a href="/game/retro-bowl" class="text-brand-purple">Retro Bowl Unblocked</a> often bypasses main site blocks.</li>
        <li><strong>Active Mirrors:</strong> Use our <a href="/category/new" class="text-brand-purple">New Games</a> section to find the latest links.</li>
      </ol>
      <p>The easiest method remains visiting <a href="/" class="text-brand-purple">Classroom 6x</a>, which is constantly updated to remain accessible.</p>
    `
  },
  {
    id: 'how-to-access-no-vpn',
    title: "How to Access Blocked Games Without VPN",
    excerpt: "Simple techniques to bypass game blocks without using a VPN, perfect for school chromebooks.",
    content: `
      <h2>Games Without VPN</h2>
      <p>Many students prefer not to use a VPN due to speed issues or school policy. You can still reach your <a href="/category/multiplayer" class="text-brand-purple">multiplayer game list</a> using sites like <strong>Classroom 6x</strong> which are built on accessible frameworks.</p>
      <p>By leveraging mirror URLs and cloud-hosted platforms, we provide a seamless way to play <a href="/game/tunnel-rush" class="text-brand-purple">Tunnel Rush</a> or <a href="/game/basket-random" class="text-brand-purple">Basket Random</a> anywhere.</p>
    `
  },
  {
    id: 'how-to-play-slope-chromebook',
    title: "How to Play Slope Unblocked on School Chromebook",
    excerpt: "A step-by-step guide to running the high-performance Slope game on lightweight school devices.",
    content: `
      <h2>Slope on Chromebooks</h2>
      <p>Chromebooks are excellent for web apps. To play <a href="/game/slope" class="text-brand-purple">Slope Unblocked</a> on your <strong>Classroom 6x</strong> portal, ensure your browser is updated.</p>
      <p>Explore more <a href="/category/racing" class="text-brand-purple">unblocked racing games</a> that are optimized for the Chrome OS environment.</p>
    `
  },
  {
    id: 'top-10-unblocked-games',
    title: "Top 10 Unblocked Games for School (2026 Edition)",
    excerpt: "Our curated selection of the absolute best games to play during your school breaks, optimized for 2026 network speeds.",
    content: `
      <h2>The Definitive School Break Favorites</h2>
      <p>Finding the right balance between a quick mental reset and maintaining school productivity is an art. At <strong>Classroom 6x</strong>, we have analyzed thousands of sessions to bring you the definitive list of the best games students are playing in 2026. These titles are chosen for their fast loading times, educational-friendly themes, and high replay value.</p>
      
      <h3>1. <a href="/game/slope" class="text-brand-purple font-bold">Slope Unblocked</a></h3>
      <p>Arguably the king of unblocked games. <strong>Slope</strong> is a 3D reaction test that requires absolute focus. It's the perfect way to sharpen your reflexes between classes. The minimalist neon design ensures it runs flawlessly on any Chromebook.</p>
      
      <h3>2. <a href="/game/retro-bowl" class="text-brand-purple font-bold">Retro Bowl</a></h3>
      <p>For those who love strategy and management. <strong>Retro Bowl</strong> allows you to build a football dynasty right in your browser. Its 8-bit aesthetic is charming and lightweight, making it a staple of the Classroom 6x collection.</p>
      
      <h3>3. <a href="/game/1v1-lol" class="text-brand-purple font-bold">1v1.LOL</a></h3>
      <p>Competitive building at its finest. If you want to practice your construction and combat skills without downloading a massive client, 1v1.LOL is the answer. It's the top <a href="/category/shooter" class="text-brand-purple">Shooter Game</a> on our platform for a reason.</p>
      
      <h3>4. <a href="/game/tunnel-rush" class="text-brand-purple font-bold">Tunnel Rush</a></h3>
      <p>Experience the ultimate flow state. <strong>Tunnel Rush</strong> challenges you to navigate a kaleidoscopic tunnel at breakneck speeds. It's an adrenaline-fueled odyssey that has become a legend in the <strong>Classroom 6x unblocked</strong> universe.</p>

      <h3>5. <a href="/game/basket-random" class="text-brand-purple font-bold">Basket Random</a></h3>
      <p>Sometimes you just need a laugh. <strong>Basket Random</strong> takes the physics of basketball and adds a layer of hilarious chaos. It's best played in local 2-player mode with a classmate. Explore more <a href="/category/sports" class="text-brand-purple">Sports games</a> to find similar titles.</p>

      <p>Whether you're into high-speed <a href="/category/racing" class="text-brand-purple">Racing</a> or deep-thinking <a href="/category/puzzle" class="text-brand-purple">Puzzles</a>, Classroom 6x remains the most trusted source for unblocked content. Bookmark our <a href="/" class="text-brand-purple">homepage</a> to always have these top 10 titles just one click away.</p>
    `
  },
  {
    id: 'best-classroom-games-online',
    title: "Best Classroom Games to Play Online Free",
    excerpt: "Discover the most engaging classroom games that are completely free to eye-popping browser games.",
    content: `
      <h2>Free Classroom Fun</h2>
      <p>Online classroom games are designed to be played quickly. <a href="/" class="text-brand-purple">Classroom 6x</a> offers a massive variety of these titles, from <a href="/category/puzzle" class="text-brand-purple">Puzzle Games</a> to <a href="/category/racing" class="text-brand-purple">Racing Action</a>.</p>
      <p>Because they are unblocked, you can enjoy them instantly with your classmates.</p>
    `
  },
  {
    id: 'top-5-games-like-slope',
    title: "Top 5 Games Like Slope You Must Try",
    excerpt: "If you love the intensity of Slope, check out these 5 similar high-speed arcade games.",
    content: `
      <h2>If You Like Slope...</h2>
      <p>Loved the rush of Slope? Try these unblocked alternatives on <a href="/" class="text-brand-purple">Classroom 6x</a>:</p>
      <ol>
        <li><a href="/game/tunnel-rush" class="text-brand-purple">Tunnel Rush:</a> Faster reflexes required.</li>
        <li><a href="/game/snow-rider-3d" class="text-brand-purple">Snow Rider 3D:</a> Sledding madness.</li>
        <li><a href="/game/run-3" class="text-brand-purple">Run 3:</a> Space running with gravity.</li>
        <li><a href="/game/drive-mad" class="text-brand-purple">Drive Mad:</a> Physics-based driving.</li>
      </ol>
    `
  },
  {
    id: 'best-retro-browser-games',
    title: "Best Retro Browser Games (No Download)",
    excerpt: "Relive the classics with our collection of nostalgic retro games that require no installation.",
    content: `
      <h2>Retro Gaming Reborn</h2>
      <p>Retro games like <a href="/game/retro-bowl" class="text-brand-purple">Retro Bowl</a> are perfect for school sessions and work perfectly on <a href="/" class="text-brand-purple">Classroom 6x</a>.</p>
      <p>No downloads, just pure nostalgic fun in our <a href="/category/sports" class="text-brand-purple">Sports collection</a>.</p>
    `
  },
  {
    id: 'how-to-play-classroom-6x-2026',
    title: "How to Play Classroom 6x Games at School (2026 Guide)",
    excerpt: "A comprehensive guide on ensuring you always have access to Classroom 6x games throughout 2026, regardless of network restrictions.",
    content: `
      <h2>The Ultimate Guide to Unblocked Access in 2026</h2>
      <p>As educational networks become more sophisticated, finding a reliable way to access <strong>unblocked games</strong> for school requires a modernized approach. <strong>Classroom 6x</strong> utilizes cutting-edge web technologies to ensure that your gaming experience remains uninterrupted. This guide covers how to stay connected to your favorite <a href="/category/fighting" class="text-brand-purple">fighting games</a> and <a href="/category/adventure" class="text-brand-purple">adventures</a> through 2026.</p>
      
      <h3>1. Bookmark the Canonical Domain</h3>
      <p>The most important step is to always use our main domain: <strong>https://classroom6x.store</strong>. We use advanced SSL and edge-routing (Cloudflare) to ensure that the main link remains the most secure and accessible point of entry. Bookmarking the site allows you to bypass many simple URL-based filters.</p>
      
      <h3>2. Utilize Our Verified Mirrors</h3>
      <p>If your school network is particularly aggressive, <strong>Classroom 6x</strong> maintains a network of verified mirrors. These alternative access points serve the same high-quality <a href="/game/slope" class="text-brand-purple">Slope Game</a> and <strong>Retro Bowl</strong> experiences but are hosted on diverse infrastructure. Check our <a href="/blog/top-10-classroom-6x" class="text-brand-purple">Top 10 Guides</a> for updated mirror listings.</p>
      
      <h3>3. Why HTML5 is Your Best Friend</h3>
      <p>In 2026, Flash is a thing of the past. All games on Classroom 6x are built using <strong>HTML5 and WebGL</strong>. This means they are treated as standard web content by your browser, making them much harder to block than legacy game files. It also ensures that titles like <em>Snow Rider 3D</em> run at locked 60 FPS on school hardware.</p>

      <h3>4. Safe and Responsible Gaming</h3>
      <p>We encourage all our users to play responsibly. Use Classroom 6x during your designated breaks or study halls. By using our site responsibly, you help us maintain our reputation as a safe, school-friendly portal. Don't forget to explore our <a href="/category/new" class="text-brand-purple">Newest Games</a> section daily for the latest releases that have been vetted for the 2026 school year.</p>
    `
  },
  {
    id: 'top-10-classroom-6x',
    title: "Top 10 Games on Classroom 6x You Should Play",
    excerpt: "The definitive list of the best games currently available on the Classroom 6x platform.",
    content: `
      <h2>The Best of Classroom 6x</h2>
      <p>With thousands of titles, choosing what to play can be hard. Here are our top picks available on <a href="/" class="text-brand-purple font-bold">Classroom 6x</a>:</p>
      <ol>
        <li><a href="/game/slope" class="text-brand-purple font-bold">Slope:</a> The ultimate 3D speed challenge.</li>
        <li><a href="/game/retro-bowl" class="text-brand-purple font-bold">Retro Bowl:</a> Manage your own football team.</li>
        <li><a href="/game/run-3" class="text-brand-purple font-bold">Run 3:</a> Defy gravity in deep space.</li>
        <li><a href="/game/ragdoll-archers" class="text-brand-purple font-bold">Ragdoll Archers:</a> Physics-based archery fun.</li>
        <li><a href="/game/basket-random" class="text-brand-purple font-bold">Basket Random:</a> Basketball madness.</li>
      </ol>
      <p>Each of these games is perfectly optimized for school play, ensuring you get the best performance on any device.</p>
    `
  },
  {
    id: 'cognitive-benefits-online-gaming',
    title: "The Cognitive Edge: Why Online Gaming is Good for Your Brain",
    excerpt: "Exploring the surprising mental benefits of gaming, from improved reflexes to enhanced problem-solving skills.",
    content: `
      <h2>Beyond Entertainment: The Science of Play</h2>
      <p>For a long time, video games were viewed simply as a distraction. However, modern research paints a much different picture. Online gaming, especially the curated titles on <a href="/" class="text-brand-purple font-bold">Classroom 6x</a>, can be a powerful tool for cognitive development. When you're navigating the intense neon world of <a href="/game/slope" class="text-brand-purple">Slope</a> or managing a team in <strong>Retro Bowl</strong>, your brain is working at its peak.</p>
      
      <h3>1. Rapid Decision Making</h3>
      <p>In fast-paced games like <a href="/game/tunnel-rush" class="text-brand-purple">Tunnel Rush</a>, players must make split-second decisions based on visual cues. This constant "if-then" processing strengthens the neural pathways responsible for quick reactions in the real world.</p>

      <h3>2. Enhanced Problem Solving</h3>
      <p>Many <a href="/category/puzzle" class="text-brand-purple">puzzle games</a> require players to think several steps ahead. Figuring out the physics in <em>Basket Random</em> or finding the right path in <em>Run 3</em> builds resilience and logical thinking skills that are highly applicable to academic subjects like math and science.</p>

      <h3>3. Strategic Long-Term Planning</h3>
      <p>Management simulations such as <a href="/game/retro-bowl" class="text-brand-purple">Retro Bowl</a> teach the value of resource management and long-term strategy. Balancing a budget, training players, and choosing the right plays are all exercises in executive function.</p>

      <p>At <strong>Classroom 6x</strong>, we take pride in offering games that aren't just fun, but are also mentally stimulating. Whether you're looking for a quick <a href="/category/arcade" class="text-brand-purple">arcade break</a> or a deep dive into an <a href="/category/adventure" class="text-brand-purple">adventure</a>, you're giving your brain a genuine workout. Dive into our <a href="/" class="text-brand-purple">latest collection</a> and see how sharp you can become!</p>
    `
  },
  {
    id: 'ultimate-guide-to-unblocked-games-6x',
    title: "The Ultimate Guide to Unblocked Games 6x at the Classroom 6x Hub",
    excerpt: "Everything you need to know about playing unblocked games 6x and why Classroom 6x Hub is the #1 choice for students.",
    content: `
      <h2>Welcome to the Classroom 6x Hub</h2>
      <p>If you are looking for the best <strong>unblocked games 6x</strong>, you have arrived at the right place. The <strong>Classroom 6x Hub</strong> is designed specifically for students who want to enjoy high-quality gaming during their breaks without the hassle of filters or blocks.</p>
      
      <h3>Why unblocked6x is Trending</h3>
      <p>The term <strong>unblocked6x</strong> has become synonymous with reliability. Unlike other sites that frequently go down, <strong>unblocked games 6x</strong> on our platform are hosted on high-speed mirrors. Whether you are at school or work, the <strong>classroom 6x hub</strong> ensures you always have access to your favorite titles.</p>
      
      <h3>How to Play Survivor io Unblocked Classroom 6x</h3>
      <p>One of our most requested titles is <strong>survivor io unblocked classroom 6x</strong>. We have worked hard to ensure that <strong>survivor io unblocked classroom 6x</strong> runs at 60fps on even the most basic school Chromebooks. Just visit the <strong>unblocked games 6x</strong> section to start your survival journey.</p>
      
      <h3>The Benefits of Using a Classroom 6x Hub</h3>
      <p>Using a dedicated <strong>classroom 6x hub</strong> provides a safer, faster, and more curated experience. We vet every game on our <strong>unblocked6x</strong> list to ensure they are appropriate and functional. Our <strong>unblocked games 6x</strong> library is updated daily, making us the ultimate <strong>unblocked6x</strong> destination in 2026.</p>
      
      <p>Stay tuned to the <strong>Classroom 6x Hub</strong> for more updates on <strong>unblocked games 6x</strong> and the latest releases in the <strong>unblocked6x</strong> world!</p>
    `
  },
  {
    id: 'mastering-context-clues-games-contexto',
    title: "Mastering Context Clues Games: The Ultimate Contexto Guide",
    excerpt: "Learn how to dominate context clues games and find every contexto game answer with our expert tips and tricks.",
    content: `
      <h2>The Rise of Context Clues Games</h2>
      <p>In the world of brain teasers, <strong>context clues games</strong> have taken the internet by storm. If you are a fan of <strong>games like contexto</strong>, you know how addictive it can be to narrow down a secret word using AI-powered feedback. Our <strong>contexto games</strong> hub provides everything you need to become a master of the <strong>context clue game</strong>.</p>
      
      <h3>Why Play Context Clues Online Games?</h3>
      <p>Playing <strong>context clues online games</strong> is one of the best ways to sharpen your vocabulary and logical thinking. Many students search for a <strong>contexto game download</strong>, but there's no need for that here. You can play <strong>context clue games</strong> right in your browser. Whether you are looking for a <strong>context clue game</strong> for a quick break or deep <strong>contexto games</strong> sessions, we have you covered.</p>
      
      <h3>Finding the Daily Contexto Game Answer</h3>
      <p>Stuck on today's puzzle? Finding the <strong>contexto game answer</strong> is part of the fun, but sometimes you need a hint. Instead of looking for a <strong>contexto game download</strong>, try using our tips for <strong>games like contexto</strong>. We analyze the best strategies for <strong>context clue games</strong> so you can solve the <strong>context clue game</strong> faster than your friends. All our <strong>context clues games</strong> are free and unblocked.</p>
      
      <h3>Why We Love Context Clue Games</h3>
      <p>The beauty of the <strong>context clue game</strong> lies in its simplicity. Our <strong>context clues online games</strong> aren't just about guessing; they are about understanding language. If you frequent <strong>games like contexto</strong>, you'll find that our <strong>contexto games</strong> selection is the best on the <strong>Classroom 6x Hub</strong>. Remember, you don't need a <strong>contexto game download</strong> to start playing <strong>context clue games</strong> today!</p>
    `
  },
  {
    id: 'trending-unblocked-games-2026',
    title: "Trending Unblocked Games 2026: Mario 64, Drive Mad & Geometry Dash",
    excerpt: "Explore the most popular games on Classroom 6x this year, including Mario 64 classroom 6x, Drive Mad, and Geometry Dash.",
    content: `
      <h2>Top Trending Titles in 2026</h2>
      <p>As we move through 2026, a few games have clearly stood out on the <strong>Classroom 6x Hub</strong>. Players are flocking to classics and modern hits alike. Among the most searched is <strong>mario 64 classroom 6x</strong>, bringing iconic 3D platforming to our unblocked platform. If you love speed and physics, <strong>drive mad</strong> has become a staple for every student during breaks.</p>
      
      <h3>The Legend of Mario 64 Classroom 6x</h3>
      <p>Why is <strong>mario 64 classroom 6x</strong> so popular? It's the perfect combination of nostalgia and smooth performance. Our version of <strong>mario 64 classroom 6x</strong> is optimized for school Chromebooks, ensuring you can collect every star without lag. Whether you are a speedrunner or a casual player, <strong>mario 64 classroom 6x</strong> offers endless entertainment. Don't forget that <strong>mario 64 classroom 6x</strong> is always free to play here.</p>
      
      <h3>Physics Fun with Drive Mad</h3>
      <p>If you haven't played <strong>drive mad</strong> yet, you are missing out. In <strong>drive mad</strong>, you navigate complex tracks with cars that have unique handling. The goal in <strong>drive mad</strong> is simple: reach the finish line without flipping over. Thousands of students play <strong>drive mad</strong> every day on our hub because <strong>drive mad</strong> is easy to learn but hard to master.</p>
      
      <h3>Classroom 6x Geometry Dash Unblocked</h3>
      <p>Another massive hit is <strong>classroom 6x geometry dash unblocked</strong>. This rhythm-based platformer requires perfect timing. With <strong>classroom 6x geometry dash unblocked</strong>, you can experience all the custom levels and challenges directly in your browser. Playing <strong>classroom 6x geometry dash unblocked</strong> is the ultimate test of reflexes. We ensure that <strong>classroom 6x geometry dash unblocked</strong> remains accessible even on the most restricted networks.</p>
      
      <p>Whether you're into <strong>mario 64 classroom 6x</strong>, <strong>drive mad</strong>, or <strong>classroom 6x geometry dash unblocked</strong>, the Classroom 6x Hub is your #1 destination for 2026!</p>
    `
  },
  {
    id: 'classroom-6x-horror-story-no-one-could-exit',
    title: "Classroom 6x: The Horror Game No One Could Exit",
    excerpt: "A chilling urban legend about a hidden game on Classroom 6x that blurs the line between reality and the screen.",
    content: `
      <h2>The Urban Legend of 'Exit the Classroom'</h2>
      <p>It was around 1 AM. Rain was hitting the window, and thunder kept shaking the room. I couldn’t sleep, so I opened my laptop to waste some time online. Then I remembered my friends talking about a website called <a href="/" class="text-brand-purple">Classroom 6x</a>. They said it had tons of unblocked games you could play anywhere.</p>
      
      <p>I smirked. “Just a game site,” I said to myself. I opened the website. The homepage loaded slowly, filled with colorful game icons—racing, puzzles, shooters, action. But one game instantly caught my attention: <strong>Exit the Classroom</strong>.</p>

      <h3>The Warning</h3>
      <p>The thumbnail showed a dark classroom with broken desks. On the blackboard, written in red chalk, were the words: <strong>DON’T LOOK BACK</strong>. I clicked it. The screen turned black. Then white text appeared: <em>“Once you enter, you must finish.”</em></p>

      <h3>The Experiment Begins</h3>
      <p>I laughed nervously. “Nice intro.” The game began. I was standing inside an empty classroom. The lights flickered above me. Desks were overturned. Papers moved across the floor even though there was no wind. At the far end of the room was a locked door. The controls were simple: WASD to move, mouse to look around.</p>
      
      <p>I walked toward the door. A message popped up: <strong>“Find the 3 keys.”</strong> Classic horror puzzle stuff. I searched the room. First key—inside a drawer. Second key—under a broken chair. Easy. Then I heard something behind me. <strong>Tap... tap... tap...</strong></p>

      <h3>The Whispers</h3>
      <p>I froze. I slowly turned around. Nothing. Just rows of desks. I laughed again, but quieter this time. I kept searching for the third key. Suddenly my laptop speakers crackled. A child’s voice whispered: <em>“Don’t turn around.”</em></p>
      
      <p>My hands went cold. I checked if another tab was open. Nothing. The game character was breathing heavily now. I hadn’t noticed that before. Then the lights inside the game went out completely. My real room still had power. Only the laptop screen glowed.</p>

      <h3>The Figure in the Darkness</h3>
      <p>When the lights in the game came back, every desk had turned to face me. I pushed back from the table. “Nope.” I moved to close the tab. It wouldn’t close. I hit Alt + F4. Nothing. The browser froze. On screen, the classroom door slowly opened by itself. Inside the darkness beyond it stood a tall figure. Too tall to be human. Its head bent sideways like a broken doll. Its fingers scraped the doorway.</p>
      
      <p>Then text appeared: <strong>“You looked back.”</strong></p>

      <h3>The Reality Breach</h3>
      <p>My webcam light turned on. I slammed the laptop shut. Silence. My heart pounded so hard it hurt. After a minute, I opened the laptop again. The game was still running. But now it wasn’t showing the classroom. It was showing <strong>my room</strong>. Live. From the webcam.</p>
      
      <p>I saw myself sitting there, pale and terrified. Then I noticed something else. Behind me, near the bedroom door, stood the same tall figure from the game. I spun around. Nothing there. I looked back at the screen.</p>

      <p>It was closer now. Its face was just a dark blur, but I could see one white eye staring straight into the camera. I grabbed the charger and yanked it out. The laptop battery died instantly. Black screen. I sat in darkness, breathing hard.</p>

      <h3>The Final Key</h3>
      <p>Then from the hallway outside my room came three slow knocks. <strong>Knock. Knock. Knock.</strong> My bedroom door was locked. I didn’t move. A whisper slid under the door: <em>“Final key.”</em></p>
      
      <p>I stayed frozen until sunrise. When morning came, I opened the door. Nothing. No footprints. No marks. I told myself it was stress. Lack of sleep. Some weird prank game with webcam permissions. Later that day, I searched for the site again. <a href="/" class="text-brand-purple">Classroom 6x</a> loaded normally. But the game <strong>Exit the Classroom</strong> was gone. No category, no thumbnail. Nothing.</p>

      <p>I almost believed it had all been a nightmare. Then I checked my desktop. There was a new folder named: <strong>DO NOT LOOK BACK</strong>. Inside was one image file. I opened it. It was a photo of me sitting at my desk last night. Taken from behind.</p>
    `
  }
];

const FAQS = [
  {
    question: "What is Basket Random Unblocked?",
    answer: "Basket Random Unblocked at <a href='/' class='text-brand-purple'>Classroom 6x</a> is a chaotic, physics-based 2-player basketball game where every round brings new surprises. You can play it directly in our <a href='/category/sports' class='text-brand-purple'>Sports Games</a> section."
  },
  {
    question: "How do I play Basket Random on Classroom 6x?",
    answer: "The controls are incredibly simple! You only need one key to jump and throw. If you like simple controls, also check out <a href='/game/slope' class='text-brand-purple'>Slope Unblocked</a>."
  },
  {
    question: "Can I play Basket Random with a friend at Classroom 6x?",
    answer: "Yes! <a href='/game/basket-random' class='text-brand-purple'>Basket Random</a> at Classroom 6x features a dedicated 2-player mode. For more competition, try our <a href='/category/multiplayer' class='text-brand-purple'>Multiplayer Games</a>."
  },
  {
    question: "Is Basket Random Unblocked free to play at Classroom 6x?",
    answer: "Absolutely. You can play the full version of <a href='/game/basket-random' class='text-brand-purple'>Basket Random Unblocked</a> directly in your browser without any downloads."
  },
  {
    question: "What is Funny Shooter 2 unblock at Classroom 6x?",
    answer: "<a href='/game/funny-shooter-2' class='text-brand-purple'>Funny Shooter 2</a> at Classroom 6x is a zany first-person shooter. Check out our <a href='/category/shooter' class='text-brand-purple'>Shooter Games</a> for more similar action."
  },
  {
    question: "What is Stickman Street Fighting 3D Unblocked at Classroom 6x?",
    answer: "<a href='/game/stickman-street-fighting' class='text-brand-purple'>Stickman Street Fighting 3D</a> at Classroom 6x is an intense brawler. If you love combat, explore our <a href='/category/fighting' class='text-brand-purple'>Fighting Games</a>."
  },
  {
    question: "What is Moto X3M: Spooky Land Unblocked at Classroom 6x?",
    answer: "It is a high-octane bike racing game. We have a huge collection of <a href='/category/racing' class='text-brand-purple'>unblocked racing games</a> available for free."
  },
  {
    question: "Can I play Retro Bowl on Classroom 6x?",
    answer: "Absolutely! <a href='/game/retro-bowl' class='text-brand-purple font-bold'>Retro Bowl unblocked</a> is one of our most popular titles. You can manage your team and lead them to victory right now."
  },
  {
    question: "How to play Retro Bowl Unblocked?",
    answer: "To play <a href='/game/retro-bowl' class='text-brand-purple'>Retro Bowl Unblocked</a>, simply visit Classroom 6x, select the game, and use your mouse or touch controls to manage your team and lead the offense on the field. It's the perfect quarterback simulation!"
  },
  {
    question: "How to get Retro Bowl Unblocked?",
    answer: "You don't need to download anything to get <a href='/game/retro-bowl' class='text-brand-purple'>Retro Bowl Unblocked</a>. You can access the full version directly through your web browser on sites like Classroom 6x, which specialize in school-safe gaming mirrors."
  },
  {
    question: "What is the best site for Retro Bowl Unblocked games?",
    answer: "<a href='/' class='text-brand-purple'>Classroom 6x</a> is widely considered one of the best sites for Retro Bowl Unblocked games, offering a clean, high-performance experience that is optimized for school Chromebooks and restricted networks."
  },
  {
    question: "How to unblock Retro Bowl?",
    answer: "If the game is blocked at your institution, the easiest way to <a href='/game/retro-bowl' class='text-brand-purple'>unblock Retro Bowl</a> is to use a trusted mirror site like Classroom 6x. We utilize secure, lightweight hosting to provide accessible gaming mirrors."
  },
  {
    question: "Where to play Retro Bowl Unblocked?",
    answer: "You can play <a href='/game/retro-bowl' class='text-brand-purple'>Retro Bowl Unblocked</a> right here on Classroom 6x. Whether you are looking for Retro Bowl College Unblocked or the classic 25 edition, we maintain the most reliable links for students."
  },
  {
    question: "Is Slope unblocked available here?",
    answer: "Yes, <a href='/game/slope' class='text-brand-purple font-bold'>Slope unblocked</a> is a fan favorite. Test your reflexes and achieve a high score today."
  },
  {
    question: "What is Grand Theft Auto: San Andreas Unblocked?",
    answer: "<a href='/game/gta-san-andreas' class='text-brand-purple'>GTA San Andreas Unblocked</a> is a legendary open-world adventure. Explore our <a href='/category/adventure' class='text-brand-purple'>Adventure Games</a> for more open-world thrills."
  },
  {
    question: "Is Snow Rider 3D unblocked for school?",
    answer: "Absolutely. <a href='/game/snow-rider-3d' class='text-brand-purple'>Snow Rider 3D</a> is optimized for Classroom 6x, ensuring it's unblocked for your school Chromebook."
  },
  {
    question: "How do I play Big Shot Boxing Unblocked on Classroom 6x?",
    answer: "Step into the virtual ring by selecting <a href='/game/big-shot-boxing' class='text-brand-purple'>Big Shot Boxing Unblocked</a> from our Fighting category. This retro simulation is fully optimized to run on restricted networks without any downloads."
  },
  {
    question: "Is Classroom 6x safe for school use?",
    answer: "Yes, <a href='/' class='text-brand-purple'>Classroom 6x</a> is designed to be a safe platform. We hand-pick our unblocked games to ensure a worry-free experience."
  },
  {
    question: "How to play Super Mario 64 Unblocked Games Classroom 6x?",
    answer: "To play <a href='/game/super-mario-64' class='text-brand-purple'>Super Mario 64 Unblocked</a>, simply select the game from our Adventure category. Use your keyboard to control Mario's 3D movements—exploring Peach's castle has never been easier on school networks!"
  },
  {
    question: "What is the best site for Super Mario 64 unblocked?",
    answer: "<a href='/' class='text-brand-purple'>Classroom 6x</a> is the premier destination for Super Mario 64 unblocked, providing a high-speed mirror that works perfectly on Chromebooks without any plugins or downloads."
  },
  {
    question: "Can I save my progress in Super Mario 64 Unblocked?",
    answer: "Yes! Our version of <a href='/game/super-mario-64' class='text-brand-purple'>Super Mario 64 unblocked games classroom 6x</a> utilizes browser local storage to save your stars and progress, so you can pick up right where you left off during your next break."
  },
  {
    question: "What is classroom 6x fun ragdoll arena?",
    answer: "The <strong>classroom 6x fun ragdoll arena</strong> refers to the high-performance unblocked version of <strong>Ragdoll Archers</strong> hosted on our hub. It provides smooth physics and intense 2-player combat, making <strong>classroom 6x fun ragdoll arena</strong> a top choice for school breaks. Find every <strong>classroom 6x fun ragdoll arena</strong> challenge right here! Our platform is the primary host for the <strong>classroom 6x fun ragdoll arena</strong> experience, ensuring that <strong>classroom 6x fun ragdoll arena</strong> remains unblocked for all students seeking <strong>classroom 6x fun ragdoll arena</strong> action."
  }
];

const NAV_TABS = ["Home", "Blogs", "Action", "Multiplayer", "Sports", "Shooter", "Drawing", "Arcade", "Fighting", "Racing", "Adventure", "Puzzle"];

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "Action": "Dive into the heart-pounding world of Action Unblocked Games on Classroom 6x. Our collection features high-speed challenges, strategic combat, and platforming adventures that test your reflexes and timing. From intense battles to fast-paced survival missions, these games are perfectly optimized for school Chromebooks and restricted networks, providing a safe yet thrilling experience during your breaks.",
  "Multiplayer": "Challenge your friends or compete with players worldwide in our Multiplayer Unblocked Games category. Classroom 6x offers a variety of cooperative and competitive titles that work seamlessly in your browser. Whether you're coordinating with teammates in a strategic arena or engaging in a chaotic free-for-all, our multiplayer collection ensures low-latency gameplay without the need for any downloads or external plugins.",
  "Sports": "Experience the thrill of the stadium with our Sports Unblocked Games at Classroom 6x. From physics-based basketball in Basket Random to the strategic management depth of Retro Bowl, our sports library covers every major discipline. These titles are hand-picked for their engaging mechanics and school-friendly content, allowing you to master your virtual athletic skills right from your library or classroom workstation.",
  "Shooter": "Master your aim and strategy with our Shooter Unblocked Games collection. Classroom 6x provides a wide array of first-person and third-person shooters, including hits like Funny Shooter 2 and 1v1.LOL. We prioritize lightweight HTML5 engines to ensure smooth performance even on basic hardware, giving you the precision you need to lead the leaderboards while bypassing standard school network filters.",
  "Drawing": "Unleash your creativity with Drawing and Artistic Unblocked Games on Classroom 6x. This category focuses on puzzle-solving, creative expression, and logic-based challenges through drawing mechanics. Games like Hoops & Fruits combine simple touch or mouse controls with engaging visual puzzles, offering a relaxing yet mentally stimulating break that's perfect for the educational environment.",
  "Arcade": "Rediscover the classics and explore modern hits in our Arcade Unblocked Games section. This category is the home of high-score chasing, infinite runners, and quick-session titles like Slope and Tunnel Rush. Classroom 6x ensures these arcade experiences are instantly accessible, providing the perfect 'mental reboot' for students who need a quick, engaging break between study sessions.",
  "Fighting": "Enter the arena with our Fighting Unblocked Games at Classroom 6x. Featuring everything from stickman brawlers to strategic samurai combat like Samurai Brawling, this category tests your combo mastery and defensive timing. Every title is vetted for school safety and browser performance, ensuring you can engage in pixel-perfect combat without triggering restricted access warnings on your device.",
  "Racing": "Burn rubber with our high-speed Racing Unblocked Games collection. From the neon-lit gravity of Slope to the physics-based challenges of Moto X3M and Drive Mad, Classroom 6x is the premier destination for virtual speedsters. Our racing games are optimized for minimal loading times and high frame rates, providing a professional racing experience that fits perfectly within a school browser environment.",
  "Adventure": "Embark on epic quests and explore mysterious worlds with Adventure Unblocked Games on Classroom 6x. This category features long-form narratives, exploration-based puzzles, and immersive 3D journeys like GTA San Andreas Unblocked. We provide secure, browser-based portals to these expansive worlds, allowing you to progress through deep storylines and complex environments without any administrative installation requirements.",
  "Puzzle": "Challenge your intellect with our curated collection of Puzzle Unblocked Games on Classroom 6x. From AI-powered context puzzles like Contexto to classic logic brain-teasers, this category is designed to sharpen your vocabulary, spatial reasoning, and critical thinking. Our puzzle games provide an educational yet deeply engaging break, making them highly recommended by students for both fun and cognitive development at school."
};

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
    const path = location.pathname.toLowerCase();
    
    // Check for Game paths (/game/run-3 or /run-3)
    const gameMatch = path.match(/^\/(game\/)?([a-z0-9-]+)$/);
    if (gameMatch) {
      const id = gameMatch[2];
      const game = GAMES.find(g => g.id === id);
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
    
    const updateMeta = (title: string, desc: string, path: string, noIndex: boolean = false, schema?: any) => {
      document.title = title;
      const normalizedPath = path === '/' ? '/' : path.replace(/\/$/, '');
      const url = `https://classroom6x.store${normalizedPath}`;
      
      const selectors = {
        description: 'meta[name="description"]',
        robots: 'meta[name="robots"]',
        ogTitle: 'meta[property="og:title"]',
        ogUrl: 'meta[property="og:url"]',
        ogDesc: 'meta[property="og:description"]',
        ogImage: 'meta[property="og:image"]',
        twitterTitle: 'meta[property="twitter:title"]',
        twitterUrl: 'meta[property="twitter:url"]',
        twitterDesc: 'meta[property="twitter:description"]',
        twitterImage: 'meta[property="twitter:image"]',
        canonical: 'link[rel="canonical"]',
        schema: 'script[type="application/ld+json"].dynamic-schema'
      };

      // Handle robots meta (noindex)
      let robots = document.querySelector(selectors.robots);
      if (noIndex) {
        if (!robots) {
          robots = document.createElement('meta');
          robots.setAttribute('name', 'robots');
          document.head.appendChild(robots);
        }
        robots.setAttribute('content', 'noindex, nofollow');
      } else {
        if (robots) {
          robots.setAttribute('content', 'index, follow');
        }
      }

      // Handle JSON-LD Schema
      let schemaScript = document.querySelector(selectors.schema);
      if (schema) {
        if (!schemaScript) {
          schemaScript = document.createElement('script');
          schemaScript.setAttribute('type', 'application/ld+json');
          schemaScript.classList.add('dynamic-schema');
          document.head.appendChild(schemaScript);
        }
        schemaScript.textContent = JSON.stringify(schema);
      } else if (schemaScript) {
        schemaScript.remove();
      }

      // Ensure canonical exists
      let canonical = document.querySelector(selectors.canonical);
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', url);

      // Update basic meta
      const descMeta = document.querySelector(selectors.description);
      if (descMeta) descMeta.setAttribute('content', desc);

      // Update OG & Twitter
      const ogTitle = document.querySelector(selectors.ogTitle);
      if (ogTitle) ogTitle.setAttribute('content', title);
      
      const ogUrl = document.querySelector(selectors.ogUrl);
      if (ogUrl) ogUrl.setAttribute('content', url);

      const ogDesc = document.querySelector(selectors.ogDesc);
      if (ogDesc) ogDesc.setAttribute('content', desc);

      const twTitle = document.querySelector(selectors.twitterTitle);
      if (twTitle) twTitle.setAttribute('content', title);

      const twUrl = document.querySelector(selectors.twitterUrl);
      if (twUrl) twUrl.setAttribute('content', url);

      const twDesc = document.querySelector(selectors.twitterDesc);
      if (twDesc) twDesc.setAttribute('content', desc);

      const ogImage = document.querySelector(selectors.ogImage);
      const twImage = document.querySelector(selectors.twitterImage);
      const imageUrl = schema?.image || schema?.logo || "https://classroom6x.store/logo.svg";
      if (ogImage) ogImage.setAttribute('content', imageUrl);
      if (twImage) twImage.setAttribute('content', imageUrl);
    };

    if (selectedGame) {
      setIsPlaying(false);
      const title = `${selectedGame.title} Unblocked - Play on Classroom 6x`;
      const desc = selectedGame.description || `Play ${selectedGame.title} for free at Classroom 6x! Fast, unblocked gaming hub.`;
      
      const gameSchema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": selectedGame.title,
        "operatingSystem": "Web Browser",
        "applicationCategory": "GameApplication",
        "genre": selectedGame.category,
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": selectedGame.rating || "4.8",
          "ratingCount": "1250"
        },
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      };

      updateMeta(title, desc, `/game/${selectedGame.id}`, false, gameSchema);
    } else if (selectedBlog) {
      const title = `${selectedBlog.title} | Classroom 6x Guides`;
      const desc = selectedBlog.excerpt || `Read our guide about ${selectedBlog.title} on Classroom 6x.`;
      
      const blogSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": selectedBlog.title,
        "description": desc,
        "author": {
          "@type": "Organization",
          "name": "Classroom 6x Team"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Classroom 6x",
          "logo": {
            "@type": "ImageObject",
            "url": "https://classroom6x.store/logo.svg"
          }
        },
        "url": `https://classroom6x.store/blog/${selectedBlog.id}`
      };

      updateMeta(title, desc, `/blog/${selectedBlog.id}`, false, blogSchema);
    } else if (activePage) {
      const slug = activePage.toLowerCase().replace(/\s+/g, '-');
      const title = `${activePage} | Classroom 6x`;
      const desc = `Learn more about our ${activePage} on Classroom 6x.`;
      updateMeta(title, desc, `/${slug}`);
    } else if (activeTab !== "Home") {
      const title = `Best ${activeTab} Unblocked Games | Classroom 6x`;
      const desc = `Explore the best collection of ${activeTab} unblocked games on Classroom 6x.`;
      
      const categorySchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": `${activeTab} Unblocked Games`,
        "description": desc,
        "url": `https://classroom6x.store/category/${activeTab.toLowerCase()}`
      };

      updateMeta(title, desc, `/category/${activeTab.toLowerCase()}`, false, categorySchema);
    } else {
      const title = "Classroom 6x - Hub for Unblocked Games 6x & Best School Games";
      const desc = "Classroom 6x Hub: Play the best unblocked games 6x for school. Enjoy Slope, Retro Bowl, Duck Duck Clicker, and golf orbit unblocked classroom 6x with zero lag.";
      // Add noindex if it's a search result page (has query params)
      const isSearch = location.search.includes('s=') || location.search.length > 0;
      
      const homeSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Classroom 6x Hub",
        "url": "https://classroom6x.store/",
        "logo": "https://classroom6x.store/logo.svg",
        "description": "The ultimate unblocked games 6x hub for school students.",
        "sameAs": [
          "https://facebook.com/classroom6x"
        ]
      };

      updateMeta(title, desc, "/", isSearch, homeSchema);
    }
  }, [selectedGame, selectedBlog, activePage, activeTab, location.search]);

  const handleLogoClick = () => {
    navigate('/');
    setIsPlaying(false);
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            <ul className="space-y-3 text-sm text-slate-500">
              <li><a href="/category/action" onClick={(e) => { e.preventDefault(); navigate('/category/action'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-brand-purple cursor-pointer transition-colors">Action Games</a></li>
              <li><a href="/category/sports" onClick={(e) => { e.preventDefault(); navigate('/category/sports'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-brand-purple cursor-pointer transition-colors">Sports Games</a></li>
              <li><a href="/category/racing" onClick={(e) => { e.preventDefault(); navigate('/category/racing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-brand-purple cursor-pointer transition-colors">Racing Games</a></li>
              <li><a href="/category/puzzle" onClick={(e) => { e.preventDefault(); navigate('/category/puzzle'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-brand-purple cursor-pointer transition-colors">Puzzle Games</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-slate-900 uppercase tracking-widest text-xs">Popular Searches</h4>
            <div className="flex flex-wrap gap-2 pr-4">
              {['Slope', 'Retro Bowl', 'Run 3', 'Sniper', 'Soccer', 'Basketball', 'Driving', 'Car'].map(term => (
                <a 
                  key={term}
                  href={`/?s=${term}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setSearchQuery(term);
                    document.getElementById('games-grid')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-[10px] font-bold text-slate-400 hover:text-brand-purple border border-slate-200 px-2 py-0.5 rounded transition-colors uppercase tracking-tighter"
                >
                  {term}
                </a>
              ))}
            </div>
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
