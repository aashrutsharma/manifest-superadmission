'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Database, CheckCircle2, ArrowRight } from 'lucide-react';


interface ManifestArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ManifestArchitectureModal({
  isOpen,
  onClose,
}: ManifestArchitectureModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-6 bg-white rounded-2xl border border-slate-200/90 shadow-2xl">
        <DialogHeader>
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0b53c3] mb-2">
            <Database className="w-5 h-5" />
          </div>
          <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">
            What Is Manifest?
          </DialogTitle>
          <p className="text-xs text-slate-500 mt-1">
            The national open registry of every degree-granting higher education institution in India.
          </p>
        </DialogHeader>

        <div className="space-y-4 text-xs text-slate-600 mt-2 leading-relaxed">
          <p>
            Manifest tracks more than <strong>70,000 universities, colleges, and standalone institutions</strong> across 36 states and union territories, broken down into 1,362 universities, 52,509 affiliated colleges, 16,671 standalone institutions, and 2,467 constituent colleges.
          </p>

          {/* Three Layers Diagram */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              The Superadmission Ecosystem
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-lg bg-white border border-blue-200 shadow-xs">
                <div className="text-[11px] font-bold text-[#0b53c3]">1. Manifest</div>
                <div className="text-[10px] text-slate-500 mt-1">
                  What is this institution, and can it be trusted?
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-xs">
                <div className="text-[11px] font-bold text-slate-900">2. Superadmission</div>
                <div className="text-[10px] text-slate-500 mt-1">
                  How does a student actually get admitted?
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-xs">
                <div className="text-[11px] font-bold text-slate-900">3. PraveshAI</div>
                <div className="text-[10px] text-slate-500 mt-1">
                  What should this student do, given rank and quota?
                </div>
              </div>
            </div>
          </div>

          {/* Neutrality */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#0b53c3]" />
              The Neutrality Principle
            </h4>
            <p className="text-slate-600">
              The architecture borrows an idea from <strong>UPI and ONDC</strong>: government-backed systems built as shared public infrastructure instead of an advertising product competing for attention. A bank doesn&apos;t get better placement on UPI for paying more, and Manifest works the same way: rankings always come from a verified government metric (NIRF / NAAC / AISHE). Manifest does not charge institutions to be listed or ranked.
            </p>
          </div>

          {/* AISHE Keying */}
          <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#0b53c3] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900">Keyed to AISHE: </span>
              Every institution is keyed to its unique AISHE code, preventing duplicate entries and keeping every record checkable directly against government gazettes.
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <a
            href="https://docs.superadmission.com/technical/what-is-manifest"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-[#0b53c3] hover:underline flex items-center gap-1"
          >
            Read the Full Technical Whitepaper <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <Button size="sm" onClick={onClose} className="bg-[#0b53c3] hover:bg-[#09429e] text-white text-xs">
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
