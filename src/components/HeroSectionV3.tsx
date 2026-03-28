import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { useState, useEffect, useRef } from 'react';

const HERO_VIDEO_SRC = '/hero-video.mp4';
const HERO_DEMO_VIDEO_SRC =
  'https://www.hive68.com/wp-content/uploads/2019/10/Clip-1.mp4';

const SLIDES = [
  {
    num: '01',
    tag: 'Welcome To',
    titleA: 'TS',
    titleB: 'Residence',
    subtitle: 'Five-star living in the heart of Seminyak',
    amenities: ['Pool', 'Spa', 'Rooftop', 'Gym'],
  },
  {
    num: '02',
    tag: 'Experience',
    titleA: 'Healthy',
    titleB: 'Living',
    subtitle: 'Wellness, recovery, and mindful living — all under one roof',
    amenities: ['Wellness', 'Yoga', 'Juice Bar', 'Pool'],
  },
  {
    num: '03',
    tag: 'Discover',
    titleA: 'Easy',
    titleB: 'Living',
    subtitle: 'Monthly apartments, zero stress, minutes from the beach',
    amenities: ['Beach', 'Furnished', 'Monthly', 'Concierge'],
  },
];

// Single line reveal: text clips up from below into view
const LineReveal = ({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => (
  <div
    className={`overflow-hidden ${className}`}
    style={{ paddingTop: '0.2em', paddingBottom: '0.28em' }}
  >
    <motion.div
      initial={{ y: '105%' }}
      animate={{ y: '0%' }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  </div>
);

export const HeroSectionV3 = ({
  heroImage,
  setHeroImage: _setHeroImage, // eslint-disable-line @typescript-eslint/no-unused-vars
}: {
  heroImage: string;
  setHeroImage: (url: string) => void;
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isInitialMount, setIsInitialMount] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [videoSrc, setVideoSrc] = useState(HERO_VIDEO_SRC);
  const heroRef = useRef<HTMLDivElement>(null);

  const [viewportH, setViewportH] = useState(
    typeof window !== 'undefined' ? window.innerHeight : 900,
  );

  useEffect(() => {
    const measure = () => setViewportH(window.innerHeight);
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsInitialMount(false);
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // "Card lift" scroll effect — hero shrinks with rounded corners then fades
  const cardScale = useTransform(scrollYProgress, [0, 0.38], [1, 0.88]);
  const cardBorderRadius = useTransform(
    scrollYProgress,
    [0, 0.38],
    ['0px', '20px'],
  );
  const cardOpacity = useTransform(scrollYProgress, [0.32, 0.52], [1, 0]);
  const cardY = useTransform(scrollYProgress, [0, 0.5], ['0px', '-6vh']);
  const imageParallax = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);

  // Delays: long on first load, short on slide change
  const d = {
    panel: isInitialMount ? 0.5 : 0,
    num: isInitialMount ? 0.8 : 0.1,
    tag: isInitialMount ? 1.0 : 0.15,
    titleA: isInitialMount ? 1.15 : 0.25,
    titleB: isInitialMount ? 1.3 : 0.35,
    sub: isInitialMount ? 1.55 : 0.5,
    amenities: isInitialMount ? 1.75 : 0.65,
    cta: isInitialMount ? 1.95 : 0.75,
  };

  const handleSlideClick = (i: number) => {
    setIsInitialMount(false);
    setCurrentSlide(i);
  };

  const slide = SLIDES[currentSlide];

  return (
    <div
      ref={heroRef}
      className="relative"
      style={{ height: `${Math.round(viewportH * 1.65)}px` }}
    >
      <motion.div
        className="sticky top-0 w-full overflow-hidden"
        style={{
          height: `${viewportH}px`,
          scale: cardScale,
          borderRadius: cardBorderRadius,
          opacity: cardOpacity,
          y: cardY,
        }}
      >
        {/* ── Outer flex container ── */}
        <div className="absolute inset-0 flex flex-col md:flex-row">
          {/* ── LEFT: Text panel (rendered first in DOM = left) ── */}

          {/* ── RIGHT: Image / Video panel ── */}
          <motion.div
            className="relative flex-1 md:flex-[0_0_62%] md:order-2 overflow-hidden"
            initial={{ x: '8%', opacity: 0 }}
            animate={{ x: '0%', opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            {/* Slide images with horizontal wipe transition */}
            <AnimatePresence initial={false} mode="sync">
              <motion.div
                key={currentSlide}
                className="absolute inset-0"
                initial={{ clipPath: 'inset(0 0 0 100%)' }}
                animate={{ clipPath: 'inset(0 0 0 0%)' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
              >
                <motion.div
                  className="absolute inset-0 scale-[1.08]"
                  style={{ y: imageParallax }}
                >
                  <img
                    src={heroImage}
                    alt="TS Residence"
                    className="w-full h-full object-cover"
                  />
                  {!hasVideoError && (
                    <video
                      key={videoSrc}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      poster={heroImage}
                      onCanPlay={() => setIsVideoReady(true)}
                      onError={() => {
                        if (videoSrc !== HERO_DEMO_VIDEO_SRC) {
                          setIsVideoReady(false);
                          setVideoSrc(HERO_DEMO_VIDEO_SRC);
                          return;
                        }
                        setHasVideoError(true);
                      }}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                        isVideoReady ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <source src={videoSrc} type="video/mp4" />
                    </video>
                  )}
                </motion.div>
                {/* Subtle left-edge gradient to blend into panel */}
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:hidden" />
              </motion.div>
            </AnimatePresence>

            {/* Bottom-left: location tag on image (desktop only) */}
            <motion.div
              className="absolute bottom-8 left-8 hidden md:flex items-center gap-2 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.8 }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-gold" />
              <span className="text-white/60 text-[10px] uppercase tracking-[0.38em] font-sans">
                Seminyak, Bali
              </span>
            </motion.div>
          </motion.div>

          {/* ── LEFT: Text panel ── */}
          <motion.div
            className="
              absolute bottom-0 left-0 right-0 md:static
              md:flex-[0_0_38%] md:order-1
              bg-[#0c0c0c]/90 md:bg-[#0c0c0c]
              flex flex-col justify-between
              px-8 pt-8 pb-8
              md:px-12 md:pt-14 md:pb-10
            "
            initial={{ x: '-8%', opacity: 0 }}
            animate={{ x: '0%', opacity: 1 }}
            transition={{
              duration: 1.2,
              ease: [0.16, 1, 0.3, 1],
              delay: d.panel,
            }}
          >
            {/* Thin vertical gold accent line on right edge (desktop) */}
            <div className="absolute right-0 top-16 bottom-16 w-px bg-gold/30 hidden md:block" />

            {/* ── Top row: slide number + nav dots ── */}
            <div className="flex items-center justify-between mb-auto md:mb-0">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentSlide}
                  className="font-mono text-[11px] text-white/30 tracking-[0.2em]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, delay: d.num }}
                >
                  {slide.num} / {String(SLIDES.length).padStart(2, '0')}
                </motion.span>
              </AnimatePresence>

              {/* Slide dots */}
              <div className="flex items-center gap-2">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleSlideClick(i)}
                    className={`transition-all duration-500 rounded-full ${
                      i === currentSlide
                        ? 'w-5 h-1 bg-gold'
                        : 'w-1 h-1 bg-white/20 hover:bg-white/40'
                    }`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* ── Main text ── */}
            <div className="flex-1 flex flex-col justify-center my-6 md:my-0 md:py-10">
              <AnimatePresence mode="wait">
                <div key={currentSlide}>
                  {/* Tag */}
                  <motion.div
                    className="flex items-center gap-3 mb-5 md:mb-7"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, delay: d.tag }}
                  >
                    <div className="h-px w-8 bg-gold/60" />
                    <span className="text-gold/80 text-[12px] uppercase tracking-[0.4em] font-sans font-medium">
                      {slide.tag}
                    </span>
                  </motion.div>

                  {/* Title line A */}
                  <LineReveal delay={d.titleA}>
                    <h1
                      className="heading-display text-white leading-none"
                      style={{ fontSize: 'clamp(2.8rem, 4vw, 5rem)' }}
                    >
                      {slide.titleA}
                    </h1>
                  </LineReveal>

                  {/* Title line B — italic for elegance */}
                  <LineReveal delay={d.titleB} className="mb-6 md:mb-8">
                    <h1
                      className="heading-display text-white leading-none italic"
                      style={{ fontSize: 'clamp(2.8rem, 4vw, 5rem)' }}
                    >
                      {slide.titleB}
                    </h1>
                  </LineReveal>

                  {/* Subtitle */}
                  <motion.p
                    className="text-white/60 text-base md:text-lg font-sans font-light leading-relaxed mb-7 md:mb-9"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: d.sub,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {slide.subtitle}
                  </motion.p>

                  {/* Amenity tags */}
                  <motion.div
                    className="flex flex-wrap gap-2 mb-8 md:mb-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, delay: d.amenities }}
                  >
                    {slide.amenities.map((tag, i) => (
                      <span
                        key={i}
                        className="text-white/45 text-[11px] uppercase tracking-[0.28em] font-sans border border-white/15 px-3.5 py-2"
                      >
                        {tag}
                      </span>
                    ))}
                  </motion.div>
                </div>
              </AnimatePresence>
            </div>

            {/* ── Bottom: CTA + star rating ── */}
            <div className="flex items-center justify-between gap-4">
              <motion.button
                className="group flex items-center gap-3 bg-gold/90 hover:bg-gold text-[#0c0c0c] text-[13px] uppercase tracking-[0.28em] font-sans font-semibold px-8 py-5 transition-colors duration-300"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: d.cta,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <span>Book Now</span>
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  →
                </motion.span>
              </motion.button>

              <motion.div
                className="flex flex-col items-end gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: d.cta + 0.15 }}
              >
                <span className="text-gold text-[11px] tracking-wider">
                  ★★★★★
                </span>
                <span className="text-white/20 text-[8px] uppercase tracking-[0.3em] font-sans">
                  Five Star
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
