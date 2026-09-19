import { BarChart3, BookOpen, ChevronRight, RotateCcw, Sparkles, User } from 'lucide-react';
import React from 'react';

interface HeaderProps {
  currentStep: number;
  nickname: string;
  topicTitle: string;
  onReset: () => void;
  onOpenConcepts: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  nickname,
  topicTitle,
  onReset,
  onOpenConcepts,
}) => {
  const steps = [
    { num: 1, label: '닉네임 입력' },
    { num: 2, label: '데이터 설문' },
    { num: 3, label: '시각화 & 음성 리포트' },
  ];

  return (
    <header className="bg-white border-b border-slate-200/90 shadow-xs sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & Educational Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-100 shrink-0">
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold tracking-wider text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                  정보 교육 · 데이터 과학
                </span>
                <span className="hidden md:inline-flex text-[11px] text-slate-400">
                  고등학교 실습 웹앱
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>데이터 상관관계 탐색 대시보드</span>
              </h1>
            </div>
          </div>

          {/* Step Progress Indicators (Desktop / Tablet) */}
          <nav aria-label="진행 단계" className="hidden lg:flex items-center gap-2">
            {steps.map((step, idx) => {
              const isActive = currentStep === step.num;
              const isDone = currentStep > step.num;
              return (
                <React.Fragment key={step.num}>
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : isDone
                        ? 'bg-slate-100 text-slate-700 font-medium'
                        : 'text-slate-400'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                        isActive
                          ? 'bg-white text-indigo-600 font-bold'
                          : isDone
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {step.num}
                    </span>
                    <span>{step.label}</span>
                  </div>
                  {idx < steps.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  )}
                </React.Fragment>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              id="btn-open-concept-guide"
              type="button"
              onClick={onOpenConcepts}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              title="상관관계 개념 사전 보기"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">개념 사전</span>
            </button>

            {nickname && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium">
                <User className="w-3.5 h-3.5 text-indigo-600" />
                <span className="font-bold text-slate-900">{nickname}</span>
                <span className="text-slate-400">학생</span>
              </div>
            )}

            {currentStep > 1 && (
              <button
                id="btn-header-reset"
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                title="처음으로 돌아가기"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">다시 하기</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
