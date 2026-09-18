'use client';

import React from 'react';
import Image from 'next/image';

interface ConsoleLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function ConsoleLogo({ className = '', size = 'md' }: ConsoleLogoProps) {
  const height = size === 'sm' ? 24 : size === 'lg' ? 36 : 28;

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <div className="flex items-center gap-1.5">
        <span className="font-bold text-[19px] tracking-tight text-[#0F172A] font-sans">
          console
        </span>
        <span className="text-[20px] font-light text-[#0F172A] -mt-0.5">/</span>
      </div>
      <div className="relative flex items-center justify-center w-[22px] h-[22px]">
        {/* Geometric floral celtic knot icon matching console logo */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full text-[#0F172A]"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M50 8 C30 8, 12 30, 30 50 C12 70, 30 92, 50 92 C70 92, 88 70, 70 50 C88 30, 70 8, 50 8 Z" />
          <path d="M8 50 C8 30, 30 12, 50 30 C70 12, 92 30, 92 50 C92 70, 70 88, 50 70 C30 88, 8 70, 8 50 Z" />
          <polygon points="50,22 78,50 50,78 22,50" strokeWidth="4" />
          <polygon points="50,32 68,50 50,68 32,50" strokeWidth="3" />
        </svg>
      </div>
    </div>
  );
}

