import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
} from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { EditableImage } from './EditableImage';

const HERO_VIDEO_SRC = '/hero-video.mp4';
const HERO_DEMO_VIDEO_SRC =
  'https://www.hive68.com/wp-content/uploads/2019/10/Clip-1.mp4';

// Navbar height estimate + visual breathing room above text.
// This ensures "WELCOME TO" tag is always visible below the fixed navbar.
const NAVBAR_H = 80;
// Equal visual gap above text (below navbar) and below text (before image).
const VISUAL_GAP = 48;
// Where the text block starts from viewport top.
const TEXT_TOP = NAVBAR_H + VISUAL_GAP; // 128px

// --- Shared text content for dual-header technique ---
const HeroTextContent = ({
  slides,
  currentSlide,
  isDark,
}: {
  slides: { tag: string; title: string; subtitle: string }[];
  currentSlide: number;
  isDark: boolean;
}) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={currentSlide}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
      className="flex flex-col items-center text-center"
    >
      <motion.span
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className={`text-[12px] sm:text-[13px] md:text-[18px] uppercase tracking-[0.4em] font-sans font-semibold ${
          isDark ? 'text-ink' : 'text-white'
        }`}
      >
        {slides[currentSlide].tag}
      </motion.span>

      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`heading-display text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] xl:text-[11rem] leading-none ${
          isDark ? 'text-ink' : 'text-white'
        }`}
        style={
          isDark
            ? {}
            : {
                textShadow:
                  '0 4px 60px rgba(0,0,0,0.5), 0 2px 10px rgba(0,0,0,0.3)',
              }
        }
      >
        {slides[currentSlide].title}
      </motion.h1>
    </motion.div>
  </AnimatePresence>
);

