import { type HTMLAttributes } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { MOTION, MOTION_EASE } from './motionTokens';

type ScrollRevealProps = HTMLAttributes<HTMLDivElement> & {
  delay?: number;
  distance?: number;
};

export function ScrollReveal({ children, delay = 0, distance = MOTION.reveal.distance, ...props }: ScrollRevealProps) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      {...props}
      initial={reduceMotion ? false : { opacity: 0, y: distance, filter: 'blur(4px)' }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: false, amount: 0.2, margin: '0px 0px -8% 0px' }}
      transition={{ duration: MOTION.reveal.duration, delay, ease: MOTION_EASE }}
    >
      {children}
    </motion.div>
  );
}
