import { lazy, type ReactNode } from 'react';
import { createBrowserRouter, Navigate, useLocation, useRouteError } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ErrorState, PageSkeleton } from '@/components/ui';
import { useAuth } from '@/store';

const Home = lazy(() => import('@/pages/Home'));
const About = lazy(() => import('@/pages/About'));
const Standard = lazy(() => import('@/pages/Standard'));
const Mission = lazy(() => import('@/pages/Mission'));
const Catalog = lazy(() => import('@/pages/Catalog'));
const ProductPage = lazy(() => import('@/pages/Product'));
const Brands = lazy(() => import('@/pages/Brands'));
const Brand = lazy(() => import('@/pages/Brand'));
const Cart = lazy(() => import('@/pages/Cart'));
const Checkout = lazy(() => import('@/pages/Checkout'));
const OrderConfirmation = lazy(() => import('@/pages/OrderConfirmation'));
const Login = lazy(() => import('@/pages/auth/Login'));
const Signup = lazy(() => import('@/pages/auth/Signup'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));
const AccountLayout = lazy(() => import('@/pages/account/AccountLayout'));
const Dashboard = lazy(() => import('@/pages/account/Dashboard'));
const Orders = lazy(() => import('@/pages/account/Orders'));
const OrderDetail = lazy(() => import('@/pages/account/OrderDetail'));
const Wishlist = lazy(() => import('@/pages/account/Wishlist'));
const Rewards = lazy(() => import('@/pages/account/Rewards'));
const ReturnRequest = lazy(() => import('@/pages/account/ReturnRequest'));
const Settings = lazy(() => import('@/pages/account/Settings'));
const Donate = lazy(() => import('@/pages/Donate'));
const EarthCoin = lazy(() => import('@/pages/EarthCoin'));
const Blog = lazy(() => import('@/pages/Blog'));
const BlogPost = lazy(() => import('@/pages/BlogPost'));
const Contact = lazy(() => import('@/pages/Contact'));
const Faq = lazy(() => import('@/pages/Faq'));
const Policy = lazy(() => import('@/pages/Policy'));
const VendorApply = lazy(() => import('@/pages/VendorApply'));
const NotFound = lazy(() => import('@/pages/NotFound'));

/** Redirects to /login?next=… when signed out. Waits for the session check first. */
function RequireAuth({ children }: { children: ReactNode }) {
  const user = useAuth((s) => s.user);
  const status = useAuth((s) => s.status);
  const location = useLocation();
  if (!user && status !== 'ready') return <PageSkeleton />;
  if (!user) return <Navigate to={`/login?next=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  return <>{children}</>;
}

function RouteError() {
  const error = useRouteError() as Error;
  return <ErrorState error={error} onRetry={() => window.location.reload()} />;
}

export const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <RouteError />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/about', element: <About /> },
      { path: '/standard', element: <Standard /> },
      { path: '/mission', element: <Mission /> },
      { path: '/catalog', element: <Catalog /> },
      { path: '/catalog/:category', element: <Catalog /> },
      { path: '/product/:slug', element: <ProductPage /> },
      { path: '/brands', element: <Brands /> },
      { path: '/brands/:slug', element: <Brand /> },
      { path: '/cart', element: <Cart /> },
      { path: '/checkout', element: <Checkout /> },
      { path: '/order/confirmation/:id', element: <OrderConfirmation /> },
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <Signup /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
      { path: '/account/wishlist', element: <Wishlist /> },
      {
        path: '/account',
        element: (
          <RequireAuth>
            <AccountLayout />
          </RequireAuth>
        ),
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'orders', element: <Orders /> },
          { path: 'orders/:id', element: <OrderDetail /> },
          { path: 'rewards', element: <Rewards /> },
          { path: 'returns/:id', element: <ReturnRequest /> },
          { path: 'settings', element: <Settings /> },
        ],
      },
      { path: '/donate', element: <Donate /> },
      { path: '/earthcoin', element: <EarthCoin /> },
      { path: '/blog', element: <Blog /> },
      { path: '/blog/:slug', element: <BlogPost /> },
      { path: '/contact', element: <Contact /> },
      { path: '/faq', element: <Faq /> },
      { path: '/policies', element: <Navigate to="/policies/terms" replace /> },
      { path: '/policies/:slug', element: <Policy /> },
      { path: '/vendors/apply', element: <VendorApply /> },
      { path: '*', element: <NotFound /> },
    ],
  },
], {
  // Opt in to React Router v7 behavior now so the upgrade is a no-op.
  future: {
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
  },
});
