# TanStack Query 개선 가이드

## 🔴 높은 우선순위 (꼭 수정하기)

### 1. 내 게시글/댓글 - staleTime 개선 (성능 영향 높음)

**현재 문제:**
```typescript
// src/entities/mypage/model/useMyPostsQuery.ts
export const useMyPostsQuery = () => {
  return useSuspenseQuery({
    queryKey: ['my-posts', page],
    queryFn: () => mypageApi.getMyPosts(page),
    staleTime: 0,  // ❌ 즉시 만료
  });
};

// src/entities/mypage/model/useMyCommentsQuery.ts
export const useMyCommentsQuery = () => {
  return useSuspenseQuery({
    queryKey: ['my-comments', page],
    queryFn: () => mypageApi.getMyComments(page),
    staleTime: 0,  // ❌ 즉시 만료
  });
};
```

**결과:**
- 마이페이지 진입할 때마다 무조건 refetch
- 탭 전환할 때마다 refetch
- 윈도우 포커스 복귀할 때마다 refetch (default staleTime: 1분이므로 포커스 후 1분 지나면 다시 fetch)

**개선:**
```typescript
// src/entities/mypage/model/useMyPostsQuery.ts
export const useMyPostsQuery = () => {
  return useSuspenseQuery({
    queryKey: ['my-posts', page],
    queryFn: () => mypageApi.getMyPosts(page),
    staleTime: 1000 * 60 * 5,  // ✅ 5분 유지 (자주 변하지 않음)
  });
};

// src/entities/mypage/model/useMyCommentsQuery.ts
export const useMyCommentsQuery = () => {
  return useSuspenseQuery({
    queryKey: ['my-comments', page],
    queryFn: () => mypageApi.getMyComments(page),
    staleTime: 1000 * 60 * 5,  // ✅ 5분 유지
  });
};
```

**영향:**
- 불필요한 API 요청 감소 (특히 탭 전환 시)
- useMypageQuery와 일관성 (둘 다 5분)

---

### 2. Post 상세 조회 - 과도한 폴링 제거

**현재 문제:**
```typescript
// src/widgets/post-comments/ui/PostCommentsWidget.tsx (line 34-39)
const { data: post } = useSuspenseQuery({
  queryKey: ['post', postId],
  queryFn: () => fetchPostById(postId),
  refetchInterval: 30_000,        // ❌ 30초 폴링
  refetchOnMount: 'always',       // ❌ 마운트할 때마다 무조건 refetch
});
```

**결과:**
- 마운트: 즉시 refetch
- 30초 후: 폴링으로 refetch
- 댓글 작성 후 컴포넌트 리마운트: 또 refetch
- 총 3-5회 불필요한 요청

**개선 (2가지 선택):**

**옵션 A: 폴링 제거 (추천)**
```typescript
// src/widgets/post-comments/ui/PostCommentsWidget.tsx
const { data: post } = useSuspenseQuery({
  queryKey: ['post', postId],
  queryFn: () => fetchPostById(postId),
  // refetchInterval, refetchOnMount 제거
  staleTime: 1000 * 60,  // 1분 유지 (충분함)
});
```

**옵션 B: 폴링 유지하되 refetchOnMount 제거**
```typescript
const { data: post } = useSuspenseQuery({
  queryKey: ['post', postId],
  queryFn: () => fetchPostById(postId),
  refetchInterval: 30_000,  // 30초 폴링만 유지
  // refetchOnMount 제거
});
```

**이유:** 댓글은 뮤테이션 성공 시 캐시 무효화하므로 폴링 불필요

---

### 3. Post 게시글 목록 - staleTime 추가

**현재 문제:**
```typescript
// src/entities/post/model/usePostsQuery.ts
export const usePostsQuery = (page: number) => {
  return useQuery({
    queryKey: postQueryKeys.list(page),
    queryFn: () => postApi.getPosts(page),
    placeholderData: (prev) => prev,
    staleTime: 0,  // ❌ 즉시 만료
  });
};
```

**결과:**
- 보드 페이지 탭 전환: refetch
- 검색 후 목록으로 복귀: refetch
- 1분 지나서 다시 클릭: refetch

**개선:**
```typescript
export const usePostsQuery = (page: number) => {
  return useQuery({
    queryKey: postQueryKeys.list(page),
    queryFn: () => postApi.getPosts(page),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 30,  // ✅ 30초 유지 (적절함)
  });
};
```

**이유:** 게시글은 사용자 액션 후 뮤테이션으로 무효화되므로 30초면 충분

---

## 🟨 중간 우선순위 (코드 개선)

### 4. LikeButton - Optimistic Update 단순화

