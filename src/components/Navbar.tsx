import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Menu, X, ArrowUpRight } from 'lucide-react';
import { NAV_LINKS } from '../constants/data';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Detect active section
      const sections = ['hero', 'problem', 'story', 'calendar', 'organizers', 'faq'];
      const scrollPos = window.scrollY + 120;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-beige/85 backdrop-blur-md shadow-warm border-b border-beige-dark/40 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#hero"
            className="group flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta rounded-lg p-1"
            aria-label="EVENTO Home"
          >
            <div className="relative w-9 h-9 rounded-xl bg-terracotta text-cream flex items-center justify-center shadow-warm-sm group-hover:scale-105 transition-transform duration-200">
              <Calendar className="w-5 h-5 text-cream" />
              <MapPin className="w-3 h-3 text-cream-pure absolute -bottom-0.5 -right-0.5 drop-shadow-sm fill-cream" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif font-black text-2xl tracking-tight text-charcoal">
                  EVENTO
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-terracotta bg-terracotta-soft/70 px-1.5 py-0.5 rounded">
                  RU
                </span>
              </div>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-cream/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-beige-dark/50 shadow-warm-sm" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-1.5 text-sm font-medium text-charcoal/80 hover:text-terracotta rounded-full transition-colors duration-150 hover:bg-beige/60"
              >
                {link.label}
              </a>
            ))}
            <div className="w-[1px] h-4 bg-beige-dark/60 mx-1" />
            <a
              href="#calendar"
              className={`px-3.5 py-1.5 text-sm font-medium rounded-full transition-all duration-150 ${
                activeSection === 'calendar'
                  ? 'text-terracotta font-semibold bg-terracotta-soft/50'
                  : 'text-mutedbrown hover:text-charcoal'
              }`}
            >
              Month View
            </a>
            <a
              href="#organizers"
              className={`px-3.5 py-1.5 text-sm font-medium rounded-full transition-all duration-150 ${
                activeSection === 'organizers'
                  ? 'text-terracotta font-semibold bg-terracotta-soft/50'
                  : 'text-mutedbrown hover:text-charcoal'
              }`}
            >
              Organizers
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-charcoal hover:text-terracotta border border-charcoal/20 hover:border-terracotta rounded-full transition-all duration-150 shadow-warm-sm bg-cream/80 hover:bg-cream"
            >
              Login
            </a>
            <a
              href="/home"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-cream bg-terracotta hover:bg-terracotta-dark rounded-full transition-all duration-200 shadow-warm hover:shadow-warm-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Explore Events</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href="/login"
              className="px-3 py-1.5 text-xs font-semibold text-charcoal border border-charcoal/20 rounded-full bg-cream/70"
            >
              Login
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 text-charcoal hover:text-terracotta rounded-xl bg-cream/70 border border-beige-dark/50"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 p-4 bg-cream rounded-2xl shadow-warm-lg border border-beige-dark/60 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-mutedbrown/70 px-3 pt-1">
                Pages & Actions
              </span>
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-charcoal hover:bg-beige rounded-xl transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="border-t border-beige-dark/40 my-1" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-mutedbrown/70 px-3 pt-1">
                Jump to on this page
              </span>
              <a
                href="#problem"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm text-mutedbrown hover:text-charcoal hover:bg-beige rounded-xl"
              >
                Why EVENTO?
              </a>
              <a
                href="#story"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm text-mutedbrown hover:text-charcoal hover:bg-beige rounded-xl"
              >
                A Day on EVENTO
              </a>
              <a
                href="#calendar"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm text-mutedbrown hover:text-charcoal hover:bg-beige rounded-xl"
              >
                Campus Calendar
              </a>
              <a
                href="#organizers"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm text-mutedbrown hover:text-charcoal hover:bg-beige rounded-xl"
              >
                For Organizers (@rishihood.edu.in)
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm text-mutedbrown hover:text-charcoal hover:bg-beige rounded-xl"
              >
                FAQ
              </a>
              <div className="pt-2">
                <a
                  href="/home"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-cream bg-terracotta hover:bg-terracotta-dark rounded-xl transition-colors shadow-warm"
                >
                  <span>Explore All Events</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

