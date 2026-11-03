import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, MessageSquareWarning, CalendarX, BellOff, CheckCircle2 } from 'lucide-react';

interface ChaosItem {
  id: string;
  type: 'msg' | 'poster' | 'query';
  text: string;
  time: string;
  sender?: string;
  rotate: number;
  x: number;
  y: number;
}

const CHAOS_ITEMS: ChaosItem[] = [
  {
    id: 'c1',
    type: 'msg',
    sender: 'Batch 2026 Admin',
    text: 'Guys please check the attached poster for tomorrow! Urgent!',
    time: '11:42 PM',
    rotate: -7,
    x: -20,
    y: -30,
  },
  {
    id: 'c2',
    type: 'poster',
    sender: 'Newton Club Rep',
    text: '📄 HACKATHON_FINAL_REVISED_v3.pdf (24 MB)',
    time: '11:43 PM',
    rotate: 5,
    x: 40,
    y: 10,
  },
  {
    id: 'c3',
    type: 'query',
    sender: 'Aman (RU)',
    text: 'Wait where is the venue? Audi or Block B lab??',
    time: '11:44 PM',
    rotate: -4,
    x: -10,
    y: 60,
  },
  {
    id: 'c4',
    type: 'query',
    sender: 'Sneha',
    text: 'Can someone please resend the Google form link? It got buried.',
    time: '11:48 PM',
    rotate: 8,
    x: 50,
    y: -50,
  },
  {
    id: 'c5',
    type: 'msg',
    sender: 'Rishihood Cultural Rep',
    text: 'Auditions moved to 5 PM today instead of 4 PM! Note note note',
    time: '8:15 AM',
    rotate: -4,
    x: 0,
    y: 80,
  },
];

const ORDERED_ITEMS = [
  {
    title: 'HackRU 2026 Code Sprint',
    venue: 'Tinkering Lab, Block B',
    time: 'Fri, 10:00 AM',
    category: 'Newton School',
    catBg: 'bg-[#E8F1FC] text-[#2563A6]',
    status: 'Verified Location',
  },
  {
    title: 'Dhwani Cultural Auditions',
    venue: 'Open Air Amphitheatre',
    time: 'Mon, 4:30 PM',
    category: 'Student Club',
    catBg: 'bg-[#E9F5EE] text-[#2E7D52]',
    status: 'Updated Timing',
  },
  {
    title: 'Convocation Full Rehearsal',
    venue: 'Main Auditorium, Ground Fl.',
    time: 'Wed, 2:00 PM',
    category: 'RU Official',
    catBg: 'bg-[#FDECEB] text-[#B9382C]',
    status: 'Official Protocol',
  },
];

