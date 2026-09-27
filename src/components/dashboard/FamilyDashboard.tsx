import React from 'react';
import { 
  Users, 
  GitFork, 
  Calendar, 
  Clock, 
  BookOpen, 
  Image as ImageIcon, 
  FileText, 
  Sparkles,
  ArrowRight,
  Plus,
  Compass,
  MapPin,
  Heart
} from 'lucide-react';
import { 
  FamilySpace, 
  FamilyMember, 
  FamilyEvent, 
  FamilyMemory, 
  FamilyPhoto, 
  FamilyDocument, 
  ActivityLog, 
  User 
} from '../../types';

interface FamilyDashboardProps {
  family: FamilySpace;
  currentUser: User;
  members: FamilyMember[];
  events: FamilyEvent[];
  memories: FamilyMemory[];
  photos: FamilyPhoto[];
  documents: FamilyDocument[];
  activities: ActivityLog[];
  onNavigateTab: (tab: any) => void;
  onSelectMember: (m: FamilyMember) => void;
  onOpenAddMemberModal: () => void;
  onOpenSearchModal: () => void;
  onOpenInterviewModal: () => void;
}

export const FamilyDashboard: React.FC<FamilyDashboardProps> = ({
  family,
  currentUser,
  members,
  events,
  memories,
  photos,
  documents,
  activities,
  onNavigateTab,
  onSelectMember,
  onOpenAddMemberModal,
  onOpenSearchModal,
  onOpenInterviewModal,
}) => {
  // Compute overview metrics
  const totalMembers = members.length;
  const maxGeneration = Math.max(...members.map(m => m.generation || 1), 1);
  
  // Oldest known ancestor
  const oldestAncestor = [...members]
    .filter(m => m.birthDate)
    .sort((a, b) => (a.birthDate || '').localeCompare(b.birthDate || ''))[0];

  // Newest family member
  const newestMember = [...members]
    .filter(m => m.birthDate)
    .sort((a, b) => (b.birthDate || '').localeCompare(a.birthDate || ''))[0];

  // Featured memory
  const featuredMemory = memories[0];

  // Upcoming events sorted by date
  const upcomingEvents = [...events].slice(0, 3);

  // Recently added items
  const recentMembers = [...members].slice(-3).reverse();

  return (
    <div className="mx-auto max-w-6xl p-6 sm:p-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E6E3DA] pb-6">
        <div>
          <span className="text-xs font-serif italic text-[#78716C]">
            Arsip Trah & Silsilah
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1C1917] mt-1">
            Selamat datang kembali, {currentUser.displayName}
          </h1>
          <div className="mt-2 flex items-center gap-2 text-xs text-[#57534E]">
            <MapPin className="h-3.5 w-3.5 text-[#2D5A46]" />
            <span>{family.name}</span>
            <span className="text-[#D6CEBE]">·</span>
            <span>{family.originCity}, {family.originProvince}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenInterviewModal}
            className="flex items-center gap-1.5 rounded-lg border border-[#D5E3DA] bg-[#F4F8F5] px-3 py-2 text-xs font-medium text-[#1E3A2F] hover:bg-[#EAF1EC] transition"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#2D5A46]" />
            <span>Panduan Wawancara</span>
          </button>

          <button
            onClick={() => onNavigateTab('silsilah')}
            className="flex items-center gap-1.5 rounded-lg bg-[#1E3A2F] px-4 py-2 text-xs font-medium text-white hover:bg-[#284E3F] transition shadow-xs"
          >
            <GitFork className="h-4 w-4" />
            <span>Jelajahi Pohon Silsilah</span>
          </button>
        </div>
      </div>

      {/* 1. Understated Family Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-xl border border-[#E6E3DA] bg-white p-4">
          <div className="text-[11px] font-medium text-[#78716C] uppercase tracking-wider">
            Total Kerabat
          </div>
          <div className="font-mono text-2xl font-semibold text-[#1C1917] mt-1 tabular-nums">
            {totalMembers}
          </div>
          <div className="text-[11px] text-[#A8A29E] mt-0.5">
            Jiwa tercatat
          </div>
        </div>

        <div className="rounded-xl border border-[#E6E3DA] bg-white p-4">
          <div className="text-[11px] font-medium text-[#78716C] uppercase tracking-wider">
            Rentang Generasi
          </div>
          <div className="font-mono text-2xl font-semibold text-[#1C1917] mt-1 tabular-nums">
            {maxGeneration}
          </div>
          <div className="text-[11px] text-[#A8A29E] mt-0.5">
            Generasi terdokumentasi
          </div>
        </div>

        <div className="rounded-xl border border-[#E6E3DA] bg-white p-4">
          <div className="text-[11px] font-medium text-[#78716C] uppercase tracking-wider">
            Sesepuh Tertua
          </div>
          <div className="text-sm font-semibold text-[#1C1917] mt-1 truncate">
            {oldestAncestor ? `${oldestAncestor.firstName} ${oldestAncestor.lastName || ''}` : '–'}
          </div>
          <div className="font-mono text-[11px] text-[#78716C] mt-0.5 tabular-nums">
            {oldestAncestor?.birthDate ? `Lahir ${oldestAncestor.birthDate.split('-')[0]}` : ''}
          </div>
        </div>

        <div className="rounded-xl border border-[#E6E3DA] bg-white p-4">
          <div className="text-[11px] font-medium text-[#78716C] uppercase tracking-wider">
            Anggota Termuda
          </div>
          <div className="text-sm font-semibold text-[#1C1917] mt-1 truncate">
            {newestMember ? `${newestMember.firstName} ${newestMember.lastName || ''}` : '–'}
          </div>
          <div className="font-mono text-[11px] text-[#78716C] mt-0.5 tabular-nums">
            {newestMember?.birthDate ? `Lahir ${newestMember.birthDate.split('-')[0]}` : ''}
          </div>
        </div>
      </div>

      {/* Main Grid: Story Highlight & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Editorial Story Highlight */}
        {featuredMemory && (
          <div className="lg:col-span-2 rounded-2xl border border-[#E6E3DA] bg-white p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EDE6]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#2D5A46] uppercase tracking-wider">
                <BookOpen className="h-4 w-4" />
                <span>Sorotan Kisah Keluarga</span>
              </div>
              <button
                onClick={() => onNavigateTab('kenangan')}
                className="text-xs font-medium text-[#1E3A2F] hover:underline flex items-center gap-1"
              >
                <span>Lihat Semua Kenangan</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="mt-4 flex flex-col md:flex-row gap-5 items-start">
              {featuredMemory.photoUrls?.[0] && (
                <div className="w-full md:w-56 h-40 shrink-0 overflow-hidden rounded-xl border border-[#E6E3DA] bg-[#F5F2EB]">
                  <img
                    src={featuredMemory.photoUrls[0]}
                    alt={featuredMemory.title}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              <div className="flex-1">
                <div className="flex items-center gap-2 text-xs text-[#78716C] font-mono">
                  <span>{featuredMemory.date}</span>
                  {featuredMemory.location && (
                    <>
                      <span>·</span>
                      <span>{featuredMemory.location}</span>
                    </>
                  )}
                </div>

                <h2 className="font-serif text-lg font-bold text-[#1C1917] mt-1.5 leading-snug">
                  {featuredMemory.title}
                </h2>

                <p className="font-serif text-xs text-[#44403C] mt-2 line-clamp-3 leading-relaxed">
                  {featuredMemory.story}
                </p>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#F5F2EB]">
                  <span className="text-[11px] text-[#78716C]">
                    Ditulis oleh: <span className="font-medium text-[#1C1917]">{featuredMemory.authorName}</span>
                  </span>
                  <button
                    onClick={() => onNavigateTab('kenangan')}
                    className="text-xs font-medium text-[#1E3A2F] hover:underline"
                  >
                    Baca Selengkapnya
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right 1 Col: Upcoming Family Events */}
        <div className="rounded-2xl border border-[#E6E3DA] bg-white p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0EDE6]">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1C1917] uppercase tracking-wider">
              <Calendar className="h-4 w-4 text-[#2D5A46]" />
              <span>Agenda Mendatang</span>
            </div>
            <button
              onClick={() => onNavigateTab('acara')}
              className="text-xs text-[#1E3A2F] hover:underline"
            >
              Kalender
            </button>
          </div>

          <div className="mt-4 flex-1 space-y-3">
            {upcomingEvents.map(evt => (
              <div
                key={evt.id}
                className="rounded-xl border border-[#EBE7DF] bg-[#FAF8F5] p-3 text-xs"
              >
                <div className="flex items-center justify-between text-[#78716C] text-[11px]">
                  <span className="font-mono font-medium text-[#2D5A46]">{evt.date}</span>
                  <span>{evt.type === 'BIRTHDAY' ? 'Ulang Tahun' : evt.type === 'MEMORIAL' ? 'Mengenang' : 'Silaturahmi'}</span>
                </div>
                <div className="font-semibold text-[#1C1917] mt-1 leading-snug">
                  {evt.title}
                </div>
                {evt.location && (
                  <div className="text-[11px] text-[#78716C] mt-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{evt.location}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Activity Audit & Recently Added */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Family Activity Audit */}
        <div className="rounded-2xl border border-[#E6E3DA] bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0EDE6]">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1C1917] uppercase tracking-wider">
              <Clock className="h-4 w-4 text-[#2D5A46]" />
              <span>Aktivitas Pembaruan Terkini</span>
            </div>
            <span className="text-[11px] text-[#A8A29E]">Audit Log</span>
          </div>

          <div className="mt-4 space-y-3">
            {activities.slice(0, 4).map(act => (
              <div key={act.id} className="flex items-start gap-3 text-xs border-b border-[#FAF8F5] pb-2.5 last:border-none">
                <div className="h-2 w-2 rounded-full bg-[#2D5A46] mt-1.5 shrink-0" />
                <div className="flex-1">
                  <div className="text-[#1C1917] leading-relaxed">
                    <span className="font-semibold">{act.actorName}</span>: {act.details}
                  </div>
                  <div className="font-mono text-[10px] text-[#A8A29E] mt-0.5">
                    {new Date(act.timestamp).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Recently Added Members / Shortcuts */}
        <div className="rounded-2xl border border-[#E6E3DA] bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0EDE6]">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1C1917] uppercase tracking-wider">
              <Users className="h-4 w-4 text-[#2D5A46]" />
              <span>Anggota Terakhir Ditambahkan</span>
            </div>
            <button
              onClick={onOpenAddMemberModal}
              className="text-xs text-[#1E3A2F] font-medium hover:underline flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah</span>
            </button>
          </div>

          <div className="mt-4 space-y-2.5">
            {recentMembers.map(m => (
              <div
                key={m.id}
                onClick={() => onSelectMember(m)}
                className="flex items-center justify-between rounded-xl border border-[#E6E3DA] p-2.5 hover:bg-[#FAF8F5] transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-[#EBE7DF] overflow-hidden flex items-center justify-center font-serif text-xs font-semibold text-[#57534E]">
                    {m.profilePhotoUrl ? (
                      <img src={m.profilePhotoUrl} alt={m.firstName} className="h-full w-full object-cover" />
                    ) : (
                      m.firstName[0]
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#1C1917]">
                      {m.firstName} {m.lastName || ''}
                    </div>
                    <div className="text-[11px] text-[#78716C]">
                      {m.birthPlace || 'Kota asal belum dicatat'} · Gen {m.generation}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-[#1E3A2F] font-medium hover:underline">
                    Lihat Profil
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
