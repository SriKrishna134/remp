import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Instagram, Linkedin, Menu, X } from 'lucide-react';

// Smooth scroll
const useSmoothScroll = () => {
  useEffect(() => {
    let currentScroll = window.scrollY;
    let targetScroll = window.scrollY;

    const lerp = (start, end, factor) => start + (end - start) * factor;

    const smoothScrollLoop = () => {
      currentScroll = lerp(currentScroll, targetScroll, 0.1);
      if (Math.abs(targetScroll - currentScroll) > 0.5) {
        requestAnimationFrame(smoothScrollLoop);
      }
    };

    const handleScroll = () => {
      targetScroll = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    smoothScrollLoop();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
};

// Mouse parallax
const useMouseParallax = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setPosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return position;
};


// Navigation
const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled ? 'bg-black/40 backdrop-blur-2xl py-4' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="text-base md:text-lg font-light tracking-[0.2em]">
            SRIKRISHNA<span className="font-normal">HIREHOLI</span>
          </div>
          
            {/* <div className="hidden md:flex items-center gap-10">
              {['Work', 'About', 'Contact'].map((item) => (
                <button
                  key={item}
                  className="relative text-xs tracking-[0.15em] transition-all duration-300 group text-gray-400 hover:text-white uppercase"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-full h-px bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                </button>
              ))}
            </div> */}

          <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 bg-black z-40 md:hidden flex flex-col items-center justify-center gap-12 animate-fadeIn">
          {['Work', 'About', 'Contact'].map((item, i) => (
            <button
              key={item}
              onClick={() => setMenuOpen(false)}
              className="text-4xl font-light tracking-wider text-white hover:text-gray-400 transition-all duration-300 opacity-0 animate-fadeInUp"
              style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'forwards' }}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

// SVG Curved Path Component
const CurvedLine = ({ progress }) => {
  const pathLength = 2000;
  const drawLength = progress * pathLength;

  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none" 
      style={{ zIndex: 5 }}
    >
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.8)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
        </linearGradient>
      </defs>
      
      <path
        d="M 0,300 Q 300,100 600,300 T 1200,300 Q 1500,500 1800,300"
        fill="none"
        stroke="url(#lineGradient)"
        strokeWidth="2"
        strokeDasharray={pathLength}
        strokeDashoffset={pathLength - drawLength}
        style={{ 
          transition: 'stroke-dashoffset 0.3s ease-out',
          filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.5))'
        }}
      />
      
      {/* Animated dots along the path */}
      {[0.2, 0.5, 0.8].map((pos, i) => (
        progress > pos && (
          <circle
            key={i}
            cx={pos * 1800}
            cy={300 + Math.sin(pos * Math.PI * 2) * 100}
            r="6"
            fill="white"
            className="animate-pulse"
            style={{
              filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.8))',
              opacity: progress > pos ? 1 : 0,
              transition: 'opacity 0.5s ease-out'
            }}
          />
        )
      ))}
    </svg>
  );
};

// Main Portfolio
const Portfolio = () => {
  useSmoothScroll();
  const mousePos = useMouseParallax();
  
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);
  const section4Ref = useRef(null);
  const section5Ref = useRef(null);
  
  const [section1Progress, setSection1Progress] = useState(0);
  const [section2Progress, setSection2Progress] = useState(0);
  const [section3Progress, setSection3Progress] = useState(0);
  const [section4Progress, setSection4Progress] = useState(0);
  const [section5Progress, setSection5Progress] = useState(0);

// Keep your existing IntersectionObserver
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const progress = entry.intersectionRatio;
        if (entry.target === section1Ref.current) setSection1Progress(progress);
        if (entry.target === section2Ref.current) setSection2Progress(progress);
        // DON'T set section3Progress here anymore - handled by scroll listener below
        if (entry.target === section4Ref.current) setSection4Progress(progress);
        if (entry.target === section5Ref.current) setSection5Progress(progress);
      });
    },
    { threshold: Array.from({ length: 101 }, (_, i) => i / 100) }
  );

  [section1Ref, section2Ref, section3Ref, section4Ref, section5Ref].forEach((ref) => {
    if (ref.current) observer.observe(ref.current);
  });

  return () => observer.disconnect();
}, []);

