import React from 'react';
import { Calendar, MapPin, ArrowUp, Heart } from 'lucide-react';
import { NAV_LINKS } from '../constants/data';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-beige-sand/80 border-t border-beige-dark/60 py-14 sm:py-16 text-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-beige-dark/50 items-start">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <a
              href="#hero"
              className="inline-flex items-center gap-2.5 rounded-lg focus-visible:ring-2 focus-visible:ring-terracotta"
              aria-label="Back to top"
            >
              <div className="relative w-8 h-8 rounded-xl bg-terracotta text-cream flex items-center justify-center shadow-warm-sm">
                <Calendar className="w-4 h-4 text-cream" />
                <MapPin className="w-2.5 h-2.5 text-cream-pure absolute -bottom-0.5 -right-0.5 fill-cream" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif font-black text-2xl tracking-tight text-charcoal">
                  EVENTO
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-terracotta bg-terracotta-soft/70 px-1.5 py-0.5 rounded">
                  RU
                </span>
              </div>
            </a>

            <p className="text-sm text-mutedbrown max-w-sm leading-relaxed">
              The single verified home for all Rishihood University, Newton School of Technology, and student club events. Stop missing out on campus life.
            </p>

            <div className="pt-1 flex items-center gap-2 text-xs text-mutedbrown">
              <span>Sonipat, Haryana • NH 44, GT Road</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-4 grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal mb-3">
                Platform
              </h4>
              <ul className="space-y-2 text-sm">
                {NAV_LINKS.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-mutedbrown hover:text-terracotta transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="/login"
                    className="text-mutedbrown hover:text-terracotta transition-colors"
                  >
                    Organizer Login
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal mb-3">
                Jump To
              </h4>
              <ul className="space-y-2 text-sm text-mutedbrown">
                <li>
                  <a href="#problem" className="hover:text-terracotta transition-colors">
                    The Problem
                  </a>
                </li>
                <li>
                  <a href="#story" className="hover:text-terracotta transition-colors">
                    A Day on EVENTO
                  </a>
                </li>
                <li>
                  <a href="#showcase" className="hover:text-terracotta transition-colors">
                    Live Feed
                  </a>
                </li>
                <li>
                  <a href="#calendar" className="hover:text-terracotta transition-colors">
                    Calendar View
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-terracotta transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Back to top & credits */}
          <div className="md:col-span-3 flex flex-col md:items-end justify-between space-y-4">
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-cream hover:bg-beige-light border border-beige-dark/70 hover:border-terracotta text-xs font-semibold text-charcoal hover:text-terracotta transition-all shadow-warm-sm group"
              aria-label="Back to top of page"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>

            <div className="text-xs text-mutedbrown md:text-right">
              <span className="inline-flex items-center gap-1">
                Crafted with <Heart className="w-3 h-3 text-cat-ru fill-cat-ru inline" /> for RU
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-mutedbrown/80 gap-3">
          <p>© {new Date().getFullYear()} EVENTO. Built by students at Rishihood University.</p>
          <div className="flex items-center gap-4">
            <span>Student Community Project</span>
            <span>•</span>
            <span>No personal tracking</span>
            <span>•</span>
            <span className="text-terracotta font-medium">v1.0 Cover Edition</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

