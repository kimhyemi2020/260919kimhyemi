import confetti from 'canvas-confetti';
import React, { useEffect, useMemo, useState } from 'react';
import { ConceptExplainerModal } from './components/ConceptExplainerModal';
import { DataInputStep } from './components/DataInputStep';
import { FirebaseStatusBar } from './components/FirebaseStatusBar';
import { Header } from './components/Header';
import { MultimodalReportSection } from './components/MultimodalReportSection';
import { NicknameStep } from './components/NicknameStep';
import { VisualizationSection } from './components/VisualizationSection';
import {
  generateCorrelationAnalysis,
  PEER_COHORT_DATA,
  TOPICS,
} from './data/topics';
import {
  isFirebaseConfigured,
  saveStudentCorrelation,
} from './services/firebase';
import { FirebaseSaveState, StudentRecord, TopicConfig } from './types';

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [nickname, setNickname] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<TopicConfig>(TOPICS[0]);
  const [variableA, setVariableA] = useState<number | null>(null);
  const [variableB, setVariableB] = useState<number | null>(null);
  const [isConceptModalOpen, setIsConceptModalOpen] = useState<boolean>(false);

  // Firebase save state
  const [firebaseState, setFirebaseState] = useState<FirebaseSaveState>({
    isConfigured: isFirebaseConfigured(),
    isSaving: false,
    isSaved: false,
    saveError: null,
    docId: null,
    savedAt: null,
    isLocalStorageOnly: !isFirebaseConfigured(),
  });

  // Re-check firebase configured status on load
  useEffect(() => {
    setFirebaseState((prev) => ({
      ...prev,
      isConfigured: isFirebaseConfigured(),
      isLocalStorageOnly: !isFirebaseConfigured(),
    }));
  }, []);

  // Peer cohort data for current topic
  const currentCohort = useMemo(() => {
    return PEER_COHORT_DATA[selectedTopic.id] || PEER_COHORT_DATA['smartphone-focus'];
  }, [selectedTopic.id]);

  // Current student record
  const myRecord: StudentRecord = useMemo(() => {
    return {
      nickname: nickname || '나',
      variableA_value: variableA ?? 3,
      variableB_value: variableB ?? 3,
      topicId: selectedTopic.id,
      timestamp: '방금 전',
      isMyData: true,
    };
  }, [nickname, variableA, variableB, selectedTopic.id]);

  // Combined dataset for calculations
  const combinedDataset = useMemo(() => {
    return [...currentCohort, myRecord];
  }, [currentCohort, myRecord]);

  // Correlation analysis result
  const correlationAnalysis = useMemo(() => {
    return generateCorrelationAnalysis(selectedTopic, combinedDataset, myRecord);
  }, [selectedTopic, combinedDataset, myRecord]);

  // Step 1: Nickname submitted
  const handleNicknameSubmit = (enteredNickname: string) => {
    setNickname(enteredNickname);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 2: Data submitted -> Save to Firestore & move to Step 3
  const handleDataSubmit = async (varA: number, varB: number) => {
    setVariableA(varA);
    setVariableB(varB);
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Joyful celebration animation for high school student
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch (e) {
      // ignore
    }

    // Save to Firestore 'student_correlations' collection
    setFirebaseState((prev) => ({
      ...prev,
      isSaving: true,
      saveError: null,
    }));

    try {
      const result = await saveStudentCorrelation({
        nickname,
        variableA_value: varA,
        variableB_value: varB,
        topicId: selectedTopic.id,
        timestamp: new Date().toISOString(),
      });

      setFirebaseState((prev) => ({
        ...prev,
        isSaving: false,
        isSaved: true,
        docId: result.docId,
        isLocalStorageOnly: result.isLocalStorageOnly,
        savedAt: result.timestamp,
        saveError: result.success ? null : result.message,
      }));
    } catch (err: any) {
      setFirebaseState((prev) => ({
        ...prev,
        isSaving: false,
        saveError: err?.message || '저장 오류',
      }));
    }
  };

  // Live modifier on Step 3 for interactive simulation
  const handleUpdateMyData = (newVarA: number, newVarB: number) => {
    setVariableA(newVarA);
    setVariableB(newVarB);
  };

  // Reset to initial screen
  const handleReset = () => {
    setCurrentStep(1);
    setVariableA(null);
    setVariableB(null);
    setFirebaseState((prev) => ({
      ...prev,
      isSaving: false,
      isSaved: false,
      saveError: null,
      docId: null,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Firebase Status Bar */}
      <FirebaseStatusBar saveState={firebaseState} />

      {/* Main Header */}
      <Header
        currentStep={currentStep}
        nickname={nickname}
        topicTitle={selectedTopic.title}
        onReset={handleReset}
        onOpenConcepts={() => setIsConceptModalOpen(true)}
      />

      {/* Body Views */}
      <main className="flex-1 pb-16">
        {currentStep === 1 && (
          <NicknameStep
            initialNickname={nickname}
            selectedTopic={selectedTopic}
            onSelectTopic={(topic) => setSelectedTopic(topic)}
            onSubmit={handleNicknameSubmit}
          />
        )}

        {currentStep === 2 && (
          <DataInputStep
            nickname={nickname}
            topic={selectedTopic}
            initialVarA={variableA}
            initialVarB={variableB}
            onBack={() => setCurrentStep(1)}
            onSubmit={handleDataSubmit}
          />
        )}

        {currentStep === 3 && (
          <div className="max-w-6xl mx-auto py-6 sm:py-8 px-4 sm:px-6">
            {/* Top Navigation banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-0.5 rounded">
                  3단계 · 결과 시각화 및 멀티모달 분석
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  {selectedTopic.title} 상관관계 리포트
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="btn-modify-response"
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
                >
                  설문 답변 수정하기
                </button>
                <button
                  id="btn-retry-all"
                  type="button"
                  onClick={handleReset}
                  className="px-3.5 py-2 rounded-xl bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors cursor-pointer"
                >
                  새로운 주제 탐구
                </button>
              </div>
            </div>

            {/* Screen 3: Interactive Visualization (Scatter & Bar Chart) */}
            <VisualizationSection
              topic={selectedTopic}
              myRecord={myRecord}
              cohortData={currentCohort}
              correlation={correlationAnalysis}
              onUpdateMyData={handleUpdateMyData}
            />

            {/* Screen 4: Multimodal Analysis Report (TTS + Text Briefing) */}
            <MultimodalReportSection
              topic={selectedTopic}
              myRecord={myRecord}
              correlation={correlationAnalysis}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 고등학교 정보 수업 교육용 웹앱 · 데이터 상관관계 탐색 대시보드</p>
          <p className="text-slate-400">
            Powered by React, Tailwind CSS, Recharts, Web Speech API & Firebase Firestore
          </p>
        </div>
      </footer>

      {/* Concept Dictionary Modal */}
      <ConceptExplainerModal
        isOpen={isConceptModalOpen}
        onClose={() => setIsConceptModalOpen(false)}
      />
    </div>
  );
}
