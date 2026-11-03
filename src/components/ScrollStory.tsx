import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Bell, Check, MapPin, Clock, Search, ShieldCheck } from 'lucide-react';
import { triggerConfetti } from '../utils/confetti';

interface StoryStep {
  step: number;
  title: string;
  subtitle: string;
  detail: string;
}

const STEPS: StoryStep[] = [
  {
    step: 1,
    title: 'Open home, see events soonest-first',
    subtitle: 'Chronological timeline for Rishihood',
    detail: 'No algorithmic clutter or sponsored ads. The very next event happening on campus is front and centre with live tags.',
  },
  {
    step: 2,
    title: 'Open the colour-coded calendar',
    subtitle: 'Red RU, Blue Newton, Green Club',
    detail: 'Spot your week at a single glance. Tap any date to reveal workshops, rehearsals, and sports tournaments.',
  },
  {
    step: 3,
    title: 'Open an event for exact room & timing',
    subtitle: 'Accurate campus coordinates',
    detail: 'Never wander between academic blocks again. Every card includes verified building numbers, room names, and speaker details.',
  },
  {
    step: 4,
    title: 'Tap Notify and the reminder is set',
    subtitle: 'One-click alert setup',
    detail: 'Get notified an hour before the session starts, and sync directly to your personal Google or Apple calendar.',
  },
];