**현재 문제 (복잡함):**
```typescript
// src/features/post-like/ui/LikeButton.tsx
const { mutate } = useMutation({
  mutationFn: () => toggleLike(postId),
  onMutate: async () => {
    // 1. 캐시 업데이트
    queryClient.setQueryData<PostDetail>(['post', postId], (old) => {
      return { ...old, isLiked: !old.isLiked, likeCount: ... };
    });
  },
  onSuccess: (data) => {
    // 2. 서버 응답으로 merge
    queryClient.setQueryData<PostDetail>(['post', postId], (old) => {
      const cleanData = Object.fromEntries(...);
      return { ...old, ...cleanData };
    });
  },
  onSettled: () => {
    // 3. 백그라운드 무효화
    queryClient.invalidateQueries({
      queryKey: ['post', postId],
      type: 'inactive'
    });
  },
  onError: (_err, _vars, context) => {
    // 4. 롤백
    if (context?.previous) {
      queryClient.setQueryData(['post', postId], context.previous);
    }
  },
});

// useSyncExternalStore로 캐시 구독 (과도함)
const post = useSyncExternalStore(
  (listener) => queryClient.getQueryCache().subscribe(listener),
  () => queryClient.getQueryData<PostDetail>(['post', postId]) || {...}
);
```

**개선 (단순화):**
```typescript
// Option 1: 간단한 optimistic update
const { mutate } = useMutation({
  mutationFn: () => toggleLike(postId),
  onMutate: async () => {
    // 이전 데이터 백업
    const prev = queryClient.getQueryData<PostDetail>(['post', postId]);

    // 캐시 즉시 업데이트
    queryClient.setQueryData<PostDetail>(['post', postId], (old) => {
      if (!old) return old;
      return {
        ...old,
        isLiked: !old.isLiked,
        likeCount: old.isLiked ? old.likeCount - 1 : old.likeCount + 1,
      };
    });

    return { prev };
  },
  onError: (err, vars, context) => {
    // 실패 시 롤백만
    if (context?.prev) {
      queryClient.setQueryData(['post', postId], context.prev);
    }
  },
});

// 컴포넌트는 useQuery 그대로 사용
const { data: post } = useSuspenseQuery({
  queryKey: ['post', postId],
  queryFn: () => fetchPostById(postId),
});

// useSyncExternalStore 제거
```

**이유:**
- onSuccess에서 데이터 merge 불필요 (onMutate에서 이미 완료)
- onSettled + invalidateQueries는 다른 곳에서 하므로 중복
- useSyncExternalStore 과도함 (useQuery만으로 충분)

---

### 5. Post 쿼리 키 일관성 개선

**현재 문제:**
```typescript
// src/entities/post/model/usePostsQuery.ts
export const postQueryKeys = {
  all: ['posts'],
  list: (page) => ['posts', 'list', page],
  detail: (postId) => ['posts', 'detail', postId],
};

// src/widgets/post-detail/ui/PostDetailWidget.tsx
// 하지만 사용 시에는:
queryKey: ['post', postId]  // postQueryKeys.detail() 미사용 ❌
```

**개선:**
```typescript
// src/widgets/post-detail/ui/PostDetailWidget.tsx
const { data: post } = useSuspenseQuery({
  queryKey: postQueryKeys.detail(postId),  // ✅ queryKeys 함수 사용
  queryFn: () => fetchPostById(postId),
});

// src/widgets/post-comments/ui/PostCommentsWidget.tsx
const { data: post } = useSuspenseQuery({
  queryKey: postQueryKeys.detail(postId),  // ✅ 일관성
  queryFn: () => fetchPostById(postId),
});

// src/features/post-like/ui/LikeButton.tsx
queryClient.setQueryData(postQueryKeys.detail(postId), ...);  // ✅ 일관성
```

**이유:** 일관성 + 리팩토링 시 쿼리 키 변경이 한 곳에서만 일어남

---

### 6. MyPage 쿼리 키 계층 구조 추가

**현재 문제:**
```typescript
// 각각 따로 관리됨
['mypage']
['my-posts', page]
['my-comments', page]

// nickname 변경 시:
queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
queryClient.invalidateQueries({ queryKey: ['mypage'] });
// 내 게시글/댓글은 무효화되지 않음! ❌
```

**개선:**
```typescript
// src/entities/mypage/model/mypageQueryKeys.ts (새 파일 추가)
export const mypageQueryKeys = {
  all: ['mypage'] as const,
  profile: () => ['mypage', 'profile'] as const,
  posts: () => ['mypage', 'posts'] as const,
  postsList: (page: number) => ['mypage', 'posts', page] as const,
  comments: () => ['mypage', 'comments'] as const,
  commentsList: (page: number) => ['mypage', 'comments', page] as const,
};

// src/entities/mypage/model/useMypageQuery.ts
export const useMypageQuery = () => {
  return useSuspenseQuery({
    queryKey: mypageQueryKeys.profile(),  // ['mypage', 'profile']
    queryFn: mypageApi.getMyPage,
    staleTime: 1000 * 60 * 5,
  });
};

// src/entities/mypage/model/useMyPostsQuery.ts
export const useMyPostsQuery = (page: number) => {
  return useSuspenseQuery({
    queryKey: mypageQueryKeys.postsList(page),  // ['mypage', 'posts', page]
    queryFn: () => mypageApi.getMyPosts(page),
    staleTime: 1000 * 60 * 5,
  });
};

// src/entities/mypage/model/useMyCommentsQuery.ts
export const useMyCommentsQuery = (page: number) => {
  return useSuspenseQuery({
    queryKey: mypageQueryKeys.commentsList(page),  // ['mypage', 'comments', page]
    queryFn: () => mypageApi.getMyComments(page),
    staleTime: 1000 * 60 * 5,
  });
};

// src/features/nickname-edit/model/useNicknameEditMutation.ts
export const useNicknameEditMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (nickname: string) => mypageApi.updateNickname(nickname),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['auth', 'me']
      });

      // ✅ 마이페이지의 모든 데이터 무효화
      queryClient.invalidateQueries({
        queryKey: mypageQueryKeys.all  // ['mypage'] ← 공통 부모
      });
    },
  });
};
```

