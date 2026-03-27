import {
  Instagram,
  Send,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  MessageCircle,
  ArrowRight,
  Star,
  Dumbbell,
  Waves
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'motion/react';
import { useState, useEffect, FormEvent, useRef, ReactNode } from 'react';

// --- Style Constants ---
const BTN_BASE = "px-7 py-2.5 text-[12px] uppercase tracking-[0.2em] font-sans font-medium border transition-all duration-500";
const BTN_LIGHT = `${BTN_BASE} border-white/40 text-white hover:bg-white hover:text-ink`;
const BTN_DARK = `${BTN_BASE} border-ink/30 text-ink hover:bg-ink hover:text-white`;
const BTN_GOLD = `${BTN_BASE} border-gold text-gold hover:bg-gold hover:text-white`;
const BTN_SOLID = "px-8 py-3.5 text-[11px] uppercase tracking-[0.25em] font-sans font-semibold bg-gold text-white transition-all duration-500 hover:bg-gold-dark";

// --- Types ---
type Page = 'home' | 'apartments' | 'offers' | 'gallery' | 'contact' | 'admin' | 'five-star' | 'healthy' | 'easy' | 'solo' | 'studio' | 'soho';

interface DBImage {
  id: number;
  url: string;
  category: string;
  alt: string;
  created_at: string;
}

// --- Animation Helpers ---
const FadeInView = ({ children, className = '', delay = 0, direction = 'up' }: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const dirMap = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
    none: { x: 0, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...dirMap[direction] }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const StaggerContainer = ({ children, className = '', staggerDelay = 0.1 }: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const StaggerItem = ({ children, className = '' }: { children: ReactNode; className?: string; key?: any }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } }
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// --- Components ---

const EditableImage = ({
  src,
  alt,
  category,
  className,
  onImageChange,
  children
}: {
  src: string;
  alt: string;
  category: string;
  className?: string;
  onImageChange?: (newUrl: string) => void;
  children?: any;
}) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('category', category);
    formData.append('alt', alt);
    try {
      const res = await fetch('/api/images', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        onImageChange?.(data.url);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`relative group ${className || ''}`}>
      {typeof children === 'function' ? children(src) : children ? children : (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      )}
      <button
        onClick={() => inputRef.current?.click()}
        className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white text-ink p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 disabled:opacity-50"
        disabled={uploading}
        title="Replace image"
      >
        {uploading ? '...' : (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }}
        className="hidden"
      />
    </div>
  );
};

// --- Navbar ---
const Navbar = ({ currentPage, setPage }: { currentPage: Page; setPage: (p: Page) => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const leftNav: { label: string; value: Page }[] = [
    { label: 'Apartments', value: 'apartments' },
    { label: 'Offers', value: 'offers' },
    { label: 'Gallery', value: 'gallery' },
  ];

  const rightNav: { label: string; value: Page }[] = [
    { label: 'Five-Star', value: 'five-star' },
    { label: 'Wellness', value: 'healthy' },
    { label: 'Contact', value: 'contact' },
  ];

  const allNav = [...leftNav, ...rightNav, { label: 'Easy Living', value: 'easy' as Page }];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 w-full z-[60] transition-all duration-700 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.05)] py-3'
            : 'bg-cream py-5 lg:py-6'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex items-center justify-between">
          {/* Left Nav - Desktop */}
          <div className="hidden lg:flex items-center gap-8 flex-1">
            {leftNav.map((item) => (
              <button
                key={item.label}
                onClick={() => setPage(item.value)}
                className={`nav-link text-ink/60 hover:text-ink ${currentPage === item.value ? 'font-medium text-ink' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Logo - Center */}
          <button
            onClick={() => setPage('home')}
            className="flex flex-col items-center gap-0.5 group"
          >
            <div className="flex items-baseline gap-0">
              <span className="text-3xl lg:text-4xl font-serif font-light tracking-tight transition-colors duration-500 text-ink">
                T
              </span>
              <span className="text-3xl lg:text-4xl font-serif font-light tracking-tight transition-colors duration-500 text-ink">
                S
              </span>
            </div>
            <span className="text-[8px] tracking-[0.45em] uppercase font-sans font-semibold transition-colors duration-500 text-ink/50">
              Residence
            </span>
          </button>

          {/* Right Nav - Desktop */}
          <div className="hidden lg:flex items-center gap-8 flex-1 justify-end">
            {rightNav.map((item) => (
              <button
                key={item.label}
                onClick={() => setPage(item.value)}
                className={`nav-link text-ink/60 hover:text-ink ${currentPage === item.value ? 'font-medium text-ink' : ''}`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => setPage('contact')}
              className="px-7 py-2.5 text-[12px] uppercase tracking-[0.2em] font-sans font-medium border transition-all duration-500 ml-4 border-ink/20 text-ink hover:bg-ink hover:text-white"
            >
              Book
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2 transition-colors text-ink"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Full-Screen Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100] bg-cream flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5">
              <button onClick={() => setPage('home')} className="flex flex-col items-center gap-0.5">
                <div className="flex items-baseline">
                  <span className="text-3xl font-serif font-light text-ink">T</span>
                  <span className="text-3xl font-serif font-light text-ink">S</span>
                </div>
                <span className="text-[8px] tracking-[0.45em] uppercase font-sans font-semibold text-ink/60">Residence</span>
              </button>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 text-ink">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-1">
              {allNav.map((item, i) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  onClick={() => { setPage(item.value); setIsMenuOpen(false); }}
                  className="text-3xl md:text-4xl font-serif font-light text-ink hover:text-gold transition-colors py-3"
                >
                  {item.label}
                </motion.button>
              ))}
            </div>

            <div className="px-6 pb-10 flex flex-col items-center gap-6">
              <button
                onClick={() => { setPage('contact'); setIsMenuOpen(false); }}
                className={`${BTN_SOLID} w-full max-w-xs text-center`}
              >
                Book Apartment
              </button>
              <div className="flex gap-6">
                <a href="https://www.instagram.com/tsresidences/" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-gold transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="text-muted hover:text-gold transition-colors">
                  <Send size={20} />
                </a>
                <a href="#" className="text-muted hover:text-gold transition-colors">
                  <Phone size={20} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// --- Footer ---
const Footer = ({ setPage }: { setPage: (p: Page) => void }) => (
  <footer className="bg-dark-bg text-white">
    {/* Main Footer */}
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-20 pb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
        {/* Brand */}
        <div className="lg:col-span-4 space-y-8">
          <div className="flex flex-col items-start gap-0.5">
            <div className="flex items-baseline">
              <span className="text-4xl font-serif font-light text-white">T</span>
              <span className="text-4xl font-serif font-light text-white">S</span>
            </div>
            <span className="text-[8px] tracking-[0.45em] uppercase font-sans font-semibold text-white/50">Residence</span>
          </div>
          <p className="text-white/40 text-sm leading-relaxed max-w-xs">
            A new living concept combining five-star luxury, wellness, and convenience in the heart of Seminyak, Bali.
          </p>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/tsresidences/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all duration-300">
              <Instagram size={16} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all duration-300">
              <Send size={16} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all duration-300">
              <Phone size={16} />
            </a>
          </div>
        </div>

        {/* Stay */}
        <div className="lg:col-span-2">
          <h4 className="text-[11px] uppercase tracking-[0.2em] font-sans font-semibold text-white/60 mb-6">Stay</h4>
          <ul className="space-y-3">
            {[
              { label: 'SOLO Apartment', page: 'solo' as Page },
              { label: 'STUDIO Apartment', page: 'studio' as Page },
              { label: 'SOHO Apartment', page: 'soho' as Page },
              { label: 'Special Offers', page: 'offers' as Page },
            ].map(item => (
              <li key={item.label}>
                <button onClick={() => setPage(item.page)} className="text-white/40 text-sm hover:text-white transition-colors duration-300">
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Experience */}
        <div className="lg:col-span-2">
          <h4 className="text-[11px] uppercase tracking-[0.2em] font-sans font-semibold text-white/60 mb-6">Experience</h4>
          <ul className="space-y-3">
            {[
              { label: 'Five-Star Living', page: 'five-star' as Page },
              { label: 'Wellness Club', page: 'healthy' as Page },
              { label: 'Easy Living', page: 'easy' as Page },
              { label: 'Gallery', page: 'gallery' as Page },
            ].map(item => (
              <li key={item.label}>
                <button onClick={() => setPage(item.page)} className="text-white/40 text-sm hover:text-white transition-colors duration-300">
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="lg:col-span-4">
          <h4 className="text-[11px] uppercase tracking-[0.2em] font-sans font-semibold text-white/60 mb-6">Contact</h4>
          <div className="space-y-4 text-sm text-white/40">
            <p className="flex items-start gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-gold/60" />
              <span>Jl. Nakula No.18, Legian, Seminyak,<br />Kec. Kuta, Kabupaten Badung, Bali 80361</span>
            </p>
            <p className="flex items-center gap-3">
              <Mail size={16} className="shrink-0 text-gold/60" />
              <span>tsresidence@townsquare.co.id</span>
            </p>
            <p className="flex items-center gap-3">
              <Phone size={16} className="shrink-0 text-gold/60" />
              <span>+62 811 1902 8111</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Bottom Bar */}
    <div className="border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap justify-center gap-6 text-[10px] uppercase tracking-[0.15em] text-white/30">
          <span>&copy; {new Date().getFullYear()} TS Residence</span>
          <a href="#" className="hover:text-white/60 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white/60 transition-colors">Terms</a>
        </div>
        <button onClick={() => setPage('admin')} className="text-[10px] uppercase tracking-[0.15em] text-white/10 hover:text-white/40 transition-colors">
          Admin
        </button>
      </div>
    </div>
  </footer>
);

// --- Shared text content for dual-header technique ---
const HeroTextContent = ({
  slides, currentSlide, setPage, isDark
}: {
  slides: { tag: string; title: string; subtitle: string }[];
  currentSlide: number;
  setPage: (p: Page) => void;
  isDark: boolean;
}) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={currentSlide}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="flex flex-col items-center text-center"
    >
      {/* Tag */}
      <motion.span
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className={`text-[12px] sm:text-[13px] md:text-[15px] uppercase tracking-[0.4em] font-sans font-semibold mb-3 md:mb-4 ${
          isDark ? 'text-gold' : 'text-gold/80'
        }`}
      >
        {slides[currentSlide].tag}
      </motion.span>

      {/* Main Title */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`heading-display text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] xl:text-[13rem] leading-[0.85] ${
          isDark ? 'text-ink' : 'text-white'
        }`}
        style={isDark ? {} : { textShadow: '0 4px 60px rgba(0,0,0,0.5), 0 2px 10px rgba(0,0,0,0.3)' }}
      >
        {slides[currentSlide].title}
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className={`text-sm md:text-base lg:text-lg font-sans font-light max-w-lg mt-5 md:mt-7 leading-relaxed tracking-wide px-6 ${
          isDark ? 'text-ink/50' : 'text-white/70'
        }`}
      >
        {slides[currentSlide].subtitle}
      </motion.p>

      {/* CTA Button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        onClick={() => setPage('contact')}
        className={`mt-7 md:mt-9 pointer-events-auto ${isDark ? BTN_DARK : BTN_LIGHT}`}
      >
        Book Your Stay
      </motion.button>
    </motion.div>
  </AnimatePresence>
);

// --- Hero Section (Berkeley Double-Header Masking) ---
const HeroSection = ({ setPage, heroImage, setHeroImage }: {
  setPage: (p: Page) => void;
  heroImage: string;
  setHeroImage: (url: string) => void;
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });

  // Scroll-driven animations
  const textY = useTransform(scrollYProgress, [0, 0.25, 0.55], [0, 0, -150]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.35, 0.55], [1, 1, 0]);
  const textScale = useTransform(scrollYProgress, [0, 0.3, 0.55], [1, 1, 0.9]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.2, 0.5], [0.15, 0.35, 0.6]);

  // Image container top: starts at 38% (below cream), slides up to 0 on scroll
  const imageTop = useTransform(scrollYProgress, [0, 0.25], ['38%', '0%']);
  // Negative offset for white text inside image container to align with dark text
  const whiteTextOffset = useTransform(scrollYProgress, [0, 0.25], ['-38vh', '0vh']);

  const slides = [
    {
      tag: "Welcome To",
      title: "TS Residence",
      subtitle: "Five-star living in the heart of Seminyak",
    },
    {
      tag: "Experience",
      title: "Healthy Living",
      subtitle: "Wellness, recovery, and mindful living — all under one roof",
    },
    {
      tag: "Discover",
      title: "Easy Living",
      subtitle: "Monthly apartments with zero stress, minutes from the beach",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // The text position from top — must be identical for both layers
  const textTopClass = "mt-[22vh] sm:mt-[24vh] md:mt-[26vh]";

  return (
    <div ref={heroRef} className="relative h-[200vh]">
      {/* Sticky container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* LAYER 1: Cream background + Dark text (bottom layer) */}
        <div className="absolute inset-0 bg-cream z-10">
          {/* Dark text - always visible on cream */}
          <motion.div
            style={{ y: textY, opacity: textOpacity, scale: textScale }}
            className="absolute inset-0 flex flex-col items-center pointer-events-none"
          >
            <div className={`pointer-events-auto ${textTopClass}`}>
              <HeroTextContent slides={slides} currentSlide={currentSlide} setPage={setPage} isDark={true} />
            </div>
          </motion.div>
        </div>

        {/* LAYER 2: Image container + White text (top layer, clips to reveal) */}
        <motion.div
          style={{ top: imageTop }}
          className="absolute left-0 right-0 bottom-0 z-20 overflow-hidden"
        >
          {/* Background Image — must fill entire screen height, not just container */}
          <motion.div
            style={{ scale: imageScale }}
            className="absolute left-0 right-0 w-full h-screen"
          >
            <EditableImage
              src={heroImage}
              alt="TS Residence"
              category="hero"
              className="w-full h-full"
              onImageChange={setHeroImage}
            />
            {/* Gradient overlay */}
            <motion.div
              style={{ opacity: overlayOpacity }}
              className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/20"
            />
          </motion.div>

          {/* White text — offset by negative imageTop to align with Layer 1.
              As container moves from top:38% → 0%, text offset moves from -38vh → 0vh,
              keeping it at the exact same absolute screen position as the dark text. */}
          <motion.div
            style={{ y: textY, opacity: textOpacity, scale: textScale }}
            className="absolute left-0 right-0 flex flex-col items-center pointer-events-none"
          >
            <motion.div
              style={{ marginTop: whiteTextOffset }}
              className="w-full h-screen flex flex-col items-center"
            >
              <div className={`pointer-events-auto ${textTopClass}`}>
                <HeroTextContent slides={slides} currentSlide={currentSlide} setPage={setPage} isDark={false} />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`transition-all duration-700 rounded-full ${
                i === currentSlide
                  ? 'w-8 h-1.5 bg-gold'
                  : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          style={{ opacity: textOpacity }}
          className="absolute bottom-8 right-8 hidden md:flex flex-col items-center gap-2 z-30"
        >
          <span className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-sans [writing-mode:vertical-lr]">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent"
          />
        </motion.div>
      </div>
    </div>
  );
};

// --- HomePage ---
const HomePage = ({ setPage }: { setPage: (p: Page) => void }) => {
  const [heroImage, setHeroImage] = useState<string>('https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1920&q=80');
  const [apartmentImages, setApartmentImages] = useState<DBImage[]>([]);
  const [generalImages, setGeneralImages] = useState<DBImage[]>([]);

  const getAptImg = (index: number, fallback: string) => apartmentImages[index]?.url || fallback;
  const getGenImg = (index: number, fallback: string) => generalImages[index]?.url || fallback;

  const updateApartmentImage = (index: number, url: string) => {
    setApartmentImages(prev => {
      const next = [...prev];
      next[index] = {
        id: next[index]?.id ?? Date.now() + index,
        url,
        category: apartments[index].page,
        alt: apartments[index].name + ' Apartment',
        created_at: next[index]?.created_at || new Date().toISOString(),
      };
      return next;
    });
  };

  const apartments = [
    { name: "SOLO", sqm: "36", bed: "1 Bedroom", desc: "Compact luxury for solo explorers", img: getAptImg(0, "https://picsum.photos/seed/solo-apt/1920/1080"), page: 'solo' as Page },
    { name: "STUDIO", sqm: "48", bed: "1 Bedroom", desc: "Spacious elegance for couples", img: getAptImg(1, "https://picsum.photos/seed/studio-apt/1920/1080"), page: 'studio' as Page },
    { name: "SOHO", sqm: "80", bed: "2 Bedrooms", desc: "Ultimate space for families", img: getAptImg(2, "https://picsum.photos/seed/soho-apt/1920/1080"), page: 'soho' as Page },
  ];

  useEffect(() => {
    fetch('/api/images?category=hero').then(r => r.json()).then(d => { if (d?.[0]) setHeroImage(d[0].url); });
    (async () => {
      const types = ['solo', 'studio', 'soho'];
      const results = await Promise.all(types.map(t => fetch(`/api/images?category=${t}`).then(r => r.json())));
      setApartmentImages(results.map((d, i) => d[0] || { id: -1, url: `https://picsum.photos/seed/${types[i]}-apt/1920/1080`, category: types[i], alt: `${types[i].toUpperCase()} Apartment`, created_at: new Date().toISOString() }));
    })();
    fetch('/api/images?category=general').then(r => r.json()).then(d => setGeneralImages(d));
  }, []);

  return (
    <div className="w-full">
      {/* Hero */}
      <HeroSection setPage={setPage} heroImage={heroImage} setHeroImage={setHeroImage} />

      {/* Introduction Section */}
      <section className="section-pad bg-cream">
        <div className="max-w-4xl mx-auto text-center">
          <FadeInView>
            <span className="label-caps text-gold">Seminyak, Bali</span>
          </FadeInView>
          <FadeInView delay={0.15}>
            <h2 className="heading-section text-ink mt-6 mb-8">
              A new concept of living that combines five-star luxury, wellness, and everyday convenience
            </h2>
          </FadeInView>
          <FadeInView delay={0.3}>
            <p className="text-body max-w-2xl mx-auto">
              TS Residence by TS Suites offers premium apartments designed for monthly rentals, creating a hassle-free long-stay experience in Bali's most sought-after neighborhood.
            </p>
          </FadeInView>
          <FadeInView delay={0.4}>
            <div className="mt-10">
              <button onClick={() => setPage('contact')} className={BTN_GOLD}>
                Explore More
              </button>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* Three Pillars - Featured Cards */}
      <section className="section-pad bg-white">
        <div className="max-w-[1400px] mx-auto">
          <FadeInView className="text-center mb-16">
            <span className="label-caps text-gold">Our Philosophy</span>
            <h2 className="heading-section text-ink mt-4">Three Pillars of Living</h2>
          </FadeInView>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8" staggerDelay={0.15}>
            {[
              {
                title: "Five-Star Living",
                desc: "Full privileges of a luxury hotel — coworking, dining, salon, and retail — all at your doorstep.",
                page: 'five-star' as Page,
                img: "https://picsum.photos/seed/fivestar-card/800/1000",
                icon: <Star size={20} />,
              },
              {
                title: "Healthy Living",
                desc: "Daily yoga, reformer Pilates, sauna, cold bath, and IV therapy — designed for your best self.",
                page: 'healthy' as Page,
                img: "https://picsum.photos/seed/healthy-card/800/1000",
                icon: <Dumbbell size={20} />,
              },
              {
                title: "Easy Living",
                desc: "Walking distance to Seminyak Beach, flexible monthly leases, and personalized concierge service.",
                page: 'easy' as Page,
                img: "https://picsum.photos/seed/easy-card/800/1000",
                icon: <Waves size={20} />,
              },
            ].map((pillar, i) => (
              <StaggerItem key={i}>
                <button
                  onClick={() => setPage(pillar.page)}
                  className="group w-full text-left"
                >
                  <div className="relative aspect-[3/4] overflow-hidden mb-6">
                    <img
                      src={pillar.img}
                      alt={pillar.title}
                      className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <span className="text-white text-[12px] uppercase tracking-[0.2em] font-sans flex items-center gap-2">
                        Discover <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-gold">{pillar.icon}</span>
                    <h3 className="text-xl font-serif text-ink">{pillar.title}</h3>
                  </div>
                  <p className="text-body">{pillar.desc}</p>
                </button>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Featured Split Section */}
      <section className="bg-cream-dark">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
          {/* Image Side */}
          <FadeInView direction="left" className="relative min-h-[50vh] lg:min-h-full">
            <EditableImage
              src={getGenImg(0, "https://picsum.photos/seed/seminyak-pool/1200/1400")}
              alt="TS Residence Pool"
              category="general"
              className="absolute inset-0 w-full h-full"
              onImageChange={() => {}}
            />
          </FadeInView>

          {/* Text Side */}
          <div className="flex items-center px-8 md:px-16 lg:px-20 py-20 lg:py-0">
            <div className="max-w-lg">
              <FadeInView direction="right">
                <span className="label-caps text-gold">Why Seminyak</span>
                <h2 className="heading-section text-ink mt-4 mb-8">
                  Live where every day feels extraordinary
                </h2>
              </FadeInView>
              <FadeInView direction="right" delay={0.2}>
                <div className="space-y-6">
                  {[
                    "Strategically located with fast access to everything",
                    "Safe, expat-friendly, and walkable neighborhood",
                    "Vibrant culture, wellness, dining, and digital-friendly cafes",
                    "Well-developed infrastructure — hospital, co-working, retail",
                    "Breathtaking beaches at your doorstep",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 group">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0 group-hover:scale-150 transition-transform" />
                      <p className="text-body group-hover:text-ink transition-colors">{item}</p>
                    </div>
                  ))}
                </div>
              </FadeInView>
              <FadeInView direction="right" delay={0.4}>
                <button onClick={() => setPage('contact')} className={`${BTN_SOLID} mt-10`}>
                  Book Apartment
                </button>
              </FadeInView>
            </div>
          </div>
        </div>
      </section>

      {/* Apartments Showcase */}
      <section className="section-pad bg-white">
        <div className="max-w-[1400px] mx-auto">
          <FadeInView className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <span className="label-caps text-gold">Suites & Apartments</span>
              <h2 className="heading-section text-ink mt-4">Find Your Perfect Space</h2>
            </div>
            <button onClick={() => setPage('apartments')} className={`${BTN_GOLD} self-start md:self-auto`}>
              View All <ArrowRight size={14} className="inline ml-2" />
            </button>
          </FadeInView>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8" staggerDelay={0.15}>
            {apartments.map((apt, i) => (
              <StaggerItem key={i}>
                <button
                  onClick={() => setPage(apt.page)}
                  className="group w-full text-left"
                >
                  <div className="relative aspect-[4/5] overflow-hidden mb-6">
                    <EditableImage
                      src={apt.img}
                      alt={apt.name}
                      category={apt.page}
                      className="w-full h-full"
                      onImageChange={(url) => updateApartmentImage(i, url)}
                    >
                      {(src: string) => (
                        <img
                          src={src}
                          alt={apt.name}
                          className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </EditableImage>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span className="text-white/60 text-[11px] uppercase tracking-[0.2em] font-sans">{apt.sqm} sqm &middot; {apt.bed}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-serif text-ink group-hover:text-gold transition-colors">{apt.name}</h3>
                      <p className="text-muted text-sm mt-1">{apt.desc}</p>
                    </div>
                    <ArrowRight size={18} className="text-muted group-hover:text-gold group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                </button>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Offers Preview */}
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        <img
          src="https://picsum.photos/seed/offer-hero/1920/1080"
          alt="Special Offers"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <FadeInView>
            <span className="label-caps text-gold-light mb-6 block">Limited Time</span>
            <h2 className="text-white heading-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl max-w-3xl mx-auto">
              Special Opening Celebration
            </h2>
            <p className="text-white/60 text-base md:text-lg font-sans font-light mt-6 max-w-xl mx-auto">
              Stay 3 months, pay for 2. Available across all apartment categories.
            </p>
            <button
              onClick={() => setPage('offers')}
              className={`${BTN_LIGHT} mt-10`}
            >
              View All Offers
            </button>
          </FadeInView>
        </div>
      </section>

      {/* Target Audience / CTA */}
      <section className="section-pad bg-cream">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <FadeInView direction="left">
            <div className="aspect-[4/5] overflow-hidden">
              <EditableImage
                src={getGenImg(1, "https://picsum.photos/seed/young-family/800/1000")}
                alt="Life at TS Residence"
                category="general"
                className="w-full h-full"
                onImageChange={() => {}}
              >
                {(src: string) => (
                  <img
                    src={src}
                    alt="Life at TS Residence"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                )}
              </EditableImage>
            </div>
          </FadeInView>

          <FadeInView direction="right">
            <span className="label-caps text-gold">Your Home in Bali</span>
            <h2 className="heading-section text-ink mt-4 mb-6">
              TS Residence is for people like you
            </h2>
            <p className="text-body mb-4">
              Whether you're a digital nomad seeking inspiration, a couple embracing island life, or a family looking for a safe, connected, and complete environment — TS Residence is ready to welcome you home.
            </p>
            <div className="space-y-3 mb-10">
              {["Digital nomads & remote workers", "Couples & young professionals", "Families with children", "Long-stay business travelers"].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-gold" />
                  <span className="text-sm text-muted">{item}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setPage('contact')} className={BTN_SOLID}>
              Book Apartment
            </button>
          </FadeInView>
        </div>
      </section>
    </div>
  );
};

// --- Gallery Page ---
const GalleryPage = () => {
  const [images, setImages] = useState<DBImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/images').then(r => r.json()).then(d => setImages(d)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const categories = [
    { name: 'TS Residence', handle: '@tsresidences', filter: 'residence', avatar: 'https://picsum.photos/seed/avatar1/100/100' },
    { name: 'Apartments', handle: '@tsresidences', filter: 'apartments', avatar: 'https://picsum.photos/seed/avatar2/100/100' },
    { name: 'Facilities', handle: '@tssuitesseminyak', filter: 'five-star', avatar: 'https://picsum.photos/seed/avatar3/100/100' },
    { name: 'No.1 Wellness Club', handle: '@nolwellnessclub', filter: 'healthy', avatar: 'https://picsum.photos/seed/avatar4/100/100' },
  ];

  return (
    <div className="pt-32 pb-40 px-6 md:px-10 max-w-[1400px] mx-auto">
      <FadeInView className="mb-20">
        <span className="label-caps text-gold">Visual Journey</span>
        <h1 className="heading-display text-5xl md:text-6xl lg:text-7xl text-ink mt-4">Gallery</h1>
      </FadeInView>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-20" staggerDelay={0.15}>
        {categories.map((cat) => {
          const catImages = images.filter(img => img.category === cat.filter);
          const displayImg = catImages[0]?.url || `https://picsum.photos/seed/${cat.filter}/1200/800`;

          return (
            <StaggerItem key={cat.name}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-11 h-11 rounded-full overflow-hidden border border-border">
                  <img src={cat.avatar} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-sm font-sans font-semibold text-ink">{cat.name}</h4>
                  <p className="text-xs text-muted">{cat.handle}</p>
                </div>
              </div>
              <div className="img-zoom aspect-[16/10] cursor-pointer relative">
                <EditableImage
                  src={displayImg}
                  alt={cat.name}
                  category={cat.filter}
                  className="w-full h-full"
                  onImageChange={() => {
                    fetch('/api/images').then(r => r.json()).then(d => setImages(d)).catch(console.error);
                  }}
                >
                  {(src: string) => (
                    <img src={src} alt={cat.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  )}
                </EditableImage>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </div>
  );
};

// --- Offers Page ---
const OffersPage = () => {
  const [images, setImages] = useState<DBImage[]>([]);

  useEffect(() => {
    fetch('/api/images?category=offers').then(r => r.json()).then(d => setImages(d)).catch(console.error);
  }, []);

  const defaultOffers = [
    { title: 'Opening Celebration', desc: 'Stay 3 months, pay 2 months on all apartment categories.', img: 'https://picsum.photos/seed/offer1-ts/1920/800' },
    { title: 'Easy Pay', desc: 'Stay more than 3 months — 20% upfront, rest paid monthly to keep your cash flow.', img: 'https://picsum.photos/seed/offer2-ts/1920/800' },
    { title: 'Resident Dining', desc: '15% discount at TS Suites for all F&B and retail services.', img: 'https://picsum.photos/seed/offer3-ts/1920/800' },
    { title: 'Wellness Discount', desc: '15% discount at No.1 Wellness Club on massage, wellness, and F&B.', img: 'https://picsum.photos/seed/offer4-ts/1920/800' },
  ];

  const displayOffers = images.length > 0
    ? images.map((img, i) => ({ title: img.alt || defaultOffers[i]?.title || `Offer ${i + 1}`, desc: defaultOffers[i]?.desc || '', img: img.url }))
    : defaultOffers;

  return (
    <div className="pt-32 pb-0">
      <div className="px-6 md:px-10 mb-20 max-w-[1400px] mx-auto">
        <FadeInView>
          <span className="label-caps text-gold">Exclusive Deals</span>
          <h1 className="heading-display text-5xl md:text-6xl lg:text-7xl text-ink mt-4">Special Offers</h1>
        </FadeInView>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pb-20">
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8" staggerDelay={0.15}>
          {displayOffers.map((offer, i) => (
            <StaggerItem key={i}>
              <div className="group cursor-pointer">
                <div className="relative aspect-[16/10] overflow-hidden mb-6">
                  <EditableImage
                    src={offer.img}
                    alt={offer.title}
                    category="offers"
                    className="w-full h-full"
                    onImageChange={() => {
                      fetch('/api/images?category=offers').then(r => r.json()).then(d => setImages(d)).catch(console.error);
                    }}
                  >
                    {(src: string) => (
                      <img src={src} alt={offer.title} className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" referrerPolicy="no-referrer" />
                    )}
                  </EditableImage>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="label-caps text-gold-light">Special Offer</span>
                  </div>
                </div>
                <h3 className="text-2xl font-serif text-ink group-hover:text-gold transition-colors mb-2">{offer.title}</h3>
                <p className="text-body">{offer.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </div>
  );
};

// --- Apartment Gallery Lightbox ---
const ApartmentGallery = ({ type, images, onClose }: { type: string; images: string[]; onClose: () => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-dark-bg flex flex-col"
    >
      <div className="flex items-center justify-between px-6 py-4">
        <span className="text-white/60 text-sm font-serif">{type}</span>
        <button onClick={onClose} className="text-white/60 hover:text-white p-2 transition-colors">
          <X size={24} />
        </button>
      </div>

      <div className="flex-grow relative flex items-center justify-center px-4 md:px-20">
        <button onClick={() => setCurrentIndex((p) => (p - 1 + images.length) % images.length)} className="absolute left-4 md:left-8 z-10 text-white/40 hover:text-white p-3 transition-colors">
          <ChevronLeft size={36} />
        </button>
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`${type} ${currentIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-full max-h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
        <button onClick={() => setCurrentIndex((p) => (p + 1) % images.length)} className="absolute right-4 md:right-8 z-10 text-white/40 hover:text-white p-3 transition-colors">
          <ChevronRight size={36} />
        </button>
      </div>

      <div className="py-6 flex items-center justify-center gap-2">
        {images.map((_, i) => (
          <button key={i} onClick={() => setCurrentIndex(i)} className={`transition-all duration-300 rounded-full ${i === currentIndex ? 'w-6 h-1.5 bg-gold' : 'w-1.5 h-1.5 bg-white/20'}`} />
        ))}
      </div>
    </motion.div>
  );
};

// --- Five Star Page ---
const FiveStarPage = () => {
  const [heroImage, setHeroImage] = useState('https://picsum.photos/seed/ts-fivestar/1920/1080');
  const [facilityImages, setFacilityImages] = useState([
    'https://picsum.photos/seed/pool2/800/600',
    'https://picsum.photos/seed/gym2/800/600',
    'https://picsum.photos/seed/bar2/800/600',
    'https://picsum.photos/seed/shop2/800/600',
  ]);

  useEffect(() => {
    fetch('/api/images?category=five-star').then(r => r.json()).then(d => {
      if (d?.length) {
        setHeroImage(d[0].url || heroImage);
        setFacilityImages(prev => prev.map((img, i) => d[i + 1]?.url || img));
      }
    }).catch(console.error);
  }, []);

  const facilities = [
    { title: 'TS Suites Coworking Space' },
    { title: 'TSTORE' },
    { title: 'Christophe C Salon' },
    { title: 'TS Suites Bar' },
  ];

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative h-[85vh] flex items-center justify-center">
        <EditableImage src={heroImage} alt="Five Star Living" category="five-star" className="absolute inset-0 w-full h-full" onImageChange={setHeroImage}>
          {(src: string) => <img src={src} alt="Five Star Living" className="absolute inset-0 w-full h-full object-cover" />}
        </EditableImage>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />
        <div className="relative text-center px-6 z-10">
          <FadeInView>
            <span className="label-caps text-gold-light mb-6 block">Luxury Redefined</span>
            <h1 className="text-white heading-display text-5xl md:text-7xl lg:text-8xl max-w-4xl mx-auto">
              Five-Star Living, Every Day
            </h1>
          </FadeInView>
        </div>
      </section>

      {/* Intro */}
      <section className="section-pad bg-cream">
        <div className="max-w-3xl mx-auto text-center">
          <FadeInView>
            <div className="w-px h-20 bg-gold/30 mx-auto mb-10" />
            <h2 className="text-2xl md:text-3xl font-serif text-ink leading-relaxed">
              At TS Residence, you don't just live — you live with the full privileges of a five-star hotel. Enjoy exclusive access to TS Suites facilities designed for residents who expect more.
            </h2>
          </FadeInView>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="section-pad bg-white">
        <div className="max-w-[1400px] mx-auto">
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8" staggerDelay={0.1}>
            {facilities.map((item, idx) => (
              <StaggerItem key={idx}>
                <div className="img-zoom aspect-[4/3] mb-4 cursor-pointer">
                  <EditableImage
                    src={facilityImages[idx]}
                    alt={item.title}
                    category="five-star"
                    className="w-full h-full"
                    onImageChange={(url) => setFacilityImages(prev => { const n = [...prev]; n[idx] = url; return n; })}
                  >
                    {(src: string) => <img src={src} alt={item.title} className="w-full h-full object-cover" />}
                  </EditableImage>
                </div>
                <h4 className="label-caps text-ink">{item.title}</h4>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
};

// --- Healthy Living Page ---
const HealthyLivingPage = () => {
  const [heroImage, setHeroImage] = useState('https://picsum.photos/seed/healthy/1000/1200');

  useEffect(() => {
    fetch('/api/images?category=healthy').then(r => r.json()).then(d => {
      if (d?.[0]) setHeroImage(d[0].url);
    }).catch(console.error);
  }, []);

  return (
    <div className="pt-32 pb-20">
      <section className="px-6 md:px-10 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <FadeInView direction="left">
            <div className="space-y-10">
              <div>
                <span className="label-caps text-gold">Wellness & Recovery</span>
                <h1 className="heading-display text-5xl md:text-6xl lg:text-7xl text-ink mt-4">Healthy Living</h1>
              </div>
              <p className="text-body max-w-lg">
                TS Residence combines five-star luxury with holistic wellness in Seminyak's premier location.
              </p>
              <div>
                <h2 className="text-2xl md:text-3xl font-serif text-ink mb-3">No.1 Wellness Club</h2>
                <p className="text-sm font-serif text-gold italic mb-4">You are our number one. Your well-being is our number one.</p>
                <p className="text-body max-w-lg">
                  A space for rejuvenation, recovery, and mindful activity. Where the body regains its strength, the mind finds calm, and your energy returns to its natural state.
                </p>
              </div>
            </div>
          </FadeInView>
          <FadeInView direction="right">
            <div className="aspect-[4/5] overflow-hidden">
              <EditableImage src={heroImage} alt="No.1 Wellness Club" category="healthy" className="w-full h-full" onImageChange={setHeroImage} />
            </div>
          </FadeInView>
        </div>
      </section>
    </div>
  );
};

// --- Easy Living Page ---
const EasyLivingPage = () => (
  <div className="pt-32 pb-20">
    <section className="px-6 md:px-10 max-w-[1400px] mx-auto text-center">
      <FadeInView>
        <span className="label-caps text-gold">Convenience & Freedom</span>
        <h1 className="heading-display text-5xl md:text-6xl lg:text-7xl text-ink mt-4 mb-6">Easy Living</h1>
        <p className="text-body max-w-2xl mx-auto mb-6">
          Apartments designed for monthly rentals, for your hassle-free long-stay in Bali.
        </p>
      </FadeInView>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 mt-20 max-w-5xl mx-auto" staggerDelay={0.15}>
        {[
          { title: "Location", desc: "Walking distance to Seminyak Beach and Sunset Road. The best of Bali at your doorstep." },
          { title: "Convenience", desc: "Flexible monthly leases and personalized concierge to handle your daily needs stress-free." },
          { title: "Security", desc: "24/7 professional security team and secure residential access for total peace of mind." },
        ].map((item, i) => (
          <StaggerItem key={i}>
            <div className="text-center space-y-4">
              <span className="text-4xl font-serif text-gold">0{i + 1}</span>
              <h4 className="text-xl font-serif text-ink">{item.title}</h4>
              <p className="text-body">{item.desc}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <FadeInView className="mt-24">
        <div className="aspect-[21/9] overflow-hidden max-w-[1200px] mx-auto">
          <img
            src="https://picsum.photos/seed/seminyak-location/1920/800"
            alt="Seminyak Location"
            className="w-full h-full object-cover"
          />
        </div>
      </FadeInView>
    </section>
  </div>
);

// --- Admin Page ---
const AdminPage = () => {
  const [images, setImages] = useState<DBImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState('general');
  const [alt, setAlt] = useState('');
  const [editingImage, setEditingImage] = useState<DBImage | null>(null);

  const fetchImages = async () => {
    const res = await fetch('/api/images');
    setImages(await res.json());
  };

  useEffect(() => { fetchImages(); }, []);

  const resetForm = () => { setSelectedFile(null); setCategory('general'); setAlt(''); setEditingImage(null); };

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    setUploading(true);
    const formData = new FormData();
    if (selectedFile) formData.append('image', selectedFile);
    formData.append('category', category);
    formData.append('alt', alt);
    try {
      const url = editingImage ? `/api/images/${editingImage.id}` : '/api/images';
      const res = await fetch(url, { method: editingImage ? 'PUT' : 'POST', body: formData });
      if (res.ok) { resetForm(); fetchImages(); }
    } catch (err) { console.error('Upload failed:', err); }
    finally { setUploading(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this image?')) return;
    try { const res = await fetch(`/api/images/${id}`, { method: 'DELETE' }); if (res.ok) fetchImages(); }
    catch (err) { console.error('Delete failed:', err); }
  };

  return (
    <div className="pt-32 pb-20 px-6 md:px-10 max-w-[1400px] mx-auto">
      <h1 className="heading-display text-4xl text-ink mb-10">Image Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 bg-white p-8 border border-border h-fit">
          <h2 className="text-lg font-semibold mb-6">{editingImage ? 'Edit Image' : 'Upload New Image'}</h2>
          {editingImage && (
            <div className="mb-4 aspect-video overflow-hidden border border-border">
              <img src={editingImage.url} alt={editingImage.alt} className="w-full h-full object-cover" />
            </div>
          )}
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="space-y-2">
              <label className="label-caps">File {editingImage && '(optional)'}</label>
              <input type="file" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} className="w-full text-sm" accept="image/*" />
            </div>
            <div className="space-y-2">
              <label className="label-caps">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border-b border-border py-2 outline-none focus:border-gold bg-transparent">
                <option value="hero">Hero Section</option>
                <option value="residence">Gallery: TS Residence</option>
                <option value="suites">Gallery: TS Suites</option>
                <option value="social">Gallery: TS Social Club</option>
                <option value="wellness">Gallery: No.1 Wellness Club</option>
                <option value="offers">Offers</option>
                <option value="solo">Apartment: SOLO</option>
                <option value="studio">Apartment: STUDIO</option>
                <option value="soho">Apartment: SOHO</option>
                <option value="apartments">Apartments (Other)</option>
                <option value="general">General</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="label-caps">Alt Text / Title</label>
              <input type="text" value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Describe the image" className="w-full border-b border-border py-2 outline-none focus:border-gold bg-transparent text-sm" />
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={uploading || (!selectedFile && !editingImage)} className={`${BTN_SOLID} flex-1 disabled:opacity-50`}>
                {uploading ? 'Saving...' : (editingImage ? 'Update' : 'Upload')}
              </button>
              {editingImage && (
                <button type="button" onClick={resetForm} className="px-4 py-3 border border-border text-sm hover:bg-cream transition-colors">Cancel</button>
              )}
            </div>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-semibold">Stored Images ({images.length})</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img) => (
              <div
                key={img.id}
                onClick={() => { setEditingImage(img); setCategory(img.category); setAlt(img.alt); setSelectedFile(null); }}
                className="group relative aspect-square overflow-hidden border border-border bg-cream cursor-pointer hover:ring-2 hover:ring-gold transition-all"
              >
                <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                  <p className="text-white label-caps mb-1">{img.category}</p>
                  <p className="text-white/60 text-[9px] mb-3">Click to edit</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(img.id); }}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Contact Page ---
const ContactPage = () => {
  const [hallwayImage, setHallwayImage] = useState('https://picsum.photos/seed/ts-hallway/1200/1200');

  useEffect(() => {
    fetch('/api/images?category=contact').then(r => r.json()).then(d => {
      if (d?.[0]) setHallwayImage(d[0].url);
    }).catch(console.error);
  }, []);

  return (
    <div className="pt-32 pb-20 px-6 md:px-10 max-w-[1400px] mx-auto">
      <FadeInView className="mb-20">
        <span className="label-caps text-gold">Get in Touch</span>
        <h1 className="heading-display text-5xl md:text-6xl lg:text-7xl text-ink mt-4 mb-16">
          Let's talk about your long-stay
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-3">
            <p className="label-caps">Phone / WhatsApp</p>
            <p className="text-xl md:text-2xl font-serif text-ink">+62 811 1902 8111</p>
            <p className="label-caps pt-4">Telegram</p>
            <p className="text-xl md:text-2xl font-serif text-ink">+62 811 1902 8111</p>
          </div>
          <div className="space-y-3">
            <p className="label-caps">Email</p>
            <p className="text-xl md:text-2xl font-serif text-ink">tsresidence@townsquare.co.id</p>
          </div>
          <div className="space-y-3">
            <p className="label-caps">Address</p>
            <p className="text-xl md:text-2xl font-serif text-ink leading-relaxed">Jl. Nakula No.18, Legian, Seminyak, Bali</p>
          </div>
        </div>
      </FadeInView>

      {/* Form */}
      <FadeInView className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start bg-white p-8 md:p-14 lg:p-20 mb-24">
        <div className="lg:col-span-5 h-full">
          <div className="aspect-[4/5] md:aspect-square lg:aspect-auto lg:h-full min-h-[400px] overflow-hidden">
            <EditableImage src={hallwayImage} alt="TS Residence" category="contact" className="w-full h-full" onImageChange={setHallwayImage}>
              {(src: string) => <img src={src} alt="TS Residence" className="w-full h-full object-cover" />}
            </EditableImage>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif text-ink mb-3">Looking for a long-term stay?</h2>
            <p className="text-body">Tell us what you're looking for — our team will get back to you with personalized recommendations.</p>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            {[
              { label: 'First Name', type: 'text', placeholder: 'First Name' },
              { label: 'Last Name', type: 'text', placeholder: 'Last Name' },
              { label: 'Email', type: 'email', placeholder: 'Email address' },
              { label: 'Phone (optional)', type: 'text', placeholder: 'Phone number' },
            ].map((field) => (
              <div key={field.label} className="space-y-2">
                <label className="label-caps text-ink">{field.label}</label>
                <input type={field.type} placeholder={field.placeholder} className="w-full border-b border-border py-3 focus:border-gold outline-none transition-colors bg-transparent text-sm placeholder:text-muted/40" />
              </div>
            ))}
            <div className="md:col-span-2 space-y-2">
              <label className="label-caps text-ink">Stay Duration</label>
              <select className="w-full border-b border-border py-3 focus:border-gold outline-none transition-colors bg-transparent text-sm appearance-none">
                <option>Monthly</option>
                <option>Quarterly</option>
                <option>Yearly</option>
              </select>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="label-caps text-ink">Message (optional)</label>
              <textarea placeholder="Type your message here..." rows={4} className="w-full border-b border-border py-3 focus:border-gold outline-none transition-colors resize-none bg-transparent text-sm placeholder:text-muted/40" />
            </div>
            <div className="md:col-span-2 pt-4">
              <button type="button" className={BTN_SOLID}>Send Inquiry</button>
            </div>
          </form>
        </div>
      </FadeInView>

      {/* Terms */}
      <div className="pt-20 border-t border-border">
        <h2 className="text-2xl md:text-3xl font-serif text-ink mb-14">Terms & Conditions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 text-[12px] text-muted leading-relaxed">
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h4 className="label-caps text-ink mb-4">Terms of Payment</h4>
              <ol className="list-decimal pl-4 space-y-3">
                <li>Rental cost paid monthly in advance, by latest on 25th day of the current month.</li>
                <li>Refundable Security Deposit of 1 month rental cost, paid before Lease Commencement Date.</li>
                <li>All costs are applicable to tax and service charge.</li>
              </ol>
            </div>
            <div>
              <h4 className="label-caps text-ink mb-4">Additional Cost</h4>
              <ol className="list-decimal pl-4 space-y-2"><li>Electricity</li></ol>
            </div>
          </div>
          <div>
            <h4 className="label-caps text-ink mb-4">Included in Rental</h4>
            <ol className="list-decimal pl-4 space-y-3">
              <li>All units fully furnished</li>
              <li>Access to Pool, Gym, Restaurant, Business Center at TS Suites</li>
              <li>Parking spot for 1 vehicle</li>
              <li>Maintenance periodically</li>
              <li>Internet, TV, Water, Concierge</li>
            </ol>
          </div>
          <div>
            <h4 className="label-caps text-ink mb-4">Optional Services</h4>
            <ol className="list-decimal pl-4 space-y-3">
              <li>Laundry</li>
              <li>Housekeeping</li>
              <li>Breakfast</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Apartment Detail Page ---
const ApartmentPage = ({ type, setPage }: { type: 'solo' | 'studio' | 'soho'; setPage: (p: Page) => void }) => {
  const [heroImage, setHeroImage] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const content = {
    solo: {
      title: "SOLO",
      subtitle: "1 Bedroom Apartment",
      sqm: "36 sqm",
      bed: "1 bedroom",
      desc: "A compact yet premium living space designed for solo explorers or business travelers. Experience the perfect blend of luxury and efficiency in the heart of Seminyak.",
      features: ["Rain Shower", "Smart TV", "Designer Kitchen", "Private Balcony", "High-speed Wi-Fi"],
    },
    studio: {
      title: "STUDIO",
      subtitle: "1 Bedroom Apartment",
      sqm: "48 sqm",
      bed: "1 Bedroom",
      desc: "Spacious and elegant living environment, perfectly suited for couples or individuals who appreciate more room to live and work.",
      features: ["Spacious Living Area", "King Size Bed", "Full Kitchen", "Large Balcony", "Premium Sound System"],
    },
    soho: {
      title: "SOHO",
      subtitle: "2 Bedroom Apartment",
      sqm: "80 sqm",
      bed: "2 Bedrooms",
      desc: "The ultimate residential experience with superior space and privacy, perfect for small families or longer stays.",
      features: ["2 Master Bedrooms", "2 Ensuite Bathrooms", "Dining Space", "Wrap-around Balcony", "Washing Machine"],
    },
  };

  const current = content[type];

  useEffect(() => {
    fetch(`/api/images?category=${type}`).then(r => r.json()).then((d: DBImage[]) => {
      if (d.length) { setHeroImage(d[0].url); setImages(d.map(img => img.url)); }
      else { setHeroImage(`https://picsum.photos/seed/${type}/1920/1080`); setImages([`https://picsum.photos/seed/${type}1/1200/800`, `https://picsum.photos/seed/${type}2/1200/800`]); }
    }).catch(console.error);
  }, [type]);

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative h-[80vh] flex items-center justify-center">
        <EditableImage src={heroImage} alt={current.title} category={type} className="absolute inset-0 w-full h-full" onImageChange={setHeroImage} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />
        <div className="relative text-center z-10 px-6">
          <FadeInView>
            <span className="label-caps text-gold-light mb-4 block">{current.sqm} &middot; {current.bed} &middot; Fully Furnished</span>
            <h1 className="text-white heading-display text-6xl md:text-8xl lg:text-9xl">{current.title}</h1>
            <p className="text-white/50 text-sm mt-6">{current.subtitle}</p>
          </FadeInView>
        </div>
      </section>

      {/* Details */}
      <section className="section-pad bg-cream">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start">
          <FadeInView direction="left">
            <div className="space-y-10">
              <h2 className="heading-section text-ink">Exceptional Living Space</h2>
              <p className="text-body max-w-lg">{current.desc}</p>
              <div className="grid grid-cols-2 gap-6">
                {current.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                    <span className="text-sm text-ink">{f}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setPage('contact')} className={BTN_SOLID}>Book This Apartment</button>
            </div>
          </FadeInView>
          <FadeInView direction="right">
            <div className="grid gap-6">
              {images.slice(0, 2).map((img, i) => (
                <div key={i} className="aspect-[4/3] overflow-hidden">
                  <img src={img} alt={`${current.title} ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
          </FadeInView>
        </div>
      </section>
    </div>
  );
};

// --- App Root ---
export default function App() {
  const [page, setPage] = useState<Page>('home');

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [page]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') setPage('admin');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentPage={page} setPage={setPage} />

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            {page === 'home' && <HomePage setPage={setPage} />}
            {page === 'apartments' && <HomePage setPage={setPage} />}
            {page === 'solo' && <ApartmentPage type="solo" setPage={setPage} />}
            {page === 'studio' && <ApartmentPage type="studio" setPage={setPage} />}
            {page === 'soho' && <ApartmentPage type="soho" setPage={setPage} />}
            {page === 'five-star' && <FiveStarPage />}
            {page === 'healthy' && <HealthyLivingPage />}
            {page === 'easy' && <EasyLivingPage />}
            {page === 'gallery' && <GalleryPage />}
            {page === 'offers' && <OffersPage />}
            {page === 'contact' && <ContactPage />}
            {page === 'admin' && <AdminPage />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer setPage={setPage} />

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/6281119028111"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 hover:shadow-green-500/30 transition-all duration-300"
      >
        <MessageCircle size={24} />
      </a>
    </div>
  );
}
