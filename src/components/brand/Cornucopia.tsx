/**
 * Cornucopia illustration — category bubbles rest inside the horn. Touching the horn (hover, tap or
 * keyboard) spills them out with their names for a few seconds, then they tumble back in.
 * Hovering a bubble holds them out so it can be clicked; each bubble links to its category.
 */
import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { iconPath, type IconName } from '@/components/ui/Icon';

const c = (v: string, a = 1) => `rgb(var(${v}) / ${a})`;

export interface CornucopiaItem {
  icon: IconName;
  label: string;
  to: string;
}

interface Props {
  items: CornucopiaItem[];
  className?: string;
}

// All positions are on a 600×480 canvas. MOUTH is where the bubbles hide inside the basket.
const MOUTH = [200, 365];
// Bubble centers, nearest the mouth first so the stagger reads as a spill.
const SPOTS = [
  [380, 290], [350, 405], [315, 175], [470, 405], [510, 290], [445, 175],
  [250, 60], [550, 405], [380, 60], [550, 175], [510, 60],
];
const BUBBLE = 66; // bubble diameter in canvas units (11% of 600)
const GROUNDS = ['--hfe-mist', '--hfe-paper', '--hfe-sky'];
const OPEN_MS = 5000;

export function Cornucopia({ items, className }: Props) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const timer = useRef<number>();
  const shown = items.slice(0, SPOTS.length);

  const scheduleClose = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(false), OPEN_MS);
  };
  const spill = () => {
    setOpen(true);
    scheduleClose();
  };
  const hold = () => window.clearTimeout(timer.current);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <div className={className}>
      <div className="relative aspect-[5/4] w-full">
        <ul aria-label="Featured categories">
          {shown.map((it, i) => {
            const [x, y] = SPOTS[i];
            // Offset back to the mouth, in multiples of the bubble's own size.
            const home = { x: `${((MOUTH[0] - x) / BUBBLE) * 100}%`, y: `${((MOUTH[1] - y) / BUBBLE) * 100}%` };
            const order = open ? i : shown.length - 1 - i;
            return (
              <li
                key={it.to}
                className={`absolute aspect-square w-[11%] -translate-x-1/2 -translate-y-1/2 ${open ? '' : 'pointer-events-none'}`}
                style={{ left: `${x / 6}%`, top: `${y / 4.8}%` }}
              >
                <motion.div
                  className="h-full w-full"
                  initial={false}
                  animate={open ? { x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 } : { ...(reduce ? {} : home), scale: reduce ? 1 : 0.2, opacity: 0, rotate: reduce ? 0 : -90 }}
                  transition={
                    reduce
                      ? { duration: 0.2 }
                      : open
                        ? { type: 'spring', stiffness: 170, damping: 16, delay: 0.06 * order }
                        : { duration: 0.45, ease: 'easeIn', delay: 0.04 * order }
                  }
                >
                  <Link
                    to={it.to}
                    tabIndex={open ? 0 : -1}
                    aria-hidden={!open}
                    onMouseEnter={hold}
                    onMouseLeave={scheduleClose}
                    onFocus={hold}
                    onBlur={scheduleClose}
                    className="block h-full w-full rounded-full no-underline"
                  >
                    <span
                      className="flex h-full w-full items-center justify-center rounded-full border-[1.5px] shadow-soft transition-transform duration-200 hover:scale-110"
                      style={{ background: c(GROUNDS[i % 3], 0.95), borderColor: c('--hfe-gold', 0.8) }}
                    >
                      <svg viewBox="0 0 24 24" className="h-[56%] w-[56%]" aria-hidden>
                        <path d={iconPath(it.icon)} fill="none" stroke={c('--hfe-emerald')} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <motion.span
                      initial={false}
                      animate={{ opacity: open ? 1 : 0 }}
                      transition={{ duration: 0.2, delay: open && !reduce ? 0.25 + 0.06 * order : 0 }}
                      className="absolute left-1/2 top-full mt-1.5 w-[200%] -translate-x-1/2 rounded bg-bg/85 px-1 py-0.5 text-center text-[10px] font-semibold leading-tight text-fg sm:text-xs"
                    >
                      {it.label}
                    </motion.span>
                  </Link>
                </motion.div>
              </li>
            );
          })}
        </ul>
        {/* Wicker horn, background removed and mirrored so its mouth opens to the right. Drawn above the
            bubbles so they disappear into it. */}
        <motion.button
          type="button"
          onMouseEnter={spill}
          onClick={spill}
          aria-expanded={open}
          aria-label="Open the cornucopia to show featured categories"
          className="absolute left-0 top-[47%] z-10 w-[48%] rounded-card"
          style={{ transformOrigin: '30% 60%' }}
          animate={reduce ? undefined : open ? { rotate: [0, -6, 3, 0] } : { rotate: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <img
            src="/images/cornucopia-basket.webp"
            alt=""
            width={382}
            height={335}
            loading="lazy"
            decoding="async"
            className="w-full drop-shadow-[0_12px_14px_rgb(0_0_0/0.18)]"
          />
        </motion.button>
      </div>
      <p className="mt-2 text-center text-xs text-muted">Touch the cornucopia to see what spills out.</p>
    </div>
  );
}
