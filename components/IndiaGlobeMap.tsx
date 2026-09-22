'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { Map as LeafletMap, LayerGroup } from 'leaflet';
import * as d3 from 'd3';
import { College } from '@/lib/types';
import { EDUCATION_HUBS, EducationHub } from '@/lib/geo';
import { Globe, Map } from 'lucide-react';


interface IndiaGlobeMapProps {
  colleges: College[];
  selectedCollege: College | null;
  onSelectCollege: (college: College) => void;
  activeHub: EducationHub | null;
  resetViewTrigger: number;
}

export default function IndiaGlobeMap({
  colleges,
  selectedCollege,
  onSelectCollege,
  activeHub,
  resetViewTrigger,
}: IndiaGlobeMapProps) {
  const [mapMode, setMapMode] = useState<'2d' | '3d'>('2d');

  // Leaflet 2D Refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markersLayerRef = useRef<LayerGroup | null>(null);
  const hubsLayerRef = useRef<LayerGroup | null>(null);

  // 3D Canvas Ref
  const canvas3dRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef<[number, number]>([-78.9, -21.8]);

  // ==========================================
  // 1. Leaflet 2D Setup (Esri Light Gray - ZERO WATERMARKS)
  // ==========================================
  useEffect(() => {
    if (mapMode !== '2d') return;
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    let isMounted = true;

    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: '',
        iconUrl: '',
        shadowUrl: '',
      });

      // Esri World Light Gray Base (The SaaS Gold Standard - completely free, NO API key required)
      const map = L.map(mapContainerRef.current, {
        center: [21.8, 79.2],
        zoom: 5.2,
        minZoom: 4,
        maxZoom: 16,
        zoomControl: false,
        attributionControl: false,
      });

      // Base layer: Soft light gray landmass & clean white water
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 16,
          attribution: 'Esri &copy; OpenStreetMap',
        }
      ).addTo(map);

      // Reference labels: Crisp modern labels
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 16,
        }
      ).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      const hubsGroup = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
      markersLayerRef.current = markersGroup;
      hubsLayerRef.current = hubsGroup;

      // Render Hub boundary circles
      EDUCATION_HUBS.forEach((hub) => {
        const circle = L.circle(hub.center, {
          radius: hub.id === 'tamil-nadu' ? 90000 : hub.id === 'mumbai-pune' ? 80000 : 45000,
          color: '#0b53c3',
          weight: 1.5,
          opacity: 0.45,
          fillColor: '#0b53c3',
          fillOpacity: 0.05,
          dashArray: '4, 6',
        });

        circle.bindTooltip(
          `
          <div style="font-family: Inter, sans-serif; font-size: 11px; font-weight: 700; color: #0b53c3; padding: 2px 4px;">
            ${hub.name} (${hub.count.toLocaleString()} institutions)
          </div>
        `,
          { permanent: false, direction: 'top', className: 'hub-map-tooltip' }
        );

        circle.addTo(hubsGroup);
      });
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapMode]);

  // Update Markers when colleges list or selected college changes (2D)
  useEffect(() => {
    if (mapMode !== '2d') return;
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    import('leaflet').then((L) => {
      markersGroup.clearLayers();

      colleges.forEach((college) => {
        if (!college.lat || !college.lng) return;

        const isSelected = selectedCollege?.id === college.id;
        const isTop10 = college.nirfOverallRank && college.nirfOverallRank <= 10;
        const isTop50 = college.nirfOverallRank && college.nirfOverallRank <= 50;

        const markerHtml = `
          <div class="relative flex items-center justify-center cursor-pointer transition-transform hover:scale-125 ${
            isSelected ? 'scale-125 z-50' : ''
          }">
            ${
              isTop10
                ? '<div class="absolute -inset-2 rounded-full bg-[#0b53c3]/20 animate-ping pointer-events-none"></div>'
                : ''
            }
            <div class="relative flex items-center justify-center rounded-xl shadow-md border-2 border-white text-white font-bold transition-all ${
              isSelected
                ? 'w-7 h-7 bg-[#0b53c3] ring-4 ring-[#0b53c3]/30 z-50 text-[11px]'
                : isTop10
                ? 'w-6 h-6 bg-[#0b53c3] text-[10px]'
                : isTop50
                ? 'w-5 h-5 bg-[#1d4ed8] text-[9px]'
                : 'w-4 h-4 bg-[#2563eb] text-[0px]'
            }">
              ${college.nirfOverallRank && college.nirfOverallRank <= 50 ? college.nirfOverallRank : ''}
            </div>
          </div>
        `;

        const icon = L.divIcon({
          className: 'custom-college-marker',
          html: markerHtml,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([college.lat, college.lng], { icon });

        // Tooltip
        const tooltipHtml = `
          <div style="font-family: Inter, sans-serif; padding: 4px 6px; min-width: 150px;">
            <div style="font-weight: 700; font-size: 12px; color: #0f172a; line-height: 1.2;">${
              college.shortName || college.name
            }</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 2px;">${college.city}, ${college.state}</div>
            <div style="margin-top: 4px; display: flex; align-items: center; gap: 4px;">
              ${
                college.nirfOverallRank
                  ? `<span style="background: #0b53c3; color: white; padding: 1px 6px; border-radius: 4px; font-size: 10px; font-weight: 700;">NIRF #${college.nirfOverallRank}</span>`
                  : ''
              }
              ${
                college.naacGrade && college.naacGrade !== 'NA'
                  ? `<span style="background: #e2e8f0; color: #334155; padding: 1px 6px; border-radius: 4px; font-size: 10px; font-weight: 600;">NAAC ${college.naacGrade}</span>`
                  : ''
              }
            </div>
          </div>
        `;

        marker.bindTooltip(tooltipHtml, {
          direction: 'top',
          offset: [0, -10],
          className: 'college-map-tooltip',
          opacity: 0.98,
        });

        marker.on('click', () => {
          onSelectCollege(college);
        });

        marker.addTo(markersGroup);
      });
    });
  }, [colleges, selectedCollege, onSelectCollege, mapMode]);

  // Fly to selected college (2D)
  useEffect(() => {
    if (mapMode !== '2d') return;
    const map = mapInstanceRef.current;
    if (!map || !selectedCollege) return;

    if (selectedCollege.lat && selectedCollege.lng) {
      map.flyTo([selectedCollege.lat, selectedCollege.lng], 12, {
        duration: 1.2,
      });
    }
  }, [selectedCollege, mapMode]);

  // Fly to active hub (2D)
  useEffect(() => {
    if (mapMode !== '2d') return;
    const map = mapInstanceRef.current;
    if (!map || !activeHub) return;

    map.flyTo(activeHub.center, activeHub.zoom, {
      duration: 1.2,
    });
  }, [activeHub, mapMode]);

  // Reset view (2D)
  useEffect(() => {
    if (mapMode !== '2d') return;
    const map = mapInstanceRef.current;
    if (!map || resetViewTrigger === 0) return;

    map.flyTo([21.8, 79.2], 5.2, {
      duration: 1.2,
    });
  }, [resetViewTrigger, mapMode]);

  // ==========================================
  // 2. Interactive 3D Globe Mode (D3 Canvas Orthographic)
  // ==========================================
  useEffect(() => {
    if (mapMode !== '3d') return;
    const canvas = canvas3dRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.parentElement?.clientWidth || window.innerWidth;
    let height = canvas.parentElement?.clientHeight || window.innerHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const radius = Math.min(width, height) * 0.38;
    const projection = d3
      .geoOrthographic()
      .scale(radius)
      .translate([width / 2, height / 2])
      .rotate(rotationRef.current)
      .clipAngle(90);

    const path = d3.geoPath(projection, ctx);
    const graticule = d3.geoGraticule10();

    let isDragging = false;
    let startPos: [number, number] = [0, 0];
    let startRotation: [number, number] = rotationRef.current;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Globe Background Ocean Sphere
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, radius, 0, 2 * Math.PI);
      ctx.fillStyle = '#f1f5f9';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#cbd5e1';
      ctx.stroke();

      // Atmospheric Glow
      const glow = ctx.createRadialGradient(
        width / 2,
        height / 2,
        radius * 0.85,
        width / 2,
        height / 2,
        radius * 1.05
      );
      glow.addColorStop(0, 'rgba(11, 83, 195, 0.0)');
      glow.addColorStop(0.8, 'rgba(11, 83, 195, 0.08)');
      glow.addColorStop(1, 'rgba(11, 83, 195, 0.2)');
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, radius * 1.05, 0, 2 * Math.PI);
      ctx.fillStyle = glow;
      ctx.fill();

      // Graticules
      ctx.beginPath();
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 0.75;
      path(graticule);
      ctx.stroke();

      // Plot Colleges on 3D Globe
      colleges.forEach((c) => {
        if (!c.lat || !c.lng) return;
        const coords = projection([c.lng, c.lat]);
        if (!coords) return;

        // Check if visible on front hemisphere
        const rot = projection.rotate();
        const dist = d3.geoDistance([c.lng, c.lat], [-rot[0], -rot[1]]);
        if (dist > Math.PI / 2) return;

        const isSelected = selectedCollege?.id === c.id;
        const isTop = c.nirfOverallRank && c.nirfOverallRank <= 10;

        ctx.beginPath();
        ctx.arc(coords[0], coords[1], isSelected ? 8 : isTop ? 6 : 4, 0, 2 * Math.PI);
        ctx.fillStyle = isSelected ? '#0b53c3' : isTop ? '#1d4ed8' : '#2563eb';
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        // Pulsing outer ring on top colleges
        if (isTop) {
          ctx.beginPath();
          ctx.arc(coords[0], coords[1], 10, 0, 2 * Math.PI);
          ctx.strokeStyle = 'rgba(11, 83, 195, 0.4)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
    };

    render();

    // Drag to rotate handlers
    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      startPos = [e.clientX, e.clientY];
      const r = projection.rotate();
      startRotation = [r[0], r[1]];
    };


    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - startPos[0];
      const dy = e.clientY - startPos[1];
      const sensitivity = 0.3;
      const newRotation: [number, number] = [
        startRotation[0] + dx * sensitivity,
        Math.max(-60, Math.min(60, startRotation[1] - dy * sensitivity)),
      ];
      rotationRef.current = newRotation;
      projection.rotate(newRotation);
      render();
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onResize = () => {
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      projection.translate([width / 2, height / 2]).scale(Math.min(width, height) * 0.38);
      render();
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('resize', onResize);
    canvas.addEventListener('mousedown', onMouseDown);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('mousedown', onMouseDown);
    };
  }, [mapMode, colleges, selectedCollege]);

  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden select-none bg-[#f8fafc]">
      {/* 2D Viewport */}
      {mapMode === '2d' && <div ref={mapContainerRef} className="w-full h-full" />}

      {/* 3D Globe Viewport */}
      {mapMode === '3d' && (
        <div className="relative w-full h-full flex items-center justify-center">
          <canvas ref={canvas3dRef} className="cursor-grab active:cursor-grabbing" />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-slate-500 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
            Drag globe to rotate &middot; Click markers to inspect
          </div>
        </div>
      )}

      {/* View Mode Toggle: 2D Canvas vs 3D Globe */}
      <div className="absolute top-4 right-[320px] z-10 hidden sm:flex items-center gap-1 bg-white/95 backdrop-blur-xl p-1 rounded-2xl border border-slate-200/90 shadow-md">
        <button
          type="button"
          onClick={() => setMapMode('2d')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            mapMode === '2d'
              ? 'bg-[#0b53c3] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Map className="w-3.5 h-3.5" />
          <span>2D Map</span>
        </button>
        <button
          type="button"
          onClick={() => setMapMode('3d')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            mapMode === '3d'
              ? 'bg-[#0b53c3] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>3D Globe</span>
        </button>
      </div>

      {/* Modern Zoom Controls (for 2D) */}
      {mapMode === '2d' && (
        <div className="absolute bottom-6 left-[360px] z-10 hidden sm:flex flex-col gap-1 bg-white/95 backdrop-blur-xl p-1 rounded-2xl border border-slate-200/90 shadow-md">
          <button
            type="button"
            onClick={() => mapInstanceRef.current?.zoomIn()}
            aria-label="Zoom in"
            className="w-8 h-8 flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl text-base font-bold transition-colors"
          >
            +
          </button>
          <div className="h-[1px] bg-slate-200 mx-1" />
          <button
            type="button"
            onClick={() => mapInstanceRef.current?.zoomOut()}
            aria-label="Zoom out"
            className="w-8 h-8 flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl text-base font-bold transition-colors"
          >
            &minus;
          </button>
        </div>
      )}

      <style jsx global>{`
        .custom-college-marker {
          background: transparent;
          border: none;
        }
        .college-map-tooltip {
          background: white !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 14px !important;
          box-shadow: 0 8px 30px -4px rgba(0, 0, 0, 0.12) !important;
          padding: 4px 6px !important;
        }
        .college-map-tooltip::before {
          border-top-color: white !important;
        }
        .hub-map-tooltip {
          background: white !important;
          border: 1.5px solid #0b53c3 !important;
          border-radius: 10px !important;
          padding: 2px 6px !important;
        }
        .leaflet-container {
          background-color: #f1f5f9 !important;
          font-family: 'Inter', -apple-system, sans-serif !important;
        }
      `}</style>
    </div>
  );
}
