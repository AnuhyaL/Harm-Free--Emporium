import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { api } from '@/api';
import { Breadcrumbs, Button, ButtonLink, EmptyState, ErrorState, FormError, Icon, PageSkeleton, SelectField, Seo, TextArea } from '@/components/ui';
import { vendorById } from '@/data';
import { cn } from '@/lib/format';
import { useAsync, useNow } from '@/lib/hooks';
import { returnDaysLeft } from '@/lib/orders';
import type { ReturnRequest as RR, ReturnResolution } from '@/types';

const REASONS = [
  { value: 'defective', label: 'Arrived damaged or defective' },
  { value: 'not_as_described', label: 'Not as described' },
  { value: 'wrong_item', label: 'Wrong item or option' },
  { value: 'no_longer_needed', label: 'No longer needed' },
  { value: 'warranty', label: 'Stopped working (warranty)' },
  { value: 'other', label: 'Other' },
];

const RESOLUTIONS: { value: ReturnResolution; label: string; body: string }[] = [
  { value: 'refund', label: 'Refund', body: 'To your original payment method, issued by the vendor.' },
  { value: 'replacement', label: 'Replacement', body: 'The vendor ships a new unit.' },
  { value: 'store_credit', label: 'Vendor credit', body: 'Credit with this vendor, often faster.' },
  { value: 'warranty_repair', label: 'Warranty repair', body: 'Repair or refurbishment under the vendor’s warranty.' },
];

const schema = z.object({
  lines: z.record(z.string(), z.coerce.number().int().min(0)).refine((r) => Object.values(r).some((n) => n > 0), 'Choose at least one item to return.'),
  reason: z.string().min(1),
  details: z.string().trim().min(10, 'Tell the vendor a bit more (at least 10 characters).').max(1500),
  resolution: z.enum(['refund', 'replacement', 'store_credit', 'warranty_repair']),
});
type Values = z.infer<typeof schema>;

