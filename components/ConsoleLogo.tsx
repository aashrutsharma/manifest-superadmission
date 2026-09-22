'use client';

import React from 'react';

interface ConsoleLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function ConsoleLogo({ className = '', size = 'md' }: ConsoleLogoProps) {
  const hClass = size === 'sm' ? 'h-5' : size === 'lg' ? 'h-8' : 'h-6';

  return (
    <div className={`flex items-center select-none ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/console-logo.png"
        alt="Console"
        className={`${hClass} w-auto object-contain`}
        loading="eager"
      />
    </div>
  );
}


