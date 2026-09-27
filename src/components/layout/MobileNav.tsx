import React, { useState } from 'react';
import { 
  Home, 
  GitFork, 
  Users, 
  BookOpen, 
  MoreHorizontal,
  Image as ImageIcon,
  FileText,
  Calendar,
  BarChart2,
  UserCheck,
  Settings,
  HelpCircle,
  X
} from 'lucide-react';
import { NavTab } from './Sidebar';

interface MobileNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, onSelectTab }) => {
  const [showMoreSheet, setShowMoreSheet] = useState(false);

  const mainTabs: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'beranda', label: 'Beranda', icon: Home },
    { id: 'silsilah', label: 'Silsilah', icon: GitFork },
    { id: 'anggota', label: 'Anggota', icon: Users },
    { id: 'kenangan', label: 'Kenangan', icon: BookOpen },
  ];

  const moreTabs: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'galeri', label: 'Galeri Foto', icon: ImageIcon },
    { id: 'dokumen', label: 'Arsip Dokumen', icon: FileText },
    { id: 'acara', label: 'Acara & Kalender', icon: Calendar },
    { id: 'statistik', label: 'Statistik Silsilah', icon: BarChart2 },
    { id: 'kolaborator', label: 'Kolaborator', icon: UserCheck },
    { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
    { id: 'bantuan', label: 'Bantuan & Panduan', icon: HelpCircle },
  ];

  const isMoreActive = moreTabs.some(t => t.id === currentTab);

  return (
    <>
      {/* Bottom Nav Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-[#E6E3DA] bg-white/95 px-2 backdrop-blur-md lg:hidden">
        {mainTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setShowMoreSheet(false);
                onSelectTab(tab.id);
              }}
              className={`flex flex-col items-center justify-center py-1 px-3 transition-colors ${
                isActive ? 'text-[#1E3A2F]' : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
              <span className={`text-[10px] mt-1 ${isActive ? 'font-semibold' : 'font-normal'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* Lainnya Button */}
        <button
          onClick={() => setShowMoreSheet(!showMoreSheet)}
          className={`flex flex-col items-center justify-center py-1 px-3 transition-colors ${
            isMoreActive ? 'text-[#1E3A2F]' : 'text-[#78716C] hover:text-[#1C1917]'
          }`}
        >
          <MoreHorizontal className={`h-5 w-5 ${isMoreActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
          <span className={`text-[10px] mt-1 ${isMoreActive ? 'font-semibold' : 'font-normal'}`}>
            Lainnya
          </span>
        </button>
      </nav>

      {/* More Options Bottom Sheet */}
      {showMoreSheet && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-xs lg:hidden">
          <div 
            className="flex-1"
            onClick={() => setShowMoreSheet(false)}
          />
          <div className="rounded-t-2xl border-t border-[#E6E3DA] bg-white p-5 pb-8 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EDE6]">
              <span className="font-serif text-base font-semibold text-[#1C1917]">
                Menu Lainnya
              </span>
              <button
                onClick={() => setShowMoreSheet(false)}
                className="rounded-full p-1 text-[#78716C] hover:bg-[#F2EFEA]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {moreTabs.map(item => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      setShowMoreSheet(false);
                    }}
                    className={`flex items-center gap-2.5 rounded-lg border p-3 text-left transition ${
                      isActive 
                        ? 'border-[#1E3A2F] bg-[#EBF2EE] text-[#1E3A2F]' 
                        : 'border-[#EBE7DF] bg-[#FAF8F5] text-[#44403C] hover:bg-[#F2EFEA]'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
