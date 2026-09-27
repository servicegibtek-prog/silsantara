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

export const CURRENT_USER: User = {
  id: 'usr_rama_1996',
  email: 'rama.wiradinata@gmail.com',
  displayName: 'Rama Wiradinata',
  photoUrl: '',
  createdAt: '2025-01-10T08:00:00Z',
};

export const INITIAL_FAMILIES: FamilySpace[] = [
  {
    id: 'fam_wiradinata',
    name: 'Keluarga Wiradinata',
    clanName: 'Rumpun Priangan Wiradinata',
    originCity: 'Bandung',
    originProvince: 'Jawa Barat',
    description: 'Dokumentasi trah dan silsilah keluarga besar Wiradinata bermula dari Bandung sejak pertengahan abad ke-20.',
    coverPhotoUrl: '/src/assets/images/hero_silsantara_family_1790509672270.jpg',
    ownerId: 'usr_rama_1996',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2026-09-20T14:30:00Z',
    privacySettings: {
      isPublic: false,
      livingMembersHidden: true,
      allowGuestTreeShare: true,
    }
  }
];

export const INITIAL_MEMBERS: FamilyMember[] = [
  // Generation 1 (Root Ancestors)
  {
    id: 'mem_hasan_1940',
    familyId: 'fam_wiradinata',
    firstName: 'Hasan',
    lastName: 'Wiradinata',
    nickname: 'Aki Hasan',
    gender: 'male',
    birthDate: '1940-06-12',
    birthPlace: 'Bandung, Jawa Barat',
    deathDate: '2022-10-18',
    deathPlace: 'Bandung, Jawa Barat',
    isLiving: false,
    biography: 'Pendidik dan insinyur sipil lulusan ITB tahun 1964. Mengabdi di Departemen Pekerjaan Umum dan sangat mencintai berkebun serta melestarikan adat Sunda.',
    occupation: 'Insinyur Sipil & Pengajar',
    address: 'Jl. Dago No. 142, Bandung',
    profilePhotoUrl: '/src/assets/images/family_portrait_hasan_1790509685714.jpg',
    privacyLevel: 'FAMILY',
    generation: 1,
    branch: 'Pusat Wiradinata',
    createdAt: '2025-01-15T10:05:00Z',
    updatedAt: '2026-05-12T09:00:00Z',
    createdBy: 'usr_rama_1996'
  },
  {
    id: 'mem_siti_1944',
    familyId: 'fam_wiradinata',
    firstName: 'Siti',
    lastName: 'Aminah',
    nickname: 'Enin Siti',
    gender: 'female',
    birthDate: '1944-04-14',
    birthPlace: 'Cianjur, Jawa Barat',
    isLiving: true,
    biography: 'Matriark keluarga yang penuh kasih dan bijaksana. Ahli meracik resep masakan Priangan kuno dan aktif dalam kegiatan sosial keagamaan di Bandung.',
    occupation: 'Guru Bahasa & Budaya (Pensiun)',
    address: 'Jl. Dago No. 142, Bandung',
    profilePhotoUrl: '/src/assets/images/family_portrait_siti_1790509696483.jpg',
    privacyLevel: 'FAMILY',
    generation: 1,
    branch: 'Pusat Wiradinata',
    createdAt: '2025-01-15T10:08:00Z',
    updatedAt: '2026-09-01T11:20:00Z',
    createdBy: 'usr_rama_1996'
  },

  // Generation 2 (Children of Hasan & Siti)
  {
    id: 'mem_bambang_1968',
    familyId: 'fam_wiradinata',
    firstName: 'Bambang',
    middleName: 'Surya',
    lastName: 'Wiradinata',
    nickname: 'Bambang',
    gender: 'male',
    birthDate: '1968-08-25',
    birthPlace: 'Bandung, Jawa Barat',
    isLiving: true,
    biography: 'Putra sulung keluarga. Melanjutkan minat ayah di bidang teknik elektro dan telekomunikasi. Ayah dari Rama dan Dina.',
    occupation: 'Konsultan Telekomunikasi',
    phone: '+62 812-3456-7890',
    email: 'bambang.sw@gmail.com',
    address: 'Jl. Ciumbuleuit No. 45, Bandung',
    privacyLevel: 'FAMILY',
    generation: 2,
    branch: 'Cabang Bambang',
    createdAt: '2025-01-15T10:15:00Z',
    updatedAt: '2026-08-10T14:00:00Z',
    createdBy: 'usr_rama_1996'
  },
  {
    id: 'mem_ratna_1970',
    familyId: 'fam_wiradinata',
    firstName: 'Ratna',
    lastName: 'Kusuma',
    nickname: 'Ratna',
    gender: 'female',
    birthDate: '1970-11-03',
    birthPlace: 'Yogyakarta',
    isLiving: true,
    biography: 'Menantu tertua, pendidik di salah satu universitas negeri di Bandung, gemar membatik dan melestarikan seni budaya.',
    occupation: 'Dosen Sastra',
    address: 'Jl. Ciumbuleuit No. 45, Bandung',
    privacyLevel: 'FAMILY',
    generation: 2,
    branch: 'Cabang Bambang',
    createdAt: '2025-01-15T10:20:00Z',
    updatedAt: '2026-07-04T12:00:00Z',
    createdBy: 'usr_rama_1996'
  },
  {
    id: 'mem_dewi_1973',
    familyId: 'fam_wiradinata',
    firstName: 'Dewi',
    middleName: 'Anggraini',
    lastName: 'Wiradinata',
    nickname: 'Dewi',
    gender: 'female',
    birthDate: '1973-03-19',
    birthPlace: 'Bandung, Jawa Barat',
    isLiving: true,
    biography: 'Anak kedua Hasan dan Siti. Dokter spesialis anak yang berpraktik di rumah sakit swasta di Jakarta Selatan.',
    occupation: 'Dokter Spesialis Anak',
    phone: '+62 813-9876-5432',
    address: 'Kebayoran Baru, Jakarta Selatan',
    privacyLevel: 'FAMILY',
    generation: 2,
    branch: 'Cabang Dewi',
    createdAt: '2025-01-15T10:25:00Z',
    updatedAt: '2026-06-18T10:00:00Z',
    createdBy: 'usr_rama_1996'
  },
  {
    id: 'mem_irfan_1971',
    familyId: 'fam_wiradinata',
    firstName: 'Irfan',
    lastName: 'Hakim',
    nickname: 'Irfan',
    gender: 'male',
    birthDate: '1971-09-08',
    birthPlace: 'Bukittinggi, Sumatera Barat',
    isLiving: true,
    biography: 'Suami dari Dewi Anggraini. Banker dan pengusaha di bidang kuliner Nusantara.',
    occupation: 'Direktur Finansial',
    address: 'Kebayoran Baru, Jakarta Selatan',
    privacyLevel: 'FAMILY',
    generation: 2,
    branch: 'Cabang Dewi',
    createdAt: '2025-01-15T10:28:00Z',
    updatedAt: '2026-06-18T10:00:00Z',
    createdBy: 'usr_rama_1996'
  },
  {
    id: 'mem_rahmat_1979',
    familyId: 'fam_wiradinata',
    firstName: 'Rahmat',
    middleName: 'Hidayat',
    lastName: 'Wiradinata',
    nickname: 'Rahmat / Mamat',
    gender: 'male',
    birthDate: '1979-05-30',
    birthPlace: 'Bandung, Jawa Barat',
    isLiving: true,
    biography: 'Putra bungsu keluarga. Pengusaha agribisnis dan kedai kopi kopi Priangan di kawasan Lembang Bandung.',
    occupation: 'Wirausahawan Agribisnis',
    address: 'Lembang, Bandung Barat',
    privacyLevel: 'FAMILY',
    generation: 2,
    branch: 'Cabang Rahmat',
    createdAt: '2025-01-15T10:30:00Z',
    updatedAt: '2026-05-10T09:00:00Z',
    createdBy: 'usr_rama_1996'
  },
  {
    id: 'mem_maya_1982',
    familyId: 'fam_wiradinata',
    firstName: 'Maya',
    lastName: 'Lestari',
    nickname: 'Maya',
    gender: 'female',
    birthDate: '1982-12-14',
    birthPlace: 'Semarang, Jawa Tengah',
    isLiving: true,
    biography: 'Istri dari Rahmat. Arsitek lanskap yang menyukai tanaman hias dan fotografi botani.',
    occupation: 'Arsitek Lanskap',
    address: 'Lembang, Bandung Barat',
    privacyLevel: 'FAMILY',
    generation: 2,
    branch: 'Cabang Rahmat',
    createdAt: '2025-01-15T10:32:00Z',
    updatedAt: '2026-05-10T09:00:00Z',
    createdBy: 'usr_rama_1996'
  },

  // Generation 3 (Grandchildren)
  {
    id: 'mem_rama_1996',
    familyId: 'fam_wiradinata',
    firstName: 'Rama',
    middleName: 'Aditya',
    lastName: 'Wiradinata',
    nickname: 'Rama',
    gender: 'male',
    birthDate: '1996-02-17',
    birthPlace: 'Bandung, Jawa Barat',
    isLiving: true,
    biography: 'Inisiator digitalisasi silsilah keluarga Wiradinata. Arsitek dan pegiat pelestarian bangunan pusaka kota tua.',
    occupation: 'Arsitek Bangunan Konservasi',
    phone: '+62 821-1122-3344',
    email: 'rama.wiradinata@gmail.com',
    address: 'Jl. Riau No. 88, Bandung',
    privacyLevel: 'FAMILY',
    generation: 3,
    branch: 'Cabang Bambang',
    createdAt: '2025-01-15T10:35:00Z',
    updatedAt: '2026-09-22T16:00:00Z',
    createdBy: 'usr_rama_1996'
  },
  {
    id: 'mem_annisa_1998',
    familyId: 'fam_wiradinata',
    firstName: 'Annisa',
    lastName: 'Putri',
    nickname: 'Nisa',
    gender: 'female',
    birthDate: '1998-05-11',
    birthPlace: 'Bogor, Jawa Barat',
    isLiving: true,
    biography: 'Istri Rama. Desainer grafis dan peneliti arsip visual Nusantara.',
    occupation: 'Desainer Grafis & Arsiparis',
    address: 'Jl. Riau No. 88, Bandung',
    privacyLevel: 'FAMILY',
    generation: 3,
    branch: 'Cabang Bambang',
    createdAt: '2025-01-15T10:40:00Z',
    updatedAt: '2026-09-22T16:00:00Z',
    createdBy: 'usr_rama_1996'
  },
  {
    id: 'mem_dina_2000',
    familyId: 'fam_wiradinata',
    firstName: 'Dina',
    middleName: 'Aulia',
    lastName: 'Wiradinata',
    nickname: 'Dina',
    gender: 'female',
    birthDate: '2000-07-22',
    birthPlace: 'Bandung, Jawa Barat',
    isLiving: true,
    biography: 'Adik perempuan Rama. Lulusan Hubungan Internasional, aktif di bidang diplomasi kebudayaan dan dokumentasi sejarah lisan.',
    occupation: 'Peneliti Sejarah Lisan',
    email: 'dina.wiradinata@gmail.com',
    address: 'Bandung, Jawa Barat',
    privacyLevel: 'FAMILY',
    generation: 3,
    branch: 'Cabang Bambang',
    createdAt: '2025-01-15T10:45:00Z',
    updatedAt: '2026-09-15T11:00:00Z',
    createdBy: 'usr_rama_1996'
  },
  {
    id: 'mem_rizky_1998',
    familyId: 'fam_wiradinata',
    firstName: 'Rizky',
    lastName: 'Pratama',
    nickname: 'Rizky',
    gender: 'male',
    birthDate: '1998-10-05',
    birthPlace: 'Jakarta',
    isLiving: true,
    biography: 'Putra sulung Dewi dan Irfan. Software engineer yang tinggal di BSD City Tangerang.',
    occupation: 'Software Engineer',
    address: 'BSD City, Tangerang Selatan',
    privacyLevel: 'FAMILY',
    generation: 3,
    branch: 'Cabang Dewi',
    createdAt: '2025-01-15T10:50:00Z',
    updatedAt: '2026-08-01T15:00:00Z',
    createdBy: 'usr_rama_1996'
  },
  {
    id: 'mem_nadia_2004',
    familyId: 'fam_wiradinata',
    firstName: 'Nadia',
    lastName: 'Putri',
    nickname: 'Nadia',
    gender: 'female',
    birthDate: '2004-01-18',
    birthPlace: 'Jakarta',
    isLiving: true,
    biography: 'Putri kedua Dewi dan Irfan. Mahasiswi kedokteran tingkat tiga.',
    occupation: 'Mahasiswi Kedokteran',
    address: 'Jakarta Selatan',
    privacyLevel: 'FAMILY',
    generation: 3,
    branch: 'Cabang Dewi',
    createdAt: '2025-01-15T10:52:00Z',
    updatedAt: '2026-08-01T15:00:00Z',
    createdBy: 'usr_rama_1996'
  },
  {
    id: 'mem_arka_2012',
    familyId: 'fam_wiradinata',
    firstName: 'Arka',
    lastName: 'Wiradinata',
    nickname: 'Arka',
    gender: 'male',
    birthDate: '2012-09-03',
    birthPlace: 'Bandung, Jawa Barat',
    isLiving: true,
    biography: 'Putra tunggal Rahmat dan Maya. Pelajar SMP yang gemar sepak bola dan robotika.',
    occupation: 'Pelajar',
    address: 'Lembang, Bandung Barat',
    privacyLevel: 'FAMILY',
    generation: 3,
    branch: 'Cabang Rahmat',
    createdAt: '2025-01-15T10:55:00Z',
    updatedAt: '2026-04-10T12:00:00Z',
    createdBy: 'usr_rama_1996'
  },

  // Generation 4 (Great-grandchildren)
  {
    id: 'mem_kayla_2024',
    familyId: 'fam_wiradinata',
    firstName: 'Kayla',
    middleName: 'Nirmala',
    lastName: 'Wiradinata',
    nickname: 'Kayla',
    gender: 'female',
    birthDate: '2024-03-28',
    birthPlace: 'Bandung, Jawa Barat',
    isLiving: true,
    biography: 'Cicit pertama di rumpun Bambang Wiradinata, putri dari Rama dan Annisa.',
    occupation: 'Bayi',
    privacyLevel: 'FAMILY',
    generation: 4,
    branch: 'Cabang Bambang',
    createdAt: '2025-01-15T11:00:00Z',
    updatedAt: '2026-09-01T10:00:00Z',
    createdBy: 'usr_rama_1996'
  }
];

