# miru — 일본 취업 준비 한국인을 위한 자기분석 웹 앱 UI

---

## 📸 Demo

**로그인 → 자기분석 작성 → 커뮤니티 → 알림 흐름**

```
[로그인 화면] 
   ↓ (Google OAuth2)
[자기분석 대시보드] (Tiptap 리치텍스트 에디터)
   ↓
[커뮤니티 게시판] (작성/좋아요/댓글)
   ↓
[실시간 알림 배지] (무한스크롤 알림함)
```

스크린샷은 배포 이후 추가 예정입니다.

---

## ✨ 핵심 기능 (유저 가치 중심)

| 기능 | 설명 |
|---|---|
| **자기분석 작성/편집** | 리치텍스트 에디터(Tiptap)로 자신의 강점/약점 정리 |
| **커뮤니티 게시글** | 게시글 작성, 좋아요 (낙관적 업데이트), 댓글/답글 |
| **실시간 알림** | 배지 30초 폴링, 알림함 무한스크롤로 즉각성 확보 |
| **1:1 문의** | 유저 → 관리자 문의 및 답변 조회 |
| **마이페이지** | 프로필 관리, 내 게시글/댓글 보기, 회원 탈퇴 |
| **관리자 대시보드** | 유저 관리(정지/복구), 1:1 문의 처리 |

---

## 🛠️ Tech Stack (선택 이유 포함)

| 분야 | 라이브러리 | 버전 | 선택 이유 |
|---|---|---|---|
| **Framework** | Next.js | 16.1.6 | SSR + Route Handler로 BFF(Backend For Frontend) 역할 수행 |
| **Language** | TypeScript | ^5 | 타입 안정성, 팀 협업 효율성 |
| **Styling** | Tailwind CSS + shadcn/ui | v4.1.18 + ^3.8.4 | 유틸리티 우선 CSS, 상대방 컴포넌트 커스터마이징 자유도 |
| **Server State** | TanStack Query | ^5.90 | 캐싱/무효화 세밀 제어, staleTime/gcTime 전략으로 API 호출 최소화 |
| **Client State** | Zustand | ^5.0 | 글로벌 UI 상태(모달/알람 패널) 최소화, 보일러플레이트 없음 |
| **HTTP Client** | Axios | ^1.13 | 인터셉터 기반 CSRF/401 중앙화 처리 |
| **Rich Text** | Tiptap | ^3.19 | 자기분석 서비스 특성상 구조화된 텍스트 편집 필요 |
| **HTML 보안** | DOMPurify | ^3.3 | XSS 방지 (dangerouslySetInnerHTML 사용 시) |
| **Date Util** | dayjs | ^1.11 | 가벼운 날짜 조작 |
| **Error Boundary** | react-error-boundary | ^6.1 | Suspense와 조합하여 선언적 에러 처리 |
| **Icons** | lucide-react | ^0.564 | Tailwind와 통합, tree-shakeable |

### 주목할 불채택 기술들
- ❌ **React Hook Form + Zod**: 분석 답변은 Tiptap 에디터 중심, 간단한 form은 `useState` + 수동 검증으로 충분
- ❌ **Prettier**: 팀 규모에서 ESLint만으로 충분한 코드 일관성 유지
- ❌ **Jest/Vitest**: 현재 E2E 테스트 우선순위 (로드맵 항목)

---

## 🏗️ 아키텍처

### 계층 구조 (FSD: Feature-Sliced Design)

```
┌─────────────────────────────────────┐
│     Browser / Next.js (SSR)         │
├─────────────────────────────────────┤
│  Pages (app/)                       │  라우팅, 메타데이터, 레이아웃
├─────────────────────────────────────┤
│  Widgets                            │  화면 단위 조립 (header, board-main, etc)
├─────────────────────────────────────┤
│  Features                           │  사용자 인터랙션 단위 (post-like, alarm-read, etc)
├─────────────────────────────────────┤
│  Entities                           │  도메인 모델 + TanStack Query hooks
├─────────────────────────────────────┤
│  Shared                             │
│  ├─ api/                           │  Axios 인스턴스 + auth API
│  ├─ lib/                           │  hooks, sanitize, events
│  └─ ui/                            │  재사용 컴포넌트 (shadcn base)
└─────────────────────────────────────┘
```

