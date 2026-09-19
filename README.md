# 📊 데이터 상관관계 탐색 대시보드 (Data Correlation Explorer)

> **고등학교 정보 수업을 위한 멀티모달(시각 차트 + 음성 브리핑) 교육용 인터랙티브 웹앱**  
> 고등학생들이 2가지 변수(예: '일일 스마트폰 사용 시간'과 '수업 집중도') 사이의 상관관계를 시각과 청각을 결합하여 직관적으로 이해하고 탐구할 수 있도록 설계된 실습 도구입니다.

---

## 1. 주요 기능 (교육적 효과 포함)

### 🎯 핵심 기능
1. **무로그인 간편 진입 및 닉네임 설정**
   - 별도의 복잡한 회원가입 없이 2~8자 닉네임만으로 즉시 수업 실습에 참여할 수 있습니다.
   - 입력한 닉네임은 차트 위에서 개별 학생의 데이터 위치를 표시하는 마커로 활용됩니다.

2. **직관적인 5점 척도 데이터 수집 인터페이스**
   - **변수 A (원인 후보/독립변수)**: *"어제 스마트폰을 얼마나 사용했나요?"* (1시간 미만 ~ 5시간 이상)
   - **변수 B (결과 후보/종속변수)**: *"오늘 수업 집중도는 어떤가요?"* (매우 산만함 ~ 매우 집중함)
   - 모바일 및 태블릿 터치 환경에 최적화된 대형 카드형 버튼과 실시간 선택지 요약 피드백을 제공합니다.
   - 모든 문항에 응답해야 다음 단계로 넘어갈 수 있도록 철저한 유효성 검증을 수행합니다.

3. **Recharts 기반의 인터랙티브 데이터 시각화**
   - **2차원 산점도(Scatter Plot)**: 나와 학급 급우들의 응답 데이터를 2차원 평면에 점으로 시각화.
   - **내 데이터 강조 표시(Highlight)**: 내 응답 위치에 펄스 링(Pulsing Ring), 뱃지(⭐ 내 위치) 및 상세 툴팁 적용.
   - **회귀 추세선(Trend Line) 및 평균선 토글**: 데이터의 경향성(기울기)과 평균값을 시각적으로 비교.
   - **비교 막대그래프(Bar Chart)**: 내 점수와 학급 평균 점수를 직관적으로 비교하는 뷰 제공.
   - **실시간 데이터 변경 실험실**: 점수를 즉석에서 변경해보며 산점도의 위치 변화와 상관계수(r)의 변화를 실시간 애니메이션으로 관찰 가능.

4. **Web Speech API 기반 멀티모달 분석 리포트 (TTS)**
   - 데이터 분석 결과를 자연스러운 한국어 텍스트 브리핑으로 생성.  
     *(예: "데이터를 분석해보니, 스마트폰 사용 시간이 길수록 집중도가 낮아지는 음의 상관관계(r = -0.74)가 관찰됩니다.")*
   - **[리포트 듣기]** 버튼 클릭 시 브라우저 내장 Web Speech API를 통해 음성으로 자동 낭독.
   - 음성 재생 시 오디오 이퀄라이저 애니메이션, 일시정지, 정지, 배속 조절(0.8x, 1.0x, 1.2x) 지원.

### 💡 정보과 교육적 효과
- **데이터 문해력(Data Literacy) 함양**: 딱딱한 통계 수식을 외우지 않고도, 산점도에 찍힌 점들의 분포와 기울기를 통해 데이터의 패턴을 시각적으로 읽어냅니다.
- **상관관계 vs 인과관계의 구별**: *"스마트폰 사용 시간과 집중도 저하 사이에 음의 상관관계가 있다고 해서, 스마트폰이 유일한 원인이라고 단정할 수는 없다"*는 핵심 논리적 오류(제3의 변수/교란 변수)를 자연스럽게 지도할 수 있습니다.
- **피어슨 상관계수(r)의 이해**: -1부터 +1까지의 수치가 의미하는 방향성(+, -)과 강도를 체득할 수 있습니다.

---

## 2. 파이어베이스 설정 및 Vercel 배포 가이드

본 웹앱은 Firebase 환경변수가 설정되지 않아도 학생 실습이 중단되지 않도록 **로컬 스토리지 자동 백업 모드**를 기본 지원하며, 교사가 Firebase 환경변수를 설정하면 Google Cloud Firestore에 실시간 자동 누적 저장됩니다.