// REPLACE your Section 3 scroll listener with this FASTER version
useEffect(() => {
  const handleSection3Scroll = () => {
    if (!section3Ref.current) return;
    
    const rect = section3Ref.current.getBoundingClientRect();
    const sectionHeight = section3Ref.current.offsetHeight;
    const windowHeight = window.innerHeight;
    
    // Only calculate when section is in viewport
    if (rect.top <= windowHeight && rect.bottom >= 0) {
      // Progress from 0 to 1 as you scroll through the entire 400vh
      const scrolled = Math.max(0, -rect.top);
      const totalScrollDistance = sectionHeight - windowHeight;
      
      // SPEED UP PROGRESS by 1.3x so animations trigger earlier
      const rawProgress = scrolled / totalScrollDistance;
      const progress = Math.max(0, Math.min(1, rawProgress * 1.3));
      
      setSection3Progress(progress);
    } else if (rect.top > windowHeight) {
      // Section hasn't entered yet
      setSection3Progress(0);
    } else if (rect.bottom < 0) {
      // Section has passed
      setSection3Progress(1.3); // Allow overflow for last animations
    }
  };

  window.addEventListener('scroll', handleSection3Scroll, { passive: true });
  handleSection3Scroll(); // Initial call
  
  return () => window.removeEventListener('scroll', handleSection3Scroll);
}, []);

  const tagline = "As a digital designer, I build interactive, motion driven experiences that help brands connect, communicate, and stand out. My philosophy is rooted in curiosity, experimentation, and designing systems that feel alive in a fast moving world.".split(" ");

  const getWordStyle = (i, total, progress) => {
    const diagonalFactor = i / total;
    const visible = Math.max(0, Math.min(1, (progress - diagonalFactor * 0.4) * 3));

    return {
      opacity: visible,
      filter: `blur(${(1 - visible) * 12}px)`,
      transform: `translate(${(1 - visible) * -30}px, ${(1 - visible) * 30}px)`,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
    };
  };

  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes spin-slow-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        .animate-fadeInUp { animation: fadeInUp 1s ease-out forwards; }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out forwards; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-spin-slow-reverse { animation: spin-slow-reverse 20s linear infinite; }
        
        * { scroll-behavior: smooth; }
        
        ::selection {
          background-color: white;
          color: black;
        }

        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: #0a0a0a;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #555;
        }

        .image-parallax {
          will-change: transform;
        }
      `}</style>

      <Navigation />
{/* Section 1: Hero with Full-Screen Topographic Animation */}
      <section ref={section1Ref} className="min-h-screen relative overflow-hidden flex items-center">
        {/* Fixed Background with Video */}
        <div className="absolute inset-0 bg-black">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-20"
            style={{ filter: 'brightness(0.6) contrast(1.1)' }}
          >
            <source src="./hero-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
        </div>
{/* Aurora Background with Interactive Glow */}
<div className="absolute inset-0 pointer-events-none overflow-hidden">
  {/* Base Aurora Image - ALWAYS VISIBLE */}
  <div className="absolute inset-0">
    <img 
      src="./aurora-base.jpg" 
      alt="Aurora Base"
      className="w-full h-full object-cover"
      style={{ opacity: 0.3 }}
    />
  </div>

  {/* Interactive Aurora Glow - ONLY VISIBLE WHERE CURSOR IS */}
  <div 
    className="absolute inset-0"
    style={{
      maskImage: `radial-gradient(circle 400px at ${mousePos.x + 50}% ${mousePos.y + 50}%, black 0%, transparent 100%)`,
      WebkitMaskImage: `radial-gradient(circle 400px at ${mousePos.x + 50}% ${mousePos.y + 50}%, black 0%, transparent 100%)`,
    }}
  >
    <img 
      src="./aurora-only.png" 
      alt="Aurora Glow"
      className="w-full h-full object-cover animate-aurora-wave"
      style={{
        filter: `brightness(1.8) saturate(2) drop-shadow(0 0 80px rgba(16, 140, 185, 0.43))`,
      }}
    />
  </div>

  {/* Animated soft cursor glow */}
  <div
    className="absolute pointer-events-none"
    style={{
      left: `${mousePos.x + 50}%`,
      top: `${mousePos.y + 50}%`,
      transform: 'translate(-50%, -50%) scale(1.05)',
      width: '600px',
      height: '600px',
      background: 'radial-gradient(circle, rgba(16,185,129,0.85) 0%, rgba(16,185,129,0.55) 35%, transparent 65%)',
      filter: 'blur(70px)',
      mixBlendMode: 'screen',
      animation: 'glowPulse 4s ease-in-out infinite',
      transition:
        'left 0.25s cubic-bezier(0.22, 1, 0.36, 1), top 0.25s cubic-bezier(0.22, 1, 0.36, 1)'
    }}
  />

  {/* Animated Green Aurora Snake Lines */}
  <svg className="absolute inset-0 w-full h-full" style={{ mixBlendMode: 'screen' }}>
    <defs>
      <linearGradient id="snakeGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(16, 185, 129, 0)" />
        <stop offset="30%" stopColor="rgba(16, 185, 129, 0.4)" />
        <stop offset="50%" stopColor="rgba(16, 185, 129, 0.9)" />
        <stop offset="70%" stopColor="rgba(52, 211, 153, 0.6)" />
        <stop offset="100%" stopColor="rgba(16, 185, 129, 0)" />
      </linearGradient>
      
      <linearGradient id="snakeGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(52, 211, 153, 0)" />
        <stop offset="30%" stopColor="rgba(52, 211, 153, 0.3)" />
        <stop offset="50%" stopColor="rgba(16, 185, 129, 0.8)" />
        <stop offset="70%" stopColor="rgba(16, 185, 129, 0.5)" />
        <stop offset="100%" stopColor="rgba(52, 211, 153, 0)" />
      </linearGradient>

      <filter id="auroraGlow">
        <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    {/* Snake Line 1 - Main flowing diagonal */}
    <path
      d="M -200,300 Q 300,200 600,400 T 1400,500 Q 1700,600 2000,400"
      fill="none"
      stroke="url(#snakeGradient1)"
      strokeWidth="4"
      strokeLinecap="round"
      filter="url(#auroraGlow)"
      style={{
        animation: 'snakeFlow1 12s ease-in-out infinite',
        opacity: 0.7
      }}
    />

    {/* Snake Line 2 - Secondary wave */}
    <path
      d="M -300,600 Q 200,500 700,700 T 1500,800 Q 1800,900 2200,700"
      fill="none"
      stroke="url(#snakeGradient2)"
      strokeWidth="3"
      strokeLinecap="round"
      filter="url(#auroraGlow)"
      style={{
        animation: 'snakeFlow2 15s ease-in-out infinite',
        animationDelay: '2s',
        opacity: 0.5
      }}
    />

    {/* Snake Line 3 - Subtle top wave */}
    <path
      d="M -100,100 Q 400,50 800,200 T 1600,250 Q 1900,300 2100,150"
      fill="none"
      stroke="url(#snakeGradient1)"
      strokeWidth="2.5"
      strokeLinecap="round"
      filter="url(#auroraGlow)"
      style={{
        animation: 'snakeFlow3 18s ease-in-out infinite',
        animationDelay: '4s',
        opacity: 0.4
      }}
    />

    {/* Flowing particles along the path */}
    {[...Array(6)].map((_, i) => (
      <circle
        key={`particle-${i}`}
        r="4"
        fill="rgba(16, 185, 129, 0.8)"
        filter="url(#auroraGlow)"
        style={{
          animation: `particleFlow${(i % 3) + 1} ${8 + i * 2}s ease-in-out infinite`,
          animationDelay: `${i * 1.5}s`
        }}
      />
    ))}
  </svg>
</div>
              <style>{`
              @keyframes snakeFlow1 {
  0%, 100% { 
    d: path("M -200,300 Q 300,200 600,400 T 1400,500 Q 1700,600 2000,400");
    opacity: 0.7;
  }
  25% { 
    d: path("M -200,350 Q 350,250 650,450 T 1450,550 Q 1750,650 2000,450");
    opacity: 0.9;
  }
  50% { 
    d: path("M -200,280 Q 280,180 580,380 T 1380,480 Q 1680,580 2000,380");
    opacity: 0.6;
  }
  75% { 
    d: path("M -200,320 Q 320,220 620,420 T 1420,520 Q 1720,620 2000,420");
    opacity: 0.8;
  }
}

