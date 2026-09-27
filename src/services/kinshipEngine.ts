import { FamilyMember, Relationship } from '../types';

export interface PathStep {
  person: FamilyMember;
  stepType: 'self' | 'parent' | 'child' | 'spouse' | 'sibling';
  description: string;
}

export interface KinshipResult {
  relationshipTitle: string;
  pathDescription: string;
  path: PathStep[];
  degree: number;
}

interface GraphEdge {
  targetId: string;
  type: 'parent' | 'child' | 'spouse';
  rel: Relationship;
}

export function buildKinshipGraph(members: FamilyMember[], relationships: Relationship[]) {
  const memberMap = new Map<string, FamilyMember>();
  members.forEach(m => memberMap.set(m.id, m));

  const adjacency = new Map<string, GraphEdge[]>();
  members.forEach(m => adjacency.set(m.id, []));

  relationships.forEach(rel => {
    const aId = rel.personAId;
    const bId = rel.personBId;

    if (!memberMap.has(aId) || !memberMap.has(bId)) return;

    if (rel.type === 'BIOLOGICAL_PARENT' || rel.type === 'ADOPTIVE_PARENT' || rel.type === 'STEP_PARENT') {
      // a is parent of b
      adjacency.get(aId)?.push({ targetId: bId, type: 'child', rel });
      adjacency.get(bId)?.push({ targetId: aId, type: 'parent', rel });
    } else if (rel.type === 'SPOUSE' || rel.type === 'FORMER_SPOUSE') {
      adjacency.get(aId)?.push({ targetId: bId, type: 'spouse', rel });
      adjacency.get(bId)?.push({ targetId: aId, type: 'spouse', rel });
    }
  });

  return { memberMap, adjacency };
}

// Find shortest path between sourceId and targetId using Breadth-First Search
export function findKinshipPath(
  sourceId: string, 
  targetId: string, 
  members: FamilyMember[], 
  relationships: Relationship[]
): KinshipResult | null {
  if (sourceId === targetId) {
    const person = members.find(m => m.id === sourceId);
    if (!person) return null;
    return {
      relationshipTitle: 'Diri Anda Sendiri',
      pathDescription: 'Anda melihat profil Anda sendiri.',
      path: [{ person, stepType: 'self', description: 'Anda' }],
      degree: 0
    };
  }

  const { memberMap, adjacency } = buildKinshipGraph(members, relationships);
  const queue: { currentId: string; path: { id: string; stepType: 'self' | 'parent' | 'child' | 'spouse' }[] }[] = [];
  const visited = new Set<string>();

  queue.push({ currentId: sourceId, path: [{ id: sourceId, stepType: 'self' }] });
  visited.add(sourceId);

  let foundPath: { id: string; stepType: 'self' | 'parent' | 'child' | 'spouse' }[] | null = null;

  while (queue.length > 0) {
    const { currentId, path } = queue.shift()!;
    if (currentId === targetId) {
      foundPath = path;
      break;
    }

    const edges = adjacency.get(currentId) || [];
    for (const edge of edges) {
      if (!visited.has(edge.targetId)) {
        visited.add(edge.targetId);
        queue.push({
          currentId: edge.targetId,
          path: [...path, { id: edge.targetId, stepType: edge.type }]
        });
      }
    }
  }

  if (!foundPath) return null;

  // Resolve steps into human-readable details
  const pathSteps: PathStep[] = [];
  for (let i = 0; i < foundPath.length; i++) {
    const item = foundPath[i];
    const member = memberMap.get(item.id)!;
    let desc = '';

    if (i === 0) {
      desc = 'Awal';
    } else {
      const prevMember = memberMap.get(foundPath[i - 1].id)!;
      if (item.stepType === 'parent') {
        desc = member.gender === 'female' ? `Ibu (${member.firstName})` : `Ayah (${member.firstName})`;
      } else if (item.stepType === 'child') {
        desc = member.gender === 'female' ? `Anak Perempuan (${member.firstName})` : `Anak Laki-laki (${member.firstName})`;
      } else if (item.stepType === 'spouse') {
        desc = member.gender === 'female' ? `Istri (${member.firstName})` : `Suami (${member.firstName})`;
      }
    }

    pathSteps.push({
      person: member,
      stepType: item.stepType,
      description: desc
    });
  }

  const title = computeIndonesianKinshipTerm(pathSteps, memberMap);
  const breadcrumbs = pathSteps.map((s, idx) => {
    if (idx === 0) return s.person.firstName;
    return `${s.description}`;
  }).join(' → ');

  return {
    relationshipTitle: title,
    pathDescription: breadcrumbs,
    path: pathSteps,
    degree: pathSteps.length - 1
  };
}

