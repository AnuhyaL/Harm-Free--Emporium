const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const usd0 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export const money = (n: number) => (Number.isInteger(n) && Math.abs(n) >= 1000 ? usd0.format(n) : usd.format(n));
export const num = (n: number) => new Intl.NumberFormat('en-US').format(n);

export const date = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export const dateTime = (iso: string) =>
  new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

export const plural = (n: number, one: string, many = `${one}s`) => `${num(n)} ${n === 1 ? one : many}`;

export const cn = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ');

export const pctOff = (msrp: number, price: number) => (msrp > price ? Math.round(((msrp - price) / msrp) * 100) : 0);
