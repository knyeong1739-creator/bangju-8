import React, { useState } from 'react';
import { UserAccount } from '../types';
import { saveSingleAccount } from '../lib/authStorage';
import { KeyRound, ShieldCheck, AlertCircle } from 'lucide-react';
import { audioManager } from '../lib/audio';

interface ChangePasswordModalProps {
  account: UserAccount;
  onPasswordChanged: (updatedAccount: UserAccount) => void;
  onSkip?: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  account,
  onPasswordChanged,
  onSkip,
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    audioManager.playClick();

    const pwd = newPassword.trim();
    if (!pwd) {
      setErrorMessage('새 비밀번호를 입력해주세요.');
      return;
    }
    if (pwd === '1234') {
      setErrorMessage('기존 초기 비밀번호(1234)와 다른 비밀번호를 입력해주세요.');
      return;
    }
    if (pwd !== confirmPassword.trim()) {
      setErrorMessage('비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    const updated: UserAccount = {
      ...account,
      password: pwd,
      isDefaultPassword: false,
    };

    setIsSaving(true);
    try {
      await saveSingleAccount(updated);
      onPasswordChanged(updated);
    } catch (err) {
      console.error(err);
      setErrorMessage('저장 중 오류가 발생했어요. 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans select-none">
      <div className="bg-[#F4F8FA] rounded-2xl border-2 border-[#779CB0] shadow-2xl max-w-sm w-full p-5 text-slate-800 relative">
        <div className="text-center border-b border-[#779CB0]/30 pb-3 mb-3">
          <div className="w-10 h-10 bg-[#E2EEF3] border border-[#779CB0]/50 rounded-full flex items-center justify-center mx-auto mb-2 text-[#0086B3]">
            <KeyRound className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-[#0086B3]">
            개인 비밀번호 설정 (최초 1회)
          </h3>
          <p className="text-[11px] text-slate-600 mt-0.5">
            <strong className="text-slate-800">{account.username}</strong>님의 안전한 방주 관리를 위해 나만의 개인 비밀번호를 설정해주세요.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 mb-3 text-[11px] text-amber-900 flex items-start gap-1.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>초기 비밀번호는 1234입니다. 나만의 새로운 개인 비밀번호로 변경하세요.</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              새 개인 비밀번호
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="새 비밀번호 입력"
              className="w-full bg-white border border-[#779CB0]/60 rounded px-2.5 py-1.5 text-xs font-bold focus:ring-1 focus:ring-[#0086B3] focus:outline-none"
              autoFocus
              disabled={isSaving}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              새 비밀번호 재입력 확인
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="새 비밀번호 다시 입력"
              className="w-full bg-white border border-[#779CB0]/60 rounded px-2.5 py-1.5 text-xs font-bold focus:ring-1 focus:ring-[#0086B3] focus:outline-none"
              disabled={isSaving}
            />
          </div>

          {errorMessage && (
            <p className="text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200 p-1.5 rounded text-center">
              {errorMessage}
            </p>
          )}

          <div className="flex gap-2 pt-2">
            {onSkip && (
              <button
                type="button"
                onClick={onSkip}
                disabled={isSaving}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2 rounded-lg text-xs disabled:opacity-60"
              >
                나중에 변경
              </button>
            )}
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-[#0086B3] hover:bg-[#007399] text-white font-extrabold py-2 rounded-lg text-xs shadow-sm flex items-center justify-center gap-1 disabled:opacity-60"
            >
              <ShieldCheck className="w-4 h-4 text-amber-200" />
              <span>{isSaving ? '저장 중...' : '비밀번호 변경 완료'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};