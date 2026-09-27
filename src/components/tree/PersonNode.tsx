import React from 'react';
import { FamilyMember } from '../../types';
import { Heart, User as UserIcon } from 'lucide-react';

interface PersonNodeProps {
  member: FamilyMember;
  isSelected: boolean;
  isDimmed: boolean;
  isFocusedPath: boolean;
  isCurrentUser: boolean;
  onSelect: (member: FamilyMember) => void;
}

export const PersonNode: React.FC<PersonNodeProps> = ({
  member,
  isSelected,
  isDimmed,
  isFocusedPath,
  isCurrentUser,
  onSelect
}) => {
  const birthYear = member.birthDate ? member.birthDate.split('-')[0] : '?';
  const deathYear = member.isLiving ? '' : (member.deathDate ? member.deathDate.split('-')[0] : 'Wafat');
  const yearsText = member.isLiving ? `${birthYear}` : `${birthYear} – ${deathYear}`;

  const initials = [member.firstName[0], member.lastName?.[0]].filter(Boolean).join('');

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect(member);
      }}
      className={`group relative flex h-[92px] w-[190px] cursor-pointer items-center gap-3 rounded-xl border bg-white p-3 shadow-xs transition-all duration-150 select-none ${
        isSelected
          ? 'border-[#1E3A2F] ring-2 ring-[#1E3A2F] ring-offset-2 shadow-md z-20'
          : isFocusedPath
          ? 'border-[#2D5A46] bg-[#F4F8F5] ring-1 ring-[#2D5A46] z-10'
          : isDimmed
          ? 'opacity-35 grayscale-[40%] border-[#E6E3DA]'
          : 'border-[#E6E3DA] hover:border-[#1E3A2F] hover:shadow-md'
      }`}
    >
      {/* Current User Indicator */}
      {isCurrentUser && (
        <span className="absolute -top-2 left-3 rounded-full bg-[#1E3A2F] px-1.5 py-0.2 text-[9px] font-semibold text-white tracking-wider">
          ANDA
        </span>
      )}

      {/* Avatar */}
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[#E6E3DA] bg-[#F5F2EB]">
        {member.profilePhotoUrl ? (
          <img
            src={member.profilePhotoUrl}
            alt={member.firstName}
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Graceful fallback to initials
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-serif text-sm font-semibold text-[#57534E]">
            {initials || <UserIcon className="h-5 w-5 text-[#A8A29E]" />}
          </div>
        )}
      </div>

      {/* Member Info */}
      <div className="min-w-0 flex-1">
        <div className="truncate text-xs font-semibold text-[#1C1917] group-hover:text-[#1E3A2F]">
          {member.firstName} {member.lastName || ''}
        </div>
        
        {member.nickname && (
          <div className="truncate text-[10px] text-[#78716C] italic font-serif">
            "{member.nickname}"
          </div>
        )}

        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-[#78716C]">
          <span className="tabular-nums font-mono">{yearsText}</span>
          {!member.isLiving && (
            <span className="text-[9px] text-[#A8A29E] font-serif">†</span>
          )}
        </div>
      </div>
    </div>
  );
};
