/**
 * Sol — the HarmFree robot. A gleaming green robot powered by the solar panel on his head.
 * Placeholder SVG art; swap any state via the `art` prop (e.g. a Lottie player) without touching callers.
 * Static under prefers-reduced-motion.
 */
import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/lib/format';

export type MascotState = 'idle' | 'push' | 'checkout' | 'success';

const c = (v: string, a = 1) => `rgb(var(${v}) / ${a})`;

interface FigureProps {
  arms: 'down' | 'forward' | 'up';
  eyes: 'open' | 'happy';
}

/** Sol himself, drawn in a 120×150 box with his wheel at the bottom. */
function SolFigure({ arms, eyes }: FigureProps) {
  return (
    <g>
      <defs>
        <linearGradient id="sol-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c('--sol-light')} />
          <stop offset="0.55" stopColor={c('--sol-deep')} />
        </linearGradient>
        <linearGradient id="sol-panel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c('--hfe-navy')} />
          <stop offset="1" stopColor={c('--hfe-sky', 0.85)} />
        </linearGradient>
      </defs>
      {/* solar panel */}
      <line x1="60" y1="30" x2="60" y2="40" stroke={c('--hfe-slate')} strokeWidth="3" strokeLinecap="round" />
      <path d="M28 12h64l-8 18H36z" fill="url(#sol-panel)" stroke={c('--hfe-gold')} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M44 12l-2 18M60 12v18M76 12l2 18M32 21h56" stroke={c('--hfe-sky')} strokeWidth="1" opacity="0.8" />
      {/* head */}
      <rect x="30" y="40" width="60" height="44" rx="16" fill="url(#sol-body)" />
      <path d="M38 50c4-5 10-6 16-6" stroke="white" strokeOpacity="0.55" strokeWidth="3" strokeLinecap="round" fill="none" />
      <rect x="37" y="52" width="46" height="24" rx="11" fill={c('--hfe-paper')} />
      {eyes === 'open' ? (
        <>
          <ellipse cx="50" cy="63" rx="4" ry="5" fill={c('--hfe-navy')} />
          <ellipse cx="70" cy="63" rx="4" ry="5" fill={c('--hfe-navy')} />
          <circle cx="51.5" cy="61" r="1.3" fill="white" />
          <circle cx="71.5" cy="61" r="1.3" fill="white" />
        </>
      ) : (
        <path d="M45 65q5-6 10 0M65 65q5-6 10 0" stroke={c('--hfe-navy')} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      )}
      <path d="M54 71q6 4 12 0" stroke={c('--sol-deep')} strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* neck + body */}
      <rect x="54" y="84" width="12" height="6" rx="2" fill={c('--hfe-slate')} />
      <rect x="36" y="90" width="48" height="38" rx="12" fill="url(#sol-body)" />
      <circle cx="60" cy="107" r="8" fill={c('--hfe-paper')} />
      <path d="M60 112c0-5 0-7 4-10-4 .5-5.5 3-4 10zm0 0c0-4-1-6-5-7.5 2.5 2 3.5 4.5 5 7.5z" fill={c('--hfe-gold')} />
      {/* arms */}
      {arms === 'down' && (
        <>
          <path d="M36 98q-10 8-8 22" stroke={c('--sol-deep')} strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M84 98q10 8 8 22" stroke={c('--sol-deep')} strokeWidth="6" strokeLinecap="round" fill="none" />
        </>
      )}
      {arms === 'forward' && (
        <>
          <path d="M84 98q14 2 24 6" stroke={c('--sol-deep')} strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M84 108q14 2 24 2" stroke={c('--sol-deep')} strokeWidth="6" strokeLinecap="round" fill="none" />
        </>
      )}
      {arms === 'up' && (
        <>
          <path d="M36 98q-12-6-12-24" stroke={c('--sol-deep')} strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M84 98q12-6 12-24" stroke={c('--sol-deep')} strokeWidth="6" strokeLinecap="round" fill="none" />
        </>
      )}
      {/* wheel */}
      <rect x="46" y="128" width="28" height="6" rx="3" fill={c('--hfe-slate')} />
      <circle cx="60" cy="140" r="9" fill={c('--hfe-navy')} />
      <circle cx="60" cy="140" r="3.5" fill={c('--hfe-gold')} />
    </g>
  );
}

