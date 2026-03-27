import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { EditableImage } from './EditableImage';

const HERO_HEIGHT_PX = 1500;
const HERO_SCROLL_HEIGHT_PX = HERO_HEIGHT_PX * 2;
const HERO_IMAGE_START_TOP_PX = 576;
const HERO_TEXT_TOP_CLASS = 'mt-[180px]';
const HERO_IMAGE_ASPECT_RATIO = '21 / 9';
const HERO_VIDEO_SRC = '/hero-video.mp4';
const HERO_DEMO_VIDEO_SRC =
  'https://www.hive68.com/wp-content/uploads/2019/10/Clip-1.mp4';

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
      {/* Tag */}
      <motion.span
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className={`text-[12px] sm:text-[13px] md:text-[20px] uppercase tracking-[0.4em] font-sans font-semibold ${
          isDark ? 'text-ink' : 'text-white'
        }`}
      >
        {slides[currentSlide].tag}
      </motion.span>

      {/* Main Title */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`heading-display text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] xl:text-[13em] leading-none ${
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

      {/* Subtitle */}
      {/*<motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className={`text-sm md:text-base lg:text-lg font-sans font-light max-w-lg mt-5 md:mt-7 leading-relaxed tracking-wide px-6 ${
          isDark ? 'text-ink/50' : 'text-white/70'
        }`}
      >
        {slides[currentSlide].subtitle}
      </motion.p>*/}

      {/* CTA Button */}
      {/*<motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        onClick={() => setPage('contact')}
        className={`mt-7 md:mt-9 pointer-events-auto ${isDark ? BTN_DARK : BTN_LIGHT}`}
      >
        Book Your Stay
      </motion.button>*/}
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
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Scroll-driven animations
  const textY = useTransform(scrollYProgress, [0, 0.25, 0.55], [0, 0, -150]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.35, 0.55], [1, 1, 0]);
  const textScale = useTransform(scrollYProgress, [0, 0.3, 0.55], [1, 1, 0.9]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const imageWidth = useTransform(scrollYProgress, [0, 0.25], ['90%', '100%']);
  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 0.08, 0.2, 0.4],
    [0.1, 0.32, 0.58, 0.82],
  );

  // Image container top starts from a fixed pixel offset, then slides to 0 on scroll.
  const imageTop = useTransform(
    scrollYProgress,
    [0, 0.3],
    [`${HERO_IMAGE_START_TOP_PX}px`, '0px'],
  );
  // Negative offset for white text inside image container to align with dark text
  const whiteTextOffset = useTransform(
    scrollYProgress,
    [0, 0.3],
    [`-${HERO_IMAGE_START_TOP_PX}px`, '0px'],
  );

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
      style={{ height: `${HERO_SCROLL_HEIGHT_PX}px` }}
    >
      {/* Sticky container */}
      <div
        className="sticky top-0 w-full overflow-hidden"
        style={{ height: `${HERO_HEIGHT_PX}px` }}
      >
        {/* LAYER 1: Cream background + Dark text (bottom layer) */}
        <div className="absolute inset-0 bg-cream z-10">
          {/* Dark text - always visible on cream */}
          <motion.div
            style={{ y: textY, opacity: textOpacity, scale: textScale }}
            className="absolute inset-0 flex flex-col items-center pointer-events-none"
          >
            <div className={`pointer-events-auto ${HERO_TEXT_TOP_CLASS}`}>
              <HeroTextContent
                slides={slides}
                currentSlide={currentSlide}
                isDark={true}
              />
            </div>
          </motion.div>
        </div>

        {/* LAYER 2: Image container + White text (top layer, clips to reveal) */}
        <motion.div
          style={{ top: imageTop }}
          className="absolute left-0 right-0 bottom-0 z-20 overflow-hidden"
        >
          {/* Background image frame uses a fixed 21:9 ratio and expands from 90% to full width on scroll. */}
          <motion.div
            style={{
              scale: imageScale,
              width: imageWidth,
              aspectRatio: HERO_IMAGE_ASPECT_RATIO,
            }}
            className="absolute left-1/2 top-0 -translate-x-1/2 overflow-hidden"
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
            {/* Gradient overlay */}
            <motion.div
              style={{ opacity: overlayOpacity }}
              className="absolute inset-0 bg-black/70"
            />
          </motion.div>

          {/* White text stays aligned with Layer 1 by mirroring the image container offset in pixels. */}
          <motion.div
            style={{ y: textY, opacity: textOpacity, scale: textScale }}
            className="absolute left-0 right-0 flex flex-col items-center pointer-events-none"
          >
            <motion.div
              className="w-full flex flex-col items-center"
              style={{
                marginTop: whiteTextOffset,
                height: `${HERO_HEIGHT_PX}px`,
              }}
            >
              <div className={`pointer-events-auto ${HERO_TEXT_TOP_CLASS}`}>
                <HeroTextContent
                  slides={slides}
                  currentSlide={currentSlide}
                  isDark={false}
                />
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
          <span className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-sans [writing-mode:vertical-lr]">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-px h-8 bg-linear-to-b from-white/40 to-transparent"
          />
        </motion.div>
      </div>
    </div>
  );
};
