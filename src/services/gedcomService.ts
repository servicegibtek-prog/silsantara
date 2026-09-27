import { FamilyMember, Relationship } from '../types';

export function exportToGedcom(
  familyName: string,
  members: FamilyMember[],
  relationships: Relationship[]
): string {
  const lines: string[] = [];
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();

  // Header
  lines.push('0 HEAD');
  lines.push('1 SOUR SILSANTARA');
  lines.push('2 NAME Silsantara Family Archive');
  lines.push('2 VERS 1.0');
  lines.push('1 DEST SILSANTARA');
  lines.push(`1 DATE ${dateStr}`);
  lines.push('1 FILE ' + familyName.replace(/\s+/g, '_') + '.ged');
  lines.push('1 GEDC');
  lines.push('2 VERS 5.5.1');
  lines.push('2 FORM LINEAGE-LINKED');
  lines.push('1 CHAR UTF-8');
  lines.push('1 NOTE Merangkai cerita, menjaga silsilah - Silsantara Indonesia');

  // Map to store INDI IDs
  const indiIdMap = new Map<string, string>();
  members.forEach((m, idx) => {
    indiIdMap.set(m.id, `@I${idx + 1}@`);
  });

  // Export Individuals
  members.forEach((m) => {
    const indiTag = indiIdMap.get(m.id)!;
    lines.push(`0 ${indiTag} INDI`);
    
    const lastName = m.lastName ? `/${m.lastName}/` : '';
    const fullName = [m.firstName, m.middleName, lastName].filter(Boolean).join(' ');
    lines.push(`1 NAME ${fullName}`);
    if (m.nickname) {
      lines.push(`2 NICK ${m.nickname}`);
    }

    lines.push(`1 SEX ${m.gender === 'male' ? 'M' : m.gender === 'female' ? 'F' : 'U'}`);

    if (m.birthDate || m.birthPlace) {
      lines.push('1 BIRT');
      if (m.birthDate) lines.push(`2 DATE ${m.birthDate}`);
      if (m.birthPlace) lines.push(`2 PLAC ${m.birthPlace}`);
    }

    if (!m.isLiving || m.deathDate || m.deathPlace) {
      lines.push('1 DEAT');
      if (m.deathDate) lines.push(`2 DATE ${m.deathDate}`);
      if (m.deathPlace) lines.push(`2 PLAC ${m.deathPlace}`);
    }

    if (m.occupation) {
      lines.push(`1 OCCU ${m.occupation}`);
    }

    if (m.biography) {
      lines.push(`1 NOTE ${m.biography.slice(0, 240)}`);
    }
  });

  // Build FAM records from marriages and parent-child relations
  const spouseRelationships = relationships.filter(r => r.type === 'SPOUSE' || r.type === 'FORMER_SPOUSE');
  let famCounter = 1;

  spouseRelationships.forEach(sr => {
    const famTag = `@F${famCounter++}@`;
    lines.push(`0 ${famTag} FAM`);
    
    const personA = members.find(m => m.id === sr.personAId);
    const personB = members.find(m => m.id === sr.personBId);

    let husbId = sr.personAId;
    let wifeId = sr.personBId;

    if (personA?.gender === 'female' && personB?.gender === 'male') {
      husbId = sr.personBId;
      wifeId = sr.personAId;
    }

    if (indiIdMap.has(husbId)) lines.push(`1 HUSB ${indiIdMap.get(husbId)}`);
    if (indiIdMap.has(wifeId)) lines.push(`1 WIFE ${indiIdMap.get(wifeId)}`);

    if (sr.startDate) {
      lines.push('1 MARR');
      lines.push(`2 DATE ${sr.startDate}`);
    }

    // Find children whose parents are both or either
    const childrenA = relationships.filter(r => 
      (r.type === 'BIOLOGICAL_PARENT' || r.type === 'ADOPTIVE_PARENT') && r.personAId === husbId
    ).map(r => r.personBId);

    const childrenB = relationships.filter(r => 
      (r.type === 'BIOLOGICAL_PARENT' || r.type === 'ADOPTIVE_PARENT') && r.personAId === wifeId
    ).map(r => r.personBId);

    const sharedChildren = Array.from(new Set([...childrenA, ...childrenB]));
    sharedChildren.forEach(childId => {
      if (indiIdMap.has(childId)) {
        lines.push(`1 CHIL ${indiIdMap.get(childId)}`);
      }
    });
  });

  // Trailer
  lines.push('0 TRLR');

  return lines.join('\n');
}

