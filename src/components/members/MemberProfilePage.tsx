import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Briefcase, 
  Calendar, 
  Phone, 
  Mail, 
  Edit3, 
  Plus, 
  Heart, 
  Users, 
  BookOpen, 
  Image as ImageIcon, 
  FileText, 
  Clock, 
  Sparkles,
  Share2
} from 'lucide-react';
import { 
  FamilyMember, 
  Relationship, 
  FamilyMemory, 
  FamilyPhoto, 
  FamilyDocument, 
  FamilyEvent,
  MarriageStatus,
  RelationshipType
} from '../../types';

interface SpouseInfo {
  member: FamilyMember;
  status: MarriageStatus | undefined;
  type: RelationshipType;
  startDate: string | undefined;
  endDate: string | undefined;
  notes: string | undefined;
}

interface MemberProfilePageProps {
  member: FamilyMember;
  allMembers: FamilyMember[];
  relationships: Relationship[];
  memories: FamilyMemory[];
  photos: FamilyPhoto[];
  documents: FamilyDocument[];
  onBack: () => void;
  onSelectMember: (m: FamilyMember) => void;
  onOpenEditModal: (m: FamilyMember) => void;
  onOpenAddRelModal: (type: 'child' | 'spouse' | 'parent' | 'sibling', target: FamilyMember) => void;
  onOpenAiStoryModal: (m: FamilyMember) => void;
}

