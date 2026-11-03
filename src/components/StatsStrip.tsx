import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { STATS_LIST } from '../constants/data';
import { Target, Compass } from 'lucide-react';

const Counter: React.FC<{ target: number; suffix: string }> = ({ target, suffix }) => {
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  useEffect(() => {
    if (!isInView) return;

    if (target === 0) {
      setCount(0);
      return;
    }

    let start = 0;
    const duration = 1200;
    const stepTime = Math.max(Math.floor(duration / target), 30);
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= target) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref} className="font-serif font-black text-4xl sm:text-5xl md:text-6xl text-terracotta">
      {count}
      {suffix}
    </span>
  );
};

export const StatsStrip: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-beige-sand/60 border-y border-beige-dark/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-2 mb-3 text-center">
          <Target className="w-4 h-4 text-terracotta" />
          <span className="text-xs font-bold uppercase tracking-wider text-mutedbrown">
            Product Commitments & Design Goals
          </span>
        </div>
        <p className="text-center text-xs text-mutedbrown/80 mb-12 max-w-lg mx-auto">
          We measure our success not by engagement bait, but by how quickly you can discover an event and get on with your day.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 text-center">
          {STATS_LIST.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 sm:p-8 bg-cream/70 rounded-3xl border border-beige-dark/60 shadow-warm-sm flex flex-col items-center justify-between"
            >
              <div className="mb-4">
                <Counter target={stat.value} suffix={stat.suffix} />
              </div>

              <div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-charcoal mb-2">
                  {stat.label}
                </h3>
                <p className="text-xs text-mutedbrown leading-relaxed max-w-xs mx-auto">
                  {stat.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-beige-dark/40 w-full flex items-center justify-center gap-1.5 text-[10px] font-semibold text-mutedbrown/70">
                <Compass className="w-3 h-3 text-terracotta" />
                <span>Engineered for RU Campus</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

