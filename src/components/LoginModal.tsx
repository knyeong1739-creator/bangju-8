import React, { useState } from 'react';
import { UserAccount } from '../types';
import { attemptLogin } from '../lib/authStorage';
import { ShieldCheck, User, Lock, KeyRound, Sparkles, Ship } from 'lucide-react';
import { audioManager } from '../lib/audio';

interface LoginModalProps {
  onLoginSuccess: (account: UserAccount) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onLoginSuccess }) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    audioManager.playClick();

    const name = usernameInput.trim();
    const pwd = passwordInput.trim();

    if (!name) {
      setErrorMessage('이름을 입력해주세요.');
      return;
    }
    if (!pwd) {
      setErrorMessage('비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await attemptLogin(name, pwd);

      if (result === 'not_allowed') {
        setErrorMessage('관리자가 등록한 사용자만 로그인할 수 있어요. 관리자에게 문의해주세요.');
        return;
      }
      if (result === 'wrong_password') {
        setErrorMessage('비밀번호가 올바르지 않습니다. (초기 비밀번호: 1234)');
        return;
      }

      onLoginSuccess(result);
    } catch (err) {
      console.error(err);
      setErrorMessage('로그인 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans select-none">
      <div className="bg-[#F4F8FA] rounded-2xl border-2 border-[#779CB0] shadow-2xl max-w-md w-full p-6 text-slate-800 relative overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="bg-[#0086B3] -mx-6 -mt-6 p-4 text-white flex items-center justify-between border-b border-[#006A8E]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/20 rounded-lg">
              <Ship className="w-6 h-6 text-amber-200" />
            </div>
            <div>
              <h2 className="font-extrabold text-base flex items-center gap-1.5">
                <span>사이좋은 방주타고 입장</span>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </h2>
              <p className="text-[11px] text-sky-100">
                은혜의 미니홈피 로그인 및 계정 접속
              </p>
            </div>
          </div>
          <span className="bg-black/20 border border-white/30 text-amber-200 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full">
            LOGIN
          </span>
        </div>

        {/* Info Banner */}
        <div className="my-4 bg-[#E2EEF3] border border-[#779CB0]/40 p-3 rounded-xl text-xs text-slate-700 space-y-1">
          <p className="font-bold text-[#0086B3] flex items-center gap-1">
            <KeyRound className="w-4 h-4 text-[#0086B3]" />
            <span>비밀번호 안내</span>
          </p>
          <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5 pl-1">
            <li>초기 비밀번호: <strong className="text-[#0086B3] font-mono">1234</strong> (로그인 후 변경 가능)</li>
            <li>관리자가 등록해준 이름만 로그인이 가능해요.</li>
          </ul>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-[#0086B3]" />
              <span>이름 (방주지기)</span>
            </label>
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="예: 방주지기 노아, 홍길동"
              className="w-full bg-white border border-[#779CB0]/60 rounded-lg px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-[#0086B3] focus:outline-none"
              autoFocus
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-[#0086B3]" />
              <span>비밀번호</span>
            </label>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="비밀번호 입력 (기본: 1234)"
              className="w-full bg-white border border-[#779CB0]/60 rounded-lg px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-[#0086B3] focus:outline-none"
              disabled={isLoading}
            />
          </div>

          {errorMessage && (
            <p className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 p-2 rounded text-center">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0086B3] hover:bg-[#007399] text-white font-extrabold py-2.5 rounded-xl text-xs shadow-md active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            <ShieldCheck className="w-4 h-4 text-amber-200" />
            <span>{isLoading ? '확인 중...' : '방주 타고 들어가기'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};