import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  LayoutGrid, 
  List, 
  Plus, 
  Filter, 
  MapPin, 
  Briefcase,
  ArrowRight
} from 'lucide-react';
import { FamilyMember, Gender } from '../../types';

interface MemberDirectoryProps {
  members: FamilyMember[];
  onSelectMember: (m: FamilyMember) => void;
  onOpenAddModal: () => void;
  onNavigateToFullProfile: (memberId: string) => void;
}

export const MemberDirectory: React.FC<MemberDirectoryProps> = ({
  members,
  onSelectMember,
  onOpenAddModal,
  onNavigateToFullProfile,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [generationFilter, setGenerationFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter members
  const filtered = members.filter(m => {
    const q = searchQuery.toLowerCase();
    const nameMatch = `${m.firstName} ${m.middleName || ''} ${m.lastName || ''} ${m.nickname || ''}`.toLowerCase().includes(q);
    const cityMatch = m.birthPlace?.toLowerCase().includes(q) || m.address?.toLowerCase().includes(q);
    const occuMatch = m.occupation?.toLowerCase().includes(q);
    const matchesSearch = !searchQuery || nameMatch || cityMatch || occuMatch;

    const matchesGen = generationFilter === 'all' || m.generation.toString() === generationFilter;
    const matchesGender = genderFilter === 'all' || m.gender === genderFilter;
    const matchesStatus = statusFilter === 'all' 
      ? true 
      : statusFilter === 'living' ? m.isLiving : !m.isLiving;

    return matchesSearch && matchesGen && matchesGender && matchesStatus;
  });

  const availableGens = Array.from(new Set(members.map(m => m.generation))).sort((a, b) => a - b);

  return (
    <div className="mx-auto max-w-6xl p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E3DA] pb-5">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-[#1C1917]">
            Daftar Anggota Keluarga ({filtered.length})
          </h1>
          <p className="text-xs text-[#78716C] mt-1">
            Direktori silsilah lengkap dari setiap generasi dan rumpun keluarga
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex rounded-lg border border-[#E6E3DA] bg-white p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded-md p-1.5 transition ${viewMode === 'grid' ? 'bg-[#EBF2EE] text-[#1E3A2F]' : 'text-[#78716C]'}`}
              title="Tampilan Kotak"
              aria-label="Tampilan Kotak"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`rounded-md p-1.5 transition ${viewMode === 'list' ? 'bg-[#EBF2EE] text-[#1E3A2F]' : 'text-[#78716C]'}`}
              title="Tampilan Daftar"
              aria-label="Tampilan Daftar"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 rounded-lg bg-[#1E3A2F] px-3.5 py-2 text-xs font-medium text-white hover:bg-[#284E3F] transition shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Anggota</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#78716C]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, kota, profesi..."
            className="w-full rounded-xl border border-[#E6E3DA] bg-white py-2 pl-9 pr-3 text-xs text-[#1C1917] focus:border-[#1E3A2F] focus:outline-none"
          />
        </div>

        {/* Gen Filter */}
        <select
          value={generationFilter}
          onChange={(e) => setGenerationFilter(e.target.value)}
          className="rounded-xl border border-[#E6E3DA] bg-white px-3 py-2 text-xs text-[#44403C] focus:border-[#1E3A2F] focus:outline-none"
        >
          <option value="all">Semua Generasi</option>
          {availableGens.map(g => (
            <option key={g} value={g.toString()}>
              Generasi {g}
            </option>
          ))}
        </select>

        {/* Gender Filter */}
        <select
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
          className="rounded-xl border border-[#E6E3DA] bg-white px-3 py-2 text-xs text-[#44403C] focus:border-[#1E3A2F] focus:outline-none"
        >
          <option value="all">Semua Jenis Kelamin</option>
          <option value="male">Laki-laki</option>
          <option value="female">Perempuan</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-[#E6E3DA] bg-white px-3 py-2 text-xs text-[#44403C] focus:border-[#1E3A2F] focus:outline-none"
        >
          <option value="all">Semua Status</option>
          <option value="living">Masih Hidup</option>
          <option value="deceased">Telah Wafat</option>
        </select>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(member => {
            const birthYear = member.birthDate ? member.birthDate.split('-')[0] : '?';
            const deathYear = member.isLiving ? '' : (member.deathDate ? member.deathDate.split('-')[0] : 'Wafat');

            return (
              <div
                key={member.id}
                onClick={() => onSelectMember(member)}
                className="group relative flex flex-col justify-between rounded-xl border border-[#E6E3DA] bg-white p-4 shadow-xs transition hover:border-[#1E3A2F] hover:shadow-md cursor-pointer"
              >
                <div>
                  <div className="flex items-start gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[#E6E3DA] bg-[#F5F2EB]">
                      {member.profilePhotoUrl ? (
                        <img src={member.profilePhotoUrl} alt={member.firstName} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-serif text-sm font-semibold text-[#57534E]">
                          {member.firstName[0]}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="font-serif text-sm font-bold text-[#1C1917] group-hover:text-[#1E3A2F] truncate">
                        {member.firstName} {member.lastName || ''}
                      </h2>
                      {member.nickname && (
                        <div className="text-[11px] text-[#78716C] italic font-serif">
                          "{member.nickname}"
                        </div>
                      )}
                      <div className="mt-1 flex items-center gap-2 text-[11px] text-[#78716C]">
                        <span className="font-mono tabular-nums">
                          {member.isLiving ? birthYear : `${birthYear} – ${deathYear}`}
                        </span>
                        <span>·</span>
                        <span>Gen {member.generation}</span>
                      </div>
                    </div>
                  </div>

                  {member.birthPlace && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-[#78716C]">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-[#A8A29E]" />
                      <span className="truncate">{member.birthPlace}</span>
                    </div>
                  )}

                  {member.occupation && (
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-[#78716C]">
                      <Briefcase className="h-3.5 w-3.5 shrink-0 text-[#A8A29E]" />
                      <span className="truncate">{member.occupation}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-[#F5F2EB] flex items-center justify-between">
                  <span className="text-[11px] text-[#78716C]">
                    {member.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigateToFullProfile(member.id);
                    }}
                    className="text-xs font-medium text-[#1E3A2F] hover:underline flex items-center gap-1"
                  >
                    <span>Profil</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="rounded-xl border border-[#E6E3DA] bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#44403C]">
              <thead className="border-b border-[#E6E3DA] bg-[#FAF8F5] text-[11px] font-semibold text-[#78716C] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Nama Lengkap</th>
                  <th className="py-3 px-4">Tahun Hidup</th>
                  <th className="py-3 px-4">Generasi</th>
                  <th className="py-3 px-4">Kota Asal</th>
                  <th className="py-3 px-4">Profesi</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EDE6]">
                {filtered.map(member => (
                  <tr
                    key={member.id}
                    onClick={() => onSelectMember(member)}
                    className="hover:bg-[#FAF8F5] transition cursor-pointer"
                  >
                    <td className="py-3 px-4 font-semibold text-[#1C1917]">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-full bg-[#EBE7DF] overflow-hidden flex items-center justify-center font-serif text-xs font-semibold text-[#57534E]">
                          {member.profilePhotoUrl ? (
                            <img src={member.profilePhotoUrl} alt="" className="h-full w-full object-cover" />
                          ) : (
                            member.firstName[0]
                          )}
                        </div>
                        <span>{member.firstName} {member.lastName || ''}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-[#78716C]">
                      {member.birthDate ? member.birthDate.split('-')[0] : '?'}
                      {!member.isLiving && ` – ${member.deathDate ? member.deathDate.split('-')[0] : 'Wafat'}`}
                    </td>
                    <td className="py-3 px-4 text-[#78716C]">Gen {member.generation}</td>
                    <td className="py-3 px-4 text-[#78716C]">{member.birthPlace || '–'}</td>
                    <td className="py-3 px-4 text-[#78716C]">{member.occupation || '–'}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigateToFullProfile(member.id);
                        }}
                        className="text-xs font-medium text-[#1E3A2F] hover:underline"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="rounded-2xl border border-[#E6E3DA] bg-white p-12 text-center">
          <Users className="mx-auto h-8 w-8 text-[#A8A29E]" />
          <h2 className="font-serif text-base font-semibold text-[#1C1917] mt-3">
            Tidak ada kerabat yang cocok
          </h2>
          <p className="text-xs text-[#78716C] mt-1 max-w-sm mx-auto">
            Coba sesuaikan kata kunci pencarian atau ubah filter generasi yang dipilih.
          </p>
        </div>
      )}
    </div>
  );
};
