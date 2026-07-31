import { AnimalSpecies, Mission, PresentationItem, UserProfile } from '../types';

export const INITIAL_ANIMAL_SPECIES: AnimalSpecies[] = [
  {
    id: 'dog',
    name: '강아지',
    emoji: '🐶',
    description: '충성스럽고 주인을 잘 따르는 귀여운 방주 강아지입니다.',
    price: 10,
    soundText: '멍멍! 멍멍! 🐾',
    color: '#D97706'
  },
  {
    id: 'cat',
    name: '고양이',
    emoji: '🐱',
    description: '방주 창가 햇살 아래서 골골송을 부르는 아늑한 고양이입니다.',
    price: 10,
    soundText: '야옹~ 야옹~ 🐾',
    color: '#F59E0B'
  },
  {
    id: 'bear',
    name: '곰',
    emoji: '🐻',
    description: '꿀과 과일을 좋아하는 듬직하고 포근한 방주 곰입니다.',
    price: 10,
    soundText: '크앙! (주님 은혜 감사해요!) 🍯',
    color: '#92400E'
  },
  {
    id: 'tiger',
    name: '호랑이',
    emoji: '🐯',
    description: '유다 지파의 사자처럼 씩씩하고 위풍당당한 방주 호랑이입니다.',
    price: 10,
    soundText: '어흥! 방주 파수꾼 등장! 🐅',
    color: '#EA580C'
  },
  {
    id: 'pig',
    name: '돼지',
    emoji: '🐷',
    description: '항상 밝은 미소로 방주의 웃음을 책임지는 핑크 돼지입니다.',
    price: 10,
    soundText: '꿀꿀! 맛있는 식사 시간이 기다려져요! 🌾',
    color: '#EC4899'
  },
  {
    id: 'cow',
    name: '소',
    emoji: '🐮',
    description: '묵묵히 일을 도우며 온순하고 성실한 성품을 지닌 소입니다.',
    price: 10,
    soundText: '음메~ 평안한 하루 되세요! 🐮',
    color: '#78350F'
  },
  {
    id: 'rabbit',
    name: '토끼',
    emoji: '🐰',
    description: '방주 안 짚단 위를 깡총깡총 뛰어 다니는 순수한 토끼입니다.',
    price: 10,
    soundText: '깡총깡총! 말씀 듣기 참 좋아요! 🥕',
    color: '#F43F5E'
  },
  {
    id: 'sparrow',
    name: '참새',
    emoji: '🐦',
    description: '하나님께서 들풀과 함께 하나도 잊지 않으시는 방주 참새입니다.',
    price: 10,
    soundText: '짹짹! 기쁜 찬양을 불러요~ 🕊️',
    color: '#0284C7'
  }
];

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'presentation',
    title: '1주제 발표하기',
    rewardOlives: 2,
    description: '발표축제 주제 중 하나를 골라 은혜롭게 발표를 합니다.',
    iconName: 'Mic',
    isDailyLimit: false
  },
  {
    id: 'evaluation',
    title: '1주제 평가하기',
    rewardOlives: 5,
    description: '발표축제 주제 중 하나를 골라 평가를 받습니다.',
    iconName: 'CheckSquare',
    isDailyLimit: false
  },
  {
    id: 'listening',
    title: '1주제 청취하기',
    rewardOlives: 1,
    description: '식구의 발표를 들으며 은혜를 받습니다. (평가자 포함)',
    iconName: 'Headphones',
    isDailyLimit: false
  },
  {
    id: 'evangelism',
    title: '사거리 전도',
    rewardOlives: 2,
    description: '사거리 전도를 진행합니다. (1일 1회 제한)',
    iconName: 'MapPin',
    isDailyLimit: true
  },
  {
    id: 'online_mission',
    title: '온라인 선교',
    rewardOlives: 1,
    description: '영상 컨텐츠나 watv 웹사이트 컨텐츠를 하루 30분 이상 시청합니다. (1일 1회 제한)',
    iconName: 'Share2',
    isDailyLimit: true
  }
];

export const INITIAL_PROFILE: UserProfile = {
  name: '방주지기 노아',
  oneLiner: '말씀으로 방주를 세우고 사랑으로 동물들을 돌봅니다 🕊️',
  avatarUrl: '',
  todayStatus: '기쁨과 감사 🌿',
  visitedCount: 158,
  todayCount: 12
};

export const INITIAL_STATS = {
  olives: 0,
  presentationCount: 0,
  listeningCount: 0,
};

export const INITIAL_PURCHASED_ANIMALS: {
  id: string;
  speciesId: 'dog' | 'cat' | 'bear' | 'tiger' | 'pig' | 'cow' | 'rabbit' | 'sparrow';
  customName: string;
  gender: 'male' | 'female';
  purchasedAt: string;
  x: number;
  y: number;
}[] = [];


export const SAMPLE_PRESENTATIONS: PresentationItem[] = [
  {
    id: 'p1',
    title: '노아의 방주와 순종의 신앙',
    speaker: '김믿음 강사',
    scripture: '창세기 6:13-22',
    summary: '비가 내리지 않던 시기, 사람들의 조롱 속에서도 하나님 말씀을 100% 순종하여 방주를 예비한 노아의 믿음을 배웁니다.',
    audioDurationSeconds: 45,
    points: [
      '방주 건축의 정확한 규격과 준비 과정',
      '의인 노아의 순종과 세상과의 구별됨',
      '하나님의 언약과 올리브 가지를 물어온 비둘기의 희망'
    ]
  },
  {
    id: 'p2',
    title: '선한 목자와 방주 안의 평안',
    speaker: '박은혜 간사',
    scripture: '요한복음 10:11-15',
    summary: '방주에 들어온 수많은 동물들을 하나하나 돌보듯, 우리를 이름으로 부르시고 지키시는 주님의 보호를 묵상합니다.',
    audioDurationSeconds: 60,
    points: [
      '음성을 아는 양과 선한 목자의 관계',
      '구원의 문이 되신 예수 그리스도',
      '풍성한 꼴을 얻는 삶'
    ]
  },
  {
    id: 'p3',
    title: '로마서 - 오직 의인은 믿음으로',
    speaker: '이소망 목사',
    scripture: '로마서 1:16-17',
    summary: '복음은 모든 믿는 자에게 구원을 주시는 하나님의 능력임을 선포하며 세상 속 빛이 되는 구원관을 나눕니다.',
    audioDurationSeconds: 50,
    points: [
      '복음을 부끄러워하지 않는 담대함',
      '하나님의 의와 십자가의 은혜',
      '믿음에서 믿음으로 이르는 축복'
    ]
  }
];