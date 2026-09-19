import {
  AlertTriangle,
  BookOpen,
  Check,
  Headphones,
  Info,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Square,
  Volume2,
  VolumeX,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { speechService } from '../services/speech';
import { CorrelationResult, StudentRecord, TopicConfig } from '../types';

interface MultimodalReportSectionProps {
  topic: TopicConfig;
  myRecord: StudentRecord;
  correlation: CorrelationResult;
}

export const MultimodalReportSection: React.FC<MultimodalReportSectionProps> = ({
  topic,
  myRecord,
  correlation,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [ttsSupported, setTtsSupported] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'briefing' | 'education'>('briefing');

  useEffect(() => {
    setTtsSupported(speechService.isSupported());
    return () => {
      speechService.stop();
    };
  }, []);

  // When correlation or myRecord changes, stop any running speech
  useEffect(() => {
    if (isPlaying) {
      speechService.stop();
      setIsPlaying(false);
      setIsPaused(false);
    }
  }, [correlation.audioScript]);

  const handlePlayTTS = () => {
    if (isPaused) {
      speechService.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    setIsPlaying(true);
    setIsPaused(false);

    speechService.speak(correlation.audioScript, {
      rate: speechRate,
      onStart: () => {
        setIsPlaying(true);
        setIsPaused(false);
      },
      onEnd: () => {
        setIsPlaying(false);
        setIsPaused(false);
      },
      onError: () => {
        setIsPlaying(false);
        setIsPaused(false);
      },
      onPause: () => {
        setIsPaused(true);
      },
      onResume: () => {
        setIsPaused(false);
      },
    });
  };

  const handlePauseTTS = () => {
    speechService.pause();
    setIsPaused(true);
  };

  const handleStopTTS = () => {
    speechService.stop();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const myOptionA = topic.variableA.options.find((o) => o.value === myRecord.variableA_value);
  const myOptionB = topic.variableB.options.find((o) => o.value === myRecord.variableB_value);

  return (
    <div
      id="multimodal-report-section"
      className="bg-white rounded-3xl p-5 sm:p-8 shadow-xl shadow-slate-100 border border-slate-200 mt-6"
    >
      {/* Top Banner: Multimodal Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded">
                멀티모달 AI 브리핑
              </span>
              <span className="text-[11px] text-slate-400">Web Speech API (TTS)</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              데이터 상관관계 분석 리포트
            </h3>
          </div>
        </div>

        {/* Tab switch between Briefing and Educational notes */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('briefing')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'briefing'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            핵심 분석 리포트
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('education')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'education'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>정보과 핵심 개념</span>
          </button>
        </div>
      </div>

      {activeTab === 'briefing' ? (
        <div className="mt-6 space-y-6">
          {/* Main Visual Text Briefing Callout */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-indigo-50/80 via-white to-violet-50/60 border border-indigo-100/80 relative overflow-hidden">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-xs shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                    분석 요약
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    피어슨 상관계수 r = {correlation.r} ({correlation.strength} {correlation.direction})
                  </span>
                </div>

                <p className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  "{correlation.summaryText}"
                </p>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                  {myRecord.nickname} 님의 응답은{' '}
                  <strong className="text-indigo-900 font-semibold">
                    {topic.variableA.name} {myOptionA?.label}({myRecord.variableA_value}점)
                  </strong>
                  ,{' '}
                  <strong className="text-indigo-900 font-semibold">
                    {topic.variableB.name} {myOptionB?.label}({myRecord.variableB_value}점)
                  </strong>
                  으로 나타났습니다.
                </p>
              </div>
            </div>

            {/* Sound Wave Animation when TTS is active */}
            {isPlaying && (
              <div className="mt-4 pt-3 border-t border-indigo-100/60 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600">
                  <Volume2 className="w-4 h-4 animate-bounce" />
                  <span>음성 리포트가 재생 중입니다...</span>
                </div>
                <div className="flex items-center gap-1 h-5">
                  <span className="w-1 bg-indigo-600 rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-3"></span>
                  <span className="w-1 bg-indigo-600 rounded-full animate-[pulse_0.6s_ease-in-out_infinite_0.2s] h-5"></span>
                  <span className="w-1 bg-indigo-600 rounded-full animate-[pulse_0.7s_ease-in-out_infinite_0.4s] h-4"></span>
                  <span className="w-1 bg-indigo-600 rounded-full animate-[pulse_0.5s_ease-in-out_infinite_0.1s] h-6"></span>
                  <span className="w-1 bg-indigo-600 rounded-full animate-[pulse_0.9s_ease-in-out_infinite_0.3s] h-2"></span>
                </div>
              </div>
            )}
          </div>

          {/* TTS Audio Controls Bar */}
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Primary Listen Button */}
              {!isPlaying ? (
                <button
                  id="btn-play-tts"
                  type="button"
                  onClick={handlePlayTTS}
                  disabled={!ttsSupported}
                  className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-sm shadow-md shadow-indigo-200 hover:shadow-indigo-300 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>리포트 듣기 (TTS)</span>
                </button>
              ) : isPaused ? (
                <button
                  id="btn-resume-tts"
                  type="button"
                  onClick={handlePlayTTS}
                  className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>이어서 듣기</span>
                </button>
              ) : (
                <button
                  id="btn-pause-tts"
                  type="button"
                  onClick={handlePauseTTS}
                  className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-98 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Pause className="w-4 h-4 fill-white" />
                  <span>일시정지</span>
                </button>
              )}

              {/* Stop button */}
              {(isPlaying || isPaused) && (
                <button
                  id="btn-stop-tts"
                  type="button"
                  onClick={handleStopTTS}
                  className="px-3.5 py-3 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Square className="w-3.5 h-3.5 fill-slate-700" />
                  <span>정지</span>
                </button>
              )}

              {!ttsSupported && (
                <span className="text-xs text-rose-500 flex items-center gap-1">
                  <VolumeX className="w-4 h-4" />
                  브라우저가 Web Speech API를 지원하지 않습니다.
                </span>
              )}
            </div>

            {/* Speech Rate Controls */}
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="font-semibold text-slate-700">배속:</span>
              {[0.8, 1.0, 1.2].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => {
                    setSpeechRate(rate);
                    if (isPlaying) {
                      handleStopTTS();
                    }
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    speechRate === rate
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>

          {/* Full Voice Script Preview (collapsible/scrollable) */}
          <div className="p-4 rounded-2xl bg-slate-50/60 border border-slate-200 text-xs text-slate-600">
            <span className="font-bold text-slate-800 block mb-1">
              🎙️ 전체 음성 대본(Script) 미리보기:
            </span>
            <p className="leading-relaxed text-slate-700 italic">
              "{correlation.audioScript}"
            </p>
          </div>
        </div>
      ) : (
        /* Educational Deep-Dive Tab */
        <div className="mt-6 space-y-4 text-xs sm:text-sm text-slate-700">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>핵심 주의! 상관관계(Correlation) ≠ 인과관계(Causation)</span>
            </div>
            <p className="leading-relaxed text-xs sm:text-sm text-amber-800">
              스마트폰 사용 시간이 길수록 수업 집중도가 낮아지는 '음의 상관관계'가 나타났다고 해서,
              반드시 <strong>"스마트폰이 집중도 하락의 유일한 원인이다"</strong>라고 단정할 수는 없습니다!
              예를 들어, 어제 늦게까지 과제를 하느라 피곤해서(제3의 변수 / 교란 변수) 스마트폰도 보고 수업도 졸렸을 수 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-indigo-700 text-xs block">
                양의 상관관계 (r &gt; 0)
              </span>
              <p className="text-xs text-slate-600">
                한 변수가 증가할 때 다른 변수도 대체로 증가하는 경향. (산점도 점들이 우상향 방향으로 분포)
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-rose-700 text-xs block">
                음의 상관관계 (r &lt; 0)
              </span>
              <p className="text-xs text-slate-600">
                한 변수가 증가할 때 다른 변수는 감소하는 경향. (산점도 점들이 우하향 방향으로 분포)
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-700 text-xs block">
                상관관계 없음 (r ≈ 0)
              </span>
              <p className="text-xs text-slate-600">
                두 변수 사이에 선형적인 규칙성이 없이 원형이나 무작위로 흩어져 있는 분포.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
