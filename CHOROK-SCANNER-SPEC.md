# 초록 문장 스캐너 — 프로젝트 기획안

## 프로젝트 개요

독서모임 "초록"의 멤버들이 책을 읽다가 좋은 문장을 만나면, 카메라로 페이지를 촬영해서 문장을 텍스트로 추출하고, 원하는 문장을 선택해 클립보드에 복사하거나 노션에 바로 기록할 수 있는 모바일 웹앱(PWA).

## 핵심 문제

독서모임 멤버들이 초서(문장 필사)를 하고 싶어도, 노션에 직접 타이핑하는 과정이 너무 번거로워서 기록을 안 하게 됨. 이 앱은 "촬영 → 문장 선택 → 기록"의 마찰을 극적으로 줄여주는 도구.

## 기술 스택

- **프레임워크**: Next.js (App Router)
- **스타일링**: Tailwind CSS
- **OCR/텍스트 추출**: Claude API (claude-haiku-4-5-20251001 모델)
- **배포**: Vercel
- **PWA**: next-pwa 또는 수동 서비스워커

## 주요 사용 흐름

```
[촬영 화면] → 카메라로 책 페이지 촬영 또는 갤러리에서 사진 선택
     ↓
[처리 중] → Claude API로 이미지 전송, 텍스트 추출 대기
     ↓
[결과 화면] → 문장 단위로 분리된 텍스트 목록 표시
     ↓
  체크박스로 원하는 문장 다중 선택
     ↓
  하단 고정 액션바:
  [클립보드에 복사] / [초록에 바로 기록]
```

## 화면별 상세 스펙

### 1. 촬영 화면 (메인)

- 앱 로고: "초록" (Noto Serif KR, 가벼운 무게)
- 서브텍스트: "문장 스캐너"
- 가이드 영역: 책 페이지 모양의 프레임 (코너 마크 포함)
- 안내 텍스트: "책 페이지를 촬영해주세요 / AI가 문장을 인식하고 띄어쓰기를 보정해드려요"
- **촬영 팁 박스**: "페이지를 평평하게 펴고, 그림자가 지지 않게 촬영하면 인식률이 높아져요."
- 버튼 2개:
  - [촬영하기] — 카메라 직접 실행 (capture="environment")
  - [갤러리] — 갤러리에서 이미지 선택 (capture 속성 없음)

### 2. 처리 중 화면

- 로딩 스피너 (이중 원형 회전 애니메이션)
- 텍스트: "문장을 읽고 있어요" / "띄어쓰기 보정 및 문장 분리 중..."

### 3. 결과 화면

- 상단: 촬영한 이미지 썸네일 (낮은 투명도, max-height 100px)
- 정보 바: "N개의 문장을 찾았어요" + [전체 선택/전체 해제] 버튼
- **문장 카드 리스트**:
  - 왼쪽에 체크박스 (둥근 모서리, 선택 시 초록색 체크)
  - 문장 텍스트 (Noto Serif KR)
  - 선택된 카드: 초록색 왼쪽 보더 + 배경 하이라이트
  - 미선택 카드: 투명 보더 + 약간 어두운 텍스트
  - 각 카드는 터치로 토글
- **하단 고정 액션바** (문장 1개 이상 선택 시 표시):
  - "N개 문장 선택됨" 카운터
  - [클립보드에 복사] 버튼 — 선택된 문장을 줄바꿈으로 이어붙여 복사
  - [초록에 바로 기록] 버튼 — 노션 API 연동 (1차에서는 클립보드 복사로 대체)
- 상단 우측: [다시 촬영] 버튼

### 4. 토스트 알림

- 하단 중앙, 둥근 pill 형태
- "클립보드에 복사되었어요", "초록에 기록되었어요" 등
- 2초 후 자동 사라짐, fade + slide 애니메이션

## Claude API 연동 스펙

### 요청

```javascript
const response = await fetch("/api/scan", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ image: base64Data, mediaType: "image/jpeg" }),
});
```

### API Route (/api/scan)

서버사이드에서 Claude API 호출 (API 키를 클라이언트에 노출하지 않기 위함).

```javascript
// Claude API 호출
const response = await anthropic.messages.create({
  model: "claude-haiku-4-5-20251001",
  max_tokens: 1000,
  messages: [{
    role: "user",
    content: [
      {
        type: "image",
        source: { type: "base64", media_type: mediaType, data: base64Data }
      },
      {
        type: "text",
        text: `이 이미지에서 텍스트를 추출해주세요. 다음 규칙을 따라주세요:
