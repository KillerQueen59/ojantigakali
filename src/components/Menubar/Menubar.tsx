'use client';

import { X } from 'lucide-react';
import Image from 'next/image';
import { useMenubar } from './useMenubar';
import Button from '@/components/ui/Button';

interface MenubarProps {
  openCount?: number;
  onCloseAll?: () => void;
}

export default function Menubar({ openCount = 0, onCloseAll }: MenubarProps) {
  const { state } = useMenubar();
  const { time } = state;

  return (
    <div className="relative flex items-center justify-between select-none px-4 py-2 bg-[var(--menubar-bg)] text-[var(--menubar-text)]">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5">
          <Image src="/ojantigakali-animated-round.webp" alt="ojantigakali" width={24} height={24} className="rounded-full" unoptimized />
          <span className="text-xs font-bold opacity-90">Ojantigakali&apos;s Arcade</span>
        </div>
        {openCount > 0 && (
          <Button
            variant="secondary"
            size="sm"
            tactile={false}
            onClick={onCloseAll}
            iconLeft={<X size={12} />}
          >
            Close All
          </Button>
        )}
      </div>

      <span className="text-sm font-medium tabular-nums opacity-80">
        {time}
      </span>
    </div>
  );
}
