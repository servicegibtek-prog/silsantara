import React from 'react';
import { 
  GitFork, 
  BookOpen, 
  Shield, 
  Users, 
  ArrowRight, 
  FileText, 
  Check, 
  Heart,
  Compass
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
  onOpenRegister: () => void;
  onOpenLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  onOpenRegister,
  onOpenLogin,
}) => {
  return (
    <div className="min-h-screen bg-[#F8F7F3] text-[#1C1917] selection:bg-[#2D5A46] selection:text-white flex flex-col font-sans">
      {/* Top Bar Contract (Single text element wordmark, 4 clean nav links, 1-2 primary actions) */}
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#E6E3DA] bg-[#F8F7F3]/90 px-6 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="font-serif text-2xl font-bold tracking-tight text-[#1E3A2F]">
            Silsantara
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#57534E]">
          <a href="#visi" className="hover:text-[#1E3A2F] transition-colors">Visi Platform</a>
          <a href="#fitur" className="hover:text-[#1E3A2F] transition-colors">Silsilah & Fitur</a>
          <a href="#arsip" className="hover:text-[#1E3A2F] transition-colors">Arsip Digital</a>
          <a href="#privasi" className="hover:text-[#1E3A2F] transition-colors">Privasi Keluarga</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenLogin}
            className="text-xs font-semibold text-[#57534E] hover:text-[#1C1917] px-3 py-2 transition"
          >
            Masuk
          </button>
          <button
            onClick={onEnterApp}
            className="rounded-lg bg-[#1E3A2F] px-4 py-2 text-xs font-medium text-white hover:bg-[#284E3F] transition shadow-xs whitespace-nowrap"
          >
            Mulai Silsilah
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-6 pt-16 pb-12 sm:pt-24 sm:pb-16 text-center">
          <div className="text-xs font-serif italic text-[#78716C] tracking-wide mb-3">
            Merangkai cerita, menjaga silsilah
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1C1917] max-w-3xl mx-auto leading-[1.15]">
            Setiap keluarga punya cerita.{' '}
            <span className="text-[#1E3A2F] font-normal italic block sm:inline">Jaga agar tidak hilang.</span>
          </h1>

          <p className="mt-5 text-sm sm:text-base text-[#57534E] max-w-xl mx-auto leading-relaxed">
            Bangun silsilah keluarga Anda dan abadikan kenangan berharga lintas generasi dengan cara yang bermartabat, terstruktur, dan aman.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onEnterApp}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#1E3A2F] px-6 py-3 text-sm font-medium text-white hover:bg-[#284E3F] transition shadow-md"
            >
              <span>Jelajahi Arsip & Silsilah</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={onOpenRegister}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-[#E6E3DA] bg-white px-6 py-3 text-sm font-medium text-[#44403C] hover:bg-[#FAF8F5] transition"
            >
              <span>Daftar Akun Baru</span>
            </button>
          </div>

          {/* Archival Hero Image */}
          <div className="mt-12 overflow-hidden rounded-2xl border border-[#E6E3DA] bg-white p-2 sm:p-3 shadow-lg max-w-4xl mx-auto">
            <div className="relative aspect-16/9 overflow-hidden rounded-xl bg-[#F5F2EB]">
              <img
                src="/src/assets/images/hero_silsantara_family_1790509672270.jpg"
                alt="Potret pusaka keluarga Indonesia lintas generasi di Bandung"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                <div className="text-left text-white">
                  <div className="font-serif text-lg sm:text-xl font-bold">
                    Koleksi Arsip Silsilah Keluarga Wiradinata
                  </div>
                  <div className="text-xs text-white/80 font-sans mt-0.5">
                    Terdokumentasi sejak 1940 di Bandung, Jawa Barat · 4 Generasi
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Editorial Values Section */}
        <section id="visi" className="border-t border-[#E6E3DA] bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-5xl px-6">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#2D5A46]">
                Nilai & Dedikasi Kami
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917] mt-1.5 leading-snug">
                Bukan sekadar bagan nama, melainkan rumah abadi bagi kenangan leluhur.
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-[#57534E] leading-relaxed">
                Di tengah arus zaman yang kian cepat, ikatan kekerabatan sering kali memudar. Silsantara hadir sebagai platform arsip digital keluarga Nusantara yang mengedepankan ketepatan hubungan silsilah, perlindungan privasi data kerabat, serta kehangatan cerita lisan.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FAF8F5] border border-[#E6E3DA] text-[#1E3A2F]">
                  <GitFork className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-base font-bold text-[#1C1917]">
                  Visualisasi Pohon Silsilah
                </h3>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  Kanvas interaktif cerdas yang mampu menguraikan hubungan kekeluargaan yang rumit, ikatan perkawinan ganda, adopsi, hingga penghitungan otomatis derajat sepupu dan keponakan.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FAF8F5] border border-[#E6E3DA] text-[#1E3A2F]">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-base font-bold text-[#1C1917]">
                  Jurnal & Kenangan Lisan
                </h3>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  Ruang editorial untuk menuliskan memori Lebaran, resep pusaka nenek, dan perjuangan hidup sesepuh keluarga, didukung panduan wawancara berbudaya.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FAF8F5] border border-[#E6E3DA] text-[#1E3A2F]">
                  <Shield className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-base font-bold text-[#1C1917]">
                  Kedaulatan & Privasi Data
                </h3>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  Data keluarga Anda adalah milik keluarga Anda. Standar isolasi ruang keluarga, penyembunyian data kontak kerabat hidup, serta kepatuhan standar ekspor GEDCOM.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Spotlight */}
        <section id="fitur" className="border-t border-[#E6E3DA] bg-[#FAF8F5] py-16">
          <div className="mx-auto max-w-5xl px-6">
            <div className="rounded-2xl border border-[#E6E3DA] bg-white p-8 sm:p-10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-md">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#2D5A46]">
                  Fitur Unggulan
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#1C1917] mt-1">
                  Penelusuran Kekerabatan Deterministik
                </h2>
                <p className="text-xs text-[#57534E] mt-2 leading-relaxed">
                  Bingung menentukan sapaan adat untuk kerabat jauh? Fitur "Cari Hubungan Kerabat" menghitung jalur relasi terpendek dalam graf silsilah dan memberikan istilah Nusantara yang tepat.
                </p>

                <div className="mt-5 space-y-2 text-xs text-[#44403C]">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#2D5A46]" />
                    <span>Perhitungan matematis akurat berbasis graph</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#2D5A46]" />
                    <span>Kosa kata kekerabatan Nusantara (Ayah, Ibu, Paman, Sepupu, dll)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#2D5A46]" />
                    <span>Mode fokus untuk menyorot garis leluhur langsung</span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={onEnterApp}
                    className="flex items-center gap-1.5 rounded-lg bg-[#1E3A2F] px-4 py-2 text-xs font-medium text-white hover:bg-[#284E3F] transition"
                  >
                    <span>Coba Sekarang</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Sample Kinship Preview Box */}
              <div className="w-full md:w-80 rounded-xl border border-[#D5E3DA] bg-[#F4F8F5] p-5 text-xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E3A2F]">
                  <Compass className="h-4 w-4 text-[#2D5A46]" />
                  <span>Contoh Hasil Penelusuran</span>
                </div>
                <div className="mt-3 font-serif text-sm font-semibold text-[#1C1917]">
                  "Dina adalah Adik Perempuan Anda"
                </div>
                <div className="mt-3 border-t border-[#E0ECE4] pt-2 text-[11px] text-[#52605B]">
                  <div className="font-medium mb-1">Rantai Silsilah:</div>
                  <div className="font-mono text-[10px] text-[#1E3A2F] bg-white p-2 rounded-md border border-[#D5E3DA]">
                    Rama → Ayah (Bambang) → Dina
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E6E3DA] bg-white py-8 px-6 text-xs text-[#78716C]">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-[#1E3A2F] text-base">Silsantara</span>
            <span>·</span>
            <span>Merangkai cerita, menjaga silsilah</span>
          </div>

          <div>
            © {new Date().getFullYear()} Silsantara Indonesia. Platform arsip keluarga Nusantara.
          </div>
        </div>
      </footer>
    </div>
  );
};
