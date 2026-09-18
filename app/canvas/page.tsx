'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Shell from '@/components/Shell';
import InstitutionLogo from '@/components/InstitutionLogo';
import {
  Maximize2,
  ZoomIn,
  ZoomOut,
  ChevronRight,
  ChevronDown,
  X,
  ExternalLink,
  MapPin,
  Building,
  Award,
  BookmarkPlus,
  Share2,
  Filter,
  Layers,
  Sparkles,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { College } from '@/lib/types';
import { toast } from 'sonner';

interface GraphNode {
  id: string;
  name: string;
  category: 'hub' | 'institution';
  state: string;
  city?: string;
  nirfRank?: number;
  naacGrade?: string;
  type?: string;
  medianPackage?: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
}

interface GraphLink {
  source: string;
  target: string;
  type: 'state' | 'tier';
}

const STATE_COLORS: Record<string, string> = {
  Maharashtra: '#3B82F6',
  'Tamil Nadu': '#8B5CF6',
  Karnataka: '#06B6D4',
  'Uttar Pradesh': '#F59E0B',
  Delhi: '#EC4899',
  Rajasthan: '#EF4444',
  Gujarat: '#10B981',
  Telangana: '#F97316',
  Kerala: '#6366F1',
  'West Bengal': '#14B8A6',
};

export default function CanvasGraphPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [links, setLinks] = useState<GraphLink[]>([]);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Load Graph Data from Supabase institutions
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('institutions')
          .select('id, name, city, state, type, nirf_rank_overall, naac_grade, median_package_lpa')
          .order('nirf_rank_overall', { ascending: true, nullsFirst: false })
          .limit(400);

        if (error || !data) {
          console.warn('Fallback graph simulation:', error);
          return;
        }

        const width = window.innerWidth - 230;
        const height = window.innerHeight - 52;
        const centerX = width / 2;
        const centerY = height / 2;

        // Create state & tier hubs
        const states = Array.from(new Set(data.map((d: any) => d.state || 'India'))).slice(0, 10);
        const hubNodes: GraphNode[] = states.map((st, idx) => {
          const angle = (idx / states.length) * 2 * Math.PI;
          const radius = Math.min(width, height) * 0.32;
          return {
            id: `hub-${st}`,
            name: `${st} Hub`,
            category: 'hub',
            state: st,
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius,
            vx: 0,
            vy: 0,
            r: 16,
            color: STATE_COLORS[st] || '#2563EB',
          };
        });

        // Center Mega Hub
        const centerHub: GraphNode = {
          id: 'hub-center',
          name: 'Institutions Network',
          category: 'hub',
          state: 'National',
          x: centerX,
          y: centerY,
          vx: 0,
          vy: 0,
          r: 22,
          color: '#0F172A',
        };

        const instNodes: GraphNode[] = [];
        const graphLinks: GraphLink[] = [];

        // Connect hubs to center
        hubNodes.forEach((h) => {
          graphLinks.push({
            source: centerHub.id,
            target: h.id,
            type: 'tier',
          });
        });

        // Add college nodes around their state hubs
        data.forEach((item: any) => {
          const targetHub = hubNodes.find((h) => h.state === item.state) || hubNodes[0];
          const dist = 30 + Math.random() * 110;
          const theta = Math.random() * 2 * Math.PI;
          const isTopTier = item.nirf_rank_overall && item.nirf_rank_overall <= 100;

          const n: GraphNode = {
            id: String(item.id),
            name: item.name,
            category: 'institution',
            state: item.state || 'India',
            city: item.city,
            nirfRank: item.nirf_rank_overall,
            naacGrade: item.naac_grade,
            type: item.type,
            medianPackage: item.median_package_lpa,
            x: (targetHub?.x || centerX) + Math.cos(theta) * dist,
            y: (targetHub?.y || centerY) + Math.sin(theta) * dist,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            r: isTopTier ? 7 : 4.5,
            color: isTopTier ? '#10B981' : item.nirf_rank_overall ? '#2563EB' : '#94A3B8',
          };

          instNodes.push(n);
          if (targetHub) {
            graphLinks.push({
              source: targetHub.id,
              target: n.id,
              type: 'state',
            });
          }
        });

        setNodes([centerHub, ...hubNodes, ...instNodes]);
        setLinks(graphLinks);
      } catch (err) {
        console.error('Graph build error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Simple physics loop & Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || nodes.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const localNodes = [...nodes];
    const nodeMap = new Map(localNodes.map((n) => [n.id, n]));

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);
      ctx.save();

      // Pan & Zoom
      ctx.translate(pan.x, pan.y);
      ctx.scale(zoomLevel, zoomLevel);

      // 1. Draw Links
      links.forEach((l) => {
        const s = nodeMap.get(l.source);
        const t = nodeMap.get(l.target);
        if (!s || !t) return;

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(t.x, t.y);
        if (l.type === 'tier') {
          ctx.strokeStyle = '#CBD5E1';
          ctx.lineWidth = 1.5;
        } else {
          ctx.strokeStyle = 'rgba(203, 213, 225, 0.4)';
          ctx.lineWidth = 0.75;
        }
        ctx.stroke();
      });

      // 2. Draw Nodes
      localNodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, 2 * Math.PI);
        ctx.fillStyle = n.color;
        ctx.fill();

        // Node border
        if (n.category === 'hub') {
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 3;
          ctx.stroke();

          // Hub Label
          ctx.font = 'bold 11px Space Grotesk, sans-serif';
          ctx.fillStyle = '#0F172A';
          ctx.textAlign = 'center';
          ctx.fillText(n.name, n.x, n.y + n.r + 14);
        } else if (n.nirfRank && n.nirfRank <= 50) {
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Show prominent label for top colleges
          ctx.font = '500 9px Space Grotesk, sans-serif';
          ctx.fillStyle = '#475569';
          ctx.textAlign = 'center';
          ctx.fillText(n.name.slice(0, 18), n.x, n.y + n.r + 10);
        }
      });

      ctx.restore();
      animRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animRef.current);
    };
  }, [nodes, links, pan, zoomLevel]);

  // Window resize listener
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth - 230;
        canvasRef.current.height = window.innerHeight - 52;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Canvas Mouse Controls (Pan & Click Hit Detection)
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingRef.current) {
      setPan({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
      return;
    }

    // Hit test hover
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mouseX = (e.clientX - rect.left - pan.x) / zoomLevel;
    const mouseY = (e.clientY - rect.top - pan.y) / zoomLevel;

    const hit = nodes.find((n) => {
      const dx = n.x - mouseX;
      const dy = n.y - mouseY;
      return Math.sqrt(dx * dx + dy * dy) <= n.r + 4;
    });

    setHoveredNode(hit || null);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    isDraggingRef.current = false;

    // Check click selection
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mouseX = (e.clientX - rect.left - pan.x) / zoomLevel;
    const mouseY = (e.clientY - rect.top - pan.y) / zoomLevel;

    const hit = nodes.find((n) => {
      const dx = n.x - mouseX;
      const dy = n.y - mouseY;
      return Math.sqrt(dx * dx + dy * dy) <= n.r + 6;
    });

    if (hit) {
      setSelectedNode(hit);
    }
  };

  const handleFit = () => {
    setPan({ x: 0, y: 0 });
    setZoomLevel(1);
  };

  const handleCenter = () => {
    const width = window.innerWidth - 230;
    const height = window.innerHeight - 52;
    setPan({ x: 0, y: 0 });
    setZoomLevel(1);
  };

  const handleSaveToShortlist = (node: GraphNode) => {
    try {
      const saved = JSON.parse(localStorage.getItem('manifest-basket') || '[]');
      if (saved.find((s: any) => String(s.id) === String(node.id))) {
        toast.info('Already in your shortlist');
      } else {
        localStorage.setItem('manifest-basket', JSON.stringify([...saved, node]));
        toast.success(`${node.name.slice(0, 28)}... saved to shortlist!`);
      }
    } catch {
      toast.error('Could not save to shortlist');
    }
  };

  return (
    <Shell title="Memory Graph" badgeText="400 Clustered Nodes">
      <div
        className="relative flex-1 w-full h-[calc(100vh-52px)] overflow-hidden bg-slate-50/70 select-none"
        style={{
          backgroundImage: 'radial-gradient(#CBD5E1 1.2px, transparent 1.2px)',
          backgroundSize: '24px 24px',
        }}
      >
        {/* Canvas Element */}
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="w-full h-full cursor-grab active:cursor-grabbing block"
        />

        {/* Loading Spinner */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-xs z-20">
            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm text-[13px] text-slate-700 font-medium">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Simulating database clusters...</span>
            </div>
          </div>
        )}

        {/* Floating Bottom-Left Control Deck (Matching Supermemory screenshot media_1789765299745.png) */}
        <div className="absolute bottom-5 left-5 z-20 flex flex-col gap-2">
          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleFit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 font-semibold text-[12px] shadow-sm transition-all active:scale-95"
            >
              <span>Fit</span>
              <kbd className="text-[10px] text-slate-400 font-mono">z</kbd>
            </button>

            <button
              onClick={handleCenter}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 font-semibold text-[12px] shadow-sm transition-all active:scale-95"
            >
              <span>Center</span>
              <kbd className="text-[10px] text-slate-400 font-mono">c</kbd>
            </button>

            {/* Zoom Stepper */}
            <div className="flex items-center bg-white border border-slate-200 rounded-lg shadow-sm text-[12px] overflow-hidden">
              <span className="px-2.5 py-1 font-mono font-bold text-slate-700 border-r border-slate-200">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.2, z - 0.2))}
                className="px-2 py-1 text-slate-500 hover:bg-slate-50 border-r border-slate-200"
              >
                -
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.min(3, z + 0.2))}
                className="px-2 py-1 text-slate-500 hover:bg-slate-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Collapsible Legend Card */}
          <div className="bg-white/95 backdrop-blur-xs border border-slate-200 rounded-xl shadow-md overflow-hidden w-[240px]">
            <button
              onClick={() => setShowLegend((v) => !v)}
              className="w-full flex items-center justify-between px-3.5 py-2 text-[12px] font-bold text-slate-800 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-slate-500" />
                <span>Legend</span>
              </div>
              {showLegend ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>

            {showLegend && (
              <div className="p-3.5 pt-1 text-[11.5px] border-t border-slate-100 flex flex-col gap-3">
                {/* Statistics */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Statistics
                  </span>
                  <div className="flex flex-col gap-1 text-slate-600">
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-slate-800 inline-block"></span>
                        National Network
                      </span>
                      <span className="font-mono font-semibold">1</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
                        State Clusters
                      </span>
                      <span className="font-mono font-semibold">10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                        Sampled Nodes
                      </span>
                      <span className="font-mono font-semibold">400</span>
                    </div>
                  </div>
                </div>

                {/* Status / Rank */}
                <div className="border-t border-slate-100 pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Institution Tier
                  </span>
                  <div className="flex flex-col gap-1 text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
                      <span>NIRF Top 100</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]"></span>
                      <span>NIRF Ranked</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#94A3B8]"></span>
                      <span>State Affiliated</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Floating Right Inspector Card (Matching Supermemory screenshot media_1789764505375.png) */}
        {selectedNode && (
          <div className="absolute top-5 right-5 z-30 w-[330px] bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xl animate-in fade-in slide-in-from-right-3 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200/60 flex items-center justify-center">
                  <Building className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase text-slate-400 block leading-none">
                    {selectedNode.category === 'hub' ? 'State Cluster' : 'Institution Node'}
                  </span>
                  <span className="text-[13px] font-bold text-slate-800">Details</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Institution Content */}
            <div className="flex flex-col gap-3 text-[12.5px]">
              <div>
                <h3 className="text-[15px] font-bold text-slate-900 leading-snug">
                  {selectedNode.name}
                </h3>
                <div className="flex items-center gap-1.5 text-slate-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {selectedNode.city ? `${selectedNode.city}, ` : ''}
                    {selectedNode.state}
                  </span>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5">
                {selectedNode.type && (
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                    {selectedNode.type}
                  </span>
                )}
                {selectedNode.nirfRank && (
                  <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded text-[11px] font-bold">
                    NIRF #{selectedNode.nirfRank}
                  </span>
                )}
                {selectedNode.naacGrade && (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-bold">
                    NAAC {selectedNode.naacGrade}
                  </span>
                )}
              </div>

              {/* Package stats */}
              {selectedNode.medianPackage && (
                <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                  <span className="text-[10.5px] font-bold uppercase text-slate-400 block">
                    Median Salary Package
                  </span>
                  <span className="text-[14px] font-bold text-slate-800 font-mono">
                    {selectedNode.medianPackage.toFixed(1)} LPA
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 mt-1">
                {selectedNode.category === 'institution' && (
                  <>
                    <Link
                      href={`/colleges/${selectedNode.id}`}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[13px] transition-colors shadow-xs"
                    >
                      <span>Open Complete Dossier</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={() => handleSaveToShortlist(selectedNode)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-[13px] transition-colors"
                    >
                      <BookmarkPlus className="w-3.5 h-3.5" />
                      <span>Save to Shortlist</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}
