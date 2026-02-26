'use client';

import { useState } from 'react';
import Image from 'next/image';
import ImagePreview from '@/components/ui/ImagePreview';
import { Icon } from '@/utils/iconMap';
import type { AboutData } from '@/types/portfolio';

export default function AboutWindow({
  data,
}: {
  data: AboutData | null | undefined;
}) {
  const name = data?.name ?? 'Muhammad Fauzan Ramadhan';
  const title = data?.title ?? 'Software Engineer';
  const bio = data?.bio ?? '';
  const facts = data?.facts ?? [];
  const [preview, setPreview] = useState(false);
  const [photoLoaded, setPhotoLoaded] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      {preview && (
        <ImagePreview
          src="/ojan.jpg"
          alt={name}
          onClose={() => setPreview(false)}
        />
      )}

      <div className="flex gap-5 items-start">
        <div
          className="relative shrink-0 cursor-zoom-in rounded-2xl overflow-hidden"
          style={{
            width: 120,
            height: 150,
            boxShadow:
              '0 0 0 1.5px rgba(0,210,255,0.35), 0 0 24px rgba(0,180,255,0.15)',
          }}
          onClick={() => setPreview(true)}
        >
          {!photoLoaded && (
            <div className="img-skeleton absolute inset-0 z-[1]" />
          )}
          <Image
            src="/ojan.jpg"
            alt={name}
            width={120}
            height={150}
            className="w-full h-full object-cover"
            style={{ objectPosition: '50% 10%', opacity: photoLoaded ? 1 : 0, transition: 'opacity 0.3s ease' }}
            onLoad={() => setPhotoLoaded(true)}
          />
          <div
            className="absolute inset-0 mix-blend-overlay pointer-events-none"
            style={{
              background:
                'linear-gradient(135deg, rgba(0,200,255,0.2) 0%, rgba(180,0,255,0.12) 100%)',
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none"
            style={{
              background:
                'linear-gradient(to bottom, transparent, rgba(14,11,30,0.6))',
            }}
          />
        </div>

        <div className="flex flex-col gap-3 flex-1 pt-1">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[var(--window-text)] leading-snug">
              {name}
            </h1>
            <p className="text-sm text-[var(--icon-accent)] mt-0.5 font-semibold">
              {title}
            </p>
          </div>

          <div className="h-px bg-[var(--window-titlebar-border)]" />

          <ul className="flex flex-col gap-1.5 list-none">
            {facts.slice(0, 2).map(({ icon, key, value }) => (
              <li key={key} className="flex gap-2 items-center text-[12px]">
                <span className="text-[var(--icon-accent)] shrink-0">
                  <Icon name={icon} size={12} />
                </span>
                <span className="text-[var(--window-text-muted)]">{key}:</span>
                <span className="text-[var(--window-text)] font-medium truncate">
                  {value}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Divider />

      {/* Bio */}
      <Section title="About Me">
        <p className="leading-7 text-[var(--window-text)] text-sm">{bio}</p>
      </Section>

      {/* All facts */}
      {facts.length > 0 && (
        <Section title="Quick Facts">
          <div className="grid grid-cols-1 gap-2">
            {facts.slice(2, facts.length).map(({ icon, key, value }) => (
              <div
                key={key}
                className="flex gap-3 items-start text-[13px] px-3 py-2 rounded-lg bg-[var(--window-titlebar)]"
              >
                <span className="text-[var(--icon-accent)] shrink-0 mt-px">
                  <Icon name={icon} size={13} />
                </span>
                <span className="text-[var(--window-text-muted)] shrink-0 w-[100px]">
                  {key}
                </span>
                <span className="text-[var(--window-text)] font-medium leading-snug">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--window-text-muted)]">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-[var(--window-titlebar-border)]" />;
}
