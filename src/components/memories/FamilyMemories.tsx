import React, { useState } from 'react';
import { BookOpen, Plus, MapPin, Calendar, Users, X, Sparkles } from 'lucide-react';
import { FamilyMemory, FamilyMember } from '../../types';

interface FamilyMemoriesProps {
  memories: FamilyMemory[];
  members: FamilyMember[];
  onAddMemory: (memory: Omit<FamilyMemory, 'id' | 'createdAt'>) => void;
}

export const FamilyMemories: React.FC<FamilyMemoriesProps> = ({
  memories,
  members,
  onAddMemory,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<FamilyMemory | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [authorName, setAuthorName] = useState('Rama Wiradinata');
  const [taggedMemberIds, setTaggedMemberIds] = useState<string[]>([]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !story.trim()) return;

    onAddMemory({
      familyId: memories[0]?.familyId || 'fam_wiradinata',
      title: title.trim(),
      story: story.trim(),
      date: date || undefined,
      location: location.trim() || undefined,
      taggedMemberIds,
      photoUrls: ['/src/assets/images/family_archive_lebaran_1790509708584.jpg'],
      authorId: 'usr_rama_1996',
      authorName
    });

    setTitle('');
    setStory('');
    setDate('');
    setLocation('');
    setTaggedMemberIds([]);
    setShowAddModal(false);
  };

  return (
    <div className="mx-auto max-w-4xl p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E3DA] pb-5">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-[#1C1917]">
            Jurnal & Kenangan Keluarga
          </h1>
          <p className="text-xs text-[#78716C] mt-1">
            Cerita, kisah lisan, dan momen berharga yang diwariskan dari generasi ke generasi
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 rounded-lg bg-[#1E3A2F] px-4 py-2 text-xs font-medium text-white hover:bg-[#284E3F] transition shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Tulis Kenangan</span>
        </button>
      </div>

      {/* Editorial Journal Feed */}
      <div className="space-y-8">
        {memories.map((mem, index) => {
          const taggedPeople = mem.taggedMemberIds
            .map(id => members.find(m => m.id === id))
            .filter(Boolean);

          return (
            <article
              key={mem.id}
              className="overflow-hidden rounded-2xl border border-[#E6E3DA] bg-white p-6 sm:p-8 shadow-xs transition hover:border-[#1E3A2F]/40"
            >
              {/* Metadata ribbon */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#78716C] font-mono">
                {mem.date && <span>{mem.date}</span>}
                {mem.location && (
                  <>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-[#A8A29E]" />
                      <span>{mem.location}</span>
                    </span>
                  </>
                )}
              </div>

              {/* Title */}
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1917] mt-2 leading-snug">
                {mem.title}
              </h2>

              {/* Optional Archival Photo */}
              {mem.photoUrls && mem.photoUrls[0] && (
                <div className="my-5 overflow-hidden rounded-xl border border-[#E6E3DA] bg-[#F5F2EB]">
                  <img
                    src={mem.photoUrls[0]}
                    alt={mem.title}
                    className="max-h-[380px] w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="bg-[#FAF8F5] px-3 py-1.5 text-[11px] font-serif italic text-[#78716C] text-center border-t border-[#E6E3DA]">
                    Arsip visual keluarga terkait kenangan ini
                  </div>
                </div>
              )}

              {/* Story Body */}
              <div className="font-serif text-sm leading-relaxed text-[#292524] mt-3 whitespace-pre-line max-w-none">
                {mem.story}
              </div>

              {/* Tagged members & Author footer */}
              <div className="mt-6 pt-4 border-t border-[#F0EDE6] flex flex-wrap items-center justify-between gap-3 text-xs text-[#78716C]">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#A8A29E]">Kerabat yang terlibat:</span>
                  <div className="flex flex-wrap gap-1">
                    {taggedPeople.map(p => p && (
                      <span key={p.id} className="rounded-md bg-[#FAF8F5] px-2 py-0.5 text-[11px] text-[#44403C] border border-[#E6E3DA]">
                        {p.firstName}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-[11px]">
                  Ditulis oleh: <span className="font-semibold text-[#1C1917]">{mem.authorName}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Add Memory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-xl rounded-2xl border border-[#E6E3DA] bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EDE6]">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#1E3A2F]" />
                <h2 className="font-serif text-lg font-bold text-[#1C1917]">
                  Tulis Kenangan Keluarga Baru
                </h2>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1.5 text-[#78716C] hover:bg-[#F2EFEA] hover:text-[#1C1917] transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#44403C] mb-1">
                  Judul Kenangan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Mudik Lebaran ke Bandung Tahun 1995"
                  className="w-full rounded-lg border border-[#E6E3DA] bg-[#FAF8F5] p-2 text-xs focus:border-[#1E3A2F] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#44403C] mb-1">
                    Waktu / Tanggal
                  </label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="Contoh: 1995 atau April 1995"
                    className="w-full rounded-lg border border-[#E6E3DA] bg-[#FAF8F5] p-2 text-xs focus:border-[#1E3A2F] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#44403C] mb-1">
                    Lokasi Peristiwa
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Contoh: Dago, Bandung"
                    className="w-full rounded-lg border border-[#E6E3DA] bg-[#FAF8F5] p-2 text-xs focus:border-[#1E3A2F] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#44403C] mb-1">
                  Kisah & Kenangan <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={6}
                  required
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  placeholder="Ceritakan dengan detail hangat: suasana, aroma, percakapan, apa yang dirasakan saat itu..."
                  className="w-full rounded-lg border border-[#E6E3DA] bg-[#FAF8F5] p-3 font-serif text-sm leading-relaxed focus:border-[#1E3A2F] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#44403C] mb-1">
                  Tandai Anggota yang Terlibat
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 border border-[#E6E3DA] rounded-lg bg-[#FAF8F5]">
                  {members.map(m => {
                    const isTagged = taggedMemberIds.includes(m.id);
                    return (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => {
                          if (isTagged) {
                            setTaggedMemberIds(taggedMemberIds.filter(id => id !== m.id));
                          } else {
                            setTaggedMemberIds([...taggedMemberIds, m.id]);
                          }
                        }}
                        className={`rounded-md px-2 py-1 text-xs font-medium transition ${
                          isTagged ? 'bg-[#1E3A2F] text-white' : 'bg-white text-[#44403C] border border-[#E6E3DA]'
                        }`}
                      >
                        {m.firstName} {m.lastName || ''}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2 border-t border-[#F0EDE6] pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg border border-[#E6E3DA] px-4 py-2 text-xs font-medium text-[#57534E] hover:bg-[#FAF8F5]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#1E3A2F] px-4 py-2 text-xs font-medium text-white hover:bg-[#284E3F] transition"
                >
                  Simpan Kenangan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
