import React from 'react';
import { 
  Users, 
  GitFork, 
  Plus, 
  Search, 
  Sparkles,
  Share2,
  Menu
} from 'lucide-react';
import { FamilySpace, User } from '../../types';

interface NavbarProps {
  currentFamily: FamilySpace;
  currentUser: User;
  onOpenSearchModal: () => void;
  onOpenAddMemberModal: () => void;
  onOpenShareModal: () => void;
  onOpenMobileMenu?: () => void;
  onNavigateLanding?: () => void;
  onNavigateTree?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentFamily,
  currentUser,
  onOpenSearchModal,
  onOpenAddMemberModal,
  onOpenShareModal,
  onOpenMobileMenu,
  onNavigateLanding,
  onNavigateTree,
}) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#E6E3DA] bg-[#F8F7F3]/90 px-4 backdrop-blur-md sm:px-6">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="flex h-9 w-9 items-center justify-center rounded-md text-[#57534E] hover:bg-[#EFECE6] lg:hidden"
            aria-label="Buka menu navigasi"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <button
          onClick={onNavigateLanding}
          className="text-left group"
        >
          <span className="font-serif text-2xl font-semibold tracking-tight text-[#1E3A2F]">
            Silsantara
          </span>
        </button>
      </div>

      {/* Zone 2: Navigation & Quick Context Indicator */}
      <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[#57534E]">
        <button
          onClick={onNavigateTree}
          className="flex items-center gap-2 hover:text-[#1E3A2F] transition-colors"
        >
          <GitFork className="h-4 w-4 text-[#2D5A46]" />
          <span>Silsilah {currentFamily.name}</span>
        </button>

        <button
          onClick={onOpenSearchModal}
          className="flex items-center gap-1.5 hover:text-[#1E3A2F] transition-colors"
        >
          <Search className="h-4 w-4 text-[#78716C]" />
          <span>Cari Hubungan</span>
        </button>
      </div>

      {/* Zone 3: 1-2 Primary Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onOpenSearchModal}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E6E3DA] bg-white text-[#44403C] hover:bg-[#F2EFE9] transition-colors md:hidden"
          title="Cari Hubungan Kerabat"
          aria-label="Cari Hubungan Kerabat"
        >
          <Search className="h-4 w-4" />
        </button>

        <button
          onClick={onOpenShareModal}
          className="flex h-9 items-center gap-1.5 rounded-lg border border-[#E6E3DA] bg-white px-3 text-xs font-medium text-[#44403C] hover:bg-[#F2EFE9] transition-colors whitespace-nowrap"
          title="Bagikan Silsilah"
        >
          <Share2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Bagikan</span>
        </button>

        <button
          onClick={onOpenAddMemberModal}
          className="flex h-9 items-center gap-1.5 rounded-lg bg-[#1E3A2F] px-3.5 text-xs font-medium text-white hover:bg-[#284E3F] transition-colors whitespace-nowrap shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Anggota</span>
        </button>
      </div>
    </header>
  );
};
