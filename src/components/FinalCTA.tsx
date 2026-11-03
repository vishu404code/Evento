import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Sparkles } from 'lucide-react';
import { triggerConfetti } from '../utils/confetti';

export const FinalCTA: React.FC = () => {
  const handleBannerHover = () => {
    triggerConfetti(0.5, 0.7);
  };

  return (
    <section className="py-16 sm:py-24 bg-beige relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-terracotta text-beige-light rounded-[36px] p-8 sm:p-14 lg:p-16 overflow-hidden shadow-warm-xl"
        >
          {/* Subtle geometric pattern */}
          <div
            className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1.5px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Floating decorative warm blur circles */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-terracotta-light/30 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-amber-600/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-white">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Free for all Rishihood University students</span>
            </div>

            <h2 className="font-serif font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
              Your next event is already here.
            </h2>

            <p className="text-base sm:text-lg text-beige-light/90 max-w-xl mx-auto leading-relaxed">
              Step out of the WhatsApp scroll spiral. Discover hackathons, workshops, auditions, and guest lectures happening right across campus.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <a
                href="/home"
                onMouseEnter={handleBannerHover}
                onClick={handleBannerHover}
                className="group inline-flex items-center gap-2.5 px-8 py-4 text-base font-bold text-terracotta bg-beige-light hover:bg-white rounded-2xl shadow-warm-lg hover:shadow-warm-xl transition-all duration-200 active:scale-95"
              >
                <span>Explore Events</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
              </a>

              <a
                href="/calendar"
                className="inline-flex items-center gap-2 px-7 py-4 text-base font-semibold text-white hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl transition-all duration-200 active:scale-95"
              >
                <Calendar className="w-4 h-4" />
                <span>View Calendar</span>
              </a>
            </div>

            <p className="pt-2 text-xs text-white/70">
              No login required to browse • Verified university portal
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

