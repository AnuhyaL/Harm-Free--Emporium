import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { api, isDemoUser, resetDemoData } from '@/api';
import { Button, Checkbox, EmptyState, FormError, Icon, Seo, TextField } from '@/components/ui';
import { Modal } from '@/components/ui/Dialog';
import { useAuth, useUI } from '@/store';
import type { Address } from '@/types';

const profileSchema = z.object({
  firstName: z.string().trim().min(1, 'Required.'),
  lastName: z.string().trim().min(1, 'Required.'),
  email: z.string().trim().email('Enter a valid email address.'),
  marketingOptIn: z.boolean(),
});

export const addressSchema = z.object({
  label: z.string().trim().min(1, 'Give this address a label.'),
  fullName: z.string().trim().min(2, 'Enter the recipient name.'),
  line1: z.string().trim().min(3, 'Enter a street address.'),
  line2: z.string().trim().optional(),
  city: z.string().trim().min(2, 'Enter a city.'),
  region: z.string().trim().min(2, 'Enter a state or region.'),
  postalCode: z.string().trim().regex(/^[A-Za-z0-9 -]{3,10}$/, 'Enter a valid postal code.'),
  country: z.string().trim().min(2, 'Enter a country.'),
  phone: z.string().trim().optional(),
  isDefault: z.boolean(),
});
type AddressValues = z.infer<typeof addressSchema>;

function AddressForm({ initial, onSaved }: { initial?: Address; onSaved: () => void }) {
  const setUser = useAuth((s) => s.setUser);
  const [error, setError] = useState<string>();
  const { register, handleSubmit, formState } = useForm<AddressValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: initial ?? { label: 'Home', country: 'United States', isDefault: false },
  });
  const e = formState.errors;
  return (
    <form
      noValidate
      className="mt-4 grid gap-4 sm:grid-cols-2"
      onSubmit={handleSubmit(async (v) => {
        try {
          setUser(await api.auth.saveAddress({ ...v, id: initial?.id }));
          onSaved();
        } catch (err) {
          setError((err as Error).message);
        }
      })}
    >
      <div className="sm:col-span-2">
        <FormError message={error} />
      </div>
      <TextField label="Label" placeholder="Home, Studio…" error={e.label?.message} {...register('label')} />
      <TextField label="Full name" autoComplete="name" error={e.fullName?.message} {...register('fullName')} />
      <TextField className="sm:col-span-2" label="Street address" autoComplete="address-line1" error={e.line1?.message} {...register('line1')} />
      <TextField className="sm:col-span-2" label="Apartment, suite" optional autoComplete="address-line2" {...register('line2')} />
      <TextField label="City" autoComplete="address-level2" error={e.city?.message} {...register('city')} />
      <TextField label="State / region" autoComplete="address-level1" error={e.region?.message} {...register('region')} />
      <TextField label="Postal code" autoComplete="postal-code" error={e.postalCode?.message} {...register('postalCode')} />
      <TextField label="Country" autoComplete="country-name" error={e.country?.message} {...register('country')} />
      <TextField className="sm:col-span-2" label="Phone" optional type="tel" autoComplete="tel" {...register('phone')} />
      <Checkbox className="sm:col-span-2" label="Make this my default address" {...register('isDefault')} />
      <Button type="submit" loading={formState.isSubmitting} className="sm:col-span-2 sm:justify-self-start">
        Save address
      </Button>
    </form>
  );
}