export const INITIAL_RELATIONSHIPS: Relationship[] = [
  // Hasan & Siti marriage
  {
    id: 'rel_hasan_siti',
    familyId: 'fam_wiradinata',
    personAId: 'mem_hasan_1940',
    personBId: 'mem_siti_1944',
    type: 'SPOUSE',
    startDate: '1966-07-16',
    endDate: '2022-10-18',
    status: 'PASANGAN_MENINGGAL',
    notes: 'Menikah di Masjid Agung Bandung. Pernikahan langgeng 56 tahun hingga Aki Hasan berpulang.',
    createdAt: '2025-01-15T10:10:00Z',
    createdBy: 'usr_rama_1996'
  },
  // Hasan & Siti -> Bambang
  {
    id: 'rel_hasan_bambang',
    familyId: 'fam_wiradinata',
    personAId: 'mem_hasan_1940',
    personBId: 'mem_bambang_1968',
    type: 'BIOLOGICAL_PARENT',
    createdAt: '2025-01-15T10:16:00Z',
    createdBy: 'usr_rama_1996'
  },
  {
    id: 'rel_siti_bambang',
    familyId: 'fam_wiradinata',
    personAId: 'mem_siti_1944',
    personBId: 'mem_bambang_1968',
    type: 'BIOLOGICAL_PARENT',
    createdAt: '2025-01-15T10:16:00Z',
    createdBy: 'usr_rama_1996'
  },
  // Hasan & Siti -> Dewi
  {
    id: 'rel_hasan_dewi',
    familyId: 'fam_wiradinata',
    personAId: 'mem_hasan_1940',
    personBId: 'mem_dewi_1973',
    type: 'BIOLOGICAL_PARENT',
    createdAt: '2025-01-15T10:26:00Z',
    createdBy: 'usr_rama_1996'
  },
  {
    id: 'rel_siti_dewi',
    familyId: 'fam_wiradinata',
    personAId: 'mem_siti_1944',
    personBId: 'mem_dewi_1973',
    type: 'BIOLOGICAL_PARENT',
    createdAt: '2025-01-15T10:26:00Z',
    createdBy: 'usr_rama_1996'
  },
  // Hasan & Siti -> Rahmat
  {
    id: 'rel_hasan_rahmat',
    familyId: 'fam_wiradinata',
    personAId: 'mem_hasan_1940',
    personBId: 'mem_rahmat_1979',
    type: 'BIOLOGICAL_PARENT',
    createdAt: '2025-01-15T10:31:00Z',
    createdBy: 'usr_rama_1996'
  },
  {
    id: 'rel_siti_rahmat',
    familyId: 'fam_wiradinata',
    personAId: 'mem_siti_1944',
    personBId: 'mem_rahmat_1979',
    type: 'BIOLOGICAL_PARENT',
    createdAt: '2025-01-15T10:31:00Z',
    createdBy: 'usr_rama_1996'
  },

  // Bambang & Ratna marriage
  {
    id: 'rel_bambang_ratna',
    familyId: 'fam_wiradinata',
    personAId: 'mem_bambang_1968',
    personBId: 'mem_ratna_1970',
    type: 'SPOUSE',
    startDate: '1994-06-20',
    status: 'MENIKAH',
    notes: 'Menikah di Kraton Yogyakarta.',
    createdAt: '2025-01-15T10:22:00Z',
    createdBy: 'usr_rama_1996'
  },
  // Bambang & Ratna -> Rama
  {
    id: 'rel_bambang_rama',
    familyId: 'fam_wiradinata',
    personAId: 'mem_bambang_1968',
    personBId: 'mem_rama_1996',
    type: 'BIOLOGICAL_PARENT',
    createdAt: '2025-01-15T10:36:00Z',
    createdBy: 'usr_rama_1996'
  },
  {
    id: 'rel_ratna_rama',
    familyId: 'fam_wiradinata',
    personAId: 'mem_ratna_1970',
    personBId: 'mem_rama_1996',
    type: 'BIOLOGICAL_PARENT',
    createdAt: '2025-01-15T10:36:00Z',
    createdBy: 'usr_rama_1996'
  },
  // Bambang & Ratna -> Dina
  {
    id: 'rel_bambang_dina',
    familyId: 'fam_wiradinata',
    personAId: 'mem_bambang_1968',
    personBId: 'mem_dina_2000',
    type: 'BIOLOGICAL_PARENT',
    createdAt: '2025-01-15T10:46:00Z',
    createdBy: 'usr_rama_1996'
  },
  {
    id: 'rel_ratna_dina',
    familyId: 'fam_wiradinata',
    personAId: 'mem_ratna_1970',
    personBId: 'mem_dina_2000',
    type: 'BIOLOGICAL_PARENT',
    createdAt: '2025-01-15T10:46:00Z',
    createdBy: 'usr_rama_1996'
  },

  // Dewi & Irfan marriage
  {
    id: 'rel_dewi_irfan',
    familyId: 'fam_wiradinata',
    personAId: 'mem_dewi_1973',
    personBId: 'mem_irfan_1971',
    type: 'SPOUSE',
    startDate: '1997-09-12',
    status: 'MENIKAH',
    notes: 'Menikah di Gedung Wanita Bandung.',
    createdAt: '2025-01-15T10:29:00Z',
    createdBy: 'usr_rama_1996'
  },
  // Dewi & Irfan -> Rizky
  {
    id: 'rel_dewi_rizky',
    familyId: 'fam_wiradinata',
    personAId: 'mem_dewi_1973',
    personBId: 'mem_rizky_1998',
    type: 'BIOLOGICAL_PARENT',
    createdAt: '2025-01-15T10:51:00Z',
    createdBy: 'usr_rama_1996'
  },
  {
    id: 'rel_irfan_rizky',
    familyId: 'fam_wiradinata',
    personAId: 'mem_irfan_1971',
    personBId: 'mem_rizky_1998',
    type: 'BIOLOGICAL_PARENT',
    createdAt: '2025-01-15T10:51:00Z',
    createdBy: 'usr_rama_1996'
  },
  // Dewi & Irfan -> Nadia
  {
    id: 'rel_dewi_nadia',
    familyId: 'fam_wiradinata',
    personAId: 'mem_dewi_1973',
    personBId: 'mem_nadia_2004',
    type: 'BIOLOGICAL_PARENT',
    createdAt: '2025-01-15T10:53:00Z',
    createdBy: 'usr_rama_1996'
  },
  {
    id: 'rel_irfan_nadia',
    familyId: 'fam_wiradinata',
    personAId: 'mem_irfan_1971',
    personBId: 'mem_nadia_2004',
    type: 'BIOLOGICAL_PARENT',
    createdAt: '2025-01-15T10:53:00Z',
    createdBy: 'usr_rama_1996'
  },

  // Rahmat & Maya marriage
  {
    id: 'rel_rahmat_maya',
    familyId: 'fam_wiradinata',
    personAId: 'mem_rahmat_1979',
    personBId: 'mem_maya_1982',
    type: 'SPOUSE',
    startDate: '2008-04-20',
    status: 'MENIKAH',
    notes: 'Menikah di Lembang Bandung.',
    createdAt: '2025-01-15T10:33:00Z',
    createdBy: 'usr_rama_1996'
  },
  // Rahmat & Maya -> Arka
  {
    id: 'rel_rahmat_arka',
    familyId: 'fam_wiradinata',
    personAId: 'mem_rahmat_1979',
    personBId: 'mem_arka_2012',
    type: 'BIOLOGICAL_PARENT',
    createdAt: '2025-01-15T10:56:00Z',
    createdBy: 'usr_rama_1996'
  },
  {
    id: 'rel_maya_arka',
    familyId: 'fam_wiradinata',
    personAId: 'mem_maya_1982',
    personBId: 'mem_arka_2012',
    type: 'BIOLOGICAL_PARENT',
    createdAt: '2025-01-15T10:56:00Z',
    createdBy: 'usr_rama_1996'
  },

  // Rama & Annisa marriage
  {
    id: 'rel_rama_annisa',
    familyId: 'fam_wiradinata',
    personAId: 'mem_rama_1996',
    personBId: 'mem_annisa_1998',
    type: 'SPOUSE',
    startDate: '2022-09-24',
    status: 'MENIKAH',
    notes: 'Akad di Masjid Al-Irsyad Kota Baru Parahyangan.',
    createdAt: '2025-01-15T10:41:00Z',
    createdBy: 'usr_rama_1996'
  },
  // Rama & Annisa -> Kayla
  {
    id: 'rel_rama_kayla',
    familyId: 'fam_wiradinata',
    personAId: 'mem_rama_1996',
    personBId: 'mem_kayla_2024',
    type: 'BIOLOGICAL_PARENT',
    createdAt: '2025-01-15T11:01:00Z',
    createdBy: 'usr_rama_1996'
  },
  {
    id: 'rel_annisa_kayla',
    familyId: 'fam_wiradinata',
    personAId: 'mem_annisa_1998',
    personBId: 'mem_kayla_2024',
    type: 'BIOLOGICAL_PARENT',
    createdAt: '2025-01-15T11:01:00Z',
    createdBy: 'usr_rama_1996'
  }
];

