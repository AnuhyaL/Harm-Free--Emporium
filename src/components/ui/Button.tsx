import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { cn } from '@/lib/format';

type Variant = 'primary' | 'secondary' | 'ghost' | 'gold' | 'outline-light' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold no-underline transition-[background-color,color,box-shadow,transform] duration-200 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-55 whitespace-nowrap';

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-primary-fg hover:shadow-lift hover:brightness-110',
  secondary: 'border border-line bg-surface text-fg hover:bg-tint',
  ghost: 'text-fg hover:bg-tint',
  gold: 'bg-gold text-gold-fg hover:brightness-105 hover:shadow-lift',
  'outline-light': 'border border-white/70 text-white hover:bg-white/10',
  danger: 'border border-danger/40 text-danger hover:bg-danger/10',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-7 text-base',
};

export const buttonClass = (variant: Variant = 'primary', size: Size = 'md', extra?: string) =>
  cn(base, variants[variant], sizes[size], extra);

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading, className, children, disabled, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={buttonClass(variant, size, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden />}
      {children}
    </button>
  );
});

interface ButtonLinkProps extends LinkProps {
  variant?: Variant;
  size?: Size;
}

export function ButtonLink({ variant = 'primary', size = 'md', className, ...rest }: ButtonLinkProps) {
  return <Link className={buttonClass(variant, size, className as string)} {...rest} />;
}

export function IconButton({
  label,
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-full text-fg transition-colors duration-200 hover:bg-tint',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
