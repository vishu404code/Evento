import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, MapPin, Clock, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { triggerConfetti } from '../utils/confetti';

interface CardData {
  id: string;
  title: string;
  categoryLabel: string;
  clubInitials: string;
  clubName: string;
  date: string;
  time: string;
  location: string;
  theme: {
    bg: string;
    circle1: string;
    circle2: string;
    badgeBg: string;
    badgeText: string;
    accentDot: string;
  };
}

const HERO_CARDS: CardData[] = [
  {
    id: 'card-newton',
    title: 'HackRU 2026: 36h Code Sprint',
    categoryLabel: 'Newton',
    clubInitials: 'NCS',
    clubName: 'Newton Coding Society',
    date: 'Fri, Nov 14',
    time: '10:00 AM',
    location: 'Tinkering Lab, Block B',
    theme: {
      bg: 'bg-[#2E5882]',
      circle1: 'bg-[#3F73A7]/60',
      circle2: 'bg-[#24476B]/80',
      badgeBg: 'bg-[#E3EDF7]',
      badgeText: 'text-[#1E4369]',
      accentDot: '#8CB8E8',
    },
  },
  {
    id: 'card-club',
    title: 'Cultural Fest: Dhwani Auditions',
    categoryLabel: 'Student club',
    clubInitials: 'RMC',
    clubName: 'Rishihood Music Club',
    date: 'Mon, Nov 17',
    time: '4:30 PM',
    location: 'Amphitheatre',
    theme: {
      bg: 'bg-[#335F47]',
      circle1: 'bg-[#477C5F]/70',
      circle2: 'bg-[#244533]/80',
      badgeBg: 'bg-[#E5F2EB]',
      badgeText: 'text-[#204733]',
      accentDot: '#98D6B2',
    },
  },
  {
    id: 'card-ru',
    title: 'Annual Convocation Rehearsal',
    categoryLabel: 'RU',
    clubInitials: 'RU',
    clubName: 'Office of Academic Affairs',
    date: 'Wed, Nov 19',
    time: '2:00 PM',
    location: 'Main Auditorium',
    theme: {
      bg: 'bg-[#984535]',
      circle1: 'bg-[#B55947]/70',
      circle2: 'bg-[#783325]/80',
      badgeBg: 'bg-[#F9ECE9]',
      badgeText: 'text-[#70291D]',
      accentDot: '#ECA094',
    },
  },
];

