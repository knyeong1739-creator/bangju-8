import React, { useState, useRef } from 'react';
import { PurchasedAnimal, AnimalSpecies } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, RefreshCw, Heart, Info, Sun, Ship } from 'lucide-react';
import { audioManager } from '../lib/audio';

interface ArkHomeViewProps {
  purchasedAnimals: PurchasedAnimal[];
  speciesList: AnimalSpecies[];
  onUpdateAnimalPosition: (id: string, x: number, y: number) => void;
  onSelectAnimal: (animal: PurchasedAnimal) => void;
  onGoToShop: () => void;
  onFeedAllAnimals: () => void;
}

const SPEECH_BUBBLES = [
  '쏙쏙 쏙쏙 🕊️',
  '연자 맷돌 굴려라 🫒',
  '정교회 건설 🙏',
  '짹짹! 멍멍! 꿀꿀! 🐾',
  '8월 발표축제 아니모! 🎤',
  '사랑과 기쁨이 넘치는 IUBA 경상대센터 💕'
];

export const ArkHomeView: React.FC<ArkHomeViewProps> = ({
  purchasedAnimals,
  speciesList,
  onUpdateAnimalPosition,
  onSelectAnimal,
  onGoToShop,
  onFeedAllAnimals,
}) => {
  const [activeSpeech, setActiveSpeech] = useState<{ [id: string]: string }>({});
  const [showSparkles, setShowSparkles] = useState(false);
  const [heartsEffect, setHeartsEffect] = useState(false);
  const arkContainerRef = useRef<HTMLDivElement>(null);

  const getSpecies = (speciesId: string) => {
    return speciesList.find((s) => s.id === speciesId);
  };

  const handleAnimalClick = (animal: PurchasedAnimal) => {
    audioManager.playAnimalSound(animal.speciesId);
    
    // Trigger random speech bubble
    const randomBubble = SPEECH_BUBBLES[Math.floor(Math.random() * SPEECH_BUBBLES.length)];
    setActiveSpeech((prev) => ({ ...prev, [animal.id]: randomBubble }));

    setTimeout(() => {
      setActiveSpeech((prev) => {
        const next = { ...prev };
        delete next[animal.id];
        return next;
      });
    }, 3000);
  };

  const handleCleanArk = () => {
    audioManager.playFanfare();
    setShowSparkles(true);
    setTimeout(() => setShowSparkles(false), 2000);
  };

  const handleFeedHearts = () => {
    audioManager.playOliveChime();
    setHeartsEffect(true);
    onFeedAllAnimals();
    setTimeout(() => setHeartsEffect(false), 2500);
  };
  
  
  return (
    <div className="flex flex-col h-full bg-[#F4F8FA] rounded-lg border-[1.5px] border-[#779CB0] p-3 font-sans shadow-xs relative overflow-hidden">
      {/* Header Banner */}
      <div className="bg-[#0086B3] text-white px-3 py-1.5 rounded-t-md flex items-center justify-between text-xs mb-2 font-medium border-b border-[#006A8E]">
        <div className="flex items-center gap-1.5 font-bold">
          <Ship className="w-4 h-4 text-amber-200" />
          <span>노아의 방주 미니룸 (ARK ROOM)</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-sky-100">
          <span className="bg-black/20 px-2 py-0.5 rounded font-mono border border-white/20">
            동물 <strong>{purchasedAnimals.length}</strong>마리 살고 있음
          </span>
        </div>
      </div>

      {/* Main Room Canvas Frame */}
      <div className="relative flex-1 border-4 border-[#3E2723] rounded-b-md shadow-2xl overflow-hidden min-h-[340px] md:min-h-[400px]" style={{ background: '#1a0f07' }}>

        {/* 아이소메트릭 ㅅ자 방 SVG 배경 */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 400 340"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="wallPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <rect width="40" height="40" fill="#7A4A28"/>
              <line x1="0" y1="0" x2="40" y2="0" stroke="#5C3317" strokeWidth="1.5" opacity="0.5"/>
              <line x1="0" y1="13" x2="40" y2="13" stroke="#5C3317" strokeWidth="0.5" opacity="0.3"/>
              <line x1="0" y1="27" x2="40" y2="27" stroke="#5C3317" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
            <pattern id="leftWallPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <rect width="40" height="40" fill="#4A2810"/>
              <line x1="0" y1="0" x2="40" y2="0" stroke="#3A1E08" strokeWidth="1.5" opacity="0.5"/>
              <line x1="0" y1="13" x2="40" y2="13" stroke="#3A1E08" strokeWidth="0.5" opacity="0.3"/>
              <line x1="0" y1="27" x2="40" y2="27" stroke="#3A1E08" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
            <pattern id="floorPattern" width="50" height="50" patternUnits="userSpaceOnUse">
              <rect width="50" height="50" fill="#B87830"/>
              <line x1="0" y1="0" x2="50" y2="0" stroke="#8B5320" strokeWidth="2" opacity="0.5"/>
              <line x1="0" y1="25" x2="50" y2="25" stroke="#8B5320" strokeWidth="1" opacity="0.3"/>
              <line x1="0" y1="0" x2="0" y2="50" stroke="#8B5320" strokeWidth="1" opacity="0.2"/>
              <line x1="25" y1="0" x2="25" y2="50" stroke="#8B5320" strokeWidth="0.5" opacity="0.15"/>
            </pattern>
          </defs>

          {/* 뒷벽 (정면 직사각형) */}
          <polygon points="120,50 280,50 280,210 120,210" fill="url(#wallPattern)"/>

          {/* 왼쪽 벽 */}
          <polygon points="0,0 120,50 120,210 0,340" fill="url(#leftWallPattern)"/>

          {/* 오른쪽 벽 */}
          <polygon points="400,0 280,50 280,210 400,340" fill="url(#wallPattern)" opacity="0.8"/>

          {/* 바닥 */}
          <polygon points="0,340 120,210 280,210 400,340" fill="url(#floorPattern)"/>

          {/* 경계선 */}
          <line x1="0" y1="0" x2="120" y2="50" stroke="#3E2723" strokeWidth="3"/>
          <line x1="400" y1="0" x2="280" y2="50" stroke="#3E2723" strokeWidth="3"/>
          <line x1="120" y1="50" x2="280" y2="50" stroke="#3E2723" strokeWidth="3"/>
          <line x1="120" y1="50" x2="120" y2="210" stroke="#3E2723" strokeWidth="3"/>
          <line x1="280" y1="50" x2="280" y2="210" stroke="#3E2723" strokeWidth="3"/>
          <line x1="120" y1="210" x2="280" y2="210" stroke="#3E2723" strokeWidth="3"/>
          <line x1="0" y1="340" x2="120" y2="210" stroke="#3E2723" strokeWidth="3"/>
          <line x1="400" y1="340" x2="280" y2="210" stroke="#3E2723" strokeWidth="3"/>

          {/* 포트홀 - 왼쪽 벽 */}
          <circle cx="48" cy="150" r="28" fill="#4A90D9" stroke="#3E2723" strokeWidth="3"/>
          <line x1="48" y1="122" x2="48" y2="178" stroke="#3E2723" strokeWidth="1.5" opacity="0.5"/>
          <line x1="20" y1="150" x2="76" y2="150" stroke="#3E2723" strokeWidth="1.5" opacity="0.5"/>
          <text x="34" y="143" fontSize="13">☀️</text>
          <text x="32" y="168" fontSize="11">🕊️</text>

          {/* 포트홀 - 오른쪽 벽 */}
          <circle cx="352" cy="150" r="28" fill="#4A90D9" stroke="#3E2723" strokeWidth="3"/>
          <line x1="352" y1="122" x2="352" y2="178" stroke="#3E2723" strokeWidth="1.5" opacity="0.5"/>
          <line x1="324" y1="150" x2="380" y2="150" stroke="#3E2723" strokeWidth="1.5" opacity="0.5"/>
          <text x="338" y="143" fontSize="13">🌊</text>
          <text x="336" y="168" fontSize="11">🕊️</text>

          {/* 소품 */}
          <text x="18" y="318" fontSize="18" opacity="0.6">🌾</text>
          <text x="356" y="318" fontSize="18" opacity="0.6">🫒</text>
        </svg>

        {/* Sparkles / Cleaning Animation Layer */}
        {showSparkles && (
          <div className="absolute inset-0 bg-teal-400/20 backdrop-blur-xs z-30 pointer-events-none flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-white/90 text-teal-900 font-bold px-6 py-3 rounded-xl border-2 border-teal-500 shadow-2xl flex items-center gap-2 text-sm"
            >
              <Sparkles className="w-6 h-6 text-amber-500 animate-spin" />
              <span>방주를 깨끗하게 소독했습니다! ✨</span>
            </motion.div>
          </div>
        )}

        {/* Heart Feeding Effect */}
        {heartsEffect && (
          <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.2, y: 20, opacity: 0 }}
              animate={{ scale: 1.1, y: 0, opacity: 1 }}
              className="bg-pink-500/90 text-white font-bold px-6 py-3 rounded-xl border-2 border-pink-200 shadow-2xl flex items-center gap-2 text-sm"
            >
              <Heart className="w-6 h-6 text-pink-200 fill-pink-200 animate-ping" />
              <span>동물들에게 맛있는 올리브 모이를 나누어 주었습니다! 💕</span>
            </motion.div>
          </div>
        )}

        {/* Animals Render Area */}
        <div ref={arkContainerRef} className="relative w-full h-full min-h-[300px] z-10 p-4">
          {purchasedAnimals.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20">
              <div className="bg-amber-950/85 border-2 border-amber-600/80 rounded-xl p-5 max-w-sm text-amber-100 shadow-2xl backdrop-blur-xs space-y-3">
                <div className="text-4xl animate-bounce">🕊️ 🐾</div>
                <h3 className="font-bold text-sm text-yellow-300">방주에 아직 동물이 없습니다!</h3>
                <p className="text-xs text-amber-200/90 leading-relaxed">
                  미션을 완수하여 모은 그린올리브로 <br />
                  <strong className="text-white font-semibold">[넓은 들판(상점)]</strong>에서 첫 동물 쌍을 분양받아 보세요!
                </p>
                <button
                  onClick={onGoToShop}
                  className="mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-amber-950 font-bold px-4 py-2 rounded-lg text-xs shadow-md transition-all transform hover:scale-105 active:scale-95"
                >
                  동물 분양받으러 가기 🫒
                </button>
              </div>
            </div>
          ) : (
            purchasedAnimals.map((animal) => {
              const species = getSpecies(animal.speciesId);
              if (!species) return null;

              const isFemale = animal.gender === 'female';

              return (
                <motion.div
                  key={`${animal.id}-${animal.x}-${animal.y}`}
                  drag
                  dragConstraints={arkContainerRef}
                  dragMomentum={false}
                  dragElastic={0}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnimalClick(animal)}
                  onDragEnd={(event, _info) => {
                    const container = arkContainerRef.current;
                    if (!container) return;
                    const rect = container.getBoundingClientRect();
                    const clientX = 'clientX' in event ? (event as MouseEvent).clientX : (event as TouchEvent).changedTouches[0].clientX;
                    const clientY = 'clientY' in event ? (event as MouseEvent).clientY : (event as TouchEvent).changedTouches[0].clientY;
                    const newX = (clientX - rect.left) / rect.width * 100;
                    const newY = (clientY - rect.top) / rect.height * 100;
                    onUpdateAnimalPosition(animal.id, Math.min(90, Math.max(2, newX)), Math.min(90, Math.max(2, newY)));
                  }}
                  style={{
                    position: 'absolute',
                    left: `${animal.x}%`,
                    top: `${animal.y}%`,
                    x: 0,
                    y: 0,
                  }}
                  className="cursor-pointer flex flex-col items-center group select-none touch-none"
                >
                  {/* Speech Bubble Popup */}
                  <AnimatePresence>
                    {activeSpeech[animal.id] && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: -5, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.8 }}
                        className="absolute -top-12 z-30 bg-white text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-xl shadow-lg border border-amber-400 whitespace-nowrap"
                      >
                        {activeSpeech[animal.id]}
                        <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-white border-r border-b border-amber-400 rotate-45"></div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Animal Sprite / Emoji with Gender Badge */}
                  <div className="relative">
                    <div className="text-4xl filter drop-shadow-md transition-transform group-hover:scale-110">
                      {species.emoji}
                    </div>

                    {/* Gender Badge */}
                    <span
                      className={`absolute -bottom-1 -right-1 text-[10px] font-bold px-1 rounded-full border shadow-xs ${
                        isFemale
                          ? 'bg-pink-100 text-pink-700 border-pink-300'
                          : 'bg-blue-100 text-blue-700 border-blue-300'
                      }`}
                      title={isFemale ? '암컷 ♀' : '수컷 ♂'}
                    >
                      {isFemale ? '♀' : '♂'}
                    </span>
                  </div>

                  {/* Animal Custom Name Tag */}
                  <div className="mt-1 bg-amber-950/90 text-amber-100 border border-amber-500/60 px-2 py-0.5 rounded-full text-[10px] font-medium shadow whitespace-nowrap flex items-center gap-1 group-hover:bg-amber-800 transition-colors">
                    <span>{animal.customName}</span>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* Ark Bottom Interactive Action Bar */}
      <div className="mt-2 bg-[#E2EEF3] border border-[#779CB0]/50 p-2 rounded-b-md flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={handleFeedHearts}
            className="bg-white hover:bg-slate-50 text-slate-700 font-bold px-2.5 py-1 rounded border border-[#779CB0]/50 flex items-center gap-1 transition-colors shadow-2xs"
          >
            <Heart className="w-3.5 h-3.5 text-[#FF6321] fill-[#FF6321]" />
            <span>모이 주기</span>
          </button>
          <button
            onClick={handleCleanArk}
            className="bg-white hover:bg-slate-50 text-slate-700 font-bold px-2.5 py-1 rounded border border-[#779CB0]/50 flex items-center gap-1 transition-colors shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0086B3]" />
            <span>방주 청소</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-600 italic font-serif flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-[#0086B3]" />
          <span>동물을 클릭하거나 끌어서 위치를 자유롭게 이동할 수 있습니다.</span>
        </div>
      </div>
    </div>
  );
};
