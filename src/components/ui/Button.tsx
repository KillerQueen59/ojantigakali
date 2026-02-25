'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

/* ─── Outer wrapper (the "shadow" layer) ────────────────────────────── */
const buttonVariants = cva(
  'cursor-pointer rounded-[9px] p-0 border-none outline-none select-none overflow-visible focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
  {
    variants: {
      variant: {
        accent:
          'bg-[var(--btn-accent-edge)] focus-visible:ring-[var(--icon-accent)]',
        secondary:
          'bg-[var(--btn-secondary-edge)] focus-visible:ring-[var(--menubar-pill)]',
        danger: 'bg-red-800 focus-visible:ring-red-500',
        ghost: 'bg-transparent focus-visible:ring-[var(--window-text)]',
      },
      tactile: {
        true: 'not-[:disabled]:active:[&>.btn-content]:translate-y-[-3px]',
        false: null,
      },
    },
    defaultVariants: {
      variant: 'accent',
      tactile: true,
    },
  }
);

const contentVariants = cva(
  'btn-content flex items-center justify-center gap-2 rounded-[9px] font-bold transition-transform duration-150 ease-out',
  {
    variants: {
      variant: {
        accent:
          'bg-[var(--icon-accent)] text-[var(--btn-accent-text)] border border-black/20',
        secondary:
          'bg-[var(--menubar-pill)] text-[var(--menubar-pill-text)] border border-black/20',
        danger: 'bg-red-500 text-white border border-black/25',
        ghost: 'bg-transparent text-[var(--window-text)]',
      },
      size: {
        sm: 'h-8 px-3.5 text-xs',
        md: 'h-10 px-5 text-sm',
        lg: 'h-12 px-6 text-base',
      },
      tactile: {
        true: '-translate-y-2.5',
        false: null,
      },
    },
    defaultVariants: {
      variant: 'accent',
      size: 'md',
      tactile: true,
    },
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;

export type ButtonProps = Omit<React.ComponentProps<'button'>, 'className'> &
  ButtonVariants & {
    size?: 'sm' | 'md' | 'lg';
    classNames?: {
      root?: string;
      content?: string;
    };
    isLoading?: boolean;
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
  };

export default function Button({
  children,
  variant = 'accent',
  size = 'md',
  tactile,
  isLoading = false,
  classNames,
  iconLeft,
  iconRight,
  disabled,
  onClick,
  ...props
}: ButtonProps) {
  const isGhost = variant === 'ghost';
  const effectiveTactile = isGhost ? false : (tactile ?? true);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isLoading && onClick) onClick(e);
  };

  return (
    <button
      disabled={disabled || isLoading}
      onClick={handleClick}
      className={cn(
        buttonVariants({ variant, tactile: effectiveTactile }),
        classNames?.root
      )}
      {...props}
    >
      <span
        className={cn(
          contentVariants({ variant, size, tactile: effectiveTactile }),
          classNames?.content
        )}
      >
        {iconLeft && <span className="shrink-0">{iconLeft}</span>}

        {isLoading ? (
          <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          children
        )}

        {iconRight && <span className="shrink-0">{iconRight}</span>}
      </span>
    </button>
  );
}