### 2-1. Firebase 프로젝트 준비 및 Firestore 활성화
1. [Firebase Console](https://console.firebase.google.com/)에 접속하여 새 프로젝트를 생성합니다.
2. 왼쪽 메뉴의 **Firestore Database**를 클릭하고 **데이터베이스 만들기**를 진행합니다. (규칙은 테스트 모드 또는 아래의 보안규칙 적용)
3. 프로젝트 설정 > 일반 > **내 앱**에서 **웹 앱(</>)**을 추가하고 Firebase SDK 구성 객체를 확인합니다.

### 2-2. 환경변수 (Environment Variables) 설정법
프로젝트 루트의 `.env` 파일 또는 호스팅 서비스(Vercel)의 환경변수 탭에 다음 변수들을 등록합니다:

```env
# Vite 클라이언트 환경변수
VITE_FIREBASE_API_KEY="AIzaSyYourApiKeyHere"
VITE_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789012"
VITE_FIREBASE_APP_ID="1:123456789012:web:abcdef123456"
```

> **참고**: 배포 시 환경변수가 누락되어 있어도 앱 상단의 상태 표시줄에 **[로컬 세션 모드]**로 표시되며, 모든 실습 기능과 시각화, TTS 음성 기능이 원활하게 작동합니다.

### 2-3. Vercel 배포 순서
1. 본 코드를 본인의 **GitHub 저장소(Repository)**에 푸시(Push)합니다.
2. [Vercel](https://vercel.com/) 대시보드에서 **Add New... > Project**를 선택하고 해당 GitHub 저장소를 Import합니다.
3. **Environment Variables** 섹션을 펼치고 위의 `VITE_FIREBASE_*` 값들을 입력합니다.
4. **Deploy** 버튼을 누르면 1분 이내에 글로벌 HTTPS URL로 배포가 완료됩니다.

---

## 3. 테마 및 UI 스타일 설정 가이드

본 프로젝트는 **Tailwind CSS v4**를 기반으로 고등학교 교육 환경에 최적화된 모던하고 신뢰감 있는 인터페이스를 제공합니다.

- **기본 컬러 팔레트**:
  - 배경: 부드러운 화이트 및 연회색 (`bg-slate-50`, `bg-white`)
  - 포인트/액센트: 신뢰감 있는 인디고 및 바이올렛 (`text-indigo-600`, `bg-indigo-50`, `border-indigo-200`)
  - 변수 A (독립변수): 블루 계열 (`blue-600`, `bg-blue-50`)
  - 변수 B (종속변수): 퍼플/바이올렛 계열 (`violet-600`, `bg-violet-50`)
- **타이포그래피**:
  - 고해상도 가독성을 위해 `Pretendard` 웹폰트를 적용하여 한글 데이터 라벨과 수치가 선명하게 렌더링됩니다.
- **모바일/태블릿 반응형 디자인**:
  - `sm:`, `md:`, `lg:` 반응형 그리드를 통해 학교 컴퓨터실의 16:9 데스크톱 모니터뿐만 아니라 학생 개인용 스마트폰과 태블릿(아이패드, 갤럭시탭 등)에서도 왜곡 없이 이용할 수 있습니다.

---

## 4. 데이터 보안규칙 (Firestore Security Rules)

고등학교 정보 수업 특성상 학생들의 개인정보 보호 및 원활한 수업 진행을 위해 **비로그인 사용자(익명)에게 쓰기(create/addDoc) 권한만 안전하게 허용**하고, 데이터의 조작이나 무단 삭제, 비정상적 크기의 데이터 유입을 방지하는 권장 보안규칙입니다.

Firebase Console의 **Firestore Database > 규칙(Rules)** 탭에 아래 코드를 복사하여 적용하세요:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // 학생 상관관계 실습 데이터 컬렉션
    match /student_correlations/{docId} {
      
      // 1. 읽기 권한: 수업 통계 집계를 위해 읽기 허용 (또는 교사 관리자만 읽도록 제한 가능)
      allow read: if true;
      
      // 2. 쓰기 권한: 로그인 없이 누구나 자신의 실습 응답을 1회 추가(create)할 수 있도록 허용
      // 단, 데이터 무결성 검증을 통과해야만 기록됩니다.
      allow create: if 
        // 닉네임은 2자 이상 8자 이하 문자열이어야 함
        request.resource.data.nickname is string &&
        request.resource.data.nickname.size() >= 2 &&
        request.resource.data.nickname.size() <= 8 &&
        
        // 5점 척도 변수 A, B 값은 1부터 5 사이의 정수여야 함
        request.resource.data.variableA_value is int &&
        request.resource.data.variableA_value >= 1 &&
        request.resource.data.variableA_value <= 5 &&
        
        request.resource.data.variableB_value is int &&
        request.resource.data.variableB_value >= 1 &&
        request.resource.data.variableB_value <= 5;
        
      // 3. 수정 및 삭제 금지: 학생이 제출한 기록은 임의로 변조하거나 삭제할 수 없음
      allow update, delete: if false;
    }
    
    // 그 외 모든 문서에 대한 접근 차단
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 🔒 보안 검증 포인트
1. `allow create`: 로그인 없이 실습을 진행하되, `nickname`의 길이(2~8자)와 `variableA_value`, `variableB_value`의 5점 척도 범위(1~5)를 엄격히 서버 차원에서 검증합니다.
2. `allow update, delete: if false`: 한 번 기록된 학급 데이터가 다른 사용자에 의해 수정되거나 악의적으로 삭제되는 것을 원천 차단합니다.