1. 한국어 띄어쓰기를 올바르게 보정해주세요.
2. 문장 단위로 분리해주세요. (마침표, 물음표, 느낌표 기준)
3. 각 문장을 JSON 배열로 반환해주세요.
4. 페이지 번호, 머리글, 바닥글 등 본문이 아닌 요소는 제외해주세요.
5. 반드시 JSON 배열만 반환하고, 다른 텍스트는 포함하지 마세요.
6. 문장이 아닌 제목이나 챕터명도 포함해주세요.

예시 형식: ["첫 번째 문장입니다.", "두 번째 문장입니다."]`
      }
    ]
  }]
});
```

### 응답 처리

Claude가 반환한 JSON 배열을 파싱하여 문장 리스트로 변환.
에러 시 "텍스트를 인식하지 못했어요. 다시 촬영해주세요." 표시.

## 클립보드 복사

navigator.clipboard API가 안 되는 환경을 위해 fallback 구현 필수.

```javascript
// 1차: navigator.clipboard.writeText()
// 2차: document.execCommand("copy") with hidden textarea
```

## 디자인 시스템

### 색상

- 배경: #0f1a0e → #141f13 (그라데이션)
- 주요 액센트: #6b9a5b (초록)
- 버튼 그라데이션: #2d5028 → #3a6b33
- 텍스트 기본: #e8e4df
- 텍스트 보조: #c0bdb8, #888, #777
- 선택 배경: rgba(45, 80, 40, 0.18)
- 에러: #c47a6a

### 폰트

- 제목/문장: 'Noto Serif KR' (weight 300, 400)
- UI/버튼: 'Noto Sans KR' (weight 300, 400, 500)

### 전체적인 톤

- 어두운 초록 계열의 차분한 무드
- "초록" 독서모임의 아이덴티티와 일치
- 미니멀하면서 따뜻한 느낌

## PWA 설정

- manifest.json: 앱 이름 "초록 스캐너", 테마 컬러 #0f1a0e
- 서비스워커: 오프라인 기본 페이지 캐싱
- 아이콘: 초록 잎 또는 책 아이콘 (192x192, 512x512)
- display: "standalone"
- orientation: "portrait"

## 환경 변수

```
ANTHROPIC_API_KEY=sk-ant-xxxxx
```

## 디렉토리 구조 (권장)

```
chorok-scanner/
├── app/
│   ├── layout.js          # 루트 레이아웃 (폰트, 메타데이터)
│   ├── page.js            # 메인 페이지 (스캐너 앱)
│   ├── api/
│   │   └── scan/
│   │       └── route.js   # Claude API 프록시
│   └── globals.css        # Tailwind + 커스텀 스타일
├── components/
│   ├── Scanner.js         # 메인 스캐너 컴포넌트 (상태 관리)
│   ├── CameraView.js      # 촬영 화면
│   ├── ProcessingView.js  # 로딩 화면
│   ├── ResultsView.js     # 결과 화면
│   ├── SentenceCard.js    # 개별 문장 카드
│   ├── BottomBar.js       # 하단 고정 액션바
│   └── Toast.js           # 토스트 알림
├── lib/
│   └── clipboard.js       # 클립보드 유틸 (fallback 포함)
├── public/
│   ├── manifest.json
│   └── icons/
├── .env.local
└── package.json
```

## 개발 순서

1. Next.js 프로젝트 생성 + Tailwind 설정
2. 컴포넌트 구조 생성 (위 디렉토리 구조 참고)
3. 촬영 화면 UI 구현
4. API Route 생성 (/api/scan) — Claude API 연동
5. 결과 화면 UI 구현 (체크박스 다중 선택 + 하단 액션바)
6. 클립보드 복사 기능 (fallback 포함)
7. 토스트 알림
8. PWA 설정 (manifest, 서비스워커)
9. Vercel 배포

## 추후 확장 (1차 범위 밖)

- **노션 API 연동**: "초록에 바로 기록" 버튼이 실제 노션 페이지에 문장을 추가
- **스캔 히스토리**: 이전에 스캔한 문장 목록 보기
- **문장 공유**: 선택한 문장을 카카오톡으로 공유
- **다크/라이트 모드 전환**

## 참고: 프로토타입 코드

이 프로젝트의 React 프로토타입이 이미 존재함. 아래 파일을 참고하여 컴포넌트를 분리하고 Next.js 구조에 맞게 재구성할 것.

프로토타입 위치: chorok-scanner.jsx (함께 제공)
