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

### 1. セキュリティ設計 — 信頼境界を意識した防御
「入力値・URL・アクセス経路はそのまま信頼しない」という方針で、機能を維持しながら危険な使われ方を防ぐ設計を行いました。

- **XSS 対策 (`src/shared/lib/sanitize.ts`)**
  - Tiptap のリッチテキスト出力を DOMPurify ベースでサニタイズし、許可タグ・属性のみを残すようにしました。
- **Open Redirect 対策 (`src/shared/lib/validateUrl.ts`)**
  - ログイン後の遷移先は相対パスのみ許可し、外部 URL や危険なスキームを遮断しました。
- **非ログインアクセス制御 (`src/shared/lib/hooks/useLoginRequired.ts`)**
  - 認証が必要な画面では `useLoginRequired()` を用いて、非ログイン時にモーダル経由でログイン導線を明示しました。

> HTML は必要でも危険なスクリプトまで許可しない、  
> redirect は便利でも外部遷移を無制限に許可しない、  
> 認証状態は曖昧にしない、という基準で整理しました。

---

### 2. 通知機能 — デバイス文脈と状態の責務分離
通知機能は一見単純でも、デバイスごとの利用文脈・データの役割・状態の性格が異なるため、それぞれの責務を分離して設計しました。

- **UI フローの分離**
  - PC: `AlarmPanel` のポップオーバーで最新通知を確認
  - Mobile: `/alarms` 専用ページで一覧を確認
- **Query の分離**
  - `hasUnread`: 赤点表示用の軽量データ（30秒ポーリング）
  - `items`: 通知一覧表示用の詳細データ（遅延取得）
- **状態管理の分離**
  - UI 状態 (パネル開閉): Zustand
  - サーバー状態 (通知データ): TanStack Query

> 同じ通知機能でも、  
> デバイス文脈・データの重さ・原本の所在が異なるため、  
> それぞれを別責務として扱いました。

---

### 3. 認証フロー — 状態一貫性の改善
認証まわりでは、セッション期限切れモーダル、401/403 エラー、ログアウト後の表示ずれなど、複数の要因が絡む問題がありました。  
そのため、イベント処理・認証エラーの分岐・キャッシュ更新の責務を整理し、UI と認証状態が一貫して見えるよう改善しました。

- 401 を一般エラーではなく、認証が必要な状態として分岐
- ログアウト後は `['auth', 'me']` キャッシュを明示的に null に更新
- イベント購読を整理し、モーダル挙動の重複を防止

> 認証 UX では、  
> 「今ログインしているのか」が曖昧に見えないことを重要視しました。

---

### 4. パフォーマンス — 画面特性に応じた最適化
パフォーマンス改善では、単一の原因に決めつけず、画面の性格に応じて最適化方針を分けました。

- **掲示板の最新性確保**
  - `staleTime: 0` と `refetchOnWindowFocus: true` を採用し、一覧の鮮度を優先
  - `placeholderData` により、更新時の空白感を抑制
- **画像表示の最適化**
  - 大きい画像は WebP 変換とリサイズを実施
  - 静的資産には `Cache-Control` を設定し、再訪問時の再利用性を向上

> 掲示板ではキャッシュ効率より最新性を優先し、  
> 画像では初回表示と再訪問時の再利用を分けて改善しました。
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
