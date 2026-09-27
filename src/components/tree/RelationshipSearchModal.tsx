import React, { useState } from 'react';
import { X, Search, Compass, ArrowRight, UserCheck } from 'lucide-react';
import { FamilyMember, Relationship } from '../../types';
import { findKinshipPath, KinshipResult } from '../../services/kinshipEngine';

interface RelationshipSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: FamilyMember[];
  relationships: Relationship[];
  currentUserId: string;
}

export const RelationshipSearchModal: React.FC<RelationshipSearchModalProps> = ({
  isOpen,
  onClose,
  members,
  relationships,
  currentUserId,
}) => {
  const [personAId, setPersonAId] = useState<string>(currentUserId);
  const [personBId, setPersonBId] = useState<string>(
    members.find(m => m.id !== currentUserId)?.id || members[0]?.id || ''
  );

  const result: KinshipResult | null = React.useMemo(() => {
    if (!personAId || !personBId) return null;
    return findKinshipPath(personAId, personBId, members, relationships);
  }, [personAId, personBId, members, relationships]);

  if (!isOpen) return null;

  const personA = members.find(m => m.id === personAId);
  const personB = members.find(m => m.id === personBId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl border border-[#E6E3DA] bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F0EDE6]">
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-[#1E3A2F]" />
            <h2 className="font-serif text-lg font-bold text-[#1C1917]">
              Cari Hubungan Kerabat
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#78716C] hover:bg-[#F2EFEA] hover:text-[#1C1917] transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Person Selectors */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Person A */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1.5">
              Orang Pertama
            </label>
            <select
              value={personAId}
              onChange={(e) => setPersonAId(e.target.value)}
              className="w-full rounded-xl border border-[#E6E3DA] bg-[#FAF8F5] p-2.5 text-xs font-medium text-[#1C1917] focus:border-[#1E3A2F] focus:outline-none"
            >
              {members.map(m => (
                <option key={m.id} value={m.id}>
                  {m.firstName} {m.lastName || ''} {m.id === currentUserId ? '(Anda)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Person B */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1.5">
              Orang Kedua
            </label>
            <select
              value={personBId}
              onChange={(e) => setPersonBId(e.target.value)}
              className="w-full rounded-xl border border-[#E6E3DA] bg-[#FAF8F5] p-2.5 text-xs font-medium text-[#1C1917] focus:border-[#1E3A2F] focus:outline-none"
            >
              {members.map(m => (
                <option key={m.id} value={m.id}>
                  {m.firstName} {m.lastName || ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Result Area */}
        <div className="mt-6 rounded-xl border border-[#D5E3DA] bg-[#F4F8F5] p-5">
          {result && personA && personB ? (
            <div>
              <div className="text-xs uppercase tracking-wider text-[#78716C] font-semibold">
                Hasil Penelusuran Garis Kekerabatan
              </div>

              <div className="mt-2 font-serif text-lg font-bold text-[#1E3A2F]">
                {personB.firstName} adalah {result.relationshipTitle} dari {personA.firstName}
              </div>

              {/* Breadcrumb Path Visualization */}
              <div className="mt-4 border-t border-[#E0ECE4] pt-3">
                <div className="text-xs font-medium text-[#52605B] mb-2">
                  Rantai Silsilah Terpendek ({result.degree} tingkatan):
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  {result.path.map((step, idx) => (
                    <React.Fragment key={step.person.id + idx}>
                      <span className="rounded-md bg-white px-2.5 py-1 text-xs font-medium text-[#1E3A2F] border border-[#D5E3DA] shadow-2xs">
                        {step.person.firstName}
                        {step.description && idx > 0 ? ` (${step.description})` : ''}
                      </span>
                      {idx < result.path.length - 1 && (
                        <ArrowRight className="h-3.5 w-3.5 text-[#2D5A46] shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Cultural Context Note */}
              <div className="mt-4 rounded-lg bg-white/70 p-3 text-[11px] text-[#44403C] leading-relaxed border border-[#E0ECE4]">
                Dalam adat Nusantara, sapaan kekerabatan didasarkan pada pertautan garis orang tua dan sesepuh bersama untuk senantiasa mempererat tali silaturahmi antar keturunan.
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-[#78716C]">
              Tidak ditemukan jalur kekerabatan langsung antara kedua individu ini.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-[#1E3A2F] px-4 py-2 text-xs font-medium text-white hover:bg-[#284E3F] transition"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
