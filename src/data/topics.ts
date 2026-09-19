import { CorrelationResult, StudentRecord, TopicConfig } from '../types';

export const TOPICS: TopicConfig[] = [
  {
    id: 'smartphone-focus',
    title: '스마트폰 사용 시간과 수업 집중도',
    category: '학교 생활 및 디지털 습관',
    description: '어제 사용한 스마트폰 시간과 오늘 수업 시간에 느낀 집중도 사이의 관계를 조사합니다.',
    hypothesis: '스마트폰 사용 시간이 길어질수록 수면 부족이나 뇌 피로로 인해 수업 집중도가 낮아질 것이다.',
    expectedCorrelation: 'negative',
    variableA: {
      name: '일일 스마트폰 사용 시간',
      question: 'A. 어제 스마트폰을 얼마나 사용했나요?',
      unit: '시간',
      options: [
        { value: 1, label: '1시간 미만', description: '매우 적게 사용함 (학습/필수 연락 위주)', badge: '1점' },
        { value: 2, label: '1~2시간', description: '비교적 적절하게 절제하여 사용함', badge: '2점' },
        { value: 3, label: '2~3시간', description: '보통 수준으로 사용함', badge: '3점' },
        { value: 4, label: '3~4시간', description: 'SNS, 영상 시청 등으로 다소 많이 사용함', badge: '4점' },
        { value: 5, label: '5시간 이상', description: '밤늦게까지 심야 사용 및 과도한 몰입', badge: '5점' },
      ],
    },
    variableB: {
      name: '수업 집중도',
      question: 'B. 오늘 수업 집중도는 어떤가요?',
      unit: '점수',
      options: [
        { value: 1, label: '매우 산만함', description: '수업 내용이 전혀 귀에 안 들어오고 졸림', badge: '1점' },
        { value: 2, label: '산만한 편', description: '자주 딴생각이 들고 집중 유지가 어려움', badge: '2점' },
        { value: 3, label: '보통', description: '주요 설명은 들으나 간헐적으로 흐트러짐', badge: '3점' },
        { value: 4, label: '집중하는 편', description: '대부분의 수업 내용을 능동적으로 따라감', badge: '4점' },
        { value: 5, label: '매우 집중함', description: '필기 및 탐구 활동에 완벽하게 몰입함', badge: '5점' },
      ],
    },
  },
  {
    id: 'sleep-energy',
    title: '수면 시간과 아침 활력도',
    category: '건강 및 생체 리듬',
    description: '밤 사이 충분한 수면 시간이 다음 날 아침 신체 컨디션과 활력에 미치는 관계를 탐색합니다.',
    hypothesis: '수면 시간이 넉넉할수록 피로가 회복되어 아침 활력도가 높아질 것이다.',
    expectedCorrelation: 'positive',
    variableA: {
      name: '어젯밤 수면 시간',
      question: 'A. 어젯밤 몇 시간이나 주무셨나요?',
      unit: '시간',
      options: [
        { value: 1, label: '4시간 이하', description: '극심한 수면 부족 (시험/과제/늦잠 등)', badge: '1점' },
        { value: 2, label: '5시간', description: '다소 부족한 수면', badge: '2점' },
        { value: 3, label: '6시간', description: '청소년 평균 수준의 기본 수면', badge: '3점' },
        { value: 4, label: '7~8시간', description: '권장되는 충분하고 개운한 수면', badge: '4점' },
        { value: 5, label: '8시간 이상', description: '숙면을 취하고 푹 쉼', badge: '5점' },
      ],
    },
    variableB: {
      name: '아침 신체 활력도',
      question: 'B. 오늘 등교 후 아침 컨디션과 활력은 어떤가요?',
      unit: '점수',
      options: [
        { value: 1, label: '매우 피곤함', description: '눈이 무겁고 계속 잠이 쏟아짐', badge: '1점' },
        { value: 2, label: '피곤한 편', description: '몸이 찌뿌둥하고 나른함', badge: '2점' },
        { value: 3, label: '보통', description: '일상적인 수준의 활력', badge: '3점' },
        { value: 4, label: '가뿐한 편', description: '기운차고 맑은 정신 상태', badge: '4점' },
        { value: 5, label: '매우 활기참', description: '에너지가 넘치고 컨디션 최상', badge: '5점' },
      ],
    },
  },
  {
    id: 'study-achievement',
    title: '자기주도 학습 시간과 문제 해결 자신감',
    category: '학습 및 역량',
    description: '스스로 계획하여 공부한 시간과 새로운 문제를 마주했을 때의 자신감 사이의 관계를 조사합니다.',
    hypothesis: '스스로 고민하고 복습한 시간이 많을수록 문제 해결에 대한 자신감이 높을 것이다.',
    expectedCorrelation: 'positive',
    variableA: {
      name: '주간 자기주도 학습 시간',
      question: 'A. 이번 주 스스로 공부(자습)한 시간은 어느 정도인가요?',
      unit: '시간',
      options: [
        { value: 1, label: '2시간 미만', description: '거의 자습하지 못함', badge: '1점' },
        { value: 2, label: '2~4시간', description: '최소한의 숙제 위주', badge: '2점' },
        { value: 3, label: '4~7시간', description: '주요 과목 복습 진행', badge: '3점' },
        { value: 4, label: '7~10시간', description: '계획적이고 성실한 자습', badge: '4점' },
        { value: 5, label: '10시간 이상', description: '깊이 있는 심화 탐구 및 자습', badge: '5점' },
      ],
    },
    variableB: {
      name: '새로운 문제 해결 자신감',
      question: 'B. 어려운 정보/수학 문제를 마주했을 때 나의 자신감은?',
      unit: '점수',
      options: [
        { value: 1, label: '매우 두려움', description: '문제를 풀 엄두가 나지 않음', badge: '1점' },
        { value: 2, label: '자신 없는 편', description: '어려운 단계에서 쉽게 포기함', badge: '2점' },
        { value: 3, label: '보통', description: '기본 문제는 무난히 시도함', badge: '3점' },
        { value: 4, label: '자신 있는 편', description: '다양한 알고리즘과 논리로 도전함', badge: '4점' },
        { value: 5, label: '매우 자신만만함', description: '어려울수록 끝까지 파고들어 해결함', badge: '5점' },
      ],
    },
  },
];

