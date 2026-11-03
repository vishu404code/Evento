import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Calendar, BellRing, Share2, Smartphone, Unlock, ArrowUpRight } from 'lucide-react';

interface FeatureCard {
  icon: React.ElementType;
  title: string;
  description: string;
  badge: string;
}

const FEATURES_DATA: FeatureCard[] = [
  {
    icon: Layers,
    title: 'One place for every event',
    description: 'RU admin advisories, Newton coding bootcamps, and cultural auditions aggregated in a unified feed.',
    badge: 'Consolidation',
  },
  {
    icon: Calendar,
    title: 'Colour-coded calendar',
    description: 'Filter instantly by event type. Spot your whole week at a glance with color dots mapped directly to campus clubs.',
    badge: 'Clarity',
  },
  {
    icon: BellRing,
    title: 'Notify me, never forget',
    description: 'Set a 1-tap browser alert or export straight into your Google/Apple calendar. No missed workshops ever again.',
    badge: 'Punctuality',
  },
  {
    icon: Share2,
    title: 'Shareable event links',
    description: 'Send crisp, rich previews on WhatsApp with full time, venue, and speaker details intact. Say goodbye to blurry screenshots.',
    badge: 'Virality',
  },
  {
    icon: Smartphone,
    title: 'Works great on your phone',
    description: 'Designed from day one for 360px screens. Loads in under 3 seconds on dorm Wi-Fi with lightning-fast finger gestures.',
    badge: 'Mobile First',
  },
  {
    icon: Unlock,
    title: 'Browse without login',
    description: 'Zero account hurdles. Any student can check upcoming campus happenings instantly without memorizing another password.',
    badge: 'Frictionless',
  },
];

export const Features: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-beige relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream border border-beige-dark text-xs font-semibold text-terracotta mb-3">
            <span>Built For Rishihood</span>
          </div>
          <h2 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-charcoal tracking-tight">
            Designed for student life
          </h2>
          <p className="mt-4 text-base sm:text-lg text-mutedbrown">
            Every feature is crafted to remove friction between discovering something great on campus and actually showing up.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {FEATURES_DATA.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group p-6 sm:p-7 bg-cream rounded-3xl border border-beige-dark/70 shadow-warm-sm hover:shadow-warm-xl transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-terracotta-soft text-terracotta flex items-center justify-center group-hover:scale-110 group-hover:bg-terracotta group-hover:text-cream transition-all duration-200 shadow-sm">
                      <Icon className="w-6 h-6 transition-colors" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-mutedbrown bg-beige-light px-2.5 py-1 rounded-full border border-beige-dark/40">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-lg sm:text-xl text-charcoal mb-2 group-hover:text-terracotta transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-sm text-mutedbrown leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-beige-dark/40 flex items-center justify-between text-xs font-semibold text-terracotta opacity-80 group-hover:opacity-100">
                  <span>Explore in action</span>
                  <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

