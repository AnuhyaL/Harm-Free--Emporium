import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/format';

interface WrapProps {
  label: ReactNode;
  error?: string;
  hint?: ReactNode;
  className?: string;
  optional?: boolean;
}

function useFieldIds(id?: string) {
  const auto = useId();
  const fieldId = id ?? auto;
  return { fieldId, errorId: `${fieldId}-error`, hintId: `${fieldId}-hint` };
}

function Wrap({ label, error, hint, className, optional, fieldId, errorId, hintId, children }: WrapProps & ReturnType<typeof useFieldIds> & { children: ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={fieldId} className="label">
        {label}
        {optional && <span className="ml-1 font-normal text-muted">(optional)</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={hintId} className="mt-1 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="mt-1 text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & WrapProps;

export const TextField = forwardRef<HTMLInputElement, InputProps>(function TextField(
  { label, error, hint, className, optional, id, ...rest },
  ref,
) {
  const ids = useFieldIds(id);
  return (
    <Wrap label={label} error={error} hint={hint} className={className} optional={optional} {...ids}>
      <input
        ref={ref}
        id={ids.fieldId}
        className="input"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? ids.errorId : hint ? ids.hintId : undefined}
        {...rest}
      />
    </Wrap>
  );
});

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & WrapProps;

export const TextArea = forwardRef<HTMLTextAreaElement, TextareaProps>(function TextArea(
  { label, error, hint, className, optional, id, rows = 4, ...rest },
  ref,
) {
  const ids = useFieldIds(id);
  return (
    <Wrap label={label} error={error} hint={hint} className={className} optional={optional} {...ids}>
      <textarea
        ref={ref}
        id={ids.fieldId}
        rows={rows}
        className="input resize-y"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? ids.errorId : hint ? ids.hintId : undefined}
        {...rest}
      />
    </Wrap>
  );
});

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & WrapProps & { options: { value: string; label: string }[] };

export const SelectField = forwardRef<HTMLSelectElement, SelectProps>(function SelectField(
  { label, error, hint, className, optional, id, options, ...rest },
  ref,
) {
  const ids = useFieldIds(id);
  return (
    <Wrap label={label} error={error} hint={hint} className={className} optional={optional} {...ids}>
      <select
        ref={ref}
        id={ids.fieldId}
        className="input appearance-none bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23738290' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
        }}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? ids.errorId : hint ? ids.hintId : undefined}
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Wrap>
  );
});

export const Checkbox = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { label: ReactNode; error?: string }>(
  function Checkbox({ label, error, className, id, ...rest }, ref) {
    const auto = useId();
    const fieldId = id ?? auto;
    return (
      <div className={className}>
        <label htmlFor={fieldId} className="flex cursor-pointer items-start gap-2.5 text-sm">
          <input
            ref={ref}
            id={fieldId}
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-line accent-[rgb(var(--primary))]"
            aria-invalid={error ? true : undefined}
            {...rest}
          />
          <span>{label}</span>
        </label>
        {error && (
          <p role="alert" className="mt-1 text-xs font-medium text-danger">
            {error}
          </p>
        )}
      </div>
    );
  },
);

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div role="alert" className={cn('rounded-soft border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger')}>
      {message}
    </div>
  );
}
