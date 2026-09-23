import { zodResolver } from '@hookform/resolvers/zod';
import { useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { api, ApiError } from '@/api';
import { Mascot } from '@/components/brand/Mascot';
import { ProductImage } from '@/components/brand/ProductArt';
import { EarnLine, SummaryRows } from '@/components/cart/CartParts';
import { PaymentForm, type PaymentToken } from '@/components/cart/PaymentForm';
import { Button, EmptyState, FormError, Icon, Seo, TextField } from '@/components/ui';
import { cn, money } from '@/lib/format';
import { useCartSummary, useLoyalty } from '@/lib/hooks';
import { OUTCOME_MESSAGES, type PaymentOutcome } from '@/lib/payment';
import { SHIPPING_METHODS, summarizeCart } from '@/lib/pricing';
import { lookupProduct } from '@/lib/hooks';
import { useAuth, useCart, useUI } from '@/store';
import type { OrderAddress, ShippingMethodId } from '@/types';

type Step = 'contact' | 'address' | 'method' | 'payment' | 'review';
const STEPS: { id: Step; label: string }[] = [
  { id: 'contact', label: 'Contact' },
  { id: 'address', label: 'Shipping address' },
  { id: 'method', label: 'Shipping method' },
  { id: 'payment', label: 'Payment' },
  { id: 'review', label: 'Review' },
];

const contactSchema = z.object({ email: z.string().trim().email('Enter a valid email address.') });
const addressSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter the recipient name.'),
  line1: z.string().trim().min(3, 'Enter a street address.'),
  line2: z.string().trim().optional(),
  city: z.string().trim().min(2, 'Enter a city.'),
  region: z.string().trim().min(2, 'Enter a state or region.'),
  postalCode: z.string().trim().regex(/^[A-Za-z0-9 -]{3,10}$/, 'Enter a valid postal code.'),
  country: z.string().trim().min(2, 'Enter a country.'),
  phone: z.string().trim().optional(),
});