// Sample classmate peer cohort data points to provide authentic statistical context in class
export const PEER_COHORT_DATA: Record<string, StudentRecord[]> = {
  'smartphone-focus': [
    { nickname: '코딩러1', variableA_value: 1, variableB_value: 5, topicId: 'smartphone-focus', timestamp: '1교시' },
    { nickname: '알고리즘박', variableA_value: 1, variableB_value: 4, topicId: 'smartphone-focus', timestamp: '1교시' },
    { nickname: '민우', variableA_value: 2, variableB_value: 5, topicId: 'smartphone-focus', timestamp: '1교시' },
    { nickname: '서연', variableA_value: 2, variableB_value: 4, topicId: 'smartphone-focus', timestamp: '1교시' },
    { nickname: '지훈', variableA_value: 2, variableB_value: 3, topicId: 'smartphone-focus', timestamp: '1교시' },
    { nickname: '데이터돌이', variableA_value: 3, variableB_value: 4, topicId: 'smartphone-focus', timestamp: '2교시' },
    { nickname: '하은', variableA_value: 3, variableB_value: 3, topicId: 'smartphone-focus', timestamp: '2교시' },
    { nickname: '준서', variableA_value: 3, variableB_value: 3, topicId: 'smartphone-focus', timestamp: '2교시' },
    { nickname: '도윤', variableA_value: 3, variableB_value: 2, topicId: 'smartphone-focus', timestamp: '2교시' },
    { nickname: '예은', variableA_value: 4, variableB_value: 3, topicId: 'smartphone-focus', timestamp: '2교시' },
    { nickname: '파이썬왕', variableA_value: 4, variableB_value: 2, topicId: 'smartphone-focus', timestamp: '2교시' },
    { nickname: '현우', variableA_value: 4, variableB_value: 2, topicId: 'smartphone-focus', timestamp: '3교시' },
    { nickname: '시우', variableA_value: 4, variableB_value: 1, topicId: 'smartphone-focus', timestamp: '3교시' },
    { nickname: '쇼츠중독러', variableA_value: 5, variableB_value: 2, topicId: 'smartphone-focus', timestamp: '3교시' },
    { nickname: '릴스매니아', variableA_value: 5, variableB_value: 1, topicId: 'smartphone-focus', timestamp: '3교시' },
    { nickname: '새벽올빼미', variableA_value: 5, variableB_value: 1, topicId: 'smartphone-focus', timestamp: '3교시' },
    { nickname: '지민', variableA_value: 2, variableB_value: 4, topicId: 'smartphone-focus', timestamp: '3교시' },
    { nickname: '태오', variableA_value: 3, variableB_value: 4, topicId: 'smartphone-focus', timestamp: '3교시' },
  ],
  'sleep-energy': [
    { nickname: '수면부족러', variableA_value: 1, variableB_value: 1, topicId: 'sleep-energy', timestamp: '1교시' },
    { nickname: '야간공부러', variableA_value: 1, variableB_value: 2, topicId: 'sleep-energy', timestamp: '1교시' },
    { nickname: '학생A', variableA_value: 2, variableB_value: 2, topicId: 'sleep-energy', timestamp: '1교시' },
    { nickname: '학생B', variableA_value: 2, variableB_value: 1, topicId: 'sleep-energy', timestamp: '1교시' },
    { nickname: '학생C', variableA_value: 3, variableB_value: 3, topicId: 'sleep-energy', timestamp: '2교시' },
    { nickname: '학생D', variableA_value: 3, variableB_value: 2, topicId: 'sleep-energy', timestamp: '2교시' },
    { nickname: '학생E', variableA_value: 3, variableB_value: 4, topicId: 'sleep-energy', timestamp: '2교시' },
    { nickname: '학생F', variableA_value: 4, variableB_value: 4, topicId: 'sleep-energy', timestamp: '2교시' },
    { nickname: '학생G', variableA_value: 4, variableB_value: 5, topicId: 'sleep-energy', timestamp: '3교시' },
    { nickname: '꿀잠러', variableA_value: 5, variableB_value: 4, topicId: 'sleep-energy', timestamp: '3교시' },
    { nickname: '숙면마스터', variableA_value: 5, variableB_value: 5, topicId: 'sleep-energy', timestamp: '3교시' },
  ],
  'study-achievement': [
    { nickname: '시작이반', variableA_value: 1, variableB_value: 2, topicId: 'study-achievement', timestamp: '1교시' },
    { nickname: '벼락치기', variableA_value: 2, variableB_value: 2, topicId: 'study-achievement', timestamp: '1교시' },
    { nickname: '꾸준이', variableA_value: 3, variableB_value: 3, topicId: 'study-achievement', timestamp: '2교시' },
    { nickname: '노력형', variableA_value: 4, variableB_value: 4, topicId: 'study-achievement', timestamp: '2교시' },
    { nickname: '열공마스터', variableA_value: 5, variableB_value: 5, topicId: 'study-achievement', timestamp: '3교시' },
  ],
};

