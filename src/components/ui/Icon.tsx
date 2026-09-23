import type { SVGProps } from 'react';
import type { IconName as CategoryIcon } from '@/types';

/** 24×24 stroke icons. Category icons double as illustration glyphs. */
const PATHS: Record<string, string> = {
  // UI
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm9 16-4.35-4.35',
  cart: 'M3 4h2l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h8.7a1.5 1.5 0 0 0 1.46-1.14L21 8H6.2M9.5 20.5h.01M17.5 20.5h.01',
  heartOutline: 'M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 5.65-7 10-7 10z',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 8a7 7 0 0 1 14 0',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6 6 18',
  chevronDown: 'm6 9 6 6 6-6',
  chevronRight: 'm9 6 6 6-6 6',
  chevronLeft: 'm15 6-6 6 6 6',
  arrowRight: 'M5 12h14m-6-6 6 6-6 6',
  check: 'm5 12.5 4.5 4.5L19 7.5',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  trash: 'M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13',
  filter: 'M4 6h16M7 12h10M10 18h4',
  truck: 'M3 6h11v10H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  refresh: 'M20 11a8 8 0 0 0-14.7-4M4 5v4h4m-4 4a8 8 0 0 0 14.7 4M20 19v-4h-4',
  gift: 'M4 11h16v9H4zM3 7h18v4H3zm9 0v13M12 7s-1.5-4-4-4a2 2 0 0 0 0 4h4zm0 0s1.5-4 4-4a2 2 0 0 1 0 4h-4z',
  mail: 'M4 6h16v12H4zm0 0 8 7 8-7',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z',
  pin: 'M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21zm0-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  external: 'M14 4h6v6m0-6-9 9M18 14v5H5V6h5',
  moon: 'M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z',
  contrast: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0-18v18',
  info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zm0-11v6m0-9h.01',
  alert: 'M12 3 2 20h20L12 3zm0 7v4m0 3h.01',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  coin: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0-13v8m-3-5.5c0-1 1.3-1.5 3-1.5s3 .7 3 1.7-1.3 1.3-3 1.3-3 .6-3 1.6 1.3 1.9 3 1.9 3-.5 3-1.5',
  star: 'M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6-5.4-3-5.4 3 1.1-6L3.2 9.4l6.1-.8z',
  copy: 'M9 9h11v11H9zM5 15H4V4h11v1',
  grid: 'M4 4h7v7H4zm9 0h7v7h-7zM4 13h7v7H4zm9 0h7v7h-7z',
  logout: 'M15 4h4v16h-4M10 8l-4 4 4 4m-4-4h11',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7.4-3a7.4 7.4 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7.5 7.5 0 0 0-2-1.2L14.5 2h-5l-.4 2.6a7.5 7.5 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6a7.4 7.4 0 0 0 0 2.4l-2 1.6 2 3.4 2.4-1a7.5 7.5 0 0 0 2 1.2l.4 2.6h5l.4-2.6a7.5 7.5 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.07-.4.1-.8.1-1.2z',
  package: 'M3 7.5 12 3l9 4.5v9L12 21l-9-4.5zm0 0L12 12m9-4.5L12 12m0 0v9M7.5 5.2l9 4.6',
  seal: 'M12 2l2.4 2 3.1-.4.9 3 2.7 1.6-1 3 1 3-2.7 1.6-.9 3-3.1-.4L12 22l-2.4-2-3.1.4-.9-3L2.9 15.8l1-3-1-3 2.7-1.6.9-3 3.1.4zm-3.5 10 2.5 2.5 4.5-5',
  users: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm-6 9a6 6 0 0 1 12 0m1-9a3 3 0 1 0 0-6m2 15a6 6 0 0 0-3-5.2',
  // Category glyphs
  leaf: 'M5 19c0-8 5-13 15-14-1 10-6 15-14 15M5 19 13 11',
  sun: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  bolt: 'M13 2 4 14h7l-1 8 9-12h-7z',
  drop: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z',
  home: 'M3 11 12 4l9 7M5 10v10h14V10M10 20v-6h4v6',
  box: 'M3 7.5 12 3l9 4.5v9L12 21l-9-4.5zm0 0L12 12l9-4.5M12 12v9',
  bottle: 'M10 2h4v3l1.5 2.5V21h-7V7.5L10 5zm-1.5 9h7',
  spray: 'M9 8h6v13H9zm0 0V5h5l2-2m-3 5V5m6 1h1m-1 3h1m-1-6h1',
  heart: 'M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 5.65-7 10-7 10z',
  shield: 'M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6zm-3 9 2 2 4-4',
  wind: 'M3 8h11a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h7',
  flame: 'M12 22a7 7 0 0 0 7-7c0-4-3-6-4-10-2 2-3 4-3 6-1-1-2-2-2-4-2 2-5 5-5 8a7 7 0 0 0 7 7z',
  car: 'M5 17h14M6 17v2m12-2v2M4 13l2-6h12l2 6v4H4zm3 1h.01M17 14h.01',
  pot: 'M4 10h16v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zm-2 0h20M9 6c0-1 1-1 1-2m3 2c0-1 1-1 1-2',
  sprout: 'M12 21v-9m0 0c0-4-3-6-7-6 0 4 3 6 7 6zm0 0c0-4 3-7 7-7 0 4-3 7-7 7zM7 21h10',
  bug: 'M12 20a5 5 0 0 0 5-5V11a5 5 0 0 0-10 0v4a5 5 0 0 0 5 5zm0-12V20M9 5l-2-2m8 2 2-2M4 12h3m10 0h3M4 17l3-1m13 1-3-1',
  snow: 'M12 2v20M4 7l16 10M20 7 4 17M9 3l3 3 3-3M9 21l3-3 3 3',
  brick: 'M3 5h18v14H3zm0 5h18M3 14h18M9 5v5m6 0v4m-6 0v5',
  battery: 'M4 7h14v10H4zm14 3h2v4h-2M8 10l-1 2h3l-1 2',
  lamp: 'M12 2v3m-6 5a6 6 0 1 1 12 0c0 2.5-2 3.5-2 6H8c0-2.5-2-3.5-2-6zm3 9h6m-5 3h4',
  cloth: 'M4 6c2-2 4 2 6 0s4 2 6 0 4 2 4 2v10c-2 2-4-2-6 0s-4-2-6 0-4-2-4-2z',
  plate: 'M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-4a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  paper: 'M6 3h9l4 4v14H6zm9 0v4h4M9 12h7m-7 4h7',
  mower: 'M4 15h13l2-5H6zM8 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm9 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 10l3-7',
  pill: 'M10.5 20.5a5 5 0 0 1-7-7l6-6a5 5 0 0 1 7 7zm-3.5-10 7 7',
  gauge: 'M4 18a8 8 0 1 1 16 0M12 18l4-6',
  tent: 'M3 20 12 4l9 16zm9-16v16m-3 0 3-6 3 6',
};

export type IconName = keyof typeof PATHS | CategoryIcon;

export const iconPath = (name: IconName) => PATHS[name];

interface Props extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
  filled?: boolean;
  label?: string;
}

export function Icon({ name, size = 20, filled, label, strokeWidth = 1.75, ...rest }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      {...rest}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