export const INITIAL_MEMORIES: FamilyMemory[] = [
  {
    id: 'mem_lebaran_1998',
    familyId: 'fam_wiradinata',
    title: 'Lebaran di Rumah Nenek Tahun 1998 di Dago',
    story: 'Pagi hari Idul Fitri 1998 di beranda rumah Dago selalu menjadi memori paling hangat bagi kami semua. Enin Siti sudah sibuk sejak subuh menata opor ayam kampung, ketupat daun pandan, dan sambal goreng ati khas Sunda. Aki Hasan duduk di kursi goyang jati menyambut anak cucu yang berdatangan dari Jakarta dan Yogyakarta. Suara gelak tawa dan aroma melati di sudut teras menjadi kenangan tak tergantikan.',
    date: '1998-01-30',
    location: 'Rumah Dago No. 142, Bandung',
    taggedMemberIds: ['mem_hasan_1940', 'mem_siti_1944', 'mem_bambang_1968', 'mem_dewi_1973', 'mem_rahmat_1979', 'mem_rama_1996'],
    photoUrls: ['/src/assets/images/family_archive_lebaran_1790509708584.jpg'],
    authorId: 'usr_rama_1996',
    authorName: 'Rama Wiradinata',
    createdAt: '2025-01-16T14:00:00Z'
  },
  {
    id: 'mem_pernikahan_1966',
    familyId: 'fam_wiradinata',
    title: 'Pernikahan Kakek Hasan dan Nenek Siti di Alun-Alun',
    story: 'Pada pertengahan tahun 1966, seusai Kakek Hasan menamatkan studi di Institut Teknologi Bandung, beliau meminang Siti Aminah dari Cianjur. Acara ijab kabul dilangsungkan khidmat dengan adat Sunda Priangan. Nenek mengenakan kebaya putih rancangan ibundanya sendiri, sementara Kakek mengenakan jas tutup bertahta bunga sedap malam.',
    date: '1966-07-16',
    location: 'Masjid Agung Bandung',
    taggedMemberIds: ['mem_hasan_1940', 'mem_siti_1944'],
    photoUrls: ['/src/assets/images/family_portrait_hasan_1790509685714.jpg', '/src/assets/images/family_portrait_siti_1790509696483.jpg'],
    authorId: 'usr_rama_1996',
    authorName: 'Bambang Surya Wiradinata',
    createdAt: '2025-02-02T10:00:00Z'
  },
  {
    id: 'mem_kebun_lembang_2015',
    familyId: 'fam_wiradinata',
    title: 'Panen Kopi Perdana Paman Rahmat di Lereng Tangkuban Parahu',
    story: 'Tahun 2015, seluruh keluarga berkumpul di perkebunan Lembang untuk merayakan panen kopi Priangan pertama yang dirintis Paman Rahmat. Aki Hasan tersenyum bangga melihat tanah keluarga dimanfaatkan secara bijaksana untuk pertanian lestari.',
    date: '2015-08-17',
    location: 'Lembang, Bandung Barat',
    taggedMemberIds: ['mem_hasan_1940', 'mem_rahmat_1979', 'mem_arka_2012'],
    photoUrls: ['/src/assets/images/hero_silsantara_family_1790509672270.jpg'],
    authorId: 'usr_rama_1996',
    authorName: 'Dina Wiradinata',
    createdAt: '2025-03-10T16:00:00Z'
  }
];

