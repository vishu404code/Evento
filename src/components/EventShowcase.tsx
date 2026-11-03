import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Calendar, Clock, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { SAMPLE_EVENTS, CATEGORIES } from '../constants/data';
import { CategoryType, EventItem } from '../types';
import { triggerConfetti } from '../utils/confetti';

export const EventShowcase: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');
  const [notifiedEvents, setNotifiedEvents] = useState<Record<string, boolean>>({});
  const carouselRef = React.useRef<HTMLDivElement>(null);

  const filteredEvents: EventItem[] =
    selectedCategory === 'all'
      ? SAMPLE_EVENTS
      : SAMPLE_EVENTS.filter((e) => e.category === selectedCategory);

  const handleNotifyToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isNowActive = !notifiedEvents[id];
    setNotifiedEvents((prev) => ({ ...prev, [id]: isNowActive }));

    if (isNowActive) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      triggerConfetti(x, y);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 340;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="showcase" className="py-20 sm:py-28 bg-beige relative overflow-hidden scroll-mt-24 sm:scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream border border-beige-dark text-xs font-semibold text-terracotta mb-3">
              <span>Live Campus Feed</span>
            </div>
            <h2 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-charcoal tracking-tight">
              Explore upcoming events
            </h2>
            <p className="mt-3 text-base text-mutedbrown max-w-xl">
              Filter by campus organizer or scroll through this week's lineup. Tap Notify on any card to simulate an instant calendar ping.
            </p>
          </div>

          {/* Controls: Category Filter Pills & Arrows */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-charcoal text-cream shadow-warm'
                  : 'bg-cream text-charcoal hover:bg-beige-sand border border-beige-dark/70'
              }`}
            >
              All Events ({SAMPLE_EVENTS.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('ru')}
              className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all border ${
                selectedCategory === 'ru'
                  ? 'bg-cat-ru text-cream shadow-warm border-cat-ru'
                  : 'bg-cat-ru-bg text-cat-ru border-cat-ru/30 hover:bg-cat-ru-bg/80'
              }`}
            >
              RU Official
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('newton')}
              className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all border ${
                selectedCategory === 'newton'
                  ? 'bg-cat-newton text-cream shadow-warm border-cat-newton'
                  : 'bg-cat-newton-bg text-cat-newton border-cat-newton/30 hover:bg-cat-newton-bg/80'
              }`}
            >
              Newton School
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('club')}
              className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all border ${
                selectedCategory === 'club'
                  ? 'bg-cat-club text-cream shadow-warm border-cat-club'
                  : 'bg-cat-club-bg text-cat-club border-cat-club/30 hover:bg-cat-club-bg/80'
              }`}
            >
              Student Clubs
            </button>

            {/* Scroll Carousel Arrow Controls */}
            <div className="hidden sm:flex items-center gap-1.5 ml-2">
              <button
                type="button"
                onClick={() => scroll('left')}
                className="p-2 rounded-full bg-cream border border-beige-dark hover:border-terracotta text-charcoal hover:text-terracotta transition-colors shadow-warm-sm"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                className="p-2 rounded-full bg-cream border border-beige-dark hover:border-terracotta text-charcoal hover:text-terracotta transition-colors shadow-warm-sm"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Drag/Scroll Carousel */}
        <div
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto no-scrollbar pb-6 pt-2 snap-x snap-mandatory focus:outline-none -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 cursor-grab active:cursor-grabbing"
          tabIndex={0}
          aria-label="Horizontal list of event cards"
        >
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((event) => {
              const catInfo = CATEGORIES[event.category];
              const isNotified = notifiedEvents[event.id];

              return (
                <motion.div
                  layout
                  key={event.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.25 }}
                  whileHover={{ y: -6, transition: { duration: 0.15 } }}
                  className="w-[290px] sm:w-[330px] shrink-0 bg-cream rounded-3xl p-4 sm:p-5 shadow-warm-md hover:shadow-warm-xl border border-beige-dark/70 flex flex-col justify-between snap-start"
                >
                  <div>
                    {/* Event Gradient Poster Header */}
                    <div
                      className={`h-32 rounded-2xl bg-gradient-to-tr ${event.gradient} p-4 flex flex-col justify-between text-white relative overflow-hidden shadow-inner`}
                    >
                      <div className="flex items-center justify-between relative z-10">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${catInfo.badgeBg} ${catInfo.badgeText} shadow-sm`}
                        >
                          {catInfo.label}
                        </span>
                        <div className="w-7 h-7 rounded-full bg-black/25 backdrop-blur-md flex items-center justify-center text-xs font-bold text-white">
                          {event.clubInitials}
                        </div>
                      </div>

                      <div className="relative z-10 flex items-center justify-between text-xs font-semibold">
                        <span className="truncate max-w-[200px]">{event.clubName}</span>
                        {event.isPopular && (
                          <span className="bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            Popular
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Meta & Title */}
                    <div className="mt-4 space-y-2">
                      <h3 className="font-serif font-bold text-base sm:text-lg text-charcoal leading-snug line-clamp-2">
                        {event.title}
                      </h3>
                      <p className="text-xs text-mutedbrown line-clamp-2 leading-relaxed">
                        {event.description}
                      </p>
                    </div>

                    {/* Venue & Time */}
                    <div className="mt-4 pt-3 border-t border-beige-dark/40 space-y-2 text-xs text-mutedbrown">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-terracotta shrink-0" />
                        <span className="font-semibold text-charcoal/90">{event.date}</span>
                        <span className="text-mutedbrown/50">•</span>
                        <Clock className="w-3.5 h-3.5 text-terracotta shrink-0" />
                        <span className="truncate">{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-terracotta shrink-0" />
                        <span className="truncate font-medium text-charcoal/90">{event.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Notify Action Toggle */}
                  <div className="mt-5 pt-3 border-t border-beige-dark/40">
                    <button
                      type="button"
                      onClick={(e) => handleNotifyToggle(event.id, e)}
                      className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 border ${
                        isNotified
                          ? 'bg-cat-club-bg text-cat-club border-cat-club/40 shadow-sm'
                          : 'bg-beige/60 hover:bg-terracotta/10 text-charcoal hover:text-terracotta border-beige-dark/70 hover:border-terracotta/40'
                      }`}
                      aria-label={`Toggle reminder for ${event.title}`}
                    >
                      {isNotified ? (
                        <>
                          <Check className="w-4 h-4 stroke-[2.5]" />
                          <span>Reminder set ✓</span>
                        </>
                      ) : (
                        <>
                          <Bell className="w-4 h-4" />
                          <span>Notify me</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Carousel Tip */}
        <div className="mt-4 text-center text-xs text-mutedbrown/80 flex items-center justify-center gap-2">
          <span>← Drag horizontally or use arrow keys →</span>
        </div>
      </div>
    </section>
  );
};
