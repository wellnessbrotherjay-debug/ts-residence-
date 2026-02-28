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
type Page = 'home' | 'apartments' | 'offers' | 'gallery' | 'contact' | 'admin' | 'five-star' | 'healthy' | 'easy';

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
    { label: 'Admin', value: 'admin' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/90 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'}`}>
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center cursor-pointer py-4"
          onClick={() => setPage('home')}
        >
          <div className="relative flex flex-col items-center">
            <div className="relative h-16 w-16">
              <span className="text-6xl font-serif font-light text-inherit leading-none absolute top-0 left-0">T</span>
              <span className="text-6xl font-serif font-light text-inherit leading-none absolute top-3 left-4">S</span>
            </div>
            <span className="text-[8px] tracking-[0.5em] uppercase text-inherit font-sans font-black -mt-1 ml-4">Residence</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setPage(item.value)}
              className={`text-white/90 text-[11px] md:text-[12px] xl:text-[13px] uppercase tracking-widest hover:text-white transition-colors ${currentPage === item.value ? 'font-semibold' : ''}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
          <button className="px-8 py-3 rounded-full bg-[#966b4d]/80 text-white text-[13px] uppercase tracking-widest hover:bg-[#966b4d] transition-all">
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
            <li><button onClick={() => setPage('home')} className="hover:text-ts-accent transition-colors">Five-star living</button></li>
            <li><button onClick={() => setPage('home')} className="hover:text-ts-accent transition-colors">Healthy living</button></li>
            <li><button onClick={() => setPage('home')} className="hover:text-ts-accent transition-colors">Easy living</button></li>
            <li><button onClick={() => setPage('gallery')} className="hover:text-ts-accent transition-colors">Gallery</button></li>
            <li><button className="hover:text-ts-accent transition-colors">Journal</button></li>
            <li><button onClick={() => setPage('contact')} className="hover:text-ts-accent transition-colors">Contact</button></li>
            <li><button className="hover:text-ts-accent transition-colors">Terms & Conditions</button></li>
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
          <span>© 2026 TS RESIDENCE</span>
          <a href="#" className="hover:text-ts-ink">Privacy Policy</a>
        </div>
        <button onClick={() => setPage('admin')} className="hover:text-ts-ink opacity-50 hover:opacity-100">Admin</button>
      </div>
    </footer>
  );
};

const HomePage = ({ setPage }: { setPage: (p: Page) => void }) => {
  const [heroImage, setHeroImage] = useState<string>('https://picsum.photos/seed/ts-res-hero/1920/1080');
  const [apartmentImages, setApartmentImages] = useState<DBImage[]>([]);
  const [generalImages, setGeneralImages] = useState<DBImage[]>([]);
  const [selectedApt, setSelectedApt] = useState<{ type: string, images: string[] } | null>(null);

  useEffect(() => {
    // Fetch Hero
    fetch('/api/images?category=hero')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) setHeroImage(data[0].url);
      });

    // Fetch Apartments
    fetch('/api/images?category=apartments')
      .then(res => res.json())
      .then(data => setApartmentImages(data));

    // Fetch General
    fetch('/api/images?category=general')
      .then(res => res.json())
      .then(data => setGeneralImages(data));
  }, []);

  const getAptImg = (index: number, fallback: string) => {
    return apartmentImages[index]?.url || fallback;
  };

  const getGenImg = (index: number, fallback: string) => {
    return generalImages[index]?.url || fallback;
  };

  const updateApartmentImage = (index: number, url: string) => {
    setApartmentImages(prev => {
      const next = [...prev];
      const fallbackAlt = ['SOLO Apartment', 'STUDIO Apartment', 'SOHO Apartment'][index] || 'Apartment';
      next[index] = {
        id: next[index]?.id ?? Date.now() + index,
        url,
        category: 'apartments',
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
        <EditableImage
          src={heroImage}
          alt="TS Residence Exterior"
          category="hero"
          className="absolute inset-0 w-full h-full"
          onImageChange={setHeroImage}
        />
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white text-7xl md:text-9xl font-serif mb-8"
          >
            Five-star living
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white/90 max-w-3xl text-xl md:text-2xl font-light leading-relaxed mb-12"
          >
            Enjoy full access to TS Suites Hotel — rooftop infinity pool, 24/7 gym, leisure club, salon, and designer retail — all just steps from your door.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white text-ts-ink px-12 py-4 rounded-full text-sm font-semibold tracking-widest uppercase hover:bg-ts-accent hover:text-white transition-all duration-300 shadow-xl"
          >
            Book Apartment
          </motion.button>
        </div>

        {/* Bottom Nav Hint */}
        <div className="absolute bottom-16 left-0 w-full z-10 flex justify-center items-center px-6">
          <div className="flex items-center space-x-8 md:space-x-16">
            {[
              { label: 'Apartments', value: 'apartments' as Page },
              { label: 'Five-star living', value: 'five-star' as Page },
              { label: 'Healthy living', value: 'healthy' as Page },
              { label: 'Easy living', value: 'easy' as Page }
            ].map((item, index, array) => (
              <div key={item.label} className="flex items-center">
                <button
                  onClick={() => setPage(item.value)}
                  className="text-white/90 text-xs md:text-sm uppercase tracking-[0.2em] font-medium hover:text-white transition-all duration-300"
                >
                  {item.label}
                </button>
                {index < array.length - 1 && (
                  <div className="ml-8 md:ml-16 w-px h-6 bg-white/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="section-padding bg-ts-bg text-center">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="w-px h-24 bg-ts-accent/20 mx-auto" />
          <h2 className="text-3xl md:text-5xl text-ts-accent leading-tight">
            TS RESIDENCE is a new living concept by TS Suites that combines Five Star, Healthy and Easy Living by being in Seminyak's premier location.
          </h2>
          <p className="text-xl md:text-2xl text-ts-accent/80 font-light italic">
            Apartments designed for monthly rental for your indefinite long stay in Bali.
          </p>

          <div className="flex flex-wrap justify-center gap-8 md:gap-16 pt-10">
            {[
              { label: 'Five-star living', value: 'five-star' as Page },
              { label: 'Healthy living', value: 'healthy' as Page },
              { label: 'Easy living', value: 'easy' as Page }
            ].map((item, i) => (
              <button
                key={item.label}
                onClick={() => setPage(item.value)}
                className={`text-2xl md:text-4xl font-serif ${i === 0 ? 'text-ts-ink border-b-2 border-ts-accent pb-2' : 'text-ts-muted hover:text-ts-ink transition-colors'}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-10">
            <p className="text-xs uppercase tracking-widest font-bold mb-4">Comfort of five-star living</p>
            <p className="text-sm text-ts-muted max-w-xl mx-auto leading-relaxed">
              Stay within the complex of the renowned TS Suites Hotel and enjoy full access to 5-star facilities and amenities. Everything you love about hotel living — now part of your daily lifestyle.
            </p>
          </div>
        </div>

        <div className="mt-20 rounded-2xl overflow-hidden shadow-2xl max-w-6xl mx-auto aspect-[16/9]">
          <EditableImage
            src={getGenImg(0, "https://picsum.photos/seed/ts-residence-garden/1200/800")}
            alt="Tropical Garden"
            category="general"
            className="w-full h-full"
            onImageChange={(url) => updateGeneralImage(0, url)}
          >
            {(src: string) => (
              <img
                src={src}
                alt="Tropical Garden"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            )}
          </EditableImage>
        </div>
      </section>

      {/* Apartment Types */}
      <section className="bg-white">
        <div className="section-padding text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-ts-accent font-bold mb-4">Discover the five star living</p>
          <h2 className="text-4xl md:text-5xl text-ts-accent mb-20">66 Units of modern, spacious premium design apartments.</h2>
        </div>

        {/* SOLO */}
        <div className="relative h-[80vh] overflow-hidden">
          <EditableImage
            src={getAptImg(0, "https://picsum.photos/seed/solo-apt/1920/1080")}
            alt="SOLO Apartment"
            category="apartments"
            className="absolute inset-0 w-full h-full"
            onImageChange={(url) => updateApartmentImage(0, url)}
          >
            {(src) => (
              <>
                <img
                  src={src}
                  alt="SOLO Apartment"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/30" />
              </>
            )}
          </EditableImage>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
            <h3 className="text-5xl md:text-6xl mb-4">SOLO Apartment</h3>
            <p className="text-sm uppercase tracking-widest font-bold mb-8">1 bedroom, 36 sqm</p>
            <div className="flex space-x-4">
              <button className="bg-white text-ts-ink px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-ts-accent hover:text-white transition-all">Book Apartment</button>
              <button
                onClick={() => openGallery('SOLO Apartment', 0)}
                className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-ts-ink transition-all"
              >
                View details
              </button>
            </div>
          </div>
        </div>

        {/* STUDIO */}
        <div className="relative h-[80vh] overflow-hidden">
          <EditableImage
            src={getAptImg(1, "https://picsum.photos/seed/studio-apt/1920/1080")}
            alt="STUDIO Apartment"
            category="apartments"
            className="absolute inset-0 w-full h-full"
            onImageChange={(url) => updateApartmentImage(1, url)}
          >
            {(src: string) => (
              <>
                <img
                  src={src}
                  alt="STUDIO Apartment"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/30" />
              </>
            )}
          </EditableImage>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
            <h3 className="text-5xl md:text-6xl mb-4">STUDIO Apartment</h3>
            <p className="text-sm uppercase tracking-widest font-bold mb-8">1 bedroom, 48 sqm</p>
            <div className="flex space-x-4">
              <button className="bg-white text-ts-ink px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-ts-accent hover:text-white transition-all">Book Apartment</button>
              <button
                onClick={() => openGallery('STUDIO Apartment', 1)}
                className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-ts-ink transition-all"
              >
                View details
              </button>
            </div>
          </div>
        </div>

        {/* SOHO */}
        <div className="relative h-[80vh] overflow-hidden">
          <EditableImage
            src={getAptImg(2, "https://picsum.photos/seed/soho-apt/1920/1080")}
            alt="SOHO Apartment"
            category="apartments"
            className="absolute inset-0 w-full h-full"
            onImageChange={(url) => updateApartmentImage(2, url)}
          >
            {(src: string) => (
              <>
                <img
                  src={src}
                  alt="SOHO Apartment"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/30" />
              </>
            )}
          </EditableImage>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
            <h3 className="text-5xl md:text-6xl mb-4">SOHO Apartment</h3>
            <p className="text-sm uppercase tracking-widest font-bold mb-8">2 bedroom, 80 sqm</p>
            <div className="flex space-x-4">
              <button className="bg-white text-ts-ink px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-ts-accent hover:text-white transition-all">Book Apartment</button>
              <button
                onClick={() => openGallery('SOHO Apartment', 2)}
                className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-ts-ink transition-all"
              >
                View details
              </button>
            </div>
          </div>
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
    { name: 'TS Suites', handle: '@tssuitesseminyak', filter: 'suites', avatar: 'https://picsum.photos/seed/avatar2/100/100' },
    { name: 'TS Social Club', handle: '@tssocialclub', filter: 'social', avatar: 'https://picsum.photos/seed/avatar3/100/100' },
    { name: 'No.1 Wellness Club', handle: '@nolwellnessclub', filter: 'wellness', avatar: 'https://picsum.photos/seed/avatar4/100/100' },
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
            className="text-2xl md:text-4xl lg:text-5xl text-[#8e6b52] leading-[1.4] font-serif font-light"
          >
            At TS Residence, you don’t just live — you live with the full privileges of a five-star hotel, all under one roof. Enjoy the TS Suites hotel access just next door, with exclusive access to facilities designed for residents who expect more.
          </motion.h2>
        </div>
      </section>

      {/* Facilities Showcase */}
      <section className="py-40 px-6 md:px-12 lg:px-24 bg-[#f8f5f1]">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { title: 'TS Suites Rooftop Infinity Pool' },
              { title: 'TS Suites Gym' },
              { title: 'TS Suites Bar' },
              { title: 'Le Petit Shop' }
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
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-9xl mb-10 font-serif text-ts-accent"
        >
          Healthy living
        </motion.h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl order-2 lg:order-1">
            <EditableImage
              src={heroImage}
              alt="Healthy living"
              category="healthy"
              className="w-full h-full"
              onImageChange={setHeroImage}
            >
              {(src: string) => (
                <img src={src} alt="Healthy living" className="w-full h-full object-cover" />
              )}
            </EditableImage>
          </div>
          <div className="space-y-8 order-1 lg:order-2">
            <p className="text-2xl font-light leading-relaxed text-ts-muted">
              Wellness is not an option, it's a lifestyle. At TS Residence, we provide the environment and facilities to keep you at your best.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-ts-bg rounded-2xl border border-ts-border">
                <h4 className="text-xl mb-2">24/7 Gym</h4>
                <p className="text-sm text-ts-muted">State-of-the-art equipment available whenever you need it.</p>
              </div>
              <div className="p-8 bg-ts-bg rounded-2xl border border-ts-border">
                <h4 className="text-xl mb-2">Wellness Club</h4>
                <p className="text-sm text-ts-muted">Access to No.1 Wellness Club for massage and treatments.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const EasyLivingPage = () => {
  return (
    <div className="pt-32 pb-20">
      <section className="px-6 md:px-12 lg:px-24 mb-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-9xl mb-10 font-serif text-ts-accent"
        >
          Easy living
        </motion.h1>
        <div className="max-w-4xl mx-auto space-y-12 text-center">
          <p className="text-3xl font-light leading-relaxed text-ts-muted italic">
            "Everything you need, right where you are."
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-ts-accent/10 rounded-full flex items-center justify-center mx-auto">
                <MapPin className="text-ts-accent" />
              </div>
              <h4 className="text-xl uppercase tracking-widest">Location</h4>
              <p className="text-sm text-ts-muted">Central Seminyak with direct access to Sunset Road.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-ts-accent/10 rounded-full flex items-center justify-center mx-auto">
                <ChevronRight className="text-ts-accent" />
              </div>
              <h4 className="text-xl uppercase tracking-widest">Flexibility</h4>
              <p className="text-sm text-ts-muted">Flexible monthly leases for long-term stays.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-ts-accent/10 rounded-full flex items-center justify-center mx-auto">
                <MessageCircle className="text-ts-accent" />
              </div>
              <h4 className="text-xl uppercase tracking-widest">Support</h4>
              <p className="text-sm text-ts-muted">24/7 security and concierge at your service.</p>
            </div>
          </div>
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
                <option value="apartments">Apartments</option>
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
        <h1 className="text-6xl md:text-7xl lg:text-8xl leading-tight mb-20 text-[#a68266] font-serif">Let’s talk about your long-stay</h1>

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
            <p className="text-xl md:text-2xl leading-relaxed">Seminyak Jl. Nakula No.18, Legian, Kec. Kuta, Kabupaten Badung, Bali 80361</p>
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

// --- Main App ---

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
