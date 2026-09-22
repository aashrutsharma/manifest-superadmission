'use client';

import React, { useEffect, useRef } from 'react';
import type { Map as LeafletMap, LayerGroup } from 'leaflet';
import { College } from '@/lib/types';
import { EDUCATION_HUBS, EducationHub } from '@/lib/geo';

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
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markersLayerRef = useRef<LayerGroup | null>(null);
  const hubsLayerRef = useRef<LayerGroup | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    let isMounted = true;

    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Fix Leaflet default icon path issues
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: '',
        iconUrl: '',
        shadowUrl: '',
      });

      // Initialize map centered on India
      const map = L.map(mapContainerRef.current, {
        center: [21.8, 79.2],
        zoom: 5.2,
        minZoom: 4,
        maxZoom: 16,
        zoomControl: false,
        attributionControl: false,
      });

      // CartoDB Voyager Tile Layer (Modern, crisp, high aesthetic)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      // Attribution control in small subtle font
      L.control.attribution({ position: 'bottomright', prefix: false })
        .addAttribution('&copy; <a href="https://carto.com/" target="_blank" class="text-slate-400 hover:text-slate-600">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" class="text-slate-400 hover:text-slate-600">OSM</a>')
        .addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      const hubsGroup = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
      markersLayerRef.current = markersGroup;
      hubsLayerRef.current = hubsGroup;

      // Render Hub regions
      EDUCATION_HUBS.forEach((hub) => {
        const circle = L.circle(hub.center, {
          radius: hub.id === 'tamil-nadu' ? 95000 : hub.id === 'mumbai-pune' ? 80000 : 45000,
          color: '#0b53c3',
          weight: 1.5,
          opacity: 0.35,
          fillColor: '#0b53c3',
          fillOpacity: 0.05,
          dashArray: '4, 6',
        });

        circle.bindTooltip(`
          <div style="font-family: Inter, sans-serif; font-size: 11px; font-weight: 600; color: #0b53c3;">
            ${hub.name} (${hub.count.toLocaleString()} inst.)
          </div>
        `, { permanent: false, direction: 'top', className: 'hub-map-tooltip' });

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
  }, []);

  // Update Markers when colleges list or selected college changes
  useEffect(() => {
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
          <div class="relative flex items-center justify-center cursor-pointer transition-transform hover:scale-125 ${isSelected ? 'scale-125 z-50' : ''}">
            ${
              isTop10
                ? '<div class="absolute -inset-1.5 rounded-full bg-[#0b53c3]/25 animate-ping pointer-events-none"></div>'
                : ''
            }
            <div class="relative flex items-center justify-center rounded-full shadow-md border border-white text-white font-semibold transition-all ${
              isSelected
                ? 'w-7 h-7 bg-[#0b53c3] ring-4 ring-[#0b53c3]/30 z-50 text-[11px]'
                : isTop10
                ? 'w-6 h-6 bg-[#0b53c3] text-[10px]'
                : isTop50
                ? 'w-5 h-5 bg-[#1d4ed8] text-[9px]'
                : 'w-3.5 h-3.5 bg-[#2563eb] text-[0px]'
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

        // Tooltip with clean Inter typography
        const tooltipHtml = `
          <div style="font-family: Inter, sans-serif; padding: 4px 6px; min-width: 140px;">
            <div style="font-weight: 700; font-size: 12px; color: #0f172a; line-height: 1.2;">${college.shortName || college.name}</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 2px;">${college.city}, ${college.state}</div>
            <div style="margin-top: 4px; display: flex; align-items: center; gap: 4px;">
              ${
                college.nirfOverallRank
                  ? `<span style="background: #0b53c3; color: white; padding: 1px 5px; border-radius: 4px; font-size: 10px; font-weight: 700;">NIRF #${college.nirfOverallRank}</span>`
                  : ''
              }
              ${
                college.naacGrade && college.naacGrade !== 'NA'
                  ? `<span style="background: #e2e8f0; color: #334155; padding: 1px 5px; border-radius: 4px; font-size: 10px; font-weight: 600;">NAAC ${college.naacGrade}</span>`
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
  }, [colleges, selectedCollege, onSelectCollege]);

  // Fly to selected college
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedCollege) return;

    if (selectedCollege.lat && selectedCollege.lng) {
      map.flyTo([selectedCollege.lat, selectedCollege.lng], 12, {
        duration: 1.2,
      });
    }
  }, [selectedCollege]);

  // Fly to active hub
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !activeHub) return;

    map.flyTo(activeHub.center, activeHub.zoom, {
      duration: 1.2,
    });
  }, [activeHub]);

  // Reset to India full view
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || resetViewTrigger === 0) return;

    map.flyTo([21.8, 79.2], 5.2, {
      duration: 1.2,
    });
  }, [resetViewTrigger]);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden select-none">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Modern Zoom Controls at bottom-left */}
      <div className="absolute bottom-6 left-[340px] z-10 hidden sm:flex flex-col gap-1.5 bg-white/90 backdrop-blur-md p-1 rounded-xl border border-slate-200 shadow-sm">
        <button
          type="button"
          onClick={handleZoomIn}
          aria-label="Zoom in"
          className="w-7 h-7 flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-sm font-semibold transition-colors"
        >
          +
        </button>
        <div className="h-[1px] bg-slate-200 mx-1" />
        <button
          type="button"
          onClick={handleZoomOut}
          aria-label="Zoom out"
          className="w-7 h-7 flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-sm font-semibold transition-colors"
        >
          &minus;
        </button>
      </div>

      <style jsx global>{`
        .custom-college-marker {
          background: transparent;
          border: none;
        }
        .college-map-tooltip {
          background: white !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 12px !important;
          box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.12) !important;
          padding: 2px 4px !important;
        }
        .college-map-tooltip::before {
          border-top-color: white !important;
        }
        .hub-map-tooltip {
          background: white !important;
          border: 1px solid #0b53c3 !important;
          border-radius: 8px !important;
          padding: 2px 6px !important;
        }
        .leaflet-container {
          background-color: #f4f6f9 !important;
          font-family: 'Inter', -apple-system, sans-serif !important;
        }
      `}</style>
    </div>
  );
}
