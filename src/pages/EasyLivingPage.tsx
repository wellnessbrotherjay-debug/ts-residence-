import {
  FadeInView,
  StaggerContainer,
  StaggerItem,
} from '../components/animations';

export const EasyLivingPage = () => (
  <div className="pt-32 pb-20">
    <section className="px-6 md:px-10 max-w-[1400px] mx-auto text-center">
      <FadeInView>
        <span className="label-caps text-gold">Convenience & Freedom</span>
        <h1 className="heading-display text-5xl md:text-6xl lg:text-7xl text-ink mt-4 mb-6">
          Easy Living
        </h1>
        <p className="text-body max-w-2xl mx-auto mb-6">
          Apartments designed for monthly rentals, for your hassle-free
          long-stay in Bali.
        </p>
      </FadeInView>

      <StaggerContainer
        className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 mt-20 max-w-5xl mx-auto"
        staggerDelay={0.15}
      >
        {[
          {
            title: 'Location',
            desc: 'Walking distance to Seminyak Beach and Sunset Road. The best of Bali at your doorstep.',
          },
          {
            title: 'Convenience',
            desc: 'Flexible monthly leases and personalized concierge to handle your daily needs stress-free.',
          },
          {
            title: 'Security',
            desc: '24/7 professional security team and secure residential access for total peace of mind.',
          },
        ].map((item, i) => (
          <StaggerItem key={i}>
            <div className="text-center space-y-4">
              <span className="text-4xl font-serif text-gold">0{i + 1}</span>
              <h4 className="text-xl font-serif text-ink">{item.title}</h4>
              <p className="text-body">{item.desc}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <FadeInView className="mt-24">
        <div className="aspect-[21/9] overflow-hidden max-w-[1200px] mx-auto">
          <img
            src="https://picsum.photos/seed/seminyak-location/1920/800"
            alt="Seminyak Location"
            className="w-full h-full object-cover"
          />
        </div>
      </FadeInView>
    </section>
  </div>
);
