import { ArrowRight, Star, Dumbbell, Waves } from 'lucide-react';
import { useState, useEffect } from 'react';
import { BTN_GOLD, BTN_LIGHT, BTN_SOLID } from '../constants';
import {
  FadeInView,
  StaggerContainer,
  StaggerItem,
} from '../components/animations';
import { EditableImage } from '../components/EditableImage';
import { HeroSection } from '../components/HeroSection';
import type { Page, DBImage } from '../types';

export const HomePage = ({ setPage }: { setPage: (p: Page) => void }) => {
  const [heroImage, setHeroImage] = useState<string>(
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1920&q=80',
  );
  const [apartmentImages, setApartmentImages] = useState<DBImage[]>([]);
  const [generalImages, setGeneralImages] = useState<DBImage[]>([]);

  const getAptImg = (index: number, fallback: string) =>
    apartmentImages[index]?.url || fallback;
  const getGenImg = (index: number, fallback: string) =>
    generalImages[index]?.url || fallback;

  const updateApartmentImage = (index: number, url: string) => {
    setApartmentImages((prev) => {
      const next = [...prev];
      next[index] = {
        id: next[index]?.id ?? Date.now() + index,
        url,
        category: apartments[index].page,
        alt: apartments[index].name + ' Apartment',
        created_at: next[index]?.created_at || new Date().toISOString(),
      };
      return next;
    });
  };

  const apartments = [
    {
      name: 'SOLO',
      sqm: '36',
      bed: '1 Bedroom',
      desc: 'Compact luxury for solo explorers',
      img: getAptImg(0, 'https://picsum.photos/seed/solo-apt/1920/1080'),
      page: 'solo' as Page,
    },
    {
      name: 'STUDIO',
      sqm: '48',
      bed: '1 Bedroom',
      desc: 'Spacious elegance for couples',
      img: getAptImg(1, 'https://picsum.photos/seed/studio-apt/1920/1080'),
      page: 'studio' as Page,
    },
    {
      name: 'SOHO',
      sqm: '80',
      bed: '2 Bedrooms',
      desc: 'Ultimate space for families',
      img: getAptImg(2, 'https://picsum.photos/seed/soho-apt/1920/1080'),
      page: 'soho' as Page,
    },
  ];

  useEffect(() => {
    fetch('/api/images?category=hero')
      .then((r) => r.json())
      .then((d) => {
        if (d?.[0]) setHeroImage(d[0].url);
      });
    (async () => {
      const types = ['solo', 'studio', 'soho'];
      const results = await Promise.all(
        types.map((t) =>
          fetch(`/api/images?category=${t}`).then((r) => r.json()),
        ),
      );
      setApartmentImages(
        results.map(
          (d, i) =>
            d[0] || {
              id: -1,
              url: `https://picsum.photos/seed/${types[i]}-apt/1920/1080`,
              category: types[i],
              alt: `${types[i].toUpperCase()} Apartment`,
              created_at: new Date().toISOString(),
            },
        ),
      );
    })();
    fetch('/api/images?category=general')
      .then((r) => r.json())
      .then((d) => setGeneralImages(d));
  }, []);

  return (
    <div className="w-full">
      {/* Hero */}
      <HeroSection
        setPage={setPage}
        heroImage={heroImage}
        setHeroImage={setHeroImage}
      />

      {/* Introduction Section */}
      <section className="section-pad bg-cream">
        <div className="max-w-4xl mx-auto text-center">
          <FadeInView>
            <span className="label-caps text-gold">Seminyak, Bali</span>
          </FadeInView>
          <FadeInView delay={0.15}>
            <h2 className="heading-section text-ink mt-6 mb-8">
              A new concept of living that combines five-star luxury, wellness,
              and everyday convenience
            </h2>
          </FadeInView>
          <FadeInView delay={0.3}>
            <p className="text-body max-w-2xl mx-auto">
              TS Residence by TS Suites offers premium apartments designed for
              monthly rentals, creating a hassle-free long-stay experience in
              Bali's most sought-after neighborhood.
            </p>
          </FadeInView>
          <FadeInView delay={0.4}>
            <div className="mt-10">
              <button onClick={() => setPage('contact')} className={BTN_GOLD}>
                Explore More
              </button>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* Three Pillars - Featured Cards */}
      <section className="section-pad bg-white">
        <div className="max-w-[1400px] mx-auto">
          <FadeInView className="text-center mb-16">
            <span className="label-caps text-gold">Our Philosophy</span>
            <h2 className="heading-section text-ink mt-4">
              Three Pillars of Living
            </h2>
          </FadeInView>

          <StaggerContainer
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
            staggerDelay={0.15}
          >
            {[
              {
                title: 'Five-Star Living',
                desc: 'Full privileges of a luxury hotel — coworking, dining, salon, and retail — all at your doorstep.',
                page: 'five-star' as Page,
                img: 'https://picsum.photos/seed/fivestar-card/800/1000',
                icon: <Star size={20} />,
              },
              {
                title: 'Healthy Living',
                desc: 'Daily yoga, reformer Pilates, sauna, cold bath, and IV therapy — designed for your best self.',
                page: 'healthy' as Page,
                img: 'https://picsum.photos/seed/healthy-card/800/1000',
                icon: <Dumbbell size={20} />,
              },
              {
                title: 'Easy Living',
                desc: 'Walking distance to Seminyak Beach, flexible monthly leases, and personalized concierge service.',
                page: 'easy' as Page,
                img: 'https://picsum.photos/seed/easy-card/800/1000',
                icon: <Waves size={20} />,
              },
            ].map((pillar, i) => (
              <StaggerItem key={i}>
                <button
                  onClick={() => setPage(pillar.page)}
                  className="group w-full text-left"
                >
                  <div className="relative aspect-[3/4] overflow-hidden mb-6">
                    <img
                      src={pillar.img}
                      alt={pillar.title}
                      className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <span className="text-white text-[12px] uppercase tracking-[0.2em] font-sans flex items-center gap-2">
                        Discover <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-gold">{pillar.icon}</span>
                    <h3 className="text-xl font-serif text-ink">
                      {pillar.title}
                    </h3>
                  </div>
                  <p className="text-body">{pillar.desc}</p>
                </button>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Featured Split Section */}
      <section className="bg-cream-dark">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
          {/* Image Side */}
          <FadeInView
            direction="left"
            className="relative min-h-[50vh] lg:min-h-full"
          >
            <EditableImage
              src={getGenImg(
                0,
                'https://picsum.photos/seed/seminyak-pool/1200/1400',
              )}
              alt="TS Residence Pool"
              category="general"
              className="absolute inset-0 w-full h-full"
              onImageChange={() => {}}
            />
          </FadeInView>

          {/* Text Side */}
          <div className="flex items-center px-8 md:px-16 lg:px-20 py-20 lg:py-0">
            <div className="max-w-lg">
              <FadeInView direction="right">
                <span className="label-caps text-gold">Why Seminyak</span>
                <h2 className="heading-section text-ink mt-4 mb-8">
                  Live where every day feels extraordinary
                </h2>
              </FadeInView>
              <FadeInView direction="right" delay={0.2}>
                <div className="space-y-6">
                  {[
                    'Strategically located with fast access to everything',
                    'Safe, expat-friendly, and walkable neighborhood',
                    'Vibrant culture, wellness, dining, and digital-friendly cafes',
                    'Well-developed infrastructure — hospital, co-working, retail',
                    'Breathtaking beaches at your doorstep',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 group">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0 group-hover:scale-150 transition-transform" />
                      <p className="text-body group-hover:text-ink transition-colors">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </FadeInView>
              <FadeInView direction="right" delay={0.4}>
                <button
                  onClick={() => setPage('contact')}
                  className={`${BTN_SOLID} mt-10`}
                >
                  Book Apartment
                </button>
              </FadeInView>
            </div>
          </div>
        </div>
      </section>

      {/* Apartments Showcase */}
      <section className="section-pad bg-white">
        <div className="max-w-[1400px] mx-auto">
          <FadeInView className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <span className="label-caps text-gold">Suites & Apartments</span>
              <h2 className="heading-section text-ink mt-4">
                Find Your Perfect Space
              </h2>
            </div>
            <button
              onClick={() => setPage('apartments')}
              className={`${BTN_GOLD} self-start md:self-auto`}
            >
              View All <ArrowRight size={14} className="inline ml-2" />
            </button>
          </FadeInView>

          <StaggerContainer
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
            staggerDelay={0.15}
          >
            {apartments.map((apt, i) => (
              <StaggerItem key={i}>
                <button
                  onClick={() => setPage(apt.page)}
                  className="group w-full text-left"
                >
                  <div className="relative aspect-[4/5] overflow-hidden mb-6">
                    <EditableImage
                      src={apt.img}
                      alt={apt.name}
                      category={apt.page}
                      className="w-full h-full"
                      onImageChange={(url) => updateApartmentImage(i, url)}
                    >
                      {(src: string) => (
                        <img
                          src={src}
                          alt={apt.name}
                          className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </EditableImage>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span className="text-white/60 text-[11px] uppercase tracking-[0.2em] font-sans">
                        {apt.sqm} sqm &middot; {apt.bed}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-serif text-ink group-hover:text-gold transition-colors">
                        {apt.name}
                      </h3>
                      <p className="text-muted text-sm mt-1">{apt.desc}</p>
                    </div>
                    <ArrowRight
                      size={18}
                      className="text-muted group-hover:text-gold group-hover:translate-x-1 transition-all shrink-0"
                    />
                  </div>
                </button>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Offers Preview */}
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        <img
          src="https://picsum.photos/seed/offer-hero/1920/1080"
          alt="Special Offers"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <FadeInView>
            <span className="label-caps text-gold-light mb-6 block">
              Limited Time
            </span>
            <h2 className="text-white heading-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl max-w-3xl mx-auto">
              Special Opening Celebration
            </h2>
            <p className="text-white/60 text-base md:text-lg font-sans font-light mt-6 max-w-xl mx-auto">
              Stay 3 months, pay for 2. Available across all apartment
              categories.
            </p>
            <button
              onClick={() => setPage('offers')}
              className={`${BTN_LIGHT} mt-10`}
            >
              View All Offers
            </button>
          </FadeInView>
        </div>
      </section>

      {/* Target Audience / CTA */}
      <section className="section-pad bg-cream">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <FadeInView direction="left">
            <div className="aspect-[4/5] overflow-hidden">
              <EditableImage
                src={getGenImg(
                  1,
                  'https://picsum.photos/seed/young-family/800/1000',
                )}
                alt="Life at TS Residence"
                category="general"
                className="w-full h-full"
                onImageChange={() => {}}
              >
                {(src: string) => (
                  <img
                    src={src}
                    alt="Life at TS Residence"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                )}
              </EditableImage>
            </div>
          </FadeInView>

          <FadeInView direction="right">
            <span className="label-caps text-gold">Your Home in Bali</span>
            <h2 className="heading-section text-ink mt-4 mb-6">
              TS Residence is for people like you
            </h2>
            <p className="text-body mb-4">
              Whether you're a digital nomad seeking inspiration, a couple
              embracing island life, or a family looking for a safe, connected,
              and complete environment — TS Residence is ready to welcome you
              home.
            </p>
            <div className="space-y-3 mb-10">
              {[
                'Digital nomads & remote workers',
                'Couples & young professionals',
                'Families with children',
                'Long-stay business travelers',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-gold" />
                  <span className="text-sm text-muted">{item}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setPage('contact')} className={BTN_SOLID}>
              Book Apartment
            </button>
          </FadeInView>
        </div>
      </section>
    </div>
  );
};
