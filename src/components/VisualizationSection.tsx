import {
  BarChart2,
  CheckCircle2,
  HelpCircle,
  Info,
  Maximize2,
  RefreshCw,
  Sliders,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';
import { ChartType, CorrelationResult, StudentRecord, TopicConfig } from '../types';

interface VisualizationSectionProps {
  topic: TopicConfig;
  myRecord: StudentRecord;
  cohortData: StudentRecord[];
  correlation: CorrelationResult;
  onUpdateMyData: (varA: number, varB: number) => void;
}

// Custom highlight dot for "My Data" on the scatter chart
const MyDataDot = (props: any) => {
  const { cx, cy } = props;
  if (!cx || !cy) return null;

  return (
    <g>
      {/* Outer pulsing ring */}
      <circle
        cx={cx}
        cy={cy}
        r={18}
        fill="#6366f1"
        fillOpacity={0.25}
        className="animate-ping"
      />
      {/* Inner highlight ring */}
      <circle
        cx={cx}
        cy={cy}
        r={14}
        fill="#4f46e5"
        fillOpacity={0.4}
        stroke="#818cf8"
        strokeWidth={2}
      />
      {/* Core solid center */}
      <circle
        cx={cx}
        cy={cy}
        r={8}
        fill="#4338ca"
        stroke="#ffffff"
        strokeWidth={3}
      />
      {/* Visual Star / Marker Label */}
      <text
        x={cx}
        y={cy - 20}
        textAnchor="middle"
        fill="#4338ca"
        fontSize={12}
        fontWeight="800"
        className="drop-shadow-xs select-none"
      >
        ⭐ 내 위치
      </text>
    </g>
  );
};

// Peer cohort student dot
const CohortDot = (props: any) => {
  const { cx, cy } = props;
  if (!cx || !cy) return null;

  return (
    <circle
      cx={cx}
      cy={cy}
      r={6}
      fill="#94a3b8"
      stroke="#ffffff"
      strokeWidth={1.5}
      fillOpacity={0.8}
      className="transition-all hover:scale-125"
    />
  );
};

export const VisualizationSection: React.FC<VisualizationSectionProps> = ({
  topic,
  myRecord,
  cohortData,
  correlation,
  onUpdateMyData,
}) => {
  const [chartType, setChartType] = useState<ChartType>('scatter');
  const [showTrendLine, setShowTrendLine] = useState<boolean>(true);
  const [showMeans, setShowMeans] = useState<boolean>(true);

  // Prepare Scatter data: class peers + current student with slight jitter for identical points so they don't completely overlap
  const formattedScatterData = useMemo(() => {
    // Group identical points slightly to avoid total stacking visually
    const countMap: Record<string, number> = {};

    return cohortData.map((item, index) => {
      const key = `${item.variableA_value}-${item.variableB_value}`;
      countMap[key] = (countMap[key] || 0) + 1;
      const count = countMap[key];

      // Add gentle, predictable jitter (±0.08) if multiple students have exact same rating
      const jitterX = count > 1 ? (Math.sin(count * 2) * 0.08) : 0;
      const jitterY = count > 1 ? (Math.cos(count * 2) * 0.08) : 0;

      return {
        id: item.id || `peer-${index}`,
        nickname: item.nickname,
        x: item.variableA_value + jitterX,
        y: item.variableB_value + jitterY,
        rawX: item.variableA_value,
        rawY: item.variableB_value,
        isMyData: false,
        time: item.timestamp,
      };
    });
  }, [cohortData]);

  const formattedMyData = useMemo(() => {
    return [
      {
        id: 'my-record',
        nickname: `${myRecord.nickname} (나)`,
        x: myRecord.variableA_value,
        y: myRecord.variableB_value,
        rawX: myRecord.variableA_value,
        rawY: myRecord.variableB_value,
        isMyData: true,
        time: myRecord.timestamp,
      },
    ];
  }, [myRecord]);

  // Calculate Trend Line Points across domain [1, 5]
  const trendLinePoints = useMemo(() => {
    const p1 = {
      x: 1,
      y: Math.max(0.5, Math.min(5.5, correlation.trendLineSlope * 1 + correlation.trendLineIntercept)),
    };
    const p5 = {
      x: 5,
      y: Math.max(0.5, Math.min(5.5, correlation.trendLineSlope * 5 + correlation.trendLineIntercept)),
    };
    return [p1, p5];
  }, [correlation]);

  // Calculate Average values
  const classAvgA = useMemo(() => {
    const all = [...cohortData, myRecord];
    const sum = all.reduce((acc, curr) => acc + curr.variableA_value, 0);
    return Number((sum / all.length).toFixed(2));
  }, [cohortData, myRecord]);

  const classAvgB = useMemo(() => {
    const all = [...cohortData, myRecord];
    const sum = all.reduce((acc, curr) => acc + curr.variableB_value, 0);
    return Number((sum / all.length).toFixed(2));
  }, [cohortData, myRecord]);

  // Bar chart comparison data: My response vs Class Average
  const barComparisonData = useMemo(() => {
    return [
      {
        name: topic.variableA.name,
        '내 응답 점수': myRecord.variableA_value,
        '학급 평균 점수': classAvgA,
        unit: '점',
      },
      {
        name: topic.variableB.name,
        '내 응답 점수': myRecord.variableB_value,
        '학급 평균 점수': classAvgB,
        unit: '점',
      },
    ];
  }, [topic, myRecord, classAvgA, classAvgB]);

  // Custom Tooltip for Scatter
  const CustomScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const optA = topic.variableA.options.find((o) => o.value === data.rawX);
      const optB = topic.variableB.options.find((o) => o.value === data.rawY);

      return (
        <div className="bg-slate-900/95 text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 border border-slate-700 min-w-48 z-50">
          <div className="flex items-center justify-between pb-1 border-b border-slate-700">
            <span className="font-bold flex items-center gap-1">
              {data.isMyData ? '⭐ 내 데이터 (나)' : `👤 ${data.nickname}`}
            </span>
            {data.isMyData && (
              <span className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                강조 표시
              </span>
            )}
          </div>
          <div className="text-slate-300">
            <p>
              • {topic.variableA.name}: <strong className="text-blue-300">{data.rawX}점</strong> ({optA?.label})
            </p>
            <p>
              • {topic.variableB.name}: <strong className="text-violet-300">{data.rawY}점</strong> ({optB?.label})
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      id="visualization-section"
      className="bg-white rounded-3xl p-5 sm:p-8 shadow-xl shadow-slate-100 border border-slate-200 transition-all"
    >
      {/* Section Header with View Toggles and Pearson correlation badge */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-0.5 rounded-md">
              인터랙티브 시각화
            </span>
            <span className="text-xs text-slate-500">
              학급 총 {cohortData.length + 1}명 데이터 분포
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            {chartType === 'scatter' ? '2차원 산점도 (Scatter Plot)' : '비교 막대그래프 (Bar Chart)'}
          </h3>
        </div>

        {/* Chart View Toggle and Correlation Pill */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Correlation coefficient r badge */}
          <div
            id="badge-correlation-r"
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-indigo-50/80 border border-indigo-200/80 text-xs"
          >
            {correlation.r < -0.15 ? (
              <TrendingDown className="w-4 h-4 text-rose-600" />
            ) : correlation.r > 0.15 ? (
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            ) : (
              <RefreshCw className="w-4 h-4 text-slate-500" />
            )}
            <div>
              <span className="text-slate-500 block text-[10px] font-medium leading-none">피어슨 상관계수</span>
              <span className="font-extrabold text-indigo-900 text-sm">
                r = {correlation.r}
              </span>
              <span className="ml-1 text-[11px] font-bold text-indigo-700">
                ({correlation.direction})
              </span>
            </div>
          </div>

          {/* Toggle buttons between Scatter and Bar */}
          <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200/80 text-xs font-semibold">
            <button
              id="btn-toggle-scatter"
              type="button"
              onClick={() => setChartType('scatter')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                chartType === 'scatter'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>산점도 보기</span>
            </button>
            <button
              id="btn-toggle-bar"
              type="button"
              onClick={() => setChartType('bar')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                chartType === 'bar'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>막대그래프</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Chart Canvas Area */}
      <div className="mt-6 relative">
        {chartType === 'scatter' ? (
          <div>
            {/* Legend & Helpers Bar */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 mb-4 gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-200/60">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="flex items-center gap-1.5 font-bold text-indigo-700">
                  <span className="w-3 h-3 rounded-full bg-indigo-600 ring-2 ring-indigo-300"></span>
                  ⭐ 내 데이터 ({myRecord.nickname}: A={myRecord.variableA_value}점, B={myRecord.variableB_value}점)
                </span>
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                  학급 친구들 데이터
                </span>
                {showTrendLine && (
                  <span className="flex items-center gap-1.5 text-indigo-500 font-medium">
                    <span className="w-4 h-0.5 bg-indigo-500 border-t border-dashed"></span>
                    회귀 추세선 (경향성)
                  </span>
                )}
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 hover:text-slate-900">
                  <input
                    type="checkbox"
                    checked={showTrendLine}
                    onChange={(e) => setShowTrendLine(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span>추세선</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 hover:text-slate-900">
                  <input
                    type="checkbox"
                    checked={showMeans}
                    onChange={(e) => setShowMeans(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span>학급 평균선</span>
                </label>
              </div>
            </div>

            {/* Recharts Scatter Plot */}
            <div className="h-[360px] sm:h-[420px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 25, right: 30, bottom: 35, left: 15 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name={topic.variableA.name}
                    domain={[0.5, 5.5]}
                    ticks={[1, 2, 3, 4, 5]}
                    unit="점"
                    stroke="#64748b"
                    fontSize={12}
                    label={{
                      value: `[X축] ${topic.variableA.name} (5점 척도)`,
                      position: 'insideBottom',
                      offset: -20,
                      fill: '#334155',
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name={topic.variableB.name}
                    domain={[0.5, 5.5]}
                    ticks={[1, 2, 3, 4, 5]}
                    unit="점"
                    stroke="#64748b"
                    fontSize={12}
                    label={{
                      value: `[Y축] ${topic.variableB.name} (5점 척도)`,
                      angle: -90,
                      position: 'insideLeft',
                      offset: 5,
                      fill: '#334155',
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  />
                  <ZAxis type="number" range={[60, 60]} />
                  <Tooltip content={<CustomScatterTooltip />} cursor={{ strokeDasharray: '3 3' }} />

                  {/* Class average reference lines */}
                  {showMeans && (
                    <>
                      <ReferenceLine
                        x={classAvgA}
                        stroke="#94a3b8"
                        strokeDasharray="4 4"
                        label={{
                          value: `X평균: ${classAvgA}`,
                          fill: '#64748b',
                          fontSize: 10,
                          position: 'insideTopRight',
                        }}
                      />
                      <ReferenceLine
                        y={classAvgB}
                        stroke="#94a3b8"
                        strokeDasharray="4 4"
                        label={{
                          value: `Y평균: ${classAvgB}`,
                          fill: '#64748b',
                          fontSize: 10,
                          position: 'insideBottomLeft',
                        }}
                      />
                    </>
                  )}

                  {/* Cohort Peers Scatter */}
                  <Scatter
                    name="학급 친구들 데이터"
                    data={formattedScatterData}
                    shape={<CohortDot />}
                    isAnimationActive={true}
                  />

                  {/* My Data Point (Highlighted with special pin & ring) */}
                  <Scatter
                    name="내 데이터"
                    data={formattedMyData}
                    shape={<MyDataDot />}
                    isAnimationActive={true}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          /* Bar Chart Mode: My Response vs Class Average */
          <div>
            <div className="text-xs text-slate-500 mb-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-200/60 flex items-center justify-between">
              <span>내 응답 점수와 학급 전체 평균 점수를 나란히 비교합니다.</span>
              <span className="font-semibold text-indigo-600">척도: 1점 ~ 5점</span>
            </div>

            <div className="h-[360px] sm:h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barComparisonData}
                  margin={{ top: 25, right: 30, left: 10, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#475569" fontSize={12} fontWeight={600} />
                  <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} stroke="#475569" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '0.75rem',
                      color: '#ffffff',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar
                    dataKey="내 응답 점수"
                    fill="#4f46e5"
                    radius={[8, 8, 0, 0]}
                    barSize={40}
                  />
                  <Bar
                    dataKey="학급 평균 점수"
                    fill="#cbd5e1"
                    radius={[8, 8, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Live Modifier Controller: "선택지에 응답할 때마다 차트가 부드럽게 업데이트되는 효과" */}
      <div className="mt-6 pt-5 border-t border-slate-100 bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <h4 className="text-xs sm:text-sm font-bold text-slate-800">
              실시간 데이터 변경 실험실 (가상 시뮬레이션)
            </h4>
          </div>
          <span className="text-[11px] text-slate-500">
            점수를 바꿔 클릭하면 차트 위의 내 위치와 상관계수가 실시간으로 애니메이션됩니다.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Quick change Var A */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-700">
                변수 A ({topic.variableA.name})
              </span>
              <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                현재: {myRecord.variableA_value}점
              </span>
            </div>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => onUpdateMyData(val, myRecord.variableB_value)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    myRecord.variableA_value === val
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  {val}점
                </button>
              ))}
            </div>
          </div>

          {/* Quick change Var B */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-violet-700">
                변수 B ({topic.variableB.name})
              </span>
              <span className="text-xs font-black text-violet-600 bg-violet-50 px-2 py-0.5 rounded">
                현재: {myRecord.variableB_value}점
              </span>
            </div>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => onUpdateMyData(myRecord.variableA_value, val)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    myRecord.variableB_value === val
                      ? 'bg-violet-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-violet-50 hover:text-violet-600'
                  }`}
                >
                  {val}점
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
