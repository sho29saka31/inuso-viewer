# inuso-viewer — 文化祭来場者向けWebアプリ

犬山総合高等学校 文化祭「ISF」の来場者向けWebアプリです。  
イベントスケジュール・ブース情報・混雑状況・お知らせをリアルタイムに提供します。

> **ISFプロジェクト** が開発・運用しています。

---

## 機能一覧

| ページ | パス | 説明 |
|---|---|---|
| ホーム | `/` | 直近イベント・最新お知らせ・クイックリンク |
| 日程 | `/event` | タイムテーブル形式のイベントスケジュール |
| ブース | `/booth` | クラス・部活・有志・委員会のブース一覧と詳細 |
| 混雑 | `/busy` | フロアマップ上にリアルタイム混雑状況を表示 |
| 飲食 | `/eat` | キッチンカー・PTAバザーのメニューと価格 |
| マップ | `/map` | フロアマップ画像 |
| パンフ | `/digital` | デジタルパンフレット PDF |
| お知らせ | `/notice` | 緊急・注意・一般の通知一覧と詳細 |
| FAQ | `/support/faq` | アコーディオン式よくある質問 |
| お問い合わせ | `/support/contact` | Firestore連携フィードバックフォーム |
| 制作情報 | `/about` | ISFプロジェクト紹介 |
| 利用規約等 | `/legal/*` | 利用規約・プライバシーポリシー・Cookie説明 |

---

## 技術スタック

| 技術 | バージョン | 用途 |
|---|---|---|
| Next.js (App Router) | 16 | フロントエンド・SSR・ISRキャッシュ |
| Firebase Admin SDK | — | Firestore 読み取り（サーバーサイド） |
| Firebase Cloud Messaging | — | プッシュ通知受信（クライアント） |
| Tailwind CSS | — | スタイリング |
| Vercel | — | ホスティング・エッジキャッシュ |
| PWA | — | ホーム画面インストール・Service Worker |

---

## 環境変数

`.env.local` に以下を設定してください。

```env
# Firebase Admin SDK（サーバーサイド）
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}

# on-demand ISR 無効化（inuso-admin から呼ばれる）
REVALIDATE_SECRET=your_secret_here

# Firebase クライアント（プッシュ通知用）
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_VAPID_KEY=
```

---

## ブランチ運用

| ブランチ | 役割 |
|---|---|
| `main` | 本番環境（Vercel 本番デプロイ） |
| `dev` | 統合・ステージング |
| `claudecode` | Claude Code による自動開発ブランチ（→ `dev` へ PR） |

---

## ローカル開発

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) で確認できます。

---

## ディレクトリ構成

```
src/
├── app/
│   ├── top/          # ホームページ（/にリダイレクト）
│   ├── event/        # 日程
│   ├── booth/        # ブース一覧・詳細
│   ├── busy/         # 混雑状況
│   ├── eat/          # 飲食ブース
│   ├── map/          # マップ
│   ├── digital/      # デジタルパンフレット
│   ├── notice/       # お知らせ一覧・詳細
│   │   ├── page.tsx          # 一覧（SSR）
│   │   ├── NoticeList.tsx    # クライアント側フィルタリング
│   │   ├── noticeConfig.ts   # TYPE_CONFIG・resolveType（共通）
│   │   └── [id]/page.tsx     # 詳細（SSR）
│   ├── support/
│   │   ├── faq/      # よくある質問
│   │   └── contact/  # お問い合わせ
│   ├── about/        # 制作情報
│   ├── legal/        # 利用規約・プライバシー・Cookie
│   ├── privacy/      # → /legal/privacy へリダイレクト
│   ├── terms/        # → /legal/terms へリダイレクト
│   ├── cookie-policy/# → /legal/cookie-policy へリダイレクト
│   └── api/
│       ├── revalidate/         # on-demand ISR 無効化（POST, シークレット認証）
│       ├── fcm/subscribe/      # FCM トピック購読
│       ├── firebase-sw-config/ # Service Worker 向け Firebase 設定
│       └── health/             # ヘルスチェック（GET, 認証なし）
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── HamburgerMenu.tsx
│   ├── ConsentOverlay.tsx      # Cookie 同意
│   ├── UserRoleOverlay.tsx     # ユーザーロール選択
│   ├── FcmInit.tsx             # FCM 初期化
│   ├── InitFlow.tsx            # 初回起動フロー制御
│   ├── PwaGuide.tsx            # PWA インストールガイド
│   └── GoogleAnalytics.tsx
└── lib/
    ├── firebase-admin.ts       # Admin SDK 初期化・getDb()
    ├── formatDate.ts           # Firestore Timestamp → 日本語日時文字列
    └── cookies.ts              # getCookie / setCookie
```

---

## お知らせのターゲット仕様

`notices` コレクションの `target` フィールドで表示対象を制御します。

| target 値 | 表示対象 |
|---|---|
| `all` | 全ユーザー |
| `guest` | ゲスト（未設定ユーザー） |
| `edu` | 生徒全体 |
| `prof` | 先生全体 |
| `1nen` | 1年生のみ |
| `2nen` | 2年生のみ |
| `3nen` | 3年生のみ |

ロールは `user_role` Cookie（JSON）で管理し、クライアント側でフィルタリングします。

---

## ライセンス

© 2026 ISFプロジェクト  
本リポジトリのコードは学校行事目的のみに使用します。
