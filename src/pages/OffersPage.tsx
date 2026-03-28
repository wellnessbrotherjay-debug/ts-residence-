import { useState, useEffect } from 'react';
import {
  FadeInView,
  StaggerContainer,
  StaggerItem,
} from '../components/animations';
import { EditableImage } from '../components/EditableImage';
import type { DBImage } from '../types';

export const OffersPage = () => {
  const [images, setImages] = useState<DBImage[]>([]);

  useEffect(() => {
    fetch('/api/images?category=offers')
      .then((r) => r.json())
      .then((d) => setImages(d))
      .catch(console.error);
  }, []);

  const defaultOffers = [
    {
      title: 'Opening Celebration',
      desc: 'Stay 3 months, pay 2 months on all apartment categories.',
      img: 'https://picsum.photos/seed/offer1-ts/1920/800',
    },
    {
      title: 'Easy Pay',
      desc: 'Stay more than 3 months — 20% upfront, rest paid monthly to keep your cash flow.',
      img: 'https://picsum.photos/seed/offer2-ts/1920/800',
    },
    {
      title: 'Resident Dining',
      desc: '15% discount at TS Suites for all F&B and retail services.',
      img: 'https://picsum.photos/seed/offer3-ts/1920/800',
    },
    {
      title: 'Wellness Discount',
      desc: '15% discount at No.1 Wellness Club on massage, wellness, and F&B.',
      img: 'https://picsum.photos/seed/offer4-ts/1920/800',
    },
  ];

  const displayOffers =
    images.length > 0
      ? images.map((img, i) => ({
          title: img.alt || defaultOffers[i]?.title || `Offer ${i + 1}`,
          desc: defaultOffers[i]?.desc || '',
          img: img.url,
        }))
      : defaultOffers;

  return (
    <div className="pt-32 pb-0">
      <div className="px-6 md:px-10 mb-20 max-w-[1400px] mx-auto">
        <FadeInView>
          <span className="label-caps text-gold">Exclusive Deals</span>
          <h1 className="heading-display text-5xl md:text-6xl lg:text-7xl text-ink mt-4">
            Special Offers
          </h1>
        </FadeInView>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pb-20">
        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
          staggerDelay={0.15}
        >
          {displayOffers.map((offer, i) => (
            <StaggerItem key={i}>
              <div className="group cursor-pointer">
                <div className="relative aspect-[16/10] overflow-hidden mb-6">
                  <EditableImage
                    src={offer.img}
                    alt={offer.title}
                    category="offers"
                    className="w-full h-full"
                    onImageChange={() => {
                      fetch('/api/images?category=offers')
                        .then((r) => r.json())
                        .then((d) => setImages(d))
                        .catch(console.error);
                    }}
                  >
                    {(src: string) => (
                      <img
                        src={src}
                        alt={offer.title}
                        className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </EditableImage>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="label-caps text-gold-light">
                      Special Offer
                    </span>
                  </div>
                </div>
                <h3 className="text-2xl font-serif text-ink group-hover:text-gold transition-colors mb-2">
                  {offer.title}
                </h3>
                <p className="text-body">{offer.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </div>
  );
};
