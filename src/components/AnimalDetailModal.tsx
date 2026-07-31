import React, { useState } from 'react';
import { PurchasedAnimal, AnimalSpecies } from '../types';
import { Heart, Edit2, Trash2, Volume2, Sparkles } from 'lucide-react';
import { audioManager } from '../lib/audio';

interface AnimalDetailModalProps {
  animal: PurchasedAnimal;
  species: AnimalSpecies;
  onClose: () => void;
  onRename: (id: string, newName: string) => void;
  onRelease: (id: string) => void;
  onFeed: (id: string) => void;
}

export const AnimalDetailModal: React.FC<AnimalDetailModalProps> = ({
  animal,
  species,
  onClose,
  onRename,
  onRelease,
  onFeed,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(animal.customName);
  const [fedHeart, setFedHeart] = useState(false);

  const isFemale = animal.gender === 'female';

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      onRename(animal.id, nameInput.trim());
      setIsEditing(false);
      audioManager.playClick();
    }
  };

  const handleFeedOne = () => {
    audioManager.playOliveChime();
    audioManager.playAnimalSound(animal.speciesId);
    setFedHeart(true);
    onFeed(animal.id);
    setTimeout(() => setFedHeart(false), 2000);
  };

  const handlePlaySound = () => {
    audioManager.playAnimalSound(animal.speciesId);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-[#F4F8FA] rounded-2xl border-[1.5px] border-[#779CB0] shadow-2xl max-w-sm w-full p-5 text-slate-800 space-y-4 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 font-bold text-lg"
        >
          ✕
        </button>

        {/* Animal Visual Box */}
        <div className="flex flex-col items-center text-center pt-2">
          <div className="relative bg-white border-[1.5px] border-[#779CB0] rounded-2xl p-4 shadow-inner w-28 h-28 flex items-center justify-center mb-2">
            <span className="text-6xl filter drop-shadow-md">{species.emoji}</span>
            <span
              className={`absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full border shadow-xs ${
                isFemale
                  ? 'bg-pink-100 text-pink-700 border-pink-300'
                  : 'bg-blue-100 text-blue-700 border-blue-300'
              }`}
            >
              {isFemale ? '암컷 ♀' : '수컷 ♂'}
            </span>

            {fedHeart && (
              <span className="absolute -top-3 text-2xl animate-bounce">
                ❤️
              </span>
            )}
          </div>

          {!isEditing ? (
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-lg text-[#0086B3]">{animal.customName}</h3>
              <button
                onClick={() => setIsEditing(true)}
                className="text-slate-400 hover:text-[#0086B3] p-1"
                title="이름 수정"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSaveName} className="flex items-center gap-1 mt-1">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="border border-[#779CB0] rounded px-2 py-1 text-xs text-center font-bold bg-white"
                maxLength={12}
                autoFocus
              />
              <button type="submit" className="bg-[#0086B3] text-white font-bold text-xs px-2.5 py-1 rounded">
                저장
              </button>
            </form>
          )}

          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {species.name} ({species.description})
          </p>
        </div>

        {/* Sound Text */}
        <div className="bg-[#E2EEF3] p-2.5 rounded-xl border border-[#779CB0]/40 text-center">
          <p className="text-xs font-bold text-[#0086B3] flex items-center justify-center gap-1">
            <Volume2 className="w-3.5 h-3.5 text-[#0086B3]" />
            <span>"{species.soundText}"</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleFeedOne}
            className="bg-white hover:bg-pink-50 text-[#FF6321] border border-[#FF6321]/40 font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1 transition-colors shadow-2xs"
          >
            <Heart className="w-3.5 h-3.5 text-[#FF6321] fill-[#FF6321]" />
            <span>올리브 모이 주기</span>
          </button>

          <button
            onClick={handlePlaySound}
            className="bg-white hover:bg-sky-50 text-[#0086B3] border border-[#0086B3]/40 font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1 transition-colors shadow-2xs"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#0086B3]" />
            <span>울음소리 듣기</span>
          </button>
        </div>

        <div className="pt-2 border-t border-[#779CB0]/20 flex justify-between items-center text-[11px] text-slate-500">
          <span>분양일: {new Date(animal.purchasedAt).toLocaleDateString('ko-KR')}</span>
          <button
            onClick={() => {
              if (confirm(`정말로 ${animal.customName}을(를) 푸른 들판으로 돌려보내시겠습니까?`)) {
                onRelease(animal.id);
                onClose();
              }
            }}
            className="text-rose-500 hover:underline flex items-center gap-0.5"
          >
            <Trash2 className="w-3 h-3" />
            <span>들판으로 돌려보내기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