export default function Settings() {
  const user = useAuth((s) => s.user)!;
  const setUser = useAuth((s) => s.setUser);
  const toast = useUI((s) => s.toast);
  const [editing, setEditing] = useState<Address | 'new' | null>(null);
  const [error, setError] = useState<string>();
  const [confirmReset, setConfirmReset] = useState(false);
  const { register, handleSubmit, formState } = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: { firstName: user.firstName, lastName: user.lastName, email: user.email, marketingOptIn: user.marketingOptIn },
  });

  return (
    <div className="space-y-8">
      <Seo title="Profile & addresses" />
      <h1 className="text-2xl font-semibold">Profile & addresses</h1>

      <section aria-labelledby="profile-h" className="card p-6">
        <h2 id="profile-h" className="text-lg font-semibold">
          Profile
        </h2>
        <form
          noValidate
          className="mt-4 grid gap-4 sm:grid-cols-2"
          onSubmit={handleSubmit(async (v) => {
            setError(undefined);
            try {
              setUser(await api.auth.updateProfile(v));
              toast('Profile saved');
            } catch (err) {
              setError((err as Error).message);
            }
          })}
        >
          <div className="sm:col-span-2">
            <FormError message={error} />
          </div>
          <TextField label="First name" autoComplete="given-name" error={formState.errors.firstName?.message} {...register('firstName')} />
          <TextField label="Last name" autoComplete="family-name" error={formState.errors.lastName?.message} {...register('lastName')} />
          <TextField className="sm:col-span-2" label="Email" type="email" autoComplete="email" error={formState.errors.email?.message} {...register('email')} />
          <Checkbox className="sm:col-span-2" label="Email me new HarmFree finds and refill reminders" {...register('marketingOptIn')} />
          <Button type="submit" loading={formState.isSubmitting} className="sm:col-span-2 sm:justify-self-start">
            Save profile
          </Button>
        </form>
      </section>

      <section aria-labelledby="addr-h" className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="addr-h" className="text-lg font-semibold">
            Addresses
          </h2>
          <Button variant="secondary" size="sm" onClick={() => setEditing('new')}>
            <Icon name="plus" size={16} /> Add address
          </Button>
        </div>
        {user.addresses.length === 0 ? (
          <div className="mt-4">
            <EmptyState icon="pin" title="No saved addresses" body="Add one to speed through checkout." />
          </div>
        ) : (
          <ul className="mt-4 grid gap-4 md:grid-cols-2">
            {user.addresses.map((a) => (
              <li key={a.id} className="rounded-soft border border-line p-4">
                <p className="flex items-center gap-2 font-semibold">
                  {a.label}
                  {a.isDefault && <span className="chip">Default</span>}
                </p>
                <address className="mt-1 text-sm not-italic text-muted">
                  {a.fullName}
                  <br />
                  {a.line1}
                  {a.line2 && `, ${a.line2}`}
                  <br />
                  {a.city}, {a.region} {a.postalCode}
                  <br />
                  {a.country}
                </address>
                <div className="mt-3 flex gap-3 text-sm">
                  <button type="button" className="font-medium text-link hover:underline" onClick={() => setEditing(a)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="font-medium text-muted hover:text-danger hover:underline"
                    onClick={async () => {
                      setUser(await api.auth.deleteAddress(a.id));
                      toast('Address removed');
                    }}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="demo-h" className="rounded-card border border-dashed border-line p-6">
        <h2 id="demo-h" className="text-lg font-semibold">
          Demo data
        </h2>
        <p className="mt-1 text-sm text-muted">
          Everything in this account lives in your browser’s local storage. Reset restores the seeded demo account, orders and points{isDemoUser(user) ? '' : ' and removes accounts created here'}.
        </p>
        <Button variant="danger" size="sm" className="mt-4" onClick={() => setConfirmReset(true)}>
          Reset demo data
        </Button>
      </section>

      <Modal open={editing !== null} onOpenChange={(o) => !o && setEditing(null)} title={editing === 'new' ? 'Add address' : 'Edit address'}>
        {editing !== null && <AddressForm initial={editing === 'new' ? undefined : editing} onSaved={() => { setEditing(null); toast('Address saved'); }} />}
      </Modal>
      <Modal open={confirmReset} onOpenChange={setConfirmReset} title="Reset demo data?" description="This signs you out and restores the original demo data. Your cart and wishlist are kept.">
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setConfirmReset(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              resetDemoData();
              window.location.assign('/login');
            }}
          >
            Reset
          </Button>
        </div>
      </Modal>
    </div>
  );
}
