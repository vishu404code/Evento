import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, AlertCircle, CheckCircle, UploadCloud, Sparkles, Building, Calendar, Clock, MapPin } from 'lucide-react';
import { triggerConfetti } from '../utils/confetti';

export const OrganizerFlow: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [publishedCard, setPublishedCard] = useState<{
    title: string;
    club: string;
    location: string;
    date: string;
    time: string;
  } | null>(null);

  // Form fields
  const [formTitle, setFormTitle] = useState('Design Thinking Workshop');
  const [formClub, setFormClub] = useState('Designers Guild RU');
  const [formLocation, setFormLocation] = useState('Innovation Hub, Lab 4');
  const [formCategory, setFormCategory] = useState<'ru' | 'newton' | 'club'>('club');
  const [formDate, setFormDate] = useState('2026-11-28');
  const [formTime, setFormTime] = useState('11:00 AM - 1:00 PM');

  const handleEmailCheck = (inputVal: string) => {
    setEmail(inputVal);
    if (!inputVal) {
      setErrorMsg('');
      setIsVerified(false);
      return;
    }

    if (inputVal.toLowerCase().endsWith('@rishihood.edu.in')) {
      setIsVerified(true);
      setErrorMsg('');
    } else {
      setIsVerified(false);
      setErrorMsg('Only official RU emails (@rishihood.edu.in) can publish events.');
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    setPublishedCard({
      title: formTitle,
      club: formClub,
      location: formLocation,
      date: formDate,
      time: formTime,
    });
    triggerConfetti(0.5, 0.5);
  };

  return (
    <section id="organizers" className="py-20 sm:py-28 bg-beige-sand/50 relative overflow-hidden border-t border-beige-dark/50 scroll-mt-24 sm:scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream border border-beige-dark text-xs font-semibold text-terracotta mb-3">
            <Building className="w-3.5 h-3.5 text-terracotta" />
            <span>Club Leads & Departments</span>
          </div>
          <h2 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-charcoal tracking-tight">
            Publish once. Reach every student.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-mutedbrown">
            No more forwarding flyers across 14 WhatsApp batch groups. Sign in with your official university credentials and get instant campus-wide reach.
          </p>
        </div>

        {/* Organizer Flow Container */}
        <div className="max-w-4xl mx-auto bg-cream rounded-3xl p-6 sm:p-10 shadow-warm-xl border border-beige-dark/70">
          {/* Step 1: RU Email Verification Demo */}
          <div className="mb-8 pb-8 border-b border-beige-dark/50">
            <div className="flex items-center justify-between mb-3">
              <label htmlFor="ru-email-input" className="text-sm font-bold text-charcoal flex items-center gap-2">
                <span>Step 1: Organizer verification</span>
                <span className="text-[10px] text-mutedbrown font-normal bg-beige-light px-2 py-0.5 rounded-full border border-beige-dark/50">
                  Interactive simulation
                </span>
              </label>
              <button
                type="button"
                onClick={() => handleEmailCheck('ecell.lead@rishihood.edu.in')}
                className="text-xs font-semibold text-terracotta hover:underline"
              >
                Auto-fill valid RU email
              </button>
            </div>

            <div className="relative">
              <input
                id="ru-email-input"
                type="email"
                value={email}
                onChange={(e) => handleEmailCheck(e.target.value)}
                placeholder="Type e.g., yourname@rishihood.edu.in"
                className="w-full px-4 py-3 text-sm rounded-2xl bg-beige-light border border-beige-dark text-charcoal placeholder-mutedbrown/60 focus:border-terracotta focus:ring-1 focus:ring-terracotta focus:outline-none transition-all"
              />
              <div className="absolute right-3.5 top-3.5">
                {isVerified ? (
                  <CheckCircle className="w-5 h-5 text-cat-club" />
                ) : errorMsg ? (
                  <AlertCircle className="w-5 h-5 text-cat-ru" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-mutedbrown/40" />
                )}
              </div>
            </div>

            {/* Validation Feedback */}
            {isVerified && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2.5 flex items-center gap-2 text-xs font-semibold text-cat-club"
              >
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Verified Rishihood University identity! Publishing permissions unlocked.</span>
              </motion.div>
            )}

            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2.5 flex items-center gap-2 text-xs font-semibold text-cat-ru"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {!email && (
              <p className="mt-2 text-xs text-mutedbrown">
                Try entering an email like <span className="font-mono text-charcoal">student@gmail.com</span> vs <span className="font-mono text-terracotta font-semibold">club@rishihood.edu.in</span>.
              </p>
            )}
          </div>

          {/* Step 2: Mock Upload Form Preview */}
          <div className="relative">
            {!isVerified && (
              <div className="absolute inset-0 bg-cream/70 backdrop-blur-[2px] z-20 rounded-2xl flex flex-col items-center justify-center p-6 text-center border border-beige-dark/40">
                <ShieldCheck className="w-10 h-10 text-mutedbrown/50 mb-2" />
                <h4 className="font-serif font-bold text-base text-charcoal">
                  Form Locked
                </h4>
                <p className="text-xs text-mutedbrown max-w-sm mt-1">
                  Verify with an official <span className="font-semibold text-terracotta">@rishihood.edu.in</span> email above to enable the publishing console.
                </p>
                <button
                  type="button"
                  onClick={() => handleEmailCheck('president@rishihood.edu.in')}
                  className="mt-3 px-4 py-2 text-xs font-bold text-cream bg-terracotta hover:bg-terracotta-dark rounded-xl transition-all shadow-warm"
                >
                  Unlock Form with 1-Click
                </button>
              </div>
            )}

            <form onSubmit={handlePublish} className="space-y-5">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-terracotta">
                  Step 2: Create Event Listing
                </span>
                <span className="text-xs text-mutedbrown">Takes ~60 seconds</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Event Title
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-beige-light border border-beige-dark text-charcoal focus:border-terracotta focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Organizing Club or Dept
                  </label>
                  <input
                    type="text"
                    value={formClub}
                    onChange={(e) => setFormClub(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-beige-light border border-beige-dark text-charcoal focus:border-terracotta focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Location / Room
                  </label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-beige-light border border-beige-dark text-charcoal focus:border-terracotta focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-beige-light border border-beige-dark text-charcoal focus:border-terracotta focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Start/End Time
                  </label>
                  <input
                    type="text"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    placeholder="e.g. 11:00 AM - 1:00 PM"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-beige-light border border-beige-dark text-charcoal focus:border-terracotta focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Category Tag
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as 'ru' | 'newton' | 'club')}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-beige-light border border-beige-dark text-charcoal focus:border-terracotta focus:outline-none"
                  >
                    <option value="club">Student Club</option>
                    <option value="newton">Newton School</option>
                    <option value="ru">RU Official</option>
                  </select>
                </div>
              </div>

              {/* Poster Dropzone Mock */}
              <div className="p-4 rounded-2xl bg-beige-light border border-dashed border-beige-dark/80 flex flex-col items-center justify-center text-center">
                <UploadCloud className="w-6 h-6 text-terracotta mb-1" />
                <span className="text-xs font-semibold text-charcoal">
                  Poster upload ready (Auto-formatted for mobile feed)
                </span>
                <span className="text-[10px] text-mutedbrown mt-0.5">
                  PNG, JPG or SVG up to 10MB
                </span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <a
                  href="/upload"
                  className="text-xs font-semibold text-mutedbrown hover:text-charcoal"
                >
                  Visit /upload standalone route →
                </a>
                <button
                  type="submit"
                  disabled={!isVerified}
                  className="px-6 py-2.5 text-xs font-bold text-cream bg-terracotta hover:bg-terracotta-dark disabled:opacity-40 rounded-xl transition-all shadow-warm flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Publish to Campus Feed</span>
                </button>
              </div>
            </form>
          </div>

          {/* Step 3: Published Live Card Preview */}
          <AnimatePresence>
            {publishedCard && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-8 pt-8 border-t border-beige-dark/50"
              >
                <div className="text-xs font-bold uppercase tracking-wider text-cat-club flex items-center gap-1.5 mb-3">
                  <CheckCircle className="w-4 h-4" />
                  <span>Event successfully published live! Preview in mock home feed:</span>
                </div>

                <div className="bg-beige-light rounded-2xl p-4 sm:p-5 border border-beige-dark/80 max-w-md shadow-warm-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cat-club-bg text-cat-club">
                      Student Club
                    </span>
                    <span className="text-[10px] text-cat-club font-semibold bg-white px-2 py-0.5 rounded-full shadow-xs">
                      Just Published
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-base text-charcoal">
                    {publishedCard.title}
                  </h4>
                  <p className="text-xs text-mutedbrown mt-0.5 font-medium">
                    {publishedCard.club}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-3 pt-2 border-t border-beige-dark/40 text-[11px] text-mutedbrown">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-terracotta" />
                      <span>{publishedCard.date}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-terracotta" />
                      <span>{publishedCard.time}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-terracotta" />
                      <span>{publishedCard.location}</span>
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
