import { MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import type { Page } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { GalleryPage } from './pages/GalleryPage';
import { OffersPage } from './pages/OffersPage';
import { FiveStarPage } from './pages/FiveStarPage';
import { HealthyLivingPage } from './pages/HealthyLivingPage';
import { EasyLivingPage } from './pages/EasyLivingPage';
import { AdminPage } from './pages/AdminPage';
import { ContactPage } from './pages/ContactPage';
import { ApartmentPage } from './pages/ApartmentPage';

export default function App() {
  const [page, setPage] = useState<Page>('home');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

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
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            {page === 'home' && <HomePage setPage={setPage} />}
            {page === 'apartments' && <HomePage setPage={setPage} />}
            {page === 'solo' && <ApartmentPage type="solo" setPage={setPage} />}
            {page === 'studio' && (
              <ApartmentPage type="studio" setPage={setPage} />
            )}
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
