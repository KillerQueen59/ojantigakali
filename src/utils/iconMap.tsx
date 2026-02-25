'use client';

import { useEffect, useState } from 'react';
import {
  MapPin,
  Globe,
  Briefcase,
  Zap,
  BookOpen,
  Navigation,
  Map,
  Waves,
  Leaf,
  Github,
  Mail,
  Smartphone,
  Linkedin,
  User,
  Building2,
  GraduationCap,
  FileText,
  Feather,
  Trophy,
  Settings,
  Palette,
  Wrench,
  Code,
  Coffee,
  type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  MapPin,
  Globe,
  Briefcase,
  Zap,
  BookOpen,
  Navigation,
  Map,
  Waves,
  Leaf,
  Github,
  Mail,
  Smartphone,
  Linkedin,
  User,
  Building2,
  GraduationCap,
  FileText,
  Feather,
  Trophy,
  Settings,
  Palette,
  Wrench,
  Code,
  Coffee,
};

function getImageBrightness(src: string): Promise<number> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(128);
      ctx.drawImage(img, 0, 0);
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let total = 0, count = 0;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] > 10) { // skip transparent pixels
          total += data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
          count++;
        }
      }
      resolve(count > 0 ? total / count : 128);
    };
    img.onerror = () => resolve(128);
    img.src = src;
  });
}

function ImageIcon({ src, size, className }: { src: string; size: number; className?: string }) {
  const [needsBg, setNeedsBg] = useState(false);

  useEffect(() => {
    getImageBrightness(src).then((brightness) => {
      setNeedsBg(brightness < 100);
    });
  }, [src]);

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        padding: needsBg ? 6 : 0,
        background: needsBg ? 'rgba(255,255,255,0.92)' : 'transparent',
        transition: 'background 0.2s',
        flexShrink: 0,
      }}
    >
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        className={className}
        style={{ width: size, height: size, objectFit: 'contain', display: 'block' }}
      />
    </span>
  );
}

export function Icon({
  name,
  size = 16,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  if (name.startsWith('/')) {
    return <ImageIcon src={name} size={size} className={className} />;
  }
  const C = ICON_MAP[name];
  return C ? <C size={size} className={className} /> : null;
}
