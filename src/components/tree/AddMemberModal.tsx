import React, { useState, useEffect } from 'react';
import { X, UserPlus, AlertCircle, Search, Check } from 'lucide-react';
import { FamilyMember, RelationshipType, Gender, MarriageStatus } from '../../types';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  familyId: string;
  targetMember?: FamilyMember | null;
  relationshipContext?: 'child' | 'spouse' | 'parent' | 'sibling' | null;
  existingMembers: FamilyMember[];
  onSaveMember: (
    memberData: Omit<FamilyMember, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>,
    relationshipData?: {
      targetMemberId: string;
      relType: RelationshipType;
      marriageStatus?: MarriageStatus;
    }
  ) => void;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  familyId,
  targetMember,
  relationshipContext,
  existingMembers,
  onSaveMember,
}) => {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [birthDate, setBirthDate] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [isLiving, setIsLiving] = useState(true);
  const [deathDate, setDeathDate] = useState('');
  const [deathPlace, setDeathPlace] = useState('');
  const [occupation, setOccupation] = useState('');
  const [biography, setBiography] = useState('');
  const [marriageStatus, setMarriageStatus] = useState<MarriageStatus>('MENIKAH');

  // Pre-fill defaults based on relationship context
  useEffect(() => {
    if (targetMember && relationshipContext) {
      if (relationshipContext === 'spouse') {
        setGender(targetMember.gender === 'male' ? 'female' : 'male');
      } else if (relationshipContext === 'parent') {
        setGender('male');
      }
    }
  }, [targetMember, relationshipContext]);

  if (!isOpen) return null;

  // Duplicate match detection
  const potentialMatches = existingMembers.filter(m => {
    if (!firstName.trim()) return false;
    const nameMatch = m.firstName.toLowerCase() === firstName.trim().toLowerCase();
    const lastMatch = lastName.trim() ? m.lastName?.toLowerCase() === lastName.trim().toLowerCase() : true;
    return nameMatch && lastMatch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) return;

    // Calculate generation
    let gen = 1;
    if (targetMember) {
      if (relationshipContext === 'child') gen = (targetMember.generation || 1) + 1;
      else if (relationshipContext === 'parent') gen = Math.max((targetMember.generation || 2) - 1, 1);
      else gen = targetMember.generation || 1;
    }

    const newMemberData: Omit<FamilyMember, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'> = {
      familyId,
      firstName: firstName.trim(),
      middleName: middleName.trim() || undefined,
      lastName: lastName.trim() || undefined,
      nickname: nickname.trim() || undefined,
      gender,
      birthDate: birthDate || undefined,
      birthPlace: birthPlace.trim() || undefined,
      deathDate: isLiving ? undefined : (deathDate || undefined),
      deathPlace: isLiving ? undefined : (deathPlace.trim() || undefined),
      isLiving,
      occupation: occupation.trim() || undefined,
      biography: biography.trim() || undefined,
      privacyLevel: 'FAMILY',
      generation: gen,
      branch: targetMember?.branch || 'Pusat'
    };

    let relData: { targetMemberId: string; relType: RelationshipType; marriageStatus?: MarriageStatus } | undefined;

    if (targetMember && relationshipContext) {
      if (relationshipContext === 'child') {
        relData = {
          targetMemberId: targetMember.id,
          relType: 'BIOLOGICAL_PARENT'
        };
      } else if (relationshipContext === 'spouse') {
        relData = {
          targetMemberId: targetMember.id,
          relType: 'SPOUSE',
          marriageStatus
        };
      } else if (relationshipContext === 'parent') {
        relData = {
          targetMemberId: targetMember.id,
          relType: 'BIOLOGICAL_PARENT'
        };
      } else if (relationshipContext === 'sibling') {
        relData = {
          targetMemberId: targetMember.id,
          relType: 'SIBLING'
        };
      }
    }

    onSaveMember(newMemberData, relData);
    onClose();
  };

  const getContextTitle = () => {
    if (!targetMember || !relationshipContext) return 'Tambah Anggota Keluarga';
    switch (relationshipContext) {
      case 'child': return `Tambah Anak untuk ${targetMember.firstName}`;
      case 'spouse': return `Tambah Pasangan untuk ${targetMember.firstName}`;
      case 'parent': return `Tambah Orang Tua untuk ${targetMember.firstName}`;
      case 'sibling': return `Tambah Saudara untuk ${targetMember.firstName}`;
      default: return 'Tambah Anggota Keluarga';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative my-8 w-full max-w-xl rounded-2xl border border-[#E6E3DA] bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F0EDE6]">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-[#1E3A2F]" />
            <h2 className="font-serif text-lg font-bold text-[#1C1917]">
              {getContextTitle()}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#78716C] hover:bg-[#F2EFEA] hover:text-[#1C1917] transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Duplicate warning banner */}
        {potentialMatches.length > 0 && (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <span className="font-medium">Kemiripan nama terdeteksi: </span>
              Anggota dengan nama "{firstName} {lastName}" sudah terdaftar ({potentialMatches.map(m => `${m.firstName} lahir ${m.birthDate || '?'}`).join(', ')}). Pastikan Anda tidak membuat entri ganda.
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Names */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#44403C] mb-1">
                Nama Depan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Contoh: Hasan"
                className="w-full rounded-lg border border-[#E6E3DA] bg-[#FAF8F5] p-2 text-xs focus:border-[#1E3A2F] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#44403C] mb-1">
                Nama Tengah
              </label>
              <input
                type="text"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                placeholder="Contoh: Surya"
                className="w-full rounded-lg border border-[#E6E3DA] bg-[#FAF8F5] p-2 text-xs focus:border-[#1E3A2F] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#44403C] mb-1">
                Nama Belakang / Marga
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Contoh: Wiradinata"
                className="w-full rounded-lg border border-[#E6E3DA] bg-[#FAF8F5] p-2 text-xs focus:border-[#1E3A2F] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#44403C] mb-1">
                Nama Panggilan / Sapaan
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Contoh: Aki Hasan / Enin"
                className="w-full rounded-lg border border-[#E6E3DA] bg-[#FAF8F5] p-2 text-xs focus:border-[#1E3A2F] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#44403C] mb-1">
                Jenis Kelamin
              </label>
              <div className="flex items-center gap-4 mt-2 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    checked={gender === 'male'}
                    onChange={() => setGender('male')}
                    className="accent-[#1E3A2F]"
                  />
                  <span>Laki-laki</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    checked={gender === 'female'}
                    onChange={() => setGender('female')}
                    className="accent-[#1E3A2F]"
                  />
                  <span>Perempuan</span>
                </label>
              </div>
            </div>
          </div>

          {/* Birth details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#44403C] mb-1">
                Tanggal Lahir (atau Tahun)
              </label>
              <input
                type="text"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                placeholder="Contoh: 1940-06-12 atau 1940"
                className="w-full rounded-lg border border-[#E6E3DA] bg-[#FAF8F5] p-2 text-xs focus:border-[#1E3A2F] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#44403C] mb-1">
                Tempat Lahir
              </label>
              <input
                type="text"
                value={birthPlace}
                onChange={(e) => setBirthPlace(e.target.value)}
                placeholder="Contoh: Bandung, Jawa Barat"
                className="w-full rounded-lg border border-[#E6E3DA] bg-[#FAF8F5] p-2 text-xs focus:border-[#1E3A2F] focus:outline-none"
              />
            </div>
          </div>

          {/* Status Kehidupan */}
          <div className="rounded-xl border border-[#E6E3DA] bg-[#FAF8F5] p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#1C1917]">Status Kehidupan</span>
              <div className="flex items-center gap-3 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="isLiving"
                    checked={isLiving}
                    onChange={() => setIsLiving(true)}
                    className="accent-[#1E3A2F]"
                  />
                  <span>Masih Hidup</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="isLiving"
                    checked={!isLiving}
                    onChange={() => setIsLiving(false)}
                    className="accent-[#1E3A2F]"
                  />
                  <span>Telah Wafat</span>
                </label>
              </div>
            </div>

            {!isLiving && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#E6E3DA]">
                <div>
                  <label className="block text-xs font-semibold text-[#44403C] mb-1">
                    Tanggal Wafat
                  </label>
                  <input
                    type="text"
                    value={deathDate}
                    onChange={(e) => setDeathDate(e.target.value)}
                    placeholder="Contoh: 2022-10-18"
                    className="w-full rounded-lg border border-[#E6E3DA] bg-white p-2 text-xs focus:border-[#1E3A2F] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#44403C] mb-1">
                    Tempat Wafat / Peristirahatan
                  </label>
                  <input
                    type="text"
                    value={deathPlace}
                    onChange={(e) => setDeathPlace(e.target.value)}
                    placeholder="Contoh: Bandung"
                    className="w-full rounded-lg border border-[#E6E3DA] bg-white p-2 text-xs focus:border-[#1E3A2F] focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Occupation */}
          <div>
            <label className="block text-xs font-semibold text-[#44403C] mb-1">
              Pekerjaan / Bidang Pengabdian
            </label>
            <input
              type="text"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              placeholder="Contoh: Guru, Insinyur, Pengusaha"
              className="w-full rounded-lg border border-[#E6E3DA] bg-[#FAF8F5] p-2 text-xs focus:border-[#1E3A2F] focus:outline-none"
            />
          </div>

          {/* Biography notes */}
          <div>
            <label className="block text-xs font-semibold text-[#44403C] mb-1">
              Catatan Singkat / Biografi
            </label>
            <textarea
              rows={2}
              value={biography}
              onChange={(e) => setBiography(e.target.value)}
              placeholder="Ceritakan jejak kisah hidup beliau..."
              className="w-full rounded-lg border border-[#E6E3DA] bg-[#FAF8F5] p-2 text-xs focus:border-[#1E3A2F] focus:outline-none"
            />
          </div>

          {/* Footer actions */}
          <div className="mt-6 flex items-center justify-end gap-2 border-t border-[#F0EDE6] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#E6E3DA] px-4 py-2 text-xs font-medium text-[#57534E] hover:bg-[#FAF8F5]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#1E3A2F] px-4 py-2 text-xs font-medium text-white hover:bg-[#284E3F] transition shadow-xs"
            >
              Simpan Anggota
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
