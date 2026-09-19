export interface ScaleOption {
  value: number;
  label: string;
  description: string;
  badge?: string;
}

export interface TopicConfig {
  id: string;
  title: string;
  category: string;
  description: string;
  hypothesis: string;
  expectedCorrelation: 'negative' | 'positive' | 'none';
  variableA: {
    name: string;
    question: string;
    unit: string;
    options: ScaleOption[];
  };
  variableB: {
    name: string;
    question: string;
    unit: string;
    options: ScaleOption[];
  };
}

export interface StudentRecord {
  id?: string;
  nickname: string;
  variableA_value: number;
  variableB_value: number;
  topicId: string;
  timestamp: string;
  isMyData?: boolean;
}

export type ChartType = 'scatter' | 'bar';

export interface CorrelationResult {
  r: number; // Pearson correlation coefficient (-1 to 1)
  direction: '양의 상관관계 (+)' | '음의 상관관계 (-)' | '상관관계 없음 (0 근처)';
  strength: '강한' | '뚜렷한' | '약한' | '거의 없는';
  summaryText: string;
  detailedReport: string;
  audioScript: string;
  trendLineSlope: number;
  trendLineIntercept: number;
}

export interface FirebaseSaveState {
  isConfigured: boolean;
  isSaving: boolean;
  isSaved: boolean;
  saveError: string | null;
  docId: string | null;
  savedAt: string | null;
  isLocalStorageOnly: boolean;
}
