import React, { useState } from 'react';
import { X, Share2, Copy, Check, QrCode, Lock, Globe, Shield } from 'lucide-react';
import { FamilySpace, FamilyMember } from '../../types';
import { generateQrSvg } from '../../utils/qrCode';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  family: FamilySpace;
  selectedMember?: FamilyMember | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  family,
  selectedMember,
}) => {
  const [shareTarget, setShareTarget] = useState<'family' | 'member'>('family');
  const [copied, setCopied] = useState(false);
  const [hideLiving, setHideLiving] = useState(true);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://silsantara.id';
  const shareLink = shareTarget === 'family'
    ? `${currentUrl}?family=${family.id}&view=tree${hideLiving ? '&hide_living=1' : ''}`
    : `${currentUrl}?family=${family.id}&member=${selectedMember?.id || 'all'}`;

  const qrSvg = generateQrSvg(shareLink, 180);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-2xl border border-[#E6E3DA] bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0EDE6]">
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-[#1E3A2F]" />
            <h2 className="font-serif text-lg font-bold text-[#1C1917]">
              Bagikan Silsilah Keluarga
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#78716C] hover:bg-[#F2EFEA] hover:text-[#1C1917] transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Target Switcher */}
        <div className="mt-4 flex rounded-lg border border-[#E6E3DA] bg-[#FAF8F5] p-1">
          <button
            onClick={() => setShareTarget('family')}
            className={`flex-1 rounded-md py-1.5 text-xs font-medium transition ${
              shareTarget === 'family' ? 'bg-white text-[#1E3A2F] shadow-xs' : 'text-[#78716C]'
            }`}
          >
            Seluruh Silsilah Keluarga
          </button>
          {selectedMember && (
            <button
              onClick={() => setShareTarget('member')}
              className={`flex-1 rounded-md py-1.5 text-xs font-medium transition ${
                shareTarget === 'member' ? 'bg-white text-[#1E3A2F] shadow-xs' : 'text-[#78716C]'
              }`}
            >
              Profil {selectedMember.firstName}
            </button>
          )}
        </div>

        {/* QR Code Section */}
        <div className="mt-5 flex flex-col items-center justify-center rounded-xl border border-[#E6E3DA] bg-[#FAF8F5] p-4">
          <div 
            className="rounded-lg bg-white p-2 shadow-xs"
            dangerouslySetInnerHTML={{ __html: qrSvg }}
          />
          <div className="mt-2 text-center">
            <div className="text-xs font-semibold text-[#1C1917]">
              {shareTarget === 'family' ? family.name : `${selectedMember?.firstName} ${selectedMember?.lastName || ''}`}
            </div>
            <div className="text-[11px] text-[#78716C]">
              Pindai kode QR untuk membuka tautan silsilah
            </div>
          </div>
        </div>

        {/* Privacy options */}
        <div className="mt-4 space-y-2 rounded-xl border border-[#E6E3DA] bg-white p-3 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#44403C]">
              <Shield className="h-4 w-4 text-[#2D5A46]" />
              <span className="font-medium">Sembunyikan Data Anggota Hidup</span>
            </div>
            <input
              type="checkbox"
              checked={hideLiving}
              onChange={(e) => setHideLiving(e.target.checked)}
              className="accent-[#1E3A2F]"
            />
          </div>
          <div className="text-[11px] text-[#78716C] leading-normal pl-6">
            Demi menjaga privasi, kontak dan rincian pribadi anggota keluarga yang masih hidup tidak akan ditampilkan kepada publik.
          </div>
        </div>

        {/* Copy Link Input */}
        <div className="mt-4 flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={shareLink}
            className="flex-1 rounded-lg border border-[#E6E3DA] bg-[#FAF8F5] p-2 font-mono text-[11px] text-[#57534E] truncate"
          />
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg bg-[#1E3A2F] px-3.5 py-2 text-xs font-medium text-white hover:bg-[#284E3F] transition shrink-0"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Tersalin' : 'Salin'}</span>
          </button>
        </div>

        <div className="mt-5 flex justify-end border-t border-[#F0EDE6] pt-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-[#E6E3DA] px-4 py-2 text-xs font-medium text-[#57534E] hover:bg-[#FAF8F5]"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
