// Shared easing - a soft "ease-out-expo" that suits the premium feel
export const ease = [0.22, 1, 0.36, 1];

export const backdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.25, ease } },
  exit: { opacity: 0, transition: { duration: 0.2, ease } },
};

export const popIn = {
  initial: { opacity: 0, scale: 0.96, y: 12 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease } },
  exit: { opacity: 0, scale: 0.97, y: 8, transition: { duration: 0.18, ease } },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  // Only set delay when given, so a parent's staggerChildren offset isn't overridden
  visible: (delay) => ({ opacity: 1, y: 0, transition: { duration: 0.6, ease, ...(delay && { delay }) } }),
};

export const stagger = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
});

// Re-keyed on change (key={count}) so cart/wishlist badges pop when the count updates
export const badgePop = {
  initial: { scale: 0.4, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { type: 'spring', stiffness: 500, damping: 18 },
};
