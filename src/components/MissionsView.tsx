import React, { useState } from 'react';
import { AppStats, Mission, MissionType, PresentationItem } from '../types';
import { SAMPLE_PRESENTATIONS } from '../data/initialData';
import {
  Mic,
  CheckSquare,
  Headphones,
  MapPin,
  Share2,
  CheckCircle2,
  Play,
  Pause,
  Award,
  Sparkles,
  BookOpen,
  Send,
  AlertCircle
} from 'lucide-react';
import { audioManager } from '../lib/audio';

interface MissionsViewProps {
  missions: Mission[];
  stats: AppStats;
  onRewardClaim: (missionType: MissionType, olives: number) => void;
}

export const MissionsView: React.FC<MissionsViewProps> = ({
  missions,
  stats,
  onRewardClaim,
}) => {
  const [activeModal, setActiveModal] = useState<MissionType | null>(null);

  // 1) Presentation State
  const [presTopic, setPresTopic] = useState('노아의 방주와 순종의 신앙');
  const [presScript, setPresScript] = useState('');
  const [presDone, setPresDone] = useState(false);

  // 2) Evaluation State
  const [evalSelected, setEvalSelected] = useState<PresentationItem>(SAMPLE_PRESENTATIONS[0]);
  const [evalScores, setEvalScores] = useState({ clarity: 5, accuracy: 5, grace: 5 });
  const [evalComment, setEvalComment] = useState('말씀 주제가 매우 명확하고 은혜로웠습니다!');

  // 3) Listening State
  const [listenSelected, setListenSelected] = useState<PresentationItem>(SAMPLE_PRESENTATIONS[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  // 4) Evangelism State
  const [evangelismLocation, setEvangelismLocation] = useState('강남역 사거리');
  const [evangelismNote, setEvangelismNote] = useState('따뜻한 차 한 잔과 함께 복음 주보를 건넸습니다.');

  // 5) Online Mission State
  const [verseCard, setVerseCard] = useState({
    title: '창세기 6장 14절',
    text: '너는 고페르 나무로 너를 위하여 방주를 만들되 그 안에 칸들을 막고 역청을 그 안팎에 칠하라',
  });
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Today ISO Date string YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];
  const isEvangelismDoneToday = stats.lastEvangelismDate === todayStr;
  const isOnlineMissionDoneToday = stats.lastOnlineMissionDate === todayStr;

  // Handle Audio Player Simulation for Listening Mission
  React.useEffect(() => {
    let timer: number;
    if (isPlayingAudio) {
      timer = window.setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingAudio(false);
            return 100;
          }
          return prev + 10;
        });
      }, 500);
    }
    return () => clearInterval(timer);
  }, [isPlayingAudio]);

  const handleOpenMission = (type: MissionType) => {
    audioManager.playClick();
    if (type === 'evangelism' && isEvangelismDoneToday) {
      alert('사거리 전도는 1일 1회만 완료할 수 있습니다. 내일 다시 도전해 주세요! 🫒');
      return;
    }
    if (type === 'online_mission' && isOnlineMissionDoneToday) {
      alert('온라인 선교는 1일 1회만 완료할 수 있습니다. 내일 다시 도전해 주세요! 🫒');
      return;
    }
    if (type === 'evangelism') {
      handleCompleteEvangelism();
      return;
    }
    if (type === 'online_mission') {
      handleCompleteOnlineMission();
      return;
    }
    if (type === 'evaluation') {
      handleCompleteEvaluation();
      return;
    }
    if (type === 'presentation') {
      handleCompletePresentation();
      return;
    }
    if (type === 'listening') {
      handleCompleteListening();
      return;
    }
    setActiveModal(type);
  };

  const handleCompleteEvaluation = () => {
    audioManager.playOliveChime();
    onRewardClaim('evaluation', 5);
    setActiveModal(null);
    alert('🎉 1주제 평가 완료! [그린올리브 5알 🫒] 획득!');
  };

  const handleCompletePresentation = () => {
    audioManager.playOliveChime();
    onRewardClaim('presentation', 2);
    setActiveModal(null);
    setPresScript('');
    alert('🎉 1주제 발표 완료! [그린올리브 2알 🫒] 획득!');
  };

  const handleCompleteListening = () => {
    audioManager.playOliveChime();
    onRewardClaim('listening', 1);
    setActiveModal(null);
    setAudioProgress(0);
    alert('🎉 1주제 청취 완료! [그린올리브 1알 🫒] 획득!');
  };

  const handleCompleteEvangelism = () => {
    audioManager.playOliveChime();
    onRewardClaim('evangelism', 2);
    setActiveModal(null);
    alert('🎉 사거리 전도 완료! [그린올리브 2알 🫒] 획득!');
  };

  const handleCompleteOnlineMission = () => {
    audioManager.playOliveChime();
    onRewardClaim('online_mission', 1);
    setActiveModal(null);
    alert('🎉 온라인 선교 완료! [그린올리브 1알 🫒] 획득!');
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'Mic':
        return <Mic className="w-5 h-5 text-indigo-600" />;
      case 'CheckSquare':
        return <CheckSquare className="w-5 h-5 text-emerald-600" />;
      case 'Headphones':
        return <Headphones className="w-5 h-5 text-sky-600" />;
      case 'MapPin':
        return <MapPin className="w-5 h-5 text-rose-600" />;
      case 'Share2':
        return <Share2 className="w-5 h-5 text-amber-600" />;
      default:
        return <BookOpen className="w-5 h-5 text-teal-600" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F4F8FA] rounded-lg border-[1.5px] border-[#779CB0] p-3.5 font-sans shadow-xs overflow-y-auto">
      {/* Banner */}
      <div className="bg-[#0086B3] text-white p-3 rounded-md shadow-xs mb-3 flex items-center justify-between border-b border-[#006A8E]">
        <div>
          <h2 className="font-bold text-sm flex items-center gap-1.5 text-amber-200">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>은혜의 활동 미션 목록</span>
          </h2>
          <p className="text-[11px] text-sky-100 mt-0.5">
            발표, 평가, 청취 및 전도 미션을 수행하여 그린올리브를 획득하세요!
          </p>
        </div>
        <div className="bg-black/20 border border-white/30 px-3 py-1 rounded-full font-mono text-xs text-amber-200 font-bold">
          보상 = 그린올리브 🫒
        </div>
      </div>

      {/* Mission Cards Grid */}
      <div className="space-y-2.5">
        {missions.map((m) => {
          let isCompleted = false;
          if (m.id === 'evangelism') isCompleted = isEvangelismDoneToday;
          if (m.id === 'online_mission') isCompleted = isOnlineMissionDoneToday;

          return (
            <div
              key={m.id}
              className={`border rounded-lg p-3 bg-white shadow-2xs transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                isCompleted ? 'border-slate-200 opacity-70 bg-slate-50' : 'border-[#779CB0]/50 hover:border-[#0086B3] hover:shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-[#E2EEF3] border border-[#779CB0]/40 rounded-lg shrink-0 mt-0.5">
                  {getIcon(m.iconName)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-800">{m.title}</h3>
                    {m.isDailyLimit && (
                      <span className="text-[10px] bg-[#FF6321]/10 text-[#FF6321] font-semibold px-1.5 py-0.2 rounded border border-[#FF6321]/30">
                        1일 1회
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-snug">{m.description}</p>
                </div>
              </div>

              {/* Reward Badge & Button */}
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="bg-[#E2EEF3] text-[#0086B3] font-bold text-xs px-2.5 py-1 rounded border border-[#779CB0]/50 flex items-center gap-1 font-mono">
                  <span>🫒</span>
                  <span>+{m.rewardOlives}알</span>
                </div>

                <button
                  onClick={() => handleOpenMission(m.id)}
                  disabled={isCompleted}
                  className={`px-3.5 py-1.5 rounded-md font-bold text-xs shadow-2xs transition-all flex items-center gap-1 ${
                    isCompleted
                      ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                      : 'bg-[#0086B3] hover:bg-[#007399] text-white active:scale-95'
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>오늘 완료</span>
                    </>
                  ) : (
                    <span>미션 수행</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- MODALS FOR MISSIONS --- */}

      {/* 1) Presentation Modal */}
      {activeModal === 'presentation' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border-2 border-indigo-600 shadow-2xl max-w-md w-full p-4 font-sans text-xs space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-indigo-900 flex items-center gap-1.5">
                <Mic className="w-4 h-4 text-indigo-600" />
                <span>1주제 발표하기 (보상: 올리브 2알)</span>
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 font-bold text-base">✕</button>
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-slate-700">발표 주제 선택</label>
              <select
                value={presTopic}
                onChange={(e) => setPresTopic(e.target.value)}
                className="w-full border border-slate-300 rounded p-2 bg-slate-50"
              >
                <option value="노아의 방주와 순종의 신앙">창세기 - 노아의 방주와 순종의 신앙</option>
                <option value="로마서 - 오직 의인은 믿음으로">로마서 - 오직 의인은 믿음으로</option>
                <option value="시편 - 여호와는 나의 목자시니">시편 - 여호와는 나의 목자시니</option>
                <option value="요한복음 - 참 빛이신 예수 그리스도">요한복음 - 참 빛이신 예수 그리스도</option>
              </select>

              <label className="block font-bold text-slate-700 pt-1">발표 요약 및 말씀 나눔</label>
              <textarea
                value={presScript}
                onChange={(e) => setPresScript(e.target.value)}
                placeholder="본 주제의 핵심 구절과 오늘 배운 깨달음을 자유롭게 정리해 보세요."
                className="w-full border border-slate-300 rounded p-2.5 h-24 focus:ring-1 focus:ring-indigo-500 resize-none"
              />
            </div>

            <div className="bg-indigo-50 p-2.5 rounded border border-indigo-200 text-[11px] text-indigo-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>발표 완수 시 <strong>발표 완료 횟수 +1회</strong> 및 <strong>그린올리브 2알</strong>이 지급됩니다!</span>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button onClick={() => setActiveModal(null)} className="bg-slate-100 px-3 py-1.5 rounded font-bold">취소</button>
              <button onClick={handleCompletePresentation} className="bg-indigo-600 text-white px-4 py-1.5 rounded font-bold shadow">
                발표 완료하기 🫒
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2) Evaluation Modal */}
      {activeModal === 'evaluation' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border-2 border-emerald-600 shadow-2xl max-w-md w-full p-4 font-sans text-xs space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-emerald-900 flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-emerald-600" />
                <span>1주제 평가하기 (보상: 올리브 5알)</span>
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 font-bold text-base">✕</button>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">평가할 발표 선택</label>
              <select
                onChange={(e) => {
                  const p = SAMPLE_PRESENTATIONS.find((item) => item.id === e.target.value);
                  if (p) setEvalSelected(p);
                }}
                className="w-full border border-slate-300 rounded p-2 bg-slate-50"
              >
                {SAMPLE_PRESENTATIONS.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.speaker}] {p.title} ({p.scripture})
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-emerald-50/70 p-2.5 rounded border border-emerald-200 space-y-1">
              <p className="font-bold text-emerald-950">{evalSelected.title}</p>
              <p className="text-[11px] text-emerald-800 leading-relaxed">{evalSelected.summary}</p>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">전달력 및 명확성</span>
                <span className="font-bold text-emerald-700 font-mono">★★★★★ (5/5)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">성경 체계 수립</span>
                <span className="font-bold text-emerald-700 font-mono">★★★★★ (5/5)</span>
              </div>

              <label className="block font-bold text-slate-700 pt-1">피드백 한 줄 소감</label>
              <input
                type="text"
                value={evalComment}
                onChange={(e) => setEvalComment(e.target.value)}
                className="w-full border border-slate-300 rounded p-2 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button onClick={() => setActiveModal(null)} className="bg-slate-100 px-3 py-1.5 rounded font-bold">취소</button>
              <button onClick={handleCompleteEvaluation} className="bg-emerald-600 text-white px-4 py-1.5 rounded font-bold shadow">
                평가 제출하기 (5🫒)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3) Listening Modal */}
      {activeModal === 'listening' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border-2 border-sky-600 shadow-2xl max-w-md w-full p-4 font-sans text-xs space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-sky-900 flex items-center gap-1.5">
                <Headphones className="w-4 h-4 text-sky-600" />
                <span>1주제 청취하기 (보상: 올리브 1알)</span>
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 font-bold text-base">✕</button>
            </div>

            <div className="bg-sky-50 p-3 rounded-lg border border-sky-200 text-slate-800 space-y-1">
              <p className="font-bold text-sky-950 text-sm">{listenSelected.title}</p>
              <p className="text-[11px] text-sky-700">발표자: {listenSelected.speaker} | 본문: {listenSelected.scripture}</p>
            </div>

            {/* Audio Player simulation */}
            <div className="bg-slate-900 text-white p-3 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="bg-sky-500 hover:bg-sky-600 p-2 rounded-full text-white transition-colors"
                >
                  {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <div className="flex-1 mx-3 bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-sky-400 h-full transition-all duration-300" style={{ width: `${audioProgress}%` }}></div>
                </div>
                <span className="font-mono text-[11px] text-sky-200">{audioProgress}%</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button onClick={() => setActiveModal(null)} className="bg-slate-100 px-3 py-1.5 rounded font-bold">취소</button>
              <button
                onClick={handleCompleteListening}
                className="px-4 py-1.5 rounded font-bold shadow bg-sky-600 text-white hover:bg-sky-700"
              >
                청취 완료하기 (1🫒)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4) Evangelism Modal */}
      {activeModal === 'evangelism' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border-2 border-rose-600 shadow-2xl max-w-md w-full p-4 font-sans text-xs space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-rose-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-600" />
                <span>사거리 전도 활동 기록 (보상: 올리브 2알)</span>
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 font-bold text-base">✕</button>
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-slate-700">전도 장소</label>
              <input
                type="text"
                value={evangelismLocation}
                onChange={(e) => setEvangelismLocation(e.target.value)}
                className="w-full border border-slate-300 rounded p-2"
                placeholder="예: 강남역 사거리, 신촌 대학가"
              />

              <label className="block font-bold text-slate-700 pt-1">전도 나눔 소감</label>
              <textarea
                value={evangelismNote}
                onChange={(e) => setEvangelismNote(e.target.value)}
                className="w-full border border-slate-300 rounded p-2 h-20 resize-none"
                placeholder="전도 현장에서의 은혜로운 에피소드를 적어주세요."
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button onClick={() => setActiveModal(null)} className="bg-slate-100 px-3 py-1.5 rounded font-bold">취소</button>
              <button onClick={handleCompleteEvangelism} className="bg-rose-600 text-white px-4 py-1.5 rounded font-bold shadow">
                전도 완수 제출 (2🫒)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5) Online Mission Modal */}
      {activeModal === 'online_mission' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border-2 border-amber-600 shadow-2xl max-w-md w-full p-4 font-sans text-xs space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-amber-900 flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-amber-600" />
                <span>온라인 선교 - 말씀 카드 전파 (보상: 올리브 1알)</span>
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 font-bold text-base">✕</button>
            </div>

            <div className="bg-gradient-to-br from-amber-500 to-amber-700 text-white p-4 rounded-xl border-2 border-amber-300 shadow-inner text-center space-y-2">
              <span className="text-2xl">🕊️</span>
              <h4 className="font-bold text-base text-yellow-200">{verseCard.title}</h4>
              <p className="text-xs font-serif leading-relaxed px-2">"{verseCard.text}"</p>
              <div className="text-[10px] text-amber-200 pt-1">#노아의방주 #성경말씀 #방주타고</div>
            </div>

            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(`[방주 타고 말씀 카드] ${verseCard.title} - ${verseCard.text}`);
                setCopiedSuccess(true);
                setTimeout(() => setCopiedSuccess(false), 2000);
              }}
              className="w-full bg-amber-100 text-amber-900 font-bold py-2 rounded border border-amber-300 hover:bg-amber-200 transition-colors flex items-center justify-center gap-1"
            >
              <span>{copiedSuccess ? '✅ 클립보드에 복사되었습니다!' : '📋 말씀 카드 문구 복사하기'}</span>
            </button>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button onClick={() => setActiveModal(null)} className="bg-slate-100 px-3 py-1.5 rounded font-bold">취소</button>
              <button onClick={handleCompleteOnlineMission} className="bg-amber-600 text-white px-4 py-1.5 rounded font-bold shadow">
                선교 공유 완료 (1🫒)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
