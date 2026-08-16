import { useEffect, useRef } from 'react';

type BubbleColors = {
  first: string;
  second: string;
  third: string;
  fourth: string;
  fifth: string;
  sixth: string;
};

type BubbleBackgroundProps = {
  interactive?: boolean;
  colors: BubbleColors;
  className?: string;
};

type Bubble = {
  x: number;
  y: number;
  radius: number;
  color: string;
  vx: number;
  vy: number;
  phase: number;
};

export function BubbleBackground({ interactive = false, colors, className = '' }: BubbleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const colorList = Object.values(colors).map((color) => `rgb(${color})`);
    const bubbles: Bubble[] = [];
    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      if (!bubbles.length) {
        const count = Math.max(12, Math.min(26, Math.round((width * height) / 52000)));
        for (let index = 0; index < count; index += 1) {
          bubbles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: 70 + Math.random() * 130,
            color: colorList[index % colorList.length],
            vx: (Math.random() - 0.5) * 0.09,
            vy: (Math.random() - 0.5) * 0.07,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      const pointer = pointerRef.current;

      bubbles.forEach((bubble) => {
        const drift = reduceMotion ? 0 : Math.sin(time * 0.00018 + bubble.phase) * 0.12;
        let targetX = bubble.x + bubble.vx + drift;
        let targetY = bubble.y + bubble.vy + drift * 0.7;

        if (interactive && pointer.active) {
          const dx = pointer.x - bubble.x;
          const dy = pointer.y - bubble.y;
          const distance = Math.hypot(dx, dy);
          if (distance < 260 && distance > 0) {
            const influence = (1 - distance / 260) * 0.45;
            targetX += dx * influence;
            targetY += dy * influence;
          }
        }

        bubble.x += (targetX - bubble.x) * 0.008;
        bubble.y += (targetY - bubble.y) * 0.008;
        if (bubble.x < -bubble.radius) bubble.x = width + bubble.radius;
        if (bubble.x > width + bubble.radius) bubble.x = -bubble.radius;
        if (bubble.y < -bubble.radius) bubble.y = height + bubble.radius;
        if (bubble.y > height + bubble.radius) bubble.y = -bubble.radius;

        const glow = context.createRadialGradient(bubble.x, bubble.y, 0, bubble.x, bubble.y, bubble.radius);
        glow.addColorStop(0, `${bubble.color.replace('rgb', 'rgba').replace(')', ', 0.13)')}`);
        glow.addColorStop(0.55, `${bubble.color.replace('rgb', 'rgba').replace(')', ', 0.045)')}`);
        glow.addColorStop(1, `${bubble.color.replace('rgb', 'rgba').replace(')', ', 0)')}`);
        context.fillStyle = glow;
        context.beginPath();
        context.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        context.fill();
      });

      animationFrame = window.requestAnimationFrame(draw);
    };

    const onPointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointerRef.current = { x: event.clientX - bounds.left, y: event.clientY - bounds.top, active: true };
    };
    const onPointerLeave = () => { pointerRef.current.active = false; };
    const onMotionChange = (event: MediaQueryListEvent) => { reduceMotion = event.matches; };

    resize();
    animationFrame = window.requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    if (interactive) {
      canvas.addEventListener('pointermove', onPointerMove);
      canvas.addEventListener('pointerleave', onPointerLeave);
    }
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', onMotionChange);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      window.matchMedia('(prefers-reduced-motion: reduce)').removeEventListener('change', onMotionChange);
    };
  }, [colors, interactive]);

  return <canvas ref={canvasRef} aria-hidden="true" className={`bubble-background ${className}`} />;
}

export default BubbleBackground;
