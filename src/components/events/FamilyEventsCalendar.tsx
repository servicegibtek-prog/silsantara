import React, { useState } from 'react';
import { Calendar as CalendarIcon, Plus, MapPin, Clock, Users, X, Heart, Cake } from 'lucide-react';
import { FamilyEvent, FamilyMember, EventType } from '../../types';

interface FamilyEventsCalendarProps {
  events: FamilyEvent[];
  members: FamilyMember[];
  onAddEvent: (evt: Omit<FamilyEvent, 'id' | 'createdAt'>) => void;
}

export const FamilyEventsCalendar: React.FC<FamilyEventsCalendarProps> = ({
  events,
  members,
  onAddEvent,
}) => {
  const [view, setView] = useState<'upcoming' | 'calendar'>('upcoming');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [type, setType] = useState<EventType>('GATHERING');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  // Auto-generate birthdays from living members
  const memberBirthdays: FamilyEvent[] = members
    .filter(m => m.birthDate && m.isLiving)
    .map(m => {
      const parts = m.birthDate!.split('-');
      const monthDay = parts.length >= 3 ? `${parts[1]}-${parts[2]}` : (parts.length === 2 ? `${parts[1]}-01` : '01-01');
      return {
        id: `auto_bday_${m.id}`,
        familyId: m.familyId,
        title: `Ulang Tahun ${m.firstName} ${m.lastName || ''}`,
        type: 'BIRTHDAY' as EventType,
        date: `2026-${monthDay}`,
        isRecurring: true,
        description: `Hari ulang tahun kelahiran ${m.firstName} (${m.birthDate}).`,
        location: m.birthPlace,
        memberIds: [m.id],
        createdAt: ''
      };
    });

  // Combine events and sort
  const allEvents = [...events, ...memberBirthdays].sort((a, b) => a.date.localeCompare(b.date));

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    onAddEvent({
      familyId: events[0]?.familyId || 'fam_wiradinata',
      title: title.trim(),
      type,
      date,
      isRecurring: false,
      description: description.trim() || undefined,
      location: location.trim() || undefined,
      memberIds: []
    });

    setTitle('');
    setDate('');
    setLocation('');
    setDescription('');
    setShowAddModal(false);
  };

  const getEventBadge = (t: EventType) => {
    switch (t) {
      case 'BIRTHDAY': return { label: 'Ulang Tahun', icon: Cake, color: 'text-amber-800 bg-amber-50 border-amber-200' };
      case 'WEDDING_ANNIVERSARY': return { label: 'Pernikahan', icon: Heart, color: 'text-rose-800 bg-rose-50 border-rose-200' };
      case 'MEMORIAL': return { label: 'Peringatan / Haul', icon: Clock, color: 'text-stone-800 bg-stone-100 border-stone-200' };
      default: return { label: 'Silaturahmi', icon: Users, color: 'text-emerald-800 bg-emerald-50 border-emerald-200' };
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E3DA] pb-5">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-[#1C1917]">
            Kalender & Acara Keluarga
          </h1>
          <p className="text-xs text-[#78716C] mt-1">
            Pengingat hari lahir kerabat, peringatan haul sesepuh, dan jadwal silaturahmi besar
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 rounded-lg bg-[#1E3A2F] px-4 py-2 text-xs font-medium text-white hover:bg-[#284E3F] transition shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Acara</span>
        </button>
      </div>

      {/* Agenda Events List */}
      <div className="space-y-3.5">
        {allEvents.map(evt => {
          const badge = getEventBadge(evt.type);
          const BadgeIcon = badge.icon;

          return (
            <div
              key={evt.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#E6E3DA] bg-white p-5 shadow-xs transition hover:border-[#1E3A2F]/40"
            >
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center justify-center h-14 w-14 shrink-0 rounded-xl bg-[#FAF8F5] border border-[#E6E3DA] text-center">
                  <span className="font-mono text-xs font-bold text-[#1E3A2F]">
                    {evt.date.split('-')[2] || '–'}
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-[#78716C]">
                    {new Date(evt.date).toLocaleDateString('id-ID', { month: 'short' })}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold border ${badge.color}`}>
                      <BadgeIcon className="h-3 w-3" />
                      <span>{badge.label}</span>
                    </span>
                    {evt.isRecurring && (
                      <span className="text-[10px] text-[#A8A29E]">Berulang Setiap Tahun</span>
                    )}
                  </div>

                  <h2 className="font-serif text-base font-bold text-[#1C1917] mt-1">
                    {evt.title}
                  </h2>

                  {evt.description && (
                    <p className="font-serif text-xs text-[#57534E] mt-1 leading-relaxed">
                      {evt.description}
                    </p>
                  )}
                </div>
              </div>

              {evt.location && (
                <div className="flex items-center gap-1.5 text-xs text-[#78716C] shrink-0 sm:self-center">
                  <MapPin className="h-3.5 w-3.5 text-[#A8A29E]" />
                  <span>{evt.location}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl border border-[#E6E3DA] bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EDE6]">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-[#1E3A2F]" />
                <h2 className="font-serif text-lg font-bold text-[#1C1917]">
                  Tambah Acara Keluarga
                </h2>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1.5 text-[#78716C] hover:bg-[#F2EFEA]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#44403C] mb-1">
                  Nama Acara <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Temu Kangen Trah Wiradinata"
                  className="w-full rounded-lg border border-[#E6E3DA] bg-[#FAF8F5] p-2 text-xs focus:border-[#1E3A2F] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#44403C] mb-1">
                    Jenis Acara
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as EventType)}
                    className="w-full rounded-lg border border-[#E6E3DA] bg-[#FAF8F5] p-2 text-xs focus:border-[#1E3A2F] focus:outline-none"
                  >
                    <option value="GATHERING">Silaturahmi / Temu Kangen</option>
                    <option value="BIRTHDAY">Ulang Tahun</option>
                    <option value="WEDDING_ANNIVERSARY">Ulang Tahun Pernikahan</option>
                    <option value="MEMORIAL">Peringatan Haul</option>
                    <option value="CUSTOM">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#44403C] mb-1">
                    Tanggal (YYYY-MM-DD) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-lg border border-[#E6E3DA] bg-[#FAF8F5] p-2 text-xs focus:border-[#1E3A2F] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#44403C] mb-1">
                  Lokasi Pertemuan
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Contoh: Rumah Dago Bandung / Hotel Santika"
                  className="w-full rounded-lg border border-[#E6E3DA] bg-[#FAF8F5] p-2 text-xs focus:border-[#1E3A2F] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#44403C] mb-1">
                  Deskripsi / Catatan
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Catatan tambahan mengenai konsumsi atau susunan acara..."
                  className="w-full rounded-lg border border-[#E6E3DA] bg-[#FAF8F5] p-2 text-xs focus:border-[#1E3A2F] focus:outline-none"
                />
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
                  Simpan Acara
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
