import React, { useState, useEffect } from 'react';
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
  User,
  RelationshipType,
  MarriageStatus
} from './types';
import { StorageService } from './services/storageService';

// Layout Components
import { Navbar } from './components/layout/Navbar';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { CreateFamilyModal } from './components/layout/CreateFamilyModal';

// Tree & Core Components
import { FamilyTreeCanvas } from './components/tree/FamilyTreeCanvas';
import { MemberDetailDrawer } from './components/tree/MemberDetailDrawer';
import { RelationshipSearchModal } from './components/tree/RelationshipSearchModal';
import { AddMemberModal } from './components/tree/AddMemberModal';

// Feature Views
import { FamilyDashboard } from './components/dashboard/FamilyDashboard';
import { MemberDirectory } from './components/members/MemberDirectory';
import { MemberProfilePage } from './components/members/MemberProfilePage';
import { FamilyTimeline } from './components/timeline/FamilyTimeline';
import { FamilyMemories } from './components/memories/FamilyMemories';
import { PhotoGallery } from './components/gallery/PhotoGallery';
import { HistoricalDocuments } from './components/documents/HistoricalDocuments';
import { FamilyEventsCalendar } from './components/events/FamilyEventsCalendar';
import { FamilyStatistics } from './components/statistics/FamilyStatistics';
import { CollaboratorsManager } from './components/collaborators/CollaboratorsManager';
import { SettingsPage } from './components/settings/SettingsPage';
import { HelpFaqModal } from './components/help/HelpFaqModal';

// Landing, Auth & Onboarding
import { LandingPage } from './components/landing/LandingPage';
import { AuthPages } from './components/auth/AuthPages';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';

// Modals
import { ShareModal } from './components/export/ShareModal';
import { AiStoryModal } from './components/ai/AiStoryModal';
import { InterviewAssistantModal } from './components/ai/InterviewAssistantModal';