export interface GedcomParseResult {
  success: boolean;
  importedMembersCount: number;
  importedFamiliesCount: number;
  members: Partial<FamilyMember>[];
  errors: string[];
}

export function parseGedcom(rawText: string, familyId: string): GedcomParseResult {
  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const errors: string[] = [];
  const parsedMembers: Partial<FamilyMember>[] = [];

  let currentIndi: {
    id: string;
    firstName?: string;
    lastName?: string;
    gender?: 'male' | 'female' | 'other';
    birthDate?: string;
    birthPlace?: string;
    deathDate?: string;
    deathPlace?: string;
    isLiving?: boolean;
    occupation?: string;
    notes?: string;
  } | null = null;

  let inBirt = false;
  let inDeat = false;
  let famCount = 0;

  try {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const match = line.match(/^(\d+)\s+(@\w+@|[A-Z_]+)(?:\s+(.*))?$/);
      if (!match) continue;

      const level = parseInt(match[1], 10);
      const tagOrId = match[2];
      const rest = match[3] || '';

      if (level === 0) {
        // Save previous individual if any
        if (currentIndi) {
          parsedMembers.push({
            id: `imported_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            familyId,
            firstName: currentIndi.firstName || 'Tanpa Nama',
            lastName: currentIndi.lastName || '',
            gender: currentIndi.gender || 'male',
            birthDate: currentIndi.birthDate,
            birthPlace: currentIndi.birthPlace,
            deathDate: currentIndi.deathDate,
            deathPlace: currentIndi.deathPlace,
            isLiving: currentIndi.isLiving ?? !currentIndi.deathDate,
            occupation: currentIndi.occupation,
            biography: currentIndi.notes,
            generation: 1,
            privacyLevel: 'FAMILY'
          });
          currentIndi = null;
        }

        inBirt = false;
        inDeat = false;

        if (rest === 'INDI') {
          currentIndi = { id: tagOrId };
        } else if (rest === 'FAM') {
          famCount++;
        }
      } else if (currentIndi) {
        if (level === 1) {
          inBirt = tagOrId === 'BIRT';
          inDeat = tagOrId === 'DEAT';

          if (tagOrId === 'NAME') {
            const nameMatch = rest.match(/([^/]+)?(?:\/([^/]+)\/)?/);
            if (nameMatch) {
              currentIndi.firstName = nameMatch[1]?.trim() || '';
              currentIndi.lastName = nameMatch[2]?.trim() || '';
            } else {
              currentIndi.firstName = rest.trim();
            }
          } else if (tagOrId === 'SEX') {
            currentIndi.gender = rest.toUpperCase().startsWith('F') ? 'female' : 'male';
          } else if (tagOrId === 'OCCU') {
            currentIndi.occupation = rest;
          } else if (tagOrId === 'NOTE') {
            currentIndi.notes = rest;
          }
        } else if (level === 2) {
          if (inBirt) {
            if (tagOrId === 'DATE') currentIndi.birthDate = rest;
            if (tagOrId === 'PLAC') currentIndi.birthPlace = rest;
          } else if (inDeat) {
            if (tagOrId === 'DATE') {
              currentIndi.deathDate = rest;
              currentIndi.isLiving = false;
            }
            if (tagOrId === 'PLAC') currentIndi.deathPlace = rest;
          }
        }
      }
    }

    // Flush last individual
    if (currentIndi) {
      parsedMembers.push({
        id: `imported_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        familyId,
        firstName: currentIndi.firstName || 'Tanpa Nama',
        lastName: currentIndi.lastName || '',
        gender: currentIndi.gender || 'male',
        birthDate: currentIndi.birthDate,
        birthPlace: currentIndi.birthPlace,
        deathDate: currentIndi.deathDate,
        deathPlace: currentIndi.deathPlace,
        isLiving: currentIndi.isLiving ?? !currentIndi.deathDate,
        occupation: currentIndi.occupation,
        biography: currentIndi.notes,
        generation: 1,
        privacyLevel: 'FAMILY'
      });
    }

    if (parsedMembers.length === 0) {
      errors.push('Tidak ditemukan entitas INDI yang valid dalam file GEDCOM ini.');
    }

    return {
      success: errors.length === 0,
      importedMembersCount: parsedMembers.length,
      importedFamiliesCount: famCount,
      members: parsedMembers,
      errors
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Kesalahan parsing file GEDCOM.';
    return {
      success: false,
      importedMembersCount: 0,
      importedFamiliesCount: 0,
      members: [],
      errors: [errorMsg]
    };
  }
}
