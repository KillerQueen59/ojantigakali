'use client';

import { X } from 'lucide-react';
import Image from 'next/image';
import { useMenubar } from './useMenubar';
import Button from '@/components/ui/Button';
import { useVisitorCount } from '@/hooks/useVisitorCount';

interface MenubarProps {
  openCount?: number;
  onCloseAll?: () => void;
}

function VisitorCount({ count }: { count: number }) {
  return (
    <div
      className="flex items-center gap-1"
      title={`${count} ${count === 1 ? 'person' : 'people'} viewing right now`}
      style={{ fontSize: 11, color: 'rgba(176,234,255,0.7)' }}
    >
      <span
        style={{
          display: 'inline-block',
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: 'hsl(160, 80%, 55%)',
          boxShadow: '0 0 6px hsl(160, 80%, 55%)',
          animation: 'visitorPulse 2s ease-in-out infinite',
        }}
      />
      <span style={{ color: 'hsl(160, 80%, 55%)', fontWeight: 'bold' }}>{count}</span>
      <span>{count === 1 ? 'viewer' : 'viewers'}</span>
    </div>
  );
}

export default function Menubar({ openCount = 0, onCloseAll }: MenubarProps) {
  const { state } = useMenubar();
  const { time } = state;
  const visitorCount = useVisitorCount();

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

      <div className="flex items-center gap-3">
        {visitorCount !== null && visitorCount > 0 && (
          <VisitorCount count={visitorCount} />
        )}
        <span className="text-sm font-medium tabular-nums opacity-80">
          {time}
        </span>
      </div>
    </div>
  );
}
