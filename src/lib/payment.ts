/**
 * SIMULATED PAYMENTS. No card data is stored or transmitted anywhere.
 * The mock API only receives the brand and last four digits plus a test outcome.
 */

export const TEST_CARDS = [
  { number: '4242 4242 4242 4242', outcome: 'approved', note: 'Visa — approved' },
  { number: '5555 5555 5555 4444', outcome: 'approved', note: 'Mastercard — approved' },
  { number: '3782 822463 10005', outcome: 'approved', note: 'Amex — approved (4-digit CVC)' },
  { number: '4000 0000 0000 0002', outcome: 'declined', note: 'Visa — card declined' },
  { number: '4000 0000 0000 9995', outcome: 'insufficient_funds', note: 'Visa — insufficient funds' },
] as const;

export type PaymentOutcome = 'approved' | 'declined' | 'insufficient_funds' | 'not_test_card';

export const digitsOnly = (s: string) => s.replace(/\D/g, '');

export function luhnValid(num: string) {
  const d = digitsOnly(num);
  if (d.length < 12 || d.length > 19) return false;
  let sum = 0;
  let dbl = false;
  for (let i = d.length - 1; i >= 0; i--) {
    let n = d.charCodeAt(i) - 48;
    if (dbl) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    dbl = !dbl;
  }
  return sum % 10 === 0;
}

export function cardBrand(num: string): 'Visa' | 'Mastercard' | 'Amex' | 'Discover' | 'Card' {
  const d = digitsOnly(num);
  if (/^4/.test(d)) return 'Visa';
  if (/^(5[1-5]|2[2-7])/.test(d)) return 'Mastercard';
  if (/^3[47]/.test(d)) return 'Amex';
  if (/^6(011|5)/.test(d)) return 'Discover';
  return 'Card';
}

export function formatCardNumber(raw: string) {
  const d = digitsOnly(raw).slice(0, 19);
  if (cardBrand(d) === 'Amex') {
    return [d.slice(0, 4), d.slice(4, 10), d.slice(10, 15)].filter(Boolean).join(' ');
  }
  return d.replace(/(.{4})/g, '$1 ').trim();
}

export function formatExpiry(raw: string) {
  const d = digitsOnly(raw).slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

export function expiryValid(mmYY: string, now = new Date()) {
  const m = /^(\d{2})\/(\d{2})$/.exec(mmYY);
  if (!m) return false;
  const month = Number(m[1]);
  const year = 2000 + Number(m[2]);
  if (month < 1 || month > 12) return false;
  const endOfMonth = new Date(year, month, 1);
  return endOfMonth > now;
}

export const cvcLength = (num: string) => (cardBrand(num) === 'Amex' ? 4 : 3);

export function testOutcome(num: string): PaymentOutcome {
  const d = digitsOnly(num);
  const hit = TEST_CARDS.find((c) => digitsOnly(c.number) === d);
  return hit ? hit.outcome : 'not_test_card';
}

export const OUTCOME_MESSAGES: Record<Exclude<PaymentOutcome, 'approved'>, string> = {
  declined: 'Your card was declined. Try a different card.',
  insufficient_funds: 'The card has insufficient funds. Try a different card.',
  not_test_card: 'Demo mode: only the listed test card numbers are accepted. No real cards are charged.',
};