### 핵심 통신 흐름

```
[Component]
   ↓ (useLoginRequired 가드)
   ↓ (useMutation / useQuery)
[TanStack Query Client]
   ↓
[Axios Interceptor]
   ├─ 401 → window.dispatchEvent('auth:logout')
   ├─ 403 "약관" → window.dispatchEvent('auth:terms-required')
   ├─ 403 "정지" → window.dispatchEvent('auth:account-banned')
   └─ 403 기타 → 200ms 후 1회 재시도 (CSRF 워크어라운드)
   ↓
[Backend API (Spring Boot, 별도 repo)]
   ↓
[AuthProvider (전역)]
   └─ window events 수신 → 모달 표시 + 리다이렉트
```

### 인증 전략

- **방식**: Google OAuth2 → Session Cookie (`withCredentials: true`)
- **CSRF 보호**: XSRF-TOKEN 쿠키 자동 읽기 → X-XSRF-TOKEN 헤더 주입 (`src/shared/api/apiClient.ts:14-20`)
- **세션 만료**: 401 응답 → `auth:logout` 이벤트 → `AuthProvider` 수신 → 모달 표시 + `/login` 리다이렉트
- **역할 기반 리다이렉트**: 로그인 직후 `role === 'ADMIN'` → `/admin/inquiries` (sessionStorage로 1회 가드)

---

## 📁 폴더 구조 (책임 명시)

```
src/
├── app/                                    # Next.js App Router
│   ├── (with-layout)/                     # Header/Footer 포함 라우트 그룹
│   │   ├── page.tsx                       # 홈
│   │   ├── about/                         # 소개
│   │   ├── boards/                        # 게시판 (list, detail, write, edit)
│   │   ├── analysis/                      # 자기분석 (list, detail-edit)
│   │   ├── inquiries/                     # 1:1 문의
│   │   ├── mypage/                        # 마이페이지 (profile, boards, comments)
│   │   ├── alarms/                        # 알림함
│   │   ├── admin/                         # 관리자 (inquiries, users 관리)
│   │   └── ...
│   ├── login/                             # 로그인 (레이아웃 없음)
│   ├── terms/                             # 약관 (레이아웃 없음)
│   ├── layout.tsx                         # Root 레이아웃 (providers 포함)
│   ├── providers/
│   │   ├── TanStackProvider.tsx            # TanStack Query 기본값
│   │   ├── AuthProvider.tsx                # 세션/로그인 관리, 이벤트 버스
│   │   └── ModalProvider.tsx               # Zustand 모달 렌더러
│   └── store/
│       ├── useModalStore.ts                # 글로벌 모달 (priority 시스템)
│       └── useAlarmStore.ts                # 알람 패널 open/close
│
├── widgets/                               # 페이지 단위 조립 컴포넌트
│   ├── header.tsx
│   ├── footer.tsx
│   ├── board-main.tsx
│   ├── board-detail.tsx
│   ├── analysis-main.tsx
│   ├── admin-inquiries.tsx
│   └── ...
│
├── features/                              # 사용자 인터랙션 단위
│   ├── auth/
│   │   ├── model/
│   │   │   └── login.ts                   # Google OAuth 리다이렉트
│   │   └── ui/
│   │       └── LoginForm.tsx
│   ├── post-like/
│   │   ├── model/
│   │   │   └── useToggleLike.ts            # 낙관적 업데이트 + rollback
│   │   └── ui/
│   │       └── LikeButton.tsx
│   ├── comment-create/
│   ├── alarm-read-one/
│   ├── alarm-read-all/
│   └── ...
│
├── entities/                              # 도메인 모델 + query hooks
│   ├── auth/
│   │   ├── model/
│   │   │   ├── useAuth.ts                 # GET /api/me (useSuspenseQuery)
│   │   │   └── types.ts
│   │   └── api/
│   │       └── auth.ts                    # authApi (logout, agreements)
│   ├── post/
│   │   ├── model/
│   │   │   ├── postQueryKeys.ts           # Query key factory
│   │   │   ├── usePostsQuery.ts           # GET /posts (useQuery)
│   │   │   ├── usePostDetail.ts           # GET /posts/[id] (useSuspenseQuery)
│   │   │   └── types.ts
│   │   └── api/
│   │       └── posts.ts
│   ├── alarm/
│   │   ├── model/
│   │   │   ├── alarmQueryKeys.ts
│   │   │   ├── useHasUnreadQuery.ts       # 배지 폴링 (refetchInterval: 30_000)
│   │   │   ├── useAlarmsInfiniteQuery.ts  # 무한스크롤
│   │   │   └── types.ts
│   │   └── api/
│   │       └── alarms.ts
│   └── ...
│
└── shared/                                # 공유 인프라
    ├── api/
    │   ├── apiClient.ts                   # Axios 인스턴스 (CSRF + 401 처리)
    │   ├── auth.ts                        # authApi 객체
    │   └── index.ts                       # 재내보내기
    ├── lib/
    │   ├── hooks/
    │   │   ├── useLoginRequired.ts         # 로그인 체크 + 모달
    │   │   └── usePagination.ts           # pagination 유틸
    │   ├── sanitize.ts                    # DOMPurify 래퍼
    │   ├── events.ts                      # 사용자정의 이벤트 타입
    │   └── utils.ts
    └── ui/
        ├── tiptap-editor.tsx              # 리치텍스트 에디터 (공유)
        ├── ErrorBoundaryWrapper.tsx       # Suspense + ErrorBoundary
        ├── Button.tsx                     # shadcn base
        ├── Modal.tsx
        └── ... (shadcn components)
```

