import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Share2, Send, Clock, MapPin, Sparkles, PhoneCall } from 'lucide-react';
import { triggerConfetti } from '../utils/confetti';

export const NotifyShareDemo: React.FC = () => {
  const [remindTiming, setRemindTiming] = useState('1 hour before');
  const [isNotified, setIsNotified] = useState(false);
  const [hasShared, setHasShared] = useState(false);

  const handleNotifyToggle = (e: React.MouseEvent) => {
    const nextState = !isNotified;
    setIsNotified(nextState);
    if (nextState) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      triggerConfetti(
        (rect.left + rect.width / 2) / window.innerWidth,
        (rect.top + rect.height / 2) / window.innerHeight
      );
    }
  };

  const handleShareClick = () => {
    setHasShared(true);
    triggerConfetti(0.7, 0.5);
  };

  return (
    <section id="notify" className="py-20 sm:py-28 bg-beige relative overflow-hidden scroll-mt-24 sm:scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream border border-beige-dark text-xs font-semibold text-terracotta mb-3">
            <Sparkles className="w-3.5 h-3.5 text-terracotta" />
            <span>Effortless Distribution</span>
          </div>
          <h2 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-charcoal tracking-tight">
            Notify & share with one tap
          </h2>
          <p className="mt-4 text-base sm:text-lg text-mutedbrown">
            Set custom reminders so you never miss a start bell, or share a clean rich link to your friend circle with zero screenshot fuzziness.
          </p>
        </div>

        {/* Demo Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Mock Event Card with Timing Selector */}
          <div className="lg:col-span-6 bg-cream rounded-3xl p-6 sm:p-8 shadow-warm-lg border border-beige-dark/70">
            <div className="flex items-center justify-between pb-4 border-b border-beige-dark/40 mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-terracotta">
                1. Reminder Settings
              </span>
              <span className="text-xs text-mutedbrown bg-beige-light px-2.5 py-1 rounded-full">
                Interactive preview
              </span>
            </div>

            {/* Poster Header */}
            <div className="h-32 rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 p-4 flex flex-col justify-between text-white shadow-inner mb-5">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 w-max">
                Newton Coding Society
              </span>
              <div>
                <h4 className="font-serif font-bold text-base text-white">
                  HackRU 2026: 36h Code Sprint
                </h4>
                <p className="text-[11px] text-white/80">Tinkering Lab, Block B</p>
              </div>
            </div>

            {/* Timing Selector Buttons */}
            <div className="space-y-2 mb-6">
              <label className="block text-xs font-bold text-charcoal">
                Remind me before the event:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['15 mins before', '1 hour before', '1 day before'].map((timing) => (
                  <button
                    key={timing}
                    type="button"
                    onClick={() => setRemindTiming(timing)}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all border ${
                      remindTiming === timing
                        ? 'bg-charcoal text-cream border-charcoal shadow-warm-sm'
                        : 'bg-beige-light text-mutedbrown hover:text-charcoal border-beige-dark/60'
                    }`}
                  >
                    {timing}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions: Notify & Share */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleNotifyToggle}
                className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all border ${
                  isNotified
                    ? 'bg-cat-club-bg text-cat-club border-cat-club/40 shadow-sm'
                    : 'bg-terracotta text-cream hover:bg-terracotta-dark border-transparent shadow-warm'
                }`}
              >
                {isNotified ? (
                  <>
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>Alert Set ({remindTiming})</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4" />
                    <span>Set Reminder</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleShareClick}
                className="py-3 px-4 rounded-xl text-xs font-bold text-charcoal hover:text-terracotta bg-beige-light hover:bg-beige border border-beige-dark/70 transition-all flex items-center justify-center gap-2 shadow-warm-sm"
              >
                <Share2 className="w-4 h-4 text-terracotta" />
                <span>Drop link to WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Right: Mock WhatsApp Chat Interface */}
          <div className="lg:col-span-6 bg-[#EFEAE2] rounded-3xl p-5 sm:p-7 shadow-warm-xl border border-stone-300 relative overflow-hidden flex flex-col justify-between min-h-[460px]">
            {/* Chat Header */}
            <div className="bg-[#075E54] text-white p-3 rounded-2xl flex items-center justify-between mb-4 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                  RU
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">Batch of 2026 Chill Group</div>
                  <div className="text-[10px] text-white/70">Aman, Sneha, Rohan, Kabir...</div>
                </div>
              </div>
              <PhoneCall className="w-4 h-4 text-white/70" />
            </div>

            {/* Chat Body */}
            <div className="space-y-3 py-2 flex-1">
              <div className="bg-white rounded-xl rounded-tl-none p-2.5 max-w-[260px] text-xs shadow-xs text-charcoal border border-stone-200">
                <div className="text-[10px] font-bold text-emerald-700">Rohan</div>
                <p>Are we participating in the coding hackathon this Friday?</p>
                <span className="text-[9px] text-mutedbrown/60 block text-right mt-1">10:14 AM</span>
              </div>

              {/* Shared Rich Event Preview */}
              <AnimatePresence>
                {hasShared ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="ml-auto bg-[#DCF8C6] rounded-2xl rounded-tr-none p-3 max-w-[310px] shadow-sm border border-[#C2E8AA]"
                  >
                    <div className="text-[10px] font-bold text-stone-700 mb-1">You shared an event</div>
                    
                    {/* Rich card preview */}
                    <div className="bg-white rounded-xl overflow-hidden border border-stone-200">
                      <div className="h-16 bg-gradient-to-r from-blue-700 to-indigo-700 p-2 text-white flex items-center">
                        <span className="font-serif font-bold text-xs">HackRU 2026 Sprint</span>
                      </div>
                      <div className="p-2.5 text-[11px] space-y-1">
                        <div className="font-bold text-charcoal">evento.rishihood.edu.in/e/hackru</div>
                        <div className="flex items-center gap-1 text-[10px] text-mutedbrown">
                          <Clock className="w-3 h-3 text-terracotta" />
                          <span>Fri, Nov 14 • 10:00 AM</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-mutedbrown">
                          <MapPin className="w-3 h-3 text-terracotta" />
                          <span>Tinkering Lab, Block B</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[9px] text-stone-600 block text-right mt-1.5">Just now ✓✓</span>
                  </motion.div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-xs text-stone-500 italic bg-white/70 py-2 px-4 rounded-full inline-block border border-stone-200">
                      Tap "Drop link to WhatsApp" on the left to see instant rich preview!
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Caption */}
            <div className="pt-3 border-t border-stone-300 flex items-center justify-between text-xs font-semibold text-stone-700">
              <span>Share one link. Everyone sees the verified details.</span>
              <Send className="w-3.5 h-3.5 text-stone-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
