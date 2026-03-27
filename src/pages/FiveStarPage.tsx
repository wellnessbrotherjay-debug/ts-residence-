import { useState, useEffect } from 'react';
import {
  FadeInView,
  StaggerContainer,
  StaggerItem,
} from '../components/animations';
import { EditableImage } from '../components/EditableImage';

export const FiveStarPage = () => {
  const [heroImage, setHeroImage] = useState(
    'https://picsum.photos/seed/ts-fivestar/1920/1080',
  );
  const [facilityImages, setFacilityImages] = useState([
    'https://picsum.photos/seed/pool2/800/600',
    'https://picsum.photos/seed/gym2/800/600',
    'https://picsum.photos/seed/bar2/800/600',
    'https://picsum.photos/seed/shop2/800/600',
  ]);

  useEffect(() => {
    fetch('/api/images?category=five-star')
      .then((r) => r.json())
      .then((d) => {
        if (d?.length) {
          setHeroImage((current) => d[0].url || current);
          setFacilityImages((prev) =>
            prev.map((img, i) => d[i + 1]?.url || img),
          );
        }
      })
      .catch(console.error);
  }, []);

  const facilities = [
    { title: 'TS Suites Coworking Space' },
    { title: 'TSTORE' },
    { title: 'Christophe C Salon' },
    { title: 'TS Suites Bar' },
  ];

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative h-[85vh] flex items-center justify-center">
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />
        <div className="relative text-center px-6 z-10">
          <FadeInView>
            <span className="label-caps text-gold-light mb-6 block">
              Luxury Redefined
            </span>
            <h1 className="text-white heading-display text-5xl md:text-7xl lg:text-8xl max-w-4xl mx-auto">
              Five-Star Living, Every Day
            </h1>
          </FadeInView>
        </div>
      </section>

      {/* Intro */}
      <section className="section-pad bg-cream">
        <div className="max-w-3xl mx-auto text-center">
          <FadeInView>
            <div className="w-px h-20 bg-gold/30 mx-auto mb-10" />
            <h2 className="text-2xl md:text-3xl font-serif text-ink leading-relaxed">
              At TS Residence, you don't just live — you live with the full
              privileges of a five-star hotel. Enjoy exclusive access to TS
              Suites facilities designed for residents who expect more.
            </h2>
          </FadeInView>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="section-pad bg-white">
        <div className="max-w-[1400px] mx-auto">
          <StaggerContainer
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
            staggerDelay={0.1}
          >
            {facilities.map((item, idx) => (
              <StaggerItem key={idx}>
                <div className="img-zoom aspect-[4/3] mb-4 cursor-pointer">
                  <EditableImage
                    src={facilityImages[idx]}
                    alt={item.title}
                    category="five-star"
                    className="w-full h-full"
                    onImageChange={(url) =>
                      setFacilityImages((prev) => {
                        const n = [...prev];
                        n[idx] = url;
                        return n;
                      })
                    }
                  >
                    {(src: string) => (
                      <img
                        src={src}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </EditableImage>
                </div>
                <h4 className="label-caps text-ink">{item.title}</h4>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
};