export default function App() {
  // Main view state: 'landing' | 'auth' | 'onboarding' | 'app'
  const [viewState, setViewState] = useState<'landing' | 'auth' | 'onboarding' | 'app'>('app');
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [currentTab, setCurrentTab] = useState<NavTab>('beranda');

  // Active family & entities state
  const [currentUser, setCurrentUser] = useState<User>(() => StorageService.getUser());
  const [families, setFamilies] = useState<FamilySpace[]>(() => StorageService.getFamilies());
  const [activeFamilyId, setActiveFamilyId] = useState<string>(() => StorageService.getActiveFamilyId());
  
  const activeFamily = families.find(f => f.id === activeFamilyId) || families[0];

  const [members, setMembers] = useState<FamilyMember[]>(() => StorageService.getMembers(activeFamilyId));
  const [relationships, setRelationships] = useState<Relationship[]>(() => StorageService.getRelationships(activeFamilyId));
  const [memories, setMemories] = useState<FamilyMemory[]>(() => StorageService.getMemories(activeFamilyId));
  const [photos, setPhotos] = useState<FamilyPhoto[]>(() => StorageService.getPhotos(activeFamilyId));
  const [albums, setAlbums] = useState<FamilyAlbum[]>(() => StorageService.getAlbums(activeFamilyId));
  const [documents, setDocuments] = useState<FamilyDocument[]>(() => StorageService.getDocuments(activeFamilyId));
  const [events, setEvents] = useState<FamilyEvent[]>(() => StorageService.getEvents(activeFamilyId));
  const [collaborators, setCollaborators] = useState<Collaborator[]>(() => StorageService.getCollaborators(activeFamilyId));
  const [activities, setActivities] = useState<ActivityLog[]>(() => StorageService.getActivityLogs(activeFamilyId));

  // Selection states
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [fullProfileMemberId, setFullProfileMemberId] = useState<string | null>(null);

  // Modal visibility states
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [addMemberContext, setAddMemberContext] = useState<{
    targetMember?: FamilyMember | null;
    relContext?: 'child' | 'spouse' | 'parent' | 'sibling' | null;
  }>({});
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAiStoryModal, setShowAiStoryModal] = useState(false);
  const [aiStoryTargetMember, setAiStoryTargetMember] = useState<FamilyMember | null>(null);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showCreateFamilyModal, setShowCreateFamilyModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Refresh data when activeFamilyId changes
  useEffect(() => {
    StorageService.setActiveFamilyId(activeFamilyId);
    setMembers(StorageService.getMembers(activeFamilyId));
    setRelationships(StorageService.getRelationships(activeFamilyId));
    setMemories(StorageService.getMemories(activeFamilyId));
    setPhotos(StorageService.getPhotos(activeFamilyId));
    setAlbums(StorageService.getAlbums(activeFamilyId));
    setDocuments(StorageService.getDocuments(activeFamilyId));
    setEvents(StorageService.getEvents(activeFamilyId));
    setCollaborators(StorageService.getCollaborators(activeFamilyId));
    setActivities(StorageService.getActivityLogs(activeFamilyId));
    setSelectedMember(null);
    setFullProfileMemberId(null);
  }, [activeFamilyId]);

  // Handle switching family
  const handleSelectFamily = (fam: FamilySpace) => {
    setActiveFamilyId(fam.id);
  };

  // Handle creating a new family
  const handleCreateFamily = (newFam: FamilySpace) => {
    const updated = [...families, newFam];
    setFamilies(updated);
    StorageService.saveFamilies(updated);
    setActiveFamilyId(newFam.id);
    StorageService.logActivity({
      familyId: newFam.id,
      actorId: currentUser.id,
      actorName: currentUser.displayName,
      action: 'MEMBUAT_RUANG_KELUARGA',
      entityType: 'FAMILY',
      entityId: newFam.id,
      details: `Membuat ruang keluarga baru: ${newFam.name}`
    });
    setActivities(StorageService.getActivityLogs(newFam.id));
  };

  // Handle adding a family member
  const handleSaveMember = (
    memberData: Omit<FamilyMember, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>,
    relData?: {
      targetMemberId: string;
      relType: RelationshipType;
      marriageStatus?: MarriageStatus;
    }
  ) => {
    const newMemberId = `mem_${Date.now()}`;
    const newMember: FamilyMember = {
      ...memberData,
      id: newMemberId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: currentUser.id
    };

    const updatedMembers = [...members, newMember];
    setMembers(updatedMembers);
    StorageService.saveMembers(updatedMembers);

    // Save relationship if specified
    if (relData) {
      let personAId = relData.targetMemberId;
      let personBId = newMemberId;

      if (relData.relType === 'BIOLOGICAL_PARENT' && addMemberContext.relContext === 'parent') {
        // Target was child, new member is parent
        personAId = newMemberId;
        personBId = relData.targetMemberId;
      }

      const newRel: Relationship = {
        id: `rel_${Date.now()}`,
        familyId: activeFamilyId,
        personAId,
        personBId,
        type: relData.relType,
        status: relData.marriageStatus,
        createdAt: new Date().toISOString(),
        createdBy: currentUser.id
      };

      const updatedRels = [...relationships, newRel];
      setRelationships(updatedRels);
      StorageService.saveRelationships(updatedRels);
    }

    // Log activity
    StorageService.logActivity({
      familyId: activeFamilyId,
      actorId: currentUser.id,
      actorName: currentUser.displayName,
      action: 'MENAMBAHKAN_ANGGOTA',
      entityType: 'MEMBER',
      entityId: newMemberId,
      details: `Menambahkan kerabat baru: ${newMember.firstName} ${newMember.lastName || ''}`
    });
    setActivities(StorageService.getActivityLogs(activeFamilyId));
    setSelectedMember(newMember);
  };

  // Handle saving AI biography to member
  const handleSaveAiBiography = (memberId: string, approvedBio: string) => {
    const updated = members.map(m => m.id === memberId ? { ...m, biography: approvedBio, updatedAt: new Date().toISOString() } : m);
    setMembers(updated);
    StorageService.saveMembers(updated);
    if (selectedMember && selectedMember.id === memberId) {
      setSelectedMember({ ...selectedMember, biography: approvedBio });
    }
    StorageService.logActivity({
      familyId: activeFamilyId,
      actorId: currentUser.id,
      actorName: currentUser.displayName,
      action: 'MEMPERBARUI_BIOGRAFI',
      entityType: 'MEMBER',
      entityId: memberId,
      details: `Memperbarui biografi untuk ${members.find(m => m.id === memberId)?.firstName}`
    });
    setActivities(StorageService.getActivityLogs(activeFamilyId));
  };

  // Handle adding memories
  const handleAddMemory = (memoryData: Omit<FamilyMemory, 'id' | 'createdAt'>) => {
    const newMemory: FamilyMemory = {
      ...memoryData,
      id: `mem_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const updated = [newMemory, ...memories];
    setMemories(updated);
    StorageService.saveMemories(updated);
    StorageService.logActivity({
      familyId: activeFamilyId,
      actorId: currentUser.id,
      actorName: currentUser.displayName,
      action: 'MENAMBAHKAN_KENANGAN',
      entityType: 'MEMORY',
      entityId: newMemory.id,
      details: `Menulis kenangan: "${newMemory.title}"`
    });
    setActivities(StorageService.getActivityLogs(activeFamilyId));
  };

  // Handle adding photo
  const handleAddPhoto = (photoData: Omit<FamilyPhoto, 'id' | 'createdAt'>) => {
    const newPhoto: FamilyPhoto = {
      ...photoData,
      id: `pht_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const updated = [newPhoto, ...photos];
    setPhotos(updated);
    StorageService.savePhotos(updated);
    StorageService.logActivity({
      familyId: activeFamilyId,
      actorId: currentUser.id,
      actorName: currentUser.displayName,
      action: 'MENGUNGGAH_FOTO',
      entityType: 'PHOTO',
      entityId: newPhoto.id,
      details: `Mengunggah foto: "${newPhoto.caption || 'Foto baru'}"`
    });
    setActivities(StorageService.getActivityLogs(activeFamilyId));
  };

  // Handle adding document
  const handleAddDocument = (docData: Omit<FamilyDocument, 'id' | 'createdAt'>) => {
    const newDoc: FamilyDocument = {
      ...docData,
      id: `doc_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const updated = [newDoc, ...documents];
    setDocuments(updated);
    StorageService.saveDocuments(updated);
    StorageService.logActivity({
      familyId: activeFamilyId,
      actorId: currentUser.id,
      actorName: currentUser.displayName,
      action: 'MENGUNGGAH_DOKUMEN',
      entityType: 'DOCUMENT',
      entityId: newDoc.id,
      details: `Mengunggah arsip dokumen: "${newDoc.title}"`
    });
    setActivities(StorageService.getActivityLogs(activeFamilyId));
  };

  // Handle adding event
  const handleAddEvent = (evtData: Omit<FamilyEvent, 'id' | 'createdAt'>) => {
    const newEvt: FamilyEvent = {
      ...evtData,
      id: `evt_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const updated = [...events, newEvt];
    setEvents(updated);
    StorageService.saveEvents(updated);
    StorageService.logActivity({
      familyId: activeFamilyId,
      actorId: currentUser.id,
      actorName: currentUser.displayName,
      action: 'MENAMBAHKAN_ACARA',
      entityType: 'EVENT',
      entityId: newEvt.id,
      details: `Menjadwalkan acara: "${newEvt.title}" (${newEvt.date})`
    });
    setActivities(StorageService.getActivityLogs(activeFamilyId));
  };

  // Handle adding collaborator
  const handleAddCollaborator = (collab: Collaborator) => {
    const updated = [...collaborators, collab];
    setCollaborators(updated);
    StorageService.saveCollaborators(updated);
    StorageService.logActivity({
      familyId: activeFamilyId,
      actorId: currentUser.id,
      actorName: currentUser.displayName,
      action: 'MENGUNDANG_KOLABORATOR',
      entityType: 'COLLABORATOR',
      details: `Mengundang ${collab.name} sebagai ${collab.role}`
    });
    setActivities(StorageService.getActivityLogs(activeFamilyId));
  };

  // Handle updating role
  const handleUpdateRole = (userId: string, newRole: any) => {
    const updated = collaborators.map(c => c.userId === userId ? { ...c, role: newRole } : c);
    setCollaborators(updated);
    StorageService.saveCollaborators(updated);
  };

  // Handle onboarding complete
  const handleOnboardingComplete = (data: {
    family: FamilySpace;
    selfMember: FamilyMember;
    parents?: FamilyMember[];
    spouse?: FamilyMember;
    children?: FamilyMember[];
  }) => {
    const updatedFamilies = [...families, data.family];
    setFamilies(updatedFamilies);
    StorageService.saveFamilies(updatedFamilies);
    setActiveFamilyId(data.family.id);

    const allNewMembers = [
      data.selfMember,
      ...(data.parents || []),
      ...(data.spouse ? [data.spouse] : []),
      ...(data.children || [])
    ];
    setMembers(allNewMembers);
    StorageService.saveMembers(allNewMembers);

    const allNewRels: Relationship[] = [];
    if (data.parents) {
      data.parents.forEach(p => {
        allNewRels.push({
          id: `rel_${Date.now()}_${Math.random()}`,
          familyId: data.family.id,
          personAId: p.id,
          personBId: data.selfMember.id,
          type: 'BIOLOGICAL_PARENT',
          createdAt: new Date().toISOString(),
          createdBy: currentUser.id
        });
      });
      if (data.parents.length === 2) {
        allNewRels.push({
          id: `rel_${Date.now()}_marr`,
          familyId: data.family.id,
          personAId: data.parents[0].id,
          personBId: data.parents[1].id,
          type: 'SPOUSE',
          status: 'MENIKAH',
          createdAt: new Date().toISOString(),
          createdBy: currentUser.id
        });
      }
    }
    if (data.spouse) {
      allNewRels.push({
        id: `rel_${Date.now()}_spouse`,
        familyId: data.family.id,
        personAId: data.selfMember.id,
        personBId: data.spouse.id,
        type: 'SPOUSE',
        status: 'MENIKAH',
        createdAt: new Date().toISOString(),
        createdBy: currentUser.id
      });
    }
    if (data.children) {
      data.children.forEach(c => {
        allNewRels.push({
          id: `rel_${Date.now()}_child_${c.id}`,
          familyId: data.family.id,
          personAId: data.selfMember.id,
          personBId: c.id,
          type: 'BIOLOGICAL_PARENT',
          createdAt: new Date().toISOString(),
          createdBy: currentUser.id
        });
      });
    }
    setRelationships(allNewRels);
    StorageService.saveRelationships(allNewRels);

    setViewState('app');
    setCurrentTab('silsilah');
    setSelectedMember(data.selfMember);
  };

  // Reset all data to seed
  const handleResetData = () => {
    StorageService.resetToDefaultData();
    setFamilies(StorageService.getFamilies());
    setActiveFamilyId(StorageService.getActiveFamilyId());
    setMembers(StorageService.getMembers(StorageService.getActiveFamilyId()));
    setRelationships(StorageService.getRelationships(StorageService.getActiveFamilyId()));
    setMemories(StorageService.getMemories(StorageService.getActiveFamilyId()));
    setPhotos(StorageService.getPhotos(StorageService.getActiveFamilyId()));
    setAlbums(StorageService.getAlbums(StorageService.getActiveFamilyId()));
    setDocuments(StorageService.getDocuments(StorageService.getActiveFamilyId()));
    setEvents(StorageService.getEvents(StorageService.getActiveFamilyId()));
    setCollaborators(StorageService.getCollaborators(StorageService.getActiveFamilyId()));
    setActivities(StorageService.getActivityLogs(StorageService.getActiveFamilyId()));
    setSelectedMember(null);
    setFullProfileMemberId(null);
  };

  // 1. LANDING PAGE VIEW
  if (viewState === 'landing') {
    return (
      <LandingPage
        onEnterApp={() => setViewState('app')}
        onOpenLogin={() => {
          setAuthMode('login');
          setViewState('auth');
        }}
        onOpenRegister={() => {
          setAuthMode('register');
          setViewState('auth');
        }}
      />
    );
  }

  // 2. AUTHENTICATION PAGES VIEW
  if (viewState === 'auth') {
    return (
      <AuthPages
        initialView={authMode}
        onSuccess={(user, isNewUser) => {
          setCurrentUser(user);
          StorageService.setUser(user);
          if (isNewUser) {
            setViewState('onboarding');
          } else {
            setViewState('app');
          }
        }}
        onBackToLanding={() => setViewState('landing')}
      />
    );
  }

  // 3. ONBOARDING WIZARD VIEW
  if (viewState === 'onboarding') {
    return (
      <OnboardingWizard
        currentUser={currentUser}
        onComplete={handleOnboardingComplete}
        onSkipToTree={() => {
          setViewState('app');
          setCurrentTab('silsilah');
        }}
      />
    );
  }

  // Full Member Profile view
  const profileMember = fullProfileMemberId
    ? members.find(m => m.id === fullProfileMemberId)
    : null;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F8F7F3] text-[#1C1917] selection:bg-[#2D5A46] selection:text-white font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setFullProfileMemberId(null);
            if (tab === 'bantuan') {
              setShowHelpModal(true);
            } else {
              setCurrentTab(tab);
            }
          }}
          families={families}
          activeFamily={activeFamily}
          onSelectFamily={handleSelectFamily}
          onOpenCreateFamilyModal={() => setShowCreateFamilyModal(true)}
          currentUser={currentUser}
          onLogout={() => setViewState('landing')}
        />
      </div>

      {/* Main App Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          currentFamily={activeFamily}
          currentUser={currentUser}
          onOpenSearchModal={() => setShowSearchModal(true)}
          onOpenAddMemberModal={() => {
            setAddMemberContext({});
            setShowAddMemberModal(true);
          }}
          onOpenShareModal={() => setShowShareModal(true)}
          onOpenMobileMenu={() => setShowMobileSidebar(true)}
          onNavigateLanding={() => setViewState('landing')}
          onNavigateTree={() => {
            setFullProfileMemberId(null);
            setCurrentTab('silsilah');
          }}
        />

        {/* View Routing */}
        <main className="flex-1 overflow-y-auto pb-16 lg:pb-0 relative">
          {/* Individual Full Profile Page */}
          {profileMember ? (
            <MemberProfilePage
              member={profileMember}
              allMembers={members}
              relationships={relationships}
              memories={memories}
              photos={photos}
              documents={documents}
              onBack={() => setFullProfileMemberId(null)}
              onSelectMember={(m) => setFullProfileMemberId(m.id)}
              onOpenEditModal={(m) => {
                setAddMemberContext({ targetMember: m });
                setShowAddMemberModal(true);
              }}
              onOpenAddRelModal={(type, target) => {
                setAddMemberContext({ relContext: type, targetMember: target });
                setShowAddMemberModal(true);
              }}
              onOpenAiStoryModal={(m) => {
                setAiStoryTargetMember(m);
                setShowAiStoryModal(true);
              }}
            />
          ) : currentTab === 'beranda' ? (
            <FamilyDashboard
              family={activeFamily}
              currentUser={currentUser}
              members={members}
              events={events}
              memories={memories}
              photos={photos}
              documents={documents}
              activities={activities}
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onSelectMember={(m) => {
                setSelectedMember(m);
                setCurrentTab('silsilah');
              }}
              onOpenAddMemberModal={() => {
                setAddMemberContext({});
                setShowAddMemberModal(true);
              }}
              onOpenSearchModal={() => setShowSearchModal(true)}
              onOpenInterviewModal={() => setShowInterviewModal(true)}
            />
          ) : currentTab === 'silsilah' ? (
            <div className="relative h-full w-full">
              <FamilyTreeCanvas
                members={members}
                relationships={relationships}
                currentUserId={currentUser.id}
                selectedMember={selectedMember}
                onSelectMember={(m) => setSelectedMember(m)}
                onOpenSearchModal={() => setShowSearchModal(true)}
                onExportImage={() => setShowShareModal(true)}
              />

              {/* Right Side Member Detail Drawer */}
              {selectedMember && (
                <MemberDetailDrawer
                  member={selectedMember}
                  allMembers={members}
                  relationships={relationships}
                  currentUserId={currentUser.id}
                  onClose={() => setSelectedMember(null)}
                  onSelectMember={(m) => setSelectedMember(m)}
                  onOpenAddModal={(type, target) => {
                    setAddMemberContext({ relContext: type, targetMember: target });
                    setShowAddMemberModal(true);
                  }}
                  onOpenEditModal={(m) => {
                    setAddMemberContext({ targetMember: m });
                    setShowAddMemberModal(true);
                  }}
                  onOpenAiStoryModal={(m) => {
                    setAiStoryTargetMember(m);
                    setShowAiStoryModal(true);
                  }}
                  onNavigateToFullProfile={(memberId) => setFullProfileMemberId(memberId)}
                />
              )}
            </div>
          ) : currentTab === 'anggota' ? (
            <MemberDirectory
              members={members}
              onSelectMember={(m) => {
                setSelectedMember(m);
                setCurrentTab('silsilah');
              }}
              onOpenAddModal={() => {
                setAddMemberContext({});
                setShowAddMemberModal(true);
              }}
              onNavigateToFullProfile={(memberId) => setFullProfileMemberId(memberId)}
            />
          ) : currentTab === 'timeline' ? (
            <FamilyTimeline
              members={members}
              relationships={relationships}
              events={events}
              memories={memories}
            />
          ) : currentTab === 'kenangan' ? (
            <FamilyMemories
              memories={memories}
              members={members}
              onAddMemory={handleAddMemory}
            />
          ) : currentTab === 'galeri' ? (
            <PhotoGallery
              photos={photos}
              albums={albums}
              members={members}
              onAddPhoto={handleAddPhoto}
              onAddAlbum={(alb) => {
                const newAlb: FamilyAlbum = {
                  ...alb,
                  id: `alb_${Date.now()}`,
                  createdAt: new Date().toISOString()
                };
                const updated = [...albums, newAlb];
                setAlbums(updated);
                StorageService.saveAlbums(updated);
              }}
            />
          ) : currentTab === 'dokumen' ? (
            <HistoricalDocuments
              documents={documents}
              members={members}
              onAddDocument={handleAddDocument}
            />
          ) : currentTab === 'acara' ? (
            <FamilyEventsCalendar
              events={events}
              members={members}
              onAddEvent={handleAddEvent}
            />
          ) : currentTab === 'statistik' ? (
            <FamilyStatistics
              members={members}
              relationships={relationships}
            />
          ) : currentTab === 'kolaborator' ? (
            <CollaboratorsManager
              collaborators={collaborators}
              members={members}
              family={activeFamily}
              onAddCollaborator={handleAddCollaborator}
              onUpdateRole={handleUpdateRole}
            />
          ) : currentTab === 'pengaturan' ? (
            <SettingsPage
              currentUser={currentUser}
              activeFamily={activeFamily}
              members={members}
              relationships={relationships}
              onUpdateFamily={(updated) => {
                const updatedFamilies = families.map(f => f.id === updated.id ? updated : f);
                setFamilies(updatedFamilies);
                StorageService.saveFamilies(updatedFamilies);
              }}
              onUpdateUser={(updated) => {
                setCurrentUser(updated);
                StorageService.setUser(updated);
              }}
              onImportMembers={(imported) => {
                const newFullMembers: FamilyMember[] = imported.map((im, idx) => ({
                  id: im.id || `imported_${Date.now()}_${idx}`,
                  familyId: activeFamilyId,
                  firstName: im.firstName || 'Tanpa Nama',
                  middleName: im.middleName,
                  lastName: im.lastName,
                  nickname: im.nickname,
                  gender: im.gender || 'male',
                  birthDate: im.birthDate,
                  birthPlace: im.birthPlace,
                  deathDate: im.deathDate,
                  deathPlace: im.deathPlace,
                  isLiving: im.isLiving ?? !im.deathDate,
                  biography: im.biography,
                  occupation: im.occupation,
                  privacyLevel: 'FAMILY',
                  generation: im.generation || 1,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  createdBy: currentUser.id
                }));
                const updated = [...members, ...newFullMembers];
                setMembers(updated);
                StorageService.saveMembers(updated);
              }}
              onResetData={handleResetData}
            />
          ) : null}
        </main>

        {/* Mobile Navigation */}
        <MobileNav
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setFullProfileMemberId(null);
            if (tab === 'bantuan') {
              setShowHelpModal(true);
            } else {
              setCurrentTab(tab);
            }
          }}
        />
      </div>

      {/* Global Modals */}
      <RelationshipSearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        members={members}
        relationships={relationships}
        currentUserId={currentUser.id}
      />

      <AddMemberModal
        isOpen={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        familyId={activeFamilyId}
        targetMember={addMemberContext.targetMember}
        relationshipContext={addMemberContext.relContext}
        existingMembers={members}
        onSaveMember={handleSaveMember}
      />

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        family={activeFamily}
        selectedMember={selectedMember}
      />

      {aiStoryTargetMember && (
        <AiStoryModal
          isOpen={showAiStoryModal}
          onClose={() => setShowAiStoryModal(false)}
          member={aiStoryTargetMember}
          allMembers={members}
          relationships={relationships}
          onSaveStory={handleSaveAiBiography}
        />
      )}

      <InterviewAssistantModal
        isOpen={showInterviewModal}
        onClose={() => setShowInterviewModal(false)}
      />

      <CreateFamilyModal
        isOpen={showCreateFamilyModal}
        onClose={() => setShowCreateFamilyModal(false)}
        currentUser={currentUser}
        onCreateFamily={handleCreateFamily}
      />

      <HelpFaqModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />
    </div>
  );
}