function computeIndonesianKinshipTerm(path: PathStep[], memberMap: Map<string, FamilyMember>): string {
  const steps = path.slice(1).map(p => p.stepType);
  const target = path[path.length - 1].person;
  const isMale = target.gender === 'male';
  const isFemale = target.gender === 'female';

  // 1 Hop
  if (steps.length === 1) {
    if (steps[0] === 'parent') return isFemale ? 'Ibu' : 'Ayah';
    if (steps[0] === 'child') return isFemale ? 'Anak Perempuan' : 'Anak Laki-laki';
    if (steps[0] === 'spouse') return isFemale ? 'Istri' : 'Suami';
  }

  // 2 Hops
  if (steps.length === 2) {
    // parent -> parent
    if (steps[0] === 'parent' && steps[1] === 'parent') {
      return isFemale ? 'Nenek (Enin / Oma)' : 'Kakek (Aki / Opa)';
    }
    // child -> child
    if (steps[0] === 'child' && steps[1] === 'child') {
      return isFemale ? 'Cucu Perempuan' : 'Cucu Laki-laki';
    }
    // parent -> child (Sibling)
    if (steps[0] === 'parent' && steps[1] === 'child') {
      const source = path[0].person;
      if (source.birthDate && target.birthDate) {
        const isOlder = target.birthDate < source.birthDate;
        if (isOlder) return isFemale ? 'Kakak Perempuan' : 'Kakak Laki-laki';
        return isFemale ? 'Adik Perempuan' : 'Adik Laki-laki';
      }
      return isFemale ? 'Saudari (Kakak/Adik)' : 'Saudara (Kakak/Adik)';
    }
    // spouse -> parent (Mertua)
    if (steps[0] === 'spouse' && steps[1] === 'parent') {
      return isFemale ? 'Ibu Mertua' : 'Ayah Mertua';
    }
    // child -> spouse (Menantu)
    if (steps[0] === 'child' && steps[1] === 'spouse') {
      return isFemale ? 'Menantu Perempuan' : 'Menantu Laki-laki';
    }
    // spouse -> child (Anak Tiri / Anak)
    if (steps[0] === 'spouse' && steps[1] === 'child') {
      return isFemale ? 'Anak Tiri Perempuan' : 'Anak Tiri Laki-laki';
    }
    // parent -> spouse (Orang tua tiri)
    if (steps[0] === 'parent' && steps[1] === 'spouse') {
      return isFemale ? 'Ibu Tiri' : 'Ayah Tiri';
    }
  }

  // 3 Hops
  if (steps.length === 3) {
    // parent -> parent -> parent (Buyut)
    if (steps[0] === 'parent' && steps[1] === 'parent' && steps[2] === 'parent') {
      return isFemale ? 'Nenek Buyut' : 'Kakek Buyut';
    }
    // child -> child -> child (Cicit)
    if (steps[0] === 'child' && steps[1] === 'child' && steps[2] === 'child') {
      return isFemale ? 'Cicit Perempuan' : 'Cicit Laki-laki';
    }
    // parent -> parent -> child (Paman / Bibi)
    if (steps[0] === 'parent' && steps[1] === 'parent' && steps[2] === 'child') {
      return isFemale ? 'Bibi (Tante)' : 'Paman (Om)';
    }
    // parent -> child -> child (Keponakan)
    if (steps[0] === 'parent' && steps[1] === 'child' && steps[2] === 'child') {
      return isFemale ? 'Keponakan Perempuan' : 'Keponakan Laki-laki';
    }
    // parent -> child -> spouse (Ipar)
    if (steps[0] === 'parent' && steps[1] === 'child' && steps[2] === 'spouse') {
      return isFemale ? 'Ipar Perempuan (Istri Saudara)' : 'Ipar Laki-laki (Suami Saudara)';
    }
    // spouse -> parent -> child (Ipar)
    if (steps[0] === 'spouse' && steps[1] === 'parent' && steps[2] === 'child') {
      return isFemale ? 'Ipar Perempuan (Saudara Pasangan)' : 'Ipar Laki-laki (Saudara Pasangan)';
    }
  }

  // 4 Hops: Cousin (parent -> parent -> child -> child)
  if (steps.length === 4) {
    if (steps[0] === 'parent' && steps[1] === 'parent' && steps[2] === 'child' && steps[3] === 'child') {
      return isFemale ? 'Saudara Sepupu (Perempuan)' : 'Saudara Sepupu (Laki-laki)';
    }
    if (steps[0] === 'parent' && steps[1] === 'parent' && steps[2] === 'parent' && steps[3] === 'parent') {
      return 'Leluhur / Moyang Generasi Ke-4';
    }
    if (steps[0] === 'child' && steps[1] === 'child' && steps[2] === 'child' && steps[3] === 'child') {
      return 'Piut / Canggah (Generasi Ke-4)';
    }
  }

  // General fallback by generational level calculation
  let genDelta = 0;
  for (const s of steps) {
    if (s === 'parent') genDelta += 1;
    if (s === 'child') genDelta -= 1;
  }

  if (genDelta >= 2) return `Leluhur (${genDelta} generasi di atas)`;
  if (genDelta === 1) return isFemale ? 'Kerabat Orang Tua (Bibi/Sepupu Orang Tua)' : 'Kerabat Orang Tua (Paman/Sepupu Orang Tua)';
  if (genDelta === 0) return 'Kerabat Se-generasi / Sepupu';
  if (genDelta === -1) return isFemale ? 'Keponakan / Kerabat Anak' : 'Keponakan / Kerabat Anak';
  if (genDelta <= -2) return `Keturunan (${Math.abs(genDelta)} generasi di bawah)`;

  return 'Kerabat Keluarga';
}
