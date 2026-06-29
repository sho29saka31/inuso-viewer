# デプロイ手順 — inuso-viewer

---

## 環境一覧

| 環境 | ブランチ | URL |
|---|---|---|
| 本番 | `main` | Vercel 本番ドメイン |
| ステージング | `dev` | Vercel Preview |
| 開発 | `claudecode` | Vercel Preview（自動） |

---

## 初回セットアップ

### 1. リポジトリクローン

```bash
git clone https://github.com/sho29saka31/inuso-viewer.git
cd inuso-viewer
npm install
```

### 2. 環境変数の設定

`.env.local` を作成して以下を設定します。

```env
# Firebase Admin SDK（サーバーサイド）
# Firebase コンソール → プロジェクト設定 → サービスアカウント → 新しい秘密鍵の生成
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"..."}

# on-demand ISR 無効化シークレット（inuso-admin と同じ値を設定）
REVALIDATE_SECRET=your_secret_here

# Firebase クライアント（プッシュ通知用）
# Firebase コンソール → プロジェクト設定 → 全般 → マイアプリ → SDK 設定
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# FCM VAPID キー（プッシュ通知送信用）
# Firebase コンソール → プロジェクト設定 → Cloud Messaging → ウェブプッシュ証明書
NEXT_PUBLIC_FIREBASE_VAPID_KEY=
```

### 3. ローカル起動確認

```bash
npm run dev
# http://localhost:3000 で確認
```

---

## Vercel プロジェクト設定

### 環境変数の登録

Vercel ダッシュボード → Settings → Environment Variables に上記の全変数を登録します。

| 変数名 | 環境 |
|---|---|
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Production / Preview / Development |
| `REVALIDATE_SECRET` | Production / Preview / Development |
| `NEXT_PUBLIC_*` 系 | Production / Preview / Development |

> `NEXT_PUBLIC_` プレフィックスの変数はビルド時に埋め込まれるため、変更後は再デプロイが必要です。

### ビルド設定

| 項目 | 設定値 |
|---|---|
| Framework Preset | Next.js |
| Build Command | `npm run build` |
| Output Directory | `.next` |
| Install Command | `npm install` |

---

## 本番リリース手順

1. `dev` ブランチで動作確認
2. `dev` → `main` への PR を作成・レビュー
3. マージ → Vercel が自動でデプロイ
4. デプロイ完了後、本番 URL で動作確認

---

## ISR キャッシュについて

ページごとのキャッシュ設定：

| ページ | `revalidate` | 即時無効化トリガー |
|---|---|---|
| `/top` | 60秒 | お知らせ・ブース更新時 |
| `/notice` | 30秒 | お知らせ送信・更新・削除時 |
| `/notice/[id]` | 30秒 | お知らせ更新時 |
| `/busy` | 60秒 | Bluetooth 更新時 |
| `/booth` | 300秒 | ブース更新時 |
| `/event` | 300秒 | イベント更新時 |
| `/eat` | 300秒 | 飲食ブース更新時 |
| `/map`, `/digital` | 300秒 | ファイル更新時 |

即時無効化は `POST /api/revalidate` で実行（inuso-admin から自動呼び出し）。  
機能フラグ（`config/viewer_features`）の変更時もすべてのページが即時無効化されます。

---

## FCM（プッシュ通知）セットアップ

### Firebase コンソール設定

1. Firebase コンソール → Cloud Messaging を有効化
2. ウェブプッシュ証明書（VAPID キー）を生成
3. VAPID キーを `NEXT_PUBLIC_FIREBASE_VAPID_KEY` に設定

### Service Worker

`/public/firebase-messaging-sw.js` が Service Worker として動作します。  
FCM 設定は `/api/firebase-sw-config` エンドポイントから動的に取得します。

---

## トラブルシューティング

デプロイ・環境に関するトラブルは [`docs/troubleshooting.md`](./troubleshooting.md) を参照してください。
