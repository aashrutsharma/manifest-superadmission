'use client';

import React from 'react';

interface ConsoleLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export default function ConsoleLogo({ className = '', size = 'xl' }: ConsoleLogoProps) {
  const hClass =
    size === 'sm'
      ? 'h-5'
      : size === 'md'
      ? 'h-7'
      : size === 'lg'
      ? 'h-9'
      : size === '2xl'
      ? 'h-14 sm:h-16'
      : 'h-11 sm:h-12'; // xl is default (approx 140px-160px wide)

  return (
    <div className={`flex items-center select-none ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/console-logo.png"
        alt="Console"
        className={`${hClass} w-auto object-contain transition-all drop-shadow-xs`}
        loading="eager"
      />
    </div>
  );
}