---

## 🔌 API 연동 스펙

### 기본 설정

```typescript
// .env.local
NEXT_PUBLIC_API_NIP_URL=https://api.example.com
```

**Note**: 모든 API 호출은 Next.js의 same-origin 프록시를 통해 진행 (BFF 패턴).
클라이언트는 `/api/*` → Next.js Route Handler → 백엔드 API로 리다이렉트.

### 인증 방식

- **Session Cookie** (`withCredentials: true`)
- **CSRF Token**: 쿠키의 XSRF-TOKEN 값 → `X-XSRF-TOKEN` 헤더로 주입
- **구현**: `src/shared/api/apiClient.ts:14-20`

### 에러 처리 전략

| 상태 | 동작 | 구현 |
|---|---|---|
| `401` | `auth:logout` 이벤트 → 세션 만료 모달 → `/login` 리다이렉트 | `apiClient.ts:52-58` |
| `403` "약관 동의" | `auth:terms-required` 이벤트 → `/terms` 리다이렉트 | `apiClient.ts:59-61` |
| `403` "정지" | `auth:account-banned` 이벤트 → 정지 모달 | `apiClient.ts:62-64` |
| `403` 기타 | 200ms 후 **1회 자동 재시도** (CSRF 타이밍 워크어라운드) | `apiClient.ts:65-71` |
| `5xx` | 토스트 에러 메시지 표시 | Error boundary |

### 타입 관리

TypeScript 인터페이스 수동 정의 (`entities/*/types.ts`).  
→ **이유**: Zod 기반 생성은 런타임 검증 오버헤드 vs 백엔드 타입 신뢰도 높음.

### 주요 Endpoint 표 (8개)

| Method | Endpoint | 쿼리 | 용도 |
|---|---|---|---|
| `GET` | `/api/me` | - | 현재 로그인 유저 조회 (useSuspenseQuery) |
| `GET` | `/api/posts` | `page=1&limit=10` | 게시글 목록 (pagination) |
| `GET` | `/api/posts/:id` | - | 게시글 상세 + 댓글 (useSuspenseQuery) |
| `POST` | `/api/posts/:id/like` | - | 게시글 좋아요 (낙관적 업데이트) |
| `GET` | `/api/alarms` | `page=1` | 알림 목록 (useInfiniteQuery) |
| `GET` | `/api/alarms/has-unread` | - | 미읽음 배지 (refetchInterval: 30s) |
| `GET` | `/api/analysis` | - | 자기분석 질문 목록 |
| `POST` | `/api/agreements` | `{ type: 'TERMS' }` | 약관 동의 |

