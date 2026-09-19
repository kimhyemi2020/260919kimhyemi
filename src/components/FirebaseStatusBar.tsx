import { CheckCircle2, Cloud, Database, ExternalLink, HardDrive, Info, Sparkles, X } from 'lucide-react';
import React, { useState } from 'react';
import { getFirebaseConfig } from '../services/firebase';
import { FirebaseSaveState } from '../types';

interface FirebaseStatusBarProps {
  saveState: FirebaseSaveState;
}

export const FirebaseStatusBar: React.FC<FirebaseStatusBarProps> = ({ saveState }) => {
  const [showDetails, setShowDetails] = useState(false);
  const config = getFirebaseConfig();

  return (
    <>
      <div
        id="firebase-status-bar"
        className="w-full bg-white/90 backdrop-blur-xs border-b border-slate-200/80 px-4 py-2 text-xs text-slate-600 flex items-center justify-between transition-all"
      >
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between flex-wrap gap-2">
          {/* Connection status */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 font-medium">
              <Database className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-slate-800 font-semibold">Firestore 연동:</span>
            </span>

            {saveState.isConfigured ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>클라우드 활성 ({config.projectId || '연결됨'} · student_correlations)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60 font-medium">
                <HardDrive className="w-3 h-3 text-amber-600" />
                로컬 세션 모드 (독립 실습 가능)
              </span>
            )}
          </div>

          {/* Save Status */}
          <div className="flex items-center gap-3">
            {saveState.isSaving && (
              <span className="inline-flex items-center gap-1.5 text-indigo-600 font-medium animate-pulse">
                <Cloud className="w-3.5 h-3.5 animate-bounce" />
                Firestore 저장 중...
              </span>
            )}

            {saveState.isSaved && !saveState.isSaving && (
              <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {saveState.isLocalStorageOnly
                  ? '로컬 기록 완료'
                  : `Firestore 저장 완료 (${saveState.docId ? saveState.docId.slice(0, 8) : '성공'})`}
              </span>
            )}

            {saveState.saveError && (
              <span className="text-rose-600 font-medium">
                ⚠️ 저장 알림: {saveState.saveError}
              </span>
            )}

            <button
              id="btn-firebase-guide"
              type="button"
              onClick={() => setShowDetails(true)}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-indigo-600 underline cursor-pointer hover:bg-slate-100 px-1.5 py-0.5 rounded transition-colors"
            >
              <Info className="w-3 h-3" />
              <span>연동 세부정보 & 규칙</span>
            </button>
          </div>
        </div>
      </div>

      {/* Details modal for school teachers / reviewers */}
      {showDetails && (
        <div
          id="modal-firebase-details"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Firebase Firestore 연동 상태</h3>
                  <p className="text-xs text-slate-500">Google Cloud Firestore 자동 프로비저닝 완료</p>
                </div>
              </div>
              <button
                id="btn-close-firebase-modal"
                onClick={() => setShowDetails(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs text-slate-600 leading-relaxed">
              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/80 text-emerald-900">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Firebase Firestore 연결 활성화됨</span>
                </div>
                <div className="space-y-1 font-mono text-[11px] text-emerald-800">
                  <p>• 프로젝트 ID: <strong>{config.projectId || 'ageless-orbit-zmn89'}</strong></p>
                  <p>• 컬렉션: <strong>student_correlations</strong></p>
                  {config.firestoreDatabaseId && (
                    <p>• 데이터베이스 ID: <strong>{config.firestoreDatabaseId}</strong></p>
                  )}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  저장 대상 문서 스키마
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                  <li><span className="font-mono text-slate-700">nickname</span>: 학생 닉네임 (2~8자)</li>
                  <li><span className="font-mono text-slate-700">variableA_value</span>: 변수 A 5점 척도 (1~5 정수)</li>
                  <li><span className="font-mono text-slate-700">variableB_value</span>: 변수 B 5점 척도 (1~5 정수)</li>
                  <li><span className="font-mono text-slate-700">timestamp</span>: Firestore serverTimestamp()</li>
                </ul>
              </div>

              <div className="p-2.5 bg-indigo-50/60 rounded-xl border border-indigo-100 text-indigo-900">
                <span className="font-semibold block mb-0.5">보안 규칙 (firestore.rules) 배포 완료:</span>
                비로그인 학생의 5점 척도 설문 쓰기(create)가 허용되며, 임의 수정 및 삭제(update, delete)는 원천 차단됩니다.
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                id="btn-confirm-firebase-modal"
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
