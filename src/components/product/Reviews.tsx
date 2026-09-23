import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation } from 'react-router-dom';
import { z } from 'zod';
import { api } from '@/api';
import { Button, EmptyState, FormError, Icon, Skeleton, Stars, TextArea, TextField } from '@/components/ui';
import { REWARDS } from '@/data';
import { cn, date } from '@/lib/format';
import { useAsync } from '@/lib/hooks';
import { useAuth, useUI } from '@/store';
import type { Product, Review } from '@/types';

const schema = z.object({
  rating: z.coerce.number().int().min(1, 'Choose a rating.').max(5),
  title: z.string().trim().min(3, 'Add a short title.').max(80),
  body: z.string().trim().min(20, 'Share a bit more (at least 20 characters).').max(1500),
  media: z.enum(['none', 'photo', 'video']),
});
type Values = z.infer<typeof schema>;

function ReviewForm({ product, onDone }: { product: Product; onDone: () => void }) {
  const toast = useUI((s) => s.toast);
  const [error, setError] = useState<string>();
  const { register, handleSubmit, watch, formState } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { rating: 0, media: 'none' } });
  const rating = Number(watch('rating'));

  return (
    <form
      noValidate
      className="card space-y-4 p-5"
      onSubmit={handleSubmit(async (v) => {
        setError(undefined);
        try {
          const r = await api.reviews.create({ productId: product.id, rating: v.rating as Review['rating'], title: v.title, body: v.body, media: v.media === 'none' ? undefined : v.media });
          toast(`Thanks! You earned ${r.pointsAwarded} points${r.earthCoin ? ' and an EarthCoin' : ''}.`, { action: { label: 'Rewards', href: '/account/rewards' } });
          onDone();
        } catch (e) {
          setError((e as Error).message);
        }
      })}
    >
      <h3 className="text-lg font-semibold">Write a review</h3>
      <FormError message={error} />
      <fieldset>
        <legend className="label">Your rating</legend>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="cursor-pointer">
              <input type="radio" value={n} className="peer sr-only" {...register('rating')} />
              <span className="sr-only">{n} star{n > 1 ? 's' : ''}</span>
              <Icon name="star" size={28} filled strokeWidth={0} className={cn('rounded peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-link', n <= rating ? 'text-gold' : 'text-line')} />
            </label>
          ))}
        </div>
        {formState.errors.rating && <p role="alert" className="mt-1 text-xs text-danger">{formState.errors.rating.message}</p>}
      </fieldset>
      <TextField label="Title" error={formState.errors.title?.message} {...register('title')} />
      <TextArea label="Review" rows={4} error={formState.errors.body?.message} {...register('body')} />
      <fieldset>
        <legend className="label">Add media for +{REWARDS.photoReviewBonus} bonus points</legend>
        <div className="flex flex-wrap gap-4 text-sm">
          {(['none', 'photo', 'video'] as const).map((m) => (
            <label key={m} className="flex items-center gap-2">
              <input type="radio" value={m} {...register('media')} className="accent-[rgb(var(--primary))]" /> {m === 'none' ? 'No media' : m === 'photo' ? 'Photo' : 'Video'}
            </label>
          ))}
        </div>
        <p className="mt-1 text-xs text-muted">Demo: media upload is simulated; only the choice is recorded.</p>
      </fieldset>
      <p className="text-xs text-muted">
        You earn {REWARDS.reviewPoints} points per review. Every {REWARDS.reviewsPerEarthCoin} reviews earns an EarthCoin.
      </p>
      <Button type="submit" loading={formState.isSubmitting}>
        Submit review
      </Button>
    </form>
  );
}

export function ProductReviews({ product }: { product: Product }) {
  const user = useAuth((s) => s.user);
  const location = useLocation();
  const reviews = useAsync(() => api.reviews.forProduct(product.id), [product.id]);
  const [writing, setWriting] = useState(false);
  const [filter, setFilter] = useState<number | null>(null);

  const all = reviews.data ?? [];
  const dist = [5, 4, 3, 2, 1].map((s) => ({ s, n: all.filter((r) => r.rating === s).length }));
  const avg = all.length ? all.reduce((a, r) => a + r.rating, 0) / all.length : 0;
  const shown = filter ? all.filter((r) => r.rating === filter) : all;

  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="scroll-mt-24">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 id="reviews-heading" className="text-2xl font-semibold">
          Reviews
        </h2>
      </div>
      {reviews.loading ? (
        <Skeleton className="h-48" />
      ) : (
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <div>
            <p className="font-display text-4xl font-semibold">{avg ? avg.toFixed(1) : '–'}</p>
            <Stars value={avg} />
            <p className="mt-1 text-sm text-muted">{all.length} reviews</p>
            <ul className="mt-4 space-y-1.5">
              {dist.map(({ s, n }) => (
                <li key={s}>
                  <button type="button" onClick={() => setFilter(filter === s ? null : s)} aria-pressed={filter === s} className="flex w-full items-center gap-2 rounded text-sm hover:bg-tint">
                    <span className="w-10 text-left">{s} star</span>
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-line">
                      <span className="block h-full rounded-full bg-gold" style={{ width: `${all.length ? (n / all.length) * 100 : 0}%` }} />
                    </span>
                    <span className="w-6 text-right text-muted">{n}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              {user ? (
                !writing && (
                  <Button variant="secondary" onClick={() => setWriting(true)}>
                    Write a review
                  </Button>
                )
              ) : (
                <p className="text-sm">
                  <Link to={`/login?next=${encodeURIComponent(location.pathname + '#reviews')}`}>Sign in</Link> to write a review and earn {REWARDS.reviewPoints} points.
                </p>
              )}
            </div>
          </div>
          <div className="space-y-4">
            {writing && (
              <ReviewForm
                product={product}
                onDone={() => {
                  setWriting(false);
                  reviews.reload();
                }}
              />
            )}
            {shown.length === 0 ? (
              <EmptyState icon="star" title={filter ? `No ${filter}-star reviews` : 'No reviews yet'} body="Be the first to share how it works for you." />
            ) : (
              <ul className="divide-y divide-line rounded-card border border-line bg-surface">
                {shown.map((r) => (
                  <li key={r.id} className="p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Stars value={r.rating} size={14} />
                      <p className="font-semibold">{r.title}</p>
                    </div>
                    <p className="mt-2 text-sm">{r.body}</p>
                    <p className="mt-2 flex flex-wrap items-center gap-x-2 text-xs text-muted">
                      <span className="font-medium text-fg">{r.authorName}</span>
                      <span>{r.location}</span>
                      <span>· {date(r.createdAt)}</span>
                      {r.verifiedPurchase && (
                        <span className="inline-flex items-center gap-0.5 text-success">
                          <Icon name="check" size={12} /> Verified purchase
                        </span>
                      )}
                      {r.media && <span className="chip">{r.media === 'photo' ? 'Photo review' : 'Video review'}</span>}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
