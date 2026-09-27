import React, { useState } from 'react';
import { UserCheck, UserPlus, Mail, Link as LinkIcon, Shield, Copy, Check, X } from 'lucide-react';
import { Collaborator, CollaboratorRole, FamilyMember, FamilySpace } from '../../types';

interface CollaboratorsManagerProps {
  collaborators: Collaborator[];
  members: FamilyMember[];
  family: FamilySpace;
  onAddCollaborator: (collab: Collaborator) => void;
  onUpdateRole: (userId: string, newRole: CollaboratorRole) => void;
}

export const CollaboratorsManager: React.FC<CollaboratorsManagerProps> = ({
  collaborators,
  members,
  family,
  onAddCollaborator,
  onUpdateRole,
}) => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<CollaboratorRole>('EDITOR');
  const [connectedMemberId, setConnectedMemberId] = useState<string>('');
  const [linkCopied, setLinkCopied] = useState(false);

  const inviteLink = typeof window !== 'undefined'
    ? `${window.location.origin}/invite?family=${family.id}&code=wiradinata2026`
    : 'https://silsantara.id/invite?family=wiradinata';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteName.trim()) return;

    onAddCollaborator({
      userId: `usr_invited_${Date.now()}`,
      familyId: family.id,
      email: inviteEmail.trim(),
      name: inviteName.trim(),
      role: inviteRole,
      connectedMemberId: connectedMemberId || undefined,
      joinedAt: new Date().toISOString()
    });

    setInviteEmail('');
    setInviteName('');
    setConnectedMemberId('');
    setShowInviteModal(false);
  };

  const getRoleBadge = (role: CollaboratorRole) => {
    switch (role) {
      case 'OWNER': return 'bg-[#1E3A2F] text-white';
      case 'ADMIN': return 'bg-[#2D5A46] text-white';
      case 'EDITOR': return 'bg-amber-100 text-amber-800 border border-amber-200';
      default: return 'bg-stone-100 text-stone-700 border border-stone-200';
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E3DA] pb-5">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-[#1C1917]">
            Kolaborator & Hak Akses
          </h1>
          <p className="text-xs text-[#78716C] mt-1">
            Undang sanak saudara untuk bersama-sama melengkapi silsilah dan menjaga arsip keluarga
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-1.5 rounded-lg bg-[#1E3A2F] px-4 py-2 text-xs font-medium text-white hover:bg-[#284E3F] transition shadow-xs"
        >
          <UserPlus className="h-4 w-4" />
          <span>Undang Kerabat</span>
        </button>
      </div>

      {/* Role explanation */}
      <div className="rounded-xl border border-[#E6E3DA] bg-white p-4 text-xs text-[#57534E] space-y-2">
        <div className="font-semibold text-[#1C1917]">Tingkat Peran & Wewenang:</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px]">
          <div><span className="font-bold text-[#1E3A2F]">Owner</span>: Kuasa penuh keluarga & kelola admin</div>
          <div><span className="font-bold text-[#2D5A46]">Admin</span>: Kelola anggota, privasi & undang kerabat</div>
          <div><span className="font-bold text-amber-800">Editor</span>: Tambah/edit profil, foto & cerita</div>
          <div><span className="font-bold text-stone-700">Viewer</span>: Hanya membaca silsilah</div>
        </div>
      </div>

      {/* Collaborators List */}
      <div className="rounded-2xl border border-[#E6E3DA] bg-white overflow-hidden shadow-xs">
        <div className="divide-y divide-[#F0EDE6]">
          {collaborators.map(collab => {
            const connectedMember = collab.connectedMemberId
              ? members.find(m => m.id === collab.connectedMemberId)
              : null;

            return (
              <div
                key={collab.userId}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EBE7DF] font-serif text-sm font-semibold text-[#57534E]">
                    {collab.name[0]}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#1C1917]">
                      {collab.name}
                    </div>
                    <div className="text-[11px] text-[#78716C]">
                      {collab.email}
                    </div>
                    {connectedMember && (
                      <div className="text-[10px] text-[#2D5A46] mt-0.5">
                        Taut akun profil: {connectedMember.firstName} {connectedMember.lastName || ''}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${getRoleBadge(collab.role)}`}>
                    {collab.role}
                  </span>

                  {collab.role !== 'OWNER' && (
                    <select
                      value={collab.role}
                      onChange={(e) => onUpdateRole(collab.userId, e.target.value as CollaboratorRole)}
                      className="rounded-lg border border-[#E6E3DA] bg-[#FAF8F5] px-2 py-1 text-xs text-[#44403C] focus:outline-none"
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="EDITOR">Editor</option>
                      <option value="VIEWER">Viewer</option>
                    </select>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl border border-[#E6E3DA] bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EDE6]">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-[#1E3A2F]" />
                <h2 className="font-serif text-lg font-bold text-[#1C1917]">
                  Undang Kerabat Bergabung
                </h2>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="rounded-lg p-1.5 text-[#78716C] hover:bg-[#F2EFEA]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Direct share link */}
            <div className="mt-4 rounded-xl border border-[#E6E3DA] bg-[#FAF8F5] p-3 text-xs">
              <span className="font-semibold text-[#1C1917] block mb-1">Tautan Undangan Cepat:</span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={inviteLink}
                  className="flex-1 rounded-md border border-[#E6E3DA] bg-white p-1.5 font-mono text-[11px] text-[#57534E] truncate"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="rounded-md bg-[#1E3A2F] px-2.5 py-1.5 text-[11px] font-medium text-white hover:bg-[#284E3F]"
                >
                  {linkCopied ? 'Tersalin' : 'Salin'}
                </button>
              </div>
            </div>

            <form onSubmit={handleSendInvite} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#44403C] mb-1">
                  Nama Kerabat <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="Contoh: Sari Wiradinata"
                  className="w-full rounded-lg border border-[#E6E3DA] bg-[#FAF8F5] p-2 text-xs focus:border-[#1E3A2F] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#44403C] mb-1">
                  Alamat Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="sari.w@gmail.com"
                  className="w-full rounded-lg border border-[#E6E3DA] bg-[#FAF8F5] p-2 text-xs focus:border-[#1E3A2F] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#44403C] mb-1">
                    Peran Kolaborasi
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as CollaboratorRole)}
                    className="w-full rounded-lg border border-[#E6E3DA] bg-[#FAF8F5] p-2 text-xs focus:border-[#1E3A2F] focus:outline-none"
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="EDITOR">Editor</option>
                    <option value="VIEWER">Viewer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#44403C] mb-1">
                    Hubungkan ke Profil
                  </label>
                  <select
                    value={connectedMemberId}
                    onChange={(e) => setConnectedMemberId(e.target.value)}
                    className="w-full rounded-lg border border-[#E6E3DA] bg-[#FAF8F5] p-2 text-xs focus:border-[#1E3A2F] focus:outline-none"
                  >
                    <option value="">(Belum dihubungkan)</option>
                    {members.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.firstName} {m.lastName || ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2 border-t border-[#F0EDE6] pt-3">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="rounded-lg border border-[#E6E3DA] px-4 py-2 text-xs font-medium text-[#57534E] hover:bg-[#FAF8F5]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#1E3A2F] px-4 py-2 text-xs font-medium text-white hover:bg-[#284E3F] transition"
                >
                  Kirim Undangan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
