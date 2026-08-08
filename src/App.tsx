import React, { useState } from 'react';
import {
  UserProfile,
  AppStats,
  PurchasedAnimal,
  AnimalType,
  Gender,
  MissionType,
  UserAccount,
} from './types';
import {
  INITIAL_ANIMAL_SPECIES,
  INITIAL_MISSIONS,
  INITIAL_PROFILE,
  INITIAL_PURCHASED_ANIMALS,
} from './data/initialData';
import { saveSingleAccount } from './lib/authStorage';
import { CyworldHeader } from './components/CyworldHeader';
import { ProfilePanel } from './components/ProfilePanel';
import { TopRightStatsBox } from './components/TopRightStatsBox';
import { TabsNavigation, TabType } from './components/TabsNavigation';
import { ArkHomeView } from './components/ArkHomeView';
import { MissionsView } from './components/MissionsView';
import { ShopView } from './components/ShopView';
import { FestivalModal } from './components/FestivalModal';
import { AnimalDetailModal } from './components/AnimalDetailModal';
import { LoginModal } from './components/LoginModal';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { RankingView } from './components/RankingView';
import { audioManager } from './lib/audio';

export default function App() {
  // 1) Active Account & Auth State — 새로고침하면 항상 null로 시작 (재로그인 요구)
  const [currentAccount, setCurrentAccount] = useState<UserAccount | null>(null);

  // Password Change Modal for Default "1234" Password Users
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);

  // Admin Dashboard Modal
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  // 2) Profile State synced with active account
  const profile: UserProfile = currentAccount
    ? currentAccount.profile
    : INITIAL_PROFILE;

  // 3) Stats State synced with active account
  const stats: AppStats = currentAccount
    ? currentAccount.stats
    : { olives: 20, presentationCount: 1, listeningCount: 2 };

  // 4) Purchased Animals State synced with active account
  const purchasedAnimals: PurchasedAnimal[] = currentAccount
    ? currentAccount.purchasedAnimals
    : INITIAL_PURCHASED_ANIMALS;

  // 5) Tab Navigation
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // 6) Audio Playing
  const [isBgmPlaying, setIsBgmPlaying] = useState(false);

  // 7) Modals
  const [isFestivalModalOpen, setIsFestivalModalOpen] = useState(false);
  const [selectedAnimalForDetail, setSelectedAnimalForDetail] = useState<PurchasedAnimal | null>(null);

  // Helper to persist currentAccount state updates (Supabase에 비동기 저장)
  const updateCurrentAccountState = (updater: (prev: UserAccount) => UserAccount) => {
    if (!currentAccount) return;
    const updated = updater(currentAccount);
    setCurrentAccount(updated); // 화면은 즉시 반영
    saveSingleAccount(updated).catch((err) => {
      console.error('저장 실패', err);
    });
  };

  // Handle Login Success
  const handleLoginSuccess = (acc: UserAccount) => {
    setCurrentAccount(acc);

    // If default password "1234" and not admin, prompt password change
    if (acc.isDefaultPassword && !acc.isAdmin) {
      setShowPasswordChangeModal(true);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    audioManager.playClick();
    setCurrentAccount(null);
    setShowPasswordChangeModal(false);
    setIsAdminDashboardOpen(false);
  };

  // Update Minihompy Title
  const handleUpdateTitle = (newTitle: string) => {
    updateCurrentAccountState((prev) => ({
      ...prev,
      minihompyTitle: newTitle,
    }));
  };

  // Update Profile
  const handleUpdateProfile = (newProfile: UserProfile) => {
    updateCurrentAccountState((prev) => ({
      ...prev,
      profile: newProfile,
    }));
  };

  // Handle Reward Claim from Missions
  const handleRewardClaim = (missionType: MissionType, rewardOlives: number) => {
    const todayStr = new Date().toISOString().split('T')[0];

    updateCurrentAccountState((prev) => {
      const nextStats = {
        ...prev.stats,
        olives: prev.stats.olives + rewardOlives,
      };

      if (missionType === 'presentation') {
        nextStats.presentationCount = prev.stats.presentationCount + 1;
      } else if (missionType === 'listening') {
        nextStats.listeningCount = prev.stats.listeningCount + 1;
      } else if (missionType === 'evangelism') {
        nextStats.lastEvangelismDate = todayStr;
      } else if (missionType === 'online_mission') {
        nextStats.lastOnlineMissionDate = todayStr;
      }

      return {
        ...prev,
        stats: nextStats,
      };
    });
  };

  // Handle Adopting Animal from Shop
  const handleAdoptAnimal = (speciesId: AnimalType, gender: Gender, customName: string): boolean => {
    if (!currentAccount || currentAccount.stats.olives < 10) return false;

    const randomX = Math.floor(Math.random() * 55) + 15;
    const randomY = Math.floor(Math.random() * 35) + 35;

    const newAnimal: PurchasedAnimal = {
      id: `animal-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      speciesId,
      customName,
      gender,
      purchasedAt: new Date().toISOString(),
      x: randomX,
      y: randomY,
    };

    updateCurrentAccountState((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        olives: prev.stats.olives - 10,
      },
      purchasedAnimals: [...prev.purchasedAnimals, newAnimal],
    }));

    return true;
  };

  // Update animal position
  const handleUpdateAnimalPosition = (id: string, x: number, y: number) => {
    updateCurrentAccountState((prev) => ({
      ...prev,
      purchasedAnimals: prev.purchasedAnimals.map((a) => (a.id === id ? { ...a, x, y } : a)),
    }));
  };

  // Rename animal
  const handleRenameAnimal = (id: string, newName: string) => {
    updateCurrentAccountState((prev) => ({
      ...prev,
      purchasedAnimals: prev.purchasedAnimals.map((a) => (a.id === id ? { ...a, customName: newName } : a)),
    }));
  };

  // Release animal
  const handleReleaseAnimal = (id: string) => {
    updateCurrentAccountState((prev) => ({
      ...prev,
      purchasedAnimals: prev.purchasedAnimals.filter((a) => a.id !== id),
    }));
  };

  // Feed all animals
  const handleFeedAllAnimals = () => {
    updateCurrentAccountState((prev) => ({
      ...prev,
      purchasedAnimals: prev.purchasedAnimals.map((a) => ({ ...a, isFeeding: true })),
    }));
  };

  const selectedSpecies = selectedAnimalForDetail
    ? INITIAL_ANIMAL_SPECIES.find((s) => s.id === selectedAnimalForDetail.speciesId)
    : null;

  return (
    <div className="min-h-screen bg-[#9FC4D0] p-2 sm:p-4 md:p-6 flex flex-col items-center justify-center font-sans select-none text-slate-800">
      {/* 1) Login Overlay Gate */}
      {!currentAccount && (
        <LoginModal onLoginSuccess={handleLoginSuccess} />
      )}

      {/* Outer Desk Container */}
      <div className="w-full max-w-5xl bg-[#83B0C0] p-3 sm:p-5 rounded-2xl border-[1.5px] border-[#779CB0] shadow-2xl relative">
        {/* Main Cyworld Minihompy Outer Frame */}
        <div className="bg-[#FFFFFF] rounded-xl border-[1.5px] border-[#779CB0] p-2.5 sm:p-4 shadow-xl flex flex-col min-h-[640px] relative">
          
          {/* Header Bar */}
          <CyworldHeader
            isBgmPlaying={isBgmPlaying}
            setIsBgmPlaying={setIsBgmPlaying}
            visitedCount={profile.visitedCount}
            todayCount={profile.todayCount}
            onOpenFestivalModal={() => setIsFestivalModalOpen(true)}
            minihompyTitle={currentAccount ? currentAccount.minihompyTitle : `${profile.name}의 방주 타고`}
            onUpdateTitle={handleUpdateTitle}
            username={currentAccount ? currentAccount.username : profile.name}
            isAdmin={currentAccount?.isAdmin}
            onLogout={handleLogout}
            onOpenAdminPanel={() => setIsAdminDashboardOpen(true)}
          />

          {/* Minihompy Inside Notebook Body */}
          <div className="mt-3 flex-1 flex flex-col md:flex-row gap-3.5 relative">
            
            <div className="w-full md:w-52 shrink-0 flex flex-col gap-3">
              <ProfilePanel
                profile={profile}
                onUpdateProfile={handleUpdateProfile}
              />
              <TopRightStatsBox
                stats={stats}
                animalCount={purchasedAnimals.length}
                onOpenFestivalModal={() => setIsFestivalModalOpen(true)}
              />
            </div>

            <div className="flex-1 flex flex-col min-w-0">
              <div className="flex-1 min-h-[440px] flex flex-col">
                {activeTab === 'home' && (
                  <ArkHomeView
                    purchasedAnimals={purchasedAnimals}
                    speciesList={INITIAL_ANIMAL_SPECIES}
                    onUpdateAnimalPosition={handleUpdateAnimalPosition}
                    onSelectAnimal={(animal) => setSelectedAnimalForDetail(animal)}
                    onGoToShop={() => setActiveTab('shop')}
                    onFeedAllAnimals={handleFeedAllAnimals}
                  />
                )}

                {activeTab === 'missions' && (
                  <MissionsView
                    missions={INITIAL_MISSIONS}
                    stats={stats}
                    onRewardClaim={handleRewardClaim}
                  />
                )}

                {activeTab === 'shop' && (
                  <ShopView
                    speciesList={INITIAL_ANIMAL_SPECIES}
                    userOlives={stats.olives}
                    onAdoptAnimal={handleAdoptAnimal}
                    onGoToMissions={() => setActiveTab('missions')}
                    onGoToHome={() => setActiveTab('home')}
                  />
                )}

                {activeTab === 'ranking' && (
                  <RankingView />
                )}
              </div>
            </div>

            <div className="flex md:flex-col justify-start shrink-0">
              <TabsNavigation
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </div>
          </div>

          {/* Minihompy Footer */}
          <div className="mt-3 pt-2 border-t border-[#D0E2EC] text-center text-[11px] text-[#55788A] font-serif flex items-center justify-between px-2">
            <span>ⓒ 2026 방주 타고 (Bang-joo Ta-go) - GEOMETRIC BALANCE EDITION</span>
            <span className="text-[#0086B3] font-sans font-medium hidden sm:inline">minihome.ark/noah_ark</span>
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}
      {showPasswordChangeModal && currentAccount && (
        <ChangePasswordModal
          account={currentAccount}
          onPasswordChanged={(updated) => {
            setCurrentAccount(updated);
            setShowPasswordChangeModal(false);
          }}
          onSkip={() => setShowPasswordChangeModal(false)}
        />
      )}

      {isAdminDashboardOpen && (
        <AdminDashboardModal
          onClose={() => setIsAdminDashboardOpen(false)}
          onSelectUserToView={(accountToView) => {
            setCurrentAccount(accountToView);
            setIsAdminDashboardOpen(false);
          }}
        />
      )}

      {isFestivalModalOpen && (
        <FestivalModal
          onClose={() => setIsFestivalModalOpen(false)}
          onGoToMissions={() => setActiveTab('missions')}
        />
      )}

      {selectedAnimalForDetail && selectedSpecies && (
        <AnimalDetailModal
          animal={selectedAnimalForDetail}
          species={selectedSpecies}
          onClose={() => setSelectedAnimalForDetail(null)}
          onRename={handleRenameAnimal}
          onRelease={handleReleaseAnimal}
          onFeed={handleFeedAllAnimals}
        />
      )}
    </div>
  );
}