---

## 🧠 상태관리 전략 (이게 차이를 만듭니다)

### Server State (TanStack Query v5)

**설정** (`src/app/providers/TanStackProvider.tsx`):
```typescript
staleTime: 1000 * 60,        // 1분 이내 재요청 없음
gcTime: 1000 * 60 * 5,       // 5분 이후 메모리 해제
retry: 1,                    // 1회 자동 재시도
refetchOnWindowFocus: false, // 탭 전환 시 자동 갱신 안 함
```

**Query Key Factory 패턴** (스코프 무효화):
```typescript
// src/entities/post/model/postQueryKeys.ts
postQueryKeys = {
  all: ['posts'],
  lists: ['posts', 'list'],
  list: (page) => ['posts', 'list', page],
  detail: (id) => ['posts', 'detail', id],
};

// 게시글 작성 후 → invalidate scoped
queryClient.invalidateQueries({ queryKey: postQueryKeys.lists })
// → 모든 list page들 갱신, detail은 그대로
```

**폴링** (알림 배지):
```typescript
// src/entities/alarm/model/useHasUnreadQuery.ts
useQuery({
  queryKey: alarmQueryKeys.hasUnread(),
  queryFn: () => api.getHasUnread(),
  refetchInterval: 30_000,  // 30초마다 폴링
  enabled: !!user,          // 로그인 시에만
});
```

**무한스크롤** (알림 목록):
```typescript
// src/entities/alarm/model/useAlarmsInfiniteQuery.ts
useInfiniteQuery({
  queryKey: alarmQueryKeys.infinite(),
  queryFn: ({ pageParam }) => api.getAlarms(pageParam),
  getNextPageParam: (lastPage, pages) => {
    const fetched = pages.length * LIMIT;
    return fetched < totalCount ? fetched : undefined;
  },
});
// UI: IntersectionObserver + sentinel div → fetchNextPage()
```

### Client State (Zustand v5)

**글로벌 모달** (priority 시스템):
```typescript
// src/app/store/useModalStore.ts
type Modal = { id: string; priority: number; /* ... */ };
openModal(modal) {
  if (modal.priority < current?.priority) return; // 낮은 우선순위 무시
}
```

→ **이유**: 세션 만료(HIGH:10) 모달이 일반 모달(DEFAULT:0)에 가려지는 문제 해결.

**알람 패널** (on/off):
```typescript
useAlarmStore((s) => s.isOpen);
```

### Form State

**전략**: `useState` + 수동 검증

→ **이유**:
- 분석 답변: Tiptap 에디터 (RHF와 호환 어려움)
- 게시글: 제목/내용 간단 → RHF 오버엔지니어링
- 1:1 문의: 제목/내용 + 이미지 없음 (presigned URL 불필요)

---

## 🔑 중요 구현 포인트 (4개 — 면접 주제)

### 1️⃣ **낙관적 업데이트 (좋아요)**

**문제**: 서버 응답 대기 중 버튼이 반응하지 않으면 UX 저하.

**해결** (`src/features/post-like/ui/LikeButton.tsx`):
```typescript
useMutation({
  mutationFn: () => api.toggleLike(postId),
  onMutate: async () => {
    await queryClient.cancelQueries({ queryKey: detailKey });
    const previous = queryClient.getQueryData(detailKey);
    
    // 즉시 UI 업데이트
    queryClient.setQueryData(detailKey, (old) => ({
      ...old,
      isLiked: !old.isLiked,
      likeCount: old.likeCount + (old.isLiked ? -1 : 1),
    }));
    return { previous };
  },
  onError: (_err, _vars, context) => {
    // 서버 실패 시 롤백
    queryClient.setQueryData(detailKey, context.previous);
  },
});
```

