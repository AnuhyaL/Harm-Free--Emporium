import { useState } from 'react';
import { api } from '@/api';
import { PostCard } from '@/components/content/ContentBits';
import { EmptyState, ErrorState, PageHeader, Seo, Skeleton } from '@/components/ui';
import { cn } from '@/lib/format';
import { useAsync } from '@/lib/hooks';

const CATS = ['All', 'Innovation', 'In Action', 'Regen Media', 'Standard'] as const;

export default function Blog() {
  const posts = useAsync(() => api.content.posts(), []);
  const [cat, setCat] = useState<(typeof CATS)[number]>('All');
  const list = posts.data?.filter((p) => cat === 'All' || p.category === cat) ?? [];

  return (
    <>
      <Seo title="The Journal" description="Stories about innovative HarmFree products, how they are used in action, and the Regen Media family." />
      <PageHeader
        eyebrow="The Journal"
        title="Innovation, and HarmFree in action"
        intro="New products worth knowing about, real-world use, and features from Regen Media, Regenerative Media TV and Digital Regeneration World Magazine."
        crumbs={[{ label: 'Journal' }]}
      />
      <div className="container-hfe py-12">
        <div role="group" aria-label="Filter stories" className="mb-8 flex flex-wrap gap-2">
          {CATS.map((c) => (
            <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)} className={cn('rounded-full border px-4 py-1.5 text-sm', cat === c ? 'border-primary bg-primary text-primary-fg' : 'border-line bg-surface hover:bg-tint')}>
              {c}
            </button>
          ))}
        </div>
        {posts.error && <ErrorState error={posts.error} onRetry={posts.reload} />}
        {posts.loading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-80" />
            ))}
          </div>
        ) : list.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        ) : (
          <EmptyState icon="paper" title="No stories here yet" body="Try another topic." />
        )}
      </div>
    </>
  );
}
