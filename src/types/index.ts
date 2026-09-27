export type Gender = 'male' | 'female' | 'other';

export type PrivacyLevel = 'PUBLIC' | 'FAMILY' | 'RESTRICTED' | 'PRIVATE';

export type CollaboratorRole = 'OWNER' | 'ADMIN' | 'EDITOR' | 'VIEWER';

export type RelationshipType = 
  | 'BIOLOGICAL_PARENT' 
  | 'ADOPTIVE_PARENT' 
  | 'STEP_PARENT' 
  | 'SPOUSE' 
  | 'FORMER_SPOUSE' 
  | 'SIBLING' 
  | 'HALF_SIBLING' 
  | 'GUARDIAN';

export type MarriageStatus = 
  | 'MENIKAH' 
  | 'BERCERAI' 
  | 'PASANGAN_MENINGGAL' 
  | 'TIDAK_DIKETAHUI';

export type DocumentCategory = 
  | 'AKTA_KELAHIRAN' 
  | 'AKTA_NIKAH' 
  | 'IJAZAH' 
  | 'SURAT_LAMA' 
  | 'DOKUMEN_KELUARGA' 
  | 'SERTIFIKAT' 
  | 'LAINNYA';

export type EventType = 
  | 'BIRTHDAY' 
  | 'WEDDING_ANNIVERSARY' 
  | 'GATHERING' 
  | 'MEMORIAL' 
  | 'CUSTOM';

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoUrl?: string;
  createdAt: string;
}

export interface FamilySpace {
  id: string;
  name: string;
  clanName?: string;
  originCity: string;
  originProvince: string;
  description: string;
  coverPhotoUrl?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  privacySettings: {
    isPublic: boolean;
    livingMembersHidden: boolean;
    allowGuestTreeShare: boolean;
  };
}

export interface FamilyMember {
  id: string;
  familyId: string;
  firstName: string;
  middleName?: string;
  lastName?: string;
  nickname?: string;
  gender: Gender;
  birthDate?: string; // Supports YYYY, MM/YYYY, DD/MM/YYYY
  birthPlace?: string;
  deathDate?: string;
  deathPlace?: string;
  isLiving: boolean;
  biography?: string;
  occupation?: string;
  phone?: string;
  email?: string;
  address?: string;
  profilePhotoUrl?: string;
  privacyLevel: PrivacyLevel;
  generation: number; // 1 = root ancestor tier, 2 = children, 3 = grandchildren, etc.
  branch?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Relationship {
  id: string;
  familyId: string;
  personAId: string; // e.g. parent or spouse 1
  personBId: string; // e.g. child or spouse 2
  type: RelationshipType;
  startDate?: string;
  endDate?: string;
  status?: MarriageStatus;
  notes?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  createdBy: string;
}

export interface FamilyMemory {
  id: string;
  familyId: string;
  title: string;
  story: string;
  date?: string;
  location?: string;
  taggedMemberIds: string[];
  photoUrls?: string[];
  authorId: string;
  authorName: string;
  createdAt: string;
}

export interface FamilyPhoto {
  id: string;
  familyId: string;
  albumId?: string;
  url: string;
  caption?: string;
  description?: string;
  date?: string;
  location?: string;
  taggedMemberIds: string[];
  uploadedBy: string;
  createdAt: string;
}

export interface FamilyAlbum {
  id: string;
  familyId: string;
  title: string;
  description?: string;
  coverPhotoUrl?: string;
  createdAt: string;
}

export interface FamilyDocument {
  id: string;
  familyId: string;
  title: string;
  category: DocumentCategory;
  fileUrl: string;
  fileType: string;
  date?: string;
  notes?: string;
  attachedMemberIds: string[];
  privacyLevel: PrivacyLevel;
  uploadedBy: string;
  createdAt: string;
}

export interface FamilyEvent {
  id: string;
  familyId: string;
  title: string;
  type: EventType;
  date: string; // YYYY-MM-DD
  isRecurring: boolean;
  description?: string;
  location?: string;
  memberIds: string[];
  createdAt: string;
}

export interface Collaborator {
  userId: string;
  familyId: string;
  email: string;
  name: string;
  role: CollaboratorRole;
  connectedMemberId?: string;
  joinedAt: string;
}

export interface ActivityLog {
  id: string;
  familyId: string;
  actorId: string;
  actorName: string;
  action: string;
  entityType: 'MEMBER' | 'RELATIONSHIP' | 'MEMORY' | 'PHOTO' | 'DOCUMENT' | 'EVENT' | 'COLLABORATOR' | 'FAMILY';
  entityId?: string;
  details: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  link?: string;
}