// --- Hero Section (Berkeley Double-Header Masking) ---
export const HeroSection = ({
  heroImage,
  setHeroImage,
}: {
  heroImage: string;
  setHeroImage: (url: string) => void;
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [videoSrc, setVideoSrc] = useState(HERO_VIDEO_SRC);
  const heroRef = useRef<HTMLDivElement>(null);
  const textMeasureRef = useRef<HTMLDivElement>(null);

  // viewportH drives all pixel-based layout values.
  const [viewportH, setViewportH] = useState(
    typeof window !== 'undefined' ? window.innerHeight : 900,
  );
  // Measured height of the text block (tag + title).
  const [textH, setTextH] = useState(160);

  // imageStartPx: symmetric gaps — VISUAL_GAP above and below text (below navbar).
  // IMAGE_GAP_PX equals VISUAL_GAP so space above text = space below text.
  const imageStartPx = TEXT_TOP + textH + VISUAL_GAP;

  // MotionValue for imageStartPx — lets transforms re-evaluate reactively
  // whenever textH is measured (not just on scroll events).
  const imageStartMV = useMotionValue(imageStartPx);
  useEffect(() => {
    imageStartMV.set(imageStartPx);
  }, [imageStartPx, imageStartMV]);

  useEffect(() => {
    const measure = () => {
      setViewportH(window.innerHeight);
      if (textMeasureRef.current) {
        setTextH(textMeasureRef.current.offsetHeight);
      }
    };
    measure();
    // Re-measure after fonts have settled
    const t = setTimeout(measure, 200);
    window.addEventListener('resize', measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', measure);
    };
  }, []);

  // Re-measure when slide changes
  useEffect(() => {
    if (textMeasureRef.current) {
      setTextH(textMeasureRef.current.offsetHeight);
    }
  }, [currentSlide]);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const easeInOutCubic = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  // Image slides up from imageStartPx → 0 over the first 40% of the scroll zone.
  // Both imageTop and whiteTextAbsTop depend on imageStartMV so they re-evaluate
  // immediately when the measured text height updates (not just on scroll).
  const imageTop = useTransform(
    [scrollYProgress, imageStartMV],
    ([p, start]: number[]) => {
      const eased = easeInOutCubic(Math.min(p / 0.4, 1));
      return `${Math.round(start * (1 - eased))}px`;
    },
  );

  // White text is positioned inside layer2 (the image container).
  // Setting top = -currentImageTop keeps the white text visually pinned at
  // viewport y = 0, then TEXT_TOP margin inside puts it at the same
  // position as the dark text. layer2's overflow:hidden clips everything
  // above the image boundary, so white text only shows within the image.
  const whiteTextAbsTop = useTransform(
    [scrollYProgress, imageStartMV],
    ([p, start]: number[]) => {
      const eased = easeInOutCubic(Math.min(p / 0.4, 1));
      return `-${Math.round(start * (1 - eased))}px`;
    },
  );

  // Other scroll-driven animations
  const textY = useTransform(scrollYProgress, [0, 0.3, 0.6], [0, -20, -90]);
  const textOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.45],
    [1, 0.85, 0],
  );
  const textScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.93]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const imageWidth = useTransform(scrollYProgress, [0, 0.4], ['88%', '100%']);
  const imageBorderRadius = useTransform(
    scrollYProgress,
    [0, 0.4],
    ['18px', '0px'],
  );
  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 0.08, 0.22, 0.48],
    [0.1, 0.28, 0.55, 0.75],
  );
  const heroExitOpacity = useTransform(scrollYProgress, [0.78, 1.0], [1, 0]);

  const slides = [
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
      subtitle: 'Monthly apartments with zero stress, minutes from the beach',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div
      ref={heroRef}
      className="relative"
      style={{ height: `${Math.round(viewportH * 1.7)}px` }}
    >
      {/* Sticky container — one viewport tall in pixels */}
      <div
        className="sticky top-0 w-full overflow-hidden"
        style={{ height: `${viewportH}px` }}
      >
        <motion.div
          style={{ opacity: heroExitOpacity }}
          className="absolute inset-0"
        >
          {/* LAYER 1: Cream background + Dark text */}
          <div className="absolute inset-0 bg-cream z-10">
            <div className="absolute inset-0 flex flex-col items-center pointer-events-none">
              {/* Motion is applied directly to the text content div, not a full-screen wrapper.
                  This ensures scale/y transforms originate from the text block itself —
                  the same origin used by the white text copy in Layer 2. */}
              <motion.div
                ref={textMeasureRef}
                style={{
                  y: textY,
                  opacity: textOpacity,
                  scale: textScale,
                  marginTop: `${TEXT_TOP}px`,
                }}
                className="pointer-events-auto"
              >
                <HeroTextContent
                  slides={slides}
                  currentSlide={currentSlide}
                  isDark={true}
                />
              </motion.div>
            </div>
          </div>

          {/* LAYER 2: Image + White text (clips to image bounds) */}
          <motion.div
            style={{ top: imageTop }}
            className="absolute left-0 right-0 bottom-0 z-20 overflow-hidden"
          >
            {/* Image frame — fills layer2 height, starts narrow, expands to full bleed */}
            <motion.div
              style={{
                scale: imageScale,
                width: imageWidth,
                borderRadius: imageBorderRadius,
              }}
              className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 overflow-hidden"
            >
              <EditableImage
                src={heroImage}
                alt="TS Residence"
                category="hero"
                className="w-full h-full"
                onImageChange={setHeroImage}
              >
                {(src: string) => (
                  <>
                    <img
                      src={src}
                      alt="TS Residence"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    {!hasVideoError && (
                      <video
                        key={videoSrc}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        poster={src}
                        onCanPlay={() => setIsVideoReady(true)}
                        onError={() => {
                          if (videoSrc !== HERO_DEMO_VIDEO_SRC) {
                            setIsVideoReady(false);
                            setVideoSrc(HERO_DEMO_VIDEO_SRC);
                            return;
                          }
                          setHasVideoError(true);
                        }}
                        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                          isVideoReady ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <source src={videoSrc} type="video/mp4" />
                      </video>
                    )}
                  </>
                )}
              </EditableImage>
              <motion.div
                style={{ opacity: overlayOpacity }}
                className="absolute inset-0 bg-black/70"
              />
            </motion.div>

            {/* White text — outer div pinned at viewport y=0 (top = -currentImageTop),
                layer2's overflow:hidden clips it to the image area.
                Motion (y/opacity/scale) lives on the inner content div — identical
                to the dark text content div — so both share the same transform origin. */}
            <motion.div
              style={{ top: whiteTextAbsTop }}
              className="absolute left-0 right-0 flex flex-col items-center pointer-events-none"
            >
              <motion.div
                style={{
                  y: textY,
                  opacity: textOpacity,
                  scale: textScale,
                  marginTop: `${TEXT_TOP}px`,
                }}
                className="pointer-events-auto"
              >
                <HeroTextContent
                  slides={slides}
                  currentSlide={currentSlide}
                  isDark={false}
                />
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
            <span className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-sans [writing-mode:vertical-lr]">
              Scroll
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-px h-8 bg-linear-to-b from-white/40 to-transparent"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
