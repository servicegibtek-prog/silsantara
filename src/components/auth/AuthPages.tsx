import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, ArrowRight, ArrowLeft, Check, Shield } from 'lucide-react';
import { User } from '../../types';

interface AuthPagesProps {
  initialView?: 'login' | 'register' | 'forgot';
  onSuccess: (user: User, isNewUser?: boolean) => void;
  onBackToLanding: () => void;
}

export const AuthPages: React.FC<AuthPagesProps> = ({
  initialView = 'login',
  onSuccess,
  onBackToLanding,
}) => {
  const [view, setView] = useState<'login' | 'register' | 'forgot'>(initialView);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [forgotSent, setForgotSent] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Mohon lengkapi email dan kata sandi Anda.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Kata sandi minimal terdiri dari 6 karakter.');
      return;
    }

    // Authenticate user
    const user: User = {
      id: `usr_${Date.now()}`,
      email,
      displayName: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      createdAt: new Date().toISOString()
    };
    onSuccess(user, false);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!displayName || !email || !password) {
      setErrorMessage('Mohon lengkapi seluruh kolom pendaftaran.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Kata sandi minimal harus 6 karakter demi keamanan akun.');
      return;
    }

    const user: User = {
      id: `usr_${Date.now()}`,
      email,
      displayName,
      createdAt: new Date().toISOString()
    };
    onSuccess(user, true); // new user goes to onboarding!
  };

  const handleGoogleAuth = () => {
    const user: User = {
      id: 'usr_rama_1996',
      email: 'gian.ule@gmail.com',
      displayName: 'Rama Wiradinata',
      createdAt: new Date().toISOString()
    };
    onSuccess(user, false);
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Masukkan email Anda.');
      return;
    }
    setForgotSent(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F7F3] flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-[#2D5A46] selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <button
          onClick={onBackToLanding}
          className="mb-4 flex items-center gap-1.5 text-xs text-[#78716C] hover:text-[#1E3A2F] mx-auto transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kembali ke Beranda Depan</span>
        </button>

        <div className="text-center">
          <span className="font-serif text-3xl font-bold tracking-tight text-[#1E3A2F]">
            Silsantara
          </span>
          <p className="text-xs font-serif italic text-[#78716C] mt-1">
            "Merangkai cerita, menjaga silsilah"
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="rounded-2xl border border-[#E6E3DA] bg-white p-7 sm:p-8 shadow-md">
          {errorMessage && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">
              {errorMessage}
            </div>
          )}

          {/* LOGIN VIEW */}
          {view === 'login' && (
            <div>
              <h2 className="font-serif text-xl font-bold text-[#1C1917]">
                Masuk ke Akun Silsantara
              </h2>
              <p className="text-xs text-[#78716C] mt-0.5">
                Akses silsilah dan catatan kenangan keluarga Anda
              </p>

              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="mt-5 flex w-full items-center justify-center gap-3 rounded-xl border border-[#E6E3DA] bg-[#FAF8F5] p-2.5 text-xs font-semibold text-[#1C1917] hover:bg-[#F2EFEA] transition shadow-2xs"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.67-5.17 3.67-9.15z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.25v3.15C3.26 21.36 7.34 24 12 24z" />
                  <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.25C.45 8.22 0 10.05 0 12s.45 3.78 1.25 5.39l4.02-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.61l4.02 3.15c.95-2.85 3.6-4.96 6.73-4.96z" />
                </svg>
                <span>Masuk dengan Akun Google</span>
              </button>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E6E3DA]" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-[#A8A29E]">atau dengan email</span>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#44403C] mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full rounded-xl border border-[#E6E3DA] bg-[#FAF8F5] p-2.5 text-xs focus:border-[#1E3A2F] focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-[#44403C]">
                      Kata Sandi
                    </label>
                    <button
                      type="button"
                      onClick={() => setView('forgot')}
                      className="text-[11px] text-[#1E3A2F] hover:underline"
                    >
                      Lupa kata sandi?
                    </button>
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-[#E6E3DA] bg-[#FAF8F5] p-2.5 text-xs focus:border-[#1E3A2F] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#1E3A2F] p-2.5 text-xs font-medium text-white hover:bg-[#284E3F] transition shadow-xs"
                >
                  Masuk ke Silsantara
                </button>
              </form>

              <div className="mt-5 text-center text-xs text-[#78716C]">
                Belum memiliki akun?{' '}
                <button
                  onClick={() => setView('register')}
                  className="font-semibold text-[#1E3A2F] hover:underline"
                >
                  Daftar sekarang
                </button>
              </div>
            </div>
          )}

          {/* REGISTER VIEW */}
          {view === 'register' && (
            <div>
              <h2 className="font-serif text-xl font-bold text-[#1C1917]">
                Buat Akun Silsantara Baru
              </h2>
              <p className="text-xs text-[#78716C] mt-0.5">
                Mulai bangun silsilah dan abadikan memori keluarga Anda
              </p>

              <button
                type="button"
                onClick={handleGoogleAuth}
                className="mt-5 flex w-full items-center justify-center gap-3 rounded-xl border border-[#E6E3DA] bg-[#FAF8F5] p-2.5 text-xs font-semibold text-[#1C1917] hover:bg-[#F2EFEA] transition shadow-2xs"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.67-5.17 3.67-9.15z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.25v3.15C3.26 21.36 7.34 24 12 24z" />
                  <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.25C.45 8.22 0 10.05 0 12s.45 3.78 1.25 5.39l4.02-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.61l4.02 3.15c.95-2.85 3.6-4.96 6.73-4.96z" />
                </svg>
                <span>Daftar Cepat dengan Google</span>
              </button>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E6E3DA]" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-[#A8A29E]">atau dengan email</span>
                </div>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#44403C] mb-1">
                    Nama Lengkap Anda
                  </label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Contoh: Dina Wiradinata"
                    className="w-full rounded-xl border border-[#E6E3DA] bg-[#FAF8F5] p-2.5 text-xs focus:border-[#1E3A2F] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#44403C] mb-1">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full rounded-xl border border-[#E6E3DA] bg-[#FAF8F5] p-2.5 text-xs focus:border-[#1E3A2F] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#44403C] mb-1">
                    Kata Sandi (Minimal 6 karakter)
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-[#E6E3DA] bg-[#FAF8F5] p-2.5 text-xs focus:border-[#1E3A2F] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#1E3A2F] p-2.5 text-xs font-medium text-white hover:bg-[#284E3F] transition shadow-xs"
                >
                  Lanjut ke Pembuatan Silsilah
                </button>
              </form>

              <div className="mt-5 text-center text-xs text-[#78716C]">
                Sudah punya akun?{' '}
                <button
                  onClick={() => setView('login')}
                  className="font-semibold text-[#1E3A2F] hover:underline"
                >
                  Masuk di sini
                </button>
              </div>
            </div>
          )}

          {/* FORGOT PASSWORD VIEW */}
          {view === 'forgot' && (
            <div>
              <h2 className="font-serif text-xl font-bold text-[#1C1917]">
                Atur Ulang Kata Sandi
              </h2>
              <p className="text-xs text-[#78716C] mt-0.5">
                Kami akan mengirimkan instruksi pemulihan ke alamat email Anda
              </p>

              {forgotSent ? (
                <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800">
                  <div className="font-semibold flex items-center gap-1.5 mb-1">
                    <Check className="h-4 w-4" />
                    <span>Tautan Pemulihan Terkirim!</span>
                  </div>
                  Silakan periksa kotak masuk email Anda ({email}) untuk memperbarui kata sandi.
                  <button
                    onClick={() => setView('login')}
                    className="mt-3 block text-xs font-bold text-emerald-900 underline"
                  >
                    Kembali ke Halaman Masuk
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgot} className="mt-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#44403C] mb-1">
                      Email Akun
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="w-full rounded-xl border border-[#E6E3DA] bg-[#FAF8F5] p-2.5 text-xs focus:border-[#1E3A2F] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[#1E3A2F] p-2.5 text-xs font-medium text-white hover:bg-[#284E3F] transition"
                  >
                    Kirim Instruksi Pemulihan
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setView('login')}
                      className="text-xs text-[#78716C] hover:text-[#1C1917]"
                    >
                      Batal, kembali ke Masuk
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
