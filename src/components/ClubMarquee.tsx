import React from 'react';
import { CLUBS_LIST } from '../constants/data';

export const ClubMarquee: React.FC = () => {
  // Duplicate list to achieve seamless infinite looping
  const marqueeItems = [...CLUBS_LIST, ...CLUBS_LIST];

  return (
    <section id="marquee" className="py-10 bg-beige-sand/50 border-y border-beige-dark/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-4 text-center">
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-mutedbrown">
          Clubs, societies and departments publish here
        </p>
      </div>

      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-marquee gap-3 py-2 items-center">
          {marqueeItems.map((club, idx) => (
            <div
              key={`${club.name}-${idx}`}
              className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-cream/90 hover:bg-cream border border-beige-dark/60 hover:border-terracotta/40 shadow-warm-sm hover:shadow-warm transition-all duration-200 cursor-default shrink-0 group"
            >
              <div
                className={`w-7 h-7 rounded-full bg-gradient-to-tr ${club.bgGradient} flex items-center justify-center text-white text-[11px] font-bold shadow-sm group-hover:scale-105 transition-transform`}
              >
                {club.initials}
              </div>
              <span className="text-xs sm:text-sm font-medium text-charcoal group-hover:text-terracotta transition-colors">
                {club.name}
              </span>
              <span className="text-[10px] font-semibold text-mutedbrown/70 bg-beige px-2 py-0.5 rounded-full">
                {club.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