export const INITIAL_PHOTOS: FamilyPhoto[] = [
  {
    id: 'pht_1',
    familyId: 'fam_wiradinata',
    albumId: 'alb_arsip_lawas',
    url: '/src/assets/images/hero_silsantara_family_1790509672270.jpg',
    caption: 'Foto keluarga besar Wiradinata di beranda rumah Bandung, lintas tiga generasi',
    description: 'Dokumentasi arsip pusaka keluarga Wiradinata lengkap dari generasi pertama dan anak-anak.',
    date: '1975-04-12',
    location: 'Bandung, Jawa Barat',
    taggedMemberIds: ['mem_hasan_1940', 'mem_siti_1944', 'mem_bambang_1968', 'mem_dewi_1973'],
    uploadedBy: 'Rama Wiradinata',
    createdAt: '2025-01-16T12:00:00Z'
  },
  {
    id: 'pht_2',
    familyId: 'fam_wiradinata',
    albumId: 'alb_lebaran',
    url: '/src/assets/images/family_archive_lebaran_1790509708584.jpg',
    caption: 'Hangatnya silaturahmi Idul Fitri di ruang tengah rumah Dago',
    description: 'Momen kebersamaan yang terekam kamera analog kodak era 90-an.',
    date: '1998-01-30',
    location: 'Dago, Bandung',
    taggedMemberIds: ['mem_hasan_1940', 'mem_siti_1944', 'mem_bambang_1968', 'mem_rama_1996'],
    uploadedBy: 'Rama Wiradinata',
    createdAt: '2025-01-16T12:15:00Z'
  },
  {
    id: 'pht_3',
    familyId: 'fam_wiradinata',
    albumId: 'alb_potret',
    url: '/src/assets/images/family_portrait_hasan_1790509685714.jpg',
    caption: 'Potret Kakek Hasan Wiradinata mengenakan batik cap Priangan',
    description: 'Diambil di ruang baca beliau saat menginjak usia 75 tahun.',
    date: '2015-06-12',
    location: 'Bandung',
    taggedMemberIds: ['mem_hasan_1940'],
    uploadedBy: 'Rama Wiradinata',
    createdAt: '2025-01-16T12:20:00Z'
  },
  {
    id: 'pht_4',
    familyId: 'fam_wiradinata',
    albumId: 'alb_potret',
    url: '/src/assets/images/family_portrait_siti_1790509696483.jpg',
    caption: 'Potret Nenek Siti Aminah berkebaya encim putih',
    description: 'Potret teduh Enin Siti di pagi hari menjelang hari raya.',
    date: '2018-04-14',
    location: 'Bandung',
    taggedMemberIds: ['mem_siti_1944'],
    uploadedBy: 'Rama Wiradinata',
    createdAt: '2025-01-16T12:25:00Z'
  }
];

