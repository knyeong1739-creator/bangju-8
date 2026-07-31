import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';
import { Edit2, Smile, Camera, Upload, Trash2, UserCheck, Image as ImageIcon } from 'lucide-react';
import { audioManager } from '../lib/audio';

interface ProfilePanelProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
}

const PRESET_AVATARS = [
  { label: '방주지기 노아', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
  { label: '믿음의 청년', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
  { label: '은혜의 자녀', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80' },
  { label: '지혜로운 파수꾼', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
  { label: '희망의 비둘기', url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=300&q=80' }
];

const TODAY_STATUSES = [
  '기쁨과 감사 🌿',
  '은혜 충만 🕊️',
  '기도의 생애 🙏',
  '새노래 청취 중 🎶',
  '말씀 공부 📖',
  '방주 가꾸기 🐾'
];

export const ProfilePanel: React.FC<ProfilePanelProps> = ({ profile, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editOneLiner, setEditOneLiner] = useState(profile.oneLiner);
  const [editAvatar, setEditAvatar] = useState(profile.avatarUrl);
  const [editTodayStatus, setEditTodayStatus] = useState(profile.todayStatus);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const directFileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenEdit = () => {
    audioManager.playClick();
    setEditName(profile.name);
    setEditOneLiner(profile.oneLiner);
    setEditAvatar(profile.avatarUrl);
    setEditTodayStatus(profile.todayStatus);
    setIsEditing(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('이미지 용량은 5MB 이하만 가능합니다.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setEditAvatar(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDirectFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('이미지 용량은 5MB 이하만 가능합니다.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          onUpdateProfile({
            ...profile,
            avatarUrl: result,
          });
          audioManager.playClick();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    audioManager.playClick();
    onUpdateProfile({
      ...profile,
      name: editName.trim() || '방주지기',
      oneLiner: editOneLiner.trim() || '은혜의 방주에 오신 것을 환영합니다!',
      avatarUrl: editAvatar,
      todayStatus: editTodayStatus,
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-[#F4F8FA] border-[1.5px] border-[#779CB0] rounded-lg p-3.5 flex flex-col items-center shadow-xs w-full md:w-52 flex-shrink-0 font-sans">
      {/* Hidden File Input for direct avatar click */}
      <input
        type="file"
        ref={directFileInputRef}
        onChange={handleDirectFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* TODAY IS... Badge */}
      <div className="w-full bg-[#E2EEF3] border border-[#779CB0]/50 px-2.5 py-1 rounded text-center mb-3">
        <span className="text-[10px] font-bold text-[#0086B3] block tracking-wide">TODAY IS...</span>
        <span className="text-xs font-medium text-slate-800 flex items-center justify-center gap-1 mt-0.5">
          <Smile className="w-3.5 h-3.5 text-[#FF6321] inline" />
          {profile.todayStatus}
        </span>
      </div>

      {/* 1) Square 1:1 Aspect Ratio Character Profile Image Container */}
      <div className="relative group w-40 h-40 bg-white border-[1.5px] border-[#779CB0] rounded-md p-1.5 shadow-xs overflow-hidden flex items-center justify-center">
        {profile.avatarUrl ? (
          <>
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-full h-full object-cover rounded border border-[#D0E2EC]"
              onError={() => {
                // If invalid URL, clear avatarUrl
                onUpdateProfile({ ...profile, avatarUrl: '' });
              }}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
              <button
                onClick={() => directFileInputRef.current?.click()}
                className="bg-white text-[#0086B3] text-[11px] font-bold px-2.5 py-1 rounded shadow flex items-center gap-1 hover:bg-slate-100 w-full justify-center"
              >
                <Upload className="w-3 h-3" />
                <span>사진 변경</span>
              </button>
              <button
                onClick={handleOpenEdit}
                className="bg-black/60 text-white text-[11px] font-bold px-2.5 py-1 rounded shadow flex items-center gap-1 hover:bg-black/80 w-full justify-center"
              >
                <Edit2 className="w-3 h-3" />
                <span>프로필 편집</span>
              </button>
            </div>
          </>
        ) : (
          <div
            onClick={() => directFileInputRef.current?.click()}
            className="w-full h-full border-2 border-dashed border-[#779CB0]/60 rounded-md bg-[#E2EEF3]/30 hover:bg-[#E2EEF3]/70 transition-all flex flex-col items-center justify-center p-2 text-center cursor-pointer group-hover:border-[#0086B3]"
          >
            <Camera className="w-8 h-8 text-[#0086B3] mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-[#0086B3]">사진을 등록해주세요</span>
            <span className="text-[10px] text-slate-500 mt-0.5">클릭하여 내 사진 추가</span>
          </div>
        )}
      </div>

      {/* 2) Profile Name */}
      <div className="mt-3 text-center w-full">
        <h2 className="font-bold text-sm text-slate-800 border-b border-dashed border-[#779CB0]/40 pb-1 flex items-center justify-center gap-1">
          <span>{profile.name}</span>
          <span className="text-[#0086B3] text-[10px] font-normal bg-[#E2EEF3] px-1.5 py-0.2 rounded-full border border-[#779CB0]/40">
            방주주인
          </span>
        </h2>
      </div>

      {/* 3) One-line introduction */}
      <div className="mt-2 text-center w-full bg-white border border-[#779CB0]/30 rounded p-2 text-xs text-slate-600 leading-relaxed shadow-xs min-h-[50px] flex items-center justify-center">
        <p className="line-clamp-3 italic font-serif">"{profile.oneLiner}"</p>
      </div>

      {/* Edit Profile Trigger Button */}
      <button
        onClick={handleOpenEdit}
        className="mt-3 w-full bg-[#E2EEF3] hover:bg-[#D4E5ED] text-[#0086B3] border border-[#779CB0] text-xs font-bold py-1.5 rounded transition-colors flex items-center justify-center gap-1 shadow-2xs"
      >
        <Edit2 className="w-3 h-3" />
        <span>프로필 편집</span>
      </button>

      {/* Mini Profile Links / Cyworld Feel */}
      <div className="mt-3 pt-2.5 border-t border-dashed border-[#779CB0]/30 w-full text-[11px] text-slate-500 space-y-1">
        <div className="flex items-center justify-between">
          <span>미니룸 스킨</span>
          <span className="text-[#FF6321] font-medium">원목 방주 스킨</span>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border-[1.5px] border-[#779CB0] shadow-xl max-w-sm w-full p-4 font-sans text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-2 mb-3">
              <h3 className="font-bold text-sm text-[#0086B3] flex items-center gap-1">
                <UserCheck className="w-4 h-4 text-[#0086B3]" />
                <span>방주 프로필 수정</span>
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-base"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">방주지기 이름</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full border border-[#779CB0]/50 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#0086B3]"
                  placeholder="이름을 입력하세요"
                  maxLength={12}
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">한 줄 소개</label>
                <textarea
                  value={editOneLiner}
                  onChange={(e) => setEditOneLiner(e.target.value)}
                  className="w-full border border-[#779CB0]/50 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#0086B3] h-16 resize-none"
                  placeholder="방주 한 줄 소개를 적어주세요"
                  maxLength={60}
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">TODAY IS... 상태</label>
                <select
                  value={editTodayStatus}
                  onChange={(e) => setEditTodayStatus(e.target.value)}
                  className="w-full border border-[#779CB0]/50 rounded px-2.5 py-1.5 bg-white text-slate-700"
                >
                  {TODAY_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Photo Upload / Selection */}
              <div className="border border-[#779CB0]/30 rounded-lg p-2.5 bg-[#F4F8FA] space-y-2">
                <label className="block text-slate-700 font-bold text-xs flex items-center justify-between">
                  <span>프로필 사진</span>
                  {editAvatar && (
                    <button
                      type="button"
                      onClick={() => setEditAvatar('')}
                      className="text-rose-600 hover:text-rose-800 text-[11px] font-normal flex items-center gap-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>사진 비우기</span>
                    </button>
                  )}
                </label>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />

                {/* Upload Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-white hover:bg-slate-50 border border-[#779CB0]/60 text-[#0086B3] font-bold py-1.5 rounded flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>내 컴퓨터에서 사진 선택하기</span>
                </button>

                {/* Preview or URL */}
                <div className="pt-1">
                  <input
                    type="text"
                    value={editAvatar}
                    onChange={(e) => setEditAvatar(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2 py-1 text-[11px]"
                    placeholder="또는 이미지 URL direct 링크 입력"
                  />
                </div>

                {/* Preset Avatars */}
                <div>
                  <span className="text-[10px] text-slate-500 font-medium block mb-1">기본 캐릭터 고르기:</span>
                  <div className="grid grid-cols-5 gap-1.5">
                    {PRESET_AVATARS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setEditAvatar(preset.url)}
                        className={`relative aspect-square border-2 rounded overflow-hidden ${
                          editAvatar === preset.url ? 'border-[#0086B3] ring-2 ring-[#0086B3]/30' : 'border-slate-200'
                        }`}
                      >
                        <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="bg-[#0086B3] hover:bg-[#007399] text-white font-bold px-4 py-1.5 rounded shadow"
                >
                  저장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

