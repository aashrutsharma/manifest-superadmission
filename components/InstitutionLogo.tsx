'use client';

import React, { useState } from 'react';

interface InstitutionLogoProps {
  name: string;
  shortName?: string;
  slug?: string;
  code?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
}

export default function InstitutionLogo({
  name,
  shortName,
  slug,
  code,
  size = 'md',
  className = '',
}: InstitutionLogoProps) {
  const [imageError, setImageError] = useState(false);

  const dimension =
    typeof size === 'number'
      ? size
      : size === 'xs'
      ? 20
      : size === 'sm'
      ? 26
      : size === 'md'
      ? 34
      : size === 'lg'
      ? 44
      : 56;

  const fontClass =
    dimension <= 22
      ? 'text-[9px] font-bold'
      : dimension <= 30
      ? 'text-[10px] font-bold'
      : dimension <= 40
      ? 'text-xs font-bold'
      : dimension <= 50
      ? 'text-sm font-extrabold'
      : 'text-base font-extrabold';


  const initials = (shortName || code || name)
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || 'IN';

  // Deterministic color palette for high-end look
  const colors = [
    { bg: '#0b53c3', fg: '#ffffff' }, // Royal Blue (Manifest primary)
    { bg: '#0f766e', fg: '#ffffff' }, // Deep Teal
    { bg: '#4338ca', fg: '#ffffff' }, // Indigo
    { bg: '#1e293b', fg: '#ffffff' }, // Slate Navy
    { bg: '#b45309', fg: '#ffffff' }, // Warm Amber
    { bg: '#be123c', fg: '#ffffff' }, // Crimson
    { bg: '#15803d', fg: '#ffffff' }, // Emerald
    { bg: '#6d28d9', fg: '#ffffff' }, // Purple
  ];

  const hash = (name + (code || '')).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const color = colors[hash % colors.length];

  // Try custom uploaded logos if present in root public/logos/
  const logoPath = slug ? `/logos/${slug}.png` : code ? `/logos/${code.toLowerCase()}.png` : null;

  if (logoPath && !imageError) {
    return (
      <div
        className={`relative shrink-0 rounded-xl overflow-hidden border border-slate-200/80 bg-white flex items-center justify-center shadow-xs ${className}`}
        style={{ width: dimension, height: dimension }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoPath}
          alt={name}
          className="w-full h-full object-contain p-0.5"
          onError={() => setImageError(true)}
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative shrink-0 rounded-xl flex items-center justify-center shadow-xs select-none border border-black/5 ${fontClass} ${className}`}
      style={{
        width: dimension,
        height: dimension,
        backgroundColor: color.bg,
        color: color.fg,
      }}
      title={name}
    >
      <span>{initials}</span>
    </div>
  );
}
