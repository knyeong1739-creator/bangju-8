import React from 'react';
import { Award, Calendar, Sparkles, Trophy, Mic, CheckCircle2 } from 'lucide-react';

interface FestivalModalProps {
  onClose: () => void;
  onGoToMissions: () => void;
}

export const FestivalModal: React.FC<FestivalModalProps> = ({ onClose, onGoToMissions }) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-[#F4F8FA] rounded-2xl border-[1.5px] border-[#779CB0] shadow-2xl max-w-md w-full p-5 text-slate-800 space-y-4 relative overflow-hidden">
        {/* Top Decorative Sparkles */}
        <div className="absolute top-2 right-3 text-[#FF6321] opacity-80">
          <Sparkles className="w-8 h-8 animate-spin-slow" />
        </div>

        {/* Modal Header */}
        <div className="text-center border-b border-[#779CB0]/30 pb-3">
          <span className="bg-[#E2EEF3] text-[#0086B3] border border-[#779CB0]/50 px-3 py-0.5 rounded-full text-[11px] font-extrabold tracking-wider uppercase">
            8월 특별 말씀 행사
          </span>
          <h2 className="text-xl font-black text-[#0086B3] mt-1.5 flex items-center justify-center gap-1.5">
            <Trophy className="w-6 h-6 text-[#FF6321]" />
            <span>2026 성경 발표축제</span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5 font-medium">
            2026년 8월 1일 ~ 8월 31일 (한 달간 진행)
          </p>
        </div>

        {/* Festival Details */}
        <div className="space-y-2.5 text-xs">
          <div className="bg-white p-3 rounded-xl border border-[#779CB0]/40 shadow-2xs space-y-1.5">
            <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-sm">
              <Mic className="w-4 h-4 text-[#0086B3]" />
              <span>축제 취지 및 안내</span>
            </h3>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              8월 한 달 동안 진행되는 성경 발표축제는 전도, 청취, 평가 및 발표 미션을 통해 성경 체계를 견고히 세우고 그린올리브를 수집하여 내 방주를 거룩하고 예쁘게 단장하는 특별 축제입니다.
            </p>
          </div>

          <div className="bg-[#E2EEF3] p-3 rounded-xl border border-[#779CB0]/50 space-y-1.5 text-slate-800">
            <h3 className="font-bold text-xs flex items-center gap-1.5 text-[#0086B3]">
              <Award className="w-4 h-4 text-[#0086B3]" />
              <span>축제 특전 보상</span>
            </h3>
            <ul className="list-disc list-inside text-[11px] space-y-1 text-slate-700 font-medium">
              <li>발표 완수 시 올리브 2알 🫒 + 발표 횟수 누적</li>
              <li>발표 평가 시 올리브 5알 🫒 최다 적립</li>
              <li>축제 기간 동안 모은 올리브로 암/수 8종 동물 완수 컬렉션!</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 border-t border-[#779CB0]/30">
          <button
            onClick={onClose}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-lg text-xs"
          >
            닫기
          </button>
          <button
            onClick={() => {
              onClose();
              onGoToMissions();
            }}
            className="flex-1 bg-[#FF6321] hover:bg-[#E55315] text-white font-bold py-2 rounded-lg text-xs shadow-md flex items-center justify-center gap-1"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>미션 참여하러 가기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
