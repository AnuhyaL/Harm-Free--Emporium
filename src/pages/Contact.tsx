import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { api } from '@/api';
import { Mascot } from '@/components/brand/Mascot';
import { Button, Icon, PageHeader, SelectField, Seo, TextArea, TextField } from '@/components/ui';
import { ORG } from '@/data';
import { useAuth } from '@/store';

const TOPICS = [
  { value: 'order', label: 'An order or delivery' },
  { value: 'return', label: 'A return or warranty' },
  { value: 'product', label: 'A product question' },
  { value: 'rewards', label: 'Rewards or EarthCoin' },
  { value: 'vendor', label: 'Selling on HarmFree' },
  { value: 'other', label: 'Something else' },
];

const schema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.'),
  email: z.string().trim().email('Enter a valid email address.'),
  topic: z.string().min(1),
  orderNumber: z.string().trim().optional(),
  message: z.string().trim().min(10, 'Tell us a little more (at least 10 characters).').max(2000),
});
type Values = z.infer<typeof schema>;

export default function Contact() {
  const user = useAuth((s) => s.user);
  const [ticket, setTicket] = useState<string>();
  const { register, handleSubmit, watch, formState } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: user ? `${user.firstName} ${user.lastName}` : '', email: user?.email ?? '', topic: 'order' },
  });
  const topic = watch('topic');

  return (
    <>
      <Seo title="Contact us & Customer Care" description="Reach HarmFree Emporium Customer Care about orders, returns, rewards or selling with us." />
      <PageHeader eyebrow="Customer Care" title="How can we help?" intro="We answer within one business day. For returns and warranties, we route your request to the vendor for you." crumbs={[{ label: 'Contact' }]} />
      <div className="container-hfe grid gap-10 py-14 lg:grid-cols-[1.4fr_1fr]">
        <div className="card p-6 sm:p-8">
          {ticket ? (
            <div role="status" className="flex flex-col items-center py-8 text-center">
              <Mascot state="success" size={140} />
              <h2 className="mt-4 text-2xl font-semibold">Message received</h2>
              <p className="mt-2 text-muted">
                Your reference is <strong className="text-fg">{ticket}</strong>. (Demo: no email is sent.)
              </p>
            </div>
          ) : (
            <form noValidate className="grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit(async (v) => setTicket((await api.forms.contact({ ...v, message: v.orderNumber ? `[${v.orderNumber}] ${v.message}` : v.message })).ticket))}>
              <TextField label="Your name" autoComplete="name" error={formState.errors.name?.message} {...register('name')} />
              <TextField label="Email" type="email" autoComplete="email" error={formState.errors.email?.message} {...register('email')} />
              <SelectField label="Topic" options={TOPICS} className="sm:col-span-2" {...register('topic')} />
              {(topic === 'order' || topic === 'return') && (
                <TextField label="Order number" optional placeholder="HFE-100418" className="sm:col-span-2" {...register('orderNumber')} />
              )}
              <TextArea label="Message" rows={6} className="sm:col-span-2" error={formState.errors.message?.message} {...register('message')} />
              {topic === 'return' && (
                <p className="text-sm text-muted sm:col-span-2">
                  Tip: signed-in customers can start a return directly from <Link to="/account/orders">their order page</Link>.
                </p>
              )}
              <Button type="submit" loading={formState.isSubmitting} className="sm:col-span-2 sm:justify-self-start">
                Send message
              </Button>
            </form>
          )}
        </div>
        <aside className="space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold">Reach us directly</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Icon name="mail" /> <a href={`mailto:${ORG.email}`}>{ORG.email}</a>
              </li>
              <li className="flex items-center gap-3">
                <Icon name="phone" /> <a href={`tel:${ORG.phoneHref}`}>{ORG.phone}</a>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="pin" className="shrink-0" />
                <address className="not-italic">
                  {ORG.address.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </address>
              </li>
            </ul>
          </div>
          <div className="card p-6">
            <h2 className="text-lg font-semibold">Quick answers</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/faq">Frequently asked questions</Link></li>
              <li><Link to="/account/orders">Track an order</Link></li>
              <li><Link to="/policies/returns">Returns go to the vendor</Link></li>
              <li><Link to="/policies/warranty">Warranty policy</Link></li>
            </ul>
          </div>
          <div className="rounded-card border border-dashed border-line p-5 text-sm text-muted">
            <p className="font-semibold text-fg">Live chat</p>
            <p className="mt-1">Chat support is planned for a later phase. Until then, the form reaches the same team.</p>
          </div>
        </aside>
      </div>
    </>
  );
}
