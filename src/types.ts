export type Gender = 'female' | 'male';

export type AnimalType = 
  | 'dog'
  | 'cat'
  | 'bear'
  | 'tiger'
  | 'pig'
  | 'cow'
  | 'rabbit'
  | 'sparrow';

export interface AnimalSpecies {
  id: AnimalType;
  name: string;
  emoji: string;
  description: string;
  price: number; // 10 green olives
  soundText: string;
  defaultPosition?: { x: number; y: number };
  color: string;
}

export interface PurchasedAnimal {
  id: string;
  speciesId: AnimalType;
  customName: string;
  gender: Gender;
  purchasedAt: string; // ISO date string
  x: number; // percentage inside room canvas (0-100)
  y: number; // percentage inside room canvas (0-100)
  isFeeding?: boolean;
}

export type MissionType = 
  | 'presentation'  // 1주제 발표 (2 olives)
  | 'evaluation'    // 1주제 평가 (5 olives)
  | 'listening'     // 1주제 청취 (1 olive)
  | 'evangelism'    // 사거리 전도 (2 olives, daily 1x)
  | 'online_mission';// 온라인 선교 (1 olive, daily 1x)

export interface Mission {
  id: MissionType;
  title: string;
  rewardOlives: number;
  description: string;
  iconName: string;
  isDailyLimit: boolean;
  completedToday?: boolean;
}

export interface UserProfile {
  name: string;
  oneLiner: string;
  avatarUrl: string;
  todayStatus: string;
  visitedCount: number;
  todayCount: number;
}

export interface AppStats {
  olives: number; // 현재 올리브 갯수
  presentationCount: number; // 발표 완료한 횟수
  listeningCount: number; // 발표 청취 횟수
  lastEvangelismDate?: string; // YYYY-MM-DD
  lastOnlineMissionDate?: string; // YYYY-MM-DD
}

export interface PresentationItem {
  id: string;
  title: string;
  speaker: string;
  scripture: string;
  summary: string;
  audioDurationSeconds: number;
  points: string[];
}

export interface UserAccount {
  username: string;
  password: string;
  isDefaultPassword: boolean;
  isAdmin?: boolean;
  minihompyTitle: string;
  createdAt: string;
  profile: UserProfile;
  stats: AppStats;
  purchasedAnimals: PurchasedAnimal[];
}

