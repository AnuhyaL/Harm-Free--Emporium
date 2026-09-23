import { Link } from 'react-router-dom';
import { Logo } from '@/components/brand/Logo';
import { Icon } from '@/components/ui';
import { ORG, categoryGroups } from '@/data';
import { NewsletterForm } from './NewsletterForm';

const COLS = [
  {
    title: 'Shop',
    links: [
      { to: '/catalog', label: 'All products A–Z' },
      ...categoryGroups.slice(0, 5).map((g) => ({ to: `/catalog?group=${g.slug}`, label: g.name })),
      { to: '/brands', label: 'Brands' },
    ],
  },
  {
    title: 'HarmFree',
    links: [
      { to: '/about', label: 'Our Story' },
      { to: '/standard', label: 'The HarmFree Standard' },
      { to: '/mission', label: 'Mission' },
      { to: '/blog', label: 'Journal' },
      { to: '/vendors/apply', label: 'Sell with us' },
    ],
  },
  {
    title: 'Customer Care',
    links: [
      { to: '/contact', label: 'Contact us' },
      { to: '/faq', label: 'FAQ' },
      { to: '/account/orders', label: 'Track an order' },
      { to: '/policies/shipping', label: 'Shipping' },
      { to: '/policies/returns', label: 'Returns (to vendor)' },
      { to: '/policies/warranty', label: 'Warranty' },
    ],
  },
  {
    title: 'Rewards',
    links: [
      { to: '/account/rewards', label: 'Points & rewards' },
      { to: '/earthcoin', label: 'EarthCoin' },
      { to: '/donate', label: 'Donate' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-navy text-paper" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="container-hfe grid grid-cols-1 gap-10 py-14 lg:grid-cols-[1.3fr_2fr] [&>*]:min-w-0">
        <div className="min-w-0 space-y-5 break-words">
          <Logo inverted />
          <p className="max-w-sm text-sm text-paper/80">
            {ORG.tagline} A vetted marketplace and an initiative of {ORG.parent}, a 501(c)(3) non-profit green-tech incubator.
          </p>
          <address className="space-y-1.5 text-sm not-italic text-paper/80">
            <p className="flex items-center gap-2">
              <Icon name="mail" size={16} /> <a className="text-paper" href={`mailto:${ORG.email}`}>{ORG.email}</a>
            </p>
            <p className="flex items-center gap-2">
              <Icon name="phone" size={16} /> <a className="text-paper" href={`tel:${ORG.phoneHref}`}>{ORG.phone}</a>
            </p>
            <p className="flex items-start gap-2">
              <Icon name="pin" size={16} className="mt-0.5 shrink-0" />
              <span>{ORG.address.join(', ')}</span>
            </p>
          </address>
          <div className="max-w-sm">
            <p className="mb-2 text-sm font-semibold">Get new HarmFree finds, monthly</p>
            <NewsletterForm tone="dark" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {COLS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="mb-3 font-sans text-sm font-semibold uppercase tracking-wider text-gold">{col.title}</h2>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-sm text-paper/85 no-underline hover:text-paper hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div className="gold-rule" />
      <div className="container-hfe py-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-paper/70">The Green2Gold family</p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {ORG.properties.map((p) => (
            <li key={p.name}>
              {p.url ? (
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-paper/90 no-underline hover:underline">
                  {p.name} <Icon name="external" size={12} />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ) : p.href ? (
                <Link to={p.href} className="text-paper/90 no-underline hover:underline">
                  {p.name}
                </Link>
              ) : (
                <span className="text-paper/90">{p.name}</span>
              )}
              <span className="ml-2 text-xs text-paper/60">{p.note}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-paper/70">
          <p>© {new Date().getFullYear()} HarmFree Emporium · An initiative of Green2Gold (G2G), a 501(c)(3) non-profit.</p>
          <p className="flex flex-wrap gap-4">
            <Link to="/policies/terms" className="text-paper/80">Terms</Link>
            <Link to="/policies/privacy" className="text-paper/80">Privacy</Link>
            <span>Products are sold and warranted by their vendors.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
