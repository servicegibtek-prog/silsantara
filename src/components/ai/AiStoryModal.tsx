import React, { useState } from 'react';
import { X, Sparkles, Check, RefreshCw, AlertCircle, BookOpen } from 'lucide-react';
import { FamilyMember, Relationship } from '../../types';
import { generateBiographyDraft } from '../../services/aiService';

interface AiStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: FamilyMember;
  allMembers: FamilyMember[];
  relationships: Relationship[];
  onSaveStory: (memberId: string, approvedBio: string) => void;
}

export const AiStoryModal: React.FC<AiStoryModalProps> = ({
  isOpen,
  onClose,
  member,
  allMembers,
  relationships,
  onSaveStory,
}) => {
  const [tone, setTone] = useState<'warm' | 'formal' | 'poetic'>('warm');
  const [isGenerating, setIsGenerating] = useState(false);
  const [draftText, setDraftText] = useState('');
  const [customNotes, setCustomNotes] = useState('');

  // Collect facts
  const spouse = relationships
    .filter(r => (r.type === 'SPOUSE' || r.type === 'FORMER_SPOUSE') && (r.personAId === member.id || r.personBId === member.id))
    .map(r => {
      const sId = r.personAId === member.id ? r.personBId : r.personAId;
      return allMembers.find(m => m.id === sId);
    })
    .filter(Boolean)[0];

  const childrenCount = relationships.filter(
    r => (r.type === 'BIOLOGICAL_PARENT' || r.type === 'ADOPTIVE_PARENT') && r.personAId === member.id
  ).length;

  const handleGenerate = async () => {
    setIsGenerating(true);
    const draft = await generateBiographyDraft({
      fullName: `${member.firstName} ${member.lastName || ''}`.trim(),
      birthDate: member.birthDate,
      birthPlace: member.birthPlace,
      deathDate: member.deathDate,
      deathPlace: member.deathPlace,
      occupation: member.occupation,
      spouseName: spouse ? `${spouse.firstName} ${spouse.lastName || ''}`.trim() : undefined,
      childrenCount: childrenCount > 0 ? childrenCount : undefined,
      keyMilestones: customNotes ? [customNotes] : undefined,
      tone
    });
    setDraftText(draft);
    setIsGenerating(false);
  };

  React.useEffect(() => {
    if (isOpen) {
      handleGenerate();
    }
  }, [isOpen, member.id]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-xl rounded-2xl border border-[#E6E3DA] bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0EDE6]">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#1E3A2F]" />
            <h2 className="font-serif text-lg font-bold text-[#1C1917]">
              Asisten Penulis Kisah Keluarga
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#78716C] hover:bg-[#F2EFEA] hover:text-[#1C1917] transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Fact summary pill box */}
        <div className="mt-4 rounded-xl border border-[#E6E3DA] bg-[#FAF8F5] p-3 text-xs text-[#57534E]">
          <div className="font-semibold text-[#1C1917] mb-1">
            Fakta Terverifikasi untuk {member.firstName}:
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[#78716C]">
            <span>Lahir: {member.birthDate || 'Tidak tercatat'} ({member.birthPlace || 'Kota asal belum dicatat'})</span>
            {member.occupation && <span>Profesi: {member.occupation}</span>}
            {spouse && <span>Pasangan: {spouse.firstName}</span>}
            {childrenCount > 0 && <span>Jumlah Anak: {childrenCount}</span>}
          </div>
        </div>

        {/* Tone options */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-[#78716C]">Gaya Penulisan:</span>
          {(['warm', 'formal', 'poetic'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTone(t)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                tone === t ? 'bg-[#1E3A2F] text-white' : 'border border-[#E6E3DA] bg-white text-[#57534E] hover:bg-[#FAF8F5]'
              }`}
            >
              {t === 'warm' ? 'Hangat & Akrab' : t === 'formal' ? 'Khidmat & Formal' : 'Puitis & Nostalgik'}
            </button>
          ))}
        </div>

        {/* Additional custom notes input */}
        <div className="mt-3">
          <label className="block text-xs font-medium text-[#44403C] mb-1">
            Tambahkan Kenangan Khusus (Opsional):
          </label>
          <input
            type="text"
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            placeholder="Contoh: gemar memetik kecapi Sunda dan sering mengajak cucu ke pasar Dago..."
            className="w-full rounded-lg border border-[#E6E3DA] bg-[#FAF8F5] p-2 text-xs focus:border-[#1E3A2F] focus:outline-none"
          />
        </div>

        {/* Editorial Draft Box */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2D5A46]">
              <BookOpen className="h-4 w-4" />
              <span>Draf Biografi AI (Bisa Diedit Manual)</span>
            </div>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center gap-1 text-[11px] text-[#78716C] hover:text-[#1E3A2F]"
            >
              <RefreshCw className={`h-3 w-3 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>Buat Ulang</span>
            </button>
          </div>

          <textarea
            rows={6}
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            disabled={isGenerating}
            className="w-full rounded-xl border border-[#D5E3DA] bg-[#FDFBF7] p-3.5 font-serif text-sm leading-relaxed text-[#292524] focus:border-[#1E3A2F] focus:outline-none"
          />
        </div>

        {/* Notice */}
        <div className="mt-3 flex items-center gap-2 text-[11px] text-[#78716C]">
          <AlertCircle className="h-3.5 w-3.5 text-[#8C6D46] shrink-0" />
          <span>Teks ini merupakan draf awal. Periksa dan sesuaikan sebelum menyimpannya ke profil anggota.</span>
        </div>

        {/* Actions */}
        <div className="mt-5 flex items-center justify-end gap-2 border-t border-[#F0EDE6] pt-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-[#E6E3DA] px-4 py-2 text-xs font-medium text-[#57534E] hover:bg-[#FAF8F5]"
          >
            Batal
          </button>
          <button
            onClick={() => {
              onSaveStory(member.id, draftText);
              onClose();
            }}
            disabled={!draftText.trim()}
            className="flex items-center gap-1.5 rounded-lg bg-[#1E3A2F] px-4 py-2 text-xs font-medium text-white hover:bg-[#284E3F] transition shadow-xs disabled:opacity-50"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Setujui & Simpan ke Profil</span>
          </button>
        </div>
      </div>
    </div>
  );
};
