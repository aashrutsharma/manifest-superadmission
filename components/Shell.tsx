'use client';

import React, { useState, useEffect } from 'react';
import SupermemorySidebar from './SupermemorySidebar';
import SupermemoryTopbar from './SupermemoryTopbar';
import CommandSearchModal from './CommandSearchModal';

interface ShellProps {
  children: React.ReactNode;
  title?: string;
  badgeText?: string;
}

export default function Shell({
  children,
  title = 'Playground',
  badgeText = '70,623 Colleges',
}: ShellProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global ⌘K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* 1. Supermemory Sidebar */}
      <SupermemorySidebar onOpenSearch={() => setIsSearchOpen(true)} />

      {/* 2. Main Content Area */}
      <div className="ml-[230px] flex-1 flex flex-col min-h-screen min-w-0">
        {/* Topbar */}
        <SupermemoryTopbar
          currentTitle={title}
          badgeText={badgeText}
          onOpenSearch={() => setIsSearchOpen(true)}
        />

        {/* Page Inner Canvas */}
        <main className="flex-1 flex flex-col min-w-0">
          {children}
        </main>
      </div>

      {/* 3. Global ⌘K Search Modal */}
      <CommandSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
