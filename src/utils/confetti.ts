import confetti from 'canvas-confetti';

export const triggerConfetti = (x = 0.5, y = 0.5) => {
  // Respect prefers-reduced-motion
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  confetti({
    particleCount: 50,
    spread: 60,
    origin: { x, y },
    colors: ['#C4623A', '#E2845C', '#2E7D52', '#2563A6', '#F5EFE6', '#F0C987'],
    ticks: 200,
    gravity: 1.2,
    decay: 0.94,
    startVelocity: 25,
    shapes: ['circle', 'square'],
    scalar: 0.8,
  });
};

export const triggerBigCelebration = () => {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  const interval: ReturnType<typeof setInterval> = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 40 * (timeLeft / duration);
    confetti({ ...defaults, particleCount, origin: { x: Math.random() * 0.4 + 0.1, y: Math.random() - 0.2 }, colors: ['#C4623A', '#2E7D52', '#2563A6', '#F0C987'] });
    confetti({ ...defaults, particleCount, origin: { x: Math.random() * 0.4 + 0.5, y: Math.random() - 0.2 }, colors: ['#C4623A', '#E2845C', '#EDE3D3', '#B9382C'] });
  }, 250);
};

