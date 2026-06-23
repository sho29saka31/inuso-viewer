# API 仕様 — inuso-viewer

## エンドポイント一覧

| メソッド | パス | 認証 | 概要 |
|---|---|---|---|
| POST | `/api/fcm/subscribe` | なし | FCM トークンをトピックに購読登録 |
| POST | `/api/revalidate` | `REVALIDATE_SECRET` | ISR キャッシュを即時無効化 |
| GET | `/api/health` | なし | ヘルスチェック（Firestore 接続確認） |
| GET | `/api/firebase-sw-config` | なし | Service Worker 向け Firebase 設定スクリプト |

---

## POST /api/fcm/subscribe

FCM トークンを指定トピックに購読登録し、Firestore `fcmTokens` に保存します。

### 認証

なし

### リクエスト

```json
{
  "token": "fcm-device-token-string",
  "topics": ["all", "urgent"]
}
```

| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| `token` | string | ✓ | FCM デバイストークン |
| `topics` | string[] | ✓ | 購読するトピック名の配列 |

### レスポンス

**成功 (200)**

```json
{ "ok": true }
```

**失敗 (4xx / 5xx)**

```json
{ "error": "エラーメッセージ" }
```

---

## POST /api/revalidate

指定パスの ISR キャッシュを即時無効化します。inuso-admin から呼ばれます。

### 認証

リクエストボディの `secret` フィールドがサーバー環境変数 `REVALIDATE_SECRET` と一致する必要があります。

### リクエスト

```json
{
  "secret": "your-revalidate-secret",
  "paths": ["/", "/notices", "/notices/abc123"]
}
```

| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| `secret` | string | ✓ | 認証シークレット |
| `paths` | string[] | ✓ | 無効化するパスの配列 |

### レスポンス

**成功 (200)**

```json
{
  "ok": true,
  "revalidated": ["/", "/notices", "/notices/abc123"]
}
```

**認証失敗 (401)**

```json
{ "error": "unauthorized" }
```

---

## GET /api/health

Firestore への接続確認を行うヘルスチェックエンドポイントです。

### 認証

なし

### レスポンス

**正常 (200)**

```json
{ "ok": true }
```

**異常 (503)**

```json
{ "ok": false }
```

---

## GET /api/firebase-sw-config

Service Worker（`firebase-messaging-sw.js`）向けに Firebase クライアント設定を JS スクリプト形式で返します。

### 認証

なし

### レスポンス

`Content-Type: application/javascript` の JS スクリプト。Firebase アプリ初期化に必要な設定値が埋め込まれています。
