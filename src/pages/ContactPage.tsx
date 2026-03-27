import { useState, useEffect } from 'react';
import { BTN_SOLID } from '../constants';
import { FadeInView } from '../components/animations';
import { EditableImage } from '../components/EditableImage';

export const ContactPage = () => {
  const [hallwayImage, setHallwayImage] = useState('https://picsum.photos/seed/ts-hallway/1200/1200');

  useEffect(() => {
    fetch('/api/images?category=contact').then(r => r.json()).then(d => {
      if (d?.[0]) setHallwayImage(d[0].url);
    }).catch(console.error);
  }, []);

  return (
    <div className="pt-32 pb-20 px-6 md:px-10 max-w-[1400px] mx-auto">
      <FadeInView className="mb-20">
        <span className="label-caps text-gold">Get in Touch</span>
        <h1 className="heading-display text-5xl md:text-6xl lg:text-7xl text-ink mt-4 mb-16">
          Let's talk about your long-stay
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-3">
            <p className="label-caps">Phone / WhatsApp</p>
            <p className="text-xl md:text-2xl font-serif text-ink">+62 811 1902 8111</p>
            <p className="label-caps pt-4">Telegram</p>
            <p className="text-xl md:text-2xl font-serif text-ink">+62 811 1902 8111</p>
          </div>
          <div className="space-y-3">
            <p className="label-caps">Email</p>
            <p className="text-xl md:text-2xl font-serif text-ink">tsresidence@townsquare.co.id</p>
          </div>
          <div className="space-y-3">
            <p className="label-caps">Address</p>
            <p className="text-xl md:text-2xl font-serif text-ink leading-relaxed">Jl. Nakula No.18, Legian, Seminyak, Bali</p>
          </div>
        </div>
      </FadeInView>

      {/* Form */}
      <FadeInView className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start bg-white p-8 md:p-14 lg:p-20 mb-24">
        <div className="lg:col-span-5 h-full">
          <div className="aspect-[4/5] md:aspect-square lg:aspect-auto lg:h-full min-h-[400px] overflow-hidden">
            <EditableImage src={hallwayImage} alt="TS Residence" category="contact" className="w-full h-full" onImageChange={setHallwayImage}>
              {(src: string) => <img src={src} alt="TS Residence" className="w-full h-full object-cover" />}
            </EditableImage>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif text-ink mb-3">Looking for a long-term stay?</h2>
            <p className="text-body">Tell us what you're looking for — our team will get back to you with personalized recommendations.</p>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            {[
              { label: 'First Name', type: 'text', placeholder: 'First Name' },
              { label: 'Last Name', type: 'text', placeholder: 'Last Name' },
              { label: 'Email', type: 'email', placeholder: 'Email address' },
              { label: 'Phone (optional)', type: 'text', placeholder: 'Phone number' },
            ].map((field) => (
              <div key={field.label} className="space-y-2">
                <label className="label-caps text-ink">{field.label}</label>
                <input type={field.type} placeholder={field.placeholder} className="w-full border-b border-border py-3 focus:border-gold outline-none transition-colors bg-transparent text-sm placeholder:text-muted/40" />
              </div>
            ))}
            <div className="md:col-span-2 space-y-2">
              <label className="label-caps text-ink">Stay Duration</label>
              <select className="w-full border-b border-border py-3 focus:border-gold outline-none transition-colors bg-transparent text-sm appearance-none">
                <option>Monthly</option>
                <option>Quarterly</option>
                <option>Yearly</option>
              </select>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="label-caps text-ink">Message (optional)</label>
              <textarea placeholder="Type your message here..." rows={4} className="w-full border-b border-border py-3 focus:border-gold outline-none transition-colors resize-none bg-transparent text-sm placeholder:text-muted/40" />
            </div>
            <div className="md:col-span-2 pt-4">
              <button type="button" className={BTN_SOLID}>Send Inquiry</button>
            </div>
          </form>
        </div>
      </FadeInView>

      {/* Terms */}
      <div className="pt-20 border-t border-border">
        <h2 className="text-2xl md:text-3xl font-serif text-ink mb-14">Terms & Conditions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 text-[12px] text-muted leading-relaxed">
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h4 className="label-caps text-ink mb-4">Terms of Payment</h4>
              <ol className="list-decimal pl-4 space-y-3">
                <li>Rental cost paid monthly in advance, by latest on 25th day of the current month.</li>
                <li>Refundable Security Deposit of 1 month rental cost, paid before Lease Commencement Date.</li>
                <li>All costs are applicable to tax and service charge.</li>
              </ol>
            </div>
            <div>
              <h4 className="label-caps text-ink mb-4">Additional Cost</h4>
              <ol className="list-decimal pl-4 space-y-2"><li>Electricity</li></ol>
            </div>
          </div>
          <div>
            <h4 className="label-caps text-ink mb-4">Included in Rental</h4>
            <ol className="list-decimal pl-4 space-y-3">
              <li>All units fully furnished</li>
              <li>Access to Pool, Gym, Restaurant, Business Center at TS Suites</li>
              <li>Parking spot for 1 vehicle</li>
              <li>Maintenance periodically</li>
              <li>Internet, TV, Water, Concierge</li>
            </ol>
          </div>
          <div>
            <h4 className="label-caps text-ink mb-4">Optional Services</h4>
            <ol className="list-decimal pl-4 space-y-3">
              <li>Laundry</li>
              <li>Housekeeping</li>
              <li>Breakfast</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
