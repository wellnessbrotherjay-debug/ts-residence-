import { Instagram, Send, Phone, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { BTN_SOLID } from '../constants';
import type { Page } from '../types';

export const Navbar = ({ currentPage, setPage }: { currentPage: Page; setPage: (p: Page) => void }) => {
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