**트레이드오프**:
- ✅ 즉각적인 피드백 (클릭 → 바로 변화)
- ❌ 상태 분기 복잡도 증가 (로컬 상태 + 캐시)

---

### 2️⃣ **세션 이벤트 버스**

**문제**: 어디서든 401 발생 → 모든 곳에서 일관된 처리 필요.

**해결** (3단계):

**Step 1**: Axios 인터셉터 (중앙 처리)
```typescript
// src/shared/api/apiClient.ts:52-58
response interceptor: (err) => {
  if (err.status === 401 && url !== '/api/me') {
    window.dispatchEvent(new Event('auth:logout'));
  }
}
```

**Step 2**: 전역 이벤트 정의
```typescript
// src/shared/lib/events.ts
declare global {
  interface WindowEventMap {
    'auth:logout': Event;
    'auth:terms-required': Event;
    'auth:account-banned': Event;
  }
}
```

**Step 3**: AuthProvider가 수신
```typescript
// src/app/providers/AuthProvider.tsx
useEffect(() => {
  window.addEventListener('auth:logout', () => {
    openModal('sessionExpired');
    redirect('/login');
  });
}, []);
```

**트레이드오프**:
- ✅ 인터셉터-UI 의존 제거 → 느슨한 결합
- ❌ 전역 이벤트 의존 → 테스트 어려움, MSW mocking 필요

---

### 3️⃣ **우선순위 모달**

**문제**: 여러 모달이 동시에 발생할 때 순서 제어 필요.

**예시 상황**:
- 게시글 좋아요 실패 → 일반 토스트
- 동시에 세션 만료 → 세션 모달 덮힘 ❌

**해결** (`src/app/store/useModalStore.ts`):
```typescript
enum MODAL_PRIORITY {
  DEFAULT = 0,   // 일반 토스트, 일반 모달
  HIGH = 10,     // 세션 만료, 약관 동의, 정지 알림
}

openModal(modal) {
  const current = state.modals[0];
  if (current && modal.priority <= current.priority) {
    console.warn('Modal dropped (lower priority)');
    return;
  }
  // 추가
}
```

**트레이드오프**:
- ✅ 중요한 모달 보장
- ❌ 낮은 우선순위 모달 손실 (사용자가 알지 못함)

---

### 4️⃣ **무한스크롤 (알림)**

**문제**: 100+ 알림을 pagination 아이콘 클릭으로 불편.

**해결** (`src/widgets/alarm-panel/ui/AlarmsPageClient.tsx`):
```typescript
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: alarmQueryKeys.infinite(),
  queryFn: ({ pageParam }) => api.getAlarms(pageParam),
  initialPageParam: 0,
  getNextPageParam: (lastPage, pages) => {
    const fetched = pages.length * LIMIT;
    return fetched < lastPage.total ? fetched : undefined;
  },
});

// UI 로직
useEffect(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && hasNextPage) {
      fetchNextPage();
    }
  });
  observer.observe(sentinelRef.current!);
  return () => observer.disconnect();
}, [hasNextPage]);
```

**트레이드오프**:
- ✅ 자연스러운 로딩 (사용자 스크롤과 동시)
- ❌ 뒤로 가기 시 스크롤 위치 복원 불완전 (Next.js 라우터 제약)

---

## ⚡ Performance / UX

| 항목 | 구현 | 효과 |
|---|---|---|
| **React Compiler** | `babel-plugin-react-compiler` | 자동 메모이제이션 (렌더링 스킵) |
| **Suspense + Error Boundary** | `useSuspenseQuery` + `ErrorBoundaryWrapper` | 선언적 로딩/에러 처리 |
| **Query Caching** | `staleTime: 60s` | 불필요한 API 재호출 방지 |
| **HTML Sanitize** | `DOMPurify` | XSS 방지 (Tiptap HTML 출력) |
| **Lazy Image Loading** | `next/image with { priority: false }` | LCP 개선 |
| **Code Splitting** | Next.js 기본 (App Router) | 페이지별 JS 번들 최소화 |

---

## ✅ 품질 & 빌드

