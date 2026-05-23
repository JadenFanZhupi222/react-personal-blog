import type { Variants } from 'framer-motion';

/**
 * Shared framer-motion variant presets for staggered reveal animations.
 *
 * Use `containerVariants` on the outer wrapper and `itemVariants` on each child
 * that should fade-and-rise into place. Pair with `initial="hidden" animate="visible"`
 * (or `whileInView="visible"` for scroll-triggered sections).
 */
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};
