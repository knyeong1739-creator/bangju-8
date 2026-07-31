import React from 'react';
import { Calendar, Award, Sparkles, Volume2, Mic, Headphones, Heart } from 'lucide-react';
import { AppStats } from '../types';

interface TopRightStatsBoxProps {
  stats: AppStats;
  animalCount: number;
  onOpenFestivalModal: () => void;
}

export const TopRightStatsBox: React.FC<TopRightStatsBoxProps> = ({
  stats,
  animalCount,
  onOpenFestivalModal,
}) => {
  // Format Today's Date
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekDay = weekDays[today.getDay()];
  const formattedDate = `${year}. ${month}. ${day} (${weekDay})`;

  // Festival D-DAY Calculation (Aug 1 to Aug 31)
  const festivalStart = new Date(year, 7, 1); // August 1 (0-indexed month 7)
  const festivalEnd = new Date(year, 7, 31);   // August 31
  const todayResetHours = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  let dDayText = '';
  let dDayBadgeColor = 'bg-amber-100 text-amber-900 border-amber-300';

  if (todayResetHours < festivalStart) {
    const diffTime = festivalStart.getTime() - todayResetHours.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    dDayText = `D-${diffDays}`;
  } else if (todayResetHours <= festivalEnd) {
    const diffTime = festivalEnd.getTime() - todayResetHours.getTime();
    const remainDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    dDayText = `축제 진행중! (종료까지 D-${remainDays})`;
    dDayBadgeColor = 'bg-emerald-100 text-emerald-900 border-emerald-300 animate-pulse';
  } else {
    dDayText = '축제 종료';
    dDayBadgeColor = 'bg-slate-100 text-slate-700 border-slate-300';
  }

  return (
    <div className="bg-[#F4F8FA] border-[1.5px] border-[#779CB0] rounded-lg p-3 shadow-xs font-sans w-full text-xs">
      {/* Box Header */}
      <div className="bg-[#0086B3] text-white px-2.5 py-1 rounded-t -mt-3 -mx-3 mb-2 flex items-center justify-between border-b border-[#006A8E]">
        <div className="flex items-center gap-1 font-bold text-[11px] tracking-tight">
          <Sparkles className="w-3.5 h-3.5 text-amber-200" />
          <span>방주 현황 (STATUS)</span>
        </div>
        <span className="text-[10px] text-sky-100 font-mono">LIVE</span>
      </div>

      {/* 6 Required Stats Stacked Top-to-Bottom */}
      <div className="space-y-1.5 divide-y divide-[#779CB0]/20 text-slate-700">
        {/* 1) 오늘 날짜 */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-slate-600 font-medium flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#0086B3]" />
            오늘 날짜
          </span>
          <span className="font-bold font-mono text-[#0086B3] text-[11px] bg-white px-2 py-0.5 rounded border border-[#779CB0]/40">
            {formattedDate}
          </span>
        </div>

        {/* 2) 발표축제 D-DAY (8월1일부터 8월 31일까지) */}
        <div className="flex items-center justify-between pt-1.5">
          <span className="text-slate-600 font-medium flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-[#FF6321]" />
            발표축제 D-DAY
          </span>
          <button
            onClick={onOpenFestivalModal}
            className={`font-bold px-2 py-0.5 rounded border text-[11px] hover:scale-105 transition-transform flex items-center gap-1 ${dDayBadgeColor}`}
            title="8월 발표축제 자세히 보기"
          >
            <span>8.1~8.31</span>
            <span className="font-extrabold text-[#FF6321]">[{dDayText}]</span>
          </button>
        </div>

        {/* 3) 현재 올리브 갯수 */}
        <div className="flex items-center justify-between pt-1.5 bg-[#E2EEF3] p-1 rounded border border-[#779CB0]/50 my-1">
          <span className="text-[#0086B3] font-bold flex items-center gap-1">
            <span className="text-sm">🫒</span>
            현재 올리브 갯수
          </span>
          <span className="font-black text-[#0086B3] text-sm font-mono flex items-center gap-0.5 bg-white px-2 py-0.5 rounded border border-[#779CB0]/50 shadow-2xs">
            {stats.olives} <span className="text-xs font-normal text-slate-600">알</span>
          </span>
        </div>

        {/* 4) 방주에 들인 동물 마리수 */}
        <div className="flex items-center justify-between pt-1.5">
          <span className="text-slate-600 font-medium flex items-center gap-1">
            <span className="text-sm">🐾</span>
            들인 동물 마리수
          </span>
          <span className="font-bold text-[#FF6321] text-[12px] font-mono bg-white px-2 py-0.5 rounded border border-[#779CB0]/40">
            {animalCount} <span className="text-[10px] font-normal text-slate-500">마리</span>
          </span>
        </div>

        {/* 5) 발표 완료한 횟수 */}
        <div className="flex items-center justify-between pt-1.5">
          <span className="text-slate-600 font-medium flex items-center gap-1">
            <Mic className="w-3.5 h-3.5 text-[#0086B3]" />
            발표 완료 횟수
          </span>
          <span className="font-bold text-[#0086B3] text-[12px] font-mono bg-white px-2 py-0.5 rounded border border-[#779CB0]/40">
            {stats.presentationCount} <span className="text-[10px] font-normal text-slate-500">회</span>
          </span>
        </div>

        {/* 6) 발표 청취 횟수 */}
        <div className="flex items-center justify-between pt-1.5">
          <span className="text-slate-600 font-medium flex items-center gap-1">
            <Headphones className="w-3.5 h-3.5 text-[#0086B3]" />
            발표 청취 횟수
          </span>
          <span className="font-bold text-[#0086B3] text-[12px] font-mono bg-white px-2 py-0.5 rounded border border-[#779CB0]/40">
            {stats.listeningCount} <span className="text-[10px] font-normal text-slate-500">회</span>
          </span>
        </div>
      </div>
    </div>
  );
};
