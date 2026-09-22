'use client';

import React from 'react';


interface CompanyLogoProps {
  name: string;
  size?: number;
  className?: string;
}

export default function CompanyLogo({ name, size = 20, className = '' }: CompanyLogoProps) {
  const lower = name.toLowerCase();


  // Curated SVG Brand Vectors
  const renderSvg = () => {
    if (lower.includes('google')) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
      );
    }

    if (lower.includes('microsoft')) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <rect x="2" y="2" width="9" height="9" fill="#F25022" />
          <rect x="13" y="2" width="9" height="9" fill="#7FBA00" />
          <rect x="2" y="13" width="9" height="9" fill="#00A4EF" />
          <rect x="13" y="13" width="9" height="9" fill="#FFB900" />
        </svg>
      );
    }

    if (lower.includes('apple')) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full" fill="#1e293b">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.85.94-2.93-.93.04-2.02.62-2.67 1.39-.58.67-1.08 1.76-.94 2.81 1.03.08 2.05-.53 2.67-1.27z" />
        </svg>
      );
    }

    if (lower.includes('amazon')) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full" fill="#FF9900">
          <path d="M15.93 17.09c-2.83 1.89-6.9 2.89-10.42 1.05-.51-.27-.08-.85.39-.62 3.12 1.58 6.78.77 9.31-.83.39-.25.86.19.72.4zm1.18-1.22c-.36-.46-2.36-.22-3.26-.11-.27.03-.31-.2-.07-.36 1.54-1.07 4.06-.76 4.37-.37.31.39-.08 2.95-1.54 4.16-.23.19-.45.09-.35-.16.34-.84.97-2.61.85-3.16z" />
          <path d="M13.75 4.75c-4.5 0-7.75 3.38-7.75 7.88 0 3.25 1.75 5.5 4.5 5.5 2.13 0 3.75-1.13 4.63-2.63v2.25h2.87V5.25h-2.87v1.88c-.93-1.43-2.53-2.38-4.38-2.38zm-.38 10.75c-2.63 0-4.38-2.06-4.38-4.88s1.75-4.88 4.38-4.88 4.38 2.06 4.38 4.88-1.75 4.88-4.38 4.88z" fill="#232F3E" />
        </svg>
      );
    }

    if (lower.includes('qualcomm')) {
      return (
        <div className="w-full h-full flex items-center justify-center font-black text-[#0b53c3] text-[10px] tracking-tighter">
          Q
        </div>
      );
    }

    if (lower.includes('texas') || lower.includes('ti')) {
      return (
        <div className="w-full h-full flex items-center justify-center font-black text-[#CC0000] text-[9px] tracking-tighter">
          TI
        </div>
      );
    }

    if (lower.includes('goldman')) {
      return (
        <div className="w-full h-full flex items-center justify-center font-black text-[#002D62] text-[9px] tracking-tighter">
          GS
        </div>
      );
    }

    // Default stylized corporate mark
    return (
      <div className="w-full h-full flex items-center justify-center font-bold text-slate-700 text-[10px]">
        {name.slice(0, 2).toUpperCase()}
      </div>
    );
  };

  return (
    <div
      className={`shrink-0 rounded-md bg-white border border-slate-200/80 p-0.5 flex items-center justify-center shadow-2xs ${className}`}
      style={{ width: size, height: size }}
      title={name}
    >
      {renderSvg()}
    </div>
  );
}
