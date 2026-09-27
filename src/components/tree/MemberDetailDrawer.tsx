import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Briefcase, 
  Calendar, 
  Phone, 
  Mail, 
  Heart, 
  Plus, 
  Edit3, 
  Sparkles, 
  Compass, 
  ExternalLink,
  Users,
  GitFork
} from 'lucide-react';
import { FamilyMember, Relationship } from '../../types';
import { findKinshipPath, KinshipResult } from '../../services/kinshipEngine';

interface MemberDetailDrawerProps {
  member: FamilyMember;
  allMembers: FamilyMember[];
  relationships: Relationship[];
  currentUserId: string;
  onClose: () => void;
  onSelectMember: (m: FamilyMember) => void;
  onOpenAddModal: (type: 'child' | 'spouse' | 'parent' | 'sibling', targetMember: FamilyMember) => void;
  onOpenEditModal: (m: FamilyMember) => void;
  onOpenAiStoryModal: (m: FamilyMember) => void;
  onNavigateToFullProfile: (memberId: string) => void;
}

export const MemberDetailDrawer: React.FC<MemberDetailDrawerProps> = ({
  member,
  allMembers,
  relationships,
  currentUserId,
  onClose,
  onSelectMember,
  onOpenAddModal,
  onOpenEditModal,
  onOpenAiStoryModal,
  onNavigateToFullProfile
}) => {
  const [showKinshipPath, setShowKinshipPath] = useState(true);

  // Compute kinship with current user
  const kinship: KinshipResult | null = React.useMemo(() => {
    return findKinshipPath(currentUserId, member.id, allMembers, relationships);
  }, [member.id, currentUserId, allMembers, relationships]);

  // Find parents
  const parents = relationships
    .filter(r => (r.type === 'BIOLOGICAL_PARENT' || r.type === 'ADOPTIVE_PARENT' || r.type === 'STEP_PARENT') && r.personBId === member.id)
    .map(r => ({
      member: allMembers.find(m => m.id === r.personAId),
      type: r.type
    }))
    .filter((p): p is { member: FamilyMember; type: typeof p.type } => Boolean(p.member));

  // Find spouses
  const spouses = relationships
    .filter(r => (r.type === 'SPOUSE' || r.type === 'FORMER_SPOUSE') && (r.personAId === member.id || r.personBId === member.id))
    .map(r => {
      const spouseId = r.personAId === member.id ? r.personBId : r.personAId;
      return {
        member: allMembers.find(m => m.id === spouseId),
        status: r.status,
        type: r.type
      };
    })
    .filter((s): s is { member: FamilyMember; status: typeof s.status; type: typeof s.type } => Boolean(s.member));

  // Find children
  const children = relationships
    .filter(r => (r.type === 'BIOLOGICAL_PARENT' || r.type === 'ADOPTIVE_PARENT' || r.type === 'STEP_PARENT') && r.personAId === member.id)
    .map(r => ({
      member: allMembers.find(m => m.id === r.personBId),
      type: r.type
    }))
    .filter((c): c is { member: FamilyMember; type: typeof c.type } => Boolean(c.member));

  // Find siblings (share at least one parent)
  const parentIds = parents.map(p => p.member.id);
  const siblingIds = relationships
    .filter(r => (r.type === 'BIOLOGICAL_PARENT' || r.type === 'ADOPTIVE_PARENT') && parentIds.includes(r.personAId) && r.personBId !== member.id)
    .map(r => r.personBId);
  
  const siblings = Array.from(new Set(siblingIds))
    .map(id => allMembers.find(m => m.id === id))
    .filter((m): m is FamilyMember => Boolean(m));

  const birthYear = member.birthDate ? member.birthDate.split('-')[0] : '?';
  const deathYear = member.isLiving ? '' : (member.deathDate ? member.deathDate.split('-')[0] : 'Wafat');

  return (
    <aside className="fixed inset-y-0 right-0 z-40 flex w-full max-w-md flex-col border-l border-[#E6E3DA] bg-white shadow-2xl transition-all">
      {/* Drawer Header */}
      <div className="flex h-16 items-center justify-between border-b border-[#F0EDE6] px-6">
        <div className="flex items-center gap-2 text-xs font-medium text-[#78716C]">
          <Users className="h-4 w-4 text-[#2D5A46]" />
          <span>Informasi Kerabat</span>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-[#78716C] hover:bg-[#F2EFEA] hover:text-[#1C1917] transition"
          aria-label="Tutup panel"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Profile Card */}
        <div className="flex items-start gap-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[#E6E3DA] bg-[#F5F2EB] shadow-xs">
            {member.profilePhotoUrl ? (
              <img
                src={member.profilePhotoUrl}
                alt={member.firstName}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-serif text-2xl font-semibold text-[#57534E]">
                {member.firstName[0]}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="font-serif text-xl font-bold tracking-tight text-[#1C1917] truncate">
              {member.firstName} {member.middleName ? `${member.middleName} ` : ''}{member.lastName || ''}
            </h2>

            {member.nickname && (
              <div className="text-xs text-[#78716C] italic font-serif mt-0.5">
                Panggilan: "{member.nickname}"
              </div>
            )}

            <div className="mt-2 text-xs text-[#57534E] flex items-center gap-2">
              <span className="font-mono tabular-nums">
                {member.isLiving ? `Lahir ${member.birthDate || birthYear}` : `${birthYear} – ${deathYear}`}
              </span>
              <span className="text-[#D6CEBE]">·</span>
              <span>Gen {member.generation}</span>
            </div>

            {member.birthPlace && (
              <div className="mt-1 flex items-center gap-1.5 text-xs text-[#78716C]">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">{member.birthPlace}</span>
              </div>
            )}
          </div>
        </div>

        {/* Kinship / Hubungan dengan Pengguna */}
        {kinship && (
          <div className="rounded-xl border border-[#D5E3DA] bg-[#F4F8F5] p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1E3A2F]">
                <Compass className="h-4 w-4 text-[#2D5A46]" />
                <span>Hubungan dengan Anda</span>
              </div>
              <span className="text-[11px] font-medium text-[#2D5A46] bg-white px-2 py-0.5 rounded-full border border-[#D5E3DA]">
                {kinship.relationshipTitle}
              </span>
            </div>

            <div className="mt-2 text-xs text-[#334155] leading-relaxed">
              <span className="font-medium text-[#1E3A2F]">{member.firstName}</span> adalah{' '}
              <span className="font-semibold text-[#1E3A2F]">{kinship.relationshipTitle.toLowerCase()}</span> Anda.
            </div>

            <div className="mt-2 border-t border-[#E0ECE4] pt-2 text-[11px] text-[#52605B]">
              <div className="font-medium mb-1">Jalur Silsilah:</div>
              <div className="font-mono text-[10px] leading-relaxed text-[#1E3A2F]">
                {kinship.pathDescription}
              </div>
            </div>
          </div>
        )}

        {/* Biography excerpt */}
        {member.biography && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#A8A29E] mb-1.5">
              Biografi & Jejak Hidup
            </h3>
            <p className="font-serif text-sm leading-relaxed text-[#44403C]">
              {member.biography}
            </p>
          </div>
        )}

        {/* Personal Details */}
        <div className="space-y-2 border-t border-[#F0EDE6] pt-4 text-xs text-[#57534E]">
          {member.occupation && (
            <div className="flex items-center gap-2">
              <Briefcase className="h-3.5 w-3.5 text-[#78716C] shrink-0" />
              <span>Profesi: {member.occupation}</span>
            </div>
          )}
          {member.address && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-[#78716C] shrink-0" />
              <span>Alamat: {member.address}</span>
            </div>
          )}
          {member.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-[#78716C] shrink-0" />
              <span>{member.phone}</span>
            </div>
          )}
          {member.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-[#78716C] shrink-0" />
              <span>{member.email}</span>
            </div>
          )}
        </div>

        {/* Immediate Relationships Tree */}
        <div className="border-t border-[#F0EDE6] pt-4 space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#A8A29E]">
            Keluarga Dekat
          </h3>

          {/* Parents */}
          <div>
            <div className="text-[11px] font-medium text-[#78716C] mb-1.5">Orang Tua</div>
            {parents.length > 0 ? (
              <div className="space-y-1.5">
                {parents.map(({ member: p, type }) => (
                  <button
                    key={p.id}
                    onClick={() => onSelectMember(p)}
                    className="flex w-full items-center justify-between rounded-lg border border-[#E6E3DA] p-2 text-left hover:bg-[#FAF8F5] transition"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-[#EBE7DF] text-[10px] font-semibold flex items-center justify-center text-[#57534E]">
                        {p.firstName[0]}
                      </div>
                      <span className="text-xs font-medium text-[#1C1917]">{p.firstName} {p.lastName || ''}</span>
                    </div>
                    <span className="text-[10px] text-[#78716C]">
                      {p.gender === 'female' ? 'Ibu' : 'Ayah'}
                      {type === 'ADOPTIVE_PARENT' ? ' (Adopsi)' : ''}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-xs text-[#A8A29E] italic">Belum ada data orang tua tercatat.</div>
            )}
          </div>

          {/* Spouses */}
          <div>
            <div className="text-[11px] font-medium text-[#78716C] mb-1.5">Pasangan</div>
            {spouses.length > 0 ? (
              <div className="space-y-1.5">
                {spouses.map(({ member: s, status }) => (
                  <button
                    key={s.id}
                    onClick={() => onSelectMember(s)}
                    className="flex w-full items-center justify-between rounded-lg border border-[#E6E3DA] p-2 text-left hover:bg-[#FAF8F5] transition"
                  >
                    <div className="flex items-center gap-2">
                      <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500/20" />
                      <span className="text-xs font-medium text-[#1C1917]">{s.firstName} {s.lastName || ''}</span>
                    </div>
                    <span className="text-[10px] text-[#78716C]">
                      {status === 'PASANGAN_MENINGGAL' ? 'Almarhum/ah' : (s.gender === 'female' ? 'Istri' : 'Suami')}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-xs text-[#A8A29E] italic">Belum ada pasangan tercatat.</div>
            )}
          </div>

          {/* Children */}
          <div>
            <div className="text-[11px] font-medium text-[#78716C] mb-1.5">Anak ({children.length})</div>
            {children.length > 0 ? (
              <div className="space-y-1.5">
                {children.map(({ member: c }) => (
                  <button
                    key={c.id}
                    onClick={() => onSelectMember(c)}
                    className="flex w-full items-center justify-between rounded-lg border border-[#E6E3DA] p-2 text-left hover:bg-[#FAF8F5] transition"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-[#EBE7DF] text-[10px] font-semibold flex items-center justify-center text-[#57534E]">
                        {c.firstName[0]}
                      </div>
                      <span className="text-xs font-medium text-[#1C1917]">{c.firstName} {c.lastName || ''}</span>
                    </div>
                    <span className="text-[10px] text-[#78716C] font-mono tabular-nums">
                      {c.birthDate ? c.birthDate.split('-')[0] : ''}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-xs text-[#A8A29E] italic">Belum ada anak tercatat.</div>
            )}
          </div>

          {/* Siblings */}
          {siblings.length > 0 && (
            <div>
              <div className="text-[11px] font-medium text-[#78716C] mb-1.5">Saudara Kandung ({siblings.length})</div>
              <div className="space-y-1.5">
                {siblings.map(s => (
                  <button
                    key={s.id}
                    onClick={() => onSelectMember(s)}
                    className="flex w-full items-center justify-between rounded-lg border border-[#E6E3DA] p-2 text-left hover:bg-[#FAF8F5] transition"
                  >
                    <span className="text-xs font-medium text-[#1C1917]">{s.firstName} {s.lastName || ''}</span>
                    <span className="text-[10px] text-[#78716C]">Saudara</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Add Actions */}
        <div className="border-t border-[#F0EDE6] pt-4 space-y-2">
          <div className="text-[11px] font-medium text-[#78716C]">Tambah Kerabat untuk {member.firstName}</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onOpenAddModal('child', member)}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-[#E6E3DA] bg-white p-2 text-xs font-medium text-[#44403C] hover:bg-[#FAF8F5] transition"
            >
              <Plus className="h-3.5 w-3.5 text-[#1E3A2F]" />
              <span>Tambah Anak</span>
            </button>
            <button
              onClick={() => onOpenAddModal('spouse', member)}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-[#E6E3DA] bg-white p-2 text-xs font-medium text-[#44403C] hover:bg-[#FAF8F5] transition"
            >
              <Plus className="h-3.5 w-3.5 text-[#1E3A2F]" />
              <span>Tambah Pasangan</span>
            </button>
            <button
              onClick={() => onOpenAddModal('parent', member)}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-[#E6E3DA] bg-white p-2 text-xs font-medium text-[#44403C] hover:bg-[#FAF8F5] transition"
            >
              <Plus className="h-3.5 w-3.5 text-[#1E3A2F]" />
              <span>Tambah Orang Tua</span>
            </button>
            <button
              onClick={() => onOpenAddModal('sibling', member)}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-[#E6E3DA] bg-white p-2 text-xs font-medium text-[#44403C] hover:bg-[#FAF8F5] transition"
            >
              <Plus className="h-3.5 w-3.5 text-[#1E3A2F]" />
              <span>Tambah Saudara</span>
            </button>
          </div>
        </div>

        {/* AI & Profile Action buttons */}
        <div className="border-t border-[#F0EDE6] pt-4 space-y-2">
          <button
            onClick={() => onOpenAiStoryModal(member)}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#D5E3DA] bg-[#F4F8F5] p-2.5 text-xs font-medium text-[#1E3A2F] hover:bg-[#EAF1EC] transition"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#2D5A46]" />
            <span>Tulis Draf Biografi (Asisten AI)</span>
          </button>

          <button
            onClick={() => onNavigateToFullProfile(member.id)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1E3A2F] p-2.5 text-xs font-medium text-white hover:bg-[#284E3F] transition shadow-xs"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Buka Profil Lengkap & Arsip</span>
          </button>

          <button
            onClick={() => onOpenEditModal(member)}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#E6E3DA] p-2 text-xs font-medium text-[#57534E] hover:bg-[#FAF8F5] transition"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Edit Informasi Profil</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
