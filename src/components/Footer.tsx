import { Instagram, Send, Phone, MapPin, Mail } from 'lucide-react';
import type { Page } from '../types';

export const Footer = ({ setPage }: { setPage: (p: Page) => void }) => (
  <footer className="bg-dark-bg text-white">
    {/* Main Footer */}
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-20 pb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
        {/* Brand */}
        <div className="lg:col-span-4 space-y-8">
          <div className="flex flex-col items-start gap-0.5">
            <div className="flex items-baseline">
              <span className="text-4xl font-serif font-light text-white">T</span>
              <span className="text-4xl font-serif font-light text-white">S</span>
            </div>
            <span className="text-[8px] tracking-[0.45em] uppercase font-sans font-semibold text-white/50">Residence</span>
          </div>
          <p className="text-white/40 text-sm leading-relaxed max-w-xs">
            A new living concept combining five-star luxury, wellness, and convenience in the heart of Seminyak, Bali.
          </p>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/tsresidences/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all duration-300">
              <Instagram size={16} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all duration-300">
              <Send size={16} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all duration-300">
              <Phone size={16} />
            </a>
          </div>
        </div>

        {/* Stay */}
        <div className="lg:col-span-2">
          <h4 className="text-[11px] uppercase tracking-[0.2em] font-sans font-semibold text-white/60 mb-6">Stay</h4>
          <ul className="space-y-3">
            {[
              { label: 'SOLO Apartment', page: 'solo' as Page },
              { label: 'STUDIO Apartment', page: 'studio' as Page },
              { label: 'SOHO Apartment', page: 'soho' as Page },
              { label: 'Special Offers', page: 'offers' as Page },
            ].map(item => (
              <li key={item.label}>
                <button onClick={() => setPage(item.page)} className="text-white/40 text-sm hover:text-white transition-colors duration-300">
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Experience */}
        <div className="lg:col-span-2">
          <h4 className="text-[11px] uppercase tracking-[0.2em] font-sans font-semibold text-white/60 mb-6">Experience</h4>
          <ul className="space-y-3">
            {[
              { label: 'Five-Star Living', page: 'five-star' as Page },
              { label: 'Wellness Club', page: 'healthy' as Page },
              { label: 'Easy Living', page: 'easy' as Page },
              { label: 'Gallery', page: 'gallery' as Page },
            ].map(item => (
              <li key={item.label}>
                <button onClick={() => setPage(item.page)} className="text-white/40 text-sm hover:text-white transition-colors duration-300">
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="lg:col-span-4">
          <h4 className="text-[11px] uppercase tracking-[0.2em] font-sans font-semibold text-white/60 mb-6">Contact</h4>
          <div className="space-y-4 text-sm text-white/40">
            <p className="flex items-start gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-gold/60" />
              <span>Jl. Nakula No.18, Legian, Seminyak,<br />Kec. Kuta, Kabupaten Badung, Bali 80361</span>
            </p>
            <p className="flex items-center gap-3">
              <Mail size={16} className="shrink-0 text-gold/60" />
              <span>tsresidence@townsquare.co.id</span>
            </p>
            <p className="flex items-center gap-3">
              <Phone size={16} className="shrink-0 text-gold/60" />
              <span>+62 811 1902 8111</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Bottom Bar */}
    <div className="border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap justify-center gap-6 text-[10px] uppercase tracking-[0.15em] text-white/30">
          <span>&copy; {new Date().getFullYear()} TS Residence</span>
          <a href="#" className="hover:text-white/60 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white/60 transition-colors">Terms</a>
        </div>
        <button onClick={() => setPage('admin')} className="text-[10px] uppercase tracking-[0.15em] text-white/10 hover:text-white/40 transition-colors">
          Admin
        </button>
      </div>
    </div>
  </footer>
);
