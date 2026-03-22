/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Smartphone, 
  Users, 
  Calendar, 
  Share2, 
  Search, 
  BookOpen, 
  Trophy, 
  MessageSquare, 
  Bot, 
  ChevronRight, 
  Menu, 
  X, 
  Star, 
  ArrowRight,
  MapPin,
  Zap,
  CheckCircle2,
  Lock,
  Globe,
  TrendingUp,
  Award,
  ExternalLink,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';

// --- Components ---

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isLink, setIsLink] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current && ringRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        ringRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
      
      const target = e.target as HTMLElement;
      setIsLink(!!target.closest('a, button, [role="button"]'));
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="hidden md:block pointer-events-none fixed inset-0 z-[9999]">
      <div 
        ref={cursorRef}
        className={`fixed top-0 left-0 w-2 h-2 bg-unik-red rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ${isClicking ? 'scale-150' : ''} ${isLink ? 'scale-0' : ''}`}
      />
      <div 
        ref={ringRef}
        className={`fixed top-0 left-0 w-8 h-8 border border-unik-red/50 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out ${isClicking ? 'scale-75 bg-unik-red/20' : ''} ${isLink ? 'scale-[2.5] bg-unik-red/10 border-unik-red/20' : ''}`}
      />
    </div>
  );
};

const BackgroundEffects = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const starsCanvas = starsRef.current;
    if (!canvas || !starsCanvas) return;

    const ctx = canvas.getContext('2d');
    const sCtx = starsCanvas.getContext('2d');
    if (!ctx || !sCtx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // Particles
    let particles: any[] = [];
    const initParticles = () => {
      particles = [];
      for (let i = 0; i < 80; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          color: Math.random() > 0.5 ? '#E53935' : '#FFFFFF'
        });
      }
    };

    // Stars
    let stars: any[] = [];
    const initStars = () => {
      stars = [];
      for (let i = 0; i < 120; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.5,
          opacity: Math.random(),
          speed: Math.random() * 0.02
        });
      }
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      starsCanvas.width = width;
      starsCanvas.height = height;
      initParticles();
      initStars();
    };

    window.addEventListener('resize', resize);
    resize();

    let mouse = { x: -1000, y: -1000 };
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      sCtx.clearRect(0, 0, width, height);

      // Draw Stars
      sCtx.fillStyle = '#FFFFFF';
      stars.forEach(star => {
        star.opacity += star.speed;
        if (star.opacity > 1 || star.opacity < 0) star.speed *= -1;
        sCtx.globalAlpha = star.opacity * 0.3;
        sCtx.beginPath();
        sCtx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        sCtx.fill();
      });

      // Draw Particles
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse repel
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const force = (100 - dist) / 100;
          p.x -= dx * force * 0.05;
          p.y -= dy * force * 0.05;
        }

        ctx.globalAlpha = 0.5;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const ldx = p.x - p2.x;
          const ldy = p.y - p2.y;
          const ldist = Math.sqrt(ldx * ldx + ldy * ldy);
          if (ldist < 130) {
            ctx.strokeStyle = '#E53935';
            ctx.globalAlpha = (1 - ldist / 130) * 0.2;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(animate);
    };

    animate();
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <>
      <canvas ref={starsRef} className="fixed inset-0 pointer-events-none z-0" />
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
    </>
  );
};

