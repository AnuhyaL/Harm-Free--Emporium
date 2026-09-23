import { zodResolver } from '@hookform/resolvers/zod';
import { useState, type ReactNode } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { api } from '@/api';
import { Mascot } from '@/components/brand/Mascot';
import { Button, ButtonLink, Checkbox, FormError, Icon, PageHeader, Seo, TextArea, TextField } from '@/components/ui';
import { categories, PILLARS } from '@/data';

const MAX_MB = 10;
const fileList = (required: boolean, label: string) =>
  z
    .custom<FileList | undefined>()
    .refine((f) => !required || (f && f.length > 0), `Please attach your ${label}.`)
    .refine((f) => !f || Array.from(f).every((x) => x.size <= MAX_MB * 1024 * 1024), `Each file must be under ${MAX_MB} MB.`)
    .refine(
      (f) => !f || Array.from(f).every((x) => /\.(pdf|png|jpe?g|webp|docx?)$/i.test(x.name)),
      'Accepted formats: PDF, PNG, JPG, WEBP, DOC, DOCX.',
    );

const schema = z.object({
  company: z.string().trim().min(2, 'Company name is required.'),
  website: z.string().trim().url('Enter a full URL, e.g. https://example.com').or(z.literal('')),
  contactName: z.string().trim().min(2, 'Contact name is required.'),
  email: z.string().trim().email('Enter a valid email address.'),
  phone: z.string().trim().min(7, 'Enter a phone number.'),
  location: z.string().trim().min(2, 'Where are you based?'),
  founded: z.coerce.number({ invalid_type_error: 'Enter a year.' }).int().min(1800, 'Enter a valid year.').max(new Date().getFullYear(), 'Enter a valid year.'),
  productLines: z.string().trim().min(20, 'Describe your product lines (at least 20 characters).'),
  categories: z.array(z.string()).min(1, 'Choose at least one category.'),
  certifications: z
    .array(z.object({ name: z.string().trim().min(2, 'Name required.'), issuer: z.string().trim().min(2, 'Issuer required.'), id: z.string().trim().min(2, 'Certificate ID required.') }))
    .min(1, 'Add at least one certification.'),
  validationReports: fileList(false, 'validation reports'),
  labResults: fileList(true, 'lab results'),
  endorsements: z.string().trim().max(2000).optional(),
  manufacturing: z.string().trim().min(40, 'Describe your manufacturing process (at least 40 characters).'),
  packaging: z.string().trim().min(20, 'Describe packaging and end-of-life (at least 20 characters).'),
  sellSheet: fileList(true, 'sell sheet'),
  ackVendorCovers: z.literal(true, { errorMap: () => ({ message: 'Required to sell on HarmFree Emporium.' }) }),
  ackNotLiable: z.literal(true, { errorMap: () => ({ message: 'Required to sell on HarmFree Emporium.' }) }),
  ackAccuracy: z.literal(true, { errorMap: () => ({ message: 'Please confirm.' }) }),
});
type Values = z.infer<typeof schema>;

function Block({ n, title, intro, children }: { n: number; title: string; intro?: string; children: ReactNode }) {
  return (
    <fieldset className="card p-6 sm:p-8">
      <legend className="sr-only">{title}</legend>
      <div className="mb-6 flex items-start gap-4">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-primary-fg" aria-hidden>
          {n}
        </span>
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          {intro && <p className="mt-1 text-sm text-muted">{intro}</p>}
        </div>
      </div>
      {children}
    </fieldset>
  );
}

