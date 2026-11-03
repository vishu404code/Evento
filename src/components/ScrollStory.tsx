import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useReducedMotion } from 'framer-motion';
import { Calendar, Bell, Check, MapPin, Clock, Search, ShieldCheck } from 'lucide-react';
import { triggerConfetti } from '../utils/confetti';
import { ThreeStoryCanvas } from './ThreeStoryCanvas';

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
  const stepCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isSnapping = useRef(false);
  const snapTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Stage 4 notification interactive states
  const [stage4Notified, setStage4Notified] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [bellRinging, setBellRinging] = useState(false);
  const stage4Triggered = useRef(false);

  // Desktop mouse parallax tilt state
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });

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

  // Scroll Progress (0 to 1) for pinned 400vh desktop section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Map scroll progress to active step on desktop
  useEffect(() => {
    if (isMobile || shouldReduceMotion) return;

    const unsubscribe = scrollYProgress.on('change', (latest) => {
      let nextStep = 0;
      if (latest >= 0.75) {
        nextStep = 3;
      } else if (latest >= 0.5) {
        nextStep = 2;
      } else if (latest >= 0.25) {
        nextStep = 1;
      } else {
        nextStep = 0;
      }
      setActiveStep((prev) => (prev !== nextStep ? nextStep : prev));
    });

    return () => unsubscribe();
  }, [scrollYProgress, isMobile, shouldReduceMotion]);

  // Soft snapping so scrolling settles cleanly on a stage
  useEffect(() => {
    if (isMobile || shouldReduceMotion) return;

    const handleScrollSnap = () => {
      if (isSnapping.current) return;
      if (snapTimeout.current) clearTimeout(snapTimeout.current);

      snapTimeout.current = setTimeout(() => {
        if (!containerRef.current || isSnapping.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const scrollableDist = rect.height - window.innerHeight;
        if (scrollableDist <= 0) return;

        const currentProgress = -rect.top / scrollableDist;

        // Only soft snap if safely inside the pinned scrollable track
        if (currentProgress > 0.06 && currentProgress < 0.94) {
          const step = Math.min(3, Math.max(0, Math.floor(currentProgress * 4)));
          const targetProgress = (step + 0.5) / 4;
          const diff = Math.abs(currentProgress - targetProgress);

          if (diff > 0.035) {
            isSnapping.current = true;
            const targetY = window.scrollY + rect.top + targetProgress * scrollableDist;
            window.scrollTo({ top: targetY, behavior: 'smooth' });
            setTimeout(() => {
              isSnapping.current = false;
            }, 600);
          }
        }
      }, 220);
    };

    window.addEventListener('scroll', handleScrollSnap, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScrollSnap);
      if (snapTimeout.current) clearTimeout(snapTimeout.current);
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

  // Stage 4 automated tap, bell ring, confetti, and toast sequence
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
          setTimeout(() => setBellRinging(false), 800);
        }, 650);

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

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const scrollableDist = rect.height - window.innerHeight;
      const targetProgress = (idx + 0.5) / 4;
      const targetY = window.scrollY + rect.top + targetProgress * scrollableDist;
      isSnapping.current = true;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
      setTimeout(() => {
        isSnapping.current = false;
      }, 650);
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
      setTimeout(() => setBellRinging(false), 800);
    } else {
      setShowToast(false);
    }
  };

  // Subtle desktop mouse parallax tilt handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || shouldReduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseTilt({ x: x * 6, y: y * -6 });
  };

  const handleMouseLeave = () => {
    setMouseTilt({ x: 0, y: 0 });
  };

  // 3D Phone poses per stage
  const phonePoses = [
    { rotateY: -15, rotateX: 4, scale: 1 },
    { rotateY: 0, rotateX: 8, scale: 1.04 },
    { rotateY: 12, rotateX: 2, scale: 1.06 },
    { rotateY: 0, rotateX: 0, scale: 1 },
  ];

  const currentPose = isMobile || shouldReduceMotion ? { rotateY: 0, rotateX: 0, scale: 1 } : phonePoses[activeStep];

  return (
    <section
      ref={containerRef}
      id="story"
      className="relative bg-beige-sand/60 border-t border-beige-dark/50 scroll-mt-24 sm:scroll-mt-28"
      style={{
        height: !isMobile && !shouldReduceMotion ? '400vh' : 'auto',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Sticky Pinned Container for Desktop, standard flow for mobile/reduced motion */}
      <div
        className={`${
          !isMobile && !shouldReduceMotion
            ? 'sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden'
            : 'py-20 sm:py-28 overflow-hidden'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
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
                    className={`p-5 sm:p-6 rounded-2xl cursor-pointer transition-all duration-300 border focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 ${
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

            {/* Right Column: 3D Phone Mockup Container with Three.js WebGL Stage */}
            <div className="lg:col-span-6 flex justify-center items-center relative min-h-[640px]" style={{ perspective: 1200 }}>
              {/* Three.js 3D WebGL Background Canvas */}
              <ThreeStoryCanvas activeStep={activeStep} mousePos={mouseTilt} />

              {/* Gentle idle float wrapper */}
              <motion.div
                animate={!shouldReduceMotion && !isMobile ? { y: [0, -6, 0] } : { y: 0 }}
                transition={{ repeat: Infinity, duration: 4.8, ease: 'easeInOut' }}
                className="flex justify-center items-center relative z-10"
              >
                {/* 3D Transform pose & mouse parallax container */}
                <motion.div
                  animate={{
                    rotateY: currentPose.rotateY + (isMobile || shouldReduceMotion ? 0 : mouseTilt.x),
                    rotateX: currentPose.rotateX + (isMobile || shouldReduceMotion ? 0 : mouseTilt.y),
                    scale:
                      activeStep === 3 && stage4Notified && !shouldReduceMotion
                        ? [currentPose.scale, currentPose.scale * 1.04, currentPose.scale * 0.99, currentPose.scale]
                        : currentPose.scale,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 110,
                    damping: 20,
                    mass: 0.8,
                  }}
                  style={{ transformStyle: 'preserve-3d' }}
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

                      {/* Animated Screens based on Active Step */}
                      <div className="flex-1 overflow-hidden relative">
                        <AnimatePresence mode="wait">
                          {/* Stage 01: Home Timeline Feed */}
                          {activeStep === 0 && (
                            <motion.div
                              key="screen-1"
                              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -15 }}
                              transition={{ duration: 0.3 }}
                              className="space-y-2.5 pt-1"
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

                              {/* Event Card 1 (with live counting down timer) */}
                              <motion.div
                                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: shouldReduceMotion ? 0 : 0.05 }}
                                className="bg-cream rounded-2xl p-2.5 border border-beige-dark/60 shadow-warm-sm"
                              >
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
                              </motion.div>

                              {/* Event Card 2 */}
                              <motion.div
                                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: shouldReduceMotion ? 0 : 0.15 }}
                                className="bg-cream rounded-2xl p-2.5 border border-beige-dark/60 shadow-warm-sm"
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-cat-club-bg text-cat-club">
                                    Club Event
                                  </span>
                                  <span className="text-[9px] text-mutedbrown font-medium">Tomorrow</span>
                                </div>
                                <h4 className="font-serif font-bold text-xs text-charcoal">Cultural Fest Auditions</h4>
                                <p className="text-[10px] text-mutedbrown mt-0.5">Open Air Amphitheatre • 4:30 PM</p>
                              </motion.div>

                              {/* Event Card 3 (Added sample card to fill the screen) */}
                              <motion.div
                                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: shouldReduceMotion ? 0 : 0.25 }}
                                className="bg-cream rounded-2xl p-2.5 border border-beige-dark/60 shadow-warm-sm"
                              >
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
                              </motion.div>

                              {/* Verified Council Shield Footer */}
                              <motion.div
                                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: shouldReduceMotion ? 0 : 0.35 }}
                                className="p-2 bg-terracotta/10 rounded-xl text-[9px] text-terracotta font-medium flex items-center gap-1.5"
                              >
                                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                                <span>All events verified by RU student council</span>
                              </motion.div>
                            </motion.div>
                          )}

                          {/* Stage 02: Month Calendar View with Pop-in Dots & Slide-up Event Card */}
                          {activeStep === 1 && (
                            <motion.div
                              key="screen-2"
                              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -15 }}
                              transition={{ duration: 0.3 }}
                              className="space-y-2 pt-1"
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
                                          {hasBlue && (
                                            <motion.span
                                              initial={{ scale: shouldReduceMotion ? 1 : 0 }}
                                              animate={{ scale: 1 }}
                                              transition={{ delay: 0.1 }}
                                              className="w-1 h-1 rounded-full bg-cat-newton"
                                            />
                                          )}
                                          {hasGreen && (
                                            <motion.span
                                              initial={{ scale: shouldReduceMotion ? 1 : 0 }}
                                              animate={{ scale: 1 }}
                                              transition={{ delay: 0.18 }}
                                              className="w-1 h-1 rounded-full bg-cat-club"
                                            />
                                          )}
                                          {hasRed && (
                                            <motion.span
                                              initial={{ scale: shouldReduceMotion ? 1 : 0 }}
                                              animate={{ scale: 1 }}
                                              transition={{ delay: 0.24 }}
                                              className="w-1 h-1 rounded-full bg-cat-ru"
                                            />
                                          )}
                                          {hasPersonal && (
                                            <motion.span
                                              initial={{ scale: shouldReduceMotion ? 1 : 0 }}
                                              animate={{ scale: 1 }}
                                              transition={{ delay: 0.3 }}
                                              className="w-1 h-1 rounded-full bg-cat-personal"
                                            />
                                          )}
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
                                              delay: 0.4,
                                            }}
                                          />
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Tapped Day's Event Slides Up from Bottom */}
                              <motion.div
                                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35, delay: shouldReduceMotion ? 0 : 0.4 }}
                                className="bg-cream rounded-xl p-2.5 border border-terracotta/30 shadow-warm-sm"
                              >
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
                              </motion.div>

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
                            </motion.div>
                          )}

                          {/* Stage 03: Event Details View with Pulsing Room Pin & Notify Me Button */}
                          {activeStep === 2 && (
                            <motion.div
                              key="screen-3"
                              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -15 }}
                              transition={{ duration: 0.3 }}
                              className="space-y-2.5 pt-1"
                            >
                              {/* Poster Header */}
                              <motion.div
                                initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                className="h-20 w-full rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 p-2.5 flex flex-col justify-between text-white shadow-sm relative overflow-hidden"
                              >
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
                              </motion.div>

                              {/* Event Details Card with Staggered Rows */}
                              <div className="bg-cream rounded-2xl p-2.5 border border-beige-dark/60 space-y-2 text-[10px]">
                                <motion.div
                                  initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.1, duration: 0.25 }}
                                  className="flex items-center gap-2 text-charcoal"
                                >
                                  <Clock className="w-3.5 h-3.5 text-terracotta shrink-0" />
                                  <span className="font-semibold">Friday, Nov 14 • 10:00 AM - 10:00 PM</span>
                                </motion.div>

                                <motion.div
                                  initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.2, duration: 0.25 }}
                                  className="flex items-center gap-2 text-charcoal"
                                >
                                  <span className="relative flex h-3.5 w-3.5 items-center justify-center shrink-0">
                                    {!shouldReduceMotion && (
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terracotta/40 opacity-75" />
                                    )}
                                    <MapPin className="relative w-3.5 h-3.5 text-terracotta shrink-0" />
                                  </span>
                                  <span className="font-semibold">Tinkering Lab, Block B, Floor 2</span>
                                </motion.div>

                                <motion.div
                                  initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.3, duration: 0.25 }}
                                  className="border-t border-beige-dark/40 pt-1.5 text-mutedbrown leading-relaxed text-[9px]"
                                >
                                  Power sockets, Wi-Fi 6, and meals provided for all registered participants. Mentorship desk opens at 11 AM.
                                </motion.div>
                              </div>

                              {/* Notify Me button at bottom of screen 3 */}
                              <motion.button
                                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35, duration: 0.25 }}
                                type="button"
                                onClick={() => handleStepClick(3)}
                                className="w-full py-2 px-3 rounded-xl bg-terracotta text-cream text-[10px] font-bold shadow-sm flex items-center justify-center gap-1.5 hover:bg-terracotta-dark transition-colors"
                              >
                                <Bell className="w-3.5 h-3.5" />
                                <span>Notify me</span>
                              </motion.button>
                            </motion.div>
                          )}

                          {/* Stage 04: Animated Finger Tap, Ringing Bell, Confetti, and Reminder Set */}
                          {activeStep === 3 && (
                            <motion.div
                              key="screen-4"
                              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -15 }}
                              transition={{ duration: 0.3 }}
                              className="space-y-3 pt-4 text-center relative"
                            >
                              {/* Ringing Bell Icon */}
                              <motion.div
                                animate={
                                  bellRinging && !shouldReduceMotion
                                    ? { rotate: [0, -18, 18, -12, 12, -6, 6, 0] }
                                    : { rotate: 0 }
                                }
                                transition={{ duration: 0.6 }}
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
                                      duration: 1.4,
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
                            </motion.div>
                          )}
                        </AnimatePresence>
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
                </motion.div>
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
