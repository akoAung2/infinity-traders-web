import { type ReactNode, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { MOTION } from './motionTokens';

type ParallaxLayerProps = { children: ReactNode; className?: string; depth?: 'background' | 'subject' | 'ui' };

export function ParallaxLayer({ children, className, depth = 'subject' }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 28 });
  const amount = MOTION.parallax[depth];
  const y = useTransform(progress, [0, 1], [amount, -amount]);
  // Scroll measurements need a positioned target. Preserve intentional absolute
  // scene layers while making ordinary layers explicit positioning contexts.
  const position = className?.includes('absolute') ? 'absolute' : 'relative';
  return <motion.div ref={ref} className={className} style={reduceMotion ? { position } : { position, y }}>{children}</motion.div>;
}
