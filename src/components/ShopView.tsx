import React, { useState } from 'react';
import { AnimalSpecies, AnimalType, Gender } from '../types';
import { ShoppingBag, Sparkles, Heart, AlertCircle, CheckCircle2 } from 'lucide-react';
import { audioManager } from '../lib/audio';

interface ShopViewProps {
  speciesList: AnimalSpecies[];
  userOlives: number;
  onAdoptAnimal: (speciesId: AnimalType, gender: Gender, customName: string) => boolean;
  onGoToMissions: () => void;
  onGoToHome: () => void;
}

export const ShopView: React.FC<ShopViewProps> = ({
  speciesList,
  userOlives,
  onAdoptAnimal,
  onGoToMissions,
  onGoToHome,
}) => {
  const [selectedGenders, setSelectedGenders] = useState<{ [key in AnimalType]?: Gender }>({});
  const [customNames, setCustomNames] = useState<{ [key in AnimalType]?: string }>({});
  const [adoptedModal, setAdoptedModal] = useState<{ speciesName: string; emoji: string; gender: Gender; name: string } | null>(null);

  const getGender = (speciesId: AnimalType): Gender => {
    return selectedGenders[speciesId] || 'female';
  };

  const getCustomName = (species: AnimalSpecies): string => {
    if (customNames[species.id] !== undefined) {
      return customNames[species.id]!;
    }
    return species.name;
  };

  const handleGenderChange = (speciesId: AnimalType, gender: Gender) => {
    audioManager.playClick();
    setSelectedGenders((prev) => ({ ...prev, [speciesId]: gender }));
  };

  const handleNameChange = (speciesId: AnimalType, name: string) => {
    setCustomNames((prev) => ({ ...prev, [speciesId]: name }));
  };

  const handleBuy = (species: AnimalSpecies) => {
    if (userOlives < 10) {
      alert(`그린올리브가 부족합니다! (현재: ${userOlives}알 / 필요: 10알)\n[미션] 탭에서 미션을 수행하고 올리브를 모아보세요! 🫒`);
      return;
    }

    const gender = getGender(species.id);
    const customName = getCustomName(species).trim() || species.name;

    const success = onAdoptAnimal(species.id, gender, customName);
    if (success) {
      audioManager.playFanfare();
      setAdoptedModal({
        speciesName: species.name,
        emoji: species.emoji,
        gender,
        name: customName,
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F4F8FA] rounded-lg border-[1.5px] border-[#779CB0] p-3.5 font-sans shadow-xs overflow-y-auto">
      {/* Header Banner */}
      <div className="bg-[#0086B3] text-white p-3 rounded-md shadow-xs mb-3 flex items-center justify-between border-b border-[#006A8E]">
        <div>
          <h2 className="font-bold text-sm flex items-center gap-1.5 text-amber-200">
            <ShoppingBag className="w-4 h-4 text-amber-300" />
            <span>넓은 들판 동산 (동물 분양 상점)</span>
          </h2>
          <p className="text-[11px] text-sky-100 mt-0.5">
            암컷(♀)과 수컷(♂)을 고르고 예쁜 이름을 지어 방주에 데려오세요!
          </p>
        </div>
        <div className="bg-black/20 border border-white/30 px-3 py-1 rounded-full text-xs text-amber-200 font-bold flex items-center gap-1 font-mono">
          <span>보유 올리브:</span>
          <strong className="text-amber-200 text-sm">{userOlives}</strong>
          <span>알 🫒</span>
        </div>
      </div>

      {/* Price Uniform Notice */}
      <div className="bg-[#E2EEF3] border border-[#779CB0]/50 rounded-md p-2 mb-3 text-xs text-[#0086B3] flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold">
          <Sparkles className="w-4 h-4 text-[#0086B3]" />
          <span>모든 동물 분양가: 균일가 그린올리브 10알 🫒</span>
        </div>
        <button
          onClick={onGoToMissions}
          className="text-[11px] text-[#0086B3] underline font-semibold hover:text-[#006A8E]"
        >
          올리브 모으러 가기 →
        </button>
      </div>

      {/* 8 Animal Species Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {speciesList.map((species) => {
          const currentGender = getGender(species.id);
          const currentName = getCustomName(species);
          const canAfford = userOlives >= 10;

          return (
            <div
              key={species.id}
              className="bg-white border-[1.5px] border-[#779CB0]/50 rounded-xl p-3 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top Emoji & Name & Price */}
                <div className="flex items-start justify-between border-b border-[#779CB0]/30 pb-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="text-4xl bg-[#F4F8FA] p-1.5 rounded-lg border border-[#779CB0]/40 shadow-inner">
                      {species.emoji}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-800">{species.name}</h3>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{species.description}</p>
                    </div>
                  </div>
                  <div className="bg-[#E2EEF3] text-[#0086B3] font-bold text-xs px-2 py-0.5 rounded-full border border-[#779CB0]/40 font-mono whitespace-nowrap">
                    🫒 10알
                  </div>
                </div>

                {/* Gender Toggle Selection */}
                <div className="mb-2">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">성별 선택 (암컷 / 수컷)</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleGenderChange(species.id, 'female')}
                      className={`py-1 px-2 rounded border text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                        currentGender === 'female'
                          ? 'bg-pink-100 text-pink-800 border-pink-400 ring-2 ring-pink-200'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>암컷</span>
                      <span className="text-pink-600 font-extrabold">♀</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleGenderChange(species.id, 'male')}
                      className={`py-1 px-2 rounded border text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                        currentGender === 'male'
                          ? 'bg-blue-100 text-blue-800 border-blue-400 ring-2 ring-blue-200'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>수컷</span>
                      <span className="text-blue-600 font-extrabold">♂</span>
                    </button>
                  </div>
                </div>

                {/* Custom Nickname Input */}
                <div className="mb-3">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">이름 짓기</label>
                  <input
                    type="text"
                    value={currentName}
                    onChange={(e) => handleNameChange(species.id, e.target.value)}
                    placeholder="예쁜 이름을 적어주세요"
                    className="w-full border border-[#779CB0]/50 rounded px-2.5 py-1 text-xs focus:ring-1 focus:ring-[#0086B3] bg-white"
                    maxLength={10}
                  />
                </div>
              </div>

              {/* Adopt Button */}
              <button
                type="button"
                onClick={() => handleBuy(species)}
                className={`w-full py-2 rounded-lg font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 ${
                  canAfford
                    ? 'bg-[#0086B3] hover:bg-[#007399] text-white active:scale-98 cursor-pointer'
                    : 'bg-slate-200 text-slate-500 hover:bg-slate-300 cursor-pointer'
                }`}
              >
                <span>{species.emoji}</span>
                <span>[{currentName}] 분양받기 (10 🫒)</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Adopted Success Modal */}
      {adoptedModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border-4 border-amber-500 shadow-2xl max-w-sm w-full p-5 text-center font-sans space-y-3">
            <div className="text-5xl animate-bounce pt-2">{adoptedModal.emoji}</div>
            <h3 className="font-extrabold text-lg text-amber-950">분양 성공! 🎉</h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              <strong className="text-amber-900 font-bold text-sm">[{adoptedModal.name}]</strong>{' '}
              ({adoptedModal.gender === 'female' ? '암컷 ♀' : '수컷 ♂'})이(가) <br />
              노아의 방주의 새 식구가 되었습니다!
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-xs text-amber-900 italic font-serif">
              "올리브 가지를 입에 물고 방주 안으로 평안히 들어왔습니다 🕊️"
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setAdoptedModal(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-lg text-xs"
              >
                상점에서 더 구경하기
              </button>
              <button
                onClick={() => {
                  setAdoptedModal(null);
                  onGoToHome();
                }}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 rounded-lg text-xs shadow-md"
              >
                방주로 가서 확인 🐾
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
