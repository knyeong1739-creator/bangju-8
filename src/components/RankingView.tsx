import React, { useState, useEffect } from 'react';
import { Trophy, RefreshCw } from 'lucide-react';
import { loadAllAccounts } from '../lib/authStorage';
import { UserAccount } from '../types';

export const RankingView: React.FC = () => {
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRanking = async () => {
    setIsLoading(true);
    const data = await loadAllAccounts();
    const approved = data.filter((a) => a.isApproved && !a.isAdmin);
    approved.sort((a, b) => b.purchasedAnimals.length - a.purchasedAnimals.length);
    setAccounts(approved);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRanking();
  }, []);

  const medalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `${rank}위`;
  };

  return (
    <div className="flex flex-col h-full bg-[#F4F8FA] rounded-lg border-[1.5px] border-[#779CB0] p-3.5 font-sans shadow-xs overflow-y-auto">
      {/* 배너 */}
      <div className="bg-[#0086B3] text-white p-3 rounded-md shadow-xs mb-3 flex items-center justify-between border-b border-[#006A8E]">
        <div>
          <h2 className="font-bold text-sm flex items-center gap-1.5 text-amber-200">
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>방주 동물 랭킹</span>
          </h2>
          <p className="text-[11px] text-sky-100 mt-0.5">방주에 들인 동물 수 기준 순위예요 🐾</p>
        </div>
        <button
          onClick={fetchRanking}
          className="bg-white/20 hover:bg-white/30 border border-white/30 px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" />
          <span>새로고침</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center text-xs text-slate-500">불러오는 중...</div>
      ) : accounts.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-xs text-slate-500">아직 랭킹 데이터가 없어요.</div>
      ) : (
        <div className="space-y-2">
          {accounts.map((acc, idx) => {
            const rank = idx + 1;
            const isTop3 = rank <= 3;
            return (
              <div
                key={acc.username}
                className={`flex items-center gap-3 bg-white border rounded-xl px-4 py-3 shadow-2xs ${
                  rank === 1 ? 'border-yellow-400 bg-yellow-50' :
                  rank === 2 ? 'border-slate-400 bg-slate-50' :
                  rank === 3 ? 'border-amber-600 bg-amber-50' :
                  'border-[#779CB0]/40'
                }`}
              >
                <div className={`text-lg font-extrabold w-10 text-center shrink-0 ${isTop3 ? '' : 'text-slate-500 text-sm'}`}>
                  {medalEmoji(rank)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-extrabold text-sm text-slate-800 truncate">{acc.username}</p>
                  <p className="text-[11px] text-slate-500 truncate">{acc.minihompyTitle}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-extrabold text-[#0086B3] text-sm">🐾 {acc.purchasedAnimals.length}마리</p>
                  <p className="text-[10px] text-slate-400">🫒 올리브 {acc.stats.olives}알</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};