function Cart() {
  return (
    <g>
      <path d="M6 18h8l8 34h40l8-26H18" fill="none" stroke={c('--hfe-slate')} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 30h44l-6 18H26z" fill={c('--sol-light')} />
      <path d="M30 30c2-10 10-14 14-14-2 6-6 11-14 14zm16 0c3-7 9-10 13-9-3 5-7 8-13 9z" fill={c('--sol-deep')} opacity="0.8" />
      <circle cx="28" cy="60" r="5" fill={c('--hfe-navy')} />
      <circle cx="58" cy="60" r="5" fill={c('--hfe-navy')} />
    </g>
  );
}

function Earth() {
  return (
    <g>
      <circle cx="0" cy="0" r="54" fill={c('--hfe-sky')} />
      <path d="M-40-18c10-12 26-10 30 0s-8 14-2 22-8 18-20 10-18-20-8-32zM10-40c14-2 30 8 34 22-8 2-14-6-22-2s-4 16-14 16-10-12-6-20 2-14 8-16zM6 28c10-6 26-4 30 4-6 12-22 18-32 12-4-6-2-12 2-16z" fill={c('--sol-light')} />
      <circle cx="0" cy="0" r="54" fill="none" stroke={c('--hfe-gold')} strokeWidth="1.5" />
    </g>
  );
}

function Sparkles() {
  return (
    <g fill={c('--hfe-gold')}>
      <path d="M20 30l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" />
      <path d="M170 24l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />
      <path d="M176 90l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" />
    </g>
  );
}

interface MascotProps {
  state?: MascotState;
  size?: number;
  className?: string;
  /** Change this value to replay the push animation (e.g. the cart add counter). */
  pulse?: number;
  /** Swap in final art per state without changing callers. */
  art?: Partial<Record<MascotState, ReactNode>>;
  label?: string;
}

export function Mascot({ state = 'idle', size = 160, className, pulse = 0, art, label }: MascotProps) {
  const reduce = useReducedMotion();
  const title = label ?? `Sol, the HarmFree robot${state === 'push' ? ', pushing the cart' : state === 'checkout' ? ', at the checkout counter' : state === 'success' ? ', celebrating' : ''}`;

  if (art?.[state]) {
    return (
      <div role="img" aria-label={title} className={className} style={{ width: size }}>
        {art[state]}
      </div>
    );
  }

  const bob = reduce ? undefined : { y: [0, -3, 0], transition: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' as const } };

  return (
    <svg viewBox="0 0 200 180" width={size} height={(size * 180) / 200} role="img" aria-label={title} className={cn('overflow-visible', className)}>
      {state === 'checkout' && (
        <>
          <g transform="translate(100 78)">
            <motion.g animate={reduce ? undefined : { rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}>
              <Earth />
            </motion.g>
          </g>
          <g transform="translate(40 8)">
            <motion.g animate={bob}>
              <SolFigure arms="down" eyes="open" />
            </motion.g>
          </g>
          <rect x="18" y="122" width="164" height="44" rx="8" fill={c('--hfe-paper')} stroke={c('--hfe-slate', 0.5)} strokeWidth="2" />
          <rect x="18" y="122" width="164" height="8" rx="4" fill={c('--hfe-gold')} />
          <text x="100" y="152" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontSize="13" fontWeight="600" fill={c('--hfe-emerald')}>
            HarmFree Checkout
          </text>
        </>
      )}

      {state === 'idle' && (
        <g transform="translate(40 20)">
          <motion.g animate={bob}>
            <SolFigure arms="down" eyes="open" />
          </motion.g>
        </g>
      )}

      {state === 'push' && (
        <motion.g
          key={pulse}
          initial={{ x: 0 }}
          animate={reduce ? { x: 0 } : { x: [0, 18, 0] }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        >
          <g transform="translate(0 20)">
            <SolFigure arms="forward" eyes={pulse ? 'happy' : 'open'} />
          </g>
          <g transform="translate(104 88)">
            <Cart />
          </g>
        </motion.g>
      )}

      {state === 'success' && (
        <>
          <Sparkles />
          <g transform="translate(40 20)">
            <motion.g
              animate={reduce ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 0.8, repeat: reduce ? 0 : 2, ease: 'easeOut' }}
            >
              <SolFigure arms="up" eyes="happy" />
            </motion.g>
          </g>
        </>
      )}
    </svg>
  );
}
