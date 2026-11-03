import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const BackgroundBlobs: React.FC = () => {
  const { scrollY } = useScroll();

  const y1 = useTransform(scrollY, [0, 2000], [0, -180]);
  const y2 = useTransform(scrollY, [0, 2000], [0, 220]);
  const y3 = useTransform(scrollY, [1000, 3500], [0, -160]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
      {/* Top right warm blob */}
      <motion.div
        style={{ y: y1 }}
        className="absolute -top-32 -right-32 w-96 sm:w-[500px] h-96 sm:h-[500px] rounded-full bg-gradient-to-br from-terracotta/10 via-beige-sand to-transparent blur-3xl opacity-70"
      />

      {/* Middle left soft sand blob */}
      <motion.div
        style={{ y: y2 }}
        className="absolute top-[35%] -left-36 w-80 sm:w-[480px] h-80 sm:h-[480px] rounded-full bg-gradient-to-tr from-terracotta/8 via-beige-sand/60 to-transparent blur-3xl opacity-60"
      />

      {/* Bottom right earthy glow */}
      <motion.div
        style={{ y: y3 }}
        className="absolute top-[70%] -right-20 w-80 sm:w-[520px] h-80 sm:h-[520px] rounded-full bg-gradient-to-bl from-terracotta/12 via-beige-sand to-transparent blur-3xl opacity-70"
      />
    </div>
  );
};

