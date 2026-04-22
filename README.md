# miru — 日本就職を目指す韓国人学生のための自己分析支援 Web アプリ UI

**Live Demo**: <a href="https://miru.io.kr" target="_blank" rel="noopener noreferrer">https://miru.io.kr</a> &nbsp;|&nbsp; **Figma**: <a href="https://www.figma.com/design/Dq6hFbh3o4TRSrUx8u48QD/%EC%9E%90%EA%B8%B0%EB%B6%84%EC%84%9D-%EC%82%AC%EC%9D%B4%ED%8A%B8?node-id=0-1&p=f&t=yJxDSOe8TYtT9bfy-0" target="_blank" rel="noopener noreferrer">UI/UX デザインを見る</a>

---

## 目次

- [サービス概要](#-サービス概要)
- [Demo](#-demo)
- [主な機能](#-主な機能-ユーザー価値ベース)
- [Tech Stack](#-tech-stack)
- [アーキテクチャ](#-アーキテクチャ)
- [フォルダ構成](#-フォルダ構成-責務付き)
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

## 🛠️ Tech Stack

| 分野 | ライブラリ |
|---|---|
| **Framework** | Next.js |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Server State** | TanStack Query |
| **Client State** | Zustand |
| **HTTP Client** | Axios |
| **Rich Text** | Tiptap |
| **HTML セキュリティ** | DOMPurify |
| **Date Util** | dayjs |
| **Error Boundary** | react-error-boundary |
| **Icons** | lucide-react |

### 選定理由

**Next.js**
- SEO が必要な静的ページと、インタラクションが多い動的ページが共存するサービス構成だった
- チームはすでに React 経験があり、React ベースで SEO 対応とサーバー/クライアント分離を両立できる Next.js が最も現実的な選択だと判断した

**TypeScript**
- チームは Java 経験があり、静的型の概念には慣れていた
- JavaScript の動的型ではデータ構造の追跡が煩雑になるため、API レスポンス・関数引数・共通状態をより安全かつ明確に管理できる TypeScript を選択した

**Tailwind CSS + shadcn/ui**
- チームの CSS 習熟度にばらつきがあり、一貫した UI を素早く構築する必要があった
- Tailwind でスタイルをコンポーネント内に直感的に記述できる点と、shadcn/ui で再利用可能な UI コンポーネントを即座に活用できる点を組み合わせた

**TanStack Query**
- 当初は useEffect で API 呼び出しを管理していたが、ローディング/エラー/再取得/キャッシュ/更新タイミングを毎回手動で処理するのが煩雑だった
- 投稿・コメント・通知など、サーバーから取得するデータを「サーバー状態」として捉え、宣言的に管理するために導入した

**Zustand**
- 状態をサーバー状態と UI 状態に分けて考え、UI 状態だけを最もシンプルに管理するために選択した

**Tiptap**
- お問い合わせ作成ページで、単純な textarea ではなく、見出し・強調・色指定といったリッチテキスト入力が必要だった
- 自前で実装するコストが大きいため、拡張性の高いエディタである Tiptap を選択した

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

### 3. 認証 UX — 状態一貫性の改善
認証まわりでは、セッション期限切れモーダル、401/403 エラー、ログアウト後の表示ずれなど、複数の要因が絡む問題がありました。  
そのため、イベント処理・認証エラーの分岐・キャッシュ更新の責務を整理し、UI と認証状態が一貫して見えるよう改善しました。

- 401 を一般エラーではなく、認証が必要な状態として分岐
- ログアウト後は `['auth', 'me']` キャッシュを明示的に null に更新
- イベント購読を整理し、モーダル挙動の重複を防止

> 認証 UX では、  
> 「今ログインしているのか」が曖昧に見えないことを重要視しました。

---

### 4. UX品質 — 実環境での検証と最適化
DevTools だけでなく実機器での動作を基準に、表示品質と読み込み体験を改善しました。

- **実機器ベースの検証**
  - DevTools で 320px が OK に見えても、実機器ではレイアウトが崩れるケースがあった
  - 原因はアドレスバー・下部バー・safe area など、DevTools では再現できない要素
  - **複数端末・実環境での確認を基準に変更**し、実際の可視領域に対応するレイアウト設計に修正

- **画像・静的資産の最適化**
  - 大きい画像は WebP 変換とリサイズを実施し、初回表示を改善
  - 静的資産には `Cache-Control` を設定し、再訪問時の再利用性を向上

> 「スマホサイズの数字を合わせる」ではなく、  
> 実際に使う環境で確認することが反応型の本質と考えました。

---

### 5. OAuth2 直後の CSRF タイミング不具合 — 原因特定と最小修正

OAuth2 ログイン直後の最初の POST リクエストが時々 403 で失敗する問題がありました。

- **観測された現象**
  - ログイン成功後、記事作成など状態変更リクエストが初回のみ 403 Forbidden で失敗
  - 2 回目以降のリクエストは正常に成功
- **原因特定のプロセス**
  - 失敗したリクエストと成功したリクエストのヘッダーを比較
  - 失敗: `JSESSIONID` クッキーは存在 → **`XSRF-TOKEN` クッキーと `X-XSRF-TOKEN` ヘッダーが**ない
  - 成功: 両方ともクッキーとヘッダーに正常に含まれている
  - サーバー応答: 失敗 403 でも `Set-Cookie: XSRF-TOKEN=...` を返している
  - **判定**: セッションは成立したが、OAuth2 redirect 直後の初期レンダで要求が早すぎて、`document.cookie` がまだ CSRF トークンを提供できていない
- **解決方式**
  - `apiClient.ts` の response interceptor で 403 を受け取った場合、意図された 403 (約款同意/停止) 以外なら **200ms 後に 1 回自動リトライ**
  - リトライ時に request interceptor が再実行され、この時点で準備できた `XSRF-TOKEN` が `X-XSRF-TOKEN` ヘッダーに正常に注入される

> 403 は一つではなく、  
> 要求/応答の詳細を比較することで原因は特定できました。

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
