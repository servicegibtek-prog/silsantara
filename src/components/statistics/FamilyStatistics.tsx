import React from 'react';
import { BarChart2, Users, MapPin, Heart, Calendar, Award } from 'lucide-react';
import { FamilyMember, Relationship } from '../../types';

interface FamilyStatisticsProps {
  members: FamilyMember[];
  relationships: Relationship[];
}

export const FamilyStatistics: React.FC<FamilyStatisticsProps> = ({
  members,
  relationships,
}) => {
  const total = members.length;
  const living = members.filter(m => m.isLiving).length;
  const deceased = total - living;
  const males = members.filter(m => m.gender === 'male').length;
  const females = members.filter(m => m.gender === 'female').length;

  // By generation
  const genCounts: Record<number, number> = {};
  members.forEach(m => {
    const g = m.generation || 1;
    genCounts[g] = (genCounts[g] || 0) + 1;
  });

  // Common birth cities
  const cityCounts: Record<string, number> = {};
  members.forEach(m => {
    if (m.birthPlace) {
      const city = m.birthPlace.split(',')[0].trim();
      cityCounts[city] = (cityCounts[city] || 0) + 1;
    }
  });

  const sortedCities = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]);

  // Average children per marriage
  const marriageCount = relationships.filter(r => r.type === 'SPOUSE').length;
  const avgChildren = marriageCount > 0 ? ((total - 2) / marriageCount).toFixed(1) : '–';

  return (
    <div className="mx-auto max-w-5xl p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="border-b border-[#E6E3DA] pb-5">
        <h1 className="font-serif text-2xl font-bold tracking-tight text-[#1C1917]">
          Statistik & Demografi Silsilah
        </h1>
        <p className="text-xs text-[#78716C] mt-1">
          Analisis genealogis mengenai persebaran generasi, perbandingan demografi, dan kota asal rumpun
        </p>
      </div>

      {/* Understated Overview Numbers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#E6E3DA] bg-white p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wider">
            Total Jiwa Tercatat
          </div>
          <div className="font-mono text-2xl font-bold text-[#1C1917] mt-1 tabular-nums">
            {total}
          </div>
          <div className="text-[11px] text-[#78716C] mt-0.5">
            {living} hidup · {deceased} wafat
          </div>
        </div>

        <div className="rounded-xl border border-[#E6E3DA] bg-white p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wider">
            Rasio Gender
          </div>
          <div className="font-mono text-2xl font-bold text-[#1C1917] mt-1 tabular-nums">
            {males} : {females}
          </div>
          <div className="text-[11px] text-[#78716C] mt-0.5">
            {Math.round((males / total) * 100)}% pria · {Math.round((females / total) * 100)}% wanita
          </div>
        </div>

        <div className="rounded-xl border border-[#E6E3DA] bg-white p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wider">
            Kedalaman Silsilah
          </div>
          <div className="font-mono text-2xl font-bold text-[#1C1917] mt-1 tabular-nums">
            {Object.keys(genCounts).length} Generasi
          </div>
          <div className="text-[11px] text-[#78716C] mt-0.5">
            Rentang lebih dari 80 tahun
          </div>
        </div>

        <div className="rounded-xl border border-[#E6E3DA] bg-white p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wider">
            Rata-rata Anak / Pasangan
          </div>
          <div className="font-mono text-2xl font-bold text-[#1C1917] mt-1 tabular-nums">
            {avgChildren}
          </div>
          <div className="text-[11px] text-[#78716C] mt-0.5">
            Dari {marriageCount} ikatan pernikahan
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Generational Breakdown */}
        <div className="rounded-2xl border border-[#E6E3DA] bg-white p-6 shadow-xs">
          <h2 className="font-serif text-base font-bold text-[#1C1917] mb-4">
            Persebaran Anggota per Generasi
          </h2>
          <div className="space-y-3">
            {Object.entries(genCounts).map(([gen, count]) => {
              const pct = Math.round((count / total) * 100);
              return (
                <div key={gen} className="space-y-1 text-xs">
                  <div className="flex justify-between text-[#44403C]">
                    <span className="font-medium">Generasi {gen}</span>
                    <span className="font-mono tabular-nums text-[#78716C]">{count} jiwa ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#FAF8F5] overflow-hidden border border-[#EBE7DF]">
                    <div
                      className="h-full rounded-full bg-[#2D5A46] transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Origin Cities */}
        <div className="rounded-2xl border border-[#E6E3DA] bg-white p-6 shadow-xs">
          <h2 className="font-serif text-base font-bold text-[#1C1917] mb-4">
            Kota Asal Kelahiran Terbanyak
          </h2>
          <div className="space-y-3">
            {sortedCities.slice(0, 5).map(([city, count]) => {
              const pct = Math.round((count / total) * 100);
              return (
                <div key={city} className="space-y-1 text-xs">
                  <div className="flex justify-between text-[#44403C]">
                    <span className="font-medium flex items-center gap-1.5">
                      <MapPin className="h-3 w-3 text-[#2D5A46]" />
                      <span>{city}</span>
                    </span>
                    <span className="font-mono tabular-nums text-[#78716C]">{count} orang</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#FAF8F5] overflow-hidden border border-[#EBE7DF]">
                    <div
                      className="h-full rounded-full bg-[#8C6D46] transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
