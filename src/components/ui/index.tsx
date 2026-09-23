import { useEffect, type ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { cn, money, pctOff } from '@/lib/format';
import { useUI } from '@/store';
import { ButtonLink, Button } from './Button';
import { Icon, type IconName } from './Icon';

export * from './Button';
export * from './Field';
export { Icon } from './Icon';
export type { IconName } from './Icon';

// ——— SEO ———

export function Seo({ title, description }: { title: string; description?: string }) {
  const full = title === 'HarmFree Emporium' ? title : `${title} · HarmFree Emporium`;
  return (
    <Helmet>
      <title>{full}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={full} />
      {description && <meta property="og:description" content={description} />}
    </Helmet>
  );
}

// ——— Layout helpers ———

export function Section({
  eyebrow,
  title,
  intro,
  action,
  children,
  className,
  id,
  tint,
}: {
  eyebrow?: string;
  title?: ReactNode;
  intro?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  id?: string;
  tint?: boolean;
}) {
  const headingId = id ? `${id}-heading` : undefined;
  return (
    <section id={id} aria-labelledby={title ? headingId : undefined} className={cn('py-16 sm:py-20', tint && 'bg-tint', className)}>
      <div className="container-hfe">
        {(title || eyebrow) && (
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
              {title && (
                <h2 id={headingId} className="text-2xl font-semibold sm:text-3xl">
                  {title}
                </h2>
              )}
              {intro && <p className="mt-3 text-muted">{intro}</p>}
            </div>
            {action}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

export function PageHeader({
  eyebrow,
  title,
  intro,
  crumbs,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  crumbs?: { label: string; to?: string }[];
  children?: ReactNode;
}) {
  return (
    <header className="border-b border-line bg-tint/60">
      <div className="container-hfe py-10 sm:py-14">
        {crumbs && <Breadcrumbs items={crumbs} />}
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="max-w-3xl text-2xl font-semibold sm:text-3xl">{title}</h1>
        {intro && <p className="mt-4 max-w-2xl text-lg text-muted">{intro}</p>}
        {children}
      </div>
    </header>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm">
      <ol className="flex flex-wrap items-center gap-1.5 text-muted">
        <li>
          <Link to="/" className="text-muted no-underline hover:text-fg hover:underline">
            Home
          </Link>
        </li>
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <Icon name="chevronRight" size={14} />
            {c.to && i < items.length - 1 ? (
              <Link to={c.to} className="text-muted no-underline hover:text-fg hover:underline">
                {c.label}
              </Link>
            ) : (
              <span aria-current={i === items.length - 1 ? 'page' : undefined} className="text-fg">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// ——— Rating ———

export function Stars({ value, size = 16, className }: { value: number; size?: number; className?: string }) {
  return (
    <span className={cn('inline-flex items-center text-gold', className)} role="img" aria-label={`${value.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, value - (i - 1)));
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }} aria-hidden>
            <Icon name="star" size={size} className="absolute inset-0 text-line" filled strokeWidth={0} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Icon name="star" size={size} filled strokeWidth={0} />
            </span>
          </span>
        );
      })}
    </span>
  );
}

export function RatingLine({ avg, count, className }: { avg: number; count: number; className?: string }) {
  if (!count) return <span className={cn('text-sm text-muted', className)}>No reviews yet</span>;
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-sm', className)}>
      <Stars value={avg} size={14} />
      <span className="font-medium">{avg.toFixed(1)}</span>
      <span className="text-muted">({count})</span>
    </span>
  );
}

// ——— Price ———

export function Price({ price, msrp, member, className }: { price: number; msrp?: number; member?: number; className?: string }) {
  const off = msrp ? pctOff(msrp, price) : 0;
  return (
    <span className={cn('inline-flex flex-wrap items-baseline gap-x-2', className)}>
      <span className="font-semibold">{money(price)}</span>
      {off > 0 && (
        <>
          <s className="text-sm text-muted" aria-label={`MSRP ${money(msrp!)}`}>
            {money(msrp!)}
          </s>
        </>
      )}
      {member !== undefined && <span className="text-xs font-medium text-success">Member {money(member)}</span>}
    </span>
  );
}

// ——— Feedback states ———

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton', className)} aria-hidden />;
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div role="status" aria-label="Loading products" className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-square w-full rounded-card" />
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div role="status" aria-label="Loading page" className="container-hfe space-y-6 py-14">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-10 w-2/3 max-w-xl" />
      <Skeleton className="h-4 w-full max-w-2xl" />
      <div className="grid gap-6 pt-6 sm:grid-cols-3">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    </div>
  );
}

export function EmptyState({
  icon = 'leaf',
  title,
  body,
  action,
  as: Heading = "h2",
}: {
  icon?: IconName;
  title: string;
  body?: ReactNode;
  action?: { label: string; to: string } | ReactNode;
  as?: "h1" | "h2";
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-card border border-dashed border-line bg-surface px-6 py-14 text-center">
      <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-tint text-fg">
        <Icon name={icon} size={26} />
      </span>
      <Heading className="text-xl font-semibold">{title}</Heading>
      {body && <p className="mt-2 text-muted">{body}</p>}
      {action && (
        <div className="mt-6">
          {typeof action === 'object' && action !== null && 'to' in (action as object) ? (
            <ButtonLink to={(action as { to: string }).to}>{(action as { label: string }).label}</ButtonLink>
          ) : (
            (action as ReactNode)
          )}
        </div>
      )}
    </div>
  );
}

export function ErrorState({ error, onRetry }: { error?: Error; onRetry?: () => void }) {
  const notFound = (error as { status?: number } | undefined)?.status === 404;
  if (notFound) return <NotFoundContent />;
  return (
    <div className="container-hfe py-16">
      <EmptyState
        icon="alert"
        title="Something went wrong"
        body={error?.message ?? 'We could not load this content. Please try again.'}
        action={onRetry ? <Button onClick={onRetry}>Try again</Button> : { label: 'Back to home', to: '/' }}
      />
    </div>
  );
}

export function NotFoundContent() {
  return (
    <div className="container-hfe py-20">
      <Seo title="Page not found" />
      <EmptyState
        icon="sprout"
        as="h1"
        title="This page has not sprouted yet"
        body="The link may be old, or the page may have moved. Try the catalog or search from the header."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink to="/catalog">Browse the catalog</ButtonLink>
            <ButtonLink to="/" variant="secondary">
              Go home
            </ButtonLink>
          </div>
        }
      />
    </div>
  );
}

// ——— Badges ———

/** `compact` shortens the label to "Seal" on phones, for tight spots like product cards. */
export function SealBadge({ size = 'sm', compact }: { size?: 'sm' | 'md'; compact?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-emerald font-semibold text-paper ring-1 ring-gold',
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs',
      )}
    >
      <Icon name="seal" size={size === 'sm' ? 12 : 14} className="text-gold" />
      {compact ? (
        <span>
          <span className="max-sm:hidden">HarmFree </span>Seal
        </span>
      ) : (
        'HarmFree Seal'
      )}
    </span>
  );
}

// ——— Toasts ———

export function Toaster() {
  const toasts = useUI((s) => s.toasts);
  const dismiss = useUI((s) => s.dismissToast);
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-0 z-[60] flex flex-col items-center gap-2 px-4"
      style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            role={t.tone === 'error' ? 'alert' : 'status'}
            className="pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-soft bg-navy px-4 py-3 text-sm text-paper shadow-lift"
          >
            <Icon name={t.tone === 'error' ? 'alert' : 'check'} size={18} className="text-gold" />
            <span className="flex-1">{t.message}</span>
            {t.action && (
              <Link to={t.action.href} className="font-semibold text-paper underline" onClick={() => dismiss(t.id)}>
                {t.action.label}
              </Link>
            )}
            <button type="button" aria-label="Dismiss notification" className="rounded p-1 text-paper/80 hover:text-paper" onClick={() => dismiss(t.id)}>
              <Icon name="close" size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/** Scrolls to top on route change (except hash links) and moves focus to main content. */
export function RouteEffects() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0 });
    const main = document.getElementById('main');
    main?.focus({ preventScroll: true });
  }, [pathname, hash]);
  return null;
}