function Stepper({ current, done, onGo }: { current: Step; done: Set<Step>; onGo: (s: Step) => void }) {
  const idx = STEPS.findIndex((s) => s.id === current);
  return (
    <nav aria-label="Checkout progress" className="mb-8">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm">
        {STEPS.map((s, i) => {
          const isDone = done.has(s.id) && i < idx;
          const isCurrent = s.id === current;
          return (
            <li key={s.id} className="flex items-center gap-2">
              <button
                type="button"
                disabled={!isDone}
                onClick={() => onGo(s.id)}
                aria-current={isCurrent ? 'step' : undefined}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-medium',
                  isCurrent ? 'bg-primary text-primary-fg' : isDone ? 'bg-tint text-fg hover:bg-sage/60' : 'text-muted',
                )}
              >
                <span className={cn('inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px]', isCurrent ? 'bg-primary-fg/20' : 'bg-surface')}>
                  {isDone ? <Icon name="check" size={12} /> : i + 1}
                </span>
                {s.label}
              </button>
              {i < STEPS.length - 1 && <Icon name="chevronRight" size={14} className="text-muted" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function StepCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section aria-labelledby="step-h" className="card p-6 sm:p-8">
      <h2 id="step-h" className="mb-5 text-xl font-semibold" tabIndex={-1}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function ContactStep({ initial, onNext }: { initial: string; onNext: (email: string) => void }) {
  const user = useAuth((s) => s.user);
  const { register, handleSubmit, formState } = useForm<{ email: string }>({ resolver: zodResolver(contactSchema), defaultValues: { email: initial } });
  return (
    <StepCard title="Contact">
      {!user && (
        <p className="mb-5 rounded-soft bg-tint p-3 text-sm">
          Have an account? <Link to="/login?next=/checkout">Sign in</Link> for member pricing, points and an EarthCoin on $35+ orders. Or continue as a guest.
        </p>
      )}
      <form noValidate onSubmit={handleSubmit((v) => onNext(v.email))} className="space-y-5">
        <TextField label="Email for order updates" type="email" autoComplete="email" error={formState.errors.email?.message} {...register('email')} />
        <Button type="submit">Continue to shipping</Button>
      </form>
    </StepCard>
  );
}

function AddressStep({ initial, onNext }: { initial?: OrderAddress; onNext: (a: OrderAddress) => void }) {
  const user = useAuth((s) => s.user);
  const saved = user?.addresses ?? [];
  const [choice, setChoice] = useState<string>(initial ? 'new' : saved.find((a) => a.isDefault)?.id ?? (saved[0]?.id || 'new'));
  const { register, handleSubmit, formState } = useForm<OrderAddress>({
    resolver: zodResolver(addressSchema),
    defaultValues: initial ?? { fullName: user ? `${user.firstName} ${user.lastName}` : '', country: 'United States' },
  });
  const e = formState.errors;

  const submit = handleSubmit((v) => onNext(v));
  return (
    <StepCard title="Shipping address">
      <form
        noValidate
        onSubmit={(ev) => {
          if (choice !== 'new') {
            ev.preventDefault();
            const a = saved.find((x) => x.id === choice)!;
            onNext({ fullName: a.fullName, line1: a.line1, line2: a.line2, city: a.city, region: a.region, postalCode: a.postalCode, country: a.country, phone: a.phone });
          } else void submit(ev);
        }}
        className="space-y-5"
      >
        {saved.length > 0 && (
          <fieldset>
            <legend className="label">Saved addresses</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {[...saved.map((a) => ({ id: a.id, title: a.label, body: `${a.line1}, ${a.city}, ${a.region} ${a.postalCode}` })), { id: 'new', title: 'Use a new address', body: 'Enter it below' }].map((o) => (
                <label key={o.id} className={cn('flex cursor-pointer gap-3 rounded-soft border p-4 text-sm', choice === o.id ? 'border-primary bg-tint' : 'border-line')}>
                  <input type="radio" name="addr" checked={choice === o.id} onChange={() => setChoice(o.id)} className="mt-1 accent-[rgb(var(--primary))]" />
                  <span>
                    <span className="block font-semibold">{o.title}</span>
                    <span className="text-muted">{o.body}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        )}
        {choice === 'new' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField className="sm:col-span-2" label="Full name" autoComplete="shipping name" error={e.fullName?.message} {...register('fullName')} />
            <TextField className="sm:col-span-2" label="Street address" autoComplete="shipping address-line1" error={e.line1?.message} {...register('line1')} />
            <TextField className="sm:col-span-2" label="Apartment, suite" optional autoComplete="shipping address-line2" {...register('line2')} />
            <TextField label="City" autoComplete="shipping address-level2" error={e.city?.message} {...register('city')} />
            <TextField label="State / region" autoComplete="shipping address-level1" error={e.region?.message} {...register('region')} />
            <TextField label="Postal code" autoComplete="shipping postal-code" error={e.postalCode?.message} {...register('postalCode')} />
            <TextField label="Country" autoComplete="shipping country-name" error={e.country?.message} {...register('country')} />
            <TextField className="sm:col-span-2" label="Phone for delivery" optional type="tel" autoComplete="shipping tel" {...register('phone')} />
          </div>
        )}
        <Button type="submit">Continue to shipping method</Button>
      </form>
    </StepCard>
  );
}

function MethodStep({ initial, onNext, member, balance }: { initial: ShippingMethodId; onNext: (m: ShippingMethodId) => void; member: boolean; balance: number }) {
  const items = useCart((s) => s.items);
  const promoCode = useCart((s) => s.promoCode);
  const [method, setMethod] = useState<ShippingMethodId>(initial);
  const options = (['standard', 'expedited'] as const).map((m) => ({ m, s: summarizeCart(items, lookupProduct, { member, promoCode, pointsBalance: balance, shippingMethod: m }) }));
  return (
    <StepCard title="Shipping method">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onNext(method);
        }}
        className="space-y-5"
      >
        <fieldset>
          <legend className="sr-only">Choose a shipping method</legend>
          <div className="space-y-3">
            {options.map(({ m, s }) => (
              <label key={m} className={cn('flex cursor-pointer gap-3 rounded-soft border p-4', method === m ? 'border-primary bg-tint' : 'border-line')}>
                <input type="radio" name="method" checked={method === m} onChange={() => setMethod(m)} className="mt-1 accent-[rgb(var(--primary))]" />
                <span className="flex-1">
                  <span className="flex justify-between font-semibold">
                    {SHIPPING_METHODS[m].label}
                    <span>{s.shipping === 0 ? 'Free' : money(s.shipping)}</span>
                  </span>
                  <span className="block text-sm text-muted">{SHIPPING_METHODS[m].blurb}</span>
                  <ul className="mt-2 space-y-0.5 text-xs text-muted">
                    {s.groups.map((g) => (
                      <li key={g.vendorId}>
                        {g.vendorName}: {g.estimateDays[0]}–{g.estimateDays[1]} business days · {g.shipping === 0 ? 'free' : money(g.shipping)}
                      </li>
                    ))}
                  </ul>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <p className="text-sm text-muted">Shipping is provided and covered by each vendor. Multi-vendor orders arrive as separate shipments.</p>
        <Button type="submit">Continue to payment</Button>
      </form>
    </StepCard>
  );
}

export default function Checkout() {
  const user = useAuth((s) => s.user);
  const loyalty = useLoyalty();
  const balance = loyalty.data?.balance ?? 0;
  const items = useCart((s) => s.items);
  const promoCode = useCart((s) => s.promoCode);
  const pointsToRedeem = useCart((s) => s.pointsToRedeem);
  const clear = useCart((s) => s.clear);
  const toast = useUI((s) => s.toast);
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('contact');
  const [done, setDone] = useState<Set<Step>>(new Set());
  const [email, setEmail] = useState(user?.email ?? '');
  const [address, setAddress] = useState<OrderAddress>();
  const [method, setMethod] = useState<ShippingMethodId>('standard');
  const [token, setToken] = useState<PaymentToken>();
  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState<string>();

  const summary = useCartSummary({ shippingMethod: method }, balance);

  const advance = (from: Step, to: Step) => {
    setDone((d) => new Set(d).add(from));
    setStep(to);
    requestAnimationFrame(() => document.getElementById('step-h')?.focus());
  };

  if (summary.groups.length === 0 && !placing) {
    return (
      <div className="container-hfe py-16">
        <Seo title="Checkout" />
        <EmptyState as="h1" icon="cart" title="Your cart is empty" body="Add something HarmFree before checking out." action={{ label: 'Browse the catalog', to: '/catalog' }} />
      </div>
    );
  }

  const place = async () => {
    if (!address || !token) return;
    setPlacing(true);
    setPlaceError(undefined);
    try {
      const order = await api.orders.place({ items, email, address, shippingMethod: method, promoCode, pointsToRedeem, paymentToken: token });
      clear();
      toast(`Order ${order.number} placed`);
      navigate(`/order/confirmation/${order.id}`, { replace: true });
    } catch (e) {
      const code = (e as ApiError).code as PaymentOutcome | undefined;
      setPlaceError(code && code in OUTCOME_MESSAGES ? OUTCOME_MESSAGES[code as Exclude<PaymentOutcome, 'approved'>] : (e as Error).message);
      setPlacing(false);
    }
  };

  return (
    <div className="container-hfe py-10">
      <Seo title="Checkout" />
      <div className="mb-2 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold sm:text-3xl">Checkout</h1>
        <Link to="/cart" className="text-sm font-medium">
          Back to cart
        </Link>
      </div>
      <Stepper current={step} done={done} onGo={setStep} />

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          {step === 'contact' && <ContactStep initial={email} onNext={(v) => { setEmail(v); advance('contact', 'address'); }} />}
          {step === 'address' && <AddressStep initial={address} onNext={(a) => { setAddress(a); advance('address', 'method'); }} />}
          {step === 'method' && <MethodStep initial={method} member={Boolean(user)} balance={balance} onNext={(m) => { setMethod(m); advance('method', 'payment'); }} />}
          {step === 'payment' && (
            <StepCard title="Payment">
              <PaymentForm
                defaultPostal={address?.postalCode}
                submitLabel="Review order"
                onToken={(t) => {
                  setToken(t);
                  setPlaceError(undefined);
                  advance('payment', 'review');
                }}
              />
            </StepCard>
          )}
          {step === 'review' && address && token && (
            <StepCard title="Review and place order">
              <div className="mb-6 flex justify-center rounded-card bg-tint py-4">
                <Mascot state="checkout" size={260} />
              </div>
              <FormError message={placeError} />
              {placeError && (
                <Button variant="secondary" size="sm" className="mt-3" onClick={() => setStep('payment')}>
                  Use a different card
                </Button>
              )}
              <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
                {[
                  ['Contact', email, 'contact'],
                  ['Ship to', `${address.fullName}, ${address.line1}${address.line2 ? `, ${address.line2}` : ''}, ${address.city}, ${address.region} ${address.postalCode}`, 'address'],
                  ['Payment', `${token.brand} •••• ${token.last4} · ${SHIPPING_METHODS[method].label}`, 'payment'],
                ].map(([k, v, s]) => (
                  <div key={k} className="rounded-soft border border-line p-4">
                    <dt className="flex justify-between font-semibold">
                      {k}
                      <button type="button" className="text-xs font-medium text-link hover:underline" onClick={() => setStep(s as Step)}>
                        Edit
                      </button>
                    </dt>
                    <dd className="mt-1 text-muted">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 space-y-4">
                {summary.groups.map((g) => (
                  <div key={g.vendorId} className="rounded-soft border border-line">
                    <p className="flex justify-between border-b border-line px-4 py-2.5 text-sm font-semibold">
                      <span>Shipment from {g.vendorName}</span>
                      <span className="font-normal text-muted">
                        {g.estimateDays[0]}–{g.estimateDays[1]} days · {g.shipping === 0 ? 'free' : money(g.shipping)}
                      </span>
                    </p>
                    <ul className="divide-y divide-line">
                      {g.lines.map((l) => (
                        <li key={`${l.item.productId}-${l.item.variantId}`} className="flex items-center gap-3 px-4 py-3 text-sm">
                          <span className="h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                            <ProductImage product={l.product} sizes="48px" />
                          </span>
                          <span className="flex-1">
                            {l.product.name}
                            {l.variantLabel && <span className="text-muted"> · {l.variantLabel}</span>}
                            <span className="block text-xs text-muted">Qty {l.item.qty}</span>
                          </span>
                          <span className="font-medium">{money(l.lineTotal)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-xs text-muted">
                By placing this order you agree to the <Link to="/policies/terms">Terms</Link>. Returns and warranties are handled by each vendor per the <Link to="/policies/returns">Returns Policy</Link>.
              </p>
              <Button size="lg" className="mt-4 w-full" loading={placing} onClick={place}>
                {placing ? 'Authorizing (simulated)…' : `Place order · ${money(summary.total)}`}
              </Button>
            </StepCard>
          )}
        </div>

        <aside aria-labelledby="co-summary" className="lg:sticky lg:top-24 lg:self-start">
          <div className="card space-y-4 p-6">
            <h2 id="co-summary" className="text-lg font-semibold">
              Order summary
            </h2>
            <ul className="space-y-2 text-sm">
              {summary.groups.flatMap((g) => g.lines).map((l) => (
                <li key={`${l.item.productId}-${l.item.variantId}`} className="flex justify-between gap-3">
                  <span className="truncate">
                    {l.item.qty} × {l.product.name}
                  </span>
                  <span className="shrink-0">{money(l.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <SummaryRows summary={summary} />
            <EarnLine summary={summary} member={Boolean(user)} />
            {!promoCode && (
              <p className="text-xs text-muted">
                Have a promo code? Add it in your <Link to="/cart">cart</Link>.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
