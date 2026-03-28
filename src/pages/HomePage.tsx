import { ArrowRight, Dumbbell, Star, Waves } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BTN_GOLD, BTN_LIGHT, BTN_SOLID } from '../constants';
import {
  FadeInView,
  StaggerContainer,
  StaggerItem,
} from '../components/animations';
import { EditableImage } from '../components/EditableImage';
import type { DBImage, Page } from '../types';
import { HeroSectionV2 } from '../components/HeroSectionV2';

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

  const pillars = [
    {
      title: 'Five-Star Living',
      desc: 'Full privileges of a luxury hotel with coworking, dining, salon, and retail in one polished address.',
      page: 'five-star' as Page,
      img: 'https://picsum.photos/seed/fivestar-card/1200/1600',
      icon: <Star size={20} />,
      stat: 'Hotel-grade privileges',
    },
    {
      title: 'Healthy Living',
      desc: 'Daily yoga, reformer Pilates, sauna, cold bath, and IV therapy curated for a restorative routine.',
      page: 'healthy' as Page,
      img: 'https://picsum.photos/seed/healthy-card/1200/1600',
      icon: <Dumbbell size={20} />,
      stat: 'Daily wellness access',
    },
    {
      title: 'Easy Living',
      desc: 'A seamless monthly stay near Seminyak Beach with concierge support and effortless day-to-day convenience.',
      page: 'easy' as Page,
      img: 'https://picsum.photos/seed/easy-card/1200/1600',
      icon: <Waves size={20} />,
      stat: 'Flexible long-stay living',
    },
  ];

  const updateApartmentImage = (index: number, url: string) => {
    setApartmentImages((prev) => {
      const next = [...prev];
      next[index] = {
        id: next[index]?.id ?? Date.now() + index,
        url,
        category: apartments[index].page,
        alt: `${apartments[index].name} Apartment`,
        created_at: next[index]?.created_at || new Date().toISOString(),
      };
      return next;
    });
  };

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
      <HeroSectionV2 heroImage={heroImage} setHeroImage={setHeroImage} />

      <section className="bg-cream px-6 py-24 md:px-12 lg:px-20 lg:py-32 xl:px-28">
        <div className="soft-divider mb-12 md:mb-16" />
        <div className="mx-auto max-w-[1120px] text-center">
          <FadeInView>
            <span className="label-caps text-gold">Seminyak, Bali</span>
          </FadeInView>
          <FadeInView delay={0.15}>
            <h2 className="heading-section mx-auto mt-6 max-w-[980px] text-ink">
              A private address for long stays, where five-star hospitality,
              restorative wellness, and daily convenience are held in perfect
              balance
            </h2>
          </FadeInView>
          <FadeInView delay={0.3}>
            <p className="text-body mx-auto mt-8 max-w-[760px] text-ink-light">
              TS Residence by TS Suites offers premium apartments for monthly
              living, creating a calm and highly serviced experience in one of
              Bali&apos;s most desirable neighborhoods.
            </p>
          </FadeInView>
          <FadeInView delay={0.4}>
            <div className="mt-12 flex justify-center">
              <button onClick={() => setPage('contact')} className={BTN_GOLD}>
                Explore More
              </button>
            </div>
          </FadeInView>
        </div>

        <FadeInView delay={0.5}>
          <div className="mt-16 grid grid-cols-1 border-y border-black/8 md:grid-cols-3">
            {[
              [
                'Prime Address',
                "Steps from Seminyak's best dining, beach clubs, and lifestyle spots",
              ],
              [
                'Wellness Access',
                'Integrated facilities for movement, recovery, and daily self-care',
              ],
              [
                'Long-Stay Ease',
                'Monthly living with hospitality standards and concierge attention',
              ],
            ].map(([title, desc]) => (
              <div
                key={title}
                className="px-6 py-8 text-center md:px-10 lg:px-12 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-black/8 md:[&:not(:last-child)]:border-b-0 md:[&:not(:last-child)]:border-r"
              >
                <p className="label-caps text-gold">{title}</p>
                <p className="mt-4 text-base leading-8 text-ink-light">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </FadeInView>
      </section>

      <section className="bg-white">
        <div className="px-6 py-24 md:px-12 lg:px-20 lg:py-32 xl:px-28">
          <FadeInView className="mx-auto max-w-[920px] text-center">
            <span className="label-caps text-gold">Our Philosophy</span>
            <h2 className="heading-section mt-5 text-ink">
              Three Pillars of Elevated Living
            </h2>
            <p className="text-body mx-auto mt-6 max-w-[720px] text-ink-light">
              The experience is shaped with the same precision as a grand hotel:
              composed service, deeply restorative wellness, and convenience
              that feels quiet rather than transactional.
            </p>
          </FadeInView>
        </div>

        <StaggerContainer
          className="grid grid-cols-1 gap-px bg-black/8 lg:grid-cols-3"
          staggerDelay={0.15}
        >
          {pillars.map((pillar, i) => (
            <StaggerItem key={i} className="bg-white">
              <button
                onClick={() => setPage(pillar.page)}
                className="group block w-full text-left"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={pillar.img}
                    alt={pillar.title}
                    className="h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-7 text-white md:p-9">
                    <p className="label-caps text-white/65">{pillar.stat}</p>
                    <div className="mt-5 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.24em] text-white/90">
                      Discover <ArrowRight size={14} />
                    </div>
                  </div>
                </div>

                <div className="min-h-[280px] px-6 py-8 md:px-8 md:py-10 lg:px-10">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/20 bg-gold/10 text-gold">
                    {pillar.icon}
                  </span>
                  <h3 className="mt-8 font-serif text-[2.1rem] leading-none text-ink md:text-[2.5rem]">
                    {pillar.title}
                  </h3>
                  <p className="mt-5 text-[1.05rem] leading-8 text-ink-light">
                    {pillar.desc}
                  </p>
                </div>
              </button>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      <section className="grid grid-cols-1 bg-cream-dark lg:min-h-[100vh] lg:grid-cols-[1.2fr_0.8fr]">
        <FadeInView
          direction="left"
          className="relative min-h-[58vh] lg:min-h-full"
        >
          <EditableImage
            src={getGenImg(
              0,
              'https://picsum.photos/seed/seminyak-pool/1600/1800',
            )}
            alt="TS Residence Pool"
            category="general"
            className="h-full w-full"
            onImageChange={() => {}}
          >
            {(src: string) => (
              <div className="relative h-full w-full">
                <img
                  src={src}
                  alt="TS Residence Pool"
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white md:p-10 lg:p-14">
                  <p className="label-caps text-white/65">
                    Seminyak Atmosphere
                  </p>
                  <p className="mt-4 max-w-[26rem] font-serif text-[2rem] leading-none md:text-[2.6rem] lg:text-[3.2rem]">
                    Resort calm with city access
                  </p>
                </div>
              </div>
            )}
          </EditableImage>
        </FadeInView>

        <div className="flex items-center px-6 py-20 md:px-12 lg:px-16 lg:py-24 xl:px-20">
          <div className="max-w-[34rem]">
            <FadeInView direction="right">
              <span className="label-caps text-gold">Why Seminyak</span>
              <h2 className="heading-section mt-5 text-ink">
                Live where every day feels extraordinary
              </h2>
              <p className="text-body mt-7 text-ink-light">
                TS Residence places you in a neighborhood that feels both
                indulgent and practical, with the best of Bali always within
                easy reach.
              </p>
            </FadeInView>

            <FadeInView direction="right" delay={0.2}>
              <div className="mt-12 space-y-6 border-t border-black/8 pt-8">
                {[
                  'Strategically located with fast access to everything',
                  'Safe, expat-friendly, and walkable neighborhood',
                  'Vibrant culture, wellness, dining, and digital-friendly cafes',
                  'Well-developed infrastructure with hospital, co-working, and retail',
                  'Breathtaking beaches at your doorstep',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    <p className="text-[1.02rem] leading-8 text-ink-light">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </FadeInView>

            <FadeInView direction="right" delay={0.35}>
              <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-black/8 pt-8">
                {[
                  ['Beach', '8 min'],
                  ['Dining', 'Walkable'],
                  ['Wellness', 'Daily access'],
                  ['Lease', 'Flexible'],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="label-caps text-ink/55">{label}</p>
                    <p className="mt-3 font-serif text-[2rem] leading-none text-ink md:text-[2.4rem]">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </FadeInView>

            <FadeInView direction="right" delay={0.45}>
              <button
                onClick={() => setPage('contact')}
                className={`${BTN_SOLID} mt-12`}
              >
                Book Apartment
              </button>
            </FadeInView>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-24 md:px-12 lg:px-20 lg:py-32 xl:px-28">
        <div className="mb-14 flex flex-col gap-6 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[48rem]">
            <span className="label-caps text-gold">Suites & Apartments</span>
            <h2 className="heading-section mt-5 text-ink">
              Find Your Perfect Space
            </h2>
            <p className="text-body mt-6 max-w-[42rem] text-ink-light">
              Each residence is composed with generous proportions, understated
              finishes, and the comfort of a fully serviced stay.
            </p>
          </div>

          <button
            onClick={() => setPage('apartments')}
            className={`${BTN_GOLD} self-start lg:self-auto`}
          >
            View All <ArrowRight size={14} />
          </button>
        </div>

        <StaggerContainer
          className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10"
          staggerDelay={0.15}
        >
          {apartments.map((apt, i) => (
            <StaggerItem key={i}>
              <div
                onClick={() => setPage(apt.page)}
                onKeyDown={(e) => e.key === 'Enter' && setPage(apt.page)}
                role="button"
                tabIndex={0}
                className="group w-full text-left cursor-pointer"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <EditableImage
                    src={apt.img}
                    alt={apt.name}
                    category={apt.page}
                    className="h-full w-full"
                    onImageChange={(url) => updateApartmentImage(i, url)}
                  >
                    {(src: string) => (
                      <img
                        src={src}
                        alt={apt.name}
                        className="h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.05]"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </EditableImage>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-7 text-white md:p-8">
                    <span className="text-[12px] uppercase tracking-[0.24em] text-white/72">
                      {apt.sqm} sqm &middot; {apt.bed}
                    </span>
                  </div>
                </div>

                <div className="border-x border-b border-black/8 px-6 py-8 md:px-8 md:py-9">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-[2rem] leading-none text-ink md:text-[2.4rem]">
                        {apt.name}
                      </h3>
                      <p className="mt-4 text-[1.02rem] leading-8 text-ink-light">
                        {apt.desc}
                      </p>
                    </div>
                    <ArrowRight
                      size={18}
                      className="mt-1 shrink-0 text-muted transition-all group-hover:translate-x-1 group-hover:text-gold"
                    />
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      <section className="relative min-h-[72vh] overflow-hidden">
        <img
          src="https://picsum.photos/seed/offer-hero/1920/1080"
          alt="Special Offers"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/78 via-black/54 to-black/40" />
        <div className="relative flex min-h-[72vh] items-end px-6 py-12 md:px-12 md:py-16 lg:px-20 lg:py-20 xl:px-28">
          <FadeInView className="max-w-[760px]">
            <span className="label-caps text-gold-light">Limited Time</span>
            <h2 className="heading-display mt-6 text-white text-5xl sm:text-6xl md:text-7xl lg:text-[6.2rem]">
              Special Opening Celebration
            </h2>
            <p className="mt-7 max-w-[640px] text-[1.08rem] leading-8 text-white/76 md:text-[1.16rem] md:leading-9">
              Stay 3 months, pay for 2. Available across all apartment
              categories for a more generous start in Seminyak.
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

      <section className="grid grid-cols-1 bg-cream lg:min-h-[92vh] lg:grid-cols-[0.9fr_1.1fr]">
        <FadeInView
          direction="left"
          className="relative min-h-[56vh] lg:min-h-full"
        >
          <div className="h-full w-full">
            <EditableImage
              src={getGenImg(
                1,
                'https://picsum.photos/seed/young-family/1200/1600',
              )}
              alt="Life at TS Residence"
              category="general"
              className="h-full w-full"
              onImageChange={() => {}}
            >
              {(src: string) => (
                <img
                  src={src}
                  alt="Life at TS Residence"
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              )}
            </EditableImage>
          </div>
        </FadeInView>

        <div className="flex items-center px-6 py-20 md:px-12 lg:px-16 lg:py-24 xl:px-20">
          <FadeInView direction="right" className="max-w-[40rem]">
            <span className="label-caps text-gold">Your Home in Bali</span>
            <h2 className="heading-section mt-5 text-ink">
              TS Residence is composed for modern long-stay living
            </h2>
            <p className="text-body mt-7 max-w-[36rem] text-ink-light">
              Whether you&apos;re a digital nomad seeking inspiration, a couple
              embracing island life, or a family looking for a safe and
              connected base, TS Residence is designed to feel polished,
              practical, and warmly personal.
            </p>

            <div className="mt-12 grid grid-cols-1 gap-px bg-black/8 sm:grid-cols-2">
              {[
                'Digital nomads & remote workers',
                'Couples & young professionals',
                'Families with children',
                'Long-stay business travelers',
              ].map((item, i) => (
                <div key={i} className="bg-cream px-5 py-5">
                  <span className="text-[1rem] leading-7 text-ink-light">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div className="soft-divider my-10" />

            <button onClick={() => setPage('contact')} className={BTN_SOLID}>
              Book Apartment
            </button>
          </FadeInView>
        </div>
      </section>
    </div>
  );
};