export const FloatingEventCards: React.FC = () => {
  // Center card is index 1 ("Cultural Fest: Dhwani Auditions"), exactly matching user's reference mockup
  const [activeIndex, setActiveIndex] = useState(1);
  const [notifiedCards, setNotifiedCards] = useState<Record<string, boolean>>({
    'card-club': false,
  });

  const nextCard = () => {
    setActiveIndex((prev) => (prev + 1) % HERO_CARDS.length);
  };

  const prevCard = () => {
    setActiveIndex((prev) => (prev - 1 + HERO_CARDS.length) % HERO_CARDS.length);
  };

  const handleNotifyToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isNowActive = !notifiedCards[id];
    setNotifiedCards((prev) => ({ ...prev, [id]: isNowActive }));

    if (isNowActive) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      triggerConfetti(x, y);
    }
  };

  // Calculate fan position for cards
  const getFanStyles = (cardIndex: number) => {
    let diff = cardIndex - activeIndex;
    if (diff < -1) diff += HERO_CARDS.length;
    if (diff > 1) diff -= HERO_CARDS.length;

    const isSmall = typeof window !== 'undefined' && window.innerWidth < 640;
    const xOffset = isSmall ? 68 : 115;
    const rot = isSmall ? 9 : 13;
    const yOffset = isSmall ? 10 : 16;

    if (diff === 0) {
      // Center active card
      return {
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
        zIndex: 30,
        opacity: 1,
        filter: 'brightness(1)',
      };
    } else if (diff === -1) {
      // Left fanned card
      return {
        x: -xOffset,
        y: yOffset,
        rotate: -rot,
        scale: 0.92,
        zIndex: 15,
        opacity: 0.92,
        filter: 'brightness(0.96)',
      };
    } else {
      // Right fanned card
      return {
        x: xOffset,
        y: yOffset,
        rotate: rot,
        scale: 0.92,
        zIndex: 15,
        opacity: 0.92,
        filter: 'brightness(0.96)',
      };
    }
  };

  return (
    <div className="relative w-full max-w-[480px] sm:max-w-[560px] lg:max-w-[600px] flex flex-col items-center select-none mx-auto pt-1 pb-2">
      {/* Main Fanned Deck Area with Left/Right Arrow Buttons */}
      <div className="relative w-full h-[390px] sm:h-[420px] flex items-center justify-center">
        {/* Left Circular Arrow Button */}
        <button
          type="button"
          onClick={prevCard}
          className="absolute -left-1 sm:-left-6 lg:-left-8 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cream hover:bg-white text-charcoal hover:text-terracotta border border-beige-dark/90 hover:border-terracotta shadow-warm hover:shadow-warm-md flex items-center justify-center transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
          aria-label="Previous card"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Right Circular Arrow Button */}
        <button
          type="button"
          onClick={nextCard}
          className="absolute -right-1 sm:-right-6 lg:-right-8 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cream hover:bg-white text-charcoal hover:text-terracotta border border-beige-dark/90 hover:border-terracotta shadow-warm hover:shadow-warm-md flex items-center justify-center transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
          aria-label="Next card"
        >
          <ChevronRight className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Fanned Cards Stack */}
        <div className="relative w-full h-full flex items-center justify-center">
          {HERO_CARDS.map((card, idx) => {
            const fan = getFanStyles(idx);
            const isCenter = idx === activeIndex;
            const isNotified = notifiedCards[card.id];

            return (
              <motion.div
                key={card.id}
                initial={false}
                animate={{
                  x: fan.x,
                  y: fan.y,
                  rotate: fan.rotate,
                  scale: fan.scale,
                  zIndex: fan.zIndex,
                  opacity: fan.opacity,
                  filter: fan.filter,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 280,
                  damping: 24,
                  mass: 0.9,
                }}
                drag={isCenter ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.25}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 40) {
                    prevCard();
                  } else if (info.offset.x < -40) {
                    nextCard();
                  }
                }}
                onClick={() => {
                  if (!isCenter) {
                    setActiveIndex(idx);
                  }
                }}
                whileHover={
                  isCenter
                    ? { y: -4, transition: { duration: 0.2 } }
                    : { scale: 0.95, y: 10, transition: { duration: 0.2 } }
                }
                style={{
                  position: 'absolute',
                  transformOrigin: 'bottom center',
                }}
                className={`w-[260px] sm:w-[295px] bg-cream rounded-3xl p-4 sm:p-4.5 border border-beige-dark/80 cursor-pointer will-change-transform ${
                  isCenter
                    ? 'shadow-[0_20px_45px_-12px_rgba(43,33,24,0.25),0_6px_18px_-3px_rgba(43,33,24,0.1)]'
                    : 'shadow-warm-md hover:shadow-warm-lg'
                }`}
              >
                {/* Poster Graphic with Organic Circles */}
                <div
                  className={`relative h-28 sm:h-32 w-full rounded-2xl ${card.theme.bg} p-3.5 flex flex-col justify-between overflow-hidden shadow-inner`}
                >
                  {/* Decorative curved organic circles in poster */}
                  <div
                    className={`absolute -bottom-8 -right-8 w-28 h-28 rounded-full ${card.theme.circle1}`}
                  />
                  <div
                    className={`absolute -top-6 -left-6 w-24 h-24 rounded-full ${card.theme.circle2}`}
                  />
                  {/* Small decorative floating dots */}
                  <div
                    className="absolute top-10 left-16 w-1.5 h-1.5 rounded-full opacity-60"
                    style={{ backgroundColor: card.theme.accentDot }}
                  />
                  <div
                    className="absolute bottom-6 right-20 w-1.5 h-1.5 rounded-full opacity-60"
                    style={{ backgroundColor: card.theme.accentDot }}
                  />

                  {/* Header Row: Category Badge + Circle Initials */}
                  <div className="flex items-center justify-between relative z-10">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide ${card.theme.badgeBg} ${card.theme.badgeText} shadow-sm`}
                    >
                      {card.categoryLabel}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center text-white text-[11px] font-bold shadow-xs">
                      {card.clubInitials}
                    </div>
                  </div>

                  {/* Subtitle / Club Name */}
                  <div className="relative z-10 text-white/95 text-xs font-semibold tracking-tight truncate">
                    {card.clubName}
                  </div>
                </div>

                {/* Card Body */}
                <div className="mt-3.5 space-y-2.5">
                  <h3 className="font-serif font-bold text-base sm:text-lg text-charcoal leading-snug line-clamp-2">
                    {card.title}
                  </h3>

                  {/* Metadata Rows */}
                  <div className="space-y-1.5 text-xs text-mutedbrown pt-1 border-t border-beige-dark/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 truncate">
                        <Calendar className="w-3.5 h-3.5 text-terracotta shrink-0" />
                        <span className="font-medium text-charcoal/90">{card.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <Clock className="w-3.5 h-3.5 text-terracotta shrink-0" />
                        <span className="font-medium text-charcoal/90">{card.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-terracotta shrink-0" />
                      <span className="truncate font-medium text-charcoal/90">{card.location}</span>
                    </div>
                  </div>

                  {/* Solid Terracotta Notify Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={(e) => handleNotifyToggle(card.id, e)}
                      className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 shadow-sm active:scale-95 ${
                        isNotified
                          ? 'bg-[#2E7D52] text-white hover:bg-[#256B45]'
                          : 'bg-terracotta hover:bg-terracotta-dark text-white'
                      }`}
                      aria-label={`Toggle reminder for ${card.title}`}
                    >
                      {isNotified ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Reminder set ✓</span>
                        </>
                      ) : (
                        <>
                          <Bell className="w-3.5 h-3.5 fill-current" />
                          <span>Notify me</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Pagination Pill Dots */}
      <div className="mt-4 flex items-center justify-center gap-2 z-40">
        {HERO_CARDS.map((card, idx) => {
          const isActive = activeIndex === idx;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                isActive ? 'w-6 bg-terracotta' : 'w-2 bg-beige-dark hover:bg-mutedbrown/40'
              }`}
              aria-label={`Switch to card ${idx + 1}: ${card.title}`}
            />
          );
        })}
      </div>
    </div>
  );
};
