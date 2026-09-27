import React, { useState } from 'react';
import { 
  Building, 
  User as UserIcon, 
  Users, 
  Heart, 
  ArrowRight, 
  Check, 
  Sparkles,
  GitFork
} from 'lucide-react';
import { FamilySpace, FamilyMember, Relationship, User, Gender } from '../../types';

interface OnboardingWizardProps {
  currentUser: User;
  onComplete: (data: {
    family: FamilySpace;
    selfMember: FamilyMember;
    parents?: FamilyMember[];
    spouse?: FamilyMember;
    children?: FamilyMember[];
  }) => void;
  onSkipToTree: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  currentUser,
  onComplete,
  onSkipToTree,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Step 2: Family space
  const [familyName, setFamilyName] = useState('Keluarga ' + (currentUser.displayName.split(' ')[1] || currentUser.displayName));
  const [clanName, setClanName] = useState('Rumpun ' + (currentUser.displayName.split(' ')[1] || 'Keluarga'));
  const [originCity, setOriginCity] = useState('Bandung');
  const [originProvince, setOriginProvince] = useState('Jawa Barat');
  const [description, setDescription] = useState('Dokumentasi silsilah dan memori lintas generasi.');

  // Step 3: Self Profile
  const nameParts = currentUser.displayName.split(' ');
  const [selfFirstName, setSelfFirstName] = useState(nameParts[0] || 'Rama');
  const [selfLastName, setSelfLastName] = useState(nameParts.slice(1).join(' ') || '');
  const [selfGender, setSelfGender] = useState<Gender>('male');
  const [selfBirthDate, setSelfBirthDate] = useState('1996');
  const [selfBirthPlace, setSelfBirthPlace] = useState('Bandung');

  // Step 4: Parents
  const [fatherFirstName, setFatherFirstName] = useState('');
  const [fatherBirthYear, setFatherBirthYear] = useState('');
  const [motherFirstName, setMotherFirstName] = useState('');
  const [motherBirthYear, setMotherBirthYear] = useState('');

  // Step 5: Optional Spouse & Child
  const [hasSpouse, setHasSpouse] = useState(false);
  const [spouseFirstName, setSpouseFirstName] = useState('');
  const [hasChild, setHasChild] = useState(false);
  const [childFirstName, setChildFirstName] = useState('');
  const [childGender, setChildGender] = useState<Gender>('female');

