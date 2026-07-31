import React, { useState } from 'react';
import { Volume2, VolumeX, Play, Square, Sparkles, Edit2, Check, LogOut, ShieldAlert } from 'lucide-react';
import { audioManager } from '../lib/audio';

interface CyworldHeaderProps {
  isBgmPlaying: boolean;
  setIsBgmPlaying: (playing: boolean) => void;
  visitedCount: number;
  todayCount: number;
  onOpenFestivalModal: () => void;
  minihompyTitle: string;
  onUpdateTitle: (newTitle: string) => void;
  username: string;
  isAdmin?: boolean;
  onLogout: () => void;
  onOpenAdminPanel?: () => void;
}

const getFestivalDDay = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const festivalStart = new Date(2026, 7, 1); // 8월 1일 (month는 0-indexed)
  const festivalEnd = new Date(2026, 7, 31);
  festivalEnd.setHours(23, 59, 59, 999);

  if (today < festivalStart) {
    const diff = Math.ceil((festivalStart.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return `D-${diff}`;
  } else if (today <= festivalEnd) {
    const diff = Math.ceil((festivalEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return `D-${diff}`;
  } else {
    return '축제 종료';
  }
};

export const CyworldHeader: React.FC<CyworldHeaderProps> = ({
  isBgmPlaying,
  setIsBgmPlaying,
  visitedCount,
  todayCount,
  onOpenFestivalModal,
  minihompyTitle,
  onUpdateTitle,
  username,
  isAdmin,
  onLogout,
  onOpenAdminPanel,
}) => {
  const [isMuted, setIsMuted] = useState(audioManager.getMuted());
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(minihompyTitle);

  const handleToggleBgm = () => {
    if (isBgmPlaying) {
      audioManager.stopBgm();
      setIsBgmPlaying(false);
    } else {
      const started = audioManager.startBgm();
      setIsBgmPlaying(started);
    }
  };

  const handleToggleMute = () => {
    const muted = audioManager.toggleMute();
    setIsMuted(muted);
    if (muted) setIsBgmPlaying(false);
  };

  const handleSaveTitle = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (titleInput.trim()) {
      onUpdateTitle(titleInput.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <div className="bg-[#0086B3] text-white px-3 sm:px-4 py-2.5 rounded-t-xl border-b-[1.5px] border-[#779CB0] shadow-md flex flex-wrap items-center justify-between gap-2 text-xs select-none">
      {/* Left: Cyworld Title & Editable Minihompy Name */}
      <div className="flex items-center gap-2">
        <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border border-white/30 text-white shrink-0">
          IUBA경상대센터
        </span>
        
        {isEditingTitle ? (
          <form onSubmit={handleSaveTitle} className="flex items-center gap-1">
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              className="bg-white text-slate-800 px-2 py-0.5 rounded font-bold text-xs focus:outline-none"
              maxLength={25}
              autoFocus
            />
            <button
              type="submit"
              className="bg-amber-400 hover:bg-amber-500 text-amber-950 p-1 rounded font-bold"
              title="제목 저장"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          <h1
            onClick={() => {
              setTitleInput(minihompyTitle);
              setIsEditingTitle(true);
            }}
            className="font-bold text-xs sm:text-sm md:text-base text-white flex items-center gap-1.5 drop-shadow-sm cursor-pointer hover:text-amber-200 transition-colors group"
            title="클릭하여 미니홈피 제목 수정"
          >
            <span>{minihompyTitle}</span>
            <Edit2 className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
          </h1>
        )}
      </div>

      {/* Middle: BGM Mini Player Bar */}
      <div className="flex items-center bg-[#006A8E] px-2.5 py-1 rounded-full border border-white/20 gap-2 shadow-sm">
        <div className="flex items-center gap-1">
          <button
            onClick={handleToggleBgm}
            className="hover:bg-white/20 transition-colors flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded text-[11px] text-white"
            title={isBgmPlaying ? 'BGM 정지' : 'BGM 재생'}
          >
            {isBgmPlaying ? <Square className="w-3 h-3 fill-white" /> : <Play className="w-3 h-3 fill-white" />}
            <span className="font-mono">{isBgmPlaying ? 'STOP' : 'PLAY'}</span>
          </button>
          <button
            onClick={handleToggleMute}
            className="hover:text-amber-200 transition-colors p-1"
            title={isMuted ? '음소거 해제' : '음소거'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-300" /> : <Volume2 className="w-3.5 h-3.5 text-amber-200" />}
          </button>
        </div>
        <div className="overflow-hidden w-24 sm:w-36 text-[11px] whitespace-nowrap font-sans text-sky-100 flex items-center gap-1">
          <span className="animate-pulse">🎵</span>
          <span className="truncate font-semibold">BGM - 황금빛 기름</span>
        </div>
      </div>

      {/* Right: TODAY/TOTAL Visitors, User Badge & Festival D-Day */}
      <div className="flex items-center gap-2">
        {isAdmin && (
          <button
            onClick={onOpenAdminPanel}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-2 py-0.5 rounded text-[11px] flex items-center gap-1 border border-amber-300 animate-pulse shadow"
            title="관리자 가드 연동"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>관리자 대시보드</span>
          </button>
        )}

        <button
          onClick={onOpenFestivalModal}
          className="bg-[#FF6321] hover:bg-[#E55315] text-white font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] flex items-center gap-1 shadow transition-all transform hover:scale-105 active:scale-95 animate-bounce"
        >
          <Sparkles className="w-3 h-3 text-white" />
          <span>8월 발표축제</span>
          <span className="bg-white/20 px-1 py-0.5 rounded text-[9px] font-mono border border-white/30 ml-0.5">
            {getFestivalDDay()}
          </span>
        </button>

        <div className="bg-black/20 px-2 py-0.5 rounded border border-white/20 font-mono text-[10px] sm:text-[11px] flex items-center gap-1.5">
          <span>
            TODAY <strong className="text-[#FFD166]">{todayCount}</strong>
          </span>
          <span className="text-white/40">|</span>
          <span>
            TOTAL <strong className="text-white">{visitedCount}</strong>
          </span>
        </div>

        {/* User Account Badge & Logout */}
        <div className="flex items-center gap-1 pl-1 border-l border-white/20">
          <span className="text-[11px] font-bold text-amber-200 hidden md:inline">
            {username}
          </span>
          <button
            onClick={onLogout}
            className="bg-black/30 hover:bg-black/50 text-white p-1 rounded transition-colors flex items-center gap-1"
            title="로그아웃"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden sm:inline">로그아웃</span>
          </button>
        </div>
      </div>
    </div>
  );
};