@keyframes snakeFlow2 {
  0%, 100% { 
    d: path("M -300,600 Q 200,500 700,700 T 1500,800 Q 1800,900 2200,700");
  }
  33% { 
    d: path("M -300,650 Q 250,550 750,750 T 1550,850 Q 1850,950 2200,750");
  }
  66% { 
    d: path("M -300,580 Q 180,480 680,680 T 1480,780 Q 1780,880 2200,680");
  }
}

@keyframes snakeFlow3 {
  0%, 100% { 
    d: path("M -100,100 Q 400,50 800,200 T 1600,250 Q 1900,300 2100,150");
  }
  50% { 
    d: path("M -100,130 Q 430,80 830,230 T 1630,280 Q 1930,330 2100,180");
  }
}

@keyframes particleFlow1 {
  0% { cx: -100; cy: 300; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { cx: 2000; cy: 400; opacity: 0; }
}

@keyframes particleFlow2 {
  0% { cx: -300; cy: 600; opacity: 0; }
  10% { opacity: 0.8; }
  90% { opacity: 0.8; }
  100% { cx: 2200; cy: 700; opacity: 0; }
}

@keyframes particleFlow3 {
  0% { cx: -100; cy: 100; opacity: 0; }
  10% { opacity: 0.6; }
  90% { opacity: 0.6; }
  100% { cx: 2100; cy: 150; opacity: 0; }
}
              @keyframes glowPulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.75;
    filter: blur(60px);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 1;
    filter: blur(85px);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.75;
    filter: blur(60px);
  }
}

