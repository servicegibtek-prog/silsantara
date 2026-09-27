import React, { useState, useMemo } from 'react';
import { Clock, Calendar, Heart, Award, MapPin, Sparkles, Filter } from 'lucide-react';
import { FamilyMember, Relationship, FamilyEvent, FamilyMemory } from '../../types';

interface FamilyTimelineProps {
  members: FamilyMember[];
  relationships: Relationship[];
  events: FamilyEvent[];
  memories: FamilyMemory[];
}

interface TimelineItem {
  id: string;
  year: number;
  dateStr: string;
  type: 'BIRTH' | 'DEATH' | 'MARRIAGE' | 'EVENT' | 'MEMORY';
  title: string;
  description?: string;
  location?: string;
  involvedPeople: string[];
}

export const FamilyTimeline: React.FC<FamilyTimelineProps> = ({
  members,
  relationships,
  events,
  memories,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedPersonId, setSelectedPersonId] = useState<string>('all');

  const timelineItems: TimelineItem[] = useMemo(() => {
    const list: TimelineItem[] = [];

    // 1. Births
    members.forEach(m => {
      if (m.birthDate) {
        const year = parseInt(m.birthDate.split('-')[0], 10);
        if (!isNaN(year)) {
          list.push({
            id: `birt_${m.id}`,
            year,
            dateStr: m.birthDate,
            type: 'BIRTH',
            title: `${m.firstName} ${m.lastName || ''} Lahir`,
            description: `Lahir ke dunia sebagai bagian dari silsilah generasi ke-${m.generation}.`,
            location: m.birthPlace,
            involvedPeople: [`${m.firstName} ${m.lastName || ''}`]
          });
        }
      }
    });

    // 2. Deaths
    members.forEach(m => {
      if (!m.isLiving && m.deathDate) {
        const year = parseInt(m.deathDate.split('-')[0], 10);
        if (!isNaN(year)) {
          list.push({
            id: `deat_${m.id}`,
            year,
            dateStr: m.deathDate,
            type: 'DEATH',
            title: `${m.firstName} ${m.lastName || ''} Berpulang ke Rahmatullah`,
            description: `Telah mendahului keluarga dengan warisan teladan kebaikan yang tak ternilai.`,
            location: m.deathPlace,
            involvedPeople: [`${m.firstName} ${m.lastName || ''}`]
          });
        }
      }
    });

    // 3. Marriages
    relationships.filter(r => r.type === 'SPOUSE' && r.startDate).forEach(r => {
      const year = parseInt(r.startDate!.split('-')[0], 10);
      const personA = members.find(m => m.id === r.personAId);
      const personB = members.find(m => m.id === r.personBId);
      if (!isNaN(year) && personA && personB) {
        list.push({
          id: `marr_${r.id}`,
          year,
          dateStr: r.startDate!,
          type: 'MARRIAGE',
          title: `Pernikahan ${personA.firstName} dan ${personB.firstName}`,
          description: r.notes || `Pernikahan yang menyatukan dua rumpun keluarga.`,
          involvedPeople: [personA.firstName, personB.firstName]
        });
      }
    });

    // 4. Events
    events.forEach(e => {
      const year = parseInt(e.date.split('-')[0], 10);
      if (!isNaN(year)) {
        list.push({
          id: `evt_${e.id}`,
          year,
          dateStr: e.date,
          type: 'EVENT',
          title: e.title,
          description: e.description,
          location: e.location,
          involvedPeople: []
        });
      }
    });

    // 5. Memories
    memories.filter(m => m.date).forEach(m => {
      const year = parseInt(m.date!.split('-')[0], 10);
      if (!isNaN(year)) {
        list.push({
          id: `mem_${m.id}`,
          year,
          dateStr: m.date!,
          type: 'MEMORY',
          title: m.title,
          description: m.story,
          location: m.location,
          involvedPeople: [m.authorName]
        });
      }
    });

    // Sort chronologically ascending
    return list.sort((a, b) => a.year - b.year || a.dateStr.localeCompare(b.dateStr));
  }, [members, relationships, events, memories]);

  const filteredItems = timelineItems.filter(item => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-4xl p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E3DA] pb-5">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-[#1C1917]">
            Linimasa Sejarah Keluarga
          </h1>
          <p className="text-xs text-[#78716C] mt-1">
            Rekam jejak kronologis peristiwa kelahiran, pernikahan, pencapaian, dan kenangan keluarga
          </p>
        </div>

        {/* Filter select */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[#78716C]" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-xl border border-[#E6E3DA] bg-white px-3 py-1.5 text-xs text-[#44403C] focus:border-[#1E3A2F] focus:outline-none"
          >
            <option value="all">Semua Peristiwa ({timelineItems.length})</option>
            <option value="BIRTH">Kelahiran</option>
            <option value="MARRIAGE">Pernikahan</option>
            <option value="MEMORY">Kenangan & Cerita</option>
            <option value="DEATH">Kewafatan</option>
          </select>
        </div>
      </div>

      {/* Editorial Timeline Stream */}
      <div className="relative border-l-2 border-[#E6E3DA] ml-6 sm:ml-12 pl-6 sm:pl-8 space-y-8 my-8">
        {filteredItems.map(item => {
          let badgeColor = 'bg-[#1E3A2F]';
          if (item.type === 'MARRIAGE') badgeColor = 'bg-rose-600';
          if (item.type === 'MEMORY') badgeColor = 'bg-amber-600';
          if (item.type === 'DEATH') badgeColor = 'bg-[#78716C]';

          return (
            <div key={item.id} className="relative group">
              {/* Dot on the timeline spine */}
              <div className={`absolute -left-[31px] sm:-left-[39px] top-1.5 h-3.5 w-3.5 rounded-full ${badgeColor} ring-4 ring-white shadow-xs`} />

              {/* Year Stamp */}
              <div className="font-mono text-xs font-bold text-[#1E3A2F] tracking-wide">
                {item.year}
                <span className="ml-2 font-normal text-[#78716C] text-[11px] font-sans">
                  {item.dateStr !== item.year.toString() ? item.dateStr : ''}
                </span>
              </div>

              {/* Card Container */}
              <div className="mt-1 rounded-2xl border border-[#E6E3DA] bg-white p-5 shadow-xs transition hover:border-[#1E3A2F]/40 hover:shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-serif text-base font-bold text-[#1C1917]">
                    {item.title}
                  </h2>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-[#78716C] rounded-md bg-[#FAF8F5] px-2 py-0.5 border border-[#EBE7DF]">
                    {item.type === 'BIRTH' ? 'Kelahiran' : item.type === 'MARRIAGE' ? 'Pernikahan' : item.type === 'MEMORY' ? 'Kenangan' : 'Kewafatan'}
                  </span>
                </div>

                {item.location && (
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-[#78716C]">
                    <MapPin className="h-3.5 w-3.5 text-[#A8A29E]" />
                    <span>{item.location}</span>
                  </div>
                )}

                {item.description && (
                  <p className="font-serif text-xs leading-relaxed text-[#44403C] mt-2 line-clamp-3">
                    {item.description}
                  </p>
                )}

                {item.involvedPeople.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-[#F5F2EB] text-[11px] text-[#78716C]">
                    Terkait: <span className="font-medium text-[#1C1917]">{item.involvedPeople.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