export const INITIAL_ALBUMS: FamilyAlbum[] = [
  {
    id: 'alb_arsip_lawas',
    familyId: 'fam_wiradinata',
    title: 'Arsip Pusaka & Foto Lawas (1960–1980)',
    description: 'Koleksi foto hitam putih dan sepia masa awal keluarga berdiri di Bandung.',
    coverPhotoUrl: '/src/assets/images/hero_silsantara_family_1790509672270.jpg',
    createdAt: '2025-01-16T11:00:00Z'
  },
  {
    id: 'alb_lebaran',
    familyId: 'fam_wiradinata',
    title: 'Tradisi Lebaran Lintas Tahun',
    description: 'Foto perayaan Idul Fitri keluarga besar dari tahun ke tahun.',
    coverPhotoUrl: '/src/assets/images/family_archive_lebaran_1790509708584.jpg',
    createdAt: '2025-01-16T11:05:00Z'
  },
  {
    id: 'alb_potret',
    familyId: 'fam_wiradinata',
    title: 'Potret Tokoh & Sesepuh Keluarga',
    description: 'Potret formal dan intim para tetua dan anggota keluarga.',
    coverPhotoUrl: '/src/assets/images/family_portrait_hasan_1790509685714.jpg',
    createdAt: '2025-01-16T11:10:00Z'
  }
];