const SectionTitle = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <motion.div 
    initial={{ y: 40, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    className="text-center mb-16"
  >
    <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
      {title.split(' ').map((word, i) => (
        <span key={i} className={word.toLowerCase() === 'connect' || word.toLowerCase() === 'grow' || word.toLowerCase() === 'unik' || word.toLowerCase() === 'infinite' ? 'text-unik-red' : ''}>
          {word}{' '}
        </span>
      ))}
    </h2>
    {subtitle && <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">{subtitle}</p>}
    <motion.div 
      initial={{ width: 0 }}
      whileInView={{ width: 80 }}
      viewport={{ once: true }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="h-1.5 bg-unik-red mx-auto mt-6 rounded-full shadow-[0_0_15px_rgba(229,57,53,0.5)]"
    ></motion.div>
  </motion.div>
);

const InteractiveCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
    
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);

    // Tilt effect
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 25;
    const rotateY = (centerX - x) / 25;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    setIsHovered(false);
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  return (
    <motion.div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className={`card-spotlight bg-unik-card p-8 rounded-2xl border border-white/10 transition-all duration-500 group relative overflow-hidden ${className}`}
    >
      {/* Gloss effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.03), transparent 40%)`
        }}
      />
      {children}
    </motion.div>
  );
};

const FeatureCard = ({ icon: Icon, title, description, footer }: { icon: any; title: string; description: string; footer?: string }) => (
  <InteractiveCard className="hover:border-unik-red/50">
    <MagneticButton className="w-14 h-14 bg-unik-red/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-unik-red transition-all duration-500 shadow-[0_0_0_rgba(229,57,53,0)] group-hover:shadow-[0_10px_20px_rgba(229,57,53,0.3)]">
      <Icon className="text-unik-red group-hover:text-white transition-colors duration-500" size={28} />
    </MagneticButton>
    <h3 className="text-xl font-bold mb-3 group-hover:text-unik-red transition-colors">{title}</h3>
    <p className="text-gray-400 leading-relaxed mb-4 group-hover:text-gray-300 transition-colors">{description}</p>
    {footer && (
      <div className="flex items-center gap-2 mt-auto">
        <div className="h-px flex-1 bg-white/5"></div>
        <div className="text-[9px] text-gray-500 uppercase tracking-widest font-black whitespace-nowrap">{footer}</div>
      </div>
    )}
  </InteractiveCard>
);

const MagneticButton = ({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => {
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btnRef.current.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  };

  const handleMouseLeave = () => {
    if (!btnRef.current) return;
    btnRef.current.style.transform = `translate(0, 0)`;
  };

  return (
    <button 
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`transition-transform duration-200 ease-out ${className}`}
    >
      {children}
    </button>
  );
};

const StatItem = ({ value, label }: { value: string; label: string }) => {
  const [count, setCount] = useState(0);
  const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
  const suffix = value.replace(/[0-9]/g, '');
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsInView(true);
        let start = 0;
        const end = numericValue;
        if (start === end) return;

        let totalMiliseconds = 2000;
        let incrementTime = (totalMiliseconds / end) > 10 ? (totalMiliseconds / end) : 10;

        let timer = setInterval(() => {
          start += Math.ceil(end / 50);
          if (start >= end) {
            setCount(end);
            clearInterval(timer);
          } else {
            setCount(start);
          }
        }, incrementTime);
      }
    }, { threshold: 0.5 });

    const el = document.getElementById(`stat-${label}`);
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [numericValue, label]);

  return (
    <MagneticButton className="flex-1">
      <div id={`stat-${label}`} className="text-center group">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          className="text-4xl md:text-6xl font-black text-white mb-2 group-hover:text-unik-red transition-all duration-500 animate-text-glow"
        >
          {count}{suffix}
        </motion.div>
        <div className="text-gray-500 text-[10px] uppercase tracking-[0.3em] font-black group-hover:text-gray-300 transition-colors">{label}</div>
      </div>
    </MagneticButton>
  );
};

const Typewriter = ({ text, delay = 28 }: { text: string; delay?: number }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) {
        clearInterval(timer);
        setIsDone(true);
      }
    }, delay);
    return () => clearInterval(timer);
  }, [text, delay]);

  return (
    <span className={!isDone ? 'typing-cursor' : ''}>
      {displayedText}
    </span>
  );
};

// --- Main App ---

export default function App() {
  const [isLaunched, setIsLaunched] = useState(false);
  const [isNavGlass, setIsNavGlass] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [aiChatMessages, setAiChatMessages] = useState([
    { role: 'user', text: 'Find IT service providers in Hyderabad' },
    { role: 'bot', text: 'I found 12 verified IT vendors in Hyderabad. Top match: Vefever — Service Provider at Moshe Inc, Karimnagar. Would you like to connect?' },
    { role: 'user', text: 'Suggest collaboration partners for my business' },
    { role: 'bot', text: 'Based on your profile, I recommend connecting with businesses in your City Club. You have 3 pending collab opportunities this week.' }
  ]);

  useEffect(() => {
    const handleScroll = () => {
      setIsNavGlass(window.scrollY > 50);
      setShowScrollTop(window.scrollY > 500);
      
      const reveals = document.querySelectorAll('.scroll-reveal');
      reveals.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85) {
          el.classList.add('visible');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLaunch = () => {
    setIsLaunched(true);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen selection:bg-unik-red selection:text-white">
      <CustomCursor />
      <BackgroundEffects />
      
      {/* Page Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-unik-red z-[60] origin-left shadow-[0_0_10px_#E53935]"
        style={{ scaleX }}
      />

      {/* --- Launch Curtain Animation --- */}
      <AnimatePresence>
        {!isLaunched && (
          <motion.div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden"
            exit={{ opacity: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            {/* Stage Lighting */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.1),transparent_70%)] pointer-events-none z-20"></div>
            
            {/* Curtains */}
            <motion.div 
              className="absolute inset-y-0 left-0 w-1/2 bg-[#9B111E] border-r-4 border-[#FFD700]/40 shadow-[inset_-30px_0_60px_rgba(0,0,0,0.7),20px_0_40px_rgba(0,0,0,0.5)] z-10"
              initial={{ x: 0 }}
              exit={{ x: '-100%', skewX: -5 }}
              transition={{ duration: 2, ease: [0.7, 0, 0.3, 1] }}
            >
              {/* Curtain Folds */}
              <div className="absolute inset-0 opacity-40 pointer-events-none" 
                style={{ 
                  backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.4) 10%, transparent 20%, rgba(0,0,0,0.4) 30%, transparent 40%, rgba(0,0,0,0.4) 50%, transparent 60%, rgba(0,0,0,0.4) 70%, transparent 80%, rgba(0,0,0,0.4) 90%, transparent 100%)',
                  backgroundSize: '100px 100%'
                }} 
              />
              <div className="absolute top-0 bottom-0 right-4 w-1 bg-black/20"></div>
            </motion.div>
            
            <motion.div 
              className="absolute inset-y-0 right-0 w-1/2 bg-[#9B111E] border-l-4 border-[#FFD700]/40 shadow-[inset_30px_0_60px_rgba(0,0,0,0.7),-20px_0_40px_rgba(0,0,0,0.5)] z-10"
              initial={{ x: 0 }}
              exit={{ x: '100%', skewX: 5 }}
              transition={{ duration: 2, ease: [0.7, 0, 0.3, 1] }}
            >
              {/* Curtain Folds */}
              <div className="absolute inset-0 opacity-40 pointer-events-none" 
                style={{ 
                  backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.4) 10%, transparent 20%, rgba(0,0,0,0.4) 30%, transparent 40%, rgba(0,0,0,0.4) 50%, transparent 60%, rgba(0,0,0,0.4) 70%, transparent 80%, rgba(0,0,0,0.4) 90%, transparent 100%)',
                  backgroundSize: '100px 100%'
                }} 
              />
              <div className="absolute top-0 bottom-0 left-4 w-1 bg-black/20"></div>
            </motion.div>

            {/* Launch Content */}
            <motion.div 
              className="relative z-30 text-center px-4"
              exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="mb-10"
              >
                <div className="relative inline-block group">
                  <div className="absolute -inset-4 bg-unik-red/20 blur-2xl rounded-full group-hover:bg-unik-red/30 transition-all"></div>
                  <div className="bg-white p-6 rounded-3xl inline-block shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative">
                    {/* Mock QR Code */}
                    <div className="w-44 h-44 bg-black flex items-center justify-center relative overflow-hidden rounded-lg">
                      <div className="absolute inset-0 opacity-10">
                        <div className="grid grid-cols-10 gap-1 w-full h-full">
                          {[...Array(100)].map((_, i) => (
                            <div key={i} className="bg-white w-full h-full"></div>
                          ))}
                        </div>
                      </div>
                      <div className="absolute inset-3 border-2 border-white/20"></div>
                      <div className="grid grid-cols-5 gap-2 w-32 h-32 relative z-10">
                        {[...Array(25)].map((_, i) => (
                          <div key={i} className={`bg-white rounded-sm ${Math.random() > 0.4 ? 'opacity-100' : 'opacity-10'}`}></div>
                        ))}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center z-20">
                         <div className="bg-unik-red w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-xl border-2 border-white">U</div>
                      </div>
                      {/* Scanning Line Effect */}
                      <motion.div 
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-1 bg-unik-red shadow-[0_0_15px_#E53935] z-30"
                      />
                    </div>
                  </div>
                </div>
                <motion.p 
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-white mt-6 font-black tracking-[0.3em] text-xs"
                >
                  SCAN TO DOWNLOAD APP
                </motion.p>
              </motion.div>

              <motion.button
                onClick={handleLaunch}
                whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(229,57,53,0.8)' }}
                whileTap={{ scale: 0.95 }}
                className="bg-unik-red text-white px-16 py-5 rounded-2xl text-2xl font-black shadow-[0_0_30px_rgba(229,57,53,0.5)] transition-all relative overflow-hidden group"
              >
                <span className="relative z-10">ENTER NOW</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </motion.button>
              
              <div className="mt-16 flex flex-col items-center gap-4">
                <div className="flex -space-x-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-unik-card flex items-center justify-center text-[10px] font-bold overflow-hidden">
                      <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="user" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-black bg-unik-red flex items-center justify-center text-[10px] font-bold">
                    2k+
                  </div>
                </div>
                <div className="text-white/60 text-xs font-medium tracking-wide">
                  Business Leaders Present in the Hall
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Sticky Navigation --- */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isNavGlass ? 'glass-morphism py-3' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 bg-unik-red rounded flex items-center justify-center text-white font-bold group-hover:rotate-12 transition-transform">U</div>
            <span className="text-xl font-bold tracking-tight">Unik <span className="text-unik-red">Connect</span></span>
          </div>

          <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest">
            {['Features', 'Business', 'Referral', 'Learning', 'City Clubs', 'Unik AI', 'Leaderboard'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(' ', '-')}`} 
                className="relative hover:text-white transition-colors text-gray-400 group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-unik-red transition-all group-hover:w-full"></span>
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <MagneticButton className="px-6 py-2 border border-white/20 rounded-full hover:bg-white/10 transition-all text-sm font-bold">Login</MagneticButton>
            <MagneticButton className="px-6 py-2 bg-unik-red rounded-full font-bold hover:bg-red-600 transition-all text-sm shadow-[0_0_20px_rgba(229,57,53,0.3)]">Join Free</MagneticButton>
          </div>

          <button className="lg:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-unik-bg-base border-b border-white/10 overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-4 font-bold uppercase tracking-widest text-xs">
                {['Features', 'Business', 'Referral', 'Learning', 'City Clubs', 'Unik AI', 'Leaderboard'].map((item) => (
                  <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} onClick={() => setIsMobileMenuOpen(false)}>{item}</a>
                ))}
                <div className="flex flex-col gap-3 pt-4">
                  <button className="w-full py-3 border border-white/20 rounded-xl">Login</button>
                  <button className="w-full py-3 bg-unik-red rounded-xl font-bold">Join Free</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden min-h-screen flex items-center">
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 bg-unik-red/10 border border-unik-red/20 px-4 py-2 rounded-full mb-8 animate-float"
          >
            <span className="w-2 h-2 bg-unik-red rounded-full animate-pulse-dot"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest">🚀 Powered by Venu Kalyan Strategies</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tighter leading-[0.9] scroll-reveal">
            {["India's", "Smartest", "Business", "Networking", "Platform"].map((word, i) => (
              <span key={i} className="word-wrap">
                <motion.span 
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className={`word-inner ${word === 'Business' || word === 'Networking' ? 'text-unik-red' : ''}`}
                >
                  {word}{' '}
                </motion.span>
              </span>
            ))}
          </h1>

          <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed scroll-reveal h-12">
            {isLaunched && (
              <Typewriter text="Connect with verified business owners · Find collaborators · Learn from expert mentors · Earn through referrals — all in one platform." />
            )}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 scroll-reveal">
            <MagneticButton className="w-full sm:w-auto px-10 py-4 bg-unik-red rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-600 transition-all group shadow-[0_10px_30px_rgba(229,57,53,0.3)]">
              Download App <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </MagneticButton>
            <MagneticButton className="w-full sm:w-auto px-10 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all">
              Explore Features
            </MagneticButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto scroll-reveal">
            <StatItem value="59+" label="City Clubs" />
            <StatItem value="2500+" label="pts/month" />
            <StatItem value="₹0" label="cap on earnings" />
          </div>

          {/* Floating Success Story */}
          <motion.div 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="absolute top-1/2 right-0 hidden xl:block w-72 bg-unik-bg-card/90 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl rotate-3 animate-float-slow"
          >
            <div className="text-[10px] font-black text-unik-red mb-3 tracking-widest uppercase">🚀 Success Story</div>
            <p className="text-xs text-gray-300 mb-4 leading-relaxed">
              "Scaled to 5 cities and hit ₹1Cr monthly revenue through Unik referrals!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-unik-red rounded-full flex items-center justify-center font-bold">RK</div>
              <div className="text-left">
                <div className="text-xs font-bold">Rajesh Kumar</div>
                <div className="text-[10px] text-gray-500">Founder KumarTech</div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center scroll-reveal">
          <div className="text-[10px] uppercase tracking-[0.3em] text-gray-600 mb-2">Scroll to explore</div>
          <div className="w-5 h-8 border border-white/20 rounded-full mx-auto flex justify-center p-1">
            <motion.div 
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-1 bg-unik-red rounded-full"
            />
          </div>
        </div>
      </section>

      {/* --- Features Section --- */}
      <section id="features" className="py-32 relative">
        <div className="container mx-auto px-6">
          <SectionTitle 
            title="One Platform. Infinite Possibilities." 
            subtitle="Built for Indian business owners who want to network smarter, grow faster, and earn while they connect." 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={Smartphone} 
              title="Business Feed" 
              description="Share updates, requirements, polls, articles. React with Like/Love/Celebrate. Build your business reputation daily." 
              footer="Posts · Polls · Videos · Requirements"
            />
            <FeatureCard 
              icon={Users} 
              title="Smart Connections" 
              description="Find and connect with verified business owners, service providers, and entrepreneurs across India." 
              footer="Network · Messaging · Trust Score"
            />
            <FeatureCard 
              icon={Calendar} 
              title="Exclusive Events" 
              description="Workshops, masterclasses, mentorship sessions, and networking meetups. Earn points for attending." 
              footer="Workshops · Meetups · +20pts each"
            />
            <FeatureCard 
              icon={Zap} 
              title="Collabs" 
              description="Post business requirements and find collaborators. Complete 1 collab/week = 50 pts = 200 pts/month." 
              footer="Requirements · Partners · 50pts/collab"
            />
            <FeatureCard 
              icon={Globe} 
              title="Business Directory" 
              description="Get your business listed, found, and contacted by the right people. Build your digital presence." 
              footer="Listing · Discovery · Trust"
            />
            <FeatureCard 
              icon={BookOpen} 
              title="Blog & Articles" 
              description="Share your expertise, write articles, post success stories, and position yourself as an authority." 
              footer="Articles · Success Stories · Expertise"
            />
          </div>
        </div>
      </section>

      {/* --- For Business Owners --- */}
      <section id="business" className="py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left: Profile Mockup */}
            <div className="flex-1 w-full scroll-reveal">
              <div className="bg-unik-card rounded-3xl p-8 border border-white/10 shadow-2xl max-w-md mx-auto relative">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-unik-red to-red-800 rounded-full flex items-center justify-center text-2xl font-bold">VK</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xl font-bold">Vefever</h4>
                      <span className="bg-unik-red/20 text-unik-red text-[10px] px-2 py-0.5 rounded font-bold">SIP</span>
                    </div>
                    <p className="text-gray-500 text-sm">Karimnagar</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-black/40 p-4 rounded-xl text-center">
                    <div className="text-xs text-gray-500 mb-1">Score</div>
                    <div className="text-xl font-bold text-unik-red">581</div>
                  </div>
                  <div className="bg-black/40 p-4 rounded-xl text-center">
                    <div className="text-xs text-gray-500 mb-1">Network</div>
                    <div className="text-xl font-bold">1</div>
                  </div>
                  <div className="bg-black/40 p-4 rounded-xl text-center">
                    <div className="text-xs text-gray-500 mb-1">Posts</div>
                    <div className="text-xl font-bold">10</div>
                  </div>
                  <div className="bg-black/40 p-4 rounded-xl text-center">
                    <div className="text-xs text-gray-500 mb-1">Saved</div>
                    <div className="text-xl font-bold">3</div>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="text-sm font-bold flex justify-between">
                    <span>Trust Score</span>
                    <span className="text-unik-red">Good</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] text-gray-500">
                      <span>Profile</span>
                      <span>80%</span>
                    </div>
                    <div className="h-1.5 bg-black rounded-full overflow-hidden">
                      <div className="h-full bg-unik-red w-[80%]"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] text-gray-500">
                      <span>Feed</span>
                      <span>100%</span>
                    </div>
                    <div className="h-1.5 bg-black rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 w-full"></div>
                    </div>
                  </div>
                </div>

                <div className="bg-unik-red/10 p-4 rounded-xl border border-unik-red/20 flex items-center justify-between">
                  <span className="text-xs font-medium">Profile 30% complete</span>
                  <button className="text-xs font-bold text-unik-red">Complete now</button>
                </div>
              </div>
            </div>

            {/* Right: Benefits */}
            <div className="flex-1 scroll-reveal">
              <h2 className="text-4xl font-bold mb-8">Why Business Owners <br /><span className="text-unik-red">Love Unik Connect</span></h2>
              <div className="space-y-8">
                {[
                  { title: "Verified Business Profile", desc: "Get a Trust Score. The more active you are, the higher your credibility with other businesses." },
                  { title: "Post Business Requirements", desc: "Need a developer? A supplier? A partner? Post a requirement and get matched instantly." },
                  { title: "AI-Powered Discovery", desc: "Unik AI finds vendors, suggests collaborators, and recommends events tailored to your business." },
                  { title: "Track Your Growth", desc: "Monitor your network, posts, saved contacts, and referral earnings from one dashboard." },
                  { title: "Earn As You Network", desc: "Every post, comment, like, event you attend, and referral earns you real points with real rewards." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-6 h-6 bg-unik-red rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-1">{item.title}</h4>
                      <p className="text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Referral System --- */}
      <section id="referral" className="py-24 bg-unik-red/5">
        <div className="container mx-auto px-6">
          <SectionTitle title="Earn Lifetime Rewards. No Cap." subtitle="Earn lifetime rewards by referring others" />

          <div className="relative flex flex-col md:flex-row justify-between gap-12 mb-20 max-w-5xl mx-auto scroll-reveal">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-unik-red/20 -translate-y-1/2 hidden md:block"></div>
            
            {[
              { step: "1", title: "Share Your Link", desc: "Copy your unique referral code (like 'SAIKANTH') and share with friends." },
              { step: "2", title: "They Sign Up & Act", desc: "When someone uses your link to join, buy a course, or attend an event — it counts." },
              { step: "3", title: "You Get Rewarded", desc: "Earn points, cash, or commissions instantly. Rewards stack with every action!" }
            ].map((item, i) => (
              <div key={i} className="relative z-10 flex-1 bg-unik-card p-8 rounded-2xl border border-white/10 text-center">
                <div className="w-12 h-12 bg-unik-red rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6 shadow-[0_0_20px_rgba(229,57,53,0.3)]">
                  {item.step}
                </div>
                <h4 className="text-xl font-bold mb-3">{item.title}</h4>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 scroll-reveal">
            {/* Dashboard Mock */}
            <div className="bg-unik-card rounded-2xl p-8 border border-white/10">
              <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                <TrendingUp size={20} className="text-unik-red" /> Earnings Dashboard
              </h4>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-black/40 rounded-xl">
                  <div className="text-[10px] text-gray-500 uppercase mb-1">Total Referrals</div>
                  <div className="text-xl font-bold">124</div>
                </div>
                <div className="p-4 bg-black/40 rounded-xl">
                  <div className="text-[10px] text-gray-500 uppercase mb-1">Converted</div>
                  <div className="text-xl font-bold">42</div>
                </div>
                <div className="p-4 bg-black/40 rounded-xl">
                  <div className="text-[10px] text-gray-500 uppercase mb-1">Lifetime Earnings</div>
                  <div className="text-xl font-bold text-unik-gold">₹12,450</div>
                </div>
                <div className="p-4 bg-black/40 rounded-xl">
                  <div className="text-[10px] text-gray-500 uppercase mb-1">Wallet Balance</div>
                  <div className="text-xl font-bold text-green-500">₹3,200</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-unik-red/10 rounded-xl border border-unik-red/20">
                <span className="text-sm">Pending Rewards (Awaiting confirmation)</span>
                <span className="font-bold">₹850</span>
              </div>
            </div>

            {/* Referral Types */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Users, title: "Member Referral", desc: "Earn when friends join" },
                { icon: BookOpen, title: "Course Referral", desc: "Earn on course sales" },
                { icon: Calendar, title: "Event Referral", desc: "Earn on registrations" },
                { icon: Award, title: "Membership Referral", desc: "Earn on upgrades" }
              ].map((item, i) => (
                <div key={i} className="bg-unik-card p-6 rounded-2xl border border-white/10 hover:border-unik-red/50 transition-all">
                  <item.icon className="text-unik-red mb-3" size={24} />
                  <h5 className="font-bold text-sm mb-1">{item.title}</h5>
                  <p className="text-[10px] text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center scroll-reveal">
            <div className="inline-block bg-unik-red px-8 py-3 rounded-full font-bold text-lg shadow-xl">
              No cap on earnings — the more you refer, the more you earn! 🚀
            </div>
          </div>
        </div>
      </section>

      {/* --- Learning Section --- */}
      <section id="learning" className="py-24">
        <div className="container mx-auto px-6">
          <SectionTitle title="Master Business Skills. Earn XP. Grow Faster." subtitle="Master new skills, earn rewards" />

          <div className="flex flex-col lg:flex-row gap-16 items-center">
            {/* Left: Course Card */}
            <div className="flex-1 w-full scroll-reveal">
              <div className="bg-unik-card rounded-3xl overflow-hidden border border-white/10 shadow-2xl max-w-md mx-auto">
                <div className="h-48 bg-gradient-to-br from-purple-600 to-indigo-900 p-8 flex items-center justify-center relative">
                  <BookOpen size={64} className="text-white/20" />
                  <div className="absolute top-4 right-4 bg-unik-red text-white text-[10px] font-bold px-2 py-1 rounded">⚡ 10 XP</div>
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded">Beginner</span>
                    <span className="bg-unik-gold text-white text-[10px] font-bold px-2 py-1 rounded">Growth</span>
                  </div>
                </div>
                <div className="p-8">
                  <h4 className="text-xl font-bold mb-4">Business Growth Strategies</h4>
                  <p className="text-gray-500 text-sm mb-6">by Venky Atluri</p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-xs font-medium">
                      <span>Progress</span>
                      <span>50%</span>
                    </div>
                    <div className="h-2 bg-black rounded-full overflow-hidden">
                      <div className="h-full bg-unik-red w-1/2"></div>
                    </div>
                  </div>

                  <div className="flex justify-between text-[10px] text-gray-500 mb-6 pb-6 border-b border-white/5">
                    <span>2 Lessons</span>
                    <span>5m Duration</span>
                    <span>Beginner Level</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-green-500">
                      <CheckCircle2 size={16} /> Lesson 1 completed
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <Lock size={16} /> Lesson 2 locked
                    </div>
                  </div>
                </div>
              </div>

              {/* Achievement Badges */}
              <div className="mt-8 flex flex-wrap justify-center gap-3 max-w-md mx-auto">
                {[
                  { icon: "🎯", label: "First Step", unlocked: true },
                  { icon: "⚡", label: "Quick Learner", unlocked: false },
                  { icon: "🔥", label: "On Fire", unlocked: false },
                  { icon: "🎓", label: "Graduate", unlocked: false }
                ].map((badge, i) => (
                  <div key={i} className={`p-2 rounded-lg border flex items-center gap-2 text-[10px] font-bold ${badge.unlocked ? 'bg-unik-red/10 border-unik-red/30 text-unik-red' : 'bg-black/40 border-white/5 text-gray-600 grayscale'}`}>
                    <span>{badge.icon}</span> {badge.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Features */}
            <div className="flex-1 scroll-reveal">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { title: "Multi-Category Courses", desc: "Growth, Finance, Operations, Sales, Tech" },
                  { title: "XP & Level System", desc: "Start at Level 1, earn XP per lesson, level up" },
                  { title: "Daily Streak Tracking", desc: "Log in daily, maintain streaks, unlock badges" },
                  { title: "Progress Dashboard", desc: "Day streak, XP earned, total days learned" },
                  { title: "8 Achievement Badges", desc: "From 'First Step' to '30-Day Legend'" },
                  { title: "Referral-Linked Courses", desc: "Earn commission when you refer course buyers" }
                ].map((item, i) => (
                  <div key={i} className="bg-unik-card p-6 rounded-2xl border border-white/10">
                    <h5 className="font-bold mb-2 text-unik-red">{item.title}</h5>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- City Clubs --- */}
      <section id="city-clubs" className="py-24 bg-black/50">
        <div className="container mx-auto px-6">
          <SectionTitle title="Your City. Your Business Community." subtitle="Connect with entrepreneurs in your city" />
          
          <p className="text-center text-gray-400 max-w-2xl mx-auto mb-16 scroll-reveal">
            59+ city clubs across India, each city has its own group with Feed, Members, Events, Chat, and Collabs tabs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 scroll-reveal">
            {[
              { 
                name: "Hyderabad Club", 
                members: "1,200+", 
                deals: "45", 
                joined: true, 
                color: "from-indigo-600 to-purple-900",
                svg: (
                  <svg className="absolute right-[-5%] bottom-[-5%] w-32 h-32 opacity-20 text-white pointer-events-none" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M20 80 V40 Q20 20 50 20 Q80 20 80 40 V80 H20 Z" />
                    <path d="M35 80 V55 Q35 45 50 45 Q65 45 65 55 V80" />
                    <circle cx="20" cy="35" r="4" fill="currentColor" />
                    <circle cx="80" cy="35" r="4" fill="currentColor" />
                    <path d="M15 35 L25 35 M75 35 L85 35" />
                    <path d="M40 20 L40 10 M60 20 L60 10" />
                    <path d="M20 50 H80 M20 60 H80 M20 70 H80" opacity="0.3" />
                  </svg>
                )
              },
              { 
                name: "Vizag Club", 
                members: "850+", 
                deals: "28", 
                joined: false, 
                color: "from-cyan-600 to-blue-900",
                svg: (
                  <svg className="absolute right-[-5%] bottom-[-5%] w-32 h-32 opacity-20 text-white pointer-events-none" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M0 80 Q20 60 40 80 T80 80 T120 80 V100 H0 Z" opacity="0.5" />
                    <path d="M60 80 L70 30 L80 80 Z" />
                    <circle cx="85" cy="20" r="6" />
                    <path d="M0 90 Q25 85 50 90 T100 90" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    <path d="M10 20 L20 30 M30 15 L35 25" stroke="currentColor" strokeWidth="1" opacity="0.4" />
                  </svg>
                )
              },
              { 
                name: "Vijayawada Club", 
                members: "920+", 
                deals: "34", 
                joined: false, 
                color: "from-orange-600 to-red-900",
                svg: (
                  <svg className="absolute right-[-5%] bottom-[-5%] w-32 h-32 opacity-20 text-white pointer-events-none" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M10 80 H90 V75 H10 Z" />
                    <path d="M20 75 V40 H25 V75 M35 75 V40 H40 V75 M50 75 V40 H55 V75 M65 75 V40 H70 V75 M80 75 V40 H85 V75" />
                    <path d="M10 40 H90" fill="none" stroke="currentColor" strokeWidth="1" />
                    <path d="M0 90 C20 80 40 100 60 90 S100 90 100 90" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    <circle cx="50" cy="25" r="10" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                  </svg>
                )
              },
              { 
                name: "Tirupathi Club", 
                members: "740+", 
                deals: "19", 
                joined: false, 
                color: "from-amber-600 to-yellow-900",
                svg: (
                  <svg className="absolute right-[-5%] bottom-[-5%] w-32 h-32 opacity-20 text-white pointer-events-none" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M30 85 L70 85 L65 65 L75 65 L60 40 L70 40 L50 10 L30 40 L40 40 L25 65 L35 65 Z" />
                    <path d="M45 85 V75 H55 V85" opacity="0.5" />
                    <path d="M35 65 H65 M40 40 H60" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    <path d="M10 85 H90" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
                  </svg>
                )
              }
            ].map((club, i) => (
              <div key={i} className="bg-unik-card rounded-2xl overflow-hidden border border-white/10 group hover:border-unik-red/50 transition-all relative">
                <div className={`h-32 bg-gradient-to-br ${club.color} p-6 flex flex-col justify-end relative overflow-hidden`}>
                  {/* Culture Texture Overlay */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '12px 12px' }}></div>
                  {club.svg}
                  <div className="relative z-10">
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">City Club</div>
                    <h5 className="font-black text-2xl tracking-tighter">{club.name}</h5>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between text-[10px] text-gray-500 mb-6">
                    <span>{club.members} Members</span>
                    <span>{club.deals} Deals</span>
                  </div>
                  <div className="flex gap-1 mb-6">
                    {['Feed', 'Members', 'Events', 'Chat', 'Collabs'].map(tab => (
                      <span key={tab} className="text-[8px] bg-black/40 px-1.5 py-0.5 rounded text-gray-400">{tab}</span>
                    ))}
                  </div>
                  <button className={`w-full py-2 rounded-lg text-xs font-bold transition-all ${club.joined ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-unik-red text-white'}`}>
                    {club.joined ? 'Joined ✅' : 'Join Club'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 scroll-reveal">
            <div className="flex items-center gap-4 bg-unik-card p-6 rounded-2xl border border-white/10">
              <MapPin className="text-unik-red" size={32} />
              <div>
                <h5 className="font-bold">City-Based Networking</h5>
                <p className="text-xs text-gray-500">Find owners in your city</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-unik-card p-6 rounded-2xl border border-white/10">
              <MessageSquare className="text-unik-red" size={32} />
              <div>
                <h5 className="font-bold">Dedicated Club Chat</h5>
                <p className="text-xs text-gray-500">Private city channels</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-unik-card p-6 rounded-2xl border border-white/10">
              <TrendingUp className="text-unik-red" size={32} />
              <div>
                <h5 className="font-bold">Active Deals Counter</h5>
                <p className="text-xs text-gray-500">See live business deals</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Unik AI Section --- */}
      <section id="unik-ai" className="py-24">
        <div className="container mx-auto px-6">
          <SectionTitle title="Meet Unik AI — Your Business Intelligence Assistant" subtitle="Powered by Venu Kalyan Strategies" />

          <div className="flex flex-col lg:flex-row gap-16 items-center">
            {/* Left: Chat UI */}
            <div className="flex-1 w-full scroll-reveal">
              <div className="bg-unik-card rounded-3xl overflow-hidden border border-white/10 shadow-2xl max-w-md mx-auto">
                <div className="bg-black/60 p-4 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-unik-red rounded-full flex items-center justify-center">
                      <Bot size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold">Unik AI</div>
                      <div className="flex items-center gap-1 text-[10px] text-green-500">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Online
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-[400px] overflow-y-auto p-6 space-y-6 bg-black/20">
                  {aiChatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-unik-red text-white rounded-tr-none' : 'bg-unik-card border border-white/10 text-gray-300 rounded-tl-none'}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-black/40 border-t border-white/10">
                  <div className="flex flex-wrap gap-2">
                    {['⚡ Find IT providers', '⚡ Suggest partners', '⚡ Recommend events'].map(pill => (
                      <span key={pill} className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded-full text-gray-400">{pill}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Features */}
            <div className="flex-1 scroll-reveal">
              <div className="space-y-8">
                {[
                  { title: "Vendor Discovery", desc: "AI searches the entire platform directory to find the perfect IT providers, suppliers, or vendors." },
                  { title: "Collaboration Matching", desc: "Suggests the right business partners based on your profile, city, and industry." },
                  { title: "Event Recommendations", desc: "Recommends upcoming events that match your business goals." },
                  { title: "Referral Optimization", desc: "Identifies your top referral opportunities to maximize earnings." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 bg-unik-red/10 rounded-xl flex items-center justify-center text-unik-red flex-shrink-0">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-1">{item.title}</h4>
                      <p className="text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-6 bg-unik-red/10 border border-unik-red/20 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 bg-unik-red text-white text-[10px] font-bold">Venu Kalyan Strategies</div>
                <h5 className="font-bold mb-2">Powered by Venu Kalyan Strategies</h5>
                <p className="text-sm text-gray-400">
                  Business growth frameworks, mentorship, and strategies by Venu Kalyan — embedded directly into Unik AI's intelligence layer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Leaderboard Section --- */}
      <section id="leaderboard" className="py-24 bg-unik-red/5">
        <div className="container mx-auto px-6">
          <SectionTitle title="Earn Points. Climb Tiers. Get Rewarded." subtitle="Top community contributors earn real rewards" />

          <div className="flex flex-col lg:flex-row gap-16">
            {/* Left: Tiers */}
            <div className="flex-1 scroll-reveal">
              <div className="space-y-4 mb-12">
                {[
                  { name: "Starter", pts: "0+", color: "bg-red-500", locked: false },
                  { name: "Connector", pts: "500+", color: "bg-unik-red", locked: false, current: true },
                  { name: "Dealmaker", pts: "2,000+", color: "bg-orange-500", locked: true },
                  { name: "Champion", pts: "5,000+", color: "bg-unik-gold", locked: true },
                  { name: "Legend", pts: "10,000+", color: "bg-purple-600", locked: true }
                ].map((tier, i) => (
                  <div key={i} className={`p-4 rounded-xl border flex items-center justify-between ${tier.current ? 'bg-unik-red/20 border-unik-red shadow-[0_0_20px_rgba(229,57,53,0.2)]' : 'bg-unik-card border-white/5 opacity-60'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${tier.color}`}></div>
                      <span className="font-bold">{tier.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-500">{tier.pts} points</span>
                      {tier.locked && <Lock size={14} className="text-gray-600" />}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-unik-card p-8 rounded-2xl border border-unik-red relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-unik-red text-white px-3 py-1 text-[10px] font-bold">#2 YOUR RANK</div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-unik-red rounded-full flex items-center justify-center text-2xl font-bold">VK</div>
                  <div>
                    <h4 className="text-xl font-bold">🔥 CONNECTOR</h4>
                    <p className="text-unik-red font-bold">581 points earned</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>29% progress</span>
                    <span>1,419 pts to Dealmaker →</span>
                  </div>
                  <div className="h-2 bg-black rounded-full overflow-hidden">
                    <div className="h-full bg-unik-red w-[29%]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Points Table */}
            <div className="flex-1 scroll-reveal">
              <div className="bg-unik-card rounded-2xl overflow-hidden border border-white/10">
                <table className="w-full text-left text-sm">
                  <thead className="bg-black/40 text-gray-500 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Action</th>
                      <th className="px-6 py-4">Times Earned</th>
                      <th className="px-6 py-4">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[
                      { action: "✏️ post_create", times: "per post", pts: "10 pts" },
                      { action: "❤️ post_like", times: "per like", pts: "2 pts" },
                      { action: "📅 event_attend", times: "per event", pts: "20 pts" },
                      { action: "🔗 post_share", times: "per share", pts: "8 pts" },
                      { action: "🔑 daily_login", times: "per day", pts: "5 pts" },
                      { action: "👥 refer_member", times: "per referral", pts: "200 pts" }
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-medium">{row.action}</td>
                        <td className="px-6 py-4 text-gray-500">{row.times}</td>
                        <td className="px-6 py-4 text-unik-red font-bold">{row.pts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 bg-unik-red/10 p-6 rounded-2xl border border-unik-red/20">
                <h5 className="font-bold mb-4 flex items-center gap-2">🔥 Quick Earning Tips</h5>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>→ Post daily updates = 10 pts/post → 300 pts/month</li>
                  <li>→ Like & comment on 5 posts/day = 35 pts/day → 1,050 pts/month</li>
                  <li>→ Complete 1 collab/week = 50 pts/collab → 200 pts/month</li>
                  <li className="text-unik-red font-bold">★ Active members can earn 2,500+ points/month easily!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Testimonials --- */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <SectionTitle title="Real Results from Real Business Owners" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { text: "Scaled to 5 cities and hit ₹1Cr monthly revenue through Unik referrals!", author: "Rajesh Kumar", role: "Founder KumarTech, Hyderabad" },
              { text: "Found my best vendor through Unik AI in under 2 minutes. This platform is a game changer for business networking.", author: "Saikanth V.", role: "VKM Mentorship, India" },
              { text: "The City Club for Karimnagar helped me close 3 deals in my first month. The community is incredibly active and supportive.", author: "Vefever", role: "Service Provider, Moshe Inc, Karimnagar" }
            ].map((t, i) => (
              <div key={i} className="bg-unik-card p-8 rounded-2xl border border-white/10 scroll-reveal">
                <div className="flex gap-1 text-unik-gold mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-gray-300 mb-8 leading-relaxed italic">"{t.text}"</p>
                <div>
                  <div className="font-bold">{t.author}</div>
                  <div className="text-xs text-gray-500">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- App Download CTA --- */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-unik-dark to-black"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-unik-red/20 rounded-full blur-[120px]"></div>
        
        <div className="container mx-auto px-6 relative z-10 text-center scroll-reveal">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Ready to Grow Your Business?</h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12">
            Join thousands of entrepreneurs, business owners, and professionals on Unik Connect.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
            <button className="w-full sm:w-auto bg-black border border-white/10 px-8 py-4 rounded-2xl flex items-center gap-4 hover:bg-white/5 transition-all">
              <div className="text-left">
                <div className="text-[10px] text-gray-500 uppercase">Get it on</div>
                <div className="text-lg font-bold">Google Play</div>
              </div>
            </button>
            <button className="w-full sm:w-auto bg-black border border-white/10 px-8 py-4 rounded-2xl flex items-center gap-4 hover:bg-white/5 transition-all">
              <div className="text-left">
                <div className="text-[10px] text-gray-500 uppercase">Download on the</div>
                <div className="text-lg font-bold">App Store</div>
              </div>
            </button>
          </div>

          <a href="#" className="text-unik-red font-bold hover:underline flex items-center justify-center gap-2 mb-16">
            Or use the Web App <ExternalLink size={16} />
          </a>

          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <CheckCircle2 size={18} className="text-green-500" /> Free to Join
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <CheckCircle2 size={18} className="text-green-500" /> Verified Profiles
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <CheckCircle2 size={18} className="text-green-500" /> Powered by Venu Kalyan
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-black pt-20 pb-10 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-unik-red rounded flex items-center justify-center text-white font-bold">U</div>
                <span className="text-xl font-bold tracking-tight">Unik <span className="text-unik-red">Connect</span></span>
              </div>
              <p className="text-gray-500 max-w-sm mb-8">
                India's #1 Business Networking Platform. Connect. Collaborate. Grow. Powered by Venu Kalyan Strategies.
              </p>
              <div className="flex gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-unik-red transition-colors cursor-pointer">
                    <Globe size={18} />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h6 className="font-bold mb-6">Platform</h6>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><a href="#" className="hover:text-white transition-colors">Feed</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Events</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Collabs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Connections</a></li>
              </ul>
            </div>

            <div>
              <h6 className="font-bold mb-6">Features</h6>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><a href="#" className="hover:text-white transition-colors">City Clubs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Learning</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Unik AI</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Referral Program</a></li>
              </ul>
            </div>

            <div>
              <h6 className="font-bold mb-6">Company</h6>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><a href="#" className="hover:text-white transition-colors">About Venu Kalyan</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Strategies</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-600">
            <p>©️ 2026 Unik Connect. Powered by Venu Kalyan Strategies. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-[60] w-12 h-12 bg-unik-red text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(229,57,53,0.4)] hover:scale-110 transition-transform group"
          >
            <ChevronUp size={24} className="group-hover:-translate-y-1 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating Mobile Button */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 2 }}
        className="fixed bottom-6 left-6 right-6 z-40 lg:hidden"
      >
        <button className="w-full bg-unik-red py-4 rounded-xl font-bold shadow-2xl">
          Join Free Now
        </button>
      </motion.div>
    </div>
  );
}