export const ScrollStory: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [phoneNotified, setPhoneNotified] = useState(false);

  const handleNotifyInPhone = () => {
    setPhoneNotified(!phoneNotified);
    if (!phoneNotified) {
      triggerConfetti(0.5, 0.4);
    }
  };

  return (
    <section id="story" className="py-20 sm:py-28 bg-beige-sand/60 relative overflow-hidden border-t border-beige-dark/50 scroll-mt-24 sm:scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream border border-beige-dark text-xs font-semibold text-terracotta mb-3">
            <span>Scroll-Through Experience</span>
          </div>
          <h2 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-charcoal tracking-tight">
            A day on EVENTO
          </h2>
          <p className="mt-4 text-base sm:text-lg text-mutedbrown">
            From waking up in the dorm to walking into the auditorium — here is how an RU student navigates their campus week.
          </p>
        </div>

        {/* Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Interactive Step Selectors & Text */}
          <div className="lg:col-span-6 space-y-4">
            {STEPS.map((s, idx) => {
              const isActive = activeStep === idx;
              return (
                <div
                  key={s.step}
                  onClick={() => setActiveStep(idx)}
                  className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border ${
                    isActive
                      ? 'bg-cream shadow-warm-lg border-terracotta/40 translate-x-2'
                      : 'bg-cream/50 hover:bg-cream/80 border-beige-dark/60 opacity-70 hover:opacity-100'
                  }`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setActiveStep(idx);
                    }
                  }}
                  aria-label={`Step ${s.step}: ${s.title}`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-9 h-9 rounded-xl font-serif font-bold text-sm flex items-center justify-center shrink-0 transition-colors ${
                        isActive
                          ? 'bg-terracotta text-cream shadow-sm'
                          : 'bg-beige-dark/50 text-mutedbrown'
                      }`}
                    >
                      0{s.step}
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-bold uppercase tracking-wider text-terracotta">
                        {s.subtitle}
                      </div>
                      <h3 className="font-serif font-bold text-lg sm:text-xl text-charcoal">
                        {s.title}
                      </h3>
                      <p className="text-sm text-mutedbrown leading-relaxed pt-1">
                        {s.detail}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Phone Mockup with changing screen */}
          <div className="lg:col-span-6 flex justify-center items-center">
            <div className="relative w-[300px] sm:w-[320px] h-[610px] bg-charcoal-deep rounded-[44px] p-3 shadow-warm-xl border-4 border-charcoal/30 flex flex-col justify-between overflow-hidden">
              {/* Phone Speaker Notch */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-charcoal rounded-full z-40 flex items-center justify-center">
                <div className="w-10 h-1 bg-charcoal-muted rounded-full" />
                <div className="w-2.5 h-2.5 rounded-full bg-blue-900/60 ml-2" />
              </div>

              {/* Phone Screen Container */}
              <div className="w-full h-full bg-[#FAF6F0] rounded-[36px] overflow-hidden flex flex-col pt-7 pb-2 px-3.5 relative">
                {/* Mobile Status Bar */}
                <div className="flex items-center justify-between text-[11px] font-semibold text-charcoal/70 px-1 mb-2">
                  <span>9:41</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-2 border border-charcoal/60 rounded-[2px] p-[1px] flex items-center">
                      <div className="w-full h-full bg-charcoal/70 rounded-[1px]" />
                    </div>
                  </div>
                </div>

                {/* Animated Screens based on Active Step */}
                <div className="flex-1 overflow-hidden relative">
                  <AnimatePresence mode="wait">
                    {/* Screen 1: Home timeline */}
                    {activeStep === 0 && (
                      <motion.div
                        key="screen-1"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-3 pt-1"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-terracotta uppercase">
                              Today at RU
                            </span>
                            <div className="text-xs font-serif font-bold text-charcoal">
                              Upcoming Events
                            </div>
                          </div>
                          <div className="w-6 h-6 rounded-full bg-beige-sand flex items-center justify-center">
                            <Search className="w-3 h-3 text-charcoal" />
                          </div>
                        </div>

                        {/* Event Card Mock 1 */}
                        <div className="bg-cream rounded-2xl p-3 border border-beige-dark/60 shadow-warm-sm">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-cat-newton-bg text-cat-newton">
                              Newton Event
                            </span>
                            <span className="text-[9px] text-mutedbrown font-medium">In 2 hours</span>
                          </div>
                          <h4 className="font-serif font-bold text-xs text-charcoal">
                            HackRU 2026: 36h Code Sprint
                          </h4>
                          <p className="text-[10px] text-mutedbrown mt-1">
                            Tinkering Lab, Block B • 10:00 AM
                          </p>
                        </div>

                        {/* Event Card Mock 2 */}
                        <div className="bg-cream rounded-2xl p-3 border border-beige-dark/60 shadow-warm-sm">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-cat-club-bg text-cat-club">
                              Club Event
                            </span>
                            <span className="text-[9px] text-mutedbrown font-medium">Tomorrow</span>
                          </div>
                          <h4 className="font-serif font-bold text-xs text-charcoal">
                            Cultural Fest Auditions
                          </h4>
                          <p className="text-[10px] text-mutedbrown mt-1">
                            Open Amphitheatre • 4:30 PM
                          </p>
                        </div>

                        <div className="p-2.5 bg-terracotta/10 rounded-xl text-[10px] text-terracotta font-medium flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                          <span>All events verified by RU student council</span>
                        </div>
                      </motion.div>
                    )}

                    {/* Screen 2: Colour-coded calendar */}
                    {activeStep === 1 && (
                      <motion.div
                        key="screen-2"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-3 pt-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-serif font-bold text-xs text-charcoal">
                            November 2026
                          </span>
                          <span className="text-[10px] text-terracotta font-bold">Month View</span>
                        </div>

                        {/* Calendar Mini Grid */}
                        <div className="bg-cream rounded-2xl p-2.5 border border-beige-dark/60 shadow-warm-sm">
                          <div className="grid grid-cols-7 gap-1 text-[9px] font-bold text-center text-mutedbrown mb-1.5">
                            <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                          </div>
                          <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
                            {Array.from({ length: 28 }).map((_, i) => {
                              const day = i + 1;
                              const isToday = day === 14;
                              const hasBlue = day === 14 || day === 22;
                              const hasGreen = day === 17 || day === 20;
                              const hasRed = day === 19;
                              return (
                                <div
                                  key={day}
                                  className={`py-1 rounded-lg flex flex-col items-center justify-center ${
                                    isToday ? 'bg-terracotta-soft text-terracotta font-bold' : 'text-charcoal'
                                  }`}
                                >
                                  <span>{day}</span>
                                  <div className="flex gap-0.5 mt-0.5">
                                    {hasBlue && <span className="w-1 h-1 rounded-full bg-cat-newton" />}
                                    {hasGreen && <span className="w-1 h-1 rounded-full bg-cat-club" />}
                                    {hasRed && <span className="w-1 h-1 rounded-full bg-cat-ru" />}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Legend */}
                        <div className="grid grid-cols-2 gap-1.5 text-[9px] text-mutedbrown font-medium px-1">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-cat-ru" />
                            <span>Red = RU Official</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-cat-newton" />
                            <span>Blue = Newton</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-cat-club" />
                            <span>Green = Club</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-cat-personal" />
                            <span>Grey = Personal</span>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Screen 3: Event Details */}
                    {activeStep === 2 && (
                      <motion.div
                        key="screen-3"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-2.5 pt-1"
                      >
                        <div className="h-20 w-full rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 p-2.5 flex flex-col justify-between text-white shadow-sm">
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/20 w-max">
                            Newton School
                          </span>
                          <span className="text-[11px] font-serif font-bold">
                            HackRU 2026 Code Sprint
                          </span>
                        </div>

                        <div className="bg-cream rounded-2xl p-3 border border-beige-dark/60 space-y-2 text-[10px]">
                          <div className="flex items-center gap-2 text-charcoal">
                            <Clock className="w-3.5 h-3.5 text-terracotta shrink-0" />
                            <span className="font-semibold">Friday, Nov 14 • 10:00 AM - 10:00 PM</span>
                          </div>
                          <div className="flex items-center gap-2 text-charcoal">
                            <MapPin className="w-3.5 h-3.5 text-terracotta shrink-0" />
                            <span className="font-semibold">Tinkering Lab, Block B, Floor 2</span>
                          </div>
                          <div className="border-t border-beige-dark/40 pt-2 text-mutedbrown leading-relaxed">
                            Organized by Newton Coding Society. Power sockets, Wi-Fi 6, and meals provided for all registered participants.
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Screen 4: Tap Notify */}
                    {activeStep === 3 && (
                      <motion.div
                        key="screen-4"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-3 pt-2 text-center"
                      >
                        <div className="w-14 h-14 rounded-full bg-terracotta-soft text-terracotta flex items-center justify-center mx-auto mb-2 shadow-sm">
                          <Bell className="w-7 h-7" />
                        </div>
                        <h4 className="font-serif font-bold text-sm text-charcoal">
                          Stay in the loop!
                        </h4>
                        <p className="text-[10px] text-mutedbrown max-w-[200px] mx-auto">
                          Tap the button below to test the interactive 1-tap reminder state.
                        </p>

                        <button
                          type="button"
                          onClick={handleNotifyInPhone}
                          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${
                            phoneNotified
                              ? 'bg-cat-club text-white'
                              : 'bg-terracotta text-cream hover:bg-terracotta-dark'
                          }`}
                        >
                          {phoneNotified ? (
                            <>
                              <Check className="w-4 h-4 stroke-[3]" />
                              <span>Reminder set! (Ping 1h before)</span>
                            </>
                          ) : (
                            <>
                              <Bell className="w-4 h-4" />
                              <span>Set Reminder Now</span>
                            </>
                          )}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Bottom Navigation Bar of Mock Phone */}
                <div className="border-t border-beige-dark/50 pt-2 pb-1 flex justify-around items-center">
                  <div
                    onClick={() => setActiveStep(0)}
                    className={`cursor-pointer flex flex-col items-center ${activeStep === 0 ? 'text-terracotta' : 'text-mutedbrown'}`}
                  >
                    <div className="w-3.5 h-3.5 rounded-sm border border-current" />
                    <span className="text-[8px] font-semibold mt-0.5">Feed</span>
                  </div>
                  <div
                    onClick={() => setActiveStep(1)}
                    className={`cursor-pointer flex flex-col items-center ${activeStep === 1 ? 'text-terracotta' : 'text-mutedbrown'}`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-[8px] font-semibold mt-0.5">Month</span>
                  </div>
                  <div
                    onClick={() => setActiveStep(3)}
                    className={`cursor-pointer flex flex-col items-center ${activeStep === 3 ? 'text-terracotta' : 'text-mutedbrown'}`}
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span className="text-[8px] font-semibold mt-0.5">Notify</span>
                  </div>
                </div>

                {/* Home Indicator Bar */}
                <div className="w-24 h-1 bg-charcoal/30 rounded-full mx-auto mt-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Step Navigation Dots for Mobile / Quick Access */}
        <div className="flex justify-center items-center gap-2.5 mt-8">
          {STEPS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveStep(i)}
              className={`h-2.5 rounded-full transition-all duration-200 ${
                activeStep === i ? 'w-8 bg-terracotta' : 'w-2.5 bg-beige-dark/70'
              }`}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