export const MemberProfilePage: React.FC<MemberProfilePageProps> = ({
  member,
  allMembers,
  relationships,
  memories,
  photos,
  documents,
  onBack,
  onSelectMember,
  onOpenEditModal,
  onOpenAddRelModal,
  onOpenAiStoryModal,
}) => {
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'keluarga' | 'timeline' | 'cerita' | 'galeri' | 'dokumen'>('ringkasan');

  // Parents
  const parents = relationships
    .filter(r => (r.type === 'BIOLOGICAL_PARENT' || r.type === 'ADOPTIVE_PARENT' || r.type === 'STEP_PARENT') && r.personBId === member.id)
    .map(r => ({
      member: allMembers.find(m => m.id === r.personAId),
      type: r.type
    }))
    .filter((p): p is { member: FamilyMember; type: typeof p.type } => Boolean(p.member));

  // Spouses
  const spouses = relationships
    .filter(r => (r.type === 'SPOUSE' || r.type === 'FORMER_SPOUSE') && (r.personAId === member.id || r.personBId === member.id))
    .map(r => {
      const spouseId = r.personAId === member.id ? r.personBId : r.personAId;
      const spouseMember = allMembers.find(m => m.id === spouseId);
      if (!spouseMember) return null;
      return {
        member: spouseMember,
        status: r.status,
        type: r.type,
        startDate: r.startDate,
        endDate: r.endDate,
        notes: r.notes
      };
    })
    .filter((s): s is SpouseInfo => s !== null);

  // Children
  const children = relationships
    .filter(r => (r.type === 'BIOLOGICAL_PARENT' || r.type === 'ADOPTIVE_PARENT') && r.personAId === member.id)
    .map(r => ({
      member: allMembers.find(m => m.id === r.personBId),
      type: r.type
    }))
    .filter((c): c is { member: FamilyMember; type: typeof c.type } => Boolean(c.member));

  // Siblings
  const parentIds = parents.map(p => p.member.id);
  const siblingIds = relationships
    .filter(r => (r.type === 'BIOLOGICAL_PARENT' || r.type === 'ADOPTIVE_PARENT') && parentIds.includes(r.personAId) && r.personBId !== member.id)
    .map(r => r.personBId);
  const siblings = Array.from(new Set(siblingIds))
    .map(id => allMembers.find(m => m.id === id))
    .filter((m): m is FamilyMember => Boolean(m));

  // Member's memories
  const memberMemories = memories.filter(m => m.taggedMemberIds.includes(member.id));
  // Member's photos
  const memberPhotos = photos.filter(p => p.taggedMemberIds.includes(member.id));
  // Member's documents
  const memberDocs = documents.filter(d => d.attachedMemberIds.includes(member.id));

  const birthYear = member.birthDate ? member.birthDate.split('-')[0] : '?';
  const deathYear = member.isLiving ? '' : (member.deathDate ? member.deathDate.split('-')[0] : 'Wafat');

  return (
    <div className="mx-auto max-w-5xl p-6 sm:p-8 space-y-6">
      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-medium text-[#78716C] hover:text-[#1E3A2F] transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Daftar</span>
        </button>
      </div>

      {/* Profile Header */}
      <div className="rounded-2xl border border-[#E6E3DA] bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {/* Avatar */}
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-[#E6E3DA] bg-[#F5F2EB] shadow-sm">
            {member.profilePhotoUrl ? (
              <img
                src={member.profilePhotoUrl}
                alt={member.firstName}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-serif text-3xl font-semibold text-[#57534E]">
                {member.firstName[0]}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1C1917]">
                  {member.firstName} {member.middleName ? `${member.middleName} ` : ''}{member.lastName || ''}
                </h1>
                {member.nickname && (
                  <div className="text-xs text-[#78716C] italic font-serif mt-0.5">
                    Nama Panggilan: "{member.nickname}"
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAiStoryModal(member)}
                  className="flex items-center gap-1.5 rounded-lg border border-[#D5E3DA] bg-[#F4F8F5] px-3 py-1.5 text-xs font-medium text-[#1E3A2F] hover:bg-[#EAF1EC] transition"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#2D5A46]" />
                  <span>Draf Biografi AI</span>
                </button>

                <button
                  onClick={() => onOpenEditModal(member)}
                  className="flex items-center gap-1.5 rounded-lg border border-[#E6E3DA] bg-white px-3 py-1.5 text-xs font-medium text-[#57534E] hover:bg-[#FAF8F5] transition"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Edit Profil</span>
                </button>
              </div>
            </div>

            {/* Quick Metadata */}
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#57534E]">
              <div className="flex items-center gap-1.5 font-mono tabular-nums">
                <Calendar className="h-3.5 w-3.5 text-[#78716C]" />
                <span>
                  {member.isLiving ? `Lahir ${member.birthDate || birthYear}` : `${birthYear} – ${deathYear}`}
                </span>
              </div>

              {member.birthPlace && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#78716C]" />
                  <span>{member.birthPlace}</span>
                </div>
              )}

              {member.occupation && (
                <div className="flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-[#78716C]" />
                  <span>{member.occupation}</span>
                </div>
              )}

              <span className="text-[#A8A29E]">·</span>
              <span className="font-semibold text-[#1E3A2F]">Generasi ke-{member.generation}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-[#E6E3DA] overflow-x-auto pb-px">
        {[
          { id: 'ringkasan', label: 'Ringkasan & Biografi', icon: BookOpen },
          { id: 'keluarga', label: `Keluarga (${parents.length + spouses.length + children.length + siblings.length})`, icon: Users },
          { id: 'cerita', label: `Kenangan (${memberMemories.length})`, icon: BookOpen },
          { id: 'galeri', label: `Foto (${memberPhotos.length})`, icon: ImageIcon },
          { id: 'dokumen', label: `Dokumen (${memberDocs.length})`, icon: FileText },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-medium whitespace-nowrap transition ${
                isActive
                  ? 'border-[#1E3A2F] text-[#1E3A2F]'
                  : 'border-transparent text-[#78716C] hover:border-[#D6CEBE] hover:text-[#1C1917]'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Ringkasan */}
      {activeTab === 'ringkasan' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="rounded-2xl border border-[#E6E3DA] bg-white p-6 shadow-xs">
              <h2 className="font-serif text-base font-semibold text-[#1C1917] mb-3">
                Biografi & Rekam Jejak
              </h2>
              <p className="font-serif text-sm leading-relaxed text-[#292524] whitespace-pre-line">
                {member.biography || 'Belum ada catatan biografi untuk anggota keluarga ini. Klik "Draf Biografi AI" untuk membuat narasi awal.'}
              </p>
            </div>

            {/* Historical Milestones */}
            <div className="rounded-2xl border border-[#E6E3DA] bg-white p-6 shadow-xs">
              <h2 className="font-serif text-base font-semibold text-[#1C1917] mb-3">
                Linimasa Peristiwa Utama
              </h2>
              <div className="space-y-4 border-l-2 border-[#E6E3DA] pl-4 ml-2">
                {member.birthDate && (
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-[#2D5A46]" />
                    <div className="font-mono text-xs font-semibold text-[#1E3A2F]">
                      {member.birthDate}
                    </div>
                    <div className="text-xs text-[#57534E]">
                      Kelahiran di {member.birthPlace || 'tempat kelahiran tercatat'}
                    </div>
                  </div>
                )}
                {spouses.map(s => s.startDate && (
                  <div key={s.member.id} className="relative">
                    <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-rose-500" />
                    <div className="font-mono text-xs font-semibold text-[#1E3A2F]">
                      {s.startDate}
                    </div>
                    <div className="text-xs text-[#57534E]">
                      Pernikahan dengan {s.member.firstName} {s.member.lastName || ''}
                    </div>
                  </div>
                ))}
                {children.map(c => c.member.birthDate && (
                  <div key={c.member.id} className="relative">
                    <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-emerald-600" />
                    <div className="font-mono text-xs font-semibold text-[#1E3A2F]">
                      {c.member.birthDate}
                    </div>
                    <div className="text-xs text-[#57534E]">
                      Kelahiran anak: {c.member.firstName} {c.member.lastName || ''}
                    </div>
                  </div>
                ))}
                {!member.isLiving && member.deathDate && (
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-[#78716C]" />
                    <div className="font-mono text-xs font-semibold text-[#1E3A2F]">
                      {member.deathDate}
                    </div>
                    <div className="text-xs text-[#57534E]">
                      Wafat di {member.deathPlace || 'Bandung'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Personal Data Info Box */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-[#E6E3DA] bg-white p-5 shadow-xs space-y-3 text-xs text-[#57534E]">
              <h2 className="font-serif font-semibold text-[#1C1917] pb-2 border-b border-[#F0EDE6]">
                Data Kependudukan & Kontak
              </h2>

              <div>
                <span className="text-[11px] text-[#A8A29E] block">Nama Lengkap</span>
                <span className="font-medium text-[#1C1917]">
                  {member.firstName} {member.middleName ? `${member.middleName} ` : ''}{member.lastName || ''}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-[#A8A29E] block">Jenis Kelamin</span>
                <span>{member.gender === 'male' ? 'Laki-laki' : 'Perempuan'}</span>
              </div>

              {member.address && (
                <div>
                  <span className="text-[11px] text-[#A8A29E] block">Alamat Terakhir / Domisili</span>
                  <span>{member.address}</span>
                </div>
              )}

              {member.phone && (
                <div>
                  <span className="text-[11px] text-[#A8A29E] block">Nomor Telepon</span>
                  <span>{member.phone}</span>
                </div>
              )}

              {member.email && (
                <div>
                  <span className="text-[11px] text-[#A8A29E] block">Email</span>
                  <span>{member.email}</span>
                </div>
              )}

              <div className="pt-2 border-t border-[#F0EDE6]">
                <span className="text-[11px] text-[#A8A29E] block">Tingkat Privasi</span>
                <span className="font-medium text-[#1E3A2F]">Keluarga Terbatas</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Keluarga / Relationships */}
      {activeTab === 'keluarga' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-[#1C1917]">
              Pertalian Kekerabatan Terdekat
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAddRelModal('child', member)}
                className="flex items-center gap-1 rounded-lg border border-[#E6E3DA] bg-white px-3 py-1.5 text-xs font-medium text-[#1E3A2F] hover:bg-[#FAF8F5]"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Tambah Anak</span>
              </button>
              <button
                onClick={() => onOpenAddRelModal('spouse', member)}
                className="flex items-center gap-1 rounded-lg border border-[#E6E3DA] bg-white px-3 py-1.5 text-xs font-medium text-[#1E3A2F] hover:bg-[#FAF8F5]"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Tambah Pasangan</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Orang Tua */}
            <div className="rounded-2xl border border-[#E6E3DA] bg-white p-5 shadow-xs">
              <div className="font-serif font-semibold text-sm text-[#1C1917] mb-3 flex items-center justify-between">
                <span>Orang Tua</span>
                <span className="text-xs font-sans text-[#78716C]">{parents.length} orang</span>
              </div>
              <div className="space-y-2">
                {parents.map(({ member: p, type }) => (
                  <div
                    key={p.id}
                    onClick={() => onSelectMember(p)}
                    className="flex items-center justify-between rounded-xl border border-[#E6E3DA] p-3 hover:bg-[#FAF8F5] transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-[#EBE7DF] overflow-hidden flex items-center justify-center font-serif text-xs font-semibold text-[#57534E]">
                        {p.profilePhotoUrl ? <img src={p.profilePhotoUrl} alt="" className="h-full w-full object-cover" /> : p.firstName[0]}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-[#1C1917]">{p.firstName} {p.lastName || ''}</div>
                        <div className="text-[11px] text-[#78716C]">{p.birthPlace || '–'}</div>
                      </div>
                    </div>
                    <span className="text-xs text-[#2D5A46] font-medium">
                      {p.gender === 'female' ? 'Ibu' : 'Ayah'}
                      {type === 'ADOPTIVE_PARENT' ? ' (Adopsi)' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pasangan */}
            <div className="rounded-2xl border border-[#E6E3DA] bg-white p-5 shadow-xs">
              <div className="font-serif font-semibold text-sm text-[#1C1917] mb-3 flex items-center justify-between">
                <span>Pasangan Hidup</span>
                <span className="text-xs font-sans text-[#78716C]">{spouses.length} orang</span>
              </div>
              <div className="space-y-2">
                {spouses.map(({ member: s, status, startDate }) => (
                  <div
                    key={s.id}
                    onClick={() => onSelectMember(s)}
                    className="flex items-center justify-between rounded-xl border border-[#E6E3DA] p-3 hover:bg-[#FAF8F5] transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-[#EBE7DF] overflow-hidden flex items-center justify-center font-serif text-xs font-semibold text-[#57534E]">
                        {s.profilePhotoUrl ? <img src={s.profilePhotoUrl} alt="" className="h-full w-full object-cover" /> : s.firstName[0]}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-[#1C1917]">{s.firstName} {s.lastName || ''}</div>
                        {startDate && <div className="text-[11px] font-mono text-[#78716C]">Menikah: {startDate}</div>}
                      </div>
                    </div>
                    <span className="text-xs text-rose-700 font-medium">
                      {status === 'PASANGAN_MENINGGAL' ? 'Almarhum/ah' : (s.gender === 'female' ? 'Istri' : 'Suami')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Anak */}
            <div className="rounded-2xl border border-[#E6E3DA] bg-white p-5 shadow-xs">
              <div className="font-serif font-semibold text-sm text-[#1C1917] mb-3 flex items-center justify-between">
                <span>Putra & Putri</span>
                <span className="text-xs font-sans text-[#78716C]">{children.length} orang</span>
              </div>
              <div className="space-y-2">
                {children.map(({ member: c }) => (
                  <div
                    key={c.id}
                    onClick={() => onSelectMember(c)}
                    className="flex items-center justify-between rounded-xl border border-[#E6E3DA] p-3 hover:bg-[#FAF8F5] transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-[#EBE7DF] overflow-hidden flex items-center justify-center font-serif text-xs font-semibold text-[#57534E]">
                        {c.profilePhotoUrl ? <img src={c.profilePhotoUrl} alt="" className="h-full w-full object-cover" /> : c.firstName[0]}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-[#1C1917]">{c.firstName} {c.lastName || ''}</div>
                        <div className="text-[11px] font-mono text-[#78716C]">{c.birthDate ? `Lahir ${c.birthDate}` : ''}</div>
                      </div>
                    </div>
                    <span className="text-xs text-[#57534E]">
                      {c.gender === 'male' ? 'Anak Laki-laki' : 'Anak Perempuan'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Saudara Kandung */}
            <div className="rounded-2xl border border-[#E6E3DA] bg-white p-5 shadow-xs">
              <div className="font-serif font-semibold text-sm text-[#1C1917] mb-3 flex items-center justify-between">
                <span>Saudara Kandung</span>
                <span className="text-xs font-sans text-[#78716C]">{siblings.length} orang</span>
              </div>
              <div className="space-y-2">
                {siblings.map(sib => (
                  <div
                    key={sib.id}
                    onClick={() => onSelectMember(sib)}
                    className="flex items-center justify-between rounded-xl border border-[#E6E3DA] p-3 hover:bg-[#FAF8F5] transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-[#EBE7DF] overflow-hidden flex items-center justify-center font-serif text-xs font-semibold text-[#57534E]">
                        {sib.profilePhotoUrl ? <img src={sib.profilePhotoUrl} alt="" className="h-full w-full object-cover" /> : sib.firstName[0]}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-[#1C1917]">{sib.firstName} {sib.lastName || ''}</div>
                        <div className="text-[11px] text-[#78716C] font-mono">{sib.birthDate ? sib.birthDate.split('-')[0] : ''}</div>
                      </div>
                    </div>
                    <span className="text-xs text-[#78716C]">Saudara</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Cerita / Kenangan */}
      {activeTab === 'cerita' && (
        <div className="space-y-4">
          <h2 className="font-serif text-lg font-bold text-[#1C1917]">
            Kenangan & Cerita yang Melibatkan {member.firstName}
          </h2>
          {memberMemories.length > 0 ? (
            <div className="space-y-4">
              {memberMemories.map(mem => (
                <div key={mem.id} className="rounded-2xl border border-[#E6E3DA] bg-white p-6 shadow-xs">
                  <div className="text-xs font-mono text-[#78716C] mb-1">
                    {mem.date} {mem.location ? `· ${mem.location}` : ''}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#1C1917]">{mem.title}</h3>
                  <p className="font-serif text-xs leading-relaxed text-[#292524] mt-2 whitespace-pre-line">
                    {mem.story}
                  </p>
                  <div className="mt-3 pt-2 border-t border-[#F0EDE6] text-[11px] text-[#78716C]">
                    Ditulis oleh: {mem.authorName}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#E6E3DA] bg-white p-8 text-center text-xs text-[#78716C]">
              Belum ada kenangan yang menandai anggota ini.
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Galeri */}
      {activeTab === 'galeri' && (
        <div className="space-y-4">
          <h2 className="font-serif text-lg font-bold text-[#1C1917]">
            Galeri Foto yang Ditandai
          </h2>
          {memberPhotos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {memberPhotos.map(p => (
                <div key={p.id} className="rounded-xl border border-[#E6E3DA] bg-white overflow-hidden shadow-xs">
                  <div className="h-44 bg-[#F5F2EB]">
                    <img src={p.url} alt={p.caption || ''} className="h-full w-full object-cover" />
                  </div>
                  {p.caption && (
                    <div className="p-2.5 text-xs text-[#57534E]">
                      {p.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#E6E3DA] bg-white p-8 text-center text-xs text-[#78716C]">
              Belum ada foto yang ditandai untuk anggota ini.
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Dokumen */}
      {activeTab === 'dokumen' && (
        <div className="space-y-4">
          <h2 className="font-serif text-lg font-bold text-[#1C1917]">
            Arsip Dokumen Sejarah
          </h2>
          {memberDocs.length > 0 ? (
            <div className="space-y-3">
              {memberDocs.map(doc => (
                <div key={doc.id} className="flex items-center justify-between rounded-xl border border-[#E6E3DA] bg-white p-4 shadow-xs">
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-[#2D5A46]" />
                    <div>
                      <div className="text-xs font-semibold text-[#1C1917]">{doc.title}</div>
                      <div className="text-[11px] text-[#78716C]">{doc.category} · {doc.date || 'Tahun tidak tercatat'}</div>
                    </div>
                  </div>
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-[#E6E3DA] px-3 py-1.5 text-xs font-medium text-[#1E3A2F] hover:bg-[#FAF8F5]"
                  >
                    Buka Arsip
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#E6E3DA] bg-white p-8 text-center text-xs text-[#78716C]">
              Belum ada arsip dokumen resmi yang ditautkan untuk anggota ini.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
