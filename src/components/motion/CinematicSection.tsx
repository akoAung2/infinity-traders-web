import { type ReactNode, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { MOTION } from './motionTokens';

type CinematicSectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  intensity?: 'subtle' | 'medium';
};

/**
 * A native-scroll section scene. It maps section visibility to transform and
 * opacity only, so scrolling stays fully browser-controlled in both directions.
 */
export function CinematicSection({ children, className = '', id, intensity = 'medium' }: CinematicSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 640px)');
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const progress = useSpring(scrollYProgress, { stiffness: 95, damping: 28, mass: 0.5 });
  const baseDistance = isMobile ? MOTION.section.mobileDistance : MOTION.section.desktopDistance;
  const distance = intensity === 'subtle' ? baseDistance * 0.65 : baseDistance;
  const y = useTransform(progress, [0, 0.5, 1], [distance, 0, -distance]);
  const opacity = useTransform(progress, [0, 0.14, 0.82, 1], [0.7, 1, 1, MOTION.section.exitOpacity]);
  const scale = useTransform(progress, [0, 0.5, 1], [MOTION.section.entryScale, 1, MOTION.section.entryScale]);
  const blur = useTransform(progress, [0, 0.18, 0.82, 1], [MOTION.section.entryBlur, 0, 0, MOTION.section.exitBlur]);
  const filter = useTransform(blur, (value) => `blur(${value}px)`);

  return (
    <motion.div
      ref={ref}
      id={id}
      className={`cinematic-chapter ${className}`}
      style={reduceMotion ? undefined : { y, opacity, scale, filter }}
    >
      <div className="cinematic-chapter-scan" aria-hidden="true" />
      {children}
    </motion.div>
  );
}
