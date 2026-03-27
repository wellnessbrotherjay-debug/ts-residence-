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
  MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, FormEvent, useRef } from 'react';

// --- Types ---
type Page = 'home' | 'apartments' | 'offers' | 'gallery' | 'contact' | 'admin' | 'five-star' | 'healthy' | 'easy' | 'solo' | 'studio' | 'soho';

interface DBImage {
  id: number;
  url: string;
  category: string;
  alt: string;
  created_at: string;
}

// --- Components ---

// Editable Image Component with inline upload
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
      const res = await fetch('/api/images', {
        method: 'POST',
        body: formData,
      });
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

  const handleFileChange = (e: { target: HTMLInputElement & { files: FileList | null } }) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  return (
    <div className={`relative group ${className || ''}`}>
      {typeof children === 'function' ? (
        <>{children(src)}</>
      ) : children ? (
        children
      ) : (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      )}
      <button
        onClick={() => inputRef.current?.click()}
        className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white text-black p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 disabled:opacity-50"
        disabled={uploading}
        title="Replace image"
      >
        {uploading ? '...' : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

const Navbar = ({ currentPage, setPage }: { currentPage: Page, setPage: (p: Page) => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { label: string, value: Page }[] = [
    { label: 'Apartments', value: 'apartments' },
    { label: 'Offers', value: 'offers' },
    { label: 'Five-star living', value: 'five-star' },
    { label: 'Healthy living', value: 'healthy' },
    { label: 'Easy living', value: 'easy' },
    { label: 'Gallery', value: 'gallery' },
    { label: 'Contact', value: 'contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/90 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'}`}>
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center cursor-pointer py-4"
          onClick={() => setPage('home')}
        >
          <div className="flex items-center space-x-3">
            <div className="relative h-12 w-12 flex items-center justify-center">
              <span className="text-5xl font-serif font-light text-inherit leading-none relative -mr-2">T</span>
              <span className="text-5xl font-serif font-light text-inherit leading-none relative mt-3">S</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.4em] uppercase text-inherit font-sans font-black leading-none">Residence</span>
            </div>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setPage(item.value)}
              className={`text-white/90 text-[13px] md:text-[14px] xl:text-[15px] hover:text-white transition-colors ${currentPage === item.value ? 'font-semibold' : ''}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
          <button className="px-8 py-2.5 rounded-full border border-white/40 text-white text-[14px] hover:bg-white/10 transition-all">
            Book Apartment
          </button>
          <div className="flex items-center space-x-3">
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
              <MessageCircle size={20} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
              <Send size={20} />
            </a>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white border-b border-ts-border lg:hidden"
          >
            <div className="flex flex-col p-6 space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    setPage(item.value);
                    setIsMenuOpen(false);
                  }}
                  className="text-left py-2 nav-link"
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-4 flex flex-col space-y-4">
                <button className="btn-primary w-full">Book Apartment</button>
                <div className="flex justify-center space-x-4">
                  <a href="#" className="p-3 rounded-full border border-ts-border">
                    <Instagram size={20} />
                  </a>
                  <a href="#" className="p-3 rounded-full border border-ts-border">
                    <MessageCircle size={20} />
                  </a>
                  <a href="#" className="p-3 rounded-full border border-ts-border">
                    <Send size={20} />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = ({ setPage }: { setPage: (p: Page) => void }) => {
  return (
    <footer className="bg-white pt-20 pb-10 px-6 md:px-12 lg:px-24 border-t border-ts-border">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {/* Brand */}
        <div className="space-y-8">
          <div className="relative flex flex-col items-start">
            <div className="relative h-14 w-14">
              <span className="text-5xl font-serif font-light text-[#1a1a1a] leading-none absolute top-0 left-0">T</span>
              <span className="text-5xl font-serif font-light text-[#1a1a1a] leading-none absolute top-3 left-4">S</span>
            </div>
            <span className="text-[7px] tracking-[0.5em] uppercase text-[#1a1a1a] font-sans font-black -mt-1 ml-3">Residence</span>
          </div>
          <div className="space-y-1 text-sm text-ts-muted">
            <p>tsresidence@townsquare.co.id</p>
            <p>WhatsApp: +6281119028111</p>
            <p>Telegram: +6281119028111</p>
            <p className="pt-4 leading-relaxed">Seminyak Jl. Nakula No.18, Legian, Kec. Kuta, Kabupaten Badung, Bali 80361</p>
          </div>
        </div>

        {/* Discover */}
        <div>
          <h4 className="font-sans font-semibold text-sm uppercase tracking-widest mb-6">Discover</h4>
          <ul className="space-y-3 text-sm text-ts-muted">
            <li><button onClick={() => setPage('offers')} className="hover:text-ts-accent transition-colors">Offers</button></li>
            <li><button onClick={() => setPage('five-star')} className="hover:text-ts-accent transition-colors">Five-star living</button></li>
            <li><button onClick={() => setPage('healthy')} className="hover:text-ts-accent transition-colors">Healthy living</button></li>
            <li><button onClick={() => setPage('easy')} className="hover:text-ts-accent transition-colors">Easy living</button></li>
            <li><button onClick={() => setPage('gallery')} className="hover:text-ts-accent transition-colors">Gallery</button></li>
            <li><button className="hover:text-ts-accent transition-colors">Journal</button></li>
            <li><button onClick={() => setPage('contact')} className="hover:text-ts-accent transition-colors">Contact</button></li>
            <li><button className="hover:text-ts-accent transition-colors">Terms & Conditions</button></li>
          </ul>
        </div>

        {/* Apartments */}
        <div>
          <h4 className="font-sans font-semibold text-sm uppercase tracking-widest mb-6">Apartments</h4>
          <ul className="space-y-3 text-sm text-ts-muted">
            <li><button onClick={() => setPage('solo')} className="hover:text-ts-accent transition-colors">SOLO – 1 Bedroom (36 sqm)</button></li>
            <li><button onClick={() => setPage('studio')} className="hover:text-ts-accent transition-colors">STUDIO – 1 Bedroom (48 sqm)</button></li>
            <li><button onClick={() => setPage('soho')} className="hover:text-ts-accent transition-colors">SOHO – 2 Bedrooms (80 sqm)</button></li>
          </ul>
        </div>

        {/* Newsletter/Social */}
        <div className="flex flex-col justify-between h-full">
          <div>
            <h4 className="font-sans font-semibold text-sm uppercase tracking-widest mb-6">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-ts-muted hover:text-ts-accent transition-colors flex items-center space-x-2 text-sm">
                <Instagram size={16} />
                <span>Instagram</span>
              </a>
              <a href="#" className="text-ts-muted hover:text-ts-accent transition-colors flex items-center space-x-2 text-sm">
                <Send size={16} />
                <span>Telegram</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-ts-border flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-[0.2em] text-ts-muted">
        <div className="flex space-x-6">
          <span>© 2023 TS RESIDENCE</span>
          <a href="#" className="hover:text-ts-ink">Privacy Policy</a>
        </div>
        <button onClick={() => setPage('admin')} className="hover:text-ts-ink opacity-50 hover:opacity-100">Admin</button>
      </div>
    </footer>
  );
};

const HomePage = ({ setPage }: { setPage: (p: Page) => void }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activePillar, setActivePillar] = useState(0);
  const [currentApt, setCurrentApt] = useState(0);


  const [heroImage, setHeroImage] = useState<string>('https://picsum.photos/seed/ts-res-hero/1920/1080');
  const [apartmentImages, setApartmentImages] = useState<DBImage[]>([]);
  const [generalImages, setGeneralImages] = useState<DBImage[]>([]);
  const [selectedApt, setSelectedApt] = useState<{ type: string, images: string[] } | null>(null);

  const getAptImg = (index: number, fallback: string) => {
    return apartmentImages[index]?.url || fallback;
  };

  const getGenImg = (index: number, fallback: string) => {
    return generalImages[index]?.url || fallback;
  };

  const updateApartmentImage = (index: number, url: string) => {
    setApartmentImages(prev => {
      const next = [...prev];
      const unitType = apartments[index].page;
      const fallbackAlt = apartments[index].name + ' Apartment';
      next[index] = {
        id: next[index]?.id ?? Date.now() + index,
        url,
        category: unitType,
        alt: next[index]?.alt || fallbackAlt,
        created_at: next[index]?.created_at || new Date().toISOString(),
      };
      return next;
    });
  };

  const updateGeneralImage = (index: number, url: string) => {
    setGeneralImages(prev => {
      const next = [...prev];
      const fallbackAlt = ['Tropical Garden', 'Young Families'][index] || 'General';
      next[index] = {
        id: next[index]?.id ?? Date.now() + index,
        url,
        category: 'general',
        alt: next[index]?.alt || fallbackAlt,
        created_at: next[index]?.created_at || new Date().toISOString(),
      };
      return next;
    });
  };

  const apartments = [
    {
      name: "SOLO",
      sqm: "36 sqm",
      bed: "1 Bedroom",
      furnishing: "Fully Furnished",
      img: getAptImg(0, "https://picsum.photos/seed/solo-apt/1920/1080"),
      page: 'solo' as Page
    },
    {
      name: "STUDIO",
      sqm: "48 sqm",
      bed: "1 Bedroom",
      furnishing: "Fully Furnished",
      img: getAptImg(1, "https://picsum.photos/seed/studio-apt/1920/1080"),
      page: 'studio' as Page
    },
    {
      name: "SOHO",
      sqm: "80 sqm",
      bed: "2 Bedroom",
      furnishing: "Fully Furnished",
      img: getAptImg(2, "https://picsum.photos/seed/soho-apt/1920/1080"),
      page: 'soho' as Page
    }
  ];

  const nextApt = () => setCurrentApt((prev) => (prev + 1) % apartments.length);
  const prevApt = () => setCurrentApt((prev) => (prev - 1 + apartments.length) % apartments.length);

  const slides = [
    {
      title: "Live in the Heart of Seminyak",
      text: "Where everyday convenience meets world-class lifestyle — all within walking distance.",
      tag: "01",
      label: "Five-star living",
      value: "five-star" as Page
    },
    {
      title: "Healthy living",
      text: "From daily yoga and reformer Pilates to sauna, cold bath, and IV therapy — everything is designed to help you feel your best, every day.",
      tag: "02",
      label: "Healthy living",
      value: "healthy" as Page
    },
    {
      title: "Easy living",
      text: "In the heart of Seminyak, minutes from the beach and Sunset Road. Experience the freedom of long-stay living with zero stress.",
      tag: "03",
      label: "Easy living",
      value: "easy" as Page
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Fetch Hero
    fetch('/api/images?category=hero')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) setHeroImage(data[0].url);
      });

    // Fetch Apartments
    const fetchUnitImages = async () => {
      const unitTypes = ['solo', 'studio', 'soho'];
      const results = await Promise.all(unitTypes.map(t => fetch(`/api/images?category=${t}`).then(res => res.json())));
      const imgs = results.map((data, i) => data[0] || {
        id: -1,
        url: `https://picsum.photos/seed/${unitTypes[i]}-apt/1920/1080`,
        category: unitTypes[i],
        alt: `${unitTypes[i].toUpperCase()} Apartment`,
        created_at: new Date().toISOString()
      });
      setApartmentImages(imgs);
    };
    fetchUnitImages();

    // Fetch General
    fetch('/api/images?category=general')
      .then(res => res.json())
      .then(data => setGeneralImages(data));
  }, []);

  const openGallery = (type: string, startIndex: number) => {
    const images = apartmentImages.length > 0
      ? apartmentImages.map(img => img.url)
      : [
        "https://picsum.photos/seed/solo-apt/1920/1080",
        "https://picsum.photos/seed/studio-apt/1920/1080",
        "https://picsum.photos/seed/soho-apt/1920/1080"
      ];
    setSelectedApt({ type, images });
  };

  return (
    <div className="w-full">
      <AnimatePresence>
        {selectedApt && (
          <ApartmentGallery
            type={selectedApt.type}
            images={selectedApt.images}
            onClose={() => setSelectedApt(null)}
          />
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full"
          >
            <EditableImage
              src={heroImage}
              alt="TS Residence Exterior"
              category="hero"
              className="w-full h-full"
              onImageChange={setHeroImage}
            />
            <div className="absolute inset-0 bg-black/30" />
          </motion.div>
        </AnimatePresence>

        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <span className="text-white/70 text-sm uppercase tracking-[0.5em] font-medium block mb-4">
                {slides[currentSlide].tag} {slides[currentSlide].title}
              </span>
              <h1 className="text-white text-6xl md:text-8xl lg:text-9xl font-serif leading-none italic">
                {slides[currentSlide].title}
              </h1>
              <p className="text-white/90 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed mt-8">
                {slides[currentSlide].text}
              </p>
            </motion.div>
          </AnimatePresence>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12 bg-white text-ts-ink px-10 py-4 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-ts-accent hover:text-white transition-all duration-300 shadow-xl"
            onClick={() => setPage('contact')}
          >
            Book Apartment
          </motion.button>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex space-x-4 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1 transition-all duration-500 ${i === currentSlide ? 'w-12 bg-white' : 'w-4 bg-white/30'}`}
            />
          ))}
        </div>
      </section>

      <section className="section-padding bg-ts-bg text-center">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="w-px h-24 bg-ts-accent/20 mx-auto" />
          <h2 className="text-3xl md:text-5xl text-ts-accent leading-tight font-serif italic">
            TS RESIDENCE is a new living concept by TS Suites that combines Five-star, Healthy and Easy living by living in Seminyak's premier location.
          </h2>
          <p className="text-xl md:text-2xl text-ts-accent/80 font-light max-w-3xl mx-auto">
            Apartments designed for monthly rentals, for your hassle-free long-stay in Bali.
          </p>

          <div className="pt-20 space-y-16">
            <h3 className="text-4xl md:text-6xl font-serif text-ts-ink italic">Why Seminyak for long-term stay?</h3>
            <div className="max-w-3xl mx-auto space-y-8 text-left">
              {[
                { icon: "📍", text: "Strategically located with fast access to everything" },
                { icon: "🚶", text: "Safe, expat-friendly, and walkable" },
                { icon: "☕", text: "Vibrant mix of culture, wellness, dining, and digital-friendly cafes" },
                { icon: "🏥", text: "Well-developed infrastructure (hospital, co-working, retail)" },
                { icon: "🏖️", text: "Breathtaking Beaches at Your Doorstep" }
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-6 border-b border-ts-accent/10 pb-6 group hover:translate-x-2 transition-transform">
                  <span className="text-3xl opacity-80">{item.icon}</span>
                  <span className="text-lg md:text-xl text-ts-muted">{item.text}</span>
                </div>
              ))}
            </div>
            <div className="pt-10">
              <button 
                onClick={() => setPage('contact')}
                className="bg-[#966b4d] text-white px-14 py-5 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-ts-ink transition-all shadow-xl"
              >
                Book Apartment
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* Apartment Slider Section (Matching User Screenshot) */}
      <section className="relative h-screen w-full overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentApt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full"
          >
            <EditableImage
              src={apartments[currentApt].img}
              alt={apartments[currentApt].name}
              category={apartments[currentApt].page}
              className="w-full h-full"
              onImageChange={(url) => updateApartmentImage(currentApt, url)}
            >
              {(src: string) => (
                <img
                  src={src}
                  alt={apartments[currentApt].name}
                  className="w-full h-full object-cover opacity-60"
                  referrerPolicy="no-referrer"
                />
              )}
            </EditableImage>
          </motion.div>
        </AnimatePresence>

        {/* Content Overlays matching 155% scale and 100% layout */}
        <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-between px-12 md:px-24 py-32 z-10 pointer-events-none">
          {/* Left Content: Name & SQM */}
          <div className="relative pl-12 md:pl-20 mt-auto md:mt-0">
            {/* Vertical Orange Bar */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[70%] w-3 md:w-5 bg-[#e47c24]" />
            <motion.div
              key={`left-${currentApt}`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="pointer-events-auto"
            >
              <h3 className="text-white text-[100px] md:text-[180px] lg:text-[240px] font-serif leading-[0.7] mb-4 tracking-tighter">
                {apartments[currentApt].name}
              </h3>
              <p className="text-white text-4xl md:text-7xl lg:text-9xl font-serif lowercase italic opacity-90 pr-12">
                {apartments[currentApt].sqm}
              </p>
            </motion.div>
          </div>

          {/* Right Content: Details */}
          <div className="text-right mt-12 md:mt-auto md:mb-20">
            <motion.div
              key={`right-${currentApt}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-4 pointer-events-auto"
            >
              <h4 className="text-white text-3xl md:text-6xl lg:text-8xl font-serif">
                {apartments[currentApt].bed}
              </h4>
              <p className="text-white text-2xl md:text-4xl lg:text-6xl font-serif opacity-80">
                {apartments[currentApt].furnishing}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Slider Controls */}
        <div className="absolute bottom-12 right-12 flex space-x-6 z-30">
          <button
            onClick={prevApt}
            className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all group"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={nextApt}
            className="w-16 h-16 rounded-full border border-white/30 bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-all group"
          >
            <ChevronRight size={32} />
          </button>
        </div>

        {/* Action Button */}
        <div className="absolute bottom-12 left-12 z-30">
          <button
            onClick={() => setPage(apartments[currentApt].page)}
            className="bg-white text-ts-ink px-10 py-5 rounded-full text-xs font-bold uppercase tracking-[0.3em] hover:bg-ts-accent hover:text-white transition-all shadow-2xl"
          >
            Explore {apartments[currentApt].name}
          </button>
        </div>
      </section>

      {/* Target Audience */}
      <section className="section-padding bg-ts-bg">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-5xl md:text-7xl leading-tight">
              TS RESIDENCE is for people like you.
            </h2>
            <p className="text-lg text-ts-muted max-w-md">
              Whatever your reason for staying, TS RESIDENCE is ready to welcome you home.
            </p>
            <button onClick={() => setPage('contact')} className="btn-primary px-10 py-4 text-xs uppercase tracking-widest">Book Apartment</button>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
              <EditableImage
                src={getGenImg(1, "https://picsum.photos/seed/young-family/800/1000")}
                alt="Young Families"
                category="general"
                className="w-full h-full"
                onImageChange={(url) => updateGeneralImage(1, url)}
              >
                {(src: string) => (
                  <img
                    src={src}
                    alt="Young Families"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                )}
              </EditableImage>
            </div>
            <div className="mt-8 space-y-2">
              <h4 className="text-2xl">Young Families</h4>
              <p className="text-sm text-ts-muted">Safe, connected, and complete with wellness & convenience.</p>
              <div className="flex space-x-4 pt-4">
                <button className="p-2 rounded-full border border-ts-border hover:bg-ts-accent hover:text-white transition-all">
                  <ChevronLeft size={20} />
                </button>
                <button className="p-2 rounded-full border border-ts-border hover:bg-ts-accent hover:text-white transition-all">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const GalleryPage = () => {
  const [images, setImages] = useState<DBImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch('/api/images');
        const data = await res.json();
        setImages(data);
      } catch (err) {
        console.error('Error fetching gallery images:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  const categories = [
    { name: 'TS Residence', handle: '@tsresidences', filter: 'residence', avatar: 'https://picsum.photos/seed/avatar1/100/100' },
    { name: 'Apartments', handle: '@tsresidences', filter: 'apartments', avatar: 'https://picsum.photos/seed/avatar2/100/100' },
    { name: 'Facilities', handle: '@tssuitesseminyak', filter: 'five-star', avatar: 'https://picsum.photos/seed/avatar3/100/100' },
    { name: 'No.1 Wellness Club', handle: '@nolwellnessclub', filter: 'healthy', avatar: 'https://picsum.photos/seed/avatar4/100/100' },
  ];

  return (
    <div className="pt-32 pb-40 px-6 md:px-12 lg:px-24 max-w-[1400px] mx-auto">
      <div className="mb-24">
        <h1 className="text-7xl md:text-8xl lg:text-9xl font-serif text-[#a68266] mb-4">Gallery</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
        {categories.map((cat) => {
          const catImages = images.filter(img => img.category === cat.filter);
          const displayImg = catImages.length > 0 ? catImages[0].url : `https://picsum.photos/seed/${cat.filter}/1200/800`;

          return (
            <div key={cat.name} className="space-y-8">
              <div className="flex items-center space-x-5">
                <div className="w-14 h-14 rounded-full overflow-hidden border border-[#1a1a1a]/5">
                  <img src={cat.avatar} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-lg font-sans font-bold text-[#1a1a1a]">
                      {cat.name}
                    </h4>
                    <div className="w-4 h-4 bg-[#3897f0] rounded-full flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 text-white fill-current">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm font-sans text-[#1a1a1a]/50">{cat.handle}</p>
                </div>
              </div>

              <EditableImage
                src={displayImg}
                alt={cat.name}
                category={cat.filter}
                className="aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl group cursor-pointer relative"
                onImageChange={() => {
                  setLoading(true);
                  fetch('/api/images')
                    .then(res => res.json())
                    .then(data => setImages(data))
                    .catch(err => console.error('Error fetching gallery images:', err))
                    .finally(() => setLoading(false));
                }}
              >
                {(src: string) => (
                  <>
                    <img
                      src={src}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </>
                )}
              </EditableImage>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const OffersPage = () => {
  const [images, setImages] = useState<DBImage[]>([]);

  useEffect(() => {
    const fetchOfferImages = async () => {
      try {
        const res = await fetch('/api/images?category=offers');
        const data = await res.json();
        setImages(data);
      } catch (err) {
        console.error('Error fetching offers images:', err);
      }
    };
    fetchOfferImages();
  }, []);

  const defaultOffers = [
    { title: 'SPECIAL OFFER OPENING CELEBRATION', desc: 'STAY 3 MONTHS, PAY 2 MONTHS on all Apartment categories.', img: 'https://picsum.photos/seed/offer1-ts/1920/800' },
    { title: 'SPECIAL OFFER EASY PAY', desc: 'Stay for MORE THAN 3 MONTHS and simply make a 20% upfront payment of the total rental cost. The remaining 80% shall be paid in advance each month through out the lease period to ensure a fixed rental rate and duration to KEEP YOUR CASH-FLOW.', img: 'https://picsum.photos/seed/offer2-ts/1920/800' },
    { title: 'SPECIAL OFFER FOR RESIDENTS', desc: 'Get 15% Discount in TS Suites for F&B and Retail Services and Shop.', img: 'https://picsum.photos/seed/offer3-ts/1920/800' },
    { title: 'SPECIAL OFFER FOR RESIDENTS', desc: 'Get 15% Discount in No.1 Wellness Club on Massage, Wellness and F&B.', img: 'https://picsum.photos/seed/offer4-ts/1920/800' },
  ];

  const displayOffers = images.length > 0
    ? images.map((img, i) => ({
      title: img.alt || defaultOffers[i]?.title || `OFFER ${i + 1}`,
      desc: defaultOffers[i]?.desc || 'Contact us for more details about this special offer.',
      img: img.url
    }))
    : defaultOffers;

  return (
    <div className="pt-32 pb-0">
      <div className="px-6 md:px-12 lg:px-24 mb-24 max-w-[1600px] mx-auto">
        <h1 className="text-7xl md:text-9xl font-serif text-[#a68266]">Offers</h1>
      </div>

      <div className="space-y-0">
        {displayOffers.map((offer, i) => (
          <div key={i} className="relative h-[85vh] w-full overflow-hidden group">
            <EditableImage
              src={offer.img}
              alt={offer.title}
              category="offers"
              className="absolute inset-0 w-full h-full"
              onImageChange={() => {
                fetch('/api/images?category=offers')
                  .then(res => res.json())
                  .then(data => setImages(data))
                  .catch(err => console.error('Error fetching offers images:', err));
              }}
            >
              {(src: string) => (
                <img
                  src={src}
                  alt={offer.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              )}
            </EditableImage>
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/55 transition-colors duration-1000" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-8 z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-3xl space-y-10"
              >
                <h3 className="text-3xl md:text-5xl lg:text-6xl uppercase tracking-[0.25em] font-serif leading-tight">{offer.title}</h3>
                <p className="text-sm md:text-base lg:text-lg font-light tracking-[0.15em] max-w-2xl mx-auto leading-relaxed">{offer.desc}</p>
                <div className="pt-10">
                  <button className="bg-white text-[#1a1a1a] px-14 py-5 rounded-full text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-[#a68266] hover:text-white transition-all duration-500 transform hover:-translate-y-2 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">Claim your Deal</button>
                </div>
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ApartmentGallery = ({ type, images, onClose }: { type: string, images: string[], onClose: () => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col"
    >
      <div className="absolute top-6 right-6 z-10">
        <button onClick={onClose} className="text-white p-2 hover:bg-white/10 rounded-full transition-colors">
          <X size={32} />
        </button>
      </div>

      <div className="flex-grow relative flex items-center justify-center p-4 md:p-20">
        <button onClick={prev} className="absolute left-6 z-10 text-white p-4 hover:bg-white/10 rounded-full transition-colors">
          <ChevronLeft size={48} />
        </button>

        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`${type} gallery ${currentIndex}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-full max-h-full object-contain shadow-2xl"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>

        <button onClick={next} className="absolute right-6 z-10 text-white p-4 hover:bg-white/10 rounded-full transition-colors">
          <ChevronRight size={48} />
        </button>
      </div>

      <div className="p-10 text-center text-white">
        <h2 className="text-4xl font-serif mb-2">{type}</h2>
        <p className="text-sm text-white/60 uppercase tracking-widest">{currentIndex + 1} / {images.length}</p>
        <div className="flex justify-center space-x-2 mt-6">
          {images.map((_, i) => (
            <div
              key={i}
              className={`h-1 transition-all duration-300 ${i === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/20'}`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const FiveStarPage = () => {
  const [heroImage, setHeroImage] = useState('https://picsum.photos/seed/ts-fivestar/1920/1080');
  const [facilityImages, setFacilityImages] = useState([
    'https://picsum.photos/seed/pool2/800/600',
    'https://picsum.photos/seed/gym2/800/600',
    'https://picsum.photos/seed/bar2/800/600',
    'https://picsum.photos/seed/shop2/800/600',
  ]);

  useEffect(() => {
    const fetchFiveStarImages = async () => {
      try {
        const res = await fetch('/api/images?category=five-star');
        const data = await res.json();
        if (data?.length) {
          setHeroImage(data[0].url || heroImage);
          setFacilityImages(prev => prev.map((img, i) => data[i + 1]?.url || img));
        }
      } catch (err) {
        console.error('Error fetching five-star images:', err);
      }
    };
    fetchFiveStarImages();
  }, []);

  const updateFacilityImage = (index: number, url: string) => {
    setFacilityImages(prev => {
      const next = [...prev];
      next[index] = url;
      return next;
    });
  };

  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center">
        <EditableImage
          src={heroImage}
          alt="Five Star Living"
          category="five-star"
          className="absolute inset-0 w-full h-full"
          onImageChange={setHeroImage}
        >
          {(src: string) => (
            <img
              src={src}
              alt="Five Star Living"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </EditableImage>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative text-center px-6 z-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-white text-5xl md:text-8xl lg:text-9xl font-serif max-w-6xl mx-auto leading-[1.1] italic"
          >
            Make five-star living your everyday experience
          </motion.h1>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-32 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-5xl mx-auto text-center space-y-16">
          <div className="w-px h-32 bg-[#1a1a1a]/10 mx-auto" />
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl lg:text-4xl text-ts-accent leading-[1.6] font-serif font-light italic max-w-4xl mx-auto"
          >
            At TS Residence, you don't just live — you live with the full privileges of a five-star hotel, all under one roof. Enjoy the TS Suites hotel access just next door, with exclusive access to facilities designed for residents who expect more.
          </motion.h2>
        </div>
      </section>

      {/* Facilities Showcase */}
      <section className="py-40 px-6 md:px-12 lg:px-24 bg-[#f8f5f1]">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { title: 'TS Suites Coworking Space' },
              { title: 'TSTORE' },
              { title: 'Christophe C Salon' },
              { title: 'TS Suites Bar' }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="space-y-6"
              >
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl group cursor-pointer">
                  <EditableImage
                    src={facilityImages[idx]}
                    alt={item.title}
                    category="five-star"
                    className="w-full h-full"
                    onImageChange={(url) => updateFacilityImage(idx, url)}
                  >
                    {(src: string) => (
                      <img
                        src={src}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                    )}
                  </EditableImage>
                </div>
                <h4 className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-[#1a1a1a]">
                  {item.title}
                </h4>
              </motion.div>
            ))}
          </div>

          <div className="flex space-x-6 mt-16">
            <button className="p-4 rounded-full border border-[#1a1a1a]/10 hover:bg-white hover:shadow-xl transition-all duration-300 group">
              <ChevronLeft size={24} className="text-[#1a1a1a]/40 group-hover:text-[#1a1a1a]" />
            </button>
            <button className="p-4 rounded-full border border-[#1a1a1a]/10 hover:bg-white hover:shadow-xl transition-all duration-300 group">
              <ChevronRight size={24} className="text-[#1a1a1a]/40 group-hover:text-[#1a1a1a]" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

const BreakfastMenu = () => {
  const menuItems = [
    { name: "Pancakes", desc: "Fluffy pancakes served with maple syrup and fresh berries.", price: "Rp 85,000", tag: "Healthy Option" },
    { name: "Avocado Toast", desc: "Smashed avocado on sourdough with poached eggs and chili flakes.", price: "Rp 95,000", tag: "Signature" },
    { name: "Açaí Bowl", desc: "Organic açaí topped with granola, banana, and Dragon Fruit.", price: "Rp 75,000", tag: "Vegan" },
    { name: "Egg Florentine", desc: "Poached eggs on English muffin with spinach and hollandaise.", price: "Rp 110,000", tag: "Five Star" },
  ];

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-white rounded-[3rem] shadow-sm mb-20 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-serif text-ts-accent mb-4">Breakfast Menu</h2>
        <p className="text-sm uppercase tracking-widest text-ts-muted">Start your day the Five-star way</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
        {menuItems.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="flex justify-between items-start border-b border-ts-border pb-6 group hover:border-ts-accent transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <h4 className="text-xl font-medium">{item.name}</h4>
                {item.tag && (
                  <span className="text-[8px] uppercase tracking-widest bg-ts-bg px-2 py-0.5 rounded-full text-ts-accent font-bold">
                    {item.tag}
                  </span>
                )}
              </div>
              <p className="text-sm text-ts-muted max-w-xs">{item.desc}</p>
            </div>
            <span className="font-serif text-lg text-ts-accent">{item.price}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const HealthyLivingPage = () => {
  const [heroImage, setHeroImage] = useState('https://picsum.photos/seed/healthy/1000/1200');

  useEffect(() => {
    const fetchHealthyImage = async () => {
      try {
        const res = await fetch('/api/images?category=healthy');
        const data = await res.json();
        if (data?.length) {
          setHeroImage(data[0].url || heroImage);
        }
      } catch (err) {
        console.error('Error fetching healthy image:', err);
      }
    };
    fetchHealthyImage();
  }, []);

  return (
    <div className="pt-32 pb-20">
      <section className="px-6 md:px-12 lg:px-24 mb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-ts-accent italic leading-tight">
              Healthy living
            </h1>
            <div className="space-y-6">
              <p className="text-xl text-ts-muted font-light leading-relaxed">
                TS RESIDENCE is a new living concept by TS Suites that combines Five-star, Healthy and Easy living by living in Seminyak's premier location.
              </p>
              <h2 className="text-3xl md:text-5xl font-serif text-ts-accent italic">No.1 Wellness Club at TS Residence in Seminyak</h2>
              <p className="text-xl text-ts-accent font-serif italic">You are our number one. Your well-being is our number one.</p>
              <p className="text-lg text-ts-muted max-w-lg leading-relaxed">
                No.1 Wellness Club is a space for rejuvenation, recovery, and mindful activity. Where the body regains its strength, the mind finds calm, and your energy returns to its natural No.1 state.
              </p>
            </div>
          </div>
          <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl">
            <EditableImage
              src={heroImage}
              alt="No.1 Wellness Club"
              category="healthy"
              className="w-full h-full"
              onImageChange={setHeroImage}
            />
          </div>
        </div>
      </section>

      <div className="w-px h-32 bg-ts-accent/10 mx-auto mb-32" />
    </div>
  );
};

const EasyLivingPage = () => {
  return (
    <div className="pt-32 pb-20 px-6 md:px-12 lg:px-24">
      <section className="mb-20 text-center">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="w-px h-24 bg-ts-accent/20 mx-auto" />
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-ts-accent italic leading-tight">
            Easy living
          </h1>
          <p className="text-xl md:text-2xl text-ts-muted font-light max-w-4xl mx-auto">
            TS RESIDENCE is a new living concept by TS Suites that combines Five-star, Healthy and Easy living by living in Seminyak's premier location.
          </p>
          <p className="text-lg text-ts-muted max-w-2xl mx-auto italic">
            Apartments designed for monthly rentals, for your hassle-free long-stay in Bali.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 mt-32">
          {[
            { title: "Location", desc: "Walking distance to Seminyak Beach and Sunset Road. The best of Bali at your doorstep." },
            { title: "Convenience", desc: "Flexible monthly leases and personalized concierge to handle your daily needs stress-free." },
            { title: "Security", desc: "Enjoy peace of mind with our 24/7 professional security team and secure residential access." }
          ].map((item, i) => (
            <div key={i} className="text-center space-y-4">
              <div className="text-4xl font-serif text-ts-accent italic mb-6">0{i + 1}</div>
              <h4 className="text-2xl font-serif italic text-ts-accent">{item.title}</h4>
              <p className="text-sm text-ts-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-40 aspect-[21/9] rounded-[3rem] overflow-hidden shadow-2xl max-w-[1600px] mx-auto">
          <img
            src="https://picsum.photos/seed/seminyak-location/1920/800"
            alt="Seminyak Location"
            className="w-full h-full object-cover"
          />
        </div>
      </section>
    </div>
  );
};

const AdminPage = () => {
  const [images, setImages] = useState<DBImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState('general');
  const [alt, setAlt] = useState('');
  const [editingImage, setEditingImage] = useState<DBImage | null>(null);

  const fetchImages = async () => {
    const res = await fetch('/api/images');
    const data = await res.json();
    setImages(data);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const resetForm = () => {
    setSelectedFile(null);
    setCategory('general');
    setAlt('');
    setEditingImage(null);
  };

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();

    setUploading(true);
    const formData = new FormData();
    if (selectedFile) {
      formData.append('image', selectedFile);
    }
    formData.append('category', category);
    formData.append('alt', alt);

    try {
      const url = editingImage ? `/api/images/${editingImage.id}` : '/api/images';
      const method = editingImage ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        body: formData,
      });
      if (res.ok) {
        resetForm();
        fetchImages();
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    try {
      const res = await fetch(`/api/images/${id}`, { method: 'DELETE' });
      if (res.ok) fetchImages();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleEditImage = (img: DBImage) => {
    setEditingImage(img);
    setCategory(img.category);
    setAlt(img.alt);
    setSelectedFile(null);
  };

  return (
    <div className="pt-32 pb-20 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
      <h1 className="text-4xl font-serif mb-10">Image Management System</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Upload/Edit Form */}
        <div className="lg:col-span-1 bg-white p-8 rounded-2xl border border-ts-border shadow-sm h-fit">
          <h2 className="text-xl font-bold mb-6">{editingImage ? 'Edit Image' : 'Upload New Image'}</h2>
          {editingImage && (
            <div className="mb-4 aspect-video rounded-lg overflow-hidden border border-ts-border">
              <img src={editingImage.url} alt={editingImage.alt} className="w-full h-full object-cover" />
            </div>
          )}
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold">File {editingImage && '(leave empty to keep current)'}</label>
              <input
                type="file"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full text-sm"
                accept="image/*"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border-b border-ts-border py-2 outline-none focus:border-ts-accent"
              >
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
              <label className="text-xs uppercase tracking-widest font-bold">Alt Text / Title</label>
              <input
                type="text"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="Describe the image"
                className="w-full border-b border-ts-border py-2 outline-none focus:border-ts-accent"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={uploading || (!selectedFile && !editingImage)}
                className="btn-primary flex-1 py-3 disabled:opacity-50"
              >
                {uploading ? 'Saving...' : (editingImage ? 'Update Image' : 'Upload Image')}
              </button>
              {editingImage && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-3 border border-ts-border rounded-lg hover:bg-ts-bg transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Image List */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold">Stored Images ({images.length})</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img) => (
              <div
                key={img.id}
                onClick={() => handleEditImage(img)}
                className="group relative aspect-square rounded-xl overflow-hidden border border-ts-border bg-ts-bg cursor-pointer hover:ring-2 hover:ring-ts-accent transition-all"
              >
                <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                  <p className="text-white text-[10px] uppercase tracking-widest mb-1">{img.category}</p>
                  <p className="text-white/70 text-[8px] truncate w-full mb-2">Click to edit</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(img.id);
                    }}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
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

const ContactPage = () => {
  const [hallwayImage, setHallwayImage] = useState('https://picsum.photos/seed/ts-hallway/1200/1200');

  useEffect(() => {
    const fetchContactImage = async () => {
      try {
        const res = await fetch('/api/images?category=contact');
        const data = await res.json();
        if (data?.length) {
          setHallwayImage(data[0].url || hallwayImage);
        }
      } catch (err) {
        console.error('Error fetching contact image:', err);
      }
    };
    fetchContactImage();
  }, []);

  return (
    <div className="pt-32 pb-20 px-6 md:px-12 lg:px-24 max-w-[1600px] mx-auto">
      <div className="mb-24">
        <h1 className="text-6xl md:text-7xl lg:text-8xl leading-tight mb-20 text-ts-accent font-serif italic">Let’s talk about your long-stay</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 font-bold">Phone / WA</p>
            <p className="text-xl md:text-2xl">+62 811 1902 8111</p>
            <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 font-bold pt-4">Telegram</p>
            <p className="text-xl md:text-2xl">+62 811 1902 8111</p>
          </div>
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 font-bold">Email address</p>
            <p className="text-xl md:text-2xl">tsresidence@townsquare.co.id</p>
          </div>
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 font-bold">Address</p>
            <p className="text-xl md:text-2xl leading-relaxed text-ts-accent/80">Jl. Nakula No.18, Legian, Seminyak, Bali.</p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start bg-[#f8f5f1] p-8 md:p-16 lg:p-24 rounded-[2.5rem] mb-32">
        <div className="lg:col-span-5 h-full">
          <div className="aspect-[4/5] md:aspect-square lg:aspect-auto lg:h-full min-h-[400px] overflow-hidden rounded-2xl">
            <EditableImage
              src={hallwayImage}
              alt="TS Residence Hallway"
              category="contact"
              className="w-full h-full"
              onImageChange={setHallwayImage}
            >
              {(src: string) => (
                <img
                  src={src}
                  alt="TS Residence Hallway"
                  className="w-full h-full object-cover"
                />
              )}
            </EditableImage>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-serif text-[#1a1a1a]">Looking for a long term stay?</h2>
            <p className="text-base text-[#1a1a1a]/60">Tell us what you're looking for — and our team will get back to you with personalized recommendations.</p>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#1a1a1a]">First Name</label>
              <input type="text" placeholder="First Name" className="w-full border-b border-[#1a1a1a]/10 py-3 focus:border-[#a68266] outline-none transition-colors bg-transparent text-sm placeholder:text-[#1a1a1a]/30" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#1a1a1a]">Last Name</label>
              <input type="text" placeholder="Last Name" className="w-full border-b border-[#1a1a1a]/10 py-3 focus:border-[#a68266] outline-none transition-colors bg-transparent text-sm placeholder:text-[#1a1a1a]/30" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#1a1a1a]">Email</label>
              <input type="email" placeholder="Email" className="w-full border-b border-[#1a1a1a]/10 py-3 focus:border-[#a68266] outline-none transition-colors bg-transparent text-sm placeholder:text-[#1a1a1a]/30" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#1a1a1a]">Phone (optional)</label>
              <input type="text" placeholder="Phone number" className="w-full border-b border-[#1a1a1a]/10 py-3 focus:border-[#a68266] outline-none transition-colors bg-transparent text-sm placeholder:text-[#1a1a1a]/30" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#1a1a1a]">Stay duration (optional)</label>
              <div className="relative">
                <select className="w-full border-b border-[#1a1a1a]/10 py-3 focus:border-[#a68266] outline-none transition-colors bg-transparent text-sm appearance-none">
                  <option>Monthly</option>
                  <option>Quarterly</option>
                  <option>Yearly</option>
                </select>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronLeft className="-rotate-90 text-[#1a1a1a]/40" size={16} />
                </div>
              </div>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#1a1a1a]">Message (optional)</label>
              <textarea placeholder="Type your message here..." rows={4} className="w-full border-b border-[#1a1a1a]/10 py-3 focus:border-[#a68266] outline-none transition-colors resize-none bg-transparent text-sm placeholder:text-[#1a1a1a]/30" />
            </div>
            <div className="md:col-span-2 pt-6">
              <button type="button" className="bg-[#946c4f] text-white px-10 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#7a5c43] transition-all transform hover:-translate-y-1 shadow-lg shadow-[#946c4f]/20">Send inquiry</button>
            </div>
          </form>
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="mt-32 pt-24 border-t border-[#1a1a1a]/10">
        <h2 className="text-3xl md:text-4xl mb-16 font-serif">Terms & Condition</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24 text-[12px] text-[#1a1a1a]/60 leading-relaxed">
          <div className="col-span-1 lg:col-span-2 space-y-12">
            <div>
              <h4 className="text-[#1a1a1a] font-bold uppercase tracking-[0.2em] mb-6">Terms of Payment</h4>
              <ol className="list-decimal pl-4 space-y-4">
                <li>Rental cost paid monthly in advance, by latest on 25th day of the current month. First payment shall be made before Lease Commencement Date.</li>
                <li>Refundable Security Deposit, in amount of 1 (one) month rental cost, shall be paid before Lease Commencement Date, together with the first payment of rental cost.</li>
                <li>All Costs paid are applicable to tax and service charge.</li>
              </ol>
            </div>
            <div>
              <h4 className="text-[#1a1a1a] font-bold uppercase tracking-[0.2em] mb-6">Additional Cost (paid separately)</h4>
              <ol className="list-decimal pl-4 space-y-2">
                <li>Electricity</li>
              </ol>
            </div>
          </div>

          <div className="space-y-12">
            <div>
              <h4 className="text-[#1a1a1a] font-bold uppercase tracking-[0.2em] mb-6">Included in Rental Cost</h4>
              <ol className="list-decimal pl-4 space-y-4">
                <li>All units fully furnished</li>
                <li>Access to public area facilities : Pool, Gym, Restaurant/Lounge, Business Center at TS Suites hotel</li>
                <li>Parking spot for 1 (one) vehicle</li>
                <li>Room Mechanical, Electrical, & Plumbing maintenance periodically.</li>
                <li>Internet connection</li>
                <li>TV</li>
                <li>Water usage</li>
                <li>Concierge services</li>
              </ol>
            </div>
          </div>

          <div className="space-y-12">
            <div>
              <h4 className="text-[#1a1a1a] font-bold uppercase tracking-[0.2em] mb-6">Optional/Add on Services</h4>
              <ol className="list-decimal pl-4 space-y-4">
                <li>Laundry</li>
                <li>Housekeeping</li>
                <li>Breakfast</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ApartmentPage = ({ type }: { type: 'solo' | 'studio' | 'soho' }) => {
  const [heroImage, setHeroImage] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const content = {
    solo: {
      title: "SOLO Apartment (1 bedroom)",
      sqm: "36 sqm",
      bed: "1 bedroom",
      desc: "A compact yet premium living space designed for solo explorers or business travelers. Experience the perfect blend of luxury and efficiency in the heart of Seminyak.",
      features: ["Rain Shower", "Smart TV", "Designer Kitchen", "Private Balcony", "High-speed Wi-Fi"]
    },
    studio: {
      title: "STUDIO Apartment (1 Bedroom)",
      sqm: "48 sqm",
      bed: "1 Bedroom",
      desc: "Our Studio apartments offer a spacious and elegant living environment. Perfectly suited for couples or individuals who appreciate more room to live and work.",
      features: ["Spacious Living Area", "King Size Bed", "Full Kitchen", "Large Balcony", "Premium Sound System"]
    },
    soho: {
      title: "SOHO Apartment (2 Bedrooms)",
      sqm: "80 sqm",
      bed: "2 Bedrooms",
      desc: "The ultimate residential experience. Our 2-bedroom SOHO apartments provide superior space and privacy, perfect for small families or those staying longer.",
      features: ["2 Master Bedrooms", "2 Ensuite Bathrooms", "Dining Space", "Wrap-around Balcony", "Washing Machine"]
    }
  };

  const current = content[type];

  useEffect(() => {
    const fetchAptData = async () => {
      try {
        const res = await fetch(`/api/images?category=${type}`);
        const data: DBImage[] = await res.json();
        if (data.length) {
          setHeroImage(data[0].url);
          setImages(data.map(img => img.url));
        } else {
          setHeroImage(`https://picsum.photos/seed/${type}/1920/1080`);
          setImages([`https://picsum.photos/seed/${type}1/1200/800`, `https://picsum.photos/seed/${type}2/1200/800`]);
        }
      } catch (err) {
        console.error('Error fetching apartment images:', err);
      }
    };
    fetchAptData();
  }, [type]);

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative h-[80vh] flex items-center justify-center">
        <EditableImage
          src={heroImage}
          alt={current.title}
          category={type}
          className="absolute inset-0 w-full h-full"
          onImageChange={setHeroImage}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative text-center z-10 px-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white text-6xl md:text-8xl lg:text-9xl font-serif italic"
          >
            {current.title}
          </motion.h1>
          <p className="text-white/80 text-sm uppercase tracking-[0.5em] mt-8 font-bold">
            {current.sqm} | {current.bed} | Fully Furnished
          </p>
          <p className="text-white/60 text-lg mt-12 max-w-2xl mx-auto font-light">
            85 Units of modern, spacious, premium design apartments.
          </p>
        </div>
      </section>

      {/* Details */}
      <section className="py-32 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div className="space-y-12">
            <h2 className="text-4xl md:text-5xl font-serif text-ts-accent italic">Exceptional living space</h2>
            <p className="text-lg text-ts-muted leading-relaxed max-w-lg">
              {current.desc}
            </p>
            <div className="grid grid-cols-2 gap-8">
              {current.features.map((feature, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-ts-accent rounded-full" />
                  <span className="text-sm uppercase tracking-widest font-bold">{feature}</span>
                </div>
              ))}
            </div>
            <button className="bg-ts-ink text-white px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-ts-accent transition-all">
              Book this apartment
            </button>
          </div>
          <div className="grid grid-cols-1 gap-10">
            {images.slice(0, 2).map((img, i) => (
              <div key={i} className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <img src={img} alt={`${current.title} ${i}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default function App() {
  const [page, setPage] = useState<Page>('home');

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  // Admin Shortcut: Ctrl + Shift + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setPage('admin');
      }
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
            transition={{ duration: 0.5 }}
          >
            {page === 'home' && <HomePage setPage={setPage} />}
            {page === 'apartments' && <HomePage setPage={setPage} />}
            {page === 'solo' && <ApartmentPage type="solo" />}
            {page === 'studio' && <ApartmentPage type="studio" />}
            {page === 'soho' && <ApartmentPage type="soho" />}
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

      {/* Floating WhatsApp Button */}
      <a
        href="#"
        className="fixed bottom-8 right-8 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300"
      >
        <MessageCircle size={24} />
      </a>
    </div>
  );
}
