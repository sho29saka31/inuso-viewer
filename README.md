# ISF — 文化祭アプリ（Viewer）

文化祭「ISF」の来場者向けWebアプリです。  
イベントスケジュール・ブース情報・混雑状況・お知らせをリアルタイムに提供します。

> **ISFプロジェクト** が開発・運用しています。

---

## 機能概要

| 機能 | 説明 |
|---|---|
| **ホーム** | 当日のハイライト・直近のイベント・最新お知らせを表示 |
| **日程** | タイムテーブル形式でイベントスケジュールを確認 |
| **ブース** | クラス・部活・有志・委員会のブース一覧と詳細 |
| **混雑** | フロアマップ上にリアルタイム混雑状況を表示 |
| **飲食** | キッチンカー・PTAバザーのメニューと価格 |
| **お知らせ** | 緊急・注意・一般の通知一覧と詳細ページ |
| **プッシュ通知** | FCMによるリアルタイム通知（PWAインストール後に有効） |
| **よくある質問** | アコーディオン式FAQ（6カテゴリ・30項目） |
| **お問い合わせ** | Firestore連携のフィードバックフォーム |

---

## 技術スタック

| 技術 | 用途 |
|---|---|
| **Next.js 16 (App Router)** | フロントエンド・SSR・ISRキャッシュ |
| **Firebase Firestore** | データベース（ブース・通知・イベント等） |
| **Firebase Cloud Messaging** | プッシュ通知配信 |
| **Tailwind CSS** | スタイリング |
| **Vercel** | ホスティング・エッジキャッシュ |
| **PWA** | ホーム画面インストール・Service Worker |

---

## 環境変数

`.env.local` に以下を設定してください。

```env
# Firebase Admin SDK（サーバーサイド）
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}

# Viewer キャッシュ on-demand 無効化（admin から呼ばれる）
VIEWER_REVALIDATE_SECRET=your_secret_here
```

---

## ブランチ運用

| ブランチ | 役割 |
|---|---|
| `main` | 本番環境 |
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

## ディレクトリ構成（主要部分）

```
src/
├── app/
│   ├── top/          # ホームページ
│   ├── event/        # 日程
│   ├── booth/        # ブース一覧・詳細
│   ├── busy/         # 混雑状況
│   ├── eat/          # 飲食ブース
│   ├── notice/       # お知らせ一覧・詳細
│   ├── support/
│   │   ├── faq/      # よくある質問
│   │   └── contact/  # お問い合わせ
│   ├── about/        # 制作情報
│   ├── legal/        # 利用規約・プライバシー・Cookie
│   └── api/          # FCM購読・キャッシュ無効化
├── components/       # Header・Footer・共通UI
└── lib/              # Firebase Admin・Cookie ユーティリティ
```

---

## ライセンス

© 2026 ISFプロジェクト  
本リポジトリのコードは学校行事目的のみに使用します。