export const ChaosToOrder: React.FC = () => {
  const [isTidied, setIsTidied] = useState(false);

  return (
    <section id="problem" className="py-20 sm:py-28 bg-beige relative overflow-hidden scroll-mt-24 sm:scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream border border-beige-dark text-xs font-semibold text-terracotta mb-3">
            <span>The WhatsApp Dilemma</span>
          </div>
          <h2 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-charcoal tracking-tight">
            WhatsApp chaos <span className="text-terracotta">→</span> EVENTO order
          </h2>
          <p className="mt-4 text-base sm:text-lg text-mutedbrown">
            College life moves fast. Important announcements, date changes, and venue updates shouldn't be lost in an endless stream of memes and group chatter.
          </p>
        </div>

        {/* Interactive Comparison Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Interactive Transformation Box */}
          <div className="lg:col-span-7 bg-cream rounded-3xl p-6 sm:p-8 shadow-warm-lg border border-beige-dark/70 min-h-[460px] flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-beige-dark/50">
              <div className="flex items-center gap-2.5">
                <div className={`w-3 h-3 rounded-full ${isTidied ? 'bg-cat-club animate-ping' : 'bg-cat-ru'}`} />
                <span className="text-xs font-bold uppercase tracking-wider text-charcoal">
                  {isTidied ? 'EVENTO Structured View' : 'Group Chat Noise (243 unread)'}
                </span>
              </div>

              {/* Tidy up button */}
              <button
                type="button"
                onClick={() => setIsTidied(!isTidied)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-cream bg-terracotta hover:bg-terracotta-dark rounded-xl shadow-warm transition-all duration-200 active:scale-95"
                aria-label={isTidied ? 'View original WhatsApp chaos' : 'Tidy up chaos into clean cards'}
              >
                {isTidied ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>See original chaos</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Tidy up!</span>
                  </>
                )}
              </button>
            </div>

            {/* Content Display: Chaos vs Order */}
            <div className="relative py-8 min-h-[300px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                {!isTidied ? (
                  <motion.div
                    key="chaos"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-full max-w-md h-[280px]"
                  >
                    {CHAOS_ITEMS.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ rotate: item.rotate, x: item.x, y: item.y }}
                        animate={{
                          y: [item.y, item.y - 4, item.y],
                          rotate: [item.rotate, item.rotate + 1, item.rotate],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          repeatType: 'reverse',
                          ease: 'easeInOut',
                        }}
                        className={`absolute rounded-2xl p-3 sm:p-4 text-xs shadow-warm border max-w-[270px] sm:max-w-[300px] cursor-grab ${
                          item.type === 'poster'
                            ? 'bg-amber-50 border-amber-200 text-amber-950 font-medium'
                            : item.type === 'query'
                            ? 'bg-white border-stone-200 text-charcoal'
                            : 'bg-[#DCF8C6] border-[#BDE8A3] text-stone-900'
                        }`}
                        style={{
                          left: `calc(50% + ${item.x}px - 140px)`,
                          top: `calc(50% + ${item.y}px - 70px)`,
                        }}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1 text-[10px] text-mutedbrown font-semibold">
                          <span>{item.sender}</span>
                          <span>{item.time}</span>
                        </div>
                        <p className="leading-relaxed font-sans">{item.text}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="order"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full space-y-3"
                  >
                    {ORDERED_ITEMS.map((card, idx) => (
                      <motion.div
                        key={card.title}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-beige-light rounded-2xl border border-beige-dark/60 gap-3"
                      >
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-cat-club shrink-0 mt-0.5" />
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${card.catBg}`}>
                                {card.category}
                              </span>
                              <span className="text-[10px] text-cat-club font-semibold bg-cat-club-bg px-2 py-0.5 rounded-full">
                                {card.status}
                              </span>
                            </div>
                            <h4 className="font-serif font-bold text-sm text-charcoal">
                              {card.title}
                            </h4>
                          </div>
                        </div>

                        <div className="text-xs text-mutedbrown sm:text-right pl-8 sm:pl-0 font-medium">
                          <div className="text-charcoal font-semibold">{card.time}</div>
                          <div>{card.venue}</div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Caption */}
            <div className="pt-3 border-t border-beige-dark/40 flex items-center justify-between text-xs text-mutedbrown">
              <span>Caption: From 200 unread messages to one clear list.</span>
              <span className="text-terracotta font-semibold hidden sm:inline">Tap "Tidy up" above</span>
            </div>
          </div>

          {/* Right: Three Pain-Point Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 sm:p-6 bg-cream rounded-2xl border border-beige-dark/60 shadow-warm-sm hover:shadow-warm transition-all group">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-cat-ru-bg text-cat-ru flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <MessageSquareWarning className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-charcoal mb-1">
                    Posters buried within hours
                  </h3>
                  <p className="text-sm text-mutedbrown leading-relaxed">
                    Event PDFs get drowned under 400 messages, roll calls, and banter. By the day of the event, nobody knows where the poster went.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6 bg-cream rounded-2xl border border-beige-dark/60 shadow-warm-sm hover:shadow-warm transition-all group">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-cat-newton-bg text-cat-newton flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <CalendarX className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-charcoal mb-1">
                    No single place to see this week
                  </h3>
                  <p className="text-sm text-mutedbrown leading-relaxed">
                    Newton hackathons, RU formal ceremonies, and club open mics are scattered across 6 different WhatsApp announcement groups.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6 bg-cream rounded-2xl border border-beige-dark/60 shadow-warm-sm hover:shadow-warm transition-all group">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-cat-club-bg text-cat-club flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <BellOff className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-charcoal mb-1">
                    No way to set a reminder
                  </h3>
                  <p className="text-sm text-mutedbrown leading-relaxed">
                    You saw an event flyer 4 days ago, liked it, and completely forgot on Friday evening. EVENTO gives you a 1-tap reminder.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
