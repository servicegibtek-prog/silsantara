export interface StoryDraftInput {
  fullName: string;
  birthDate?: string;
  birthPlace?: string;
  deathDate?: string;
  deathPlace?: string;
  occupation?: string;
  spouseName?: string;
  marriageYear?: string;
  childrenCount?: number;
  keyMilestones?: string[];
  tone?: 'warm' | 'formal' | 'poetic';
}

export interface InterviewPrompt {
  category: string;
  question: string;
  targetRole: string; // e.g. Kakek / Nenek / Orang Tua
}

export const CULTURAL_INTERVIEW_QUESTIONS: InterviewPrompt[] = [
  {
    category: 'Masa Kecil & Asal Usul',
    question: 'Di kota atau desa mana Kakek/Nenek menghabiskan masa kanak-kanak, dan apa permainan tradisional yang paling dirindukan?',
    targetRole: 'Kakek & Nenek'
  },
  {
    category: 'Masa Kecil & Asal Usul',
    question: 'Siapakah nama orang tua dan kakek buyut yang masih teringat, dan apa pekerjaan mereka dahulu?',
    targetRole: 'Kakek & Nenek'
  },
  {
    category: 'Pertemuan & Pernikahan',
    question: 'Bagaimana kisah pertama kali Kakek dan Nenek saling mengenal? Apakah melalui perkenalan keluarga atau tidak sengaja bertemu?',
    targetRole: 'Kakek & Nenek'
  },
  {
    category: 'Pertemuan & Pernikahan',
    question: 'Bisa diceritakan suasana hari pernikahan dahulu? Tradisi adat apa yang dijalankan pada saat itu?',
    targetRole: 'Kakek & Nenek'
  },
  {
    category: 'Perjuangan & Karier',
    question: 'Pekerjaan pertama apa yang dijalani saat mulai merintis kehidupan mandiri? Apa tantangan terberat saat itu?',
    targetRole: 'Orang Tua & Sesepuh'
  },
  {
    category: 'Tradisi & Nilai Keluarga',
    question: 'Tradisi atau hidangan apa yang wajib ada di rumah saat Hari Raya Lebaran atau kumpul keluarga besar?',
    targetRole: 'Semua Anggota'
  },
  {
    category: 'Nasihat Hidup',
    question: 'Pesan moral atau wejangan apa yang ingin diwariskan kepada anak, cucu, dan cicit kelak?',
    targetRole: 'Sesepuh'
  }
];

export async function generateBiographyDraft(input: StoryDraftInput): Promise<string> {
  try {
    const res = await fetch('/api/ai/story-draft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.story) return data.story;
    }
  } catch {
    // Graceful fallback below
  }

  // High quality deterministic draft based strictly on input facts
  const parts: string[] = [];
  
  if (input.birthPlace && input.birthDate) {
    parts.push(`${input.fullName} dilahirkan di ${input.birthPlace} pada tanggal ${input.birthDate}.`);
  } else if (input.birthPlace) {
    parts.push(`${input.fullName} berasal dan tumbuh besar di ${input.birthPlace}.`);
  } else {
    parts.push(`${input.fullName} adalah sosok yang dihormati dalam rumpun keluarga.`);
  }

  if (input.occupation) {
    parts.push(`Sepanjang perjalanan hidupnya, beliau mengabdikan diri di bidang ${input.occupation}, mencurahkan integritas dan dedikasi bagi masyarakat serta keluarga.`);
  }

  if (input.spouseName) {
    if (input.marriageYear) {
      parts.push(`Pada tahun ${input.marriageYear}, beliau mengikrarkan janji suci pernikahan dengan ${input.spouseName}. Bersama pasangan tercinta, beliau membangun bahtera rumah tangga yang harmonis.`);
    } else {
      parts.push(`Bersama pasangan hidup beliau, ${input.spouseName}, mereka saling mendampingi dalam suka dan duka membesarkan keluarga.`);
    }
  }

  if (input.childrenCount && input.childrenCount > 0) {
    parts.push(`Keluarga ini dikaruniai ${input.childrenCount} orang putra-putri yang senantiasa dididik dengan nilai-nilai kesederhanaan, budi pekerti, dan rasa hormat kepada leluhur.`);
  }

  if (input.keyMilestones && input.keyMilestones.length > 0) {
    parts.push(`Di antara jejak langkah berharga dalam hidup beliau meliputi: ${input.keyMilestones.join(', ')}.`);
  }

  if (input.deathDate) {
    parts.push(`Beliau berpulang ke haribaan Tuhan pada tanggal ${input.deathDate}${input.deathPlace ? ` di ${input.deathPlace}` : ''}. Jejak teladan, kehangatan, dan baktinya tetap hidup di sanubari segenap anak cucu serta keturunannya.`);
  } else {
    parts.push(`Hingga kini, petuah dan keteladanan beliau terus menjadi lentera bagi generasi penerus keluarga.`);
  }

  return parts.join('\n\n');
}

export async function suggestPhotoCaption(context: {
  eventOrPlace?: string;
  peopleNames?: string[];
  year?: string;
}): Promise<string> {
  const people = context.peopleNames && context.peopleNames.length > 0
    ? context.peopleNames.join(', ')
    : 'Keluarga';
  const year = context.year ? ` sekitar tahun ${context.year}` : '';
  const place = context.eventOrPlace ? ` di ${context.eventOrPlace}` : '';

  return `Momen hangat mengabadikan kebersamaan ${people}${place}${year}. Potret ini menjadi salah satu arsip pusaka berharga yang merekam perjalanan generasi keluarga kami.`;
}
