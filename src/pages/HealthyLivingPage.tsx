import { useState, useEffect } from 'react';
import { FadeInView } from '../components/animations';
import { EditableImage } from '../components/EditableImage';

export const HealthyLivingPage = () => {
  const [heroImage, setHeroImage] = useState('https://picsum.photos/seed/healthy/1000/1200');

  useEffect(() => {
    fetch('/api/images?category=healthy').then(r => r.json()).then(d => {
      if (d?.[0]) setHeroImage(d[0].url);
    }).catch(console.error);
  }, []);

  return (
    <div className="pt-32 pb-20">
      <section className="px-6 md:px-10 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <FadeInView direction="left">
            <div className="space-y-10">
              <div>
                <span className="label-caps text-gold">Wellness & Recovery</span>
                <h1 className="heading-display text-5xl md:text-6xl lg:text-7xl text-ink mt-4">Healthy Living</h1>
              </div>
              <p className="text-body max-w-lg">
                TS Residence combines five-star luxury with holistic wellness in Seminyak's premier location.
              </p>
              <div>
                <h2 className="text-2xl md:text-3xl font-serif text-ink mb-3">No.1 Wellness Club</h2>
                <p className="text-sm font-serif text-gold italic mb-4">You are our number one. Your well-being is our number one.</p>
                <p className="text-body max-w-lg">
                  A space for rejuvenation, recovery, and mindful activity. Where the body regains its strength, the mind finds calm, and your energy returns to its natural state.
                </p>
              </div>
            </div>
          </FadeInView>
          <FadeInView direction="right">
            <div className="aspect-[4/5] overflow-hidden">
              <EditableImage src={heroImage} alt="No.1 Wellness Club" category="healthy" className="w-full h-full" onImageChange={setHeroImage} />
            </div>
          </FadeInView>
        </div>
      </section>
    </div>
  );
};
