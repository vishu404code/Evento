import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, Bell, Check, MapPin, Clock, Search, ShieldCheck } from 'lucide-react';
import { triggerConfetti } from '../utils/confetti';

gsap.registerPlugin(ScrollTrigger);

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
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const phone3DRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const stepCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Stage 4 notification interactive states
  const [stage4Notified, setStage4Notified] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [bellRinging, setBellRinging] = useState(false);
  const stage4Triggered = useRef(false);

  // Countdown timer for Stage 1: 'In 2 hours' counts down
  const [countdownSeconds, setCountdownSeconds] = useState(7142);

  const prefersReduced = useReducedMotion();
  const shouldReduceMotion = !!prefersReduced;

  // Track responsive screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Tick countdown timer for Stage 1
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds((prev) => (prev > 0 ? prev - 1 : 7200));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h}h ${m < 10 ? '0' : ''}${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  // GSAP ScrollTrigger on desktop: responsive, smooth scrubbing, starting earlier without sticking
  useEffect(() => {
    if (isMobile || shouldReduceMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          start: 'top top',
          end: '+=950', // Concise scroll distance: eliminates heavy effort during slow scrolling
          scrub: 0.5, // 0.5s smooth interpolation for trackpad and cursor
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            // Transitions start earlier with hysteresis to prevent getting stuck during slow scrolling
            setActiveStep((prev) => {
              if (prev === 0 && p >= 0.12) return 1;
              if (prev === 1 && p <= 0.08) return 0;
              if (prev === 1 && p >= 0.42) return 2;
              if (prev === 2 && p <= 0.38) return 1;
              if (prev === 2 && p >= 0.72) return 3;
              if (prev === 3 && p <= 0.68) return 2;
              return prev;
            });
          },
        },
      });

      scrollTriggerRef.current = tl.scrollTrigger || null;

      if (phone3DRef.current) {
        // Continuous, fluid 3D phone rotation & scale synced to scroll scrub
        tl.fromTo(
          phone3DRef.current,
          { rotateY: -15, rotateX: 4, scale: 1 },
          { rotateY: 0, rotateX: 7, scale: 1.04, ease: 'power1.inOut', duration: 0.33 }
        )
          .to(phone3DRef.current, {
            rotateY: 12,
            rotateX: 2,
            scale: 1.06,
            ease: 'power1.inOut',
            duration: 0.33,
          })
          .to(phone3DRef.current, {
            rotateY: 0,
            rotateX: 0,
            scale: 1,
            ease: 'power1.inOut',
            duration: 0.34,
          });
      }
    }, containerRef);

    return () => {
      ctx.revert();
      scrollTriggerRef.current = null;
    };
  }, [isMobile, shouldReduceMotion]);

  // Mobile IntersectionObserver to sync active card when scrolled into view
  useEffect(() => {
    if (!isMobile) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-step-index'));
            if (!isNaN(index)) {
              setActiveStep(index);
            }
          }
        });
      },
      {
        threshold: 0.55,
        rootMargin: '-10% 0px -10% 0px',
      }
    );

    stepCardRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isMobile]);

  // Stage 4 fast automated tap, bell ring, confetti, and toast sequence
  useEffect(() => {
    if (activeStep === 3) {
      if (!stage4Triggered.current) {
        stage4Triggered.current = true;
        const tapTimer = setTimeout(() => {
          setBellRinging(true);
          setStage4Notified(true);
          setShowToast(true);
          if (!shouldReduceMotion) {
            triggerConfetti(0.65, 0.45);
          }
          setTimeout(() => setBellRinging(false), 600);
        }, 280);

        return () => clearTimeout(tapTimer);
      }
    } else {
      stage4Triggered.current = false;
      setStage4Notified(false);
      setShowToast(false);
      setBellRinging(false);
    }
  }, [activeStep, shouldReduceMotion]);

  // Smooth scroll to stage when clicking step cards or dots
  const handleStepClick = (idx: number) => {
    setActiveStep(idx);

    if (isMobile || shouldReduceMotion) {
      if (isMobile && stepCardRefs.current[idx]) {
        stepCardRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const st = scrollTriggerRef.current;
    if (st) {
      const stageProgressMap = [0.04, 0.26, 0.56, 0.86];
      const targetScroll = st.start + stageProgressMap[idx] * (st.end - st.start);
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  const handleToggleNotify = () => {
    const next = !stage4Notified;
    setStage4Notified(next);
    if (next) {
      setBellRinging(true);
      setShowToast(true);
      if (!shouldReduceMotion) {
        triggerConfetti(0.65, 0.45);
      }
      setTimeout(() => setBellRinging(false), 600);
    } else {
      setShowToast(false);
    }
  };

  return (
    <section
      ref={containerRef}
      id="story"
      className="relative bg-beige-sand/60 border-t border-beige-dark/50 scroll-mt-24 sm:scroll-mt-28"
    >
      {/* Pinned Container for Desktop GSAP ScrollTrigger, standard flow for mobile/reduced motion */}
      <div
        className={`${
          !isMobile && !shouldReduceMotion
            ? 'w-full min-h-screen flex flex-col justify-center pt-24 pb-10 overflow-hidden'
            : 'py-20 sm:py-28 overflow-hidden'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-5 sm:mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream border border-beige-dark text-xs font-semibold text-terracotta mb-2.5">
              <span>Scroll-Through Experience</span>
            </div>
            <h2 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-charcoal tracking-tight">
              A day on EVENTO
            </h2>
            <p className="mt-3 text-base sm:text-lg text-mutedbrown">
              From waking up in the dorm to walking into the auditorium — here is how an RU student navigates their campus week.
            </p>
          </div>

          {/* Story Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Interactive Step Selectors & Text */}
            <div className="lg:col-span-6 space-y-3.5">
              {STEPS.map((s, idx) => {
                const isActive = activeStep === idx;
                return (
                  <div
                    key={s.step}
                    ref={(el) => {
                      stepCardRefs.current[idx] = el;
                    }}
                    data-step-index={idx}
                    onClick={() => handleStepClick(idx)}
                    className={`p-5 sm:p-6 rounded-2xl cursor-pointer transition-all duration-200 border focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 ${
                      isActive
                        ? 'bg-cream shadow-warm-lg border-terracotta/40 translate-x-2'
                        : 'bg-cream/50 hover:bg-cream/80 border-beige-dark/60 opacity-70 hover:opacity-100'
                    }`}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleStepClick(idx);
                      }
                    }}
                    aria-label={`Step ${s.step}: ${s.title}`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-9 h-9 rounded-xl font-serif font-bold text-sm flex items-center justify-center shrink-0 transition-colors ${
                          isActive ? 'bg-terracotta text-cream shadow-sm' : 'bg-beige-dark/50 text-mutedbrown'
                        }`}
                      >
                        0{s.step}
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs font-bold uppercase tracking-wider text-terracotta">{s.subtitle}</div>
                        <h3 className="font-serif font-bold text-lg sm:text-xl text-charcoal">{s.title}</h3>
                        <p className="text-sm text-mutedbrown leading-relaxed pt-1">{s.detail}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: 3D Phone Mockup Container */}
            <div className="lg:col-span-6 flex justify-center items-center" style={{ perspective: 1200 }}>
              {/* Gentle idle float wrapper */}
              <motion.div
                animate={!shouldReduceMotion && !isMobile ? { y: [0, -6, 0] } : { y: 0 }}
                transition={{ repeat: Infinity, duration: 4.8, ease: 'easeInOut' }}
                className="flex justify-center items-center"
              >
                {/* 3D Transform pose container scrubbed smoothly by GSAP */}
                <div
                  ref={phone3DRef}
                  id="story-phone-3d"
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                  className="will-change-transform"
                >
                  {/* Phone Mockup Frame (Original Design & Dimensions) */}
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

                      {/* Toast Notification for Stage 4 */}
                      <AnimatePresence>
                        {activeStep === 3 && showToast && (
                          <motion.div
                            initial={{ y: -35, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -35, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                            className="absolute top-8 left-3.5 right-3.5 z-30 bg-charcoal text-white text-[9.5px] py-1.5 px-2.5 rounded-xl flex items-center gap-2 shadow-lg border border-charcoal/40"
                          >
                            <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                            <div className="leading-tight truncate">
                              <p className="font-bold text-[10px]">Reminder Scheduled</p>
                              <p className="text-white/70 text-[8.5px]">HackRU 2026 • 1 hour before (9:00 AM)</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Fast, Butter-Smooth GPU-accelerated Screens */}
                      <div className="flex-1 overflow-hidden relative">
                        {/* Stage 01: Home Timeline Feed */}
                        <div
                          className={`absolute inset-0 flex flex-col space-y-2.5 pt-1 transition-all duration-300 ease-out will-change-[transform,opacity] ${
                            activeStep === 0
                              ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto z-10'
                              : activeStep > 0
                              ? 'opacity-0 -translate-y-3 scale-[0.98] pointer-events-none z-0'
                              : 'opacity-0 translate-y-3 scale-[0.98] pointer-events-none z-0'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-[10px] font-bold text-terracotta uppercase">Today at RU</span>
                              <div className="text-xs font-serif font-bold text-charcoal">Upcoming Events</div>
                            </div>
                            <div className="w-6 h-6 rounded-full bg-beige-sand flex items-center justify-center">
                              <Search className="w-3 h-3 text-charcoal" />
                            </div>
                          </div>

                          {/* Event Card 1 */}
                          <div className="bg-cream rounded-2xl p-2.5 border border-beige-dark/60 shadow-warm-sm">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-cat-newton-bg text-cat-newton">
                                Newton Event
                              </span>
                              <span className="text-[9px] text-terracotta font-mono font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-pulse" />
                                In {formatCountdown(countdownSeconds)}
                              </span>
                            </div>
                            <h4 className="font-serif font-bold text-xs text-charcoal">
                              HackRU 2026: 36h Code Sprint
                            </h4>
                            <p className="text-[10px] text-mutedbrown mt-0.5">Tinkering Lab, Block B • 10:00 AM</p>
                          </div>

                          {/* Event Card 2 */}
                          <div className="bg-cream rounded-2xl p-2.5 border border-beige-dark/60 shadow-warm-sm">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-cat-club-bg text-cat-club">
                                Club Event
                              </span>
                              <span className="text-[9px] text-mutedbrown font-medium">Tomorrow</span>
                            </div>
                            <h4 className="font-serif font-bold text-xs text-charcoal">Cultural Fest Auditions</h4>
                            <p className="text-[10px] text-mutedbrown mt-0.5">Open Air Amphitheatre • 4:30 PM</p>
                          </div>

                          {/* Event Card 3 */}
                          <div className="bg-cream rounded-2xl p-2.5 border border-beige-dark/60 shadow-warm-sm">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-cat-ru-bg text-cat-ru">
                                RU Official
                              </span>
                              <span className="text-[9px] text-mutedbrown font-medium">Wed, Nov 19</span>
                            </div>
                            <h4 className="font-serif font-bold text-xs text-charcoal">
                              Annual Convocation Rehearsal
                            </h4>
                            <p className="text-[10px] text-mutedbrown mt-0.5">
                              Main Auditorium, Ground Fl. • 2:00 PM
                            </p>
                          </div>

                          {/* Verified Council Shield Footer */}
                          <div className="p-2 bg-terracotta/10 rounded-xl text-[9px] text-terracotta font-medium flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                            <span>All events verified by RU student council</span>
                          </div>
                        </div>

                        {/* Stage 02: Month Calendar View */}
                        <div
                          className={`absolute inset-0 flex flex-col space-y-2 pt-1 transition-all duration-300 ease-out will-change-[transform,opacity] ${
                            activeStep === 1
                              ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto z-10'
                              : activeStep > 1
                              ? 'opacity-0 -translate-y-3 scale-[0.98] pointer-events-none z-0'
                              : 'opacity-0 translate-y-3 scale-[0.98] pointer-events-none z-0'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-serif font-bold text-xs text-charcoal">November 2026</span>
                            <span className="text-[10px] text-terracotta font-bold">Month View</span>
                          </div>

                          {/* Calendar Mini Grid */}
                          <div className="bg-cream rounded-2xl p-2 border border-beige-dark/60 shadow-warm-sm">
                            <div className="grid grid-cols-7 gap-1 text-[8.5px] font-bold text-center text-mutedbrown mb-1">
                              <span>M</span>
                              <span>T</span>
                              <span>W</span>
                              <span>T</span>
                              <span>F</span>
                              <span>S</span>
                              <span>S</span>
                            </div>
                            <div className="grid grid-cols-7 gap-0.5 text-center text-[9.5px]">
                              {Array.from({ length: 28 }).map((_, i) => {
                                const day = i + 1;
                                const isTargetDay = day === 14;
                                const hasBlue = day === 14 || day === 22;
                                const hasGreen = day === 17 || day === 20;
                                const hasRed = day === 19;
                                const hasPersonal = day === 10 || day === 25;

                                return (
                                  <div
                                    key={day}
                                    className={`py-1 rounded-lg relative flex flex-col items-center justify-center transition-colors ${
                                      isTargetDay
                                        ? 'bg-terracotta-soft text-terracotta font-bold ring-1 ring-terracotta/40'
                                        : 'text-charcoal'
                                    }`}
                                  >
                                    <span>{day}</span>
                                    <div className="flex gap-0.5 mt-0.5 h-1 items-center">
                                      {hasBlue && <span className="w-1 h-1 rounded-full bg-cat-newton" />}
                                      {hasGreen && <span className="w-1 h-1 rounded-full bg-cat-club" />}
                                      {hasRed && <span className="w-1 h-1 rounded-full bg-cat-ru" />}
                                      {hasPersonal && <span className="w-1 h-1 rounded-full bg-cat-personal" />}
                                    </div>

                                    {/* Auto-tapped ripple ring on Day 14 */}
                                    {isTargetDay && !shouldReduceMotion && (
                                      <motion.span
                                        className="absolute inset-0 rounded-lg border-2 border-terracotta pointer-events-none"
                                        animate={{ scale: [1, 1.8], opacity: [0.9, 0] }}
                                        transition={{
                                          duration: 1.4,
                                          repeat: Infinity,
                                          ease: 'easeOut',
                                          delay: 0.1,
                                        }}
                                      />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Tapped Day's Event Card */}
                          <div className="bg-cream rounded-xl p-2.5 border border-terracotta/30 shadow-warm-sm">
                            <div className="flex items-center justify-between text-[9px] mb-1">
                              <span className="font-bold text-terracotta">Selected Day • Fri, Nov 14</span>
                              <span className="px-1.5 py-0.5 rounded-full bg-cat-newton-bg text-cat-newton font-bold text-[8px]">
                                1 Event
                              </span>
                            </div>
                            <h4 className="font-serif font-bold text-xs text-charcoal truncate">
                              HackRU 2026: 36h Code Sprint
                            </h4>
                            <p className="text-[9.5px] text-mutedbrown mt-0.5">
                              Tinkering Lab, Block B • 10:00 AM - 10:00 PM
                            </p>
                          </div>

                          {/* Legend */}
                          <div className="grid grid-cols-2 gap-1 text-[8.5px] text-mutedbrown font-medium px-1">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-cat-ru shrink-0" />
                              <span>Red = RU Official</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-cat-newton shrink-0" />
                              <span>Blue = Newton</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-cat-club shrink-0" />
                              <span>Green = Club</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-cat-personal shrink-0" />
                              <span>Grey = Personal</span>
                            </div>
                          </div>
                        </div>

                        {/* Stage 03: Event Details View */}
                        <div
                          className={`absolute inset-0 flex flex-col space-y-2.5 pt-1 transition-all duration-300 ease-out will-change-[transform,opacity] ${
                            activeStep === 2
                              ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto z-10'
                              : activeStep > 2
                              ? 'opacity-0 -translate-y-3 scale-[0.98] pointer-events-none z-0'
                              : 'opacity-0 translate-y-3 scale-[0.98] pointer-events-none z-0'
                          }`}
                        >
                          {/* Poster Header */}
                          <div className="h-20 w-full rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 p-2.5 flex flex-col justify-between text-white shadow-sm relative overflow-hidden">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm">
                                Newton School
                              </span>
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/25">
                                NCS
                              </span>
                            </div>
                            <div>
                              <span className="text-[11px] font-serif font-bold block leading-snug">
                                HackRU 2026 Code Sprint
                              </span>
                              <span className="text-[8px] text-white/80 block mt-0.5">
                                Organized by Newton Coding Society
                              </span>
                            </div>
                          </div>

                          {/* Event Details Card */}
                          <div className="bg-cream rounded-2xl p-2.5 border border-beige-dark/60 space-y-2 text-[10px]">
                            <div className="flex items-center gap-2 text-charcoal">
                              <Clock className="w-3.5 h-3.5 text-terracotta shrink-0" />
                              <span className="font-semibold">Friday, Nov 14 • 10:00 AM - 10:00 PM</span>
                            </div>

                            <div className="flex items-center gap-2 text-charcoal">
                              <span className="relative flex h-3.5 w-3.5 items-center justify-center shrink-0">
                                {!shouldReduceMotion && (
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terracotta/40 opacity-75" />
                                )}
                                <MapPin className="relative w-3.5 h-3.5 text-terracotta shrink-0" />
                              </span>
                              <span className="font-semibold">Tinkering Lab, Block B, Floor 2</span>
                            </div>

                            <div className="border-t border-beige-dark/40 pt-1.5 text-mutedbrown leading-relaxed text-[9px]">
                              Power sockets, Wi-Fi 6, and meals provided for all registered participants. Mentorship desk opens at 11 AM.
                            </div>
                          </div>

                          {/* Notify Me button at bottom of screen 3 */}
                          <button
                            type="button"
                            onClick={() => handleStepClick(3)}
                            className="w-full py-2 px-3 rounded-xl bg-terracotta text-cream text-[10px] font-bold shadow-sm flex items-center justify-center gap-1.5 hover:bg-terracotta-dark transition-colors"
                          >
                            <Bell className="w-3.5 h-3.5" />
                            <span>Notify me</span>
                          </button>
                        </div>

                        {/* Stage 04: Animated Finger Tap, Ringing Bell, Confetti, and Reminder Set */}
                        <div
                          className={`absolute inset-0 flex flex-col space-y-3 pt-4 text-center relative transition-all duration-300 ease-out will-change-[transform,opacity] ${
                            activeStep === 3
                              ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto z-10'
                              : 'opacity-0 translate-y-3 scale-[0.98] pointer-events-none z-0'
                          }`}
                        >
                          {/* Ringing Bell Icon */}
                          <motion.div
                            animate={
                              bellRinging && !shouldReduceMotion
                                ? { rotate: [0, -18, 18, -12, 12, -6, 6, 0] }
                                : { rotate: 0 }
                            }
                            transition={{ duration: 0.5 }}
                            className="w-14 h-14 rounded-full bg-terracotta-soft text-terracotta flex items-center justify-center mx-auto mb-2 shadow-sm will-change-transform"
                          >
                            <Bell className="w-7 h-7" />
                          </motion.div>

                          <h4 className="font-serif font-bold text-sm text-charcoal">Stay in the loop!</h4>
                          <p className="text-[10px] text-mutedbrown max-w-[210px] mx-auto">
                            Tap the button below to test the interactive 1-tap reminder state.
                          </p>

                          <div className="relative pt-2">
                            <button
                              type="button"
                              onClick={handleToggleNotify}
                              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${
                                stage4Notified
                                  ? 'bg-cat-club text-white'
                                  : 'bg-terracotta text-cream hover:bg-terracotta-dark'
                              }`}
                            >
                              {stage4Notified ? (
                                <>
                                  <Check className="w-4 h-4 stroke-[3]" />
                                  <span>Reminder set! (Ping 1h before)</span>
                                </>
                              ) : (
                                <>
                                  <Bell className="w-4 h-4" />
                                  <span>Notify me</span>
                                </>
                              )}
                            </button>

                            {/* Animated Finger Pointer automatically tapping Notify me */}
                            {!shouldReduceMotion && !stage4Notified && (
                              <motion.div
                                initial={{ opacity: 0, x: 28, y: 28, scale: 1 }}
                                animate={{
                                  opacity: [0, 1, 1, 1, 0],
                                  x: [28, 0, 0, 0, 12],
                                  y: [28, 0, 0, 0, 12],
                                  scale: [1, 1, 0.82, 1, 1],
                                }}
                                transition={{
                                  duration: 1.1,
                                  times: [0, 0.35, 0.55, 0.75, 1],
                                  ease: 'easeInOut',
                                }}
                                className="absolute bottom-1 right-10 pointer-events-none z-30"
                              >
                                <svg
                                  width="28"
                                  height="28"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  className="drop-shadow-md"
                                >
                                  <path
                                    d="M10 2v10a2 2 0 0 1-4 0V5a1.5 1.5 0 0 0-3 0v11a7 7 0 0 0 14 0V9a1.5 1.5 0 0 0-3 0v3a1.5 1.5 0 0 0-3 0V2a1.5 1.5 0 0 0-3 0z"
                                    fill="#F5EFE6"
                                    stroke="#2D2824"
                                    strokeWidth="1.5"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Bottom Navigation Bar of Mock Phone (Highlights matching tab) */}
                      <div className="border-t border-beige-dark/50 pt-2 pb-1 flex justify-around items-center">
                        <div
                          onClick={() => handleStepClick(0)}
                          className={`cursor-pointer flex flex-col items-center transition-colors ${
                            activeStep === 0 || activeStep === 2 ? 'text-terracotta' : 'text-mutedbrown'
                          }`}
                        >
                          <div className="w-3.5 h-3.5 rounded-sm border border-current" />
                          <span className="text-[8px] font-semibold mt-0.5">Feed</span>
                        </div>
                        <div
                          onClick={() => handleStepClick(1)}
                          className={`cursor-pointer flex flex-col items-center transition-colors ${
                            activeStep === 1 ? 'text-terracotta' : 'text-mutedbrown'
                          }`}
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span className="text-[8px] font-semibold mt-0.5">Month</span>
                        </div>
                        <div
                          onClick={() => handleStepClick(3)}
                          className={`cursor-pointer flex flex-col items-center transition-colors ${
                            activeStep === 3 ? 'text-terracotta' : 'text-mutedbrown'
                          }`}
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
              </motion.div>
            </div>
          </div>

          {/* Step Navigation Dots for Quick Access & Keyboard Users */}
          <div className="flex justify-center items-center gap-2.5 mt-8">
            {STEPS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleStepClick(i)}
                className={`h-2.5 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 ${
                  activeStep === i ? 'w-8 bg-terracotta' : 'w-2.5 bg-beige-dark/70 hover:bg-beige-dark'
                }`}
                aria-label={`Go to step ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
