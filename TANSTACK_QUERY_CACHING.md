# TanStack Query 캐싱 및 상태 관리 구조

## 📋 목차
1. [전역 설정](#전역-설정)
2. [주요 데이터 캐싱](#주요-데이터-캐싱)
3. [캐시 무효화 전략](#캐시-무효화-전략)
4. [특수 사례](#특수-사례)

---

## 전역 설정

### TanStackProvider (`src/app/providers/TanStackProvider.tsx`)
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,           // ✅ 기본: 1분 동안 신선한 상태 유지
      gcTime: 1000 * 60 * 5,          // ✅ 기본: 5분 동안 캐시 메모리 유지
      retry: 1,                        // ✅ 실패 시 1회 재시도
      refetchOnWindowFocus: false,     // ❌ 윈도우 포커스 시 자동 refetch 비활성화
    },
  },
});
```

**핵심 개념:**
- **staleTime**: 데이터가 "신선함"으로 간주되는 시간. 이 시간 내에는 캐시된 데이터 사용
- **gcTime (구 cacheTime)**: 사용되지 않는 데이터가 메모리에서 제거될 때까지의 시간

---

## 주요 데이터 캐싱

### 1️⃣ 로그인 사용자 정보 (`auth/me`)

**파일:** `src/entities/auth/useAuth.ts`

```typescript
export function useAuth() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      try {
        return await authApi.getMe();
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          return null;  // 미로그인 상태
        }
        throw error;
      }
    },
    retry: false,                    // ❌ 401 재시도 안 함
    staleTime: 5 * 60 * 1000,       // ✅ 5분 신선 유지
    refetchOnMount: false,           // ❌ 마운트 시 refetch 안 함
    refetchOnWindowFocus: false,     // ❌ 포커스 복귀 시 refetch 안 함
  });
}
```

**캐싱 특징:**
- 장시간 유지 (5분)
- 수동으로 refetch 필요할 때만 갱신
- 로그아웃 시 `qc.setQueryData(['auth', 'me'], null)` 호출

---

### 2️⃣ 알람 데이터

#### 📊 읽지 않은 알람 여부 (`alarms/has-unread`)

**파일:** `src/entities/alarm/model/useHasUnreadQuery.ts`

```typescript
export function useHasUnreadQuery() {
  const { data: user } = useAuth();

  return useQuery({
    queryKey: alarmQueryKeys.hasUnread(),  // ['alarms', 'has-unread']
    queryFn: alarmApi.getHasUnread,
    enabled: !!user,                       // 로그인된 경우만 활성화
    refetchInterval: 30_000,               // ✅ 30초마다 자동 폴링
    staleTime: 0,                          // ❌ 항상 stale 상태 (폴링 우선)
    refetchOnWindowFocus: false,           // ❌ 포커스 복귀 시 refetch 안 함
  });
}
```

**캐싱 전략:**
- Polling 방식으로 30초마다 자동 갱신
- 실시간 알람 여부 확인에 최적화
- 쿼리 키: 계층 구조로 관리

#### 📄 알람 목록 (페이지 단위)

**파일:** `src/entities/alarm/model/useAlarmsQuery.ts`

```typescript
export function useAlarmsQuery(page: number) {
  return useQuery({
    queryKey: alarmQueryKeys.list(page),  // ['alarms', 'items', 'list', page]
    queryFn: () => alarmApi.getAlarms(page),
    staleTime: 0,                          // ❌ 즉시 만료
  });
}
```

**캐싱 특징:**
- 각 페이지마다 별도 캐시
- 페이지 변경 시 새로운 캐시 생성
- staleTime: 0 → 즉시 fresh 상태로 간주, 리마운트/포커스 시 refetch

#### 📜 알람 목록 (무한 스크롤)

**파일:** `src/entities/alarm/model/useAlarmsInfiniteQuery.ts`

```typescript
export function useAlarmsInfiniteQuery() {
  return useInfiniteQuery({
    queryKey: alarmQueryKeys.infinite(),    // ['alarms', 'items', 'infinite']
    queryFn: ({ pageParam }) => alarmApi.getAlarms(pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const fetchedCount = allPages.reduce((sum, p) => sum + p.items.length, 0);
      return fetchedCount < lastPage.totalCount ? allPages.length : undefined;
    },
    staleTime: 0,
  });
}
```

**무한 스크롤 로직:**
- 모든 페이지 데이터를 누적으로 메모리에 유지
- `getNextPageParam`: 다음 페이지 존재 여부 판단
- 실제 페칭된 아이템 수 < 전체 수 → 다음 페이지 존재

#### 🔔 알람 읽음 처리 (뮤테이션)

**파일:** `src/features/alarm-read-all/model/useReadAllAlarmsMutation.ts`

```typescript
export function useReadAllAlarmsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: alarmReadAllApi.readAll,
    onSuccess: () => {
      // 1️⃣ hasUnread를 즉시 false로 업데이트 (별도 쿼리 키)
      queryClient.setQueryData<HasUnreadResponse>(
        alarmQueryKeys.hasUnread(),
        { hasUnread: false }
      );

      // 2️⃣ 알람 목록 무효화 (list와 infinite 공통 부모)
      queryClient.invalidateQueries({
        queryKey: alarmQueryKeys.items()  // ['alarms', 'items']
      });
    },
  });
}
```

**캐시 무효화 전략:**
```
alarmQueryKeys = {
  hasUnread: () => ['alarms', 'has-unread'],
  items: () => ['alarms', 'items'],           // ← 공통 부모
  list: (page) => ['alarms', 'items', 'list', page],
  infinite: () => ['alarms', 'items', 'infinite'],
}
```
- `items()` 무효화 → `list`와 `infinite` 모두 영향
- `hasUnread()` 직접 업데이트 → 폴링 중단 없이 즉시 반영

---

### 3️⃣ 게시판 데이터 (`posts`)

**파일:** `src/entities/post/model/usePostsQuery.ts`

```typescript
export const postQueryKeys = {
  all: ['posts'] as const,
  list: (page: number) => ['posts', 'list', page] as const,
  detail: (postId: number) => ['posts', 'detail', postId] as const,
};