### ESLint
```bash
npm run lint
```
설정: `eslint.config.mjs` (flat config v9)
- `eslint-config-next/core-web-vitals`
- `eslint-config-next/typescript`
- 무시: `.next`, `out`, `build`

### Prettier
미설정 (팀 규모에서 ESLint 규칙만으로 충분).

### Test
**현재**: 미작성.  
**로드맵**: MSW + Vitest 기반 구축 (섹션 14 참고).

### 빌드
```bash
npm run build   # 타입 체크 + lint + SSR 빌드
npm run dev     # 개발 서버 (localhost:3000)
```

---

## 🚀 로컬 실행

### 준비

```bash
# 1. 저장소 클론
git clone https://github.com/wyLortel/miru-frontend.git
cd miru-frontend

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정
cp .env.example .env.local
# .env.local 편집
# NEXT_PUBLIC_API_NIP_URL=https://api.example.com
```

### 실행

```bash
# 개발 서버
npm run dev
# → http://localhost:3000 접속

# 빌드 + 프로덕션 실행
npm run build
npm start
```

---

## 👤 담당 범위

**이 레포는 프론트엔드 전담입니다.**

| 영역 | 담당 |
|---|---|
| UI/UX, 라우팅, 상태관리, API 호출 | miru-frontend (본 repo) |
| 백엔드 API, 인증, DB | 별도 Spring Boot repo |

---

## 🗺️ Roadmap (개선 계획 3개)

### 1. MSW + Vitest 기반 테스트 환경
**목표**: API 모킹으로 독립적인 unit/component 테스트 작성.  
**우선순위**: 높음 (현재 테스트 0).  
**작업**:
- `msw` 설치 + handler 정의
- `@testing-library/react` + `vitest` 설정
- 주요 hooks (useAuth, usePostsQuery, useMutation) 테스트 추가

### 2. React Hook Form + Zod 도입
**목표**: 수동 검증 통일화 + 폼 에러 UI 자동화.  
**현재**: form state = `useState` + 수동 검증.  
**작업**:
- `react-hook-form`, `zod` 추가
- `PostWriteForm`, `InquiryWriteForm` 마이그레이션
- Tiptap 에디터와 RHF 통합 (custom register)

### 3. Bundle Analyzer + Tiptap 최적화
**목표**: 초기 로딩 속도 개선.  
**현재**: Tiptap 기본 starterkit 전체 포함 (~50KB gzip).  
**작업**:
- `@next/bundle-analyzer` 설치
- Tiptap extensions tree-shaking (필요한 것만)
- 이미지 최적화 (next/image 적극 활용)
- **목표 Lighthouse**: LCP < 2.5s, CLS < 0.1

---

## 💡 자주 하는 실수와 대책

### 401 무한 리트라이 문제
**증상**: 로그인 후 API 호출 시 401 → 자동 재시도 → 401 → ... (무한 루프).  
**원인**: 새 XSRF 토큰 받기 전에 API 호출.  
**대책** (`src/shared/api/apiClient.ts:65-71`):
```typescript
// 403 응답에만 1회 재시도 (CSRF 토큰 갱신 대기)
if (err.status === 403 && !err.config._csrfRetried) {
  await new Promise(r => setTimeout(r, 200));
  err.config._csrfRetried = true;
  return apiClient(err.config);
}
```

### 폼 이중 제출
**증상**: 버튼 빠른 연속 클릭 → 중복 요청.  
**대책**:
```typescript
const { mutate, isPending } = useMutation({ /* ... */ });

<button 
  onClick={() => mutate(data)} 
  disabled={isPending}  // ← 필수
>
  {isPending ? '제출 중...' : '제출'}
</button>
```

---

## 📖 참고 자료

- [Next.js 공식 문서](https://nextjs.org/docs)
- [TanStack Query v5](https://tanstack.com/query/v5)
- [Zustand](https://github.com/pmndrs/zustand)
- [Tiptap](https://tiptap.dev)
- [shadcn/ui](https://ui.shadcn.com)

---

**Last Updated**: 2026-04-01  
**Maintainer**: JEOUNG WOOYOUNG (@wyLortel)
