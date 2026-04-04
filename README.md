# miru — 日本就職を目指す韓国人学生のための自己分析支援 Web アプリ UI

**Live Demo**: <a href="https://miru.io.kr" target="_blank" rel="noopener noreferrer">https://miru.io.kr</a> &nbsp;|&nbsp; **Figma**: <a href="https://www.figma.com/design/Dq6hFbh3o4TRSrUx8u48QD/%EC%9E%90%EA%B8%B0%EB%B6%84%EC%84%9D-%EC%82%AC%EC%9D%B4%ED%8A%B8?node-id=0-1&p=f&t=yJxDSOe8TYtT9bfy-0" target="_blank" rel="noopener noreferrer">UI/UX デザインを見る</a>

---

## 目次

- [サービス概要](#-サービス概要)
- [Demo](#-demo)
- [主な機能](#-主な機能-ユーザー価値ベース)
- [Tech Stack](#-tech-stack-選定理由付き)
- [アーキテクチャ](#-アーキテクチャ)
- [フォルダ構成](#-フォルダ構成-責務付き)
- [API 連携仕様](#-api-連携仕様)
- [状態管理戦略](#-状態管理戦略)
- [重要実装ポイント](#-重要実装ポイント)
- [ローカル起動](#-ローカル起動)
- [担当範囲](#-担当範囲)
- [ロードマップ](#-ロードマップ-改善計画-3-件)

---

## 🎯 サービス概要

本サービスは、**日本就職を目指す韓国人学生**に向けて、  
自己分析の重要性を理解し、質問ベースで思考を深めながら、  
自分の経験・価値観・志望理由を**自分の言葉で説明できる状態**をつくるための自己分析支援サービスである。

単に模範解答を見せたり、きれいな文章を自動生成したりすることが目的ではない。  
面接で深掘りされたときにも崩れないよう、  
自分自身の経験を、自分の頭で整理し、自分の言葉で語れる状態をつくることを目的としている。

### このサービスを作った背景

過去に日本就職を経験した中で、大きな失敗をした。  
表面的な答えでは通用せず、「なぜそう考えたのか」「なぜその会社なのか」まで丁寧に深掘りされることが多かった。  
この経験から、**自己分析が不足していると、実力があっても自分を伝えきれない**ことを痛感した。

また、多くの学生が「自己分析より技術勉強のほうが重要」「そもそも自己分析が何か分からない」という状態にあることも分かり、  
これは個人の失敗ではなく、日本就職を目指す学生が共通してぶつかりやすい**構造的な問題**だと考えた。

---

## 📸 Demo

**ログイン → 自己分析作成 → コミュニティ → 通知 フロー**

```
[ログイン画面]
   ↓ (Google OAuth2)
[自己分析ダッシュボード] (Tiptap リッチテキストエディタ)
   ↓
[コミュニティ掲示板] (投稿/いいね/コメント)
   ↓
[リアルタイム通知バッジ] (無限スクロール通知一覧)
```


---

## ✨ 主な機能 (ユーザー価値ベース)

| 機能 | 説明 |
|---|---|
| **自己分析 作成/編集** | リッチテキストエディタ(Tiptap)で自己分析を整理 |
| **コミュニティ掲示板** | 投稿作成、いいね (楽観的更新)、コメント/返信 |
| **リアルタイム通知** | バッジ 30 秒ポーリング、通知一覧は無限スクロールで即時表示 |
| **1:1 お問い合わせ** | ユーザー → 管理者への問い合わせ・回答確認 |
| **マイページ** | プロフィール管理、自分の投稿/コメント一覧、退会 |
| **管理者ダッシュボード** | ユーザー管理（停止/復旧）、お問い合わせ対応 |

---

## 🛠️ Tech Stack (選定理由付き)

| 分野 | ライブラリ | バージョン | 選定理由 |
|---|---|---|---|
| **Framework** | Next.js | 16.1.6 | CSR・SSR を柔軟に使い分けられる。静的ページは SSR で SEO を確保しつつ、インタラクティブな操作は CSR で対応 |
| **Language** | TypeScript | ^5 | 型安全性、チーム開発の効率化 |
| **Styling** | Tailwind CSS + shadcn/ui | v4.1.18 + ^3.8.4 | クラス名でスタイルが一目でわかり、修正箇所をすぐ特定できる。shadcn/ui との組み合わせでデザインの統一性を保ちながら、素早く UI を構築できる |
| **Server State** | TanStack Query | ^5.90 | キャッシュ/無効化の細粒度制御、staleTime/gcTime 戦略で API 呼び出し最小化 |
| **Client State** | Zustand | ^5.0 | グローバル UI 状態（モーダル/通知パネル）を最小限に管理、ボイラープレート不要 |
| **HTTP Client** | Axios | ^1.13 | インターセプタによる CSRF/401 処理の一元化 |
| **Rich Text** | Tiptap | ^3.19 | 自己分析サービスの特性上、構造化テキスト編集が必要 |
| **HTML セキュリティ** | DOMPurify | ^3.3 | XSS 防止（dangerouslySetInnerHTML 使用時） |
| **Date Util** | dayjs | ^1.11 | 軽量な日時操作 |
| **Error Boundary** | react-error-boundary | ^6.1 | Suspense と組み合わせた宣言的エラー処理 |
| **Icons** | lucide-react | ^0.564 | Tailwind と統合、tree-shakeable |


---

## 🏗️ アーキテクチャ

### レイヤー構造 (FSD: Feature-Sliced Design)

```
┌─────────────────────────────────────┐
│     Browser / Next.js (SSR)         │
├─────────────────────────────────────┤
│  Pages (app/)                       │  ルーティング、メタデータ、レイアウト
├─────────────────────────────────────┤
│  Widgets                            │  画面単位の組み立て (header, board-main など)
├─────────────────────────────────────┤
│  Features                           │  ユーザーインタラクション単位 (post-like など)
├─────────────────────────────────────┤
│  Entities                           │  ドメインモデル + TanStack Query hooks
├─────────────────────────────────────┤
│  Shared                             │
│  ├─ api/                           │  Axios インスタンス + auth API
│  ├─ lib/                           │  共通 hooks、sanitize、events
│  └─ ui/                            │  再利用 UI コンポーネント (shadcn base)
└─────────────────────────────────────┘
```

### コア通信フロー

```
[Component]
   ↓ (useLoginRequired ガード)
   ↓ (useMutation / useQuery)
[TanStack Query Client]
   ↓
[Axios Interceptor]
   ├─ 401 → window.dispatchEvent('auth:logout')
   ├─ 403 "利用規約" → window.dispatchEvent('auth:terms-required')
   ├─ 403 "停止" → window.dispatchEvent('auth:account-banned')
   └─ 403 その他 → 200ms 後に 1 回自動リトライ (CSRF タイミング回避)
   ↓
[Backend API (Spring Boot, 別 repo)]
   ↓
[AuthProvider (全体)]
   └─ window events 受信 → モーダル表示 + リダイレクト
```

### 認証戦略

- **方式**: Google OAuth2 → Session Cookie (`withCredentials: true`)
- **CSRF 保護**: XSRF-TOKEN クッキー自動読み取り → X-XSRF-TOKEN ヘッダー注入 (`src/shared/api/apiClient.ts:14-20`)
- **セッション期限切れ**: 401 レスポンス → `auth:logout` イベント → `AuthProvider` 受信 → モーダル + `/login` リダイレクト
- **ロール別リダイレクト**: ログイン直後 `role === 'ADMIN'` → `/admin/inquiries` (sessionStorage で 1 回のみ)

---

## 📁 フォルダ構成 (責務付き)

```
src/
├── app/                                    # Next.js App Router
│   ├── (with-layout)/                     # Header/Footer 付きルートグループ
│   │   ├── page.tsx                       # ホーム
│   │   ├── about/                         # サービス紹介
│   │   ├── boards/                        # 掲示板 (list, detail, write, edit)
│   │   ├── analysis/                      # 自己分析 (list, detail-edit)
│   │   ├── inquiries/                     # 1:1 お問い合わせ
│   │   ├── mypage/                        # マイページ (profile, boards, comments)
│   │   ├── alarms/                        # 通知一覧
│   │   └── admin/                         # 管理者 (inquiries, users 管理)
│   ├── login/                             # ログイン (レイアウトなし)
│   ├── terms/                             # 利用規約 (レイアウトなし)
│   ├── layout.tsx                         # Root レイアウト (providers 含む)
│   ├── providers/
│   │   ├── TanStackProvider.tsx            # TanStack Query デフォルト設定
│   │   ├── AuthProvider.tsx                # セッション管理、イベントバス
│   │   └── ModalProvider.tsx               # Zustand モーダルレンダラー
│   └── store/
│       ├── useModalStore.ts                # グローバルモーダル (priority システム)
│       └── useAlarmStore.ts                # 通知パネル open/close
│
├── widgets/                               # ページ単位の組み立てコンポーネント
│   ├── header/
│   ├── footer/
│   ├── board-main/
│   ├── board-detail/
│   ├── analysis-main/
│   ├── admin-inquiries/
│   └── ...
│
├── features/                              # ユーザーインタラクション単位
│   ├── auth/
│   │   └── model/login.ts                 # Google OAuth リダイレクト
│   ├── post-like/
│   │   └── model/useToggleLike.ts         # 楽観的更新 + rollback
│   ├── comment-create/
│   ├── alarm-read-one/
│   ├── alarm-read-all/
│   └── ...
│
├── entities/                              # ドメインモデル + query hooks
│   ├── auth/
│   │   └── model/useAuth.ts              # GET /api/me (useSuspenseQuery)
│   ├── post/
│   │   └── model/postQueryKeys.ts        # Query key factory
│   ├── alarm/
│   │   ├── model/useHasUnreadQuery.ts    # バッジポーリング (refetchInterval: 30s)
│   │   └── model/useAlarmsInfiniteQuery.ts # 無限スクロール
│   └── ...
│
└── shared/                                # 共有インフラ
    ├── api/
    │   ├── apiClient.ts                   # Axios インスタンス (CSRF + 401 処理)
    │   └── auth.ts                        # authApi オブジェクト
    ├── lib/
    │   ├── hooks/useLoginRequired.ts      # ログインチェック + モーダル
    │   ├── hooks/usePagination.ts         # ページネーションユーティリティ
    │   ├── sanitize.ts                    # DOMPurify ラッパー
    │   └── events.ts                      # カスタムイベント型定義
    └── ui/
        ├── tiptap-editor.tsx              # リッチテキストエディタ (共有)
        ├── ErrorBoundaryWrapper.tsx       # Suspense + ErrorBoundary
        └── ... (shadcn components)
```

---

## 🔌 API 連携仕様

### 基本設定

```typescript
// .env.local
NEXT_PUBLIC_API_NIP_URL=https://api.example.com
```

**Note**: すべての API 呼び出しは Next.js の same-origin プロキシ経由 (BFF パターン)。  
クライアント → `/api/*` → Next.js Route Handler → バックエンド API。

### 認証方式

- **Session Cookie** (`withCredentials: true`)
- **CSRF Token**: クッキーの XSRF-TOKEN 値 → `X-XSRF-TOKEN` ヘッダーへ注入
- **実装**: `src/shared/api/apiClient.ts:14-20`

### Cookie 属性方針

| 属性 | 想定値 | 意図 |
|---|---|---|
| `HttpOnly` | `true` | JavaScript からのクッキー読み取りを禁止し、XSS によるセッション奪取を防ぐ |
| `Secure` | `true` (本番) | HTTPS 通信時のみクッキーを送信。HTTP 通信での漏洩を防ぐ |
| `SameSite` | `Lax` | CSRF 対策の基本ライン。同一オリジンと GET の外部リンクのみ送信 |

> **Note**: Cookie 属性はバックエンド (Spring Boot) 側で設定。フロントは CSRF トークンをヘッダーで二重防御。

### CORS / Origin 方針

```
[Browser] → [Next.js Route Handler (same-origin)] → [Spring Boot API]
```

- フロントは Next.js の Route Handler を **BFF プロキシ** として経由する same-origin 構成
- ブラウザから直接バックエンドへ cross-origin リクエストを送らないため、CORS エラーが発生しない
- バックエンドは Next.js サーバーからのリクエストのみ許可すればよく、`allowedOrigins` のスコープが最小化される

### エラー処理方針

| ステータス | 動作 | 実装箇所 |
|---|---|---|
| `401` | `auth:logout` イベント → セッション期限切れモーダル → `/login` | `apiClient.ts:52-58` |
| `403` "利用規約" | `auth:terms-required` イベント → `/terms` リダイレクト | `apiClient.ts:59-61` |
| `403` "停止" | `auth:account-banned` イベント → 停止モーダル | `apiClient.ts:62-64` |
| `403` その他 | 200ms 後に **1 回自動リトライ** (CSRF タイミング回避) | `apiClient.ts:65-71` |
| `5xx` | トーストエラーメッセージ表示 | Error boundary |

### 型管理

TypeScript インターフェースを手動定義 (`entities/*/types.ts`)。  
→ **理由**: Zod によるランタイム検証オーバーヘッド vs バックエンド型への信頼度のトレードオフで手動定義を選択。

### 主要エンドポイント (8 件)

| Method | Endpoint | クエリ | 用途 |
|---|---|---|---|
| `GET` | `/api/me` | - | ログインユーザー取得 (useSuspenseQuery) |
| `GET` | `/api/posts` | `page=1&limit=10` | 投稿一覧 (ページネーション) |
| `GET` | `/api/posts/:id` | - | 投稿詳細 + コメント (useSuspenseQuery) |
| `POST` | `/api/posts/:id/like` | - | いいね切り替え (楽観的更新) |
| `GET` | `/api/alarms` | `page=1` | 通知一覧 (useInfiniteQuery) |
| `GET` | `/api/alarms/has-unread` | - | 未読バッジ (refetchInterval: 30s) |
| `GET` | `/api/analysis` | - | 自己分析質問一覧 |
| `POST` | `/api/agreements` | `{ type: 'TERMS' }` | 利用規約同意 |

---

## 🧠 状態管理戦略

### Server State (TanStack Query v5)

**デフォルト設定** (`src/app/providers/TanStackProvider.tsx`):
```typescript
staleTime: 1000 * 60,        // 1 分以内は再リクエストしない
gcTime: 1000 * 60 * 5,       // 5 分後にメモリ解放
retry: 1,                    // 1 回自動リトライ
refetchOnWindowFocus: false, // タブ切り替え時の自動更新なし
```

**Query Key Factory パターン** (スコープ無効化):
```typescript
// src/entities/post/model/postQueryKeys.ts
postQueryKeys = {
  all: ['posts'],
  lists: ['posts', 'list'],
  list: (page) => ['posts', 'list', page],
  detail: (id) => ['posts', 'detail', id],
};

// 投稿作成後 → スコープ無効化
queryClient.invalidateQueries({ queryKey: postQueryKeys.lists })
// → すべての list ページを更新、detail はそのまま
```

**ポーリング** (通知バッジ):
```typescript
// src/entities/alarm/model/useHasUnreadQuery.ts
useQuery({
  refetchInterval: 30_000,  // 30 秒ごとにポーリング
  enabled: !!user,          // ログイン時のみ有効
});
```

**無限スクロール** (通知一覧):
```typescript
// src/entities/alarm/model/useAlarmsInfiniteQuery.ts
useInfiniteQuery({
  getNextPageParam: (lastPage, pages) => {
    const fetched = pages.length * LIMIT;
    return fetched < totalCount ? fetched : undefined;
  },
});
// UI: IntersectionObserver + sentinel div → fetchNextPage()
```

### Client State (Zustand v5)

**グローバルモーダル** (priority システム):
```typescript
// src/app/store/useModalStore.ts
enum MODAL_PRIORITY {
  DEFAULT = 0,   // 通常のモーダル
  HIGH = 10,     // セッション期限切れ、利用規約、停止通知
}

openModal(modal) {
  if (modal.priority < current?.priority) return; // 低優先度は無視
}
```

→ **理由**: セッション期限切れ (HIGH:10) モーダルが通常モーダル (DEFAULT:0) に隠れる問題を解決。

### Form State

**戦略**: `useState` + 手動バリデーション

→ **理由**:
- 分析回答: Tiptap エディタ中心 → RHF との統合が難しい
- 掲示板投稿: タイトル/本文のみ → RHF はオーバーエンジニアリング

---

## 🔑 重要実装ポイント

### 1️⃣ セキュリティ設計 — 危険可能性の先制対応

**考え方**: 脆弱性が実際に発生したというより、入力値・URL・アクセス経路を信頼しすぎると危険になるポイントを先回りして対策した。

#### XSS 対策 (`src/shared/lib/sanitize.ts`)
Tiptap のリッチテキスト出力時、DOMPurify でホワイトリスト方式の サニタイズを実行。
ユーザー生成コンテンツを表示する際、許可タグ・属性を限定し、危険なスクリプトタグやイベントハンドラを除去する仕組みを用意。

```typescript
// 例: 強み・弱みの本文テキストを安全にレンダリング
const safeHtml = sanitize(tiptapOutput);
<div dangerouslySetInnerHTML={{ __html: safeHtml }} />
```

**判断**: HTML レンダリング機能は必要だが、悪意あるコンテンツまで許容するべきではないと考えた。

#### Open Redirect 対策 (`src/shared/lib/validateUrl.ts`)
ログイン後の遷移先を指定する際、redirect URL を **相対パスのみ** に限定。
外部サイトへの意図しないリダイレクトを防ぐため、`//`, `javascript:`, 絶対URL はすべて遮断。

```typescript
// ✅ 許可: /mypage, /board/1
// ❌ 拒否: //evil.com, javascript:alert(), http://...
validateUrl(redirectPath) // → boolean
```

**判断**: 利便性のための redirect 機能は欲しいが、フィッシングサイトなどの外部リダイレクトに悪用される道は塞ぐべきと判断。

#### 非ログインアクセス遮断 (`src/shared/lib/hooks/useLoginRequired.ts`)
認証が必要な画面では useLoginRequired() フックで保護。
非ログイン状態なら自動でモーダルを表示し、ユーザーに理由を示した上でログイン画面へ誘導。

```typescript
const { user } = useLoginRequired(); // ログイン必須
```

**判断**: サーバー middleware ではなくクライアント層で明示的に制御することで、ユーザーが遷移理由を理解できる状態にすると判断。

**共通の基準**: 
- 実際の被害より「どうなるとリスクか」を先に見て対策する
- 機能は保ちながら危険な使われ方を塞ぐ設計を選択  

---

### 2️⃣ 通知機能 — 設計上の責務分離

**考え方**: 通知機能は単純に見えても、デバイス文脈・データの重さ・状態の性格が異なるため、責務を分離する必要があった。バグというより「それぞれに最適な設計」を選択した。

#### UI フロー の分離
通知を見る使い方がデバイスごとに異なるため、UI フロー 自体を分ける:
- **PC**: AlarmBell アイコン → クリック → AlarmPanel（ポップオーバー）で最新通知を確認
- **モバイル**: AlarmBell アイコン → クリック → `/alarms` ページへ遷移し、全通知を無限スクロールで閲覧

反応型 CSS で同じコンポーネントを無理やり調整するのではなく、デバイスごとに最適な UX フローを選択。

#### データ管理の分離
通知には２つの種類があり、管理方法が異なるため分離:

**未読フラグ** (`hasUnread`, Query Key: `['alarms', 'has-unread']`):
- 役割: バッジの赤点表示用
- ポーリング: 30 秒間隔（軽量データなため頻繁に確認）

**通知一覧** (`items`, Query Key: `['alarms', 'items', ...]`):
- 役割: 詳細内容表示用
- ポーリング: なし（重い無限スクロールクエリ、遅延取得）

分けることで「赤点の更新は軽く、リスト全体は重く」という異なるポーリング戦略が可能に。

#### 状態管理層の分離
状態の性格（どこが原本か）に応じて管理ツールを分ける:
- **UI 状態** (パネル開閉): `useAlarmStore` (Zustand)  
  → ローカル画面の見た目のみ、原本なし
- **サーバー状態** (通知データ): TanStack Query  
  → サーバーが原本、キャッシュと同期を保つ

**判断基準**:  
- デバイス文脈が異なれば、UI フロー 自体を分ける
- データの役割（赤点か詳細か）が異なれば、Query キーを分ける
- 状態の原本（UI のみか サーバーか）が異なれば、管理ツールを分ける

---

### 3️⃣ 認証フロー — 実際に遭遇した複合問題

**考え方**: 認証状態と UI 表示がずれるという実際の問題があり、原因を層別に追跡して整理した。

#### 実際に起きていた問題
最初は「セッション期限切れモーダルが不安定」という症状に見えたが、深掘りすると複数の原因が絡んでいた:

1. **イベント重複購読**: GlobalModal と AuthProvider が同時に同じイベントをリッスンしていて、モーダルが重複したり閉じ忘れが発生
2. **401 の分岐が不明確**: HTTP 401 エラーを一般的な「リクエスト失敗」として扱い、ログイン画面へのリダイレクトが遅れる
3. **CSRF クッキー問題**: nip.io ドメイン環境でセッションクッキーが正しく送信されず、ログアウト時に 403 エラーが発生
4. **キャッシュ更新戦略**: `queryClient.clear()` でキャッシュをクリアしても、その後 `useAuth()` が再度呼ばれてヘッダー表示がちらつく

#### 整理のプロセス

**401 エラーを認証フローへ分岐** (`src/shared/api/apiClient.ts`):
```typescript
if (error.response?.status === 401) {
  checkAuth(); // 実際の auth 状態を再確認して、モーダル表示か判定
} else {
  // その他の HTTP エラー
}
```

**キャッシュ更新を確定的に** (`ログアウト時`):
```typescript
// queryClient.clear() ではなく
queryClient.setQueryData(['auth', 'me'], null);
// → ヘッダーコンポーネント が即座に非ログイン UI に更新
```

**イベント購読を一元化**: AuthProvider が唯一の受信者となるよう設計を整理。

#### 学んだポイント
- 非ログイン状態の人に「セッション期限切れ」モーダルを表示すると混乱させる
- ログアウト後は、UI がサーバー状態を即座に反映する必要がある
- HTTP 401 は一般的な「リクエスト失敗」ではなく「認証が必要な状態」として扱う

---

### 4️⃣ パフォーマンス — 実際の症状と最適化戦略

**考え方**: 実際の使用環境で起きた問題を見て、複数の対策を検討し、最終的に採用したものを選択。

#### 掲示板の最新性確保

**実際の症状**: 地下鉄など遅い通信環境で使うと、他ユーザーのいいね/コメントが画面に反映されるまで遅れる。

**検討した案**: prefetch を使って「次のデータを先読みする」ことで遷移時の空白を埋める案も検討。

**最終選択** (`staleTime: 0` + `refetchOnWindowFocus: true`):
- キャッシュを 0ms で古いと判定 → タブ復帰/再進入時に自動更新
- `placeholderData` で既存データを表示中 → 完全に空の画面を回避
- 結果: ロード体感は落ちるが、常に最新データを保つ

**判断**: 掲示板では「数秒遅くても常に正しい状態」が「数秒早いが古い状態」より重要と判断。

#### 画像表示の最適化

**実際の症状**: 地下鉄での遅い通信時、ログイン画面や hero 画像などが遅く表示される。

**最初の仮説と検証**: 「画像が大きいから」と思って WebP 変換を試みたが、改善が十分でなかった。

**原因を分層**:
1. **原本ファイルサイズ** (hero.png: 1.3MB)
2. **ブラウザでの再検証オーバーヘッド** (毎回キャッシュ確認)

**最終採用の対策**:

1. **初回ダウンロード削減** (WebP + リサイズ)
   - hero 画像を WebP 変換、表示サイズに合わせてリサイズ (1.3MB → 200KB)

2. **再訪問時の再ダウンロード削減** (Cache-Control 強化)
   - 静的資産 (`/assets/`、ロゴなど) に `max-age=31536000, immutable` を設定
   - 再訪問時はブラウザキャッシュを即座に再利用、再検証リクエストなし

**判断基準**: パフォーマンス問題を「初回が遅い」「再訪問が遅い」に分けて、それぞれに最適な対策を適用。
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

---

## 👥 担当範囲

**このリポジトリはフロントエンド専任です。**

| メンバー構成 | 役割 |
|---|---|
| フロントエンド 2 名 | UI/UX、ルーティング、状態管理、API 連携 |
| バックエンド 1 名 | Spring Boot API、認証、DB |

### 自分の担当機能

| 機能 | 担当箇所 |
|---|---|
| **コミュニティ掲示板** | 投稿一覧・詳細・作成・編集・削除、いいね（楽観的更新）、コメント/返信 |
| **通知** | 未読バッジ（ポーリング）、通知一覧（無限スクロール）、既読処理 |
| **1:1 お問い合わせ** | 問い合わせ作成・一覧・詳細、管理者回答の確認 |
| **ヘッダー / フッター** | ナビゲーション、通知パネル、認証状態の UI 反映 |

---

## 🗺️ ロードマップ 

### 1. ユーザー自身によるカスタム質問追加

**背景**: 実際のユーザーフィードバックで「自分が考えたい質問を追加したい」という要望が多数。  
**目標**: 既存の自己分析質問リストに加えて、ユーザー独自の質問を作成・管理できる機能。  
**作業**:
- カスタム質問 CRUD エンドポイント連携
- 既存質問リストとの統合表示
- 削除/非表示の状態管理

### 2. 自己分析質問へのタグ追加 + フィルタリング

**背景**: 質問数が増えるにつれて「志望動機系」「強み/弱み系」など分類して見たいという要望。  
**目標**: 各質問にタグを付与し、タグ別フィルタで絞り込み表示できるようにする。  
**作業**:
- タグ定義 (カテゴリ: 志望動機・自己PR・経験・価値観 など)
- フィルタ UI の実装


---

## 📖 参考資料

- [Next.js 公式ドキュメント](https://nextjs.org/docs)
- [TanStack Query v5](https://tanstack.com/query/v5)
- [Zustand](https://github.com/pmndrs/zustand)
- [Tiptap](https://tiptap.dev)
- [shadcn/ui](https://ui.shadcn.com)

---

**Last Updated**: 2026-04-01  
**Maintainer**: JEOUNG WOOYOUNG (@wyLortel)
