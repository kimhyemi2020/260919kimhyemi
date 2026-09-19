import { BookOpen, Check, ExternalLink, HelpCircle, X } from 'lucide-react';
import React from 'react';

interface ConceptExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConceptExplainerModal: React.FC<ConceptExplainerModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const concepts = [
    {
      term: '산점도 (Scatter Plot)',
      meaning:
        '직교 좌표계(X축, Y축)를 이용하여 두 변수 간의 관계를 점(Point)들로 직관적으로 나타낸 통계 그래프입니다.',
      point: '점들이 모여있는 형태와 기울기를 통해 두 변수가 어떻게 상호작용하는지 한눈에 파악할 수 있습니다.',
    },
    {
      term: '피어슨 상관계수 (r)',
      meaning:
        '두 변수 사이의 선형적 연관성 강도와 방향을 -1부터 +1 사이의 수치로 나타낸 통계 지표입니다.',
      point:
        'r = +1: 완벽한 양의 상관 / r = -1: 완벽한 음의 상관 / r = 0: 선형 상관관계 없음.',
    },
    {
      term: '양의 상관관계 (+)',
      meaning:
        'X축 변수가 증가할 때 Y축 변수도 함께 증가하는 경향성 (예: 수면 시간과 아침 활력도). 산점도에서 우상향(↗) 방향으로 분포합니다.',
      point: '기울기가 양수(+)인 직선 주변에 점들이 밀집됩니다.',
    },
    {
      term: '음의 상관관계 (-)',
      meaning:
        'X축 변수가 증가할 때 Y축 변수는 반대로 감소하는 경향성 (예: 심야 스마트폰 사용 시간과 수업 집중도). 산점도에서 우하향(↘) 방향으로 분포합니다.',
      point: '기울기가 음수(-)인 직선 주변에 점들이 밀집됩니다.',
    },
    {
      term: '상관관계 vs 인과관계',
      meaning:
        '가장 중요한 데이터 과학 윤리 및 논리적 오류 방지 개념! 상관관계는 "두 현상이 함께 변한다"는 것만 보여줄 뿐, "하나가 다른 하나의 직접적 원인이다"라는 증거가 되지 않습니다.',
      point:
        '숨겨진 제3의 변수(예: 스트레스, 취침 시간 등)가 영향을 주었을 가능성을 항상 비판적으로 검토해야 합니다.',
    },
  ];

  return (
    <div
      id="modal-concept-dictionary"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-indigo-50 text-indigo-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                정보과 데이터 과학 개념 사전
              </h3>
              <p className="text-xs text-slate-500">
                고등학교 정보 교육과정 핵심 통계 및 데이터 분석 용어
              </p>
            </div>
          </div>
          <button
            id="btn-close-concept-modal"
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 overflow-y-auto space-y-4 pr-1">
          {concepts.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-200 transition-colors"
            >
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 text-indigo-900">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                {item.term}
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
                {item.meaning}
              </p>
              <p className="text-xs text-indigo-700 font-medium mt-1.5 bg-indigo-50/60 p-2 rounded-xl border border-indigo-100/60">
                💡 <strong>핵심 탐구 팁:</strong> {item.point}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            id="btn-close-concept-bottom"
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
          >
            이해했습니다
          </button>
        </div>
      </div>
    </div>
  );
};
