import React, { useState, useEffect } from 'react';
import { UserAccount } from '../types';
import {
  loadAllAccounts,
  saveSingleAccount,
  deleteAccount,
  loadAllowedUsers,
  addAllowedUser,
  removeAllowedUser,
} from '../lib/authStorage';
import { ShieldAlert, Users, Search, Eye, Key, CheckCircle, X, Trash2, UserPlus } from 'lucide-react';
import { audioManager } from '../lib/audio';

interface AdminDashboardModalProps {
  onClose: () => void;
  onSelectUserToView: (account: UserAccount) => void;
}

type AdminTab = 'accounts' | 'addUser';

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  onClose,
  onSelectUserToView,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('accounts');

  // 계정 관리 탭 상태
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [noticeMsg, setNoticeMsg] = useState('');

  // 유저 추가 탭 상태
  const [allowedUsers, setAllowedUsers] = useState<string[]>([]);
  const [isLoadingAllowed, setIsLoadingAllowed] = useState(true);
  const [newUsername, setNewUsername] = useState('');
  const [addMsg, setAddMsg] = useState('');

  const refreshAccounts = async () => {
    setIsLoadingAccounts(true);
    const data = await loadAllAccounts();
    setAccounts(data);
    setIsLoadingAccounts(false);
  };

  const refreshAllowedUsers = async () => {
    setIsLoadingAllowed(true);
    const data = await loadAllowedUsers();
    setAllowedUsers(data);
    setIsLoadingAllowed(false);
  };

  useEffect(() => {
    refreshAccounts();
    refreshAllowedUsers();
  }, []);

  const pendingAccounts = accounts.filter((a) => !a.isApproved && !a.isAdmin);
  const filteredAccounts = accounts.filter(
    (a) => a.username.includes(searchTerm) || a.minihompyTitle.includes(searchTerm)
  );

  const showNotice = (msg: string) => {
    setNoticeMsg(msg);
    setTimeout(() => setNoticeMsg(''), 4000);
  };

  const handleResetPassword = async (username: string) => {
    audioManager.playClick();
    const target = accounts.find((a) => a.username === username);
    if (!target) return;

    const updated: UserAccount = { ...target, password: '1234', isDefaultPassword: true };
    await saveSingleAccount(updated);
    setAccounts((prev) => prev.map((a) => (a.username === username ? updated : a)));
    showNotice(`'${username}' 계정 비밀번호를 초기 비밀번호 '1234'로 재설정했습니다.`);
  };

  const handleDeleteAccount = async (username: string) => {
    if (!window.confirm(`'${username}' 계정을 삭제할까요? 이 작업은 되돌릴 수 없습니다.`)) return;
    audioManager.playClick();
    const success = await deleteAccount(username);
    if (success) {
      setAccounts((prev) => prev.filter((a) => a.username !== username));
      if (selectedUser?.username === username) setSelectedUser(null);
      showNotice(`'${username}' 계정이 삭제되었습니다.`);
    } else {
      showNotice(`'${username}' 계정 삭제에 실패했어요.`);
    }
  };

  const handleAddUser = async () => {
    const trimmed = newUsername.trim();
    if (!trimmed) return;
    audioManager.playClick();

    const success = await addAllowedUser(trimmed);
    if (success) {
      setAddMsg(`'${trimmed}' 님을 등록했어요. 초기 비밀번호 1234로 로그인 가능해요.`);
      setNewUsername('');
      refreshAllowedUsers();
    } else {
      setAddMsg('이미 등록되어 있거나 추가에 실패했어요.');
    }
    setTimeout(() => setAddMsg(''), 4000);
  };

  const handleRemoveAllowedUser = async (username: string) => {
    if (!window.confirm(`'${username}' 님을 허용 목록에서 제거할까요? (기존 계정 데이터는 남아있어요)`)) return;
    audioManager.playClick();
    const success = await removeAllowedUser(username);
    if (success) {
      setAllowedUsers((prev) => prev.filter((u) => u !== username));
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-5 font-sans select-none">
      <div className="bg-[#F4F8FA] rounded-2xl border-2 border-[#779CB0] shadow-2xl max-w-2xl w-full p-4 sm:p-5 text-slate-800 relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0086B3] -mx-4 -mt-4 sm:-mx-5 sm:-mt-5 p-3.5 sm:p-4 text-white rounded-t-xl flex items-center justify-between border-b border-[#006A8E] shrink-0">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-amber-300" />
            <div>
              <h2 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
                <span>총관리자 센터 (ADMIN DASHBOARD)</span>
              </h2>
              <p className="text-[11px] text-sky-100">
                생성된 미니홈피 계정 목록 및 각 방주주인의 STATUS 조회
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-3 flex gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('accounts')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border ${
              activeTab === 'accounts'
                ? 'bg-[#0086B3] text-white border-[#0086B3]'
                : 'bg-white text-slate-600 border-[#779CB0]/40 hover:border-[#0086B3]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>계정 관리</span>
          </button>
          <button
            onClick={() => setActiveTab('addUser')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border ${
              activeTab === 'addUser'
                ? 'bg-[#0086B3] text-white border-[#0086B3]'
                : 'bg-white text-slate-600 border-[#779CB0]/40 hover:border-[#0086B3]'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>유저 추가</span>
          </button>
        </div>

        {/* Notice Message */}
        {noticeMsg && (
          <div className="mt-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold p-2.5 rounded-lg flex items-center gap-2 shrink-0 animate-fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{noticeMsg}</span>
          </div>
        )}

        {/* ===== TAB 1: 계정 관리 ===== */}
        {activeTab === 'accounts' && (
          <>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="방주주인 이름 또는 미니홈피 제목 검색..."
                  className="w-full bg-white border border-[#779CB0]/50 rounded-lg pl-8 pr-3 py-1.5 text-xs font-bold focus:ring-1 focus:ring-[#0086B3] focus:outline-none"
                />
              </div>
              <div className="bg-[#E2EEF3] border border-[#779CB0]/40 px-3 py-1 rounded-lg text-xs font-bold text-[#0086B3] flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span>등록된 방주 계정: {accounts.length}개</span>
              </div>
            </div>

            <div className="mt-3 flex-1 overflow-y-auto space-y-2 pr-1">
              {pendingAccounts.length > 0 && (
                <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-3 space-y-2">
                  <h4 className="text-xs font-bold text-orange-700 flex items-center gap-1.5">
                    <span>⏳ 승인 대기 중 ({pendingAccounts.length}명)</span>
                  </h4>
                  {pendingAccounts.map((acc) => (
                    <div key={acc.username} className="bg-white border border-orange-200 rounded-lg px-3 py-2 flex items-center justify-between gap-2">
                      <div>
                        <span className="font-bold text-sm text-slate-800">{acc.username}</span>
                        <span className="text-[11px] text-slate-500 ml-2">가입 신청함</span>
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={async () => {
                            audioManager.playClick();
                            const updated = { ...acc, isApproved: true };
                            await saveSingleAccount(updated);
                            setAccounts((prev) => prev.map((a) => a.username === acc.username ? updated : a));
                            showNotice(`'${acc.username}' 님을 승인했습니다! 🕊️`);
                          }}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>승인</span>
                        </button>
                        <button
                          onClick={() => handleDeleteAccount(acc.username)}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>거절</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {isLoadingAccounts ? (
                <div className="p-8 text-center text-xs text-slate-500">불러오는 중...</div>
              ) : filteredAccounts.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-xl border border-dashed border-[#779CB0]/40">
                  검색 조건에 해당되는 방주 계정이 없습니다.
                </div>
              ) : (
                filteredAccounts.map((acc) => {
                  const isSelected = selectedUser?.username === acc.username;
                  return (
                    <div
                      key={acc.username}
                      className={`bg-white border rounded-xl p-3 shadow-2xs transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                        isSelected ? 'border-[#0086B3] ring-2 ring-[#0086B3]/20' : 'border-[#779CB0]/40 hover:border-[#0086B3]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-[#E2EEF3] border border-[#779CB0]/50 rounded-lg flex items-center justify-center shrink-0 font-extrabold text-[#0086B3] text-sm">
                          {acc.username.slice(0, 1)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-extrabold text-sm text-slate-800">
                              {acc.username}
                            </h3>
                            <span className="text-[10px] bg-sky-50 text-[#0086B3] border border-[#779CB0]/30 px-1.5 py-0.2 rounded font-mono">
                              {acc.minihompyTitle}
                            </span>
                            {acc.isDefaultPassword && (
                              <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-300 px-1.5 py-0.2 rounded font-mono">
                                초기비밀번호(1234)
                              </span>
                            )}
                            {!acc.isApproved && !acc.isAdmin && (
                              <span className="text-[10px] bg-orange-50 text-orange-700 border border-orange-300 px-1.5 py-0.2 rounded font-mono animate-pulse">
                                ⏳ 승인 대기
                              </span>
                            )}
                            {acc.isAdmin && (
                              <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-300 px-1.5 py-0.2 rounded font-mono">
                                관리자
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 mt-1 font-mono">
                            <span className="bg-[#E2EEF3] px-1.5 py-0.5 rounded text-[#0086B3] font-bold">
                              🫒 올리브 {acc.stats.olives}알
                            </span>
                            <span className="bg-amber-50 px-1.5 py-0.5 rounded text-amber-800 font-bold border border-amber-200">
                              🐾 동물 {acc.purchasedAnimals.length}마리
                            </span>
                            <span>발표 {acc.stats.presentationCount}회</span>
                            <span>청취 {acc.stats.listeningCount}회</span>
                            <span className="text-slate-400">| TODAY: {acc.profile.todayStatus}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex-wrap">
                        <button
                          onClick={() => setSelectedUser(isSelected ? null : acc)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#0086B3]" />
                          <span>{isSelected ? '닫기' : 'STATUS'}</span>
                        </button>

                        {!acc.isApproved && (
                          <button
                            onClick={async () => {
                              audioManager.playClick();
                              const updated = { ...acc, isApproved: true };
                              await saveSingleAccount(updated);
                              setAccounts((prev) => prev.map((a) => a.username === acc.username ? updated : a));
                              showNotice(`'${acc.username}' 님을 승인했습니다! 🕊️`);
                            }}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
                          >
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                            <span>승인</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleResetPassword(acc.username)}
                          className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
                        >
                          <Key className="w-3.5 h-3.5 text-amber-600" />
                          <span>비번 초기화</span>
                        </button>

                        <button
                          onClick={() => handleDeleteAccount(acc.username)}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                          <span>계정 삭제</span>
                        </button>

                        <button
                          onClick={() => {
                            audioManager.playClick();
                            onSelectUserToView(acc);
                            onClose();
                          }}
                          className="bg-[#0086B3] hover:bg-[#007399] text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-2xs flex items-center gap-1"
                        >
                          <span>미니홈피 이동</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}

              {selectedUser && (
                <div className="bg-[#E2EEF3] border-2 border-[#0086B3] rounded-xl p-3.5 mt-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-[#779CB0]/40 pb-2">
                    <h4 className="font-extrabold text-[#0086B3] text-sm flex items-center gap-1.5">
                      <span>🕊️ [{selectedUser.username}] 님 방주 상세 STATUS</span>
                    </h4>
                    <button
                      onClick={() => setSelectedUser(null)}
                      className="text-slate-500 hover:text-slate-800 font-bold text-xs"
                    >
                      닫기
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                    <div className="bg-white p-2 rounded border border-[#779CB0]/30">
                      <span className="text-slate-500 block text-[10px]">미니홈피 제목</span>
                      <strong className="text-slate-800 font-sans">{selectedUser.minihompyTitle}</strong>
                    </div>
                    <div className="bg-white p-2 rounded border border-[#779CB0]/30">
                      <span className="text-slate-500 block text-[10px]">오늘 상태 (TODAY IS)</span>
                      <strong className="text-[#0086B3] font-sans">{selectedUser.profile.todayStatus}</strong>
                    </div>
                    <div className="bg-white p-2 rounded border border-[#779CB0]/30">
                      <span className="text-slate-500 block text-[10px]">그린올리브</span>
                      <strong className="text-[#0086B3] font-bold">🫒 {selectedUser.stats.olives}알</strong>
                    </div>
                    <div className="bg-white p-2 rounded border border-[#779CB0]/30">
                      <span className="text-slate-500 block text-[10px]">들인 동물 목록</span>
                      <strong className="text-[#FF6321]">{selectedUser.purchasedAnimals.length}마리</strong>
                    </div>
                  </div>

                  {selectedUser.purchasedAnimals.length > 0 && (
                    <div className="bg-white p-2 rounded border border-[#779CB0]/30">
                      <span className="text-slate-500 block text-[10px] mb-1 font-bold">분양된 동물 짝:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedUser.purchasedAnimals.map((a) => (
                          <span key={a.id} className="bg-[#F4F8FA] border border-[#779CB0]/30 px-2 py-0.5 rounded text-[11px]">
                            {a.customName} ({a.gender === 'female' ? '♀' : '♂'})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* ===== TAB 2: 유저 추가 ===== */}
        {activeTab === 'addUser' && (
          <div className="mt-3 flex-1 overflow-y-auto pr-1">
            <div className="bg-white border border-[#779CB0]/40 rounded-xl p-3.5">
              <p className="text-xs font-bold text-slate-700 mb-2">
                여기에 등록된 이름만 로그인할 수 있어요. 등록 후 초기 비밀번호 <strong className="text-[#0086B3] font-mono">1234</strong>로 첫 로그인하면 계정이 자동 생성돼요.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddUser()}
                  placeholder="추가할 이름 입력"
                  className="flex-1 bg-white border border-[#779CB0]/60 rounded-lg px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-[#0086B3] focus:outline-none"
                />
                <button
                  onClick={handleAddUser}
                  className="bg-[#0086B3] hover:bg-[#007399] text-white px-4 py-2 rounded-lg text-xs font-bold shrink-0"
                >
                  추가
                </button>
              </div>
              {addMsg && (
                <p className="text-[11px] font-bold text-[#0086B3] mt-2">{addMsg}</p>
              )}
            </div>

            <div className="mt-3">
              <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#0086B3]" />
                <span>허용된 유저 목록 ({allowedUsers.length}명)</span>
              </h4>
              {isLoadingAllowed ? (
                <div className="p-6 text-center text-xs text-slate-500">불러오는 중...</div>
              ) : allowedUsers.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 bg-white rounded-xl border border-dashed border-[#779CB0]/40">
                  등록된 유저가 없어요.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {allowedUsers.map((u) => (
                    <div
                      key={u}
                      className="bg-white border border-[#779CB0]/30 rounded-lg px-3 py-2 flex items-center justify-between text-xs"
                    >
                      <span className="font-bold text-slate-700">{u}</span>
                      {u !== '관리자' && (
                        <button
                          onClick={() => handleRemoveAllowedUser(u)}
                          className="text-rose-500 hover:text-rose-700 text-[11px] font-bold flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>제거</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-[#779CB0]/30 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-4 py-1.5 rounded-lg text-xs"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};