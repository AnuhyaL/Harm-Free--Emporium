import { animate, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon, Stars } from '@/components/ui';
import { REWARDS } from '@/data';
import { date } from '@/lib/format';
import type { Post, Product, Review } from '@/types';

const c = (v: string, a = 1) => `rgb(var(${v}) / ${a})`;

/** Cover art for posts until editorial photography exists. */
export function PostCover({ post, className }: { post: Post; className?: string }) {
  const grounds = ['--hfe-emerald', '--hfe-navy'];
  const g = grounds[post.hue % 2];
  return (
    <svg viewBox="0 0 640 360" className={className} role="img" aria-label={`Cover illustration for “${post.title}”`} preserveAspectRatio="xMidYMid slice">
      <rect width="640" height="360" fill={c(g)} />
      <circle cx={420 + (post.hue % 80)} cy="170" r="130" fill={c('--hfe-sage', 0.25)} />
      <circle cx={180} cy={240 - (post.hue % 60)} r="90" fill={c('--hfe-sky', 0.22)} />
      <path d={`M-20 ${280 - (post.hue % 40)}C160 200 360 360 660 ${220 + (post.hue % 50)}`} stroke={c('--hfe-gold', 0.8)} strokeWidth="2" fill="none" />
      <path d="M320 250c0-50 0-80 40-110-40 6-60 36-40 110zm0 0c0-40-8-60-44-74 22 20 30 42 44 74z" fill={c('--hfe-mist', 0.85)} />
      <text x="32" y="56" fontFamily="Inter, sans-serif" fontSize="16" fontWeight="600" letterSpacing="3" fill={c('--hfe-gold')}>
        {post.category.toUpperCase()}
      </text>
    </svg>
  );
}

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-card border border-line bg-surface shadow-soft transition-shadow duration-200 hover:shadow-lift">
      <PostCover post={post} className="aspect-[16/9] w-full" />
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-xs text-muted">
          {date(post.publishedAt)} · {post.readMinutes} min read
        </p>
        <h3 className="text-lg font-semibold leading-snug">
          <Link to={`/blog/${post.slug}`} className="text-fg no-underline after:absolute after:inset-0 group-hover:underline">
            {post.title}
          </Link>
        </h3>
        <p className="line-clamp-3 text-sm text-muted">{post.excerpt}</p>
      </div>
    </article>
  );
}

export function ReviewCard({ review, product }: { review: Review; product?: Product }) {
  return (
    <figure className="break-inside-avoid rounded-card border border-line bg-surface p-5 shadow-soft">
      <div className="mb-2 flex items-center justify-between gap-2">
        <Stars value={review.rating} size={14} />
      </div>
      <blockquote>
        <p className="font-semibold">{review.title}</p>
        <p className="mt-1 text-sm text-muted">{review.body}</p>
      </blockquote>
      <figcaption className="mt-3 text-xs text-muted">
        <span className="font-medium text-fg">{review.authorName}</span> · {review.location}
        {review.verifiedPurchase && <span className="ml-1 inline-flex items-center gap-0.5 text-success"><Icon name="check" size={12} />Verified</span>}
        {product && (
          <>
            {' '}· on{' '}
            <Link to={`/product/${product.slug}`} className="font-medium">
              {product.name}
            </Link>
          </>
        )}
      </figcaption>
    </figure>
  );
}

export function CountUp({ to, className }: { to: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(reduce ? to : 0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setVal(to);
      return;
    }
    const ctl = animate(0, to, { duration: 1.1, ease: 'easeOut', onUpdate: (v) => setVal(Math.round(v)) });
    return () => ctl.stop();
  }, [inView, to, reduce]);
  return (
    <span ref={ref} className={className}>
      <span aria-hidden>{val.toLocaleString("en-US")}</span>
      <span className="sr-only">{to.toLocaleString("en-US")}</span>
    </span>
  );
}

export const EARN_TILES = [
  { icon: 'cart' as const, title: 'Shop', big: `${REWARDS.pointsPerDollar} pts`, body: 'for every $1 you spend. 100 points = $1 off.' },
  { icon: 'star' as const, title: 'Review', big: `${REWARDS.reviewPoints} pts`, body: `per review, +${REWARDS.photoReviewBonus} bonus with a photo or video.` },
  { icon: 'users' as const, title: 'Refer', big: `$${REWARDS.referralGivesDollars}`, body: `for your friend, ${REWARDS.referralGetsPoints} points for you when they join.` },
  { icon: 'coin' as const, title: 'Give', big: 'EarthCoin', body: `with a $${REWARDS.earthCoinDonationMin}+ donation or $${REWARDS.earthCoinPurchaseMin}+ purchase.` },
];

export function EarnTiles() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {EARN_TILES.map((t) => (
        <li key={t.title} className="rounded-card border border-line bg-surface p-5">
          <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-tint">
            <Icon name={t.icon} size={22} />
          </span>
          <p className="eyebrow">{t.title}</p>
          <p className="mt-1 font-display text-2xl font-semibold">{t.big}</p>
          <p className="mt-1 text-sm text-muted">{t.body}</p>
        </li>
      ))}
    </ul>
  );
}

export function EarthCoinArt({ size = 160, serial }: { size?: number; serial?: string }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} role="img" aria-label={serial ? `EarthCoin ${serial}` : 'EarthCoin illustration'}>
      <circle cx="100" cy="100" r="96" fill={c('--hfe-gold')} />
      <circle cx="100" cy="100" r="84" fill="none" stroke={c('--hfe-navy', 0.35)} strokeWidth="2" strokeDasharray="3 5" />
      <circle cx="100" cy="100" r="62" fill={c('--hfe-emerald')} />
      <path d="M70 84c8-12 22-12 26-2s-6 12-2 18-6 16-16 10-14-16-8-26zM106 64c12-2 24 6 28 18-8 2-12-4-18-2s-4 14-12 14-8-10-4-18 0-10 6-12zM104 120c10-4 22-2 24 4-4 10-18 14-26 10-4-6-2-10 2-14z" fill={c('--hfe-sage')} />
      <circle cx="100" cy="100" r="62" fill="none" stroke={c('--hfe-paper', 0.6)} strokeWidth="1.5" />
      <text x="100" y="186" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="700" letterSpacing="3" fill={c('--hfe-navy')}>
        EARTHCOIN
      </text>
      {serial && (
        <text x="100" y="26" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="600" letterSpacing="1" fill={c('--hfe-navy')}>
          {serial}
        </text>
      )}
    </svg>
  );
}
