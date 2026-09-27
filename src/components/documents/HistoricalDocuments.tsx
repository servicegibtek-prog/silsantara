import React, { useState } from 'react';
import { FileText, Plus, Filter, Shield, Calendar, Users, Eye, X } from 'lucide-react';
import { FamilyDocument, FamilyMember, DocumentCategory } from '../../types';

interface HistoricalDocumentsProps {
  documents: FamilyDocument[];
  members: FamilyMember[];
  onAddDocument: (doc: Omit<FamilyDocument, 'id' | 'createdAt'>) => void;
}

export const HistoricalDocuments: React.FC<HistoricalDocumentsProps> = ({
  documents,
  members,
  onAddDocument,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedDoc, setSelectedDoc] = useState<FamilyDocument | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('AKTA_KELAHIRAN');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [attachedMemberIds, setAttachedMemberIds] = useState<string[]>([]);

  const filteredDocs = categoryFilter === 'all'
    ? documents
    : documents.filter(d => d.category === categoryFilter);

  const getCategoryLabel = (cat: DocumentCategory) => {
    switch (cat) {
      case 'AKTA_KELAHIRAN': return 'Akta Kelahiran';
      case 'AKTA_NIKAH': return 'Akta Nikah / Buku Nikah';
      case 'IJAZAH': return 'Ijazah & Pendidikan';
      case 'SURAT_LAMA': return 'Surat Lama / Korespondensi';
      case 'DOKUMEN_KELUARGA': return 'Kartu Keluarga & Silsilah';
      case 'SERTIFIKAT': return 'Sertifikat & Piagam';
      default: return 'Dokumen Lainnya';
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddDocument({
      familyId: documents[0]?.familyId || 'fam_wiradinata',
      title: title.trim(),
      category,
      fileUrl: '/src/assets/images/family_document_akta_1790509720032.jpg',
      fileType: 'image/jpeg',
      date: date || undefined,
      notes: notes.trim() || undefined,
      attachedMemberIds,
      privacyLevel: 'FAMILY',
      uploadedBy: 'Rama Wiradinata'
    });

    setTitle('');
    setDate('');
    setNotes('');
    setAttachedMemberIds([]);
    setShowUploadModal(false);
  };

  return (
    <div className="mx-auto max-w-5xl p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E3DA] pb-5">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-[#1C1917]">
            Arsip Dokumen Sejarah Keluarga
          </h1>
          <p className="text-xs text-[#78716C] mt-1">
            Penyimpanan digital terenkripsi untuk akta kelahiran, buku nikah, ijazah, dan surat wasiat
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-1.5 rounded-lg bg-[#1E3A2F] px-4 py-2 text-xs font-medium text-white hover:bg-[#284E3F] transition shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Unggah Dokumen</span>
        </button>
      </div>

      {/* Filter Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setCategoryFilter('all')}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition ${
            categoryFilter === 'all'
              ? 'bg-[#1E3A2F] text-white shadow-2xs'
              : 'border border-[#E6E3DA] bg-white text-[#44403C] hover:bg-[#FAF8F5]'
          }`}
        >
          Semua Dokumen ({documents.length})
        </button>
        {(['AKTA_KELAHIRAN', 'AKTA_NIKAH', 'IJAZAH', 'SURAT_LAMA', 'DOKUMEN_KELUARGA'] as DocumentCategory[]).map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition ${
              categoryFilter === cat
                ? 'bg-[#1E3A2F] text-white shadow-2xs'
                : 'border border-[#E6E3DA] bg-white text-[#44403C] hover:bg-[#FAF8F5]'
            }`}
          >
            {getCategoryLabel(cat)}
          </button>
        ))}
      </div>

      {/* Document List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map(doc => {
          const attachedPeople = doc.attachedMemberIds
            .map(id => members.find(m => m.id === id))
            .filter(Boolean);

          return (
            <div
              key={doc.id}
              className="rounded-2xl border border-[#E6E3DA] bg-white p-5 shadow-xs transition hover:border-[#1E3A2F]/40 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FAF8F5] border border-[#E6E3DA] text-[#2D5A46]">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#2D5A46]">
                        {getCategoryLabel(doc.category)}
                      </span>
                      <h2 className="font-serif text-sm font-bold text-[#1C1917] mt-0.5 leading-snug">
                        {doc.title}
                      </h2>
                    </div>
                  </div>

                  <span className="rounded-md bg-[#FAF8F5] px-2 py-0.5 text-[10px] font-medium text-[#78716C] border border-[#EBE7DF]">
                    {doc.privacyLevel === 'RESTRICTED' ? 'Terbatas' : 'Keluarga'}
                  </span>
                </div>

                {doc.notes && (
                  <p className="font-serif text-xs text-[#57534E] mt-3 leading-relaxed">
                    {doc.notes}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-[#F5F2EB] flex items-center justify-between text-xs text-[#78716C]">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-[#A8A29E]" />
                  <span className="font-mono tabular-nums text-[11px]">{doc.date || 'Tahun tidak tercatat'}</span>
                </div>

                <button
                  onClick={() => setSelectedDoc(doc)}
                  className="flex items-center gap-1 text-xs font-medium text-[#1E3A2F] hover:underline"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Lihat Dokumen</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Document Preview Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EDE6]">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#2D5A46]">
                  {getCategoryLabel(selectedDoc.category)}
                </span>
                <h2 className="font-serif text-base font-bold text-[#1C1917]">
                  {selectedDoc.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="rounded-lg p-1.5 text-[#78716C] hover:bg-[#F2EFEA]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 max-h-[60vh] overflow-hidden rounded-xl border border-[#E6E3DA] bg-[#F5F2EB]">
              <img
                src={selectedDoc.fileUrl}
                alt={selectedDoc.title}
                className="w-full h-auto max-h-[55vh] object-contain mx-auto"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="mt-4 text-xs text-[#57534E]">
              {selectedDoc.notes && <p className="font-serif leading-relaxed">{selectedDoc.notes}</p>}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedDoc(null)}
                className="rounded-lg bg-[#1E3A2F] px-4 py-2 text-xs font-medium text-white hover:bg-[#284E3F]"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl border border-[#E6E3DA] bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EDE6]">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#1E3A2F]" />
                <h2 className="font-serif text-lg font-bold text-[#1C1917]">
                  Unggah Dokumen Arsip
                </h2>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="rounded-lg p-1.5 text-[#78716C] hover:bg-[#F2EFEA]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#44403C] mb-1">
                  Nama / Judul Dokumen <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Akta Kelahiran Hasan Wiradinata"
                  className="w-full rounded-lg border border-[#E6E3DA] bg-[#FAF8F5] p-2 text-xs focus:border-[#1E3A2F] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#44403C] mb-1">
                    Kategori Dokumen
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                    className="w-full rounded-lg border border-[#E6E3DA] bg-[#FAF8F5] p-2 text-xs focus:border-[#1E3A2F] focus:outline-none"
                  >
                    <option value="AKTA_KELAHIRAN">Akta Kelahiran</option>
                    <option value="AKTA_NIKAH">Akta Nikah / Buku Nikah</option>
                    <option value="IJAZAH">Ijazah & Pendidikan</option>
                    <option value="SURAT_LAMA">Surat Lama & Korespondensi</option>
                    <option value="DOKUMEN_KELUARGA">Kartu Keluarga / Berkas</option>
                    <option value="SERTIFIKAT">Sertifikat & Piagam</option>
                    <option value="LAINNYA">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#44403C] mb-1">
                    Tanggal Terbit / Tahun
                  </label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="Contoh: 1968-08-25"
                    className="w-full rounded-lg border border-[#E6E3DA] bg-[#FAF8F5] p-2 text-xs focus:border-[#1E3A2F] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#44403C] mb-1">
                  Catatan Dokumen
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Keterangan instansi penerbit, kondisi arsip fisik, dll..."
                  className="w-full rounded-lg border border-[#E6E3DA] bg-[#FAF8F5] p-2.5 text-xs focus:border-[#1E3A2F] focus:outline-none"
                />
              </div>

              <div className="mt-6 flex justify-end gap-2 border-t border-[#F0EDE6] pt-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="rounded-lg border border-[#E6E3DA] px-4 py-2 text-xs font-medium text-[#57534E] hover:bg-[#FAF8F5]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#1E3A2F] px-4 py-2 text-xs font-medium text-white hover:bg-[#284E3F] transition"
                >
                  Simpan Dokumen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
