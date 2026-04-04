# miru — 日本就職を目指す韓国人学生のための自己分析支援 Web アプリ UI

**Live Demo**: <a href="https://miru.io.kr" target="_blank" rel="noopener noreferrer">https://miru.io.kr</a> &nbsp;|&nbsp; **Figma**: <a href="https://www.figma.com/design/Dq6hFbh3o4TRSrUx8u48QD/%EC%9E%90%EA%B8%B0%EB%B6%84%EC%84%9D-%EC%82%AC%EC%9D%B4%ED%8A%B8?node-id=0-1&p=f&t=yJxDSOe8TYtT9bfy-0" target="_blank" rel="noopener noreferrer">UI/UX デザインを見る</a>

---

## 目次

- [サービス概要](#-サービス概要)
- [担当範囲](#-担当範囲)
- [Demo](#-demo担当フロー)
- [実装した機能](#-実装した機能)
- [技術的ハイライト](#-技術的ハイライト)
- [アーキテクチャ](#-アーキテクチャ)
- [担当ディレクトリ](#-担当ディレクトリ構成)
- [API 連携仕様](#-api-連携仕様担当部分)
- [状態管理](#-状態管理戦略担当領域)
- [重要実装ポイント](#-重要実装ポイント)
- [パフォーマンス / UX](#-パフォーマンス--ux)
- [ローカル起動](#-ローカル起動)

---

## 🎯 サービス概要

本サービスは、**日本就職を目指す韓国人学生**に向けて、  
自己分析の重要性を理解し、質問ベースで思考を深めながら、  
自分の経験・価値観・志望理由を**自分の言葉で説明できる状態**をつくるための自己分析支援サービスである。

単に模範解答を見せたり、きれいな文章を自動生成したりすることが目的ではない。  
面接で深掘りされたときにも崩れないよう、  
自分自身の経験を、自分の頭で整理し、自分の言葉で語れる状態をつくることを目的としている。

---

## 👥 担当範囲

**コミュニティ掲示板・通知・1:1 問い合わせ・ヘッダー / フッターの実装を担当**

| 機能 | 詳細 |
|---|---|
| **コミュニティ掲示板** | 投稿一覧・詳細・作成・編集・削除、いいね（楽観的更新）、コメント/返信 |
| **リアルタイム通知** | 未読バッジ（30s ポーリング）、通知一覧（無限スクロール）、既読処理 |
| **1:1 お問い合わせ** | 問い合わせ作成・一覧・詳細、管理者回答の確認 |
| **ヘッダー / フッター** | ナビゲーション、通知パネル、認証状態の UI 反映 |

---

## 📸 Demo（担当フロー）

```
[ログイン後ダッシュボード]
   ↓
[掲示板リスト / 検索]  (ページネーション)
   ↓
[投稿詳細 + コメント/返信] (Suspense 付きポーリング自動更新, 15s)
   ↓ [いいね] → 楽観的更新 (useState + QueryCache 二層同期)
   ↓
[ヘッダーの通知ベル] (30s ポーリングで未読バッジ更新)
   ↓ [タップ]
[通知一覧パネル] (デスクトップ) / [通知ページ] (モバイル)
   ↓ [スクロール]
[無限スクロール自動ローディング] (IntersectionObserver)
   ↓
[問い合わせ作成 / 確認] (Tiptap リッチテキストエディタ)
```

---

## ✨ 実装した機能

### 1. コミュニティ掲示板

**投稿一覧・詳細**
- `GET /api/boards?page=&size=10` で 10 件単位ページネーション
- `GET /api/boards/search?keyword=&page=` で キーワード検索（検索中は検索結果、検索解除時は通常リスト）
- `Suspense` + `ErrorBoundary` で宣言的ローディング・エラー表示

**いいね（楽観的更新の核心）**
```typescript
// src/features/post-like/ui/LikeButton.tsx
const [likeState, setLikeState] = useState({
  isLiked: initialIsLiked,
  likeCount: initialLikeCount,
});

const { mutate, isPending } = useMutation({
  mutationFn: () => toggleLike(postId),
  onMutate: async () => {
    // ローカル React state を即座に更新（UI 反応）
    const newIsLiked = !likeState.isLiked;
    setLikeState({ 
      isLiked: newIsLiked, 
      likeCount: newIsLiked ? likeState.likeCount + 1 : likeState.likeCount - 1 
    });
    
    // キャッシュも同時に更新（他のコンポーネント共有）
    queryClient.setQueryData(detailKey, (old) => ({
      ...old,
      isLiked: newIsLiked,
      likeCount: newIsLiked ? old.likeCount + 1 : old.likeCount - 1,
    }));
  },
  onError: (_err, _vars, context) => {
    // エラー時ロールバック
    setLikeState({ isLiked: context.previous.isLiked, likeCount: context.previous.likeCount });
    queryClient.setQueryData(detailKey, context.previous);
  },
  onSettled: () => {
    // 確実に同期するため最後に無効化
    queryClient.invalidateQueries({ queryKey: detailKey });
  },
});
```

- **二層同期**: `useState` で即座に反応、`QueryCache` で他コンポーネント間データ共有
- **クリック防止**: `isPending` で二重送信を防止

**コメント・返信**
- リッチなネスト構造：各コメント → replies 配列 → 各返信
- `parentId` を渡すことで "返信" か "トップレベルコメント" かを区別（同じ API エンドポイント）
- 返信は自動で `@writerName` メンション付け
- 削除・編集は owner check（クライアント mount 後に判定して SSR hydration mismatch 回避）

### 2. リアルタイム通知

**バッジ（未読ポーリング 30s）**
```typescript
// src/entities/alarm/model/useHasUnreadQuery.ts
export function useHasUnreadQuery() {
  const { data: user } = useAuth();
  return useQuery({
    queryKey: alarmQueryKeys.hasUnread(),
    queryFn: alarmApi.getHasUnread,  // GET /api/alarms/has-unread
    enabled: !!user,                 // ログイン時のみ有効
    refetchInterval: 30_000,         // 30 秒ごと
    staleTime: 0,                    // 常に stale 状態
    refetchOnWindowFocus: false,     // タブ切り替えでは更新しない
  });
}
```

- ヘッダーの `AlarmBell` が赤いドットを表示
- ログアウト時に自動的にバッジ非表示（キャッシュにアクセスしない）

**通知一覧（無限スクロール）**
```typescript
// src/widgets/alarm-panel/ui/AlarmsPageClient.tsx
const sentinelRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    },
    { threshold: 0.1 }
  );
  if (sentinelRef.current) observer.observe(sentinelRef.current);
  return () => observer.disconnect();
}, [hasNextPage, fetchNextPage]);

// UI: 最下部に sentinel div を配置
{hasNextPage && <div ref={sentinelRef} className="h-4" />}
```

- `IntersectionObserver` で要素が画面に入ったら `fetchNextPage()`
- ページ番号ベースのカーソル（`allPages.length` で次ページ index を計算）

**Query Key 階層設計（"全既読" 効率化の秘訣）**
```typescript
// src/entities/alarm/model/alarmQueryKeys.ts
export const alarmQueryKeys = {
  hasUnread: () => ['alarms', 'has-unread'],        // 独立したキー
  items:     () => ['alarms', 'items'],             // 親キー
  list:    (page) => ['alarms', 'items', 'list', page],
  infinite:   () => ['alarms', 'items', 'infinite'],
};

// "全既読" 時の処理
onSuccess: () => {
  // Step 1: Badge を即座に false に（再フェッチ待たない）
  queryClient.setQueryData(alarmQueryKeys.hasUnread(), { hasUnread: false });
  
  // Step 2: items 配下のページ全て無効化（hasUnread は独立してるので触らない）
  queryClient.invalidateQueries({ queryKey: alarmQueryKeys.items() });
},
```

- 同一 parent 配下のすべての child を無効化 → いちいち URL パラメータを指定しなくてよい
- sibling の `hasUnread` には影響しない

### 3. 1:1 お問い合わせ

**特徴**
- Tiptap による**リッチテキストエディタ**で本文入力（自己分析機能と統一）
- Markdown サポート（リスト、太字、リンク等）
- 管理者からの回答確認

**作成フロー** (`/inquiries/write`)
- `InquiryWriteForm` で タイトル + Tiptap エディタ
- `POST /api/inquiries` で送信
- 成功時 → `/inquiries` へリダイレクト

**詳細閲覧フロー** (`/inquiries/:id`)
- `InquiryDetailWidget` で 401 チェック
- ログインなし → `useLoginRequired` の `checkAuth()` でモーダル表示（Axios interceptor と同じ経路）
- 管理者回答がある場合は `InquiryAdminAnswer` コンポーネントで表示

**削除**
- `DELETE /api/inquiries/:id`
- 問い合わせ一覧を無効化（再フェッチ）
- 確認モーダル付き

### 4. ヘッダー / フッター

**スクロール効果（rAF Throttle）**
```typescript
// src/widgets/header/lib/useHeaderScroll.ts
export function useHeaderScroll(threshold = 80) {
  const [isScrolled, setIsScrolled] = useState(false);
  let ticking = false;

  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > threshold);
        ticking = false;
      });
      ticking = true;
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return isScrolled;
}
```

- `requestAnimationFrame` + `ticking` フラグで不要な RAF コール削減
- 80px スクロール後に glassmorphism 背景を有効化

**通知パネル（モバイル/デスクトップ分岐）**
```typescript
// src/widgets/header/ui/AlarmBell.tsx
const handleBellClick = () => {
  if (isMobile) {
    checkAuth(() => router.push('/alarms')); // モバイル: フルページ遷移
    return;
  }
  togglePanel(); // デスクトップ: Popover トグル
};

// Popover 状態は Zustand で管理
const { isOpen } = useAlarmStore();
```

- **モバイル**: `/alarms` フルページへ遷移
- **デスクトップ**: ヘッダーの Popover で通知パネル表示
- Zustand (`useAlarmStore`) で状態管理 → 他コンポーネントから `closePanel()` 可能

**認証状態反映**
```typescript
// src/widgets/header/ui/UserActions.tsx
const { data: user, isLoading } = useAuth();

{isLoading ? <skeleton /> : user ? <LogoutButton /> : <LoginLink />}
```

- 初期ローディング中は Skeleton 表示（レイアウトシフト防止）
- ログアウト: キャッシュを直ちに `null` に設定 → 無効化待たずに UI 変更

---

## 🏗️ アーキテクチャ

### レイヤー構造 (FSD: Feature-Sliced Design)

```
┌─────────────────────────────────────┐
│     Browser / Next.js (SSR)         │
├─────────────────────────────────────┤
│  Pages (app/)                       │  ルーティング、メタデータ、レイアウト
├─────────────────────────────────────┤
│  Widgets                            │  画面単位の組み立て
│  ├─ board-main/                    │  掲示板リスト + ページネーション
│  ├─ board-detail/                  │  投稿詳細 + コメント
│  ├─ alarm-panel/                   │  通知パネル
│  ├─ inquiry/                        │  問い合わせ作成・詳細
│  ├─ header/                         │  ナビゲーション、通知ベル
│  └─ footer/                         │  フッター
├─────────────────────────────────────┤
│  Features                           │  ユーザーインタラクション
│  ├─ post-like/                      │  いいね（楽観的更新）
│  ├─ comment-create/                 │  コメント・返信作成
│  ├─ comment-edit/                   │  コメント編集
│  ├─ comment-delete/                 │  コメント削除
│  ├─ alarm-read-one/                 │  通知1件既読
│  ├─ alarm-read-all/                 │  全通知既読
│  ├─ inquiry/                         │  問い合わせ CRUD
│  └─ auth/                           │  ログイン
├─────────────────────────────────────┤
│  Entities                           │  ドメインモデル + Query hooks
│  ├─ post/                           │  投稿、コメント、いいね
│  ├─ alarm/                          │  通知
│  ├─ inquiry/                         │  問い合わせ
│  ├─ comment/                         │  コメント
│  └─ auth/                           │  ユーザー
├─────────────────────────────────────┤
│  Shared                             │
│  ├─ api/                            │  Axios インスタンス + auth API
│  ├─ lib/                            │  共通 hooks、sanitize、events
│  └─ ui/                             │  再利用 UI コンポーネント
└─────────────────────────────────────┘
```

### 通信フロー（401 処理の一元化）

```
[Component（問い合わせ詳細等）]
   ↓ useLoginRequired でガード
   ↓ useQuery / useMutation
[TanStack Query]
   ↓
[Axios Interceptor]
   ├─ 401 → window.dispatchEvent('auth:logout')
   ├─ 403 "利用規約" → window.dispatchEvent('auth:terms-required')
   ├─ 403 "停止" → window.dispatchEvent('auth:account-banned')
   └─ 403 その他 → 200ms 後に 1 回自動リトライ
   ↓
[Backend API (Spring Boot)]
   ↓
[AuthProvider]
   └─ window events 受信 → モーダル表示 + リダイレクト
```

---

## 📁 担当ディレクトリ構成

```
src/
├── entities/
│   ├── post/
│   │   ├── model/
│   │   │   ├── types.ts               # Post, Comment, Reply 型
│   │   │   ├── api.ts                 # 投稿 API 関数
│   │   │   ├── postQueryKeys.ts       # Query Key factory
│   │   │   └── usePostsQuery.ts       # 投稿リスト・詳細 hooks
│   │   └── ui/
│   │       ├── PostList.tsx           # リスト UI
│   │       ├── PostCard.tsx           # リストアイテム
│   │       └── PostDetailHeader.tsx   # 詳細ヘッダー
│   ├── alarm/
│   │   ├── model/
│   │   │   ├── types.ts               # Alarm 型
│   │   │   ├── alarmQueryKeys.ts      # Query Key (階層設計)
│   │   │   ├── useHasUnreadQuery.ts   # バッジポーリング
│   │   │   ├── useAlarmsQuery.ts      # 通知リスト
│   │   │   └── useAlarmsInfiniteQuery.ts # 無限スクロール
│   │   └── ui/
│   │       └── AlarmItem.tsx          # 通知アイテム
│   ├── comment/
│   │   └── ui/
│   │       └── CommentItem.tsx        # コメント UI
│   └── inquiry/
│       └── model/
│           └── types.ts               # Inquiry 型
│
├── features/
│   ├── post-like/
│   │   ├── model/
│   │   │   └── api.ts                 # いいね toggle API
│   │   └── ui/
│   │       └── LikeButton.tsx         # 楽観的更新の実装
│   ├── comment-create/
│   │   ├── model/
│   │   │   └── api.ts                 # コメント作成 API
│   │   └── ui/
│   │       ├── CommentForm.tsx        # トップレベルコメント
│   │       └── ReplyForm.tsx          # 返信フォーム
│   ├── comment-edit/
│   │   └── ui/
│   │       └── EditCommentForm.tsx
│   ├── comment-delete/
│   │   └── ui/
│   │       └── DeleteCommentButton.tsx
│   ├── alarm-read-one/
│   │   └── model/
│   │       └── useReadOneAlarmMutation.ts
│   ├── alarm-read-all/
│   │   └── model/
│   │       └── useReadAllAlarmsMutation.ts
│   └── inquiry/
│       ├── model/
│       │   ├── types.ts
│       │   ├── api.ts
│       │   ├── useCreateInquiryMutation.ts
│       │   └── useDeleteInquiryMutation.ts
│       └── ui/
│           ├── InquiryList.tsx
│           ├── InquiryItem.tsx
│           └── DeleteInquiryButton.tsx
│
├── widgets/
│   ├── board-main/
│   │   └── ui/
│   │       └── BoardMain.tsx          # リスト + ページネーション
│   ├── board-detail/
│   │   └── ui/
│   │       └── BoardDetail.tsx        # 詳細ページ
│   ├── post-comments/
│   │   └── ui/
│   │       ├── PostCommentsWidget.tsx # 詳細内のコメント組み立て
│   │       └── PostCommentsSection.tsx
│   ├── alarm-panel/
│   │   └── ui/
│   │       ├── AlarmPanel.tsx         # Popover パネル
│   │       ├── AlarmList.tsx          # 通知リスト
│   │       └── AlarmsPageClient.tsx   # 無限スクロール実装
│   ├── inquiry/
│   │   └── ui/
│   │       ├── InquiryWriteForm.tsx   # Tiptap フォーム
│   │       ├── InquiryDetailWidget.tsx # 401 チェック含む
│   │       └── InquiryAdminAnswer.tsx
│   ├── header/
│   │   ├── lib/
│   │   │   └── useHeaderScroll.ts     # rAF throttle
│   │   └── ui/
│   │       ├── Header.tsx             # sticky + 効果
│   │       ├── AlarmBell.tsx          # モバイル/デスクトップ分岐
│   │       ├── UserActions.tsx        # ログイン/ログアウト
│   │       └── Navigation.tsx
│   └── footer/
│       └── ui/
│           └── Footer.tsx
│
└── shared/
    ├── api/
    │   └── apiClient.ts               # Axios + CSRF + 401 処理
    ├── lib/
    │   ├── hooks/useLoginRequired.ts  # 認証ガード
    │   ├── sanitize.ts                # DOMPurify
    │   └── events.ts                  # カスタムイベント型
    └── ui/
        └── (shadcn components)
```

---

## 🔌 API 連携仕様（担当部分）

### 基本設定

```typescript
// .env.local
NEXT_PUBLIC_API_NIP_URL=https://api.example.com
```

すべての API 呼び出しは Next.js の Route Handler 経由（BFF プロキシ）：  
`[Browser] → [/api/*] → [Next.js] → [Spring Boot]`

### 認証方式

- **Session Cookie** (`withCredentials: true`)
- **CSRF Token**: クッキーの XSRF-TOKEN → `X-XSRF-TOKEN` ヘッダー（自動注入）
- **401 処理**: `auth:logout` イベント発火 → AuthProvider が受信 → モーダル + `/login` リダイレクト

### 主要エンドポイント

| Method | Endpoint | 用途 | 実装 |
|---|---|---|---|
| `GET` | `/api/me` | ログインユーザー取得 | `src/entities/auth/model/useAuth.ts` |
| `GET` | `/api/boards?page=&size=10` | 投稿一覧 | `src/entities/post/model/usePostsQuery.ts` |
| `GET` | `/api/boards/search?keyword=&page=` | キーワード検索 | `src/widgets/board-main/ui/BoardMain.tsx` |
| `GET` | `/api/boards/:id` | 投稿詳細 + コメント | `src/widgets/board-detail/ui/BoardDetail.tsx` |
| `POST` | `/api/boards/:id/like` | いいね toggle | `src/features/post-like/ui/LikeButton.tsx` |
| `POST` | `/api/boards/:id/comment` | コメント作成 | `src/features/comment-create/ui/CommentForm.tsx` |
| `POST` | `/api/boards/:id/comment` (`parentId` 付き) | 返信作成 | `src/features/comment-create/ui/ReplyForm.tsx` |
| `PATCH` | `/api/comments/:id` | コメント編集 | `src/features/comment-edit/ui/EditCommentForm.tsx` |
| `DELETE` | `/api/comments/:id` | コメント削除 | `src/features/comment-delete/ui/DeleteCommentButton.tsx` |
| `GET` | `/api/alarms/has-unread` | 未読バッジ | `src/entities/alarm/model/useHasUnreadQuery.ts` |
| `GET` | `/api/alarms?page=` | 通知一覧 | `src/widgets/alarm-panel/ui/AlarmsPageClient.tsx` |
| `PATCH` | `/api/alarms/:id/read` | 通知 1 件既読 | `src/features/alarm-read-one/model/useReadOneAlarmMutation.ts` |
| `PATCH` | `/api/alarms/read-all` | 全通知既読 | `src/features/alarm-read-all/model/useReadAllAlarmsMutation.ts` |
| `POST` | `/api/inquiries` | 問い合わせ作成 | `src/features/inquiry/ui/InquiryWriteForm.tsx` |
| `GET` | `/api/inquiries` | 問い合わせ一覧 | `src/features/inquiry/ui/InquiryList.tsx` |
| `GET` | `/api/inquiries/:id` | 問い合わせ詳細 | `src/widgets/inquiry/ui/InquiryDetailWidget.tsx` |
| `DELETE` | `/api/inquiries/:id` | 問い合わせ削除 | `src/features/inquiry/ui/DeleteInquiryButton.tsx` |

---

## 🧠 状態管理戦略（担当領域）

### Server State (TanStack Query v5)

**デフォルト設定** (`src/app/providers/TanStackProvider.tsx`):
```typescript
staleTime: 1000 * 60,        // 1 分以内は再リクエストしない
gcTime: 1000 * 60 * 5,       // 5 分後にメモリ解放
retry: 1,                    // 1 回自動リトライ
refetchOnWindowFocus: false, // タブ切り替え時の自動更新なし
```

**投稿リスト（ページネーション）**
```typescript
// src/entities/post/model/usePostsQuery.ts
useQuery({
  queryKey: postQueryKeys.list(page),
  queryFn: () => postApi.getPosts(page, 10),
  staleTime: 0,  // ページごとに常に fresh
});

// Query Key Factory で無効化戦略
postQueryKeys = {
  all: ['posts'],
  lists: ['posts', 'list'],         // ← 投稿作成後に invalidate
  list: (page) => ['posts', 'list', page],
};
```

**投稿詳細（コメント 15s ポーリング）**
```typescript
// src/widgets/post-comments/ui/PostCommentsWidget.tsx
useQuery({
  queryKey: postQueryKeys.detail(postId),
  refetchInterval: 15_000,  // 15 秒ごとにコメント更新
  refetchIntervalInBackground: false,
});
```

**通知 Query Key の階層設計**
```typescript
// 独立した hasUnread キー（全既読時に setQueryData で即座に false に）
alarmQueryKeys.hasUnread() → ['alarms', 'has-unread']

// items 配下を一括無効化（個別ページを指定しなくてよい）
alarmQueryKeys.items() → ['alarms', 'items']
  ├─ list(0) → ['alarms', 'items', 'list', 0]
  └─ infinite() → ['alarms', 'items', 'infinite']
```

### Client State (Zustand)

**通知パネル** (`src/app/store/useAlarmStore.ts`):
```typescript
export const useAlarmStore = create((set) => ({
  isOpen: false,
  togglePanel: () => set((s) => ({ isOpen: !s.isOpen })),
  closePanel: () => set({ isOpen: false }),
}));
```

- ヘッダーで `togglePanel()`
- 通知をクリックして移動時に別コンポーネントから `closePanel()` 可能

### Form State

**コメント・返信**: `useState` + 手動バリデーション（RHF は過剰）  
**問い合わせ**: Tiptap エディタ + `useState`（Tiptap との RHF 統合は複雑）  
**いいね**: ローカル `useState` + QueryCache 同期

---

## 🔑 重要実装ポイント

### 1️⃣ 楽観的更新（いいね）

**課題**  
クリック → サーバーレスポンス → 画面更新 の流れでは UX が悪い。  
ボタンが反応しない間に複数回クリックされる可能性。

**アプローチ**  
`useState` + `QueryCache` の**二層同期**で両方を瞬座に更新：

```typescript
// src/features/post-like/ui/LikeButton.tsx の full flow
onMutate: async () => {
  // ✅ Step 1: ローカル state 更新 → 即座に UI 反応
  const newIsLiked = !likeState.isLiked;
  setLikeState({ isLiked: newIsLiked, likeCount: ... });
  
  // ✅ Step 2: QueryCache 更新 → 詳細ページなど別コンポーネントも同期
  queryClient.setQueryData(detailKey, (old) => ({
    ...old,
    isLiked: newIsLiked,
    likeCount: ...,
  }));
  
  // ⚠️ Step 3: in-flight refetch をキャンセル
  await queryClient.cancelQueries({ queryKey: detailKey });
  
  return { previous }; // rollback 用
},
onSuccess: (data) => {
  // ✅ Step 4: サーバー値で正規化（念のため）
  setLikeState({ isLiked: data.isLiked, likeCount: data.likeCount });
  queryClient.setQueryData(detailKey, (old) => ({ ...old, ...data }));
},
onError: (_err, _vars, context) => {
  // ⚠️ Step 5: エラー時は context.previous で完全ロールバック
  setLikeState({ isLiked: context.previous.isLiked, likeCount: context.previous.likeCount });
  queryClient.setQueryData(detailKey, context.previous);
},
```

**トレードオフ**
- ✅ クリック → 即座に反応（0ms 待ち）
- ❌ ローカル state + キャッシュの分岐で複雑度増加
- ✅ エラーハンドリングで完全ロールバック可能

### 2️⃣ 無限スクロール + Query Key 階層設計（通知）

**課題**  
100 件以上の通知をページネーションボタンで送信する不便さ、  
"全既読" 時に `badge = false` に更新しつつ `items` ページはすべて無効化する必要性。

**アプローチ**

(A) **無限スクロール実装**：
```typescript
// src/widgets/alarm-panel/ui/AlarmsPageClient.tsx
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();  // 自動で次ページ取得
      }
    },
    { threshold: 0.1 }
  );
  if (sentinelRef.current) observer.observe(sentinelRef.current);
  return () => observer.disconnect();
}, [hasNextPage, fetchNextPage]);
```

- sentinel div が画面に入ったら自動的に `fetchNextPage()`
- ユーザーはスクロール操作のみで OK

(B) **Query Key 階層設計**：
```typescript
export const alarmQueryKeys = {
  hasUnread: () => ['alarms', 'has-unread'],      // sibling
  items:     () => ['alarms', 'items'],            // parent
  list:    (page) => ['alarms', 'items', 'list', page],      // child
  infinite:   () => ['alarms', 'items', 'infinite'],         // child
};

// "全既読" 時
onSuccess: () => {
  // ① badge を即座に false に（正規化）
  queryClient.setQueryData(alarmQueryKeys.hasUnread(), { hasUnread: false });
  
  // ② items 配下すべてを無効化（list(0), list(1), ..., infinite())
  queryClient.invalidateQueries({ queryKey: alarmQueryKeys.items() });
},
```

- `alarmQueryKeys.items()` を指定すると、配下のすべての child が無効化される
- `hasUnread` は sibling なので影響しない
- ページ番号を個別に指定する必要がない

**トレードオフ**
- ✅ スクロール + 自動ローディングで UX 向上
- ✅ Query Key 階層で無効化コード簡潔化
- ❌ ブラウザバック時のスクロール位置復元が不完全（Next.js Router 制約）

### 3️⃣ セッションイベントバス（401 一元管理）

**課題**  
問い合わせ詳細で 401 エラー → ログインモーダルを表示したいが、  
毎回 API ごとに同じコードを書きたくない。

**アプローチ**
```typescript
// Step 1: Axios インターセプタで globally dispatch
// src/shared/api/apiClient.ts
if (error.response?.status === 401) {
  window.dispatchEvent(new Event('auth:logout'));
  return Promise.reject(error);
}

// Step 2: 問い合わせ詳細コンポーネント
// src/widgets/inquiry/ui/InquiryDetailWidget.tsx
const { checkAuth } = useLoginRequired();
const { data } = useQuery({
  queryFn: async () => {
    try {
      return await inquiryApi.getDetail(id);
    } catch (error) {
      if (error?.status === 401) {
        checkAuth(() => {}); // モーダル表示
        throw error;
      }
      throw error;
    }
  },
  enabled: !!user,  // ログイン後のみリクエスト
});

// Step 3: AuthProvider が全体で受信
// src/app/providers/AuthProvider.tsx
window.addEventListener('auth:logout', () => {
  openModal(...);
  router.push('/login');
});
```

- **利点**: Axios interceptor で 401 を globally catch でき、各 API で処理重複なし
- **利点**: どのコンポーネントからでも同じイベント経路で通知される
- **注意**: イベント駆動なのでテストが若干難しい

### 4️⃣ ヘッダー UX（rAF Throttle + モバイル分岐）

**課題**  
スクロール時に毎フレーム `setIsScrolled()` が呼ばれる → 不要な再レンダリング、  
モバイル/デスクトップで通知パネルの振る舞いを変えたい。

**アプローチ**

(A) **rAF Throttle**：
```typescript
// src/widgets/header/lib/useHeaderScroll.ts
export function useHeaderScroll(threshold = 80) {
  const [isScrolled, setIsScrolled] = useState(false);
  let ticking = false;

  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > threshold);
        ticking = false;  // next RAF のため reset
      });
      ticking = true;  // 次のスクロール待機
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return isScrolled;
}
```

- スクロールイベントが 100 回でも、RAF は最大 1 フレーム 1 回のみ実行
- CPU 節約 + ブラウザ最適化

(B) **モバイル/デスクトップ分岐**：
```typescript
// src/widgets/header/ui/AlarmBell.tsx
const isMobile = useMediaQuery('(max-width: 768px)');

const handleBellClick = () => {
  if (isMobile) {
    checkAuth(() => router.push('/alarms'));  // フルページ遷移
    return;
  }
  togglePanel();  // Popover トグル（デスクトップ）
};
```

- モバイル: `/alarms` フルページで通知を閲覧（スペース効率）
- デスクトップ: ヘッダー Popover で通知パネル（操作性）
- パネル状態は Zustand 管理 → 他から `closePanel()` 可能

---

## ⚡ パフォーマンス / UX

| 項目 | 実装 | 効果 |
|---|---|---|
| **Suspense + Error Boundary** | `useSuspenseQuery` + `ErrorBoundaryWrapper` | 宣言的ローディング・エラー処理（ネットワーク遅延シミュレーション対応） |
| **Query Caching** | `staleTime: 60s` | 1 分以内の再遷移で API 再呼び出しなし |
| **rAF Throttle** | `requestAnimationFrame` + `ticking` フラグ | スクロール時の不要な再レンダリング削減 |
| **HTML Sanitize** | `DOMPurify` on Tiptap 出力 | XSS 防止（ユーザー入力される HTML） |
| **Skeleton UI** | ローディング中に Skeleton 表示 | レイアウトシフト（CLS）防止 |
| **Code Splitting** | Next.js 標準 (App Router) | ページ別 JS バンドル最小化 |
| **ポーリング最適化** | `refetchInterval: 30000`, `refetchOnWindowFocus: false` | バッテリー消費抑制（タブ非アクティブ時ポーリング停止） |
| **無限スクロール** | `IntersectionObserver` | ページネーションボタンより自然な UX |

---

## ✅ 品質 & ビルド

### ESLint
```bash
npm run lint
```

設定: `eslint.config.mjs` (flat config v9)
- `eslint-config-next/core-web-vitals`
- `eslint-config-next/typescript`

### ビルド
```bash
npm run build   # 型チェック + lint + SSR ビルド
npm run dev     # 開発サーバー (localhost:3000)
```

---

## 🚀 ローカル起動

```bash
# 1. リポジトリをクローン
git clone https://github.com/wyLortel/miru-frontend.git
cd miru-frontend

# 2. 依存関係インストール
npm install

# 3. 環境変数設定
cp .env.example .env.local
# .env.local を編集
# NEXT_PUBLIC_API_NIP_URL=https://api.example.com

# 4. 開発サーバー起動
npm run dev
# → http://localhost:3000
```

### 担当機能の動作確認

```bash
# 掲示板・コメント・いいね
http://localhost:3000/boards

# 通知（ヘッダーベル）
http://localhost:3000  # ← ベルをクリック

# 通知一覧
http://localhost:3000/alarms

# 問い合わせ
http://localhost:3000/inquiries
http://localhost:3000/inquiries/write
```

---

**Last Updated**: 2026-04-04  
**Author**: JEOUNG WOOYOUNG (@wyLortel)
