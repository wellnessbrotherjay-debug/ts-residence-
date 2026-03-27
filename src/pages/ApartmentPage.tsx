import { useState, useEffect } from 'react';
import { BTN_SOLID } from '../constants';
import { FadeInView } from '../components/animations';
import { EditableImage } from '../components/EditableImage';
import type { Page, DBImage } from '../types';

export const ApartmentPage = ({ type, setPage }: { type: 'solo' | 'studio' | 'soho'; setPage: (p: Page) => void }) => {
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