  const handleFinish = () => {
    const familyId = `fam_${Date.now()}`;
    const newFamily: FamilySpace = {
      id: familyId,
      name: familyName,
      clanName,
      originCity,
      originProvince,
      description,
      ownerId: currentUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      privacySettings: {
        isPublic: false,
        livingMembersHidden: true,
        allowGuestTreeShare: true
      }
    };

    const selfId = `mem_self_${Date.now()}`;
    const selfMember: FamilyMember = {
      id: selfId,
      familyId,
      firstName: selfFirstName,
      lastName: selfLastName,
      gender: selfGender,
      birthDate: selfBirthDate,
      birthPlace: selfBirthPlace,
      isLiving: true,
      generation: 2,
      privacyLevel: 'FAMILY',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: currentUser.id
    };

    const parents: FamilyMember[] = [];
    if (fatherFirstName.trim()) {
      parents.push({
        id: `mem_fat_${Date.now()}`,
        familyId,
        firstName: fatherFirstName.trim(),
        lastName: selfLastName,
        gender: 'male',
        birthDate: fatherBirthYear || undefined,
        isLiving: true,
        generation: 1,
        privacyLevel: 'FAMILY',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: currentUser.id
      });
    }
    if (motherFirstName.trim()) {
      parents.push({
        id: `mem_mot_${Date.now()}`,
        familyId,
        firstName: motherFirstName.trim(),
        gender: 'female',
        birthDate: motherBirthYear || undefined,
        isLiving: true,
        generation: 1,
        privacyLevel: 'FAMILY',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: currentUser.id
      });
    }

    let spouse: FamilyMember | undefined;
    if (hasSpouse && spouseFirstName.trim()) {
      spouse = {
        id: `mem_sp_${Date.now()}`,
        familyId,
        firstName: spouseFirstName.trim(),
        gender: selfGender === 'male' ? 'female' : 'male',
        isLiving: true,
        generation: 2,
        privacyLevel: 'FAMILY',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: currentUser.id
      };
    }

    const children: FamilyMember[] = [];
    if (hasChild && childFirstName.trim()) {
      children.push({
        id: `mem_ch_${Date.now()}`,
        familyId,
        firstName: childFirstName.trim(),
        lastName: selfLastName,
        gender: childGender,
        isLiving: true,
        generation: 3,
        privacyLevel: 'FAMILY',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: currentUser.id
      });
    }

    onComplete({
      family: newFamily,
      selfMember,
      parents: parents.length > 0 ? parents : undefined,
      spouse,
      children: children.length > 0 ? children : undefined
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F7F3] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#2D5A46] selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        {/* Step Progress Dots */}
        <div className="flex items-center justify-between px-6 mb-6">
          {[1, 2, 3, 4, 5].map(s => (
            <div key={s} className="flex items-center">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition ${
                  step === s
                    ? 'bg-[#1E3A2F] text-white'
                    : step > s
                    ? 'bg-[#EBF2EE] text-[#1E3A2F]'
                    : 'bg-[#E6E3DA] text-[#78716C]'
                }`}
              >
                {step > s ? '✓' : s}
              </div>
              {s < 5 && <div className={`h-0.5 w-12 sm:w-16 ${step > s ? 'bg-[#1E3A2F]' : 'bg-[#E6E3DA]'}`} />}
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-[#E6E3DA] bg-white p-7 sm:p-9 shadow-md">
          {/* STEP 1: WELCOME */}
          {step === 1 && (
            <div className="text-center py-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F4F8F5] border border-[#D5E3DA] text-[#1E3A2F]">
                <GitFork className="h-7 w-7" />
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917] mt-5">
                Selamat Datang di Silsantara
              </h1>

              <p className="mt-3 text-sm text-[#57534E] max-w-md mx-auto leading-relaxed">
                Bangun silsilah keluarga dan simpan cerita lintas generasi dalam satu tempat yang aman, bermartabat, dan abadi.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#1E3A2F] px-6 py-3 text-xs font-medium text-white hover:bg-[#284E3F] transition shadow-xs"
                >
                  <span>Mulai Langkah 1: Buat Ruang Keluarga</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CREATE FAMILY */}
          {step === 2 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2D5A46] mb-1">
                <Building className="h-4 w-4" />
                <span>Langkah 2 dari 5</span>
              </div>
              <h2 className="font-serif text-xl font-bold text-[#1C1917]">
                Tentukan Ruang Keluarga
              </h2>
              <p className="text-xs text-[#78716C] mt-0.5">
                Setiap keluarga memiliki ruang arsip silsilah independen
              </p>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#44403C] mb-1">
                    Nama Keluarga <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                    placeholder="Contoh: Keluarga Wiradinata"
                    className="w-full rounded-xl border border-[#E6E3DA] bg-[#FAF8F5] p-2.5 text-xs focus:border-[#1E3A2F] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#44403C] mb-1">
                    Nama Silsilah / Rumpun Keluarga
                  </label>
                  <input
                    type="text"
                    value={clanName}
                    onChange={(e) => setClanName(e.target.value)}
                    placeholder="Contoh: Rumpun Priangan Wiradinata"
                    className="w-full rounded-xl border border-[#E6E3DA] bg-[#FAF8F5] p-2.5 text-xs focus:border-[#1E3A2F] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#44403C] mb-1">
                      Kota Asal Keluarga
                    </label>
                    <input
                      type="text"
                      value={originCity}
                      onChange={(e) => setOriginCity(e.target.value)}
                      placeholder="Bandung"
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
                      placeholder="Jawa Barat"
                      className="w-full rounded-xl border border-[#E6E3DA] bg-[#FAF8F5] p-2.5 text-xs focus:border-[#1E3A2F] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-center pt-3 border-t border-[#F0EDE6]">
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs text-[#78716C] hover:text-[#1C1917]"
                  >
                    Kembali
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!familyName.trim()}
                    className="flex items-center gap-1.5 rounded-xl bg-[#1E3A2F] px-5 py-2.5 text-xs font-medium text-white hover:bg-[#284E3F] transition disabled:opacity-50"
                  >
                    <span>Lanjut ke Profil Diri</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CREATE SELF PROFILE */}
          {step === 3 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2D5A46] mb-1">
                <UserIcon className="h-4 w-4" />
                <span>Langkah 3 dari 5</span>
              </div>
              <h2 className="font-serif text-xl font-bold text-[#1C1917]">
                Profil Diri Anda di Silsilah
              </h2>
              <p className="text-xs text-[#78716C] mt-0.5">
                Ini akan menjadi titik awal silsilah yang terhubung dengan akun Anda
              </p>

              <div className="mt-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#44403C] mb-1">
                      Nama Depan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={selfFirstName}
                      onChange={(e) => setSelfFirstName(e.target.value)}
                      className="w-full rounded-xl border border-[#E6E3DA] bg-[#FAF8F5] p-2.5 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#44403C] mb-1">
                      Nama Belakang / Marga
                    </label>
                    <input
                      type="text"
                      value={selfLastName}
                      onChange={(e) => setSelfLastName(e.target.value)}
                      className="w-full rounded-xl border border-[#E6E3DA] bg-[#FAF8F5] p-2.5 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#44403C] mb-1">
                      Tahun Lahir
                    </label>
                    <input
                      type="text"
                      value={selfBirthDate}
                      onChange={(e) => setSelfBirthDate(e.target.value)}
                      placeholder="1996"
                      className="w-full rounded-xl border border-[#E6E3DA] bg-[#FAF8F5] p-2.5 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#44403C] mb-1">
                      Jenis Kelamin
                    </label>
                    <select
                      value={selfGender}
                      onChange={(e) => setSelfGender(e.target.value as Gender)}
                      className="w-full rounded-xl border border-[#E6E3DA] bg-[#FAF8F5] p-2.5 text-xs focus:outline-none"
                    >
                      <option value="male">Laki-laki</option>
                      <option value="female">Perempuan</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-center pt-3 border-t border-[#F0EDE6]">
                  <button
                    onClick={() => setStep(2)}
                    className="text-xs text-[#78716C] hover:text-[#1C1917]"
                  >
                    Kembali
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    disabled={!selfFirstName.trim()}
                    className="flex items-center gap-1.5 rounded-xl bg-[#1E3A2F] px-5 py-2.5 text-xs font-medium text-white hover:bg-[#284E3F] transition disabled:opacity-50"
                  >
                    <span>Lanjut: Tambah Orang Tua</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: ADD PARENTS */}
          {step === 4 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2D5A46] mb-1">
                <Users className="h-4 w-4" />
                <span>Langkah 4 dari 5</span>
              </div>
              <h2 className="font-serif text-xl font-bold text-[#1C1917]">
                Tambahkan Orang Tua
              </h2>
              <p className="text-xs text-[#78716C] mt-0.5">
                Membentuk cabang ke atas untuk melacak leluhur keluarga Anda
              </p>

              <div className="mt-5 space-y-4">
                {/* Father */}
                <div className="rounded-xl border border-[#E6E3DA] bg-[#FAF8F5] p-3.5 space-y-2">
                  <div className="text-xs font-semibold text-[#1E3A2F]">Data Ayah</div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={fatherFirstName}
                      onChange={(e) => setFatherFirstName(e.target.value)}
                      placeholder="Nama Ayah (Contoh: Bambang)"
                      className="rounded-lg border border-[#E6E3DA] bg-white p-2 text-xs focus:outline-none"
                    />
                    <input
                      type="text"
                      value={fatherBirthYear}
                      onChange={(e) => setFatherBirthYear(e.target.value)}
                      placeholder="Tahun Lahir (Contoh: 1968)"
                      className="rounded-lg border border-[#E6E3DA] bg-white p-2 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* Mother */}
                <div className="rounded-xl border border-[#E6E3DA] bg-[#FAF8F5] p-3.5 space-y-2">
                  <div className="text-xs font-semibold text-[#1E3A2F]">Data Ibu</div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={motherFirstName}
                      onChange={(e) => setMotherFirstName(e.target.value)}
                      placeholder="Nama Ibu (Contoh: Ratna)"
                      className="rounded-lg border border-[#E6E3DA] bg-white p-2 text-xs focus:outline-none"
                    />
                    <input
                      type="text"
                      value={motherBirthYear}
                      onChange={(e) => setMotherBirthYear(e.target.value)}
                      placeholder="Tahun Lahir (Contoh: 1970)"
                      className="rounded-lg border border-[#E6E3DA] bg-white p-2 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-center pt-3 border-t border-[#F0EDE6]">
                  <button
                    onClick={() => setStep(3)}
                    className="text-xs text-[#78716C] hover:text-[#1C1917]"
                  >
                    Kembali
                  </button>
                  <button
                    onClick={() => setStep(5)}
                    className="flex items-center gap-1.5 rounded-xl bg-[#1E3A2F] px-5 py-2.5 text-xs font-medium text-white hover:bg-[#284E3F] transition"
                  >
                    <span>Lanjut ke Langkah Terakhir</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: SPOUSE & CHILDREN (SKIPPABLE) */}
          {step === 5 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2D5A46] mb-1">
                <Heart className="h-4 w-4" />
                <span>Langkah 5 dari 5 (Opsional)</span>
              </div>
              <h2 className="font-serif text-xl font-bold text-[#1C1917]">
                Pasangan & Anak
              </h2>
              <p className="text-xs text-[#78716C] mt-0.5">
                Bisa Anda tambahkan sekarang atau nanti kapan saja dari kanvas silsilah
              </p>

              <div className="mt-5 space-y-4">
                {/* Spouse Toggle */}
                <div className="rounded-xl border border-[#E6E3DA] bg-[#FAF8F5] p-3.5 space-y-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-[#1C1917] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasSpouse}
                      onChange={(e) => setHasSpouse(e.target.checked)}
                      className="accent-[#1E3A2F]"
                    />
                    <span>Saya sudah memiliki pasangan</span>
                  </label>
                  {hasSpouse && (
                    <input
                      type="text"
                      value={spouseFirstName}
                      onChange={(e) => setSpouseFirstName(e.target.value)}
                      placeholder="Nama Pasangan (Contoh: Annisa)"
                      className="w-full rounded-lg border border-[#E6E3DA] bg-white p-2 text-xs focus:outline-none"
                    />
                  )}
                </div>

                {/* Child Toggle */}
                <div className="rounded-xl border border-[#E6E3DA] bg-[#FAF8F5] p-3.5 space-y-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-[#1C1917] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasChild}
                      onChange={(e) => setHasChild(e.target.checked)}
                      className="accent-[#1E3A2F]"
                    />
                    <span>Tambahkan anak pertama</span>
                  </label>
                  {hasChild && (
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={childFirstName}
                        onChange={(e) => setChildFirstName(e.target.value)}
                        placeholder="Nama Anak (Contoh: Kayla)"
                        className="rounded-lg border border-[#E6E3DA] bg-white p-2 text-xs focus:outline-none"
                      />
                      <select
                        value={childGender}
                        onChange={(e) => setChildGender(e.target.value as Gender)}
                        className="rounded-lg border border-[#E6E3DA] bg-white p-2 text-xs focus:outline-none"
                      >
                        <option value="female">Perempuan</option>
                        <option value="male">Laki-laki</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex justify-between items-center pt-3 border-t border-[#F0EDE6]">
                  <button
                    onClick={onSkipToTree}
                    className="text-xs text-[#78716C] hover:text-[#1C1917]"
                  >
                    Lewati langkah ini
                  </button>
                  <button
                    onClick={handleFinish}
                    className="flex items-center gap-1.5 rounded-xl bg-[#1E3A2F] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#284E3F] transition shadow-md"
                  >
                    <Check className="h-4 w-4" />
                    <span>Selesai & Buka Pohon Silsilah</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