export const INITIAL_DOCUMENTS: FamilyDocument[] = [
  {
    id: 'doc_akta_nikah_1966',
    familyId: 'fam_wiradinata',
    title: 'Buku & Akta Nikah Hasan Wiradinata & Siti Aminah (1966)',
    category: 'AKTA_NIKAH',
    fileUrl: '/src/assets/images/family_document_akta_1790509720032.jpg',
    fileType: 'image/jpeg',
    date: '1966-07-16',
    notes: 'Arsip akta asli dikeluarkan oleh Kantor Urusan Agama Kota Bandung.',
    attachedMemberIds: ['mem_hasan_1940', 'mem_siti_1944'],
    privacyLevel: 'FAMILY',
    uploadedBy: 'Rama Wiradinata',
    createdAt: '2025-01-17T09:00:00Z'
  },
  {
    id: 'doc_akta_lahir_bambang',
    familyId: 'fam_wiradinata',
    title: 'Akta Kelahiran Bambang Surya Wiradinata (1968)',
    category: 'AKTA_KELAHIRAN',
    fileUrl: '/src/assets/images/family_document_akta_1790509720032.jpg',
    fileType: 'image/jpeg',
    date: '1968-08-25',
    notes: 'Kutipan akta kelahiran dari Catatan Sipil Kotamadya Bandung.',
    attachedMemberIds: ['mem_bambang_1968'],
    privacyLevel: 'FAMILY',
    uploadedBy: 'Rama Wiradinata',
    createdAt: '2025-01-17T09:15:00Z'
  },
  {
    id: 'doc_ijazah_itb_hasan',
    familyId: 'fam_wiradinata',
    title: 'Ijazah Insinyur ITB Hasan Wiradinata (1964)',
    category: 'IJAZAH',
    fileUrl: '/src/assets/images/family_document_akta_1790509720032.jpg',
    fileType: 'image/jpeg',
    date: '1964-10-10',
    notes: 'Sertifikat kelulusan Departemen Teknik Sipil Institut Teknologi Bandung.',
    attachedMemberIds: ['mem_hasan_1940'],
    privacyLevel: 'PUBLIC',
    uploadedBy: 'Rama Wiradinata',
    createdAt: '2025-01-17T09:30:00Z'
  }
];