**계층 구조:**
```
mypage
├── mypage/profile
├── mypage/posts
│   ├── mypage/posts/0
│   ├── mypage/posts/1
│   └── ...
└── mypage/comments
    ├── mypage/comments/0
    ├── mypage/comments/1
    └── ...

invalidateQueries(['mypage']) → 모두 무효화
invalidateQueries(['mypage', 'posts']) → posts만 무효화
```

---

### 7. Inquiry - useMutation으로 통일

**현재 문제 (불일치):**
```typescript
// src/widgets/inquiry/ui/InquiryWriteForm.tsx
const handleSubmit = async () => {
  // ❌ raw async/await 사용
  await createInquiry({ title, content });
  queryClient.invalidateQueries({ queryKey: ['inquiries-all'] });
  router.push('/inquiries');
};

// src/features/inquiry/ui/DeleteInquiryButton.tsx
const handleDelete = async () => {
  // ❌ raw async/await 사용
  await deleteInquiry(id);
  queryClient.invalidateQueries({ queryKey: ['inquiries-all'] });
};
```

**개선:**
```typescript
// src/features/inquiry/model/useCreateInquiryMutation.ts (새 파일)
export const useCreateInquiryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { title: string; content: string }) =>
      createInquiry(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['inquiries-all']
      });
    },
  });
};

// src/widgets/inquiry/ui/InquiryWriteForm.tsx
const { mutate: createInquiry, isPending } = useCreateInquiryMutation();

const handleSubmit = () => {
  createInquiry(
    { title, content },
    {
      onSuccess: () => {
        router.push('/inquiries');
      },
    }
  );
};

// src/features/inquiry/model/useDeleteInquiryMutation.ts (새 파일)
export const useDeleteInquiryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteInquiry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['inquiries-all']
      });
    },
  });
};

// src/features/inquiry/ui/DeleteInquiryButton.tsx
const { mutate: deleteInquiry, isPending } = useDeleteInquiryMutation();
```

**이유:**
- 다른 mutation과 일관성 (모두 useMutation 사용)
- 에러 처리 자동화
- isPending 상태 활용 가능

---

## 🟩 낮은 우선순위 (선택적)

### 8. Posts 목록을 Suspense로 전환 (선택사항)

**현재:**
```typescript
// src/entities/post/model/usePostsQuery.ts
const usePostsQuery = (page: number) => {
  return useQuery({  // ← 수동 로딩 상태 처리 필요
    queryKey: postQueryKeys.list(page),
    queryFn: () => postApi.getPosts(page),
    placeholderData: (prev) => prev,
  });
};
```

**사용처에서:**
```typescript
// src/widgets/board-main/ui/BoardMain.tsx
const { data: posts, isLoading } = usePostsQuery(page);
// isLoading이 true이면 로딩 UI 표시
```

**Suspense 전환:**
```typescript
const usePostsQuery = (page: number) => {
  return useSuspenseQuery({  // ← Suspense 자동 처리
    queryKey: postQueryKeys.list(page),
    queryFn: () => postApi.getPosts(page),
    placeholderData: (prev) => prev,
  });
};
```

**단, 주의:**
- 페이지 변경 시 Suspense 다시 trigger (fallback 표시)
- `placeholderData`와 충돌 가능 (한쪽만 적용)
- 현재 방식이 더 부드러울 수 있음

---

## 📊 개선 효과 예상

| 항목 | 개선 전 | 개선 후 | 절감 |
|------|--------|--------|------|
| 마이페이지 진입 API 호출 | 3개 (profile + posts + comments) | 1개 (캐시) | 67% |
| Post 상세 댓글 로드 | 5-10회 (폴링+마운트) | 1-2회 | 60-80% |
| 탭 전환 시 요청 | 매번 새로고침 | 30초마다만 | 90% |
| LikeButton 코드 라인 | 60+ | 30 | 50% |

---

## 📝 적용 순서 (추천)

1. **먼저:** `useMyPostsQuery` / `useMyCommentsQuery` staleTime 수정 (1분)
2. **다음:** `usePostsQuery` staleTime 추가 (1분)
3. **그다음:** Post 상세 refetchOnMount 제거 (2분)
4. **선택:** LikeButton 단순화 (10-15분, 선택사항)
5. **선택:** 쿼리 키 정리 (20분, 미룰 수 있음)

