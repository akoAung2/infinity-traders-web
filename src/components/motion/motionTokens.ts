export const MOTION_EASE = [0.22, 1, 0.36, 1] as const;

export const MOTION = {
  section: {
    desktopDistance: 44,
    mobileDistance: 26,
    entryScale: 0.985,
    exitOpacity: 0.42,
    entryBlur: 5,
    exitBlur: 3,
  },
  reveal: {
    distance: 18,
    duration: 0.72,
    stagger: 0.1,
  },
  parallax: {
    background: 18,
    subject: 34,
    ui: 52,
  },
} as const;
