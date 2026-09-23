import { useEffect, useId, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '@/api';
import { Icon } from '@/components/ui';
import { money, cn } from '@/lib/format';
import type { Category, Product } from '@/types';

type Option = { kind: 'product'; product: Product } | { kind: 'category'; category: Category } | { kind: 'all'; q: string };

/** ARIA 1.2 combobox with product and category suggestions. */
export function SearchBox({ className, autoFocus, onDone }: { className?: string; autoFocus?: boolean; onDone?: () => void }) {
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get('q') ?? '');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [options, setOptions] = useState<Option[]>([]);
  const navigate = useNavigate();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setOptions([]);
      return;
    }
    let live = true;
    const t = setTimeout(() => {
      api.catalog.suggest(term).then((r) => {
        if (!live) return;
        setOptions([
          ...r.categories.map((category) => ({ kind: 'category' as const, category })),
          ...r.products.map((product) => ({ kind: 'product' as const, product })),
          { kind: 'all' as const, q: term },
        ]);
        setActive(-1);
      });
    }, 140);
    return () => {
      live = false;
      clearTimeout(t);
    };
  }, [q]);

  const go = (opt?: Option) => {
    setOpen(false);
    onDone?.();
    if (!opt || opt.kind === 'all') {
      const term = q.trim();
      navigate(term ? `/catalog?q=${encodeURIComponent(term)}` : '/catalog');
    } else if (opt.kind === 'product') navigate(`/product/${opt.product.slug}`);
    else navigate(`/catalog/${opt.category.slug}`);
    inputRef.current?.blur();
  };

  const expanded = open && options.length > 0;

  return (
    <form
      role="search"
      className={cn('relative', className)}
      onSubmit={(e) => {
        e.preventDefault();
        go(active >= 0 ? options[active] : undefined);
      }}
    >
      <label htmlFor={`${listId}-input`} className="sr-only">
        Search HarmFree Emporium
      </label>
      <Icon name="search" size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
      <input
        ref={inputRef}
        id={`${listId}-input`}
        type="search"
        role="combobox"
        aria-expanded={expanded}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={expanded && active >= 0 ? `${listId}-opt-${active}` : undefined}
        autoComplete="off"
        autoFocus={autoFocus}
        placeholder="Search refills, solar, cleaners…"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setOpen(true);
            setActive((a) => Math.min(options.length - 1, a + 1));
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActive((a) => Math.max(-1, a - 1));
          } else if (e.key === 'Escape') {
            setOpen(false);
          }
        }}
        className="h-11 w-full rounded-full border border-line bg-surface pl-10 pr-4 text-sm text-fg placeholder:text-muted focus:border-link focus:outline-none focus:ring-2 focus:ring-link/30"
      />
      <ul
        id={listId}
        role="listbox"
        aria-label="Search suggestions"
        hidden={!expanded}
        className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-[70vh] overflow-y-auto rounded-soft border border-line bg-surface p-1.5 shadow-lift"
      >
        {options.map((o, i) => (
          <li
            key={i}
            id={`${listId}-opt-${i}`}
            role="option"
            aria-selected={i === active}
            onMouseDown={(e) => {
              e.preventDefault();
              go(o);
            }}
            onMouseEnter={() => setActive(i)}
            className={cn('flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm', i === active && 'bg-tint')}
          >
            {o.kind === 'product' && (
              <>
                <span className="flex-1 truncate">
                  {o.product.name}
                  <span className="ml-2 text-xs text-muted">{o.product.brandName}</span>
                </span>
                <span className="text-xs font-semibold">{money(o.product.pricing.price)}</span>
              </>
            )}
            {o.kind === 'category' && (
              <>
                <Icon name="grid" size={16} className="text-muted" />
                <span className="flex-1">
                  <span className="text-muted">Category: </span>
                  {o.category.name}
                </span>
              </>
            )}
            {o.kind === 'all' && (
              <>
                <Icon name="search" size={16} className="text-muted" />
                <span className="flex-1 font-medium">See all results for “{o.q}”</span>
              </>
            )}
          </li>
        ))}
      </ul>
    </form>
  );
}
