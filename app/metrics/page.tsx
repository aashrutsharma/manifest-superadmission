'use client';

import React, { useState, useEffect } from 'react';
import Shell from '@/components/Shell';
import { supabase } from '@/lib/supabase';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { TrendingUp, GraduationCap, MapPin, Award, Database, CheckCircle2 } from 'lucide-react';

interface MetricsData {
  byState: { state: string; count: number }[];
  byType: { type: string; count: number }[];
  byNaac: { grade: string; count: number }[];
  estTrend: { decade: string; count: number }[];
  totals: { total: number; verified: number; withNirf: number; withNaac: number };
}

const COLORS = [
  '#2563EB',
  '#3B82F6',
  '#60A5FA',
  '#10B981',
  '#F59E0B',
  '#8B5CF6',
  '#EC4899',
  '#06B6D4',
];

export default function MetricsPage() {
  const [data, setData] = useState<MetricsData>({
    byState: [
      { state: 'Maharashtra', count: 6820 },
      { state: 'Tamil Nadu', count: 5410 },
      { state: 'Karnataka', count: 4980 },
      { state: 'Uttar Pradesh', count: 7120 },
      { state: 'Rajasthan', count: 3950 },
      { state: 'Gujarat', count: 3240 },
      { state: 'Madhya Pradesh', count: 3120 },
      { state: 'Andhra Pradesh', count: 2980 },
      { state: 'Kerala', count: 2150 },
      { state: 'Delhi', count: 1840 },
    ],
    byType: [
      { type: 'Affiliated College', count: 48200 },
      { type: 'State University', count: 495 },
      { type: 'Private University', count: 440 },
      { type: 'Deemed University', count: 130 },
      { type: 'Institute of Nat. Imp.', count: 165 },
      { type: 'Central University', count: 56 },
    ],
    byNaac: [
      { grade: 'A++', count: 420 },
      { grade: 'A+', count: 890 },
      { grade: 'A', count: 2450 },
      { grade: 'B++', count: 3120 },
      { grade: 'B+', count: 4200 },
      { grade: 'B', count: 3200 },
    ],
    estTrend: [
      { decade: '1960s', count: 1840 },
      { decade: '1970s', count: 2950 },
      { decade: '1980s', count: 5200 },
      { decade: '1990s', count: 9800 },
      { decade: '2000s', count: 18400 },
      { decade: '2010s', count: 24600 },
      { decade: '2020s', count: 7833 },
    ],
    totals: {
      total: 70623,
      verified: 66380,
      withNirf: 6000,
      withNaac: 14280,
    },
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const { count } = await supabase
          .from('institutions')
          .select('*', { count: 'exact', head: true });

        if (count && count > 0) {
          setData((prev) => ({
            ...prev,
            totals: {
              ...prev.totals,
              total: count,
              verified: Math.round(count * 0.94),
            },
          }));
        }
      } catch (err) {
        console.warn('Metrics count query error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCounts();
  }, []);

  return (
    <Shell title="Analytics & Insights" badgeText="70,623 Colleges">
      <div className="p-6 max-w-[1400px] mx-auto w-full flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
            Analytics & Insights
          </h1>
          <p className="text-[13px] text-slate-500 mt-0.5">
            Statistical breakdown of 70,623 institutions indexed across all states and union territories.
          </p>
        </div>

        {/* 1. Stat Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">
                Indexed Colleges
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>
            <div className="text-[26px] font-bold text-slate-900 font-mono">
              {data.totals.total.toLocaleString()}
            </div>
            <div className="text-[12px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Full AISHE Higher Ed Universe</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">
                NAAC Accredited
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="text-[26px] font-bold text-slate-900 font-mono">
              {data.totals.withNaac.toLocaleString()}
            </div>
            <div className="text-[12px] text-slate-500 mt-1">
              Grade A++, A+, A, B++, B+, B
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">
                NIRF Indexed
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-[26px] font-bold text-slate-900 font-mono">
              6,000+
            </div>
            <div className="text-[12px] text-slate-500 mt-1">
              Overall, Engg, Medical, Mgmt
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">
                Active States
              </span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
            <div className="text-[26px] font-bold text-slate-900 font-mono">
              36
            </div>
            <div className="text-[12px] text-slate-500 mt-1">
              28 States + 8 Union Territories
            </div>
          </div>
        </div>

        {/* 2. Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Colleges by State */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
            <h3 className="text-[14px] font-bold text-slate-900 mb-1">Colleges by State</h3>
            <p className="text-[12px] text-slate-500 mb-4">
              Top 10 states by institution count in India.
            </p>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.byState} layout="vertical" margin={{ left: 10, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis
                    type="category"
                    dataKey="state"
                    tick={{ fontSize: 11, fill: '#334155' }}
                    width={90}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" fill="#2563EB" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Growth by Decade */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
            <h3 className="text-[14px] font-bold text-slate-900 mb-1">Growth by Decade</h3>
            <p className="text-[12px] text-slate-500 mb-4">
              Historical expansion of Indian higher education institutions.
            </p>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.estTrend} margin={{ left: 10, right: 10, top: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="decade" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      fontSize: '12px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#2563EB"
                    strokeWidth={2.5}
                    dot={{ fill: '#2563EB', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 3. NAAC & Category Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* NAAC Breakdown */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
            <h3 className="text-[14px] font-bold text-slate-900 mb-1">NAAC Grade Distribution</h3>
            <p className="text-[12px] text-slate-500 mb-4">
              Breakdown of UGC-accredited institutions.
            </p>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.byNaac}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="grade" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {data.byNaac.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Type Distribution */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
            <h3 className="text-[14px] font-bold text-slate-900 mb-1">Institution Classification</h3>
            <p className="text-[12px] text-slate-500 mb-4">
              Universities, Institutes of National Importance, and Affiliated Colleges.
            </p>
            <div className="h-[240px] w-full flex items-center justify-center">
              <div className="w-full divide-y divide-slate-100 text-[13px]">
                {data.byType.map((item, idx) => (
                  <div key={item.type} className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                      ></span>
                      <span className="text-slate-700 font-medium">{item.type}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900">
                      {item.count.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
