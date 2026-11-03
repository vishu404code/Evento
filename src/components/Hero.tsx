import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar as CalendarIcon, ChevronDown, Sparkles } from 'lucide-react';
import { FloatingEventCards } from './FloatingEventCards';

export const Hero: React.FC = () => {
  return (
    <section
      id="hero"
      className="relative min-h-[92vh] pt-28 sm:pt-36 pb-16 flex flex-col justify-between overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cream/95 border border-beige-dark shadow-warm-sm mb-6"
            >
              <span className="flex h-2 w-2 rounded-full bg-terracotta animate-pulse" />
              <span className="text-xs font-semibold tracking-wide text-charcoal/90">
                Made for Rishihood University
              </span>
              <Sparkles className="w-3.5 h-3.5 text-terracotta" />
            </motion.div>

            {/* Headline with word-by-word reveal */}
            <h1 className="font-serif font-black text-4xl sm:text-5xl md:text-6xl text-charcoal tracking-tight leading-[1.28] sm:leading-[1.16] mb-6">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 }}
                className="inline-block mr-2 sm:mr-3"
              >
                Never
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
                className="inline-block mr-2 sm:mr-3"
              >
                miss
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.15 }}
                className="inline-block mr-2 sm:mr-3"
              >
                a
              </motion.span>
              
              {/* "campus event" with hand-drawn terracotta underline */}
              <span className="relative inline-block mr-2 sm:mr-3 pb-1">
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.2 }}
                  className="relative z-10"
                >
                  campus{' '}
                  <span className="text-terracotta">event</span>
                </motion.span>
                
                {/* Hand-drawn terracotta underline SVG */}
                <svg
                  className="absolute -bottom-0.5 sm:-bottom-1 left-0 w-full h-2.5 sm:h-3 pointer-events-none overflow-visible"
                  viewBox="0 0 250 16"
                  fill="none"
                  preserveAspectRatio="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <motion.path
                    d="M3 13C45 5.5 120 4 247 9.5C185 13 85 14 30 11.5"
                    stroke="#C4623A"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
                  />
                </svg>
              </span>

              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.25 }}
                className="inline-block"
              >
                again.
              </motion.span>
            </h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.28 }}
              className="text-base sm:text-lg md:text-xl text-mutedbrown max-w-xl mb-8 leading-relaxed font-normal"
            >
              Every RU, Newton and club event, in one place. Browse, plan and get
              reminded — no more scrolling through hundreds of chaotic WhatsApp messages.
            </motion.p>

            {/* CTAs with magnetic hover & sliding arrow */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="flex flex-wrap items-center gap-4 mb-6 w-full sm:w-auto"
            >
              <a
                href="/home"
                className="group relative inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 text-base font-semibold text-cream bg-terracotta hover:bg-terracotta-dark rounded-2xl shadow-warm hover:shadow-warm-lg transition-all duration-200 active:scale-95 overflow-hidden w-full sm:w-auto text-center"
              >
                <span>Explore Events</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </a>

              <a
                href="/calendar"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-charcoal hover:text-terracotta bg-cream/90 hover:bg-cream border border-beige-dark/80 hover:border-terracotta/40 rounded-2xl shadow-warm-sm hover:shadow-warm transition-all duration-200 active:scale-95 w-full sm:w-auto text-center"
              >
                <CalendarIcon className="w-4 h-4 text-terracotta" />
                <span>View Calendar</span>
              </a>
            </motion.div>

            {/* Trust Line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.42 }}
              className="flex items-center gap-2 text-xs sm:text-sm font-medium text-mutedbrown"
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-cat-club" />
              <span>Free for all students</span>
              <span className="text-mutedbrown/40">•</span>
              <span>No login needed to browse</span>
            </motion.div>
          </div>

          {/* Right Column: Floating Interactive Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center items-center pt-4 lg:pt-0"
          >
            <FloatingEventCards />
          </motion.div>
        </div>
      </div>

      {/* Bouncing scroll indicator at bottom */}
      <div className="mt-8 sm:mt-12 flex flex-col items-center justify-center gap-1.5 text-mutedbrown/70 hover:text-terracotta transition-colors pointer-events-auto">
        <a href="#marquee" className="flex flex-col items-center gap-1 group" aria-label="Scroll down to clubs">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-mutedbrown/80 group-hover:text-terracotta">
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-4 h-4 text-terracotta" />
          </motion.div>
        </a>
      </div>
    </section>
  );
};
