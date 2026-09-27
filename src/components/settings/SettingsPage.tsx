import React, { useState } from 'react';
import { 
  Settings, 
  User as UserIcon, 
  Building, 
  Shield, 
  Download, 
  Upload, 
  Trash2, 
  Check, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { FamilySpace, User, FamilyMember, Relationship } from '../../types';
import { exportToGedcom, parseGedcom } from '../../services/gedcomService';
import { StorageService } from '../../services/storageService';

interface SettingsPageProps {
  currentUser: User;
  activeFamily: FamilySpace;
  members: FamilyMember[];
  relationships: Relationship[];
  onUpdateFamily: (updated: FamilySpace) => void;
  onUpdateUser: (updated: User) => void;
  onImportMembers: (newMembers: Partial<FamilyMember>[]) => void;
  onResetData: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  currentUser,
  activeFamily,
  members,
  relationships,
  onUpdateFamily,
  onUpdateUser,
  onImportMembers,
  onResetData,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'family' | 'privacy' | 'data' | 'firebase'>('data');
  const [copiedEnv, setCopiedEnv] = useState(false);

  // Profile Form
  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [profileSaved, setProfileSaved] = useState(false);

  // Family Form
  const [familyName, setFamilyName] = useState(activeFamily.name);
  const [clanName, setClanName] = useState(activeFamily.clanName || '');
  const [originCity, setOriginCity] = useState(activeFamily.originCity);
  const [originProvince, setOriginProvince] = useState(activeFamily.originProvince);
  const [familySaved, setFamilySaved] = useState(false);

  // Privacy
  const [isPublic, setIsPublic] = useState(activeFamily.privacySettings.isPublic);
  const [livingHidden, setLivingHidden] = useState(activeFamily.privacySettings.livingMembersHidden);

  // Import feedback
  const [importMessage, setImportMessage] = useState<string | null>(null);

  // Save profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ ...currentUser, displayName });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  // Save family
  const handleSaveFamily = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateFamily({
      ...activeFamily,
      name: familyName,
      clanName,
      originCity,
      originProvince,
      privacySettings: {
        ...activeFamily.privacySettings,
        isPublic,
        livingMembersHidden: livingHidden
      }
    });
    setFamilySaved(true);
    setTimeout(() => setFamilySaved(false), 2000);
  };

  // Export GEDCOM file
  const handleExportGedcom = () => {
    const gedText = exportToGedcom(activeFamily.name, members, relationships);
    const blob = new Blob([gedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeFamily.name.replace(/\s+/g, '_')}_silsilah.ged`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export full JSON archive
  const handleExportJson = () => {
    const data = {
      family: activeFamily,
      members,
      relationships,
      exportedAt: new Date().toISOString(),
      platform: 'Silsantara'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeFamily.name.replace(/\s+/g, '_')}_arsip_lengkap.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Handle GEDCOM file import
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const result = parseGedcom(text, activeFamily.id);
        if (result.success && result.members.length > 0) {
          onImportMembers(result.members);
          setImportMessage(`Berhasil mengimpor ${result.importedMembersCount} anggota dari file GEDCOM.`);
        } else {
          setImportMessage(`Gagal mengimpor file GEDCOM: ${result.errors.join(', ')}`);
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="mx-auto max-w-4xl p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="border-b border-[#E6E3DA] pb-5">
        <h1 className="font-serif text-2xl font-bold tracking-tight text-[#1C1917]">
          Pengaturan & Manajemen Data
        </h1>
        <p className="text-xs text-[#78716C] mt-1">
          Kelola profil pengguna, konfigurasi privasi keluarga, serta ekspor/impor standar GEDCOM
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[#E6E3DA] pb-px">
        {[
          { id: 'data', label: 'Manajemen Data & GEDCOM', icon: Download },
          { id: 'family', label: 'Ruang Keluarga', icon: Building },
          { id: 'privacy', label: 'Privasi & Keamanan', icon: Shield },
          { id: 'firebase', label: 'Konfigurasi Firebase', icon: Shield },
          { id: 'profile', label: 'Profil Saya', icon: UserIcon },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 border-b-2 px-4 py-2 text-xs font-medium transition ${
                isActive
                  ? 'border-[#1E3A2F] text-[#1E3A2F]'
                  : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab: Data Management */}
      {activeTab === 'data' && (
        <div className="space-y-6">
          {importMessage && (
            <div className="rounded-xl border border-[#2D5A46] bg-[#F4F8F5] p-3 text-xs text-[#1E3A2F] flex items-center justify-between">
              <span>{importMessage}</span>
              <button onClick={() => setImportMessage(null)} className="font-semibold text-xs ml-2">×</button>
            </div>
          )}

          {/* GEDCOM Export & Import Section */}
          <div className="rounded-2xl border border-[#E6E3DA] bg-white p-6 shadow-xs space-y-4">
            <div>
              <h2 className="font-serif text-base font-bold text-[#1C1917]">
                Dukungan Standar Genealogi GEDCOM 5.5.1
              </h2>
              <p className="text-xs text-[#78716C] mt-1 leading-relaxed">
                GEDCOM (Genealogical Data Communication) adalah standar pertukaran data silsilah internasional yang kompatibel dengan MyHeritage, Ancestry, dan FamilySearch.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="rounded-xl border border-[#EBE7DF] bg-[#FAF8F5] p-4 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#1C1917] flex items-center gap-1.5">
                    <Download className="h-4 w-4 text-[#2D5A46]" />
                    <span>Ekspor File GEDCOM (.ged)</span>
                  </div>
                  <p className="text-[11px] text-[#78716C] mt-1.5 leading-relaxed">
                    Unduh seluruh entitas individu dan struktur keluarga saat ini ke dalam format arsip .ged.
                  </p>
                </div>
                <button
                  onClick={handleExportGedcom}
                  className="mt-4 flex items-center justify-center gap-1.5 rounded-lg bg-[#1E3A2F] p-2 text-xs font-medium text-white hover:bg-[#284E3F] transition"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Unduh File GEDCOM</span>
                </button>
              </div>

              <div className="rounded-xl border border-[#EBE7DF] bg-[#FAF8F5] p-4 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#1C1917] flex items-center gap-1.5">
                    <Upload className="h-4 w-4 text-[#2D5A46]" />
                    <span>Impor File GEDCOM (.ged)</span>
                  </div>
                  <p className="text-[11px] text-[#78716C] mt-1.5 leading-relaxed">
                    Unggah berkas silsilah yang diekspor dari aplikasi lain untuk ditambahkan ke ruang keluarga Anda.
                  </p>
                </div>
                <label className="mt-4 flex items-center justify-center gap-1.5 rounded-lg border border-[#E6E3DA] bg-white p-2 text-xs font-medium text-[#44403C] hover:bg-[#FAF8F5] cursor-pointer transition">
                  <Upload className="h-3.5 w-3.5 text-[#1E3A2F]" />
                  <span>Pilih Berkas .ged</span>
                  <input
                    type="file"
                    accept=".ged"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Full JSON Archive */}
          <div className="rounded-2xl border border-[#E6E3DA] bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-sm font-bold text-[#1C1917]">
                Cadangan Arsip Lengkap (JSON Format)
              </h2>
              <p className="text-xs text-[#78716C] mt-0.5">
                Mencakup seluruh teks kisah, relasi, tautan dokumen, dan log audit keluarga Anda
              </p>
            </div>
            <button
              onClick={handleExportJson}
              className="rounded-lg border border-[#E6E3DA] bg-[#FAF8F5] px-4 py-2 text-xs font-medium text-[#44403C] hover:bg-[#F2EFEA] transition shrink-0"
            >
              Unduh Arsip JSON
            </button>
          </div>

          {/* Reset / Reload Sample Data */}
          <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-sm font-bold text-rose-900 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-rose-700" />
                <span>Muat Ulang Data Sampel / Reset</span>
              </h2>
              <p className="text-xs text-rose-700/80 mt-0.5">
                Kembalikan data silsilah ke kondisi awal Keluarga Wiradinata jika ingin memulai eksplorasi baru
              </p>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Apakah Anda yakin ingin memuat ulang data awal Keluarga Wiradinata?')) {
                  onResetData();
                }
              }}
              className="rounded-lg bg-rose-700 px-4 py-2 text-xs font-medium text-white hover:bg-rose-800 transition shrink-0"
            >
              Reset ke Data Sampel
            </button>
          </div>
        </div>
      )}

      {/* Tab: Family Details */}
      {activeTab === 'family' && (
        <form onSubmit={handleSaveFamily} className="rounded-2xl border border-[#E6E3DA] bg-white p-6 shadow-xs space-y-4">
          <h2 className="font-serif text-base font-bold text-[#1C1917]">
            Rincian Ruang Keluarga
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#44403C] mb-1">Nama Keluarga</label>
              <input
                type="text"
                required
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                className="w-full rounded-lg border border-[#E6E3DA] bg-[#FAF8F5] p-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#44403C] mb-1">Rumpun / Trah</label>
              <input
                type="text"
                value={clanName}
                onChange={(e) => setClanName(e.target.value)}
                className="w-full rounded-lg border border-[#E6E3DA] bg-[#FAF8F5] p-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#44403C] mb-1">Kota Asal</label>
              <input
                type="text"
                value={originCity}
                onChange={(e) => setOriginCity(e.target.value)}
                className="w-full rounded-lg border border-[#E6E3DA] bg-[#FAF8F5] p-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#44403C] mb-1">Provinsi</label>
              <input
                type="text"
                value={originProvince}
                onChange={(e) => setOriginProvince(e.target.value)}
                className="w-full rounded-lg border border-[#E6E3DA] bg-[#FAF8F5] p-2 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-[#F0EDE6]">
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-lg bg-[#1E3A2F] px-4 py-2 text-xs font-medium text-white hover:bg-[#284E3F]"
            >
              {familySaved ? <Check className="h-3.5 w-3.5" /> : null}
              <span>{familySaved ? 'Tersimpan' : 'Simpan Perubahan'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab: Privacy */}
      {activeTab === 'privacy' && (
        <div className="rounded-2xl border border-[#E6E3DA] bg-white p-6 shadow-xs space-y-4">
          <h2 className="font-serif text-base font-bold text-[#1C1917]">
            Pengaturan Visibilitas & Privasi Silsilah
          </h2>

          <div className="space-y-3 text-xs text-[#57534E]">
            <label className="flex items-start gap-3 p-3 rounded-xl border border-[#E6E3DA] bg-[#FAF8F5] cursor-pointer">
              <input
                type="checkbox"
                checked={livingHidden}
                onChange={(e) => setLivingHidden(e.target.checked)}
                className="mt-0.5 accent-[#1E3A2F]"
              />
              <div>
                <span className="font-semibold text-[#1C1917] block">Sembunyikan Informasi Anggota yang Masih Hidup</span>
                <span className="text-[11px] text-[#78716C] mt-0.5 block leading-relaxed">
                  Secara baku melindungi privasi dengan menyamarkan nomor telepon, alamat, dan tanggal lahir penuh bagi kerabat hidup ketika dibagikan.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl border border-[#E6E3DA] bg-[#FAF8F5] cursor-pointer">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="mt-0.5 accent-[#1E3A2F]"
              />
              <div>
                <span className="font-semibold text-[#1C1917] block">Izinkan Akses Publik Terbuka</span>
                <span className="text-[11px] text-[#78716C] mt-0.5 block leading-relaxed">
                  Jika dinonaktifkan, silsilah keluarga hanya dapat dilihat oleh kolaborator resmi yang Anda undang.
                </span>
              </div>
            </label>
          </div>

          <div className="flex justify-end pt-3 border-t border-[#F0EDE6]">
            <button
              onClick={handleSaveFamily}
              className="rounded-lg bg-[#1E3A2F] px-4 py-2 text-xs font-medium text-white hover:bg-[#284E3F]"
            >
              Simpan Pengaturan Privasi
            </button>
          </div>
        </div>
      )}

      {/* Tab: Profile */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="rounded-2xl border border-[#E6E3DA] bg-white p-6 shadow-xs space-y-4">
          <h2 className="font-serif text-base font-bold text-[#1C1917]">
            Profil Akun Pengguna
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#44403C] mb-1">Nama Tampilan</label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-lg border border-[#E6E3DA] bg-[#FAF8F5] p-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#44403C] mb-1">Email Akun</label>
              <input
                type="email"
                disabled
                value={currentUser.email}
                className="w-full rounded-lg border border-[#E6E3DA] bg-[#F5F2EB] p-2 text-xs text-[#78716C] cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-[#F0EDE6]">
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-lg bg-[#1E3A2F] px-4 py-2 text-xs font-medium text-white hover:bg-[#284E3F]"
            >
              {profileSaved ? <Check className="h-3.5 w-3.5" /> : null}
              <span>{profileSaved ? 'Tersimpan' : 'Simpan Profil'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab: Firebase Config */}
      {activeTab === 'firebase' && (
        <div className="rounded-2xl border border-[#E6E3DA] bg-white p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0EDE6]">
            <div>
              <h2 className="font-serif text-base font-bold text-[#1C1917]">
                Konfigurasi Firebase (Opsional / Manual)
              </h2>
              <p className="text-xs text-[#78716C] mt-0.5">
                Aplikasi saat ini berjalan mandiri secara penuh menggunakan penyimpanan lokal peramban. Anda dapat menghubungkan Firebase kapan saja.
              </p>
            </div>
            <span className="rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 text-[11px] font-semibold">
              Mode Mandiri Aktif
            </span>
          </div>

          <div className="rounded-xl border border-[#D5E3DA] bg-[#F4F8F5] p-4 text-xs text-[#2D5A46] space-y-2">
            <div className="font-semibold text-sm text-[#1E3A2F]">
              Status Sistem & Kesiapan Backend
            </div>
            <ul className="space-y-1 list-disc list-inside text-[11px] text-[#44403C]">
              <li><b>Firestore Security Rules</b> telah disiapkan di root proyek: <code className="bg-white px-1.5 py-0.5 rounded border border-[#D5E3DA]">firestore.rules</code></li>
              <li><b>Firebase Storage Rules</b> telah disiapkan di root proyek: <code className="bg-white px-1.5 py-0.5 rounded border border-[#D5E3DA]">storage.rules</code></li>
              <li><b>Variabel Lingkungan</b> dapat diisi di file <code className="bg-white px-1.5 py-0.5 rounded border border-[#D5E3DA]">.env</code> bila Anda sudah memiliki proyek Firebase</li>
            </ul>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-[#44403C]">
                Format Konfigurasi Environment Variables (.env)
              </span>
              <button
                onClick={() => {
                  const snippet = `VITE_FIREBASE_API_KEY="AIzaSyYourApiKeyHere"
VITE_FIREBASE_AUTH_DOMAIN="silsantara-genealogy.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="silsantara-genealogy"
VITE_FIREBASE_STORAGE_BUCKET="silsantara-genealogy.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="1027397071851"
VITE_FIREBASE_APP_ID="1:1027397071851:web:abcdef123456"`;
                  navigator.clipboard.writeText(snippet);
                  setCopiedEnv(true);
                  setTimeout(() => setCopiedEnv(false), 2000);
                }}
                className="text-xs text-[#1E3A2F] font-medium hover:underline flex items-center gap-1"
              >
                {copiedEnv ? 'Tersalin!' : 'Salin Template .env'}
              </button>
            </div>
            <pre className="rounded-xl border border-[#E6E3DA] bg-[#FAF8F5] p-4 font-mono text-[11px] text-[#44403C] overflow-x-auto leading-relaxed">
{`# Variabel Firebase Client (Isi di .env saat Anda siap)
VITE_FIREBASE_API_KEY="AIzaSyYourApiKeyHere"
VITE_FIREBASE_AUTH_DOMAIN="silsantara-genealogy.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="silsantara-genealogy"
VITE_FIREBASE_STORAGE_BUCKET="silsantara-genealogy.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="1027397071851"
VITE_FIREBASE_APP_ID="1:1027397071851:web:abcdef123456"`}
            </pre>
          </div>

          <div className="text-[11px] text-[#78716C] leading-relaxed pt-2">
            💡 <b>Catatan:</b> Seluruh data pohon silsilah, relasi, kenangan, dokumen, dan foto Anda saat ini tetap tersimpan dengan aman di browser lokal Anda dan dapat diekspor kapan saja dalam format <b>GEDCOM (.ged)</b> atau <b>Arsip Lengkap (.json)</b> melalui tab "Manajemen Data & GEDCOM".
          </div>
        </div>
      )}
    </div>
  );
};
