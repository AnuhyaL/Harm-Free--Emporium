import { Suspense, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Icon, PageSkeleton, RouteEffects, Toaster } from '@/components/ui';
import { useAuth, useUI } from '@/store';
import { Footer } from './Footer';
import { Header } from './Header';

export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE !== 'false';

function DemoBanner() {
  const dismissed = useUI((s) => s.demoBannerDismissed);
  const dismiss = useUI((s) => s.dismissDemoBanner);
  if (!DEMO_MODE || dismissed) return null;
  return (
    <div className="bg-navy text-paper">
      <div className="container-hfe flex items-center gap-3 py-2 text-xs sm:text-sm">
        <Icon name="info" size={16} className="shrink-0 text-gold" />
        <p className="flex-1">
          <strong className="font-semibold">Demo mode.</strong> Payments are simulated and accounts are stored only in this browser.
        </p>
        <button type="button" onClick={dismiss} className="rounded p-1 text-paper/80 hover:text-paper" aria-label="Dismiss demo notice">
          <Icon name="close" size={16} />
        </button>
      </div>
    </div>
  );
}

function ThemeSync() {
  const theme = useUI((s) => s.theme);
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', theme);
  }, [theme]);
  return null;
}

export function Layout() {
  const refresh = useAuth((s) => s.refresh);
  useEffect(() => {
    // Validate the persisted session against the (mock) server on load.
    void refresh();
  }, [refresh]);

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only z-[70] rounded-full bg-primary px-4 py-2 text-primary-fg focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <ThemeSync />
      <RouteEffects />
      <DemoBanner />
      <Header />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        <Suspense fallback={<PageSkeleton />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
      <Toaster />
    </div>
  );
}
