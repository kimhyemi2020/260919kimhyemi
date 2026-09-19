import { AlertCircle, ArrowLeft, ArrowRight, Check, HelpCircle, Smartphone, Sparkles, Target } from 'lucide-react';
import React, { useState } from 'react';
import { TopicConfig } from '../types';

interface DataInputStepProps {
  nickname: string;
  topic: TopicConfig;
  initialVarA: number | null;
  initialVarB: number | null;
  onBack: () => void;
  onSubmit: (varA: number, varB: number) => void;
}

export const DataInputStep: React.FC<DataInputStepProps> = ({
  nickname,
  topic,
  initialVarA,
  initialVarB,
  onBack,
  onSubmit,
}) => {
  const [varA, setVarA] = useState<number | null>(initialVarA);
  const [varB, setVarB] = useState<number | null>(initialVarB);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isFormComplete = varA !== null && varB !== null;

  const handleNext = () => {
    if (varA === null && varB === null) {
      setErrorMsg('두 변수(A, B) 항목을 모두 선택해주세요.');
      return;
    }
    if (varA === null) {
      setErrorMsg(`질문 A (${topic.variableA.name})를 선택해주세요.`);
      return;
    }
    if (varB === null) {
      setErrorMsg(`질문 B (${topic.variableB.name})를 선택해주세요.`);
      return;
    }

    setErrorMsg(null);
    onSubmit(varA, varB);
  };

  const selectedOptionA = topic.variableA.options.find((o) => o.value === varA);
  const selectedOptionB = topic.variableB.options.find((o) => o.value === varB);

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 px-4 sm:px-6">
      {/* Top Breadcrumb & Title */}
      <div className="flex items-center justify-between mb-6">
        <button
          id="btn-back-to-nickname"
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>닉네임 / 주제 변경</span>
        </button>

        <div className="text-right">
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
            학생: <strong>{nickname}</strong>
          </span>
        </div>
      </div>

      <div className="text-center mb-8">
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full">
          2단계 · 5점 척도 데이터 수집
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
          {topic.title}
        </h2>
        <p className="text-sm text-slate-600 mt-1.5 max-w-xl mx-auto">
          두 가지 변수에 대해 어제와 오늘의 실제 경험을 솔직하게 5점 척도로 응답해주세요.
        </p>
      </div>

      {errorMsg && (
        <div
          id="data-input-error-banner"
          className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-medium flex items-center gap-2.5 animate-in fade-in"
        >
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="space-y-8">
        {/* Variable A Section */}
        <section
          id="section-variable-a"
          className="bg-white rounded-3xl p-5 sm:p-7 shadow-lg shadow-slate-100 border border-slate-200"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wide">
                  변수 A (독립변수 후보)
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {topic.variableA.question}
                </h3>
              </div>
            </div>

            {selectedOptionA && (
              <span className="self-start sm:self-auto text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                선택됨: {selectedOptionA.badge} ({selectedOptionA.label})
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {topic.variableA.options.map((opt) => {
              const isSelected = varA === opt.value;
              return (
                <button
                  key={opt.value}
                  id={`btn-vara-scale-${opt.value}`}
                  type="button"
                  onClick={() => {
                    setVarA(opt.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between group ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-200 shadow-sm'
                      : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-lg ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-700 group-hover:bg-blue-100 group-hover:text-blue-700'
                      }`}
                    >
                      {opt.badge}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{opt.label}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      {opt.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Variable B Section */}
        <section
          id="section-variable-b"
          className="bg-white rounded-3xl p-5 sm:p-7 shadow-lg shadow-slate-100 border border-slate-200"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-violet-600 uppercase tracking-wide">
                  변수 B (종속변수 후보)
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {topic.variableB.question}
                </h3>
              </div>
            </div>

            {selectedOptionB && (
              <span className="self-start sm:self-auto text-xs font-semibold px-3 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-100">
                선택됨: {selectedOptionB.badge} ({selectedOptionB.label})
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {topic.variableB.options.map((opt) => {
              const isSelected = varB === opt.value;
              return (
                <button
                  key={opt.value}
                  id={`btn-varb-scale-${opt.value}`}
                  type="button"
                  onClick={() => {
                    setVarB(opt.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between group ${
                    isSelected
                      ? 'border-violet-600 bg-violet-50/60 ring-2 ring-violet-200 shadow-sm'
                      : 'border-slate-200 hover:border-violet-300 hover:bg-slate-50 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-lg ${
                        isSelected
                          ? 'bg-violet-600 text-white'
                          : 'bg-slate-100 text-slate-700 group-hover:bg-violet-100 group-hover:text-violet-700'
                      }`}
                    >
                      {opt.badge}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-violet-600" />}
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{opt.label}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      {opt.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Live Selection Summary Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white shadow-xs text-indigo-600 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-xs sm:text-sm text-slate-700">
              <span className="font-bold text-slate-900">내 응답 좌표 미리보기: </span>
              {isFormComplete ? (
                <span className="text-indigo-900 font-semibold">
                  (X: {topic.variableA.name} {varA}점, Y: {topic.variableB.name} {varB}점)
                </span>
              ) : (
                <span className="text-slate-500">
                  두 문항을 모두 선택하시면 2차원 산점도 좌표가 생성됩니다.
                </span>
              )}
            </div>
          </div>

          <button
            id="btn-submit-data"
            type="button"
            onClick={handleNext}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
              isFormComplete
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 cursor-pointer active:scale-98'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <span>상관관계 차트 및 리포트 보기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