/**
 * Calculates Pearson Correlation Coefficient (r) and linear regression parameters (slope, intercept)
 */
export function calculateCorrelation(data: StudentRecord[]): {
  r: number;
  slope: number;
  intercept: number;
  meanA: number;
  meanB: number;
} {
  const n = data.length;
  if (n === 0) return { r: 0, slope: 0, intercept: 0, meanA: 0, meanB: 0 };

  let sumA = 0;
  let sumB = 0;
  let sumAB = 0;
  let sumA2 = 0;
  let sumB2 = 0;

  for (const item of data) {
    const a = item.variableA_value;
    const b = item.variableB_value;
    sumA += a;
    sumB += b;
    sumAB += a * b;
    sumA2 += a * a;
    sumB2 += b * b;
  }

  const meanA = sumA / n;
  const meanB = sumB / n;

  const numerator = n * sumAB - sumA * sumB;
  const denominator = Math.sqrt((n * sumA2 - sumA * sumA) * (n * sumB2 - sumB * sumB));

  const r = denominator === 0 ? 0 : numerator / denominator;

  // Linear Regression: y = slope * x + intercept
  const varA = sumA2 - (sumA * sumA) / n;
  const covAB = sumAB - (sumA * sumB) / n;
  const slope = varA === 0 ? 0 : covAB / varA;
  const intercept = meanB - slope * meanA;

  return {
    r: Number(r.toFixed(2)),
    slope: Number(slope.toFixed(2)),
    intercept: Number(intercept.toFixed(2)),
    meanA: Number(meanA.toFixed(1)),
    meanB: Number(meanB.toFixed(1)),
  };
}

/**
 * Generates an educational correlation analysis and TTS audio briefing
 */
