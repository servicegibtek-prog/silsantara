import React, { useState } from 'react';
import { X, Building, Check } from 'lucide-react';
import { FamilySpace, User } from '../../types';

interface CreateFamilyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onCreateFamily: (family: FamilySpace) => void;
}

export const CreateFamilyModal: React.FC<CreateFamilyModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onCreateFamily,
}) => {
  const [name, setName] = useState('');
  const [clanName, setClanName] = useState('');
  const [originCity, setOriginCity] = useState('');
  const [originProvince, setOriginProvince] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newFamily: FamilySpace = {
      id: `fam_${Date.now()}`,
      name: name.trim(),
      clanName: clanName.trim() || undefined,
      originCity: originCity.trim() || 'Bandung',
      originProvince: originProvince.trim() || 'Jawa Barat',
      description: description.trim() || 'Ruang silsilah keluarga.',
      ownerId: currentUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      privacySettings: {
        isPublic: false,
        livingMembersHidden: true,
        allowGuestTreeShare: true
      }
    };

    onCreateFamily(newFamily);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-2xl border border-[#E6E3DA] bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0EDE6]">
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-[#1E3A2F]" />
            <h2 className="font-serif text-lg font-bold text-[#1C1917]">
              Buat Ruang Keluarga Baru
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#78716C] hover:bg-[#F2EFEA]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#44403C] mb-1">
              Nama Keluarga <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Keluarga Sasongko"
              className="w-full rounded-xl border border-[#E6E3DA] bg-[#FAF8F5] p-2.5 text-xs focus:border-[#1E3A2F] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#44403C] mb-1">
              Rumpun / Marga / Trah
            </label>
            <input
              type="text"
              value={clanName}
              onChange={(e) => setClanName(e.target.value)}
              placeholder="Contoh: Rumpun Sasongko Solo"
              className="w-full rounded-xl border border-[#E6E3DA] bg-[#FAF8F5] p-2.5 text-xs focus:border-[#1E3A2F] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#44403C] mb-1">
                Kota Asal
              </label>
              <input
                type="text"
                value={originCity}
                onChange={(e) => setOriginCity(e.target.value)}
                placeholder="Contoh: Surakarta"
                className="w-full rounded-xl border border-[#E6E3DA] bg-[#FAF8F5] p-2.5 text-xs focus:border-[#1E3A2F] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#44403C] mb-1">
                Provinsi
              </label>
              <input
                type="text"
                value={originProvince}
                onChange={(e) => setOriginProvince(e.target.value)}
                placeholder="Jawa Tengah"
                className="w-full rounded-xl border border-[#E6E3DA] bg-[#FAF8F5] p-2.5 text-xs focus:border-[#1E3A2F] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#44403C] mb-1">
              Deskripsi Singkat
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Keterangan singkat mengenai riwayat berdirinya keluarga..."
              className="w-full rounded-xl border border-[#E6E3DA] bg-[#FAF8F5] p-2.5 text-xs focus:border-[#1E3A2F] focus:outline-none"
            />
          </div>

          <div className="mt-6 flex justify-end gap-2 border-t border-[#F0EDE6] pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#E6E3DA] px-4 py-2 text-xs font-medium text-[#57534E] hover:bg-[#FAF8F5]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#1E3A2F] px-4 py-2 text-xs font-medium text-white hover:bg-[#284E3F] transition"
            >
              Buat Ruang Keluarga
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
