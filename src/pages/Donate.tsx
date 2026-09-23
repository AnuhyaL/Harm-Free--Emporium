import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, ApiError } from '@/api';
import { Mascot } from '@/components/brand/Mascot';
import { PaymentForm } from '@/components/cart/PaymentForm';
import { EarthCoinArt } from '@/components/content/ContentBits';
import { ButtonLink, Checkbox, FormError, PageHeader, Seo, TextField } from '@/components/ui';
import { ORG, REWARDS } from '@/data';
import { cn, money } from '@/lib/format';
import { OUTCOME_MESSAGES, type PaymentOutcome } from '@/lib/payment';
import { useAuth } from '@/store';
import type { Donation, EarthCoinEntitlement } from '@/types';

const AMOUNTS = [15, 30, 50, 100, 250];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Donate() {
  const user = useAuth((s) => s.user);
  const [amount, setAmount] = useState(50);
  const [custom, setCustom] = useState('');
  const [recurring, setRecurring] = useState(false);
  const [email, setEmail] = useState(user?.email ?? '');
  const [dedication, setDedication] = useState('');
  const [error, setError] = useState<string>();
  const [emailError, setEmailError] = useState<string>();
  const [result, setResult] = useState<{ donation: Donation; earthCoin?: EarthCoinEntitlement; earnsWhenSignedIn: boolean }>();

  const value = custom ? Number(custom) : amount;
  const validAmount = Number.isFinite(value) && value >= 5 && value <= 10000;
  const earns = value >= REWARDS.earthCoinDonationMin;

  if (result) {
    const d = result.donation;
    return (
      <div className="container-hfe py-14">
        <Seo title="Thank you" />
        <div role="status" className="card mx-auto max-w-2xl p-8 text-center sm:p-12">
          <div className="flex items-center justify-center gap-4">
            <Mascot state="success" size={140} />
            {result.earthCoin && <EarthCoinArt size={110} serial={result.earthCoin.serial} />}
          </div>
          <h1 className="mt-4 text-2xl font-semibold">Thank you for your {money(d.amount)} {d.recurring ? 'monthly ' : ''}gift</h1>
          <p className="mt-2 text-muted">
            Receipt <strong className="text-fg">{d.receiptNumber}</strong> for {ORG.parent}, a 501(c)(3) non-profit. (Demo: no payment was collected and no receipt email is sent.)
          </p>
          {result.earthCoin && <p className="mt-3 font-semibold text-success">EarthCoin {result.earthCoin.serial} recorded to your account.</p>}
          {result.earnsWhenSignedIn && (
            <p className="mt-3 text-sm">
              This gift qualifies for an EarthCoin. <Link to="/signup">Create an account</Link> before your next gift so we can record it.
            </p>
          )}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {user && <ButtonLink to="/account/rewards#earthcoin">View my EarthCoins</ButtonLink>}
            <ButtonLink to="/catalog" variant="secondary">
              Shop the Emporium
            </ButtonLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Seo title="Donate" description="Support Green2Gold, the 501(c)(3) non-profit behind HarmFree Emporium. Gifts of $30+ earn an EarthCoin." />
      <PageHeader
        eyebrow="Donate"
        title="Grow the HarmFree movement"
        intro={`Your tax-deductible gift supports ${ORG.parent}’s scientific, educational and R&D work incubating green technology. Gifts of $${REWARDS.earthCoinDonationMin} or more earn an EarthCoin.`}
        crumbs={[{ label: 'Donate' }]}
      />
      <div className="container-hfe grid gap-10 py-12 lg:grid-cols-[1.3fr_1fr]">
        <div className="card space-y-6 p-6 sm:p-8">
          <FormError message={error} />
          <fieldset>
            <legend className="label">Choose an amount</legend>
            <div className="flex flex-wrap gap-2">
              {AMOUNTS.map((a) => (
                <button
                  key={a}
                  type="button"
                  aria-pressed={!custom && amount === a}
                  onClick={() => {
                    setAmount(a);
                    setCustom('');
                  }}
                  className={cn('h-11 min-w-[72px] rounded-full border px-4 text-sm font-semibold', !custom && amount === a ? 'border-primary bg-primary text-primary-fg' : 'border-line bg-surface hover:bg-tint')}
                >
                  ${a}
                </button>
              ))}
              <label className="flex h-11 items-center gap-1 rounded-full border border-line bg-surface px-4 text-sm focus-within:ring-2 focus-within:ring-link/40">
                <span className="text-muted">$</span>
                <span className="sr-only">Custom amount</span>
                <input inputMode="decimal" value={custom} onChange={(e) => setCustom(e.target.value.replace(/[^\d.]/g, ''))} placeholder="Other" className="w-20 bg-transparent focus:outline-none" />
              </label>
            </div>
            {!validAmount && <p role="alert" className="mt-2 text-xs text-danger">Enter an amount between $5 and $10,000.</p>}
            <p className={cn('mt-3 text-sm', earns ? 'text-success' : 'text-muted')}>
              {earns ? `This gift earns an EarthCoin${user ? '' : ' (sign in to record it)'}.` : `Give $${REWARDS.earthCoinDonationMin} or more to earn an EarthCoin.`}
            </p>
          </fieldset>
          <Checkbox label="Make this a monthly gift" checked={recurring} onChange={(e) => setRecurring(e.target.checked)} />
          <TextField
            label="Email for your receipt"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
          />
          <TextField label="Dedicate this gift" optional placeholder="In honor of…" value={dedication} onChange={(e) => setDedication(e.target.value)} />
          <PaymentForm
            submitLabel={`Donate ${validAmount ? money(value) : ''}${recurring ? ' monthly' : ''}`}
            onToken={async (token) => {
              setError(undefined);
              if (!EMAIL_RE.test(email.trim())) {
                setEmailError('Enter a valid email address.');
                return;
              }
              setEmailError(undefined);
              if (!validAmount) return;
              try {
                setResult(await api.donations.create({ amount: value, recurring, email: email.trim(), dedication: dedication || undefined, paymentToken: token }));
              } catch (e) {
                const code = (e as ApiError).code as Exclude<PaymentOutcome, 'approved'> | undefined;
                setError(code && OUTCOME_MESSAGES[code] ? OUTCOME_MESSAGES[code] : (e as Error).message);
              }
            }}
          />
        </div>
        <aside className="space-y-6">
          <div className="flex flex-col items-center rounded-card bg-navy p-8 text-center text-paper">
            <EarthCoinArt size={150} />
            <p className="mt-4 font-display text-xl font-semibold">Earn an EarthCoin</p>
            <p className="mt-1 text-sm text-paper/80">A recognition token recorded to your account. No wallet or crypto required.</p>
            <Link to="/earthcoin" className="mt-3 text-sm font-semibold text-gold">
              The EarthCoin story
            </Link>
          </div>
          <div className="card p-6 text-sm">
            <p className="font-semibold">Where your gift goes</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
              <li>Vetting products against the HarmFree Standard</li>
              <li>Incubating early-stage green technology</li>
              <li>Education through Regen Media and Digital Regeneration World Magazine</li>
            </ul>
            <p className="mt-3 text-xs text-muted">
              {ORG.parent} is a 501(c)(3) non-profit. Donations are tax-deductible to the extent allowed by law.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
