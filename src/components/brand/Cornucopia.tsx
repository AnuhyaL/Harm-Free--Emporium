/**
 * Cornucopia illustration — placeholder SVG. Isolated and swappable: pass `art` to replace it.
 * Category glyphs spill out of the horn to show the diversity of the catalog.
 */
import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { iconPath, type IconName } from '@/components/ui/Icon';

const c = (v: string, a = 1) => `rgb(var(${v}) / ${a})`;

interface Props {
  glyphs: IconName[];
  art?: ReactNode;
  className?: string;
}

export function Cornucopia({ glyphs, art, className }: Props) {
  const reduce = useReducedMotion();
  if (art) return <div className={className}>{art}</div>;

  // Positions along an arc spilling to the right of the horn mouth.
  const spots = [
    [300, 70], [360, 118], [300, 150], [410, 70], [460, 150], [380, 190], [520, 98], [540, 190], [450, 230], [600, 150],
  ];

  return (
    <svg viewBox="0 0 680 280" className={className} role="img" aria-label="Illustration: a cornucopia spilling out every HarmFree product category">
      <defs>
        <linearGradient id="horn" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={c('--hfe-gold', 0.55)} />
          <stop offset="1" stopColor={c('--hfe-gold')} />
        </linearGradient>
      </defs>
      {/* horn */}
      <path d="M40 210C40 150 120 60 250 50c30 40 34 120 0 170C170 240 90 250 40 210z" fill="url(#horn)" />
      <path d="M40 210c30-10 60-60 70-120m-10 150c40-20 70-80 80-150m-6 170c30-40 50-110 44-170" fill="none" stroke={c('--hfe-navy', 0.25)} strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="248" cy="135" rx="22" ry="86" fill={c('--hfe-emerald', 0.85)} />
      <path d="M40 210c-14 10-26 26-18 40 12-2 22-14 24-30" fill={c('--hfe-gold', 0.7)} />
      {/* leaves spilling */}
      <path d="M262 80c40-30 80-30 110-10-30 20-70 26-110 10z" fill={c('--hfe-sage')} />
      <path d="M262 200c50 20 90 10 120-16-40-8-80-4-120 16z" fill={c('--hfe-sage', 0.8)} />
      {glyphs.slice(0, spots.length).map((g, i) => {
        const [x, y] = spots[i];
        return (
          <motion.g
            key={g + i}
            initial={reduce ? false : { x: -40, scale: 0.8 }}
            whileInView={{ x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.3, delay: reduce ? 0 : 0.05 * i, ease: 'easeOut' }}
          >
            <circle cx={x} cy={y} r="30" fill={c(i % 3 === 0 ? '--hfe-mist' : i % 3 === 1 ? '--hfe-paper' : '--hfe-sky', 0.95)} stroke={c('--hfe-gold', 0.8)} strokeWidth="1.5" />
            <svg x={x - 17} y={y - 17} width="34" height="34" viewBox="0 0 24 24">
              <path d={iconPath(g)} fill="none" stroke={c('--hfe-emerald')} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.g>
        );
      })}
    </svg>
  );
}