export default function ReturnRequest() {
  const { id = '' } = useParams();
  const [params] = useSearchParams();
  const now = useNow();
  const order = useAsync(() => api.orders.get(id), [id]);
  const [done, setDone] = useState<RR>();
  const [error, setError] = useState<string>();

  const eligible = useMemo(() => order.data?.shipments.filter((s) => (returnDaysLeft(s, now) ?? 0) > 0) ?? [], [order.data, now]);
  const [shipmentId, setShipmentId] = useState<string>();
  const shipment = eligible.find((s) => s.id === (shipmentId ?? params.get('shipment'))) ?? eligible[0];

  const { register, handleSubmit, watch, formState } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { reason: 'defective', resolution: 'refund', lines: {} },
    shouldUnregister: true,
  });
  const resolution = watch('resolution');

  if (order.error) return <ErrorState error={order.error} onRetry={order.reload} />;
  if (!order.data) return <PageSkeleton />;
  const o = order.data;
  const vendor = shipment ? vendorById(shipment.vendorId) : undefined;

  if (done) {
    return (
      <div className="card mx-auto max-w-2xl p-8 text-center" role="status">
        <Seo title="Return requested" />
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-tint">
          <Icon name="refresh" size={28} />
        </span>
        <h1 className="mt-4 text-2xl font-semibold">Return forwarded to {done.vendorName}</h1>
        <p className="mt-2 text-muted">
          Your return authorization is <strong className="text-fg">{done.rmaNumber}</strong>. {done.vendorName} will email return instructions and a prepaid label where applicable, then issue your {RESOLUTIONS.find((r) => r.value === done.resolution)?.label.toLowerCase()}. (Demo: no email is sent.)
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <ButtonLink to={`/account/orders/${o.id}`}>Back to order</ButtonLink>
          <ButtonLink to="/policies/returns" variant="secondary">
            Returns policy
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Seo title={`Return items from ${o.number}`} />
      <Breadcrumbs items={[{ label: 'Orders', to: '/account/orders' }, { label: o.number, to: `/account/orders/${o.id}` }, { label: 'Return' }]} />
      <h1 className="text-2xl font-semibold">Start a return</h1>
      <div className="mt-4 flex items-start gap-3 rounded-soft border border-gold/70 bg-tint p-4 text-sm">
        <Icon name="info" size={18} className="mt-0.5 shrink-0" />
        <p>
          Returns route to the original manufacturer (OEM) / vendor. The vendor covers return shipping for defects and issues any refund, credit, replacement or warranty repair. HarmFree Emporium forwards your request and stays available if you need help.
        </p>
      </div>

      {eligible.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon="package"
            title="Nothing eligible to return yet"
            body="Returns open once a shipment is delivered and close when the vendor’s return window ends. Warranty claims can still go to the vendor."
            action={{ label: 'Back to order', to: `/account/orders/${o.id}` }}
          />
        </div>
      ) : (
        <form
          noValidate
          className="mt-6 space-y-6"
          onSubmit={handleSubmit(async (v) => {
            if (!shipment) return;
            setError(undefined);
            try {
              const lines = Object.entries(v.lines)
                .filter(([, q]) => q > 0)
                .map(([productId, qty]) => ({ productId, qty }));
              setDone(await api.returns.create({ orderId: o.id, shipmentId: shipment.id, lines, reason: REASONS.find((r) => r.value === v.reason)!.label, details: v.details, resolution: v.resolution }));
            } catch (e) {
              setError((e as Error).message);
            }
          })}
        >
          <FormError message={error} />
          {eligible.length > 1 && (
            <SelectField
              label="Which shipment?"
              value={shipment?.id}
              onChange={(e) => setShipmentId(e.target.value)}
              options={eligible.map((s) => ({ value: s.id, label: `${s.vendorName} · ${s.lines.length} item(s)` }))}
            />
          )}
          {shipment && (
            <fieldset className="card p-5">
              <legend className="sr-only">Items</legend>
              <p className="mb-3 text-sm font-semibold">
                Items from {shipment.vendorName} · {returnDaysLeft(shipment, now)} days left in the return window
              </p>
              <ul className="divide-y divide-line">
                {shipment.lines.map((l) => (
                  <li key={l.productId} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                    <span>
                      {l.name}
                      {l.variantLabel && <span className="text-muted"> · {l.variantLabel}</span>}
                    </span>
                    <label className="flex items-center gap-2">
                      <span className="text-muted">Return qty</span>
                      <select className="input h-9 w-20 py-0" defaultValue={0} {...register(`lines.${l.productId}` as const)}>
                        {Array.from({ length: l.qty + 1 }).map((_, n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </label>
                  </li>
                ))}
              </ul>
              {formState.errors.lines && (
                <p role="alert" className="mt-2 text-xs text-danger">
                  {String(formState.errors.lines.message ?? formState.errors.lines.root?.message ?? 'Choose at least one item to return.')}
                </p>
              )}
            </fieldset>
          )}
          <SelectField label="Reason" options={REASONS} {...register('reason')} />
          <TextArea label="Details for the vendor" rows={4} error={formState.errors.details?.message} {...register('details')} />
          <fieldset>
            <legend className="label">Preferred resolution</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {RESOLUTIONS.map((r) => (
                <label key={r.value} className={cn('flex cursor-pointer gap-3 rounded-soft border p-4 text-sm', resolution === r.value ? 'border-primary bg-tint' : 'border-line')}>
                  <input type="radio" value={r.value} {...register('resolution')} className="mt-1 accent-[rgb(var(--primary))]" />
                  <span>
                    <span className="block font-semibold">{r.label}</span>
                    <span className="text-muted">{r.body}</span>
                  </span>
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted">The final resolution is decided by the vendor under its published policy.</p>
          </fieldset>
          {vendor && (
            <p className="text-sm text-muted">
              {vendor.name} policy: {vendor.returnPolicy} Warranty contact: {vendor.warrantyContact}. <Link to={`/brands/${vendor.slug}`}>Vendor storefront</Link>
            </p>
          )}
          <Button type="submit" size="lg" loading={formState.isSubmitting}>
            Send return request to {shipment?.vendorName}
          </Button>
        </form>
      )}
    </div>
  );
}
