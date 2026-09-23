import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Icon, type IconName } from '@/components/ui';
import { cn } from '@/lib/format';
import { useAuth, useUI } from '@/store';

export const ACCOUNT_NAV: { to: string; label: string; icon: IconName; end?: boolean }[] = [
  { to: '/account', label: 'Dashboard', icon: 'grid', end: true },
  { to: '/account/orders', label: 'Orders & tracking', icon: 'package' },
  { to: '/account/rewards', label: 'Rewards & EarthCoin', icon: 'gift' },
  { to: '/account/wishlist', label: 'Wishlist', icon: 'heartOutline' },
  { to: '/account/settings', label: 'Profile & addresses', icon: 'settings' },
];

export function AccountNav() {
  const logout = useAuth((s) => s.logout);
  const toast = useUI((s) => s.toast);
  const navigate = useNavigate();
  return (
    <nav aria-label="Account">
      <ul className="flex gap-1 overflow-x-auto pb-2 no-scrollbar lg:flex-col lg:overflow-visible lg:pb-0">
        {ACCOUNT_NAV.map((l) => (
          <li key={l.to} className="shrink-0">
            <NavLink
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                cn('flex items-center gap-2.5 rounded-soft px-3 py-2.5 text-sm font-medium no-underline transition-colors', isActive ? 'bg-primary text-primary-fg' : 'text-fg hover:bg-tint')
              }
            >
              <Icon name={l.icon} size={18} /> {l.label}
            </NavLink>
          </li>
        ))}
        <li className="shrink-0 lg:mt-4 lg:border-t lg:border-line lg:pt-4">
          <button
            type="button"
            onClick={async () => {
              await logout();
              toast('You are signed out.');
              navigate('/');
            }}
            className="flex w-full items-center gap-2.5 rounded-soft px-3 py-2.5 text-sm font-medium text-muted hover:bg-tint hover:text-fg"
          >
            <Icon name="logout" size={18} /> Sign out
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default function AccountLayout() {
  const user = useAuth((s) => s.user);
  return (
    <div className="container-hfe py-10">
      <p className="eyebrow">My account</p>
      <p className="mt-1 font-display text-xl font-semibold">Hi, {user?.firstName}</p>
      <div className="mt-6 grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <AccountNav />
        </aside>
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
