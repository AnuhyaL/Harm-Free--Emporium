/** Placeholder logo until the final mark is resolved (see ASSETS_NEEDED.md). */
import { cn } from '@/lib/format';

const c = (v: string, a = 1) => `rgb(var(${v}) / ${a})`;

export function LogoMark({ size = 36, className }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden>
      <circle cx="32" cy="32" r="30" fill={c('--hfe-emerald')} />
      <circle cx="32" cy="32" r="28.5" fill="none" stroke={c('--hfe-gold')} strokeWidth="1.5" />
      {/* open hands */}
      <path d="M14 38c4 8 10 12 18 12s14-4 18-12" fill="none" stroke={c('--hfe-sage')} strokeWidth="3" strokeLinecap="round" />
      {/* sprout */}
      <path d="M32 46V26" stroke={c('--hfe-mist')} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M32 32c-7 0-11-4-11-10 7 0 11 4 11 10z" fill={c('--sol-light')} />
      <path d="M32 28c0-7 5-11 12-11 0 7-5 11-12 11z" fill={c('--hfe-mist')} />
      <circle cx="44" cy="14" r="2.5" fill={c('--hfe-gold')} />
    </svg>
  );
}

export function Logo({ className, inverted }: { className?: string; inverted?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark />
      <span className="leading-none">
        <span className={cn('block font-display text-[19px] font-semibold tracking-tight', inverted ? 'text-paper' : 'text-fg')}>
          HarmFree
        </span>
        <span className={cn('block text-[10px] font-semibold uppercase tracking-[0.24em]', inverted ? 'text-paper/80' : 'text-muted')}>
          Emporium
        </span>
      </span>
    </span>
  );
}
