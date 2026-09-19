import { ArrowRight, CheckCircle, HelpCircle, Layers, Lightbulb, Sparkles, UserCheck } from 'lucide-react';
import React, { useState } from 'react';
import { TOPICS } from '../data/topics';
import { TopicConfig } from '../types';

interface NicknameStepProps {
  initialNickname: string;
  selectedTopic: TopicConfig;
  onSelectTopic: (topic: TopicConfig) => void;
  onSubmit: (nickname: string) => void;
}

export const NicknameStep: React.FC<NicknameStepProps> = ({
  initialNickname,
  selectedTopic,
  onSelectTopic,
  onSubmit,
}) => {
  const [nickname, setNickname] = useState(initialNickname);
  const [error, setError] = useState<string | null>(null);

  const trimmed = nickname.trim();
  const isValid = trimmed.length >= 2 && trimmed.length <= 8;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trimmed.length < 2) {
      setError('닉네임을 2자 이상 입력해주세요.');
      return;
    }
    if (trimmed.length > 8) {
      setError('닉네임은 8자 이하로 입력해주세요.');
      return;
    }
    setError(null);
    onSubmit(trimmed);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
      {/* Intro Hero Badge & Title */}
      <div className="text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>고등학교 정보과 탐구 실습</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          변수 간의 상관관계를 직접 확인해보세요!
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
          어려운 통계 수식 대신, 내 일상 데이터와 학급 친구들의 데이터가 만들어내는
          <strong className="text-indigo-600 font-semibold"> 시각적 산점도</strong>와
          <strong className="text-indigo-600 font-semibold"> 음성 브리핑</strong>으로 상관관계를 탐색합니다.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-200/80">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Nickname input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="input-nickname"
                className="block text-sm font-bold text-slate-800 flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4 text-indigo-600" />
                <span>실습 닉네임 설정</span>
                <span className="text-xs text-rose-500 font-medium">*필수</span>
              </label>
              <span
                className={`text-xs ${
                  trimmed.length > 8 || (trimmed.length > 0 && trimmed.length < 2)
                    ? 'text-rose-500 font-medium'
                    : 'text-slate-400'
                }`}
              >
                {trimmed.length}/8자 (2~8자)
              </span>
            </div>

            <div className="relative">
              <input
                id="input-nickname"
                type="text"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="예: 코딩꿈나무, 정보왕 (2~8자)"
                maxLength={8}
                className={`w-full px-4 py-3.5 rounded-2xl border text-sm sm:text-base font-medium transition-all outline-none ${
                  error
                    ? 'border-rose-400 focus:ring-4 focus:ring-rose-100 bg-rose-50/20'
                    : 'border-slate-300 hover:border-slate-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 bg-slate-50/50 focus:bg-white'
                }`}
                autoFocus
              />
              {isValid && (
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-500">
                  <CheckCircle className="w-5 h-5" />
                </div>
              )}
            </div>

            {error ? (
              <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                {error}
              </p>
            ) : (
              <p className="mt-1.5 text-xs text-slate-500">
                로그인이 필요 없으며, 입력한 닉네임은 차트 상에서 내 위치를 식별하는 용도로만 쓰입니다.
              </p>
            )}
          </div>

          {/* Topic Selection */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-bold text-slate-800 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>탐구 주제 선택</span>
              </label>
              <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-full">
                수업 기본 주제 포함 3종
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {TOPICS.map((topic) => {
                const isSelected = selectedTopic.id === topic.id;
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => onSelectTopic(topic)}
                    className={`text-left p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-2 ring-indigo-200/50'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                          {topic.category.split(' ')[0]}
                        </span>
                        {topic.id === 'smartphone-focus' && (
                          <span className="text-[10px] bg-indigo-600 text-white font-bold px-1.5 py-0.2 rounded-md">
                            추천
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">
                        {topic.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                        {topic.variableA.name} ↔ {topic.variableB.name}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-medium text-slate-600">
                      <span>가설 방향</span>
                      <span className="text-indigo-700 font-semibold">
                        {topic.expectedCorrelation === 'negative'
                          ? '음(-)의 상관'
                          : topic.expectedCorrelation === 'positive'
                          ? '양(+)의 상관'
                          : '상관 없음'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Educational Preview Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>오늘의 학습 목표 (고등학교 정보 교육과정 연계)</span>
            </div>
            <ul className="space-y-1 pl-4 list-disc text-slate-600">
              <li>독립변수(원인 후보)와 종속변수(결과 후보)의 개념 이해</li>
              <li>2차원 산점도(Scatter Plot)를 통해 데이터의 경향성과 산포도 해석</li>
              <li>피어슨 상관계수(r)의 부호(+, -)와 절댓값 크기(0~1)의 의미 탐구</li>
              <li>상관관계와 인과관계(원인과 결과)의 결정적 차이 파악</li>
            </ul>
          </div>

          {/* Action button */}
          <div className="pt-2">
            <button
              id="btn-submit-nickname"
              type="submit"
              disabled={!isValid}
              className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-md ${
                isValid
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 hover:shadow-indigo-300 cursor-pointer translate-y-0 active:translate-y-0.5'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <span>데이터 입력하러 가기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
