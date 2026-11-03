import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Calendar as CalendarIcon, Clock, MapPin, Check, Filter } from 'lucide-react';
import { SAMPLE_EVENTS, CATEGORIES } from '../constants/data';
import { CategoryType } from '../types';

interface CalendarEventDot {
  id: string;
  title: string;
  category: CategoryType;
  time: string;
  location: string;
}

export const MiniCalendar: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<number>(14);
  const [visibleFilters, setVisibleFilters] = useState<Record<CategoryType, boolean>>({
    ru: true,
    newton: true,
    club: true,
    personal: true,
  });

  const [personalEvents, setPersonalEvents] = useState<Record<number, CalendarEventDot[]>>({
    16: [
      {
        id: 'pers-1',
        title: 'Mid-term Study Group in Library',
        category: 'personal',
        time: '6:00 PM - 8:30 PM',
        location: 'Central Library, 2nd Fl.',
      },
    ],
  });

  const [newPersonalTitle, setNewPersonalTitle] = useState('');
  const [isAddingPersonal, setIsAddingPersonal] = useState(false);

  // Map events to day
  const eventsByDay: Record<number, CalendarEventDot[]> = {};
  SAMPLE_EVENTS.forEach((e) => {
    if (!eventsByDay[e.dayOfMonth]) {
      eventsByDay[e.dayOfMonth] = [];
    }
    eventsByDay[e.dayOfMonth].push({
      id: e.id,
      title: e.title,
      category: e.category,
      time: e.time,
      location: e.location,
    });
  });

  // Combine with personal events
  Object.keys(personalEvents).forEach((dayStr) => {
    const day = Number(dayStr);
    if (!eventsByDay[day]) {
      eventsByDay[day] = [];
    }
    eventsByDay[day] = [...eventsByDay[day], ...personalEvents[day]];
  });

  const toggleCategoryFilter = (cat: CategoryType) => {
    setVisibleFilters((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleAddPersonalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPersonalTitle.trim()) return;

    const newDot: CalendarEventDot = {
      id: `pers-${Date.now()}`,
      title: newPersonalTitle.trim(),
      category: 'personal',
      time: 'Flexible Time',
      location: 'RU Campus',
    };

    setPersonalEvents((prev) => ({
      ...prev,
      [selectedDay]: [...(prev[selectedDay] || []), newDot],
    }));

    setNewPersonalTitle('');
    setIsAddingPersonal(false);
  };

  const activeDayEvents = (eventsByDay[selectedDay] || []).filter(
    (ev) => visibleFilters[ev.category]
  );

  return (
    <section id="calendar" className="py-20 sm:py-28 bg-beige-sand/50 relative overflow-hidden border-t border-beige-dark/50 scroll-mt-24 sm:scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream border border-beige-dark text-xs font-semibold text-terracotta mb-3">
            <CalendarIcon className="w-3.5 h-3.5 text-terracotta" />
            <span>Campus Rhythm</span>
          </div>
          <h2 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-charcoal tracking-tight">
            Colour-coded campus calendar
          </h2>
          <p className="mt-4 text-base sm:text-lg text-mutedbrown">
            Every department and student society shares the same verified monthly timeline. Click any date to inspect details or slot in your personal study session.
          </p>
        </div>

        {/* Legend & Filter Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10">
          <span className="text-xs font-bold text-mutedbrown flex items-center gap-1.5 mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter categories:</span>
          </span>

          {(['ru', 'newton', 'club', 'personal'] as CategoryType[]).map((cat) => {
            const isVisible = visibleFilters[cat];
            const info = CATEGORIES[cat];
            return (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategoryFilter(cat)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  isVisible
                    ? 'bg-cream shadow-warm-sm border-beige-dark/80 text-charcoal'
                    : 'bg-beige/40 opacity-50 border-dashed border-beige-dark text-mutedbrown'
                }`}
                aria-label={`Toggle visibility of ${info.name}`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: info.dotColor }}
                />
                <span>{info.name}</span>
                {isVisible && <Check className="w-3 h-3 text-terracotta ml-0.5" />}
              </button>
            );
          })}
        </div>

        {/* Calendar & Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Interactive Month Matrix */}
          <div className="lg:col-span-7 bg-cream rounded-3xl p-6 sm:p-8 shadow-warm-lg border border-beige-dark/70">
            <div className="flex items-center justify-between pb-6 border-b border-beige-dark/40 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-terracotta">
                  Academic Semester
                </span>
                <h3 className="font-serif font-bold text-2xl text-charcoal">
                  November 2026
                </h3>
              </div>
              <div className="text-xs font-semibold text-mutedbrown bg-beige-light px-3 py-1.5 rounded-full border border-beige-dark/40">
                Semester 1 Schedule
              </div>
            </div>

            {/* Day of week headers */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-mutedbrown mb-3">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>

            {/* Date Grid */}
            <div className="grid grid-cols-7 gap-2 sm:gap-2.5">
              {Array.from({ length: 30 }).map((_, i) => {
                const day = i + 1;
                const isSelected = selectedDay === day;
                const dayEvents = (eventsByDay[day] || []).filter(
                  (e) => visibleFilters[e.category]
                );

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={`relative min-h-[58px] sm:min-h-[66px] p-1.5 sm:p-2 rounded-2xl flex flex-col justify-between items-center transition-all duration-200 border text-xs ${
                      isSelected
                        ? 'bg-terracotta/10 border-terracotta ring-2 ring-terracotta/30 shadow-warm-sm'
                        : dayEvents.length > 0
                        ? 'bg-beige-light/90 hover:bg-beige border-beige-dark/70 text-charcoal'
                        : 'bg-transparent hover:bg-beige-light/50 border-transparent text-charcoal/60'
                    }`}
                    aria-label={`Select day ${day} November`}
                  >
                    <span
                      className={`font-semibold text-xs sm:text-sm ${
                        isSelected ? 'text-terracotta font-black' : 'text-charcoal'
                      }`}
                    >
                      {day}
                    </span>

                    {/* Staggered event indicator dots */}
                    <div className="flex flex-wrap justify-center gap-1 w-full max-w-[34px]">
                      {dayEvents.map((ev, dotIdx) => (
                        <motion.span
                          key={`${ev.id}-${dotIdx}`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: dotIdx * 0.05 }}
                          className="w-2 h-2 rounded-full shrink-0 shadow-xs"
                          style={{
                            backgroundColor: CATEGORIES[ev.category].dotColor,
                          }}
                          title={ev.title}
                        />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Helper */}
            <div className="mt-6 pt-4 border-t border-beige-dark/40 flex flex-wrap items-center justify-between text-xs text-mutedbrown gap-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cat-personal" />
                <span>Grey dots denote student-added personal schedule</span>
              </span>
              <span className="text-charcoal font-medium">Click any date to view</span>
            </div>
          </div>

          {/* Right: Selected Day Events & Add Personal Event Interaction */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-cream rounded-3xl p-6 sm:p-7 shadow-warm-lg border border-beige-dark/70">
              <div className="flex items-center justify-between pb-4 border-b border-beige-dark/40 mb-4">
                <div>
                  <span className="text-xs font-bold text-terracotta uppercase">
                    Selected Schedule
                  </span>
                  <h4 className="font-serif font-bold text-xl text-charcoal">
                    Nov {selectedDay}, 2026
                  </h4>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddingPersonal(!isAddingPersonal)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-charcoal hover:text-terracotta bg-beige-light hover:bg-beige border border-beige-dark/70 rounded-xl transition-all shadow-warm-sm"
                >
                  {isAddingPersonal ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>{isAddingPersonal ? 'Cancel' : 'Add Personal'}</span>
                </button>
              </div>

              {/* Add Personal Event Form */}
              <AnimatePresence>
                {isAddingPersonal && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleAddPersonalSubmit}
                    className="mb-5 p-3.5 bg-beige-light rounded-2xl border border-beige-dark space-y-3 overflow-hidden"
                  >
                    <div className="text-xs font-semibold text-charcoal">
                      Add personal reminder for Nov {selectedDay}:
                    </div>
                    <input
                      type="text"
                      value={newPersonalTitle}
                      onChange={(e) => setNewPersonalTitle(e.target.value)}
                      placeholder="e.g., Coding test revision, Gym session"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-cream border border-beige-dark text-charcoal placeholder-mutedbrown/60 focus:border-terracotta focus:outline-none"
                      autoFocus
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingPersonal(false)}
                        className="px-3 py-1.5 text-xs font-medium text-mutedbrown hover:text-charcoal"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!newPersonalTitle.trim()}
                        className="px-3.5 py-1.5 text-xs font-bold text-cream bg-terracotta hover:bg-terracotta-dark disabled:opacity-50 rounded-xl transition-colors shadow-warm-sm"
                      >
                        Save Grey Dot
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Day's Event List */}
              <div className="space-y-3 min-h-[220px]">
                {activeDayEvents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-mutedbrown">
                    <CalendarIcon className="w-8 h-8 text-mutedbrown/40 mb-2 stroke-[1.5]" />
                    <p className="text-sm font-medium">No events on Nov {selectedDay}</p>
                    <p className="text-xs text-mutedbrown/70 mt-1 max-w-[200px]">
                      A quiet day! You can add your own study session using the button above.
                    </p>
                  </div>
                ) : (
                  activeDayEvents.map((ev) => {
                    const catInfo = CATEGORIES[ev.category];
                    return (
                      <div
                        key={ev.id}
                        className="p-4 bg-beige-light rounded-2xl border border-beige-dark/60 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${catInfo.badgeBg} ${catInfo.badgeText}`}
                          >
                            {catInfo.label}
                          </span>
                          <span className="text-[11px] font-medium text-mutedbrown flex items-center gap-1">
                            <Clock className="w-3 h-3 text-terracotta" />
                            <span>{ev.time.split(' - ')[0]}</span>
                          </span>
                        </div>

                        <h5 className="font-serif font-bold text-sm text-charcoal">
                          {ev.title}
                        </h5>

                        <div className="flex items-center gap-1.5 text-xs text-mutedbrown">
                          <MapPin className="w-3.5 h-3.5 text-terracotta shrink-0" />
                          <span className="truncate">{ev.location}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer CTA */}
              <div className="mt-5 pt-4 border-t border-beige-dark/40">
                <a
                  href="/calendar"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-charcoal hover:text-terracotta bg-beige/60 hover:bg-beige border border-beige-dark/80 transition-colors shadow-warm-sm"
                >
                  <span>Open Full Screen Calendar View</span>
                  <span className="text-terracotta">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