export default function VendorApply() {
  const [reference, setReference] = useState<string>();
  const [submitError, setSubmitError] = useState<string>();
  const { register, control, handleSubmit, formState } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { website: '', categories: [], certifications: [{ name: '', issuer: '', id: '' }] },
  });
  const certs = useFieldArray({ control, name: 'certifications' });
  const e = formState.errors;

  if (reference) {
    return (
      <div className="container-hfe py-16">
        <Seo title="Application received" />
        <div role="status" className="card mx-auto flex max-w-xl flex-col items-center p-10 text-center">
          <Mascot state="success" size={150} />
          <h1 className="mt-4 text-2xl font-semibold">Application received</h1>
          <p className="mt-2 text-muted">
            Reference <strong className="text-fg">{reference}</strong>. The vetting team reviews applications against all five pillars of the HarmFree Standard. (Demo: nothing was uploaded or sent.)
          </p>
          <ButtonLink to="/standard" variant="secondary" className="mt-6">
            Review the Standard
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <>
      <Seo title="Sell on HarmFree Emporium" description="Apply to list your products. Every product is reviewed against the five pillars of the HarmFree Standard." />
      <PageHeader
        eyebrow="Vendor application"
        title="Bring your HarmFree products to the Emporium"
        intro="Tell us about your company, your products and the proof behind them. Approved products earn the HarmFree Global Seal of Approval and a place in the Regen Media family."
        crumbs={[{ label: 'Sell with us' }]}
      />
      <form
        noValidate
        className="container-hfe max-w-4xl space-y-6 py-12"
        onSubmit={handleSubmit(
          async (v) => {
            setSubmitError(undefined);
            try {
              setReference((await api.forms.vendorApplication({ company: v.company, email: v.email })).reference);
            } catch (err) {
              setSubmitError((err as Error).message);
            }
          },
          () => setSubmitError('Please fix the highlighted fields below.'),
        )}
      >
        <FormError message={submitError} />

        <Block n={1} title="Company information">
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField label="Company name" autoComplete="organization" error={e.company?.message} {...register('company')} />
            <TextField label="Website" type="url" placeholder="https://" optional error={e.website?.message} {...register('website')} />
            <TextField label="Contact name" autoComplete="name" error={e.contactName?.message} {...register('contactName')} />
            <TextField label="Email" type="email" autoComplete="email" error={e.email?.message} {...register('email')} />
            <TextField label="Phone" type="tel" autoComplete="tel" error={e.phone?.message} {...register('phone')} />
            <TextField label="City, country" error={e.location?.message} {...register('location')} />
            <TextField label="Year founded" inputMode="numeric" error={e.founded?.message} {...register('founded')} />
          </div>
        </Block>

        <Block n={2} title="Product lines" intro="What you would like to list, and where it fits in our catalog.">
          <TextArea label="Product lines" rows={4} placeholder="e.g. Refillable glass cleaning kits, concentrated tablets in 3 formulas…" error={e.productLines?.message} {...register('productLines')} />
          <fieldset className="mt-5">
            <legend className="label">Categories</legend>
            <div className="grid max-h-64 gap-2 overflow-y-auto rounded-soft border border-line p-3 sm:grid-cols-2">
              {categories.map((c) => (
                <Checkbox key={c.slug} label={c.name} value={c.name} {...register('categories')} />
              ))}
            </div>
            {e.categories && (
              <p role="alert" className="mt-1 text-xs font-medium text-danger">
                {e.categories.message}
              </p>
            )}
          </fieldset>
        </Block>

        <Block n={3} title="Certifications, validation & lab results" intro={PILLARS[2].summary}>
          <ul className="space-y-4">
            {certs.fields.map((f, i) => (
              <li key={f.id} className="grid items-start gap-3 rounded-soft border border-line p-4 sm:grid-cols-[1fr_1fr_1fr_auto]">
                <TextField label="Certification" error={e.certifications?.[i]?.name?.message} {...register(`certifications.${i}.name`)} />
                <TextField label="Issuer" error={e.certifications?.[i]?.issuer?.message} {...register(`certifications.${i}.issuer`)} />
                <TextField label="Certificate ID" error={e.certifications?.[i]?.id?.message} {...register(`certifications.${i}.id`)} />
                <Button variant="ghost" size="sm" className="mt-7" onClick={() => certs.remove(i)} disabled={certs.fields.length === 1} aria-label={`Remove certification ${i + 1}`}>
                  <Icon name="trash" size={16} />
                </Button>
              </li>
            ))}
          </ul>
          {e.certifications?.message && <p role="alert" className="mt-1 text-xs text-danger">{e.certifications.message}</p>}
          <Button variant="secondary" size="sm" className="mt-3" onClick={() => certs.append({ name: '', issuer: '', id: '' })}>
            <Icon name="plus" size={16} /> Add certification
          </Button>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <TextField label="Lab results" type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx" hint={`PDF, image or Word, up to ${MAX_MB} MB each`} error={e.labResults?.message as string | undefined} {...register('labResults')} />
            <TextField label="Validation reports" optional type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx" error={e.validationReports?.message as string | undefined} {...register('validationReports')} />
          </div>
          <TextArea className="mt-5" label="Endorsements" optional rows={3} placeholder="Awards, expert endorsements, press…" {...register('endorsements')} />
        </Block>

        <Block n={4} title="Manufacturing, packaging & end-of-life">
          <TextArea label="Manufacturing process" rows={4} placeholder="Where and how products are made, energy and water sources, worker safety…" error={e.manufacturing?.message} {...register('manufacturing')} />
          <TextArea className="mt-5" label="Packaging & end-of-life" rows={3} placeholder="Packaging materials, recycled content, take-back or refill programs…" error={e.packaging?.message} {...register('packaging')} />
          <TextField className="mt-5" label="Sell sheet" type="file" accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx" hint="Include pricing, MSRP, dimensions and product imagery." error={e.sellSheet?.message as string | undefined} {...register('sellSheet')} />
        </Block>

        <Block n={5} title="Collaboration agreement" intro="These mirror the HFE collaboration letter.">
          <div className="space-y-4">
            <Checkbox label="We provide and cover shipping, returns, replacements and warranties for every product we sell on HarmFree Emporium." error={e.ackVendorCovers?.message} {...register('ackVendorCovers')} />
            <Checkbox label="We understand HarmFree Emporium is the storefront and vetting body and is not the liable party for our products." error={e.ackNotLiable?.message} {...register('ackNotLiable')} />
            <Checkbox label="The information and documents in this application are accurate, and we will notify HFE of any formula, supplier or certification change." error={e.ackAccuracy?.message} {...register('ackAccuracy')} />
          </div>
        </Block>

        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" size="lg" loading={formState.isSubmitting}>
            Submit application
          </Button>
          <p className="text-sm text-muted">Demo: files stay in your browser and are not uploaded.</p>
        </div>
      </form>
    </>
  );
}