export const INITIAL_EVENTS: FamilyEvent[] = [
  {
    id: 'evt_ultah_siti',
    familyId: 'fam_wiradinata',
    title: 'Ulang Tahun Nenek Siti Aminah',
    type: 'BIRTHDAY',
    date: '2026-04-14',
    isRecurring: true,
    description: 'Ulang tahun ke-82 Enin Siti tercinta. Berkumpul di rumah Dago.',
    location: 'Jl. Dago No. 142, Bandung',
    memberIds: ['mem_siti_1944'],
    createdAt: '2025-01-18T10:00:00Z'
  },
  {
    id: 'evt_haul_hasan',
    familyId: 'fam_wiradinata',
    title: 'Peringatan Mengenang 4 Tahun Wafatnya Kakek Hasan',
    type: 'MEMORIAL',
    date: '2026-10-18',
    isRecurring: false,
    description: 'Doa bersama dan tahlil mengenang Aki Hasan Wiradinata.',
    location: 'Bandung, Jawa Barat',
    memberIds: ['mem_hasan_1940'],
    createdAt: '2025-01-18T10:05:00Z'
  },
  {
    id: 'evt_gathering_wiradinata',
    familyId: 'fam_wiradinata',
    title: 'Silaturahmi Akbar Rumpun Wiradinata 2026',
    type: 'GATHERING',
    date: '2026-11-15',
    isRecurring: false,
    description: 'Temu kangen seluruh keluarga besar cabang Bandung, Jakarta, dan Lembang.',
    location: 'Lembang, Bandung Barat',
    memberIds: ['mem_siti_1944', 'mem_bambang_1968', 'mem_dewi_1973', 'mem_rahmat_1979', 'mem_rama_1996'],
    createdAt: '2025-01-18T10:10:00Z'
  },
  {
    id: 'evt_ultah_dina',
    familyId: 'fam_wiradinata',
    title: 'Ulang Tahun Dina Wiradinata',
    type: 'BIRTHDAY',
    date: '2026-07-22',
    isRecurring: true,
    description: 'Ulang tahun Dina yang ke-26.',
    location: 'Bandung',
    memberIds: ['mem_dina_2000'],
    createdAt: '2025-01-18T10:15:00Z'
  }
];

