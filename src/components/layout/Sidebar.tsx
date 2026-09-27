import React from 'react';
import { 
  Home, 
  GitFork, 
  Users, 
  Clock, 
  BookOpen, 
  Image as ImageIcon, 
  FileText, 
  Calendar, 
  BarChart2, 
  UserCheck, 
  Settings, 
  HelpCircle,
  ChevronDown,
  Building,
  Sparkles,
  LogOut
} from 'lucide-react';
import { FamilySpace, User } from '../../types';

export type NavTab = 
  | 'beranda'
  | 'silsilah'
  | 'anggota'
  | 'timeline'
  | 'kenangan'
  | 'galeri'
  | 'dokumen'
  | 'acara'
  | 'statistik'
  | 'kolaborator'
  | 'pengaturan'
  | 'bantuan';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  families: FamilySpace[];
  activeFamily: FamilySpace;
  onSelectFamily: (family: FamilySpace) => void;
  onOpenCreateFamilyModal: () => void;
  currentUser: User;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  families,
  activeFamily,
  onSelectFamily,
  onOpenCreateFamilyModal,
  currentUser,
  onLogout
}) => {
  const [showFamilyMenu, setShowFamilyMenu] = React.useState(false);

  const navItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'beranda', label: 'Beranda', icon: Home },
    { id: 'silsilah', label: 'Silsilah', icon: GitFork },
    { id: 'anggota', label: 'Anggota', icon: Users },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'kenangan', label: 'Kenangan', icon: BookOpen },
    { id: 'galeri', label: 'Galeri', icon: ImageIcon },
    { id: 'dokumen', label: 'Dokumen', icon: FileText },
    { id: 'acara', label: 'Acara', icon: Calendar },
    { id: 'statistik', label: 'Statistik', icon: BarChart2 },
    { id: 'kolaborator', label: 'Kolaborator', icon: UserCheck },
  ];

  const bottomItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
    { id: 'bantuan', label: 'Bantuan', icon: HelpCircle },
  ];

  return (
    <aside className="relative flex h-screen w-64 flex-col border-r border-[#E6E3DA] bg-white font-sans select-none">
      {/* Brand Header */}
      <div className="flex h-16 items-center px-6 border-b border-[#F0EDE6]">
        <div className="flex flex-col">
          <span className="font-serif text-xl font-semibold tracking-tight text-[#1E3A2F]">
            Silsantara
          </span>
          <span className="text-[11px] text-[#78716C] italic font-serif leading-none mt-0.5">
            Merangkai cerita, menjaga silsilah
          </span>
        </div>
      </div>

      {/* Family Space Selector */}
      <div className="relative p-3 border-b border-[#F0EDE6]">
        <button
          onClick={() => setShowFamilyMenu(!showFamilyMenu)}
          className="flex w-full items-center justify-between rounded-lg border border-[#EBE7DF] bg-[#FAF8F5] p-2.5 text-left transition hover:bg-[#F2EFEA]"
        >
          <div className="flex items-center gap-2.5 truncate">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#1E3A2F] text-xs font-semibold text-white">
              {activeFamily.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="truncate">
              <div className="text-xs font-semibold text-[#1C1917] truncate">
                {activeFamily.name}
              </div>
              <div className="text-[11px] text-[#78716C] truncate">
                {activeFamily.originCity}, {activeFamily.originProvince}
              </div>
            </div>
          </div>
          <ChevronDown className={`h-4 w-4 text-[#78716C] transition-transform ${showFamilyMenu ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {showFamilyMenu && (
          <div className="absolute left-3 right-3 top-[68px] z-50 rounded-lg border border-[#E6E3DA] bg-white p-1.5 shadow-lg">
            <div className="px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-[#A8A29E]">
              Pilih Ruang Keluarga
            </div>
            {families.map(f => (
              <button
                key={f.id}
                onClick={() => {
                  onSelectFamily(f);
                  setShowFamilyMenu(false);
                }}
                className={`flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium text-left transition ${
                  f.id === activeFamily.id ? 'bg-[#EBF2EE] text-[#1E3A2F]' : 'text-[#44403C] hover:bg-[#FAF8F5]'
                }`}
              >
                <Building className="h-3.5 w-3.5 shrink-0 opacity-70" />
                <span className="truncate">{f.name}</span>
              </button>
            ))}
            <div className="my-1 border-t border-[#F0EDE6]" />
            <button
              onClick={() => {
                setShowFamilyMenu(false);
                onOpenCreateFamilyModal();
              }}
              className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium text-[#1E3A2F] hover:bg-[#EBF2EE] transition"
            >
              <span className="text-base leading-none font-bold">+</span>
              <span>Buat Ruang Keluarga Baru</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Navigation Items */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-[#1E3A2F] text-white shadow-xs'
                  : 'text-[#44403C] hover:bg-[#F2EFEA] hover:text-[#1C1917]'
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-[#78716C]'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div className="border-t border-[#F0EDE6] p-3 space-y-0.5">
        {bottomItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-[#1E3A2F] text-white'
                  : 'text-[#44403C] hover:bg-[#F2EFEA]'
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-[#78716C]'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* User Card */}
        <div className="mt-2 flex items-center justify-between rounded-lg bg-[#FAF8F5] p-2.5 border border-[#EBE7DF]">
          <div className="flex items-center gap-2 truncate">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2D5A46] text-xs font-semibold text-white">
              {currentUser.displayName.slice(0, 1).toUpperCase()}
            </div>
            <div className="truncate">
              <div className="text-xs font-medium text-[#1C1917] truncate leading-tight">
                {currentUser.displayName}
              </div>
              <div className="text-[10px] text-[#78716C] truncate leading-tight">
                {currentUser.email}
              </div>
            </div>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="text-[#78716C] hover:text-red-700 p-1 transition"
              title="Keluar akun"
              aria-label="Keluar akun"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