export const usePostsQuery = (page: number) => {
  return useQuery({
    queryKey: postQueryKeys.list(page),
    queryFn: () => postApi.getPosts(page),
    placeholderData: (prev) => prev,         // 📊 페이지 변경 시 이전 데이터 유지
    staleTime: 0,                             // ❌ 즉시 만료
  });
};
```

**캐싱 특징:**
- `placeholderData`: 새 페이지 로딩 중 이전 페이지 데이터 표시 (UX 개선)
- 각 페이지별 독립 캐시

#### 📝 게시글 작성 (뮤테이션)

**파일:** `src/features/post-create/model/useCreatePostMutation.ts`

```typescript
export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postApi.createPost,
    onSuccess: () => {
      // ✅ posts의 모든 하위 캐시 무효화 (list, detail 모두)
      queryClient.invalidateQueries({
        queryKey: postQueryKeys.all
      });
    },
  });
};
```

---

### 4️⃣ 분석 데이터 (`analysis-all`)

**파일:** `src/entities/analysis/model/useAnalysisQuery.ts`

```typescript
export const useAnalysisQuery = () => {
  return useSuspenseQuery({
    queryKey: ['analysis-all'],
    queryFn: fetchAllAnalysis,
    staleTime: 1000 * 60 * 5,               // ✅ 5분 신선 유지
  });
};
```

**특징:**
- `useSuspenseQuery` 사용 → 로딩 상태 Suspense로 처리
- 비교적 안정적인 데이터 → staleTime 5분

#### ✏️ 분석 답변 제출 (뮤테이션)

**파일:** `src/features/analysis-answer/model/useSubmitAnswerMutation.ts`

```typescript
export const useSubmitAnswerMutation = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => analysisAnswerApi.submit(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['analysis-all']  // 전체 분석 데이터 갱신
      });
    },
  });
};
```

---

### 5️⃣ 마이페이지 데이터 (`mypage`)

**파일:** `src/entities/mypage/model/useMypageQuery.ts`

```typescript
export const useMypageQuery = () => {
  return useSuspenseQuery({
    queryKey: ['mypage'],
    queryFn: mypageApi.getMyPage,
    staleTime: 1000 * 60 * 5,  // ✅ 5분 신선 유지
  });
};
```

#### 👤 닉네임 변경 (뮤테이션)

**파일:** `src/features/nickname-edit/model/useNicknameEditMutation.ts`

```typescript
export const useNicknameEditMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (nickname: string) => mypageApi.updateNickname(nickname),
    onSuccess: () => {
      // ✅ 로그인 사용자 정보 갱신 (닉네임 포함)
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });

      // ✅ 마이페이지 데이터 갱신
      queryClient.invalidateQueries({ queryKey: ['mypage'] });
    },
  });
};
```

---

## 캐시 무효화 전략

### 🎯 계층 구조 기반 무효화

```
posts
├── posts/list/0
├── posts/list/1
└── posts/detail/123