@keyframes aurora-wave {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  25% {
    transform: translateY(-8px) scale(1.01);
  }
  50% {
    transform: translateY(0) scale(1.02);
  }
  75% {
    transform: translateY(8px) scale(1.01);
  }
}

.animate-aurora-wave {
  animation: aurora-wave 4s ease-in-out infinite;
}
      `}</style>

        {/* Content Layer */}
        <div className="relative z-10 w-full h-full flex items-center">
          <div className="w-full max-w-7xl mx-auto px-6 py-20">
            <div className="relative">
              {/* Image Container with Subtle 3D Parallax Effect */}
              <div 
                className="absolute left-0 top-1/2 w-[45%] aspect-[3/4]"
                style={{
                  opacity: section1Progress,
                  transform: 'translateY(-50%)'
                }}
              >
                {/* Base Image - FIXED, doesn't move */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <img 
                    src="./portrait.png" 
                    alt="Portrait Background"
                    className="w-full h-full object-cover object-center"
                    style={{
                      transform: `scale(${1.15 + section1Progress * 0.1})`,
                      transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.style.background = 'linear-gradient(135deg, #000000ff 0%, #000000ff 100%)';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/40"></div>
                </div>

                {/* Cropped Face Layer - FOLLOWS CURSOR (3D effect) */}
                <div 
                  className="absolute inset-0 rounded-2xl overflow-hidden"
                  style={{
                    opacity: section1Progress,
                    transform: `translate(${mousePos.x * 5}px, ${mousePos.y * 3}px)`,
                    transition: 'transform 0.1s linear'
                  }}
                >
                  <img 
                    src="./portrait-face.jpg" 
                    alt="Portrait Face"
                    className="w-full h-full object-cover"
                    style={{
                      transform: `scale(${1.15 + section1Progress * 0.1})`,
                      transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Text Overlay - Positioned on Right with Overlap */}
              <div 
                className="relative ml-auto w-[65%] pl-12 space-y-8"
                style={{
                  opacity: section1Progress,
                  transform: `translateX(${(1 - section1Progress) * 50}px)`
                }}
              >
                <div 
                  className="text-xs tracking-[0.3em] text-black-500 uppercase opacity-0 animate-fadeInUp" 
                  style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
                >
                  Creative Digital Designer
                </div>
                
                <h1 
                  className="text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-light leading-[1.05] tracking-tight opacity-0 animate-fadeInUp" 
                  style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
                >
                  Creating Digital
                  <br />
                  <span className="italic font-serif">Experiences</span>
                  <br />
                  That Matter
                </h1>
                
                <div 
                  className="flex items-center gap-4 opacity-0 animate-fadeInUp pt-6" 
                  style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}
                >
                  <div className="h-px w-20 bg-white/30"></div>
                  <p className="text-xs tracking-[0.3em] text-black-400 uppercase">Bengaluru, India</p>
                </div>

                <p 
                  className="text-lg md:text-xl text-black-400 leading-relaxed max-w-xl opacity-0 animate-fadeInUp" 
                  style={{ animationDelay: '1s', animationFillMode: 'forwards' }}
                >
                  Crafting award winning digital experiences that connect brands with their audience and drive meaningful results.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div 
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 animate-fadeInUp" 
          style={{ animationDelay: '1.3s', animationFillMode: 'forwards' }}
        >
          <ChevronDown className="text-white/20 animate-bounce" size={48} strokeWidth={1} />
        </div>
      </section>

      {/* Section 2: Full Text with Diagonal Blur */}
      <section ref={section2Ref} className="min-h-screen flex items-center justify-center px-6 py-32 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-xs tracking-[0.3em] text-gray-500 mb-12 text-center uppercase"
            style={{
              opacity: section2Progress,
              transform: `translateY(${(1 - section2Progress) * 30}px)`
            }}
          >
            (My Philosophy)
          </div>
          
<h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-light leading-[1.4] text-center">            {tagline.map((word, i) => (
              <span
                key={i}
                className="inline-block mx-2 my-1"
                style={getWordStyle(i, tagline.length, section2Progress)}
              >
                {word}
              </span>
            ))}
          </h2>
        </div>
      </section>
{/* Section 3: SPACE JOURNEY - Skills Section */}
<section ref={section3Ref} className="relative py-0" style={{ minHeight: '400vh' }}>
  {/* Space Background with Stars - FIXED POSITION */}
  <div 
    className="fixed inset-0 pointer-events-none" 
    style={{ 
      zIndex: section3Progress > 0.15 ? 1 : -10,
      opacity: section3Progress > 0.15 ? 1 : 0,
      transition: 'opacity 2s ease-out'
    }}
  >
    <div className="absolute inset-0 bg-black">
            <img 
              src="./space-bg.jpg" 
              alt="Space Background"
              className="w-full h-full object-cover"
              style={{ filter: 'brightness(0.3)' }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.style.background = 'radial-gradient(ellipse at center, #0a0a1a 0%, #000000 100%)';
              }}
            />
      {/* Animated twinkling stars */}
      <div className="absolute inset-0">
        {[...Array(80)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              opacity: Math.random() * 0.8 + 0.2
            }}
          />
        ))}
      </div>
    </div>
  </div>

   {/* Rocket Cursor */}
        <style>{`
          section:nth-of-type(3) {
            cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='50' viewBox='0 0 40 40'%3E%3Ctext x='8' y='32' font-size='32' transform='rotate(90 20 20)'%3E🚀%3C/text%3E%3C/svg%3E") 20 20, auto !important;
          }
          section:nth-of-type(3) * {
            cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='50' viewBox='0 0 40 40'%3E%3Ctext x='8' y='32' font-size='32' transform='rotate(135 20 20)'%3E🚀%3C/text%3E%3C/svg%3E") 20 20, auto !important;
          }

          @keyframes bigBang {
            0% {
              transform: scale(0);
              opacity: 1;
            }
            50% {
              transform: scale(2.5);
              opacity: 0.6;
            }
            100% {
              transform: scale(4);
              opacity: 0;
            }
          }

          @keyframes rocketTrail {
            0% {
              stroke-dashoffset: 3000;
              opacity: 0;
            }
            50% {
              opacity: 1;
            }
            100% {
              stroke-dashoffset: 0;
              opacity: 0.8;
            }
          }
        `}</style>

  <div className="relative z-10" style={{ minHeight: '400vh' }}>
<div
  className="sticky top-32 text-center mb-32 px-6"
  
>
  <div className="text-xs tracking-[0.3em] text-gray-400 uppercase mb-6">
    (My Universe)
  </div>

  <h3 className="text-4xl md:text-5xl lg:text-6xl font-light text-white">
    Skills <span className="italic font-serif text-purple-400">Journey</span>
  </h3>
</div>


    <div className="max-w-7xl mx-auto px-6">
      {/* Curved Rocket Trail Path */}
      <svg className="absolute left-0 top-0 w-full pointer-events-none" style={{ height: '400vh', zIndex: 5 }}>
        <defs>
          <linearGradient id="rocketGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(96, 165, 250, 0.8)" />
            <stop offset="50%" stopColor="rgba(168, 85, 247, 0.8)" />
            <stop offset="100%" stopColor="rgba(236, 72, 153, 0.8)" />
          </linearGradient>
        </defs>
        
          {/* Curved rocket path - SLOWED DOWN */}
        <path
          d="M 960,100 Q 700,800 800,1600 T 960,3200 Q 1100,4000 800,4800"
          fill="none"
          stroke="url(#rocketGradient)"
          strokeWidth="3"
          strokeDasharray="3000"
          style={{
            strokeDashoffset: 3000 - ((section3Progress + 0.18) * 3000 * 0.67),
            filter: 'drop-shadow(0 0 12px rgba(168, 85, 247, 0.6))',
            transition: 'stroke-dashoffset 0.3s ease-out'
          }}
        />
      </svg>

      {/* Skills with Star Birth */}
      <div className="relative" style={{ minHeight: '350vh' }}>
        {[
          // HIGHER SPACING - More distance between skills
{ skill: 'Web Design', desc: 'Crafting beautiful, responsive interfaces', pos: 10, x: '65%' },
{ skill: 'UI/UX Design', desc: 'User-centered experiences that convert', pos: 25, x: '40%' },
{ skill: 'Animation', desc: 'Bringing designs to life with motion', pos: 40, x: '60%' },
{ skill: 'Branding', desc: 'Creating memorable brand identities', pos: 55, x: '45%' },
{ skill: 'Art Direction', desc: 'Leading creative vision & strategy', pos: 70, x: '50%' },
{ skill: 'Development', desc: 'Building scalable web applications', pos: 85, x: '46%' }
        ].map((item, index) => {
          // Calculate trigger point (when skill should start appearing)
          const triggerPoint = item.pos / 100;
          
          // Distance from trigger
          const distanceFromTrigger = section3Progress - triggerPoint;
          
          // BALANCED: begins at -0.18 (18% before trigger - sweet spot!)
          // Animation completes over 0.32 range
          const animationRange = 0.3;
          const rawProgress = (distanceFromTrigger + 0.18) / animationRange;
          const skillProgress = Math.max(0, Math.min(1, rawProgress));
          
          // Visible when approaching trigger
          const isVisible = distanceFromTrigger >= -0.18;
          
          // Explosion shows when line reaches point
          const shouldShowExplosion = isVisible && rawProgress > 0.5 && rawProgress < 0.7;
          
          const isLeft = index % 2 === 0;

          return (
            <div
              key={`skill-${index}`}
              className="absolute w-full"
              style={{ 
                top: `${item.pos}%`,
                left: 0,
                right: 0
              }}
            >
              {/* Star Birth at exact path position */}
              <div 
                className="absolute"
                style={{ 
                  left: item.x,
                  top: '0',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10
                }}
              >
                {/* Big Bang Explosion */}
                {shouldShowExplosion && (
                  <div 
                    className="absolute"
                    style={{
                      width: '200px',
                      height: '200px',
                      left: '-100px',
                      top: '-100px',
                      animation: 'bigBang 1.2s ease-out forwards',
                      pointerEvents: 'none'
                    }}
                  >
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={`particle-${index}-${i}`}
                        className="absolute w-3 h-3 bg-yellow-300 rounded-full"
                        style={{
                          left: '50%',
                          top: '50%',
                          animation: `particle${i % 8} 1s ease-out forwards`,
                          animationDelay: `${i * 0.05}s`
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Star/Sun Formation - appears right after explosion */}
                {isVisible && skillProgress > 0.55 && (
                  <div 
                    className="relative"
                    style={{
                      width: '100px',
                      height: '100px',
                      opacity: Math.min((skillProgress - 0.55) * 2.2, 1),
                      transform: `scale(${Math.min((skillProgress - 0.55) * 1.6 + 0.2, 1)})`,
                      transition: 'opacity 0.7s ease-out, transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}
                  >
                    {/* Glowing core */}
                    <div 
                      className="absolute inset-0 rounded-full animate-pulse"
                      style={{
                        background: 'radial-gradient(circle, #fef08a 0%, #fb923c 50%, #dc2626 100%)',
                        boxShadow: `
                          0 0 40px rgba(251, 191, 36, 0.8),
                          0 0 80px rgba(251, 146, 60, 0.6),
                          0 0 120px rgba(239, 68, 68, 0.4)
                        `,
                      }}
                    />
                    
                    {/* Rotating rays */}
                    <div className="absolute inset-0 animate-spin-slow">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={`ray-${index}-${i}`}
                          className="absolute top-1/2 left-1/2 w-1 h-16 origin-bottom"
                          style={{
                            background: 'linear-gradient(to top, #fef08a, #fb923c, transparent)',
                            transform: `translate(-50%, -100%) rotate(${i * 45}deg)`,
                            opacity: 0.7
                          }}
                        />
                      ))}
                    </div>

                    {/* Center point */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div 
                        className="w-6 h-6 bg-white rounded-full border-2 border-yellow-200"
                        style={{
                          boxShadow: '0 0 20px rgba(255, 255, 255, 1)'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Skill Card */}
              {isVisible && (
                <div 
                  className={`absolute ${isLeft ? 'right-[58%]' : 'left-[58%]'} max-w-sm`}
                  style={{
                    opacity: Math.min(skillProgress * 1.2, 1),
                    transform: `translateX(${(1 - Math.min(skillProgress * 1.2, 1)) * (isLeft ? 60 : -60)}px) translateY(-50%)`,
                    transition: 'opacity 0.8s ease-out, transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    top: '0',
                    zIndex: 5
                  }}
                >
                  <div 
                    className={`bg-gray-900/90 backdrop-blur-md border border-purple-500/30 rounded-2xl p-6 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-500 ${isLeft ? 'text-right' : 'text-left'}`}
                  >
                    <h4 className="text-2xl md:text-3xl font-light mb-3 text-white">
                      {item.skill}
                    </h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* End Message */}
      <div 
        className="text-center pt-48 pb-32"
        style={{
          opacity: section3Progress > 0.88 ? Math.min((section3Progress - 0.88) * 8, 1) : 0,
          transform: `translateY(${Math.max(0, (1 - Math.min((section3Progress - 0.88) * 8, 1)) * 50)}px)`,
          transition: 'all 0.8s ease-out'
        }}
      >
        <div className="text-5xl mb-6 animate-pulse">✨ 🌟 ✨</div>
        <p className="text-2xl text-purple-300 font-light mb-2">Journey Complete</p>
        <p className="text-lg text-gray-400">Many more galaxies to explore...</p>
      </div>
    </div>
  </div>
</section>

     
      {/* Section 5: Full Width Image with Overlay Text */}
      <section ref={section5Ref} className="min-h-screen relative flex items-center justify-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0"
          style={{
            transform: `scale(${1 + (1 - section5Progress) * 0.1})`,
            opacity: section5Progress
          }}
        >
          <img 
            src="./final-banner.jpg" 
            alt="Final Banner"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.style.background = 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)';
            }}
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Overlay Content */}
        <div 
          className="relative z-10 text-center px-6 max-w-5xl"
          style={{
            opacity: section5Progress,
            transform: `translateY(${(1 - section5Progress) * 50}px)`
          }}
        >
          <div className="text-xs tracking-[0.3em] text-black-500 mb-8 uppercase">
            (Let's Work Together)
          </div>
          
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-light mb-12 leading-tight">
            Ready to create something
            <br />
            <span className="italic">amazing?</span>
          </h2>
          
<button 
  onClick={() => window.location.href = 'mailto:srikrishnanfs@email.com?subject=Project Details'}
  className="px-12 py-5 bg-white text-black hover:bg-gray-200 transition-all duration-500 text-sm tracking-[0.2em] uppercase font-medium"
>
  Get In Touch
</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800/50 py-16 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            <div>
              <h4 className="text-sm tracking-[0.2em] mb-6 text-gray-500 uppercase">Contact</h4>
              <a href="mailto:srikrishnanfs@gmail.com" className="text-lg hover:text-gray-400 transition-colors duration-300 block mb-2">
                srikrishnanfs@gmail.com
              </a>
              <p className="text-gray-600 text-sm">+91 9019 755311</p>
            </div>
            
            <div>
              <h4 className="text-sm tracking-[0.2em] mb-6 text-gray-500 uppercase">Social</h4>
              <div className="space-y-3">
                {['Instagram'].map((social) => (
                  <a 
                    key={social}
                    href="https://www.instagram.com/srikrishna_hireholi/" 
                    className="block text-sm hover:text-gray-400 transition-colors duration-300"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm tracking-[0.2em] mb-6 text-gray-500 uppercase">Location</h4>
              <p className="text-sm text-gray-400">Huballi, Karnataka</p>
              <p className="text-sm text-gray-400">India</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-gray-800/50 text-sm text-gray-600">
            <p>© 2026 All Rights Reserved</p>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-white transition-colors duration-300 tracking-wider uppercase text-xs"
            >
              Back to Top ↑
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;