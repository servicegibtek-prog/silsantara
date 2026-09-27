import React from 'react';
import { HelpCircle, GitFork, Compass, Shield, Download, Users, X } from 'lucide-react';

interface HelpFaqModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpFaqModal: React.FC<HelpFaqModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const faqs = [
    {
      q: 'Bagaimana cara menavigasi pohon silsilah?',
      a: 'Anda dapat menggeser (drag/pan) kanvas silsilah dengan klik dan tahan tombol mouse, serta memperbesar/memperkecil dengan scroll mouse atau tombol (+) dan (-) di sudut kiri atas.'
    },
    {
      q: 'Bagaimana cara kerja fitur "Cari Hubungan Kerabat"?',
      a: 'Silsantara menggunakan algoritma Breadth-First Search (BFS) deterministik pada graf silsilah untuk mencari jalur kekerabatan terpendek antara dua individu dan menerjemahkannya ke dalam sapaan adat Nusantara (misal: Paman, Sepupu, Cucu, Ipar).'
    },
    {
      q: 'Apakah data anggota keluarga yang masih hidup aman?',
      a: 'Ya, Silsantara menerapkan perlindungan privasi berlapis. Saat silsilah dibagikan melalui tautan atau kode QR, data sensitif kerabat hidup seperti kontak dan tanggal lahir penuh otomatis disembunyikan.'
    },
    {
      q: 'Bisakah saya mengekspor data ke aplikasi lain?',
      a: 'Tentu. Anda dapat mengekspor seluruh silsilah dalam format standar internasional GEDCOM 5.5.1 (.ged) melalui menu Pengaturan > Manajemen Data.'
    },
    {
      q: 'Bagaimana cara menambahkan pasangan atau anak?',
      a: 'Cukup klik kartu nama kerabat yang bersangkutan di kanvas silsilah. Panel kanan akan terbuka dengan tombol cepat "Tambah Anak", "Tambah Pasangan", "Tambah Orang Tua", atau "Tambah Saudara".'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl border border-[#E6E3DA] bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0EDE6] shrink-0">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-[#1E3A2F]" />
            <h2 className="font-serif text-lg font-bold text-[#1C1917]">
              Bantuan & Panduan Silsantara
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#78716C] hover:bg-[#F2EFEA]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 flex-1 overflow-y-auto space-y-4 pr-1">
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-xl border border-[#E6E3DA] bg-[#FAF8F5] p-3.5 text-xs">
              <h3 className="font-serif font-bold text-[#1C1917] mb-1">
                {faq.q}
              </h3>
              <p className="text-[#57534E] leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end pt-3 border-t border-[#F0EDE6] shrink-0">
          <button
            onClick={onClose}
            className="rounded-lg bg-[#1E3A2F] px-4 py-2 text-xs font-medium text-white hover:bg-[#284E3F]"
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};
