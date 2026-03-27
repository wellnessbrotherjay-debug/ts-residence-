import { useState, useEffect } from 'react';
import { FadeInView, StaggerContainer, StaggerItem } from '../components/animations';
import { EditableImage } from '../components/EditableImage';
import type { DBImage } from '../types';

export const GalleryPage = () => {
  const [images, setImages] = useState<DBImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/images').then(r => r.json()).then(d => setImages(d)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const categories = [
    { name: 'TS Residence', handle: '@tsresidences', filter: 'residence', avatar: 'https://picsum.photos/seed/avatar1/100/100' },
    { name: 'Apartments', handle: '@tsresidences', filter: 'apartments', avatar: 'https://picsum.photos/seed/avatar2/100/100' },
    { name: 'Facilities', handle: '@tssuitesseminyak', filter: 'five-star', avatar: 'https://picsum.photos/seed/avatar3/100/100' },
    { name: 'No.1 Wellness Club', handle: '@nolwellnessclub', filter: 'healthy', avatar: 'https://picsum.photos/seed/avatar4/100/100' },
  ];

  return (
    <div className="pt-32 pb-40 px-6 md:px-10 max-w-[1400px] mx-auto">
      <FadeInView className="mb-20">
        <span className="label-caps text-gold">Visual Journey</span>
        <h1 className="heading-display text-5xl md:text-6xl lg:text-7xl text-ink mt-4">Gallery</h1>
      </FadeInView>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-20" staggerDelay={0.15}>
        {categories.map((cat) => {
          const catImages = images.filter(img => img.category === cat.filter);
          const displayImg = catImages[0]?.url || `https://picsum.photos/seed/${cat.filter}/1200/800`;

          return (
            <StaggerItem key={cat.name}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-11 h-11 rounded-full overflow-hidden border border-border">
                  <img src={cat.avatar} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-sm font-sans font-semibold text-ink">{cat.name}</h4>
                  <p className="text-xs text-muted">{cat.handle}</p>
                </div>
              </div>
              <div className="img-zoom aspect-[16/10] cursor-pointer relative">
                <EditableImage
                  src={displayImg}
                  alt={cat.name}
                  category={cat.filter}
                  className="w-full h-full"
                  onImageChange={() => {
                    fetch('/api/images').then(r => r.json()).then(d => setImages(d)).catch(console.error);
                  }}
                >
                  {(src: string) => (
                    <img src={src} alt={cat.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  )}
                </EditableImage>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </div>
  );
};
