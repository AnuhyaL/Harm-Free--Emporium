import * as NM from '@radix-ui/react-navigation-menu';
import { useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { categoryGroups, products } from '@/data';
import { Logo } from '@/components/brand/Logo';
import { ProductImage } from '@/components/brand/ProductArt';
import { Icon, IconButton, type IconName } from '@/components/ui';
import { Drawer } from '@/components/ui/Dialog';
import { cn } from '@/lib/format';
import { cartCount, useAuth, useCart, useUI, useWishlist, type ThemePref } from '@/store';
import { SearchBox } from './SearchBox';
import type { CategoryGroup, ValueTag } from '@/types';

export const VALUE_TAGS: ValueTag[] = [
  'Non-Toxic', 'Compostable', 'Recyclable', 'Refillable', 'Plastic-Free', 'Bio-Based',
  'Cleantech', 'Minimal Packaging', 'Made in USA', 'Women-Owned', 'Small-Batch',
];

interface NavItem {
  to: string;
  label: string;
  note: string;
  icon: IconName;
}

/** Catalog mega-menu: five columns, each with category links and a featured product tile. */
const CATALOG_COLUMNS: string[][] = [
  ['home-and-kitchen'],
  ['energy-and-climate'],
  ['yard-and-garden', 'preparedness'],
  ['water', 'body-and-wellness'],
  ['build-and-move'],
];

export const SERVICE_LINKS: NavItem[] = [
  { to: '/contact', label: 'Customer Care', note: 'Questions about orders, products or rewards', icon: 'mail' },
  { to: '/account/orders', label: 'Track an order', note: 'Every vendor shipment, step by step', icon: 'truck' },
  { to: '/policies/returns', label: 'Returns & warranty', note: 'Handled by the maker, routed by us', icon: 'refresh' },
  { to: '/policies/shipping', label: 'Shipping', note: 'Vendor-shipped, free over $50 per vendor', icon: 'package' },
  { to: '/account/rewards', label: 'Rewards & points', note: 'Earn on purchases, reviews and referrals', icon: 'gift' },
  { to: '/faq', label: 'FAQ', note: 'Quick answers to common questions', icon: 'info' },
  { to: '/vendors/apply', label: 'Sell with us', note: 'Apply to list your HarmFree products', icon: 'seal' },
];

export const MORE_LINKS: NavItem[] = [
  { to: '/about', label: 'About us', note: 'Green2Gold roots since the first Earth Day', icon: 'leaf' },
  { to: '/standard', label: 'The HarmFree Standard', note: 'Five pillars every product passes', icon: 'shield' },
  { to: '/mission', label: 'Mission', note: 'Reuse · Recycle · Refill', icon: 'bottle' },
  { to: '/blog', label: 'Journal', note: 'Innovation and HarmFree in action', icon: 'paper' },
  { to: '/earthcoin', label: 'EarthCoin', note: 'Recognition for giving', icon: 'coin' },
  { to: '/donate', label: 'Donate', note: 'Tax-deductible, earns an EarthCoin', icon: 'heart' },
];

const groupBySlug = (slug: string) => categoryGroups.find((g) => g.slug === slug)!;
const featuredFor = (groups: CategoryGroup[]) =>
  products
    .filter((p) => groups.some((g) => g.categories.some((c) => c.slug === p.categorySlug)))
    .sort((a, b) => b.unitsSold - a.unitsSold)[0];

const triggerCls =
  'group inline-flex h-10 items-center gap-1 whitespace-nowrap rounded-full px-3.5 text-sm font-medium text-fg no-underline transition-colors hover:bg-tint data-[state=open]:bg-tint aria-[current=page]:bg-tint aria-[current=page]:font-semibold aria-[current=true]:bg-tint aria-[current=true]:font-semibold';

function Chevron() {
  return <Icon name="chevronDown" size={14} className="transition-transform duration-200 group-data-[state=open]:rotate-180" />;
}

function CatalogColumn({ slugs }: { slugs: string[] }) {
  const groups = slugs.map(groupBySlug);
  const feat = featuredFor(groups);
  return (
    <div className="flex min-w-0 flex-col">
      {groups.map((group) => (
        <div key={group.slug} className="mb-4">
          <NM.Link asChild>
            <Link to={`/catalog?group=${group.slug}`} className="mb-1.5 block font-display text-[15px] font-semibold text-fg no-underline hover:underline">
              {group.name}
            </Link>
          </NM.Link>
          <ul className="space-y-0.5">
            {group.categories.map((c) => (
              <li key={c.slug}>
                <NM.Link asChild>
                  <Link to={`/catalog/${c.slug}`} className="block rounded py-0.5 text-[13px] leading-snug text-muted no-underline hover:text-fg hover:underline">
                    {c.name}
                  </Link>
                </NM.Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
      {feat && (
        <NM.Link asChild>
          <Link to={`/product/${feat.slug}`} className="group/tile mt-auto flex items-center gap-2.5 rounded-soft border border-line bg-tint/60 p-2 no-underline hover:bg-tint">
            <span className="h-12 w-12 shrink-0 overflow-hidden rounded-lg">
              <ProductImage product={feat} sizes="48px" />
            </span>
            <span className="min-w-0">
              <span className="block text-[10px] font-semibold uppercase tracking-wide text-muted">Featured</span>
              <span className="block truncate text-[13px] font-medium text-fg group-hover/tile:underline">{feat.name}</span>
            </span>
          </Link>
        </NM.Link>
      )}
    </div>
  );
}

function LinkPanel({ items, footer }: { items: NavItem[]; footer?: { to: string; label: string } }) {
  return (
    <div className="w-[min(92vw,600px)] p-4">
      <ul className="grid gap-1 sm:grid-cols-2">
        {items.map((l) => (
          <li key={l.to}>
            <NM.Link asChild>
              <Link to={l.to} className="flex gap-3 rounded-soft p-3 no-underline hover:bg-tint">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-tint text-fg">
                  <Icon name={l.icon} size={18} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-fg">{l.label}</span>
                  <span className="block text-xs text-muted">{l.note}</span>
                </span>
              </Link>
            </NM.Link>
          </li>
        ))}
      </ul>
      {footer && (
        <div className="mt-2 border-t border-line px-3 pt-3">
          <NM.Link asChild>
            <Link to={footer.to} className="inline-flex items-center gap-1 text-sm font-semibold">
              {footer.label} <Icon name="arrowRight" size={14} />
            </Link>
          </NM.Link>
        </div>
      )}
    </div>
  );
}

/** Marks a top-level section active when the current path belongs to it. */
function useSection() {
  const { pathname } = useLocation();
  if (pathname === '/') return 'home';
  if (/^\/(catalog|product|brands)/.test(pathname)) return 'catalog';
  if (SERVICE_LINKS.some((l) => pathname.startsWith(l.to.split('?')[0])) || pathname.startsWith('/policies')) return 'services';
  if (MORE_LINKS.some((l) => pathname.startsWith(l.to))) return 'more';
  return null;
}

function DesktopNav() {
  const section = useSection();
  const current = (s: string) => (section === s ? { 'aria-current': true as const } : {});
  return (
    <NM.Root className="hidden lg:block" aria-label="Main">
      <NM.List className="flex items-center gap-1">
        <NM.Item>
          <NM.Link asChild active={section === 'home'}>
            <NavLink to="/" end className={triggerCls}>
              Home
            </NavLink>
          </NM.Link>
        </NM.Item>

        <NM.Item>
          <NM.Trigger className={triggerCls} {...current('catalog')}>
            Catalog <Chevron />
          </NM.Trigger>
          <NM.Content className="w-[min(94vw,1120px)] p-6">
            <div className="grid grid-cols-5 gap-6">
              {CATALOG_COLUMNS.map((slugs) => (
                <CatalogColumn key={slugs.join()} slugs={slugs} />
              ))}
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-line pt-4">
              <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-muted">Shop by values</span>
              {VALUE_TAGS.map((v) => (
                <NM.Link key={v} asChild>
                  <Link to={`/catalog?values=${encodeURIComponent(v)}`} className="rounded-full border border-line px-2.5 py-1 text-xs text-fg no-underline hover:bg-tint">
                    {v}
                  </Link>
                </NM.Link>
              ))}
              <span className="ml-auto flex gap-4">
                <NM.Link asChild>
                  <Link to="/brands" className="text-sm font-semibold">
                    Brands
                  </Link>
                </NM.Link>
                <NM.Link asChild>
                  <Link to="/catalog" className="inline-flex items-center gap-1 text-sm font-semibold">
                    All products A–Z <Icon name="arrowRight" size={14} />
                  </Link>
                </NM.Link>
              </span>
            </div>
          </NM.Content>
        </NM.Item>

        <NM.Item>
          <NM.Trigger className={triggerCls} {...current('services')}>
            Services <Chevron />
          </NM.Trigger>
          <NM.Content>
            <LinkPanel items={SERVICE_LINKS} footer={{ to: '/contact', label: 'Contact Customer Care' }} />
          </NM.Content>
        </NM.Item>

        <NM.Item>
          <NM.Trigger className={triggerCls} {...current('more')}>
            More <Chevron />
          </NM.Trigger>
          <NM.Content>
            <LinkPanel items={MORE_LINKS} />
          </NM.Content>
        </NM.Item>
      </NM.List>
      {/* Anchored to the sticky header (not the nav) so wide panels center on the page. */}
      <div className="absolute inset-x-0 top-full z-40 flex justify-center px-4 pt-2">
        <NM.Viewport className="origin-top overflow-hidden rounded-card border border-line bg-surface shadow-lift data-[state=open]:animate-[menuIn_200ms_ease-out]" />
      </div>
    </NM.Root>
  );
}

function MobileSection({ title, children, defaultOpen }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  return (
    <details className="group border-b border-line py-1" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between rounded-soft px-3 py-3 text-base font-semibold hover:bg-tint [&::-webkit-details-marker]:hidden">
        {title}
        <Icon name="chevronDown" size={18} className="transition-transform group-open:rotate-180" />
      </summary>
      <div className="pb-2">{children}</div>
    </details>
  );
}

function MobileNav({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const close = () => onOpenChange(false);
  const sub = 'flex items-center gap-3 rounded-soft px-3 py-2 text-sm text-fg no-underline hover:bg-tint';
  return (
    <Drawer open={open} onOpenChange={onOpenChange} title="Menu" side="left">
      <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-3 py-4">
        <SearchBox className="mb-3 px-1" onDone={close} />
        <Link to="/" onClick={close} className="block border-b border-line px-3 py-3 text-base font-semibold text-fg no-underline hover:bg-tint">
          Home
        </Link>
        <MobileSection title="Catalog" defaultOpen>
          <Link to="/catalog" onClick={close} className={cn(sub, 'font-semibold')}>
            All products A–Z
          </Link>
          {categoryGroups.map((g) => (
            <details key={g.slug} className="group/g">
              <summary className="flex cursor-pointer list-none items-center justify-between rounded-soft px-3 py-2 text-sm font-medium hover:bg-tint [&::-webkit-details-marker]:hidden">
                {g.name}
                <Icon name="chevronDown" size={14} className="transition-transform group-open/g:rotate-180" />
              </summary>
              <ul className="mb-1 ml-4 border-l border-line pl-2">
                <li>
                  <Link to={`/catalog?group=${g.slug}`} onClick={close} className="block px-3 py-1.5 text-sm font-medium text-fg no-underline">
                    All {g.name}
                  </Link>
                </li>
                {g.categories.map((c) => (
                  <li key={c.slug}>
                    <Link to={`/catalog/${c.slug}`} onClick={close} className="block px-3 py-1.5 text-sm text-muted no-underline hover:text-fg">
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          ))}
          <Link to="/brands" onClick={close} className={sub}>
            Brands
          </Link>
        </MobileSection>
        <MobileSection title="Services">
          {SERVICE_LINKS.map((l) => (
            <Link key={l.to} to={l.to} onClick={close} className={sub}>
              <Icon name={l.icon} size={18} className="text-muted" /> {l.label}
            </Link>
          ))}
        </MobileSection>
        <MobileSection title="More">
          {MORE_LINKS.map((l) => (
            <Link key={l.to} to={l.to} onClick={close} className={sub}>
              <Icon name={l.icon} size={18} className="text-muted" /> {l.label}
            </Link>
          ))}
        </MobileSection>
      </nav>
    </Drawer>
  );
}

export function ThemeToggle() {
  const theme = useUI((s) => s.theme);
  const setTheme = useUI((s) => s.setTheme);
  const next: Record<ThemePref, ThemePref> = { system: 'light', light: 'dark', dark: 'system' };
  const label = { system: 'Theme: system', light: 'Theme: light', dark: 'Theme: dark' }[theme];
  return (
    <IconButton label={`${label}. Switch to ${next[theme]}`} onClick={() => setTheme(next[theme])}>
      <Icon name={theme === 'dark' ? 'moon' : theme === 'light' ? 'sun' : 'contrast'} />
    </IconButton>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const items = useCart((s) => s.items);
  const count = cartCount(items);
  const wish = useWishlist((s) => s.items.length);
  const user = useAuth((s) => s.user);
  const setCartOpen = useUI((s) => s.setCartOpen);

  return (
    <header className="sticky z-40 border-b border-line bg-bg/90 backdrop-blur supports-[backdrop-filter]:bg-bg/80" style={{ top: 'env(safe-area-inset-top, 0px)' }}>
      <div className="container-hfe flex h-16 items-center gap-2 sm:gap-4">
        <IconButton label="Open menu" className="lg:hidden" onClick={() => setMobileOpen(true)}>
          <Icon name="menu" />
        </IconButton>
        <Link to="/" className="shrink-0 rounded no-underline" aria-label="HarmFree Emporium home">
          <Logo />
        </Link>
        <div className="mx-auto hidden lg:block">
          <DesktopNav />
        </div>
        <div className="ml-auto flex items-center gap-0.5 lg:ml-0">
          <SearchBox className="hidden w-60 xl:block" />
          <IconButton label="Search" className="xl:hidden" onClick={() => setSearchOpen((s) => !s)} aria-expanded={searchOpen}>
            <Icon name="search" />
          </IconButton>
          <ThemeToggle />
          <Link
            to={user ? '/account' : '/login'}
            className="relative hidden h-10 w-10 items-center justify-center rounded-full text-fg hover:bg-tint sm:inline-flex"
            aria-label={user ? `Account for ${user.firstName}` : 'Sign in'}
            title={user ? 'Your account' : 'Sign in'}
          >
            <Icon name="user" />
            {user && <span className="absolute bottom-1.5 right-1.5 h-2 w-2 rounded-full bg-success ring-2 ring-bg" aria-hidden />}
          </Link>
          <Link to="/account/wishlist" className="relative hidden h-10 w-10 items-center justify-center rounded-full text-fg hover:bg-tint sm:inline-flex" aria-label={`Wishlist, ${wish} items`} title="Wishlist">
            <Icon name="heartOutline" />
            {wish > 0 && <span className="absolute -right-0.5 top-0 min-w-[18px] rounded-full bg-sky px-1 text-center text-[11px] font-bold leading-[18px] text-navy">{wish}</span>}
          </Link>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-fg hover:bg-tint"
            aria-label={`Open cart, ${count} items`}
          >
            <Icon name="cart" />
            {count > 0 && <span className="absolute -right-0.5 top-0 min-w-[18px] rounded-full bg-gold px-1 text-center text-[11px] font-bold leading-[18px] text-gold-fg">{count}</span>}
          </button>
        </div>
      </div>
      {searchOpen && (
        <div className="container-hfe pb-3 xl:hidden">
          <SearchBox autoFocus onDone={() => setSearchOpen(false)} />
        </div>
      )}
      <MobileNav open={mobileOpen} onOpenChange={setMobileOpen} />
    </header>
  );
}
