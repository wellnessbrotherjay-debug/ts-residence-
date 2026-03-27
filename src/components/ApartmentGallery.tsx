import { ChevronRight, ChevronLeft, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

export const ApartmentGallery = ({ type, images, onClose }: { type: string; images: string[]; onClose: () => void }) => {
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
