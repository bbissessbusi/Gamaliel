// Shared design tokens ported from the web app's dark, glass-morphic,
// orange→pink→purple gradient aesthetic.

export const colors = {
  bg: '#070304',
  bgAlt: '#050203',
  bgBlack: '#000000',
  orange: '#FF4500',
  pink: '#D12D6F',
  magenta: '#C026D3',
  purple: '#8B008B',
  green: '#39ff14',
  white: '#FFFFFF',
  textPrimary: 'rgba(255,255,255,0.95)',
  textSecondary: 'rgba(255,255,255,0.7)',
  textMuted: 'rgba(255,255,255,0.5)',
  textFaint: 'rgba(255,255,255,0.3)',
  glassBg: 'rgba(255,255,255,0.04)',
  glassBorder: 'rgba(255,255,255,0.1)',
  danger: '#f87171',
};

export const gradients = {
  brand: [colors.orange, colors.pink, colors.purple],
  brandButton: [colors.orange, colors.purple],
  brandPressed: ['#CC3700', '#6B006B'],
  aiText: [colors.pink, colors.magenta],
};

export const radii = {
  sm: 12,
  md: 20,
  lg: 32,
  xl: 48,
  full: 999,
};

export const fonts = {
  body: 'SpaceGrotesk-Regular',
  bodyMedium: 'SpaceGrotesk-Medium',
  bodyBold: 'SpaceGrotesk-Bold',
  mono: 'JetBrainsMono-Regular',
  monoBold: 'JetBrainsMono-Bold',
  monoExtraBold: 'JetBrainsMono-ExtraBold',
  script: 'LeagueScript-Regular',
};

/** Same orange → purple color interpolation used by the web app's sliders. */
export function getSliderColor(value) {
  const r = Math.round(255 - (value * (255 - 139)) / 10);
  const g = Math.round(69 - (value * 69) / 10);
  const b = Math.round(0 + (value * 139) / 10);
  return `rgb(${r}, ${g}, ${b})`;
}
