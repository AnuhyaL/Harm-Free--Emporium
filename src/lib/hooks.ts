import { useCallback, useEffect, useMemo, useRef, useState, type DependencyList } from 'react';
import { products } from '@/data';
import { summarizeCart, type SummaryOptions } from '@/lib/pricing';
import { useAuth, useCart } from '@/store';
import { api } from '@/api';
import type { LoyaltyAccount } from '@/types';

export interface AsyncState<T> {
  data?: T;
  error?: Error;
  loading: boolean;
  reload: () => void;
}

/** Runs an async loader and tracks loading / error state. Ignores stale responses. */
export function useAsync<T>(fn: () => Promise<T>, deps: DependencyList): AsyncState<T> {
  const [state, setState] = useState<{ data?: T; error?: Error; loading: boolean }>({ loading: true });
  const [tick, setTick] = useState(0);
  const seq = useRef(0);

  useEffect(() => {
    const id = ++seq.current;
    setState((s) => ({ data: s.data, loading: true }));
    fn().then(
      (data) => id === seq.current && setState({ data, loading: false }),
      (error: Error) => id === seq.current && setState({ error, loading: false }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  return { ...state, reload };
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

export function useMediaQuery(query: string) {
  const [match, setMatch] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return match;
}

/** Re-renders on an interval so time-based UI (tracking, countdowns) stays current. */
export function useNow(intervalMs = 30_000) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}

const productIndex = new Map(products.map((p) => [p.id, p]));
export const lookupProduct = (id: string) => productIndex.get(id);

/** Loyalty for the signed-in user, or undefined for guests. */
export function useLoyalty() {
  const user = useAuth((s) => s.user);
  return useAsync<LoyaltyAccount | undefined>(() => (user ? api.loyalty.get() : Promise.resolve(undefined)), [user?.id]);
}

/** Priced cart, using the same engine the order endpoint uses. */
export function useCartSummary(extra?: Partial<SummaryOptions>, pointsBalance = 0) {
  const items = useCart((s) => s.items);
  const promoCode = useCart((s) => s.promoCode);
  const pointsToRedeem = useCart((s) => s.pointsToRedeem);
  const user = useAuth((s) => s.user);
  return useMemo(
    () =>
      summarizeCart(items, lookupProduct, {
        member: Boolean(user),
        promoCode,
        pointsToRedeem: user ? pointsToRedeem : 0,
        pointsBalance,
        ...extra,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, promoCode, pointsToRedeem, user, pointsBalance, extra?.shippingMethod],
  );
}
