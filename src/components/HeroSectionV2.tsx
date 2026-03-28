import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { useState, useEffect, useRef } from 'react';

const HERO_VIDEO_SRC = '/hero-video.mp4';
const HERO_DEMO_VIDEO_SRC =
  'https://www.hive68.com/wp-content/uploads/2019/10/Clip-1.mp4';

const SLIDES = [
  {
    tag: 'Welcome To',
    title: 'TS Residence',
    subtitle: 'Five-star living in the heart of Seminyak',
  },
  {
    tag: 'Experience',
    title: 'Healthy Living',
    subtitle: 'Wellness, recovery, and mindful living — all under one roof',
  },
  {
    tag: 'Discover',
    title: 'Easy Living',
    subtitle: 'Monthly apartments, zero stress, minutes from the beach',
  },
];

// Each word slides up from behind a clip boundary — creates an elegant "type reveal"
const WordReveal = ({
  text,
  delay = 0,
  className = '',
}: {
  text: string;
  delay?: number;
  className?: string;
}) => (
  <span className={className}>
    {text.split(' ').map((word, i) => (
      <span
        key={`${word}-${i}`}
        className="inline-block overflow-hidden align-bottom"
        // Padding gives room for ascenders (caps) and descenders (g, y, p)
        style={{ paddingTop: '0.18em', paddingBottom: '0.2em' }}
      >
        <motion.span
          className="inline-block"
          initial={{ y: '110%' }}
          animate={{ y: '0%' }}
          transition={{
            duration: 1.05,
            delay: delay + i * 0.13,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {word}
          {i < text.split(' ').length - 1 ? '\u00a0' : ''}
        </motion.span>
      </span>
    ))}
  </span>
);

// Thin animated gold rule that expands from center outward
const GoldRule = ({
  delay = 0,
  width = 44,
}: {
  delay?: number;
  width?: number;
}) => (
  <motion.div
    className="h-px bg-gold origin-center"
    initial={{ scaleX: 0, opacity: 0 }}
    animate={{ scaleX: 1, opacity: 1 }}
    transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    style={{ width }}
  />
);

export const HeroSectionV2 = ({
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

  // Auto-advance slides; mark initial mount as done on first transition
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

  // Scroll-driven: hero shrinks and fades as user scrolls down
  const heroOpacity = useTransform(scrollYProgress, [0, 0.42], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.97]);
  // Parallax: image moves slower than scroll (25% shift over full scroll zone)
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);

  const slideNum = String(currentSlide + 1).padStart(2, '0');
  const totalNum = String(SLIDES.length).padStart(2, '0');

  // First load: text waits for the cinematic bars to fully retract (~1.3s)
  // Subsequent slides: text appears immediately after crossfade
  const d = {
    tag: isInitialMount ? 1.3 : 0.15,
    title: isInitialMount ? 1.5 : 0.28,
    subtitle: isInitialMount ? 1.9 : 0.65,
    cta: isInitialMount ? 2.2 : 0.85,
    chrome: isInitialMount ? 1.9 : 0,
  };

  const handleSlideClick = (i: number) => {
    setIsInitialMount(false);
    setCurrentSlide(i);
  };

  return (
    <div
      ref={heroRef}
      className="relative"
      style={{ height: `${Math.round(viewportH * 1.6)}px` }}
    >
      <motion.div
        className="sticky top-0 w-full overflow-hidden bg-black"
        style={{
          height: `${viewportH}px`,
          opacity: heroOpacity,
          scale: heroScale,
        }}
      >
        {/* ── Background: parallax image + video ── */}
        <motion.div
          className="absolute inset-0 scale-[1.12]"
          style={{ y: imageY }}
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

        {/* Cinematic vignette gradient */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />

        {/* ── Cinematic entrance: two bars retract from center ── */}
        <motion.div
          className="absolute top-0 inset-x-0 bg-[#090909] z-50 origin-top"
          initial={{ height: '55%' }}
          animate={{ height: '0%' }}
          transition={{ duration: 1.35, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
        />
        <motion.div
          className="absolute bottom-0 inset-x-0 bg-[#090909] z-50 origin-bottom"
          initial={{ height: '55%' }}
          animate={{ height: '0%' }}
          transition={{ duration: 1.35, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
        />

        {/* ── Left chrome: slide counter ── */}
        <motion.div
          className="absolute left-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-3 z-20"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: d.chrome }}
        >
          <span className="text-white/70 text-[11px] font-mono tracking-[0.15em]">
            {slideNum}
          </span>
          {/* Progress line */}
          <div className="w-px h-16 bg-white/10 relative overflow-hidden rounded-full">
            <motion.div
              key={currentSlide}
              className="absolute top-0 inset-x-0 bg-gold rounded-full"
              initial={{ height: '0%' }}
              animate={{ height: '100%' }}
              transition={{ duration: 8, ease: 'linear' }}
            />
          </div>
          <span className="text-white/20 text-[11px] font-mono tracking-[0.15em]">
            {totalNum}
          </span>
        </motion.div>

        {/* ── Right chrome: location text ── */}
        <motion.div
          className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:block z-20"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: d.chrome }}
        >
          <span
            className="text-white/25 text-[9px] uppercase tracking-[0.42em] font-sans"
            style={{ writingMode: 'vertical-rl' }}
          >
            Seminyak&nbsp;·&nbsp;Bali
          </span>
        </motion.div>

        {/* ── Center: main text (cross-fades between slides) ── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.55, ease: 'easeInOut' }}
              className="text-center w-full max-w-5xl"
            >
              {/* Gold rules + tag */}
              <motion.div
                className="flex items-center justify-center gap-4 mb-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: d.tag }}
              >
                <GoldRule delay={d.tag} />
                <span
                  className="text-white text-[11px] sm:text-[12px] uppercase tracking-[0.48em] font-sans font-semibold"
                  style={{ textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}
                >
                  {SLIDES[currentSlide].tag}
                </span>
                <GoldRule delay={d.tag} />
              </motion.div>

              {/* Title — word-by-word reveal */}
              <h1
                className="heading-display text-white"
                style={{
                  fontSize: 'clamp(3rem, 9.5vw, 9.5rem)',
                  textShadow:
                    '0 4px 40px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.5)',
                }}
              >
                <WordReveal text={SLIDES[currentSlide].title} delay={d.title} />
              </h1>

              {/* Subtitle */}
              <motion.p
                className="text-white/75 text-base sm:text-lg font-sans font-light tracking-wide max-w-sm sm:max-w-md mx-auto mb-11"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.95,
                  delay: d.subtitle,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {SLIDES[currentSlide].subtitle}
              </motion.p>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.85,
                  delay: d.cta,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <button className="group inline-flex items-center gap-3.5 border border-white/40 hover:border-gold/70 text-white/85 hover:text-gold text-[13px] uppercase tracking-[0.32em] font-sans px-10 py-5 transition-colors duration-500">
                  <span>Explore the Residence</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="text-[13px]"
                  >
                    →
                  </motion.span>
                </button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Bottom bar ── */}
        <motion.div
          className="absolute bottom-8 inset-x-0 flex items-center justify-between px-8 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: isInitialMount ? 2.3 : 0 }}
        >
          {/* Star rating */}
          <div className="hidden md:flex items-center gap-2.5">
            <span className="text-gold text-[11px] tracking-wide">★★★★★</span>
            <div className="w-px h-3 bg-white/15" />
            <span className="text-white/22 text-[9px] uppercase tracking-[0.32em] font-sans">
              Five Star
            </span>
          </div>

          {/* Slide progress indicators */}
          <div className="flex items-center gap-2.5 mx-auto md:mx-0">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => handleSlideClick(i)}
                className="relative h-0.5 overflow-hidden transition-all duration-500 cursor-pointer"
                style={{ width: i === currentSlide ? 52 : 16 }}
                aria-label={`Go to slide ${i + 1}`}
              >
                <div className="absolute inset-0 bg-white/18" />
                {i === currentSlide && (
                  <motion.div
                    key={currentSlide}
                    className="absolute top-0 left-0 h-full bg-gold"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 8, ease: 'linear' }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Scroll hint */}
          <div className="hidden md:flex flex-col items-center gap-2">
            <span
              className="text-white/22 text-[9px] uppercase tracking-[0.35em] font-sans"
              style={{ writingMode: 'vertical-rl' }}
            >
              Scroll
            </span>
            <motion.div
              animate={{ y: [0, 7, 0] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-px h-6 bg-gradient-to-b from-white/25 to-transparent"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