export function generateCorrelationAnalysis(
  topic: TopicConfig,
  allData: StudentRecord[],
  myRecord: StudentRecord
): CorrelationResult {
  const { r, slope, intercept, meanA, meanB } = calculateCorrelation(allData);

  let direction: CorrelationResult['direction'] = '상관관계 없음 (0 근처)';
  let strength: CorrelationResult['strength'] = '거의 없는';

  const absR = Math.abs(r);
  if (absR >= 0.7) {
    strength = '강한';
  } else if (absR >= 0.4) {
    strength = '뚜렷한';
  } else if (absR >= 0.2) {
    strength = '약한';
  } else {
    strength = '거의 없는';
  }

  if (r > 0.15) {
    direction = '양의 상관관계 (+)';
  } else if (r < -0.15) {
    direction = '음의 상관관계 (-)';
  } else {
    direction = '상관관계 없음 (0 근처)';
  }

  const myOptionA = topic.variableA.options.find((o) => o.value === myRecord.variableA_value);
  const myOptionB = topic.variableB.options.find((o) => o.value === myRecord.variableB_value);

  // Customized briefing text based on the user's specific prompt example:
  let summaryText = '';
  let audioScript = '';

  if (r < -0.15) {
    summaryText = `데이터를 분석해보니, ${topic.variableA.name}이(가) 길수록 ${topic.variableB.name}이(가) 낮아지는 뚜렷한 '음의 상관관계(r = ${r})'가 관찰됩니다.`;
    audioScript = `반갑습니다, ${myRecord.nickname} 학생! 방금 입력하신 데이터를 바탕으로 학급 데이터 상관관계를 분석한 음성 브리핑입니다. 현재 수집된 데이터에 따르면, ${topic.variableA.name}이 길어질수록 ${topic.variableB.name}이 낮아지는 ${strength} 음의 상관관계가 나타나고 있습니다. 상관계수 r은 ${r}입니다. ${myRecord.nickname} 님의 응답은 ${topic.variableA.name} ${myOptionA?.label}, ${topic.variableB.name} ${myOptionB?.label}으로, 학급 평균인 스마트폰 ${meanA}점, 집중도 ${meanB}점과 비교할 때 산점도의 특정 위치에 분포하고 있습니다. 단, 상관관계가 곧바로 원인과 결과를 뜻하는 인과관계는 아니라는 점을 꼭 기억해주세요!`;
  } else if (r > 0.15) {
    summaryText = `데이터를 분석해보니, ${topic.variableA.name}이(가) 높을수록 ${topic.variableB.name}도 함께 높아지는 '양의 상관관계(r = ${r})'가 관찰됩니다.`;
    audioScript = `반갑습니다, ${myRecord.nickname} 학생! 데이터 상관관계 분석 브리핑입니다. 수집된 데이터에 따르면, ${topic.variableA.name}이 증가할수록 ${topic.variableB.name}도 함께 증가하는 ${strength} 양의 상관관계가 나타나고 있습니다. 상관계수 r은 ${r}입니다. ${myRecord.nickname} 님의 응답 위치는 학급 데이터 분포 상에서 의미 있는 기준점 역할을 하고 있습니다. 정보 수업에서 배운 것처럼 두 변수가 함께 변하는 경향성을 산점도 그래프에서 확인해 보세요!`;
  } else {
    summaryText = `데이터를 분석해보니, ${topic.variableA.name}과(와) ${topic.variableB.name} 사이에는 뚜렷한 선형적 상관관계가 관찰되지 않습니다 (r = ${r}).`;
    audioScript = `안녕하세요, ${myRecord.nickname} 학생! 데이터 분석 결과, 현재 조사된 두 변수 사이에는 뚜렷한 상관관계가 나타나지 않았습니다. 상관계수 r은 ${r}로 0에 가까우며, 이는 두 변수가 독립적이거나 비선형적인 관계일 가능성을 시사합니다.`;
  }

  const detailedReport = `
- 조사 주제: ${topic.title}
- 참여 학생 수: 총 ${allData.length}명 (내 데이터 포함)
- 피어슨 상관계수(r): ${r} (${strength} ${direction})
- ${myRecord.nickname} 학생의 위치: [${topic.variableA.name}: ${myOptionA?.label} (${myRecord.variableA_value}점), ${topic.variableB.name}: ${myOptionB?.label} (${myRecord.variableB_value}점)]
- 학급 평균치: [${topic.variableA.name}: 평균 ${meanA}점, ${topic.variableB.name}: 평균 ${meanB}점]
  `.trim();

  return {
    r,
    direction,
    strength,
    summaryText,
    detailedReport,
    audioScript,
    trendLineSlope: slope,
    trendLineIntercept: intercept,
  };
}
