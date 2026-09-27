import { 
  FamilySpace, 
  FamilyMember, 
  Relationship, 
  FamilyMemory, 
  FamilyPhoto, 
  FamilyAlbum, 
  FamilyDocument, 
  FamilyEvent, 
  Collaborator, 
  ActivityLog,
  User
} from '../types';
import { 
  CURRENT_USER,
  INITIAL_FAMILIES,
  INITIAL_MEMBERS,
  INITIAL_RELATIONSHIPS,
  INITIAL_MEMORIES,
  INITIAL_PHOTOS,
  INITIAL_ALBUMS,
  INITIAL_DOCUMENTS,
  INITIAL_EVENTS,
  INITIAL_COLLABORATORS,
  INITIAL_ACTIVITY_LOGS
} from '../data/seedData';

const KEYS = {
  USER: 'silsantara_user',
  FAMILIES: 'silsantara_families',
  ACTIVE_FAMILY_ID: 'silsantara_active_family_id',
  MEMBERS: 'silsantara_members',
  RELATIONSHIPS: 'silsantara_relationships',
  MEMORIES: 'silsantara_memories',
  PHOTOS: 'silsantara_photos',
  ALBUMS: 'silsantara_albums',
  DOCUMENTS: 'silsantara_documents',
  EVENTS: 'silsantara_events',
  COLLABORATORS: 'silsantara_collaborators',
  ACTIVITY_LOGS: 'silsantara_activity_logs',
};

function getStorage<T>(key: string, defaultValue: T): T {
  try {
    const val = localStorage.getItem(key);
    if (!val) return defaultValue;
    return JSON.parse(val);
  } catch {
    return defaultValue;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Storage set error:', err);
  }
}

export class StorageService {
  static getUser(): User {
    return getStorage<User>(KEYS.USER, CURRENT_USER);
  }

  static setUser(user: User): void {
    setStorage(KEYS.USER, user);
  }

  static getFamilies(): FamilySpace[] {
    return getStorage<FamilySpace[]>(KEYS.FAMILIES, INITIAL_FAMILIES);
  }

  static saveFamilies(families: FamilySpace[]): void {
    setStorage(KEYS.FAMILIES, families);
  }

  static getActiveFamilyId(): string {
    const families = this.getFamilies();
    const stored = localStorage.getItem(KEYS.ACTIVE_FAMILY_ID);
    if (stored && families.some(f => f.id === stored)) {
      return stored;
    }
    return families[0]?.id || 'fam_wiradinata';
  }

  static setActiveFamilyId(id: string): void {
    localStorage.setItem(KEYS.ACTIVE_FAMILY_ID, id);
  }

  static getMembers(familyId?: string): FamilyMember[] {
    const all = getStorage<FamilyMember[]>(KEYS.MEMBERS, INITIAL_MEMBERS);
    if (familyId) {
      return all.filter(m => m.familyId === familyId);
    }
    return all;
  }

  static saveMembers(members: FamilyMember[]): void {
    setStorage(KEYS.MEMBERS, members);
  }

  static getRelationships(familyId?: string): Relationship[] {
    const all = getStorage<Relationship[]>(KEYS.RELATIONSHIPS, INITIAL_RELATIONSHIPS);
    if (familyId) {
      return all.filter(r => r.familyId === familyId);
    }
    return all;
  }

  static saveRelationships(rels: Relationship[]): void {
    setStorage(KEYS.RELATIONSHIPS, rels);
  }

  static getMemories(familyId?: string): FamilyMemory[] {
    const all = getStorage<FamilyMemory[]>(KEYS.MEMORIES, INITIAL_MEMORIES);
    if (familyId) {
      return all.filter(m => m.familyId === familyId);
    }
    return all;
  }

  static saveMemories(memories: FamilyMemory[]): void {
    setStorage(KEYS.MEMORIES, memories);
  }

  static getPhotos(familyId?: string): FamilyPhoto[] {
    const all = getStorage<FamilyPhoto[]>(KEYS.PHOTOS, INITIAL_PHOTOS);
    if (familyId) {
      return all.filter(p => p.familyId === familyId);
    }
    return all;
  }

  static savePhotos(photos: FamilyPhoto[]): void {
    setStorage(KEYS.PHOTOS, photos);
  }

  static getAlbums(familyId?: string): FamilyAlbum[] {
    const all = getStorage<FamilyAlbum[]>(KEYS.ALBUMS, INITIAL_ALBUMS);
    if (familyId) {
      return all.filter(a => a.familyId === familyId);
    }
    return all;
  }

  static saveAlbums(albums: FamilyAlbum[]): void {
    setStorage(KEYS.ALBUMS, albums);
  }

  static getDocuments(familyId?: string): FamilyDocument[] {
    const all = getStorage<FamilyDocument[]>(KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
    if (familyId) {
      return all.filter(d => d.familyId === familyId);
    }
    return all;
  }

  static saveDocuments(docs: FamilyDocument[]): void {
    setStorage(KEYS.DOCUMENTS, docs);
  }

  static getEvents(familyId?: string): FamilyEvent[] {
    const all = getStorage<FamilyEvent[]>(KEYS.EVENTS, INITIAL_EVENTS);
    if (familyId) {
      return all.filter(e => e.familyId === familyId);
    }
    return all;
  }

  static saveEvents(events: FamilyEvent[]): void {
    setStorage(KEYS.EVENTS, events);
  }

  static getCollaborators(familyId?: string): Collaborator[] {
    const all = getStorage<Collaborator[]>(KEYS.COLLABORATORS, INITIAL_COLLABORATORS);
    if (familyId) {
      return all.filter(c => c.familyId === familyId);
    }
    return all;
  }

  static saveCollaborators(collabs: Collaborator[]): void {
    setStorage(KEYS.COLLABORATORS, collabs);
  }

  static getActivityLogs(familyId?: string): ActivityLog[] {
    const all = getStorage<ActivityLog[]>(KEYS.ACTIVITY_LOGS, INITIAL_ACTIVITY_LOGS);
    if (familyId) {
      return all.filter(l => l.familyId === familyId);
    }
    return all;
  }

  static logActivity(log: Omit<ActivityLog, 'id' | 'timestamp'>): void {
    const all = this.getActivityLogs();
    const newLog: ActivityLog = {
      ...log,
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString()
    };
    setStorage(KEYS.ACTIVITY_LOGS, [newLog, ...all]);
  }

  static resetToDefaultData(): void {
    localStorage.clear();
    setStorage(KEYS.USER, CURRENT_USER);
    setStorage(KEYS.FAMILIES, INITIAL_FAMILIES);
    setStorage(KEYS.ACTIVE_FAMILY_ID, INITIAL_FAMILIES[0].id);
    setStorage(KEYS.MEMBERS, INITIAL_MEMBERS);
    setStorage(KEYS.RELATIONSHIPS, INITIAL_RELATIONSHIPS);
    setStorage(KEYS.MEMORIES, INITIAL_MEMORIES);
    setStorage(KEYS.PHOTOS, INITIAL_PHOTOS);
    setStorage(KEYS.ALBUMS, INITIAL_ALBUMS);
    setStorage(KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
    setStorage(KEYS.EVENTS, INITIAL_EVENTS);
    setStorage(KEYS.COLLABORATORS, INITIAL_COLLABORATORS);
    setStorage(KEYS.ACTIVITY_LOGS, INITIAL_ACTIVITY_LOGS);
  }
}