invalidateQueries({ queryKey: ['posts'] })
→ 모든 list, detail 캐시 일괄 무효화
```

### 🎯 부분 무효화

```
alarms/items           ← 공통 부모
├── alarms/items/list/0
├── alarms/items/list/1
└── alarms/items/infinite

invalidateQueries({ queryKey: ['alarms', 'items'] })
→ list와 infinite 모두 무효화
→ has-unread는 영향 없음 (별도 키)
```

### 🎯 직접 업데이트

```typescript
// 방법 1: setQueryData - 즉시 반영
queryClient.setQueryData(['alarms', 'has-unread'], { hasUnread: false });

// 방법 2: invalidateQueries - 다음 사용 시 refetch
queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
```

---

## 특수 사례

### 🔐 로그아웃 처리

**파일:** `src/app/providers/AuthProvider.tsx`

```typescript
// 세션 만료 감지 (401 에러)
window.addEventListener(APP_EVENTS.AUTH_LOGOUT, () => {
  // 1️⃣ 캐시에 null 설정 (UI 즉시 업데이트)
  qc.setQueryData(['auth', 'me'], null);

  // 2️⃣ 모달 표시 후 로그인 페이지로 이동
});
```

### 🔄 폴링 vs 캐싱

| 데이터 | 전략 | staleTime | refetchInterval | 사용 사례 |
|--------|------|-----------|-----------------|----------|
| 알람 여부 | Polling | 0 | 30초 | 실시간 알림 |
| 알람 목록 | 캐싱 | 0 | - | 페이지 열 때 |
| 사용자 정보 | 캐싱 | 5분 | - | 거의 변하지 않음 |
| 게시판 목록 | 캐싱 | 0 | - | 매번 최신 |

### ⚡ 성능 최적화 팁

```typescript
// ✅ 좋은 예: 계층 구조 활용
const postQueryKeys = {
  all: ['posts'],
  list: (page) => ['posts', 'list', page],
  detail: (id) => ['posts', 'detail', id],
};

// 게시글 생성 후
queryClient.invalidateQueries({ queryKey: postQueryKeys.all });
// → list, detail 모두 갱신

// ❌ 나쁜 예: 각각 무효화
queryClient.invalidateQueries({ queryKey: ['posts', 'list'] });
queryClient.invalidateQueries({ queryKey: ['posts', 'detail'] });
```

---

## 요약표

| 데이터 | QueryKey | staleTime | 갱신 방식 | 특징 |
|--------|----------|-----------|----------|------|
| 로그인 사용자 | `['auth', 'me']` | 5분 | 수동 | 장시간 캐싱, 로그아웃 시 null |
| 읽지 않은 알람 | `['alarms', 'has-unread']` | 0 | 30초 폴링 | 실시간, 계속 갱신 |
| 알람 목록 | `['alarms', 'items', 'list', page]` | 0 | 수동 | 페이지별 캐시 |
| 무한 알람 | `['alarms', 'items', 'infinite']` | 0 | 수동 | 누적 로딩 |
| 게시판 목록 | `['posts', 'list', page]` | 0 | 수동 | placeholderData 활용 |
| 게시글 상세 | `['posts', 'detail', id]` | - | - | 필요시 쿼리 |
| 분석 데이터 | `['analysis-all']` | 5분 | Suspense | 안정적 데이터 |
| 마이페이지 | `['mypage']` | 5분 | Suspense | 사용자 통계 |

