import * as RD from '@radix-ui/react-dialog';
import type { ReactNode } from 'react';
import { cn } from '@/lib/format';
import { Icon } from './Icon';

interface BaseProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  hideTitle?: boolean;
  children: ReactNode;
  className?: string;
}

/** Centered modal. Radix handles focus trap, Escape, scroll lock and ARIA. */
export function Modal({ open, onOpenChange, title, description, hideTitle, children, className }: BaseProps) {
  return (
    <RD.Root open={open} onOpenChange={onOpenChange}>
      <RD.Portal>
        <RD.Overlay className="fixed inset-0 z-50 bg-navy/50 backdrop-blur-[2px] data-[state=open]:animate-[fadeIn_200ms_ease-out]" />
        <RD.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100vw-32px)] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-card bg-surface p-6 shadow-lift focus:outline-none data-[state=open]:animate-[popIn_220ms_ease-out]',
            className,
          )}
        >
          <RD.Title className={cn('pr-10 text-xl font-semibold', hideTitle && 'sr-only')}>{title}</RD.Title>
          {description ? <RD.Description className="mt-1 text-sm text-muted">{description}</RD.Description> : <RD.Description className="sr-only">{title}</RD.Description>}
          {children}
          <RD.Close className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-tint" aria-label="Close">
            <Icon name="close" />
          </RD.Close>
        </RD.Content>
      </RD.Portal>
    </RD.Root>
  );
}

/** Slide-over panel from the right (cart) or left (mobile nav). */
export function Drawer({ open, onOpenChange, title, description, children, className, side = 'right' }: BaseProps & { side?: 'left' | 'right' }) {
  return (
    <RD.Root open={open} onOpenChange={onOpenChange}>
      <RD.Portal>
        <RD.Overlay className="fixed inset-0 z-50 bg-navy/50 backdrop-blur-[2px] data-[state=open]:animate-[fadeIn_200ms_ease-out]" />
        <RD.Content
          className={cn(
            'fixed inset-y-0 z-50 flex w-full max-w-md flex-col bg-surface shadow-lift focus:outline-none',
            side === 'right' ? 'right-0 data-[state=open]:animate-[slideInRight_280ms_cubic-bezier(0.16,1,0.3,1)]' : 'left-0 data-[state=open]:animate-[slideInLeft_280ms_cubic-bezier(0.16,1,0.3,1)]',
            className,
          )}
          style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <RD.Title className="text-lg font-semibold">{title}</RD.Title>
            <RD.Close className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-tint" aria-label={`Close ${title.toLowerCase()}`}>
              <Icon name="close" />
            </RD.Close>
          </div>
          <RD.Description className="sr-only">{description ?? title}</RD.Description>
          {children}
        </RD.Content>
      </RD.Portal>
    </RD.Root>
  );
}