export const INITIAL_COLLABORATORS: Collaborator[] = [
  {
    userId: 'usr_rama_1996',
    familyId: 'fam_wiradinata',
    email: 'rama.wiradinata@gmail.com',
    name: 'Rama Wiradinata',
    role: 'OWNER',
    connectedMemberId: 'mem_rama_1996',
    joinedAt: '2025-01-15T10:00:00Z'
  },
  {
    userId: 'usr_dina_2000',
    familyId: 'fam_wiradinata',
    email: 'dina.wiradinata@gmail.com',
    name: 'Dina Wiradinata',
    role: 'ADMIN',
    connectedMemberId: 'mem_dina_2000',
    joinedAt: '2025-01-20T14:00:00Z'
  },
  {
    userId: 'usr_bambang_1968',
    familyId: 'fam_wiradinata',
    email: 'bambang.sw@gmail.com',
    name: 'Bambang Surya Wiradinata',
    role: 'EDITOR',
    connectedMemberId: 'mem_bambang_1968',
    joinedAt: '2025-02-01T11:00:00Z'
  },
  {
    userId: 'usr_rizky_1998',
    familyId: 'fam_wiradinata',
    email: 'rizky.pratama@gmail.com',
    name: 'Rizky Pratama',
    role: 'VIEWER',
    connectedMemberId: 'mem_rizky_1998',
    joinedAt: '2025-03-05T09:00:00Z'
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'act_1',
    familyId: 'fam_wiradinata',
    actorId: 'usr_dina_2000',
    actorName: 'Dina Wiradinata',
    action: 'MENAMBAHKAN_MEMORI',
    entityType: 'MEMORY',
    entityId: 'mem_kebun_lembang_2015',
    details: 'Menambahkan kenangan cerita Panen Kopi Perdana Paman Rahmat di Lembang',
    timestamp: '2026-09-22T14:30:00Z'
  },
  {
    id: 'act_2',
    familyId: 'fam_wiradinata',
    actorId: 'usr_rama_1996',
    actorName: 'Rama Wiradinata',
    action: 'MEMPERBARUI_PROFIL',
    entityType: 'MEMBER',
    entityId: 'mem_siti_1944',
    details: 'Memperbarui biografi dan informasi Enin Siti Aminah',
    timestamp: '2026-09-20T10:15:00Z'
  },
  {
    id: 'act_3',
    familyId: 'fam_wiradinata',
    actorId: 'usr_bambang_1968',
    actorName: 'Bambang Wiradinata',
    action: 'MENAMBAHKAN_DOKUMEN',
    entityType: 'DOCUMENT',
    entityId: 'doc_ijazah_itb_hasan',
    details: 'Mengunggah arsip pindaian Ijazah ITB 1964 Aki Hasan',
    timestamp: '2026-09-14T16:45:00Z'
  },
  {
    id: 'act_4',
    familyId: 'fam_wiradinata',
    actorId: 'usr_rama_1996',
    actorName: 'Rama Wiradinata',
    action: 'MENGUNDANG_KOLABORATOR',
    entityType: 'COLLABORATOR',
    details: 'Mengundang Rizky Pratama bergabung sebagai Pengamat (Viewer)',
    timestamp: '2026-09-10T08:20:00Z'
  }
];
