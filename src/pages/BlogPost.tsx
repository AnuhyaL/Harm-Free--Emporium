import { useParams } from 'react-router-dom';
import { api } from '@/api';
import { PostCover } from '@/components/content/ContentBits';
import { ProductGrid } from '@/components/product/ProductRail';
import { Breadcrumbs, ButtonLink, ErrorState, PageSkeleton, Seo } from '@/components/ui';
import { date } from '@/lib/format';
import { useAsync } from '@/lib/hooks';

export default function BlogPost() {
  const { slug = '' } = useParams();
  const post = useAsync(() => api.content.post(slug), [slug]);
  const related = useAsync(() => (post.data ? api.catalog.bySlugs(post.data.relatedProductSlugs) : Promise.resolve([])), [post.data?.id]);

  if (post.error) return <ErrorState error={post.error} onRetry={post.reload} />;
  if (!post.data) return <PageSkeleton />;
  const p = post.data;

  return (
    <article>
      <Seo title={p.title} description={p.excerpt} />
      <header className="container-hfe max-w-3xl pt-10">
        <Breadcrumbs items={[{ label: 'Journal', to: '/blog' }, { label: p.title }]} />
        <p className="eyebrow">{p.category}</p>
        <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">{p.title}</h1>
        <p className="mt-3 text-muted">
          By {p.author} · <time dateTime={p.publishedAt}>{date(p.publishedAt)}</time> · {p.readMinutes} min read
        </p>
      </header>
      <div className="container-hfe mt-8 max-w-4xl">
        <PostCover post={p} className="aspect-[16/9] w-full rounded-card" />
      </div>
      <div className="container-hfe prose-hfe max-w-3xl py-10 text-lg">
        {p.body.map((b, i) => {
          if (b.type === 'h2') return <h2 key={i}>{b.text as string}</h2>;
          if (b.type === 'quote')
            return (
              <blockquote key={i} className="my-8 border-l-4 border-gold pl-5 font-display text-xl italic">
                {b.text as string}
              </blockquote>
            );
          if (b.type === 'ul')
            return (
              <ul key={i}>
                {(b.text as string[]).map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            );
          return <p key={i}>{b.text as string}</p>;
        })}
      </div>
      {related.data && related.data.length > 0 && (
        <section aria-labelledby="featured-products" className="bg-tint py-14">
          <div className="container-hfe">
            <h2 id="featured-products" className="mb-6 text-xl font-semibold">
              Products in this story
            </h2>
            <ProductGrid products={related.data} />
          </div>
        </section>
      )}
      <div className="container-hfe py-10">
        <ButtonLink to="/blog" variant="secondary">
          Back to the Journal
        </ButtonLink>
      </div>
    </article>
  );
}
