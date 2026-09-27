import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Plus, 
  FolderPlus, 
  Calendar, 
  MapPin, 
  Users, 
  X, 
  Maximize2 
} from 'lucide-react';
import { FamilyPhoto, FamilyAlbum, FamilyMember } from '../../types';

interface PhotoGalleryProps {
  photos: FamilyPhoto[];
  albums: FamilyAlbum[];
  members: FamilyMember[];
  onAddPhoto: (photo: Omit<FamilyPhoto, 'id' | 'createdAt'>) => void;
  onAddAlbum: (album: Omit<FamilyAlbum, 'id' | 'createdAt'>) => void;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  photos,
  albums,
  members,
  onAddPhoto,
  onAddAlbum,
}) => {
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>('all');
  const [activePhoto, setActivePhoto] = useState<FamilyPhoto | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Form states for photo upload
  const [caption, setCaption] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [taggedMemberIds, setTaggedMemberIds] = useState<string[]>([]);

  const filteredPhotos = selectedAlbumId === 'all'
    ? photos
    : photos.filter(p => p.albumId === selectedAlbumId);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) return;

    onAddPhoto({
      familyId: photos[0]?.familyId || 'fam_wiradinata',
      albumId: selectedAlbumId === 'all' ? undefined : selectedAlbumId,
      url: '/src/assets/images/hero_silsantara_family_1790509672270.jpg',
      caption: caption.trim(),
      date: date || undefined,
      location: location.trim() || undefined,
      taggedMemberIds,
      uploadedBy: 'Rama Wiradinata'
    });

    setCaption('');
    setDate('');
    setLocation('');
    setTaggedMemberIds([]);
    setShowUploadModal(false);
  };

  return (
    <div className="mx-auto max-w-6xl p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E3DA] pb-5">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-[#1C1917]">
            Galeri & Arsip Foto Keluarga
          </h1>
          <p className="text-xs text-[#78716C] mt-1">
            Koleksi potret, momen kebersamaan, dan album bersejarah lintas dekade
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-1.5 rounded-lg bg-[#1E3A2F] px-4 py-2 text-xs font-medium text-white hover:bg-[#284E3F] transition shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Unggah Foto</span>
        </button>
      </div>

      {/* Album Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedAlbumId('all')}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition ${
            selectedAlbumId === 'all'
              ? 'bg-[#1E3A2F] text-white shadow-2xs'
              : 'border border-[#E6E3DA] bg-white text-[#44403C] hover:bg-[#FAF8F5]'
          }`}
        >
          Semua Foto ({photos.length})
        </button>
        {albums.map(alb => (
          <button
            key={alb.id}
            onClick={() => setSelectedAlbumId(alb.id)}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition ${
              selectedAlbumId === alb.id
                ? 'bg-[#1E3A2F] text-white shadow-2xs'
                : 'border border-[#E6E3DA] bg-white text-[#44403C] hover:bg-[#FAF8F5]'
            }`}
          >
            {alb.title}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPhotos.map(photo => {
          const taggedPeople = photo.taggedMemberIds
            .map(id => members.find(m => m.id === id))
            .filter(Boolean);

          return (
            <div
              key={photo.id}
              onClick={() => setActivePhoto(photo)}
              className="group overflow-hidden rounded-2xl border border-[#E6E3DA] bg-white shadow-xs transition hover:border-[#1E3A2F]/40 hover:shadow-md cursor-pointer flex flex-col justify-between"
            >
              <div className="relative h-56 bg-[#F5F2EB] overflow-hidden">
                <img
                  src={photo.url}
                  alt={photo.caption || ''}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-103"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 right-2 rounded-lg bg-black/40 p-1.5 text-white opacity-0 group-hover:opacity-100 transition backdrop-blur-xs">
                  <Maximize2 className="h-4 w-4" />
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-[#78716C] font-mono">
                    {photo.date && <span>{photo.date}</span>}
                    {photo.location && (
                      <>
                        <span>·</span>
                        <span>{photo.location}</span>
                      </>
                    )}
                  </div>

                  <p className="font-serif text-xs font-medium text-[#1C1917] mt-1 line-clamp-2 leading-relaxed">
                    {photo.caption}
                  </p>
                </div>

                {taggedPeople.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-[#F5F2EB] flex items-center gap-1.5 text-[11px] text-[#78716C] truncate">
                    <Users className="h-3 w-3 shrink-0 text-[#A8A29E]" />
                    <span className="truncate">
                      {taggedPeople.map(p => p?.firstName).join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Full-Screen Immersive Photo Viewer Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="relative flex flex-col lg:flex-row max-w-5xl w-full max-h-[90vh] rounded-2xl overflow-hidden bg-white shadow-2xl animate-in zoom-in-95 duration-150">
            {/* Left: Big Image */}
            <div className="flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[350px] lg:min-h-[500px]">
              <img
                src={activePhoto.url}
                alt={activePhoto.caption || ''}
                className="max-h-full max-w-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Right: Metadata Panel */}
            <div className="w-full lg:w-80 p-6 flex flex-col justify-between bg-white text-xs text-[#57534E]">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#F0EDE6]">
                  <span className="font-semibold text-xs text-[#1C1917]">Rincian Foto Arsip</span>
                  <button
                    onClick={() => setActivePhoto(null)}
                    className="rounded-lg p-1 text-[#78716C] hover:bg-[#F2EFEA]"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-4">
                  <h3 className="font-serif text-sm font-bold text-[#1C1917] leading-snug">
                    {activePhoto.caption}
                  </h3>

                  {activePhoto.description && (
                    <p className="font-serif text-xs text-[#78716C] mt-2 leading-relaxed">
                      {activePhoto.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 space-y-2 border-t border-[#F0EDE6] pt-3 text-[11px]">
                  {activePhoto.date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-[#78716C]" />
                      <span>{activePhoto.date}</span>
                    </div>
                  )}
                  {activePhoto.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-[#78716C]" />
                      <span>{activePhoto.location}</span>
                    </div>
                  )}
                </div>

                {/* Tagged members in photo */}
                <div className="mt-4 border-t border-[#F0EDE6] pt-3">
                  <div className="font-medium text-[11px] text-[#78716C] mb-2">Kerabat dalam Foto:</div>
                  <div className="flex flex-wrap gap-1">
                    {activePhoto.taggedMemberIds.map(id => {
                      const m = members.find(mem => mem.id === id);
                      return m ? (
                        <span key={id} className="rounded-md bg-[#FAF8F5] px-2 py-0.5 text-[11px] text-[#1E3A2F] border border-[#E6E3DA]">
                          {m.firstName} {m.lastName || ''}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-[#F0EDE6] text-[11px] text-[#A8A29E]">
                Diunggah oleh {activePhoto.uploadedBy}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Photo Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl border border-[#E6E3DA] bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EDE6]">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-[#1E3A2F]" />
                <h2 className="font-serif text-lg font-bold text-[#1C1917]">
                  Unggah Foto Arsip Keluarga
                </h2>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="rounded-lg p-1.5 text-[#78716C] hover:bg-[#F2EFEA] hover:text-[#1C1917] transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#44403C] mb-1">
                  Keterangan Foto (Kapsi) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Contoh: Potret pernikahan Aki dan Enin di Bandung"
                  className="w-full rounded-lg border border-[#E6E3DA] bg-[#FAF8F5] p-2 text-xs focus:border-[#1E3A2F] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#44403C] mb-1">
                    Tahun / Tanggal
                  </label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="Contoh: 1975"
                    className="w-full rounded-lg border border-[#E6E3DA] bg-[#FAF8F5] p-2 text-xs focus:border-[#1E3A2F] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#44403C] mb-1">
                    Lokasi
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Contoh: Bandung, Jawa Barat"
                    className="w-full rounded-lg border border-[#E6E3DA] bg-[#FAF8F5] p-2 text-xs focus:border-[#1E3A2F] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#44403C] mb-1">
                  Tandai Kerabat dalam Foto
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
                  onClick={() => setShowUploadModal(false)}
                  className="rounded-lg border border-[#E6E3DA] px-4 py-2 text-xs font-medium text-[#57534E] hover:bg-[#FAF8F5]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#1E3A2F] px-4 py-2 text-xs font-medium text-white hover:bg-[#284E3F] transition"
                >
                  Simpan Foto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
