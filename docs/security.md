# セキュリティガイド — inuso-viewer

このドキュメントは inuso-viewer のセキュリティ設計・実装・運用上の注意点をまとめたものです。

---

## エンドポイント認証

| エンドポイント | 認証方式 | 備考 |
|---|---|---|
| `POST /api/revalidate` | `REVALIDATE_SECRET` 共有シークレット | inuso-admin からのみ呼び出し |
| `POST /api/fcm/subscribe` | なし（公開） | トピックをホワイトリストで制限 |
| `GET /api/health` | なし（公開） | ヘルスチェック用 |

---

## `/api/revalidate` の認証

inuso-admin が ISR キャッシュを無効化する際に呼び出す内部エンドポイントです。

### 認証フロー

```ts
const envSecret = process.env.REVALIDATE_SECRET;
const { secret, paths } = await req.json();

// REVALIDATE_SECRET 未設定 または secret 未提供 → 即 401
if (!envSecret || !secret || !safeCompare(secret, envSecret)) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

- `REVALIDATE_SECRET` が未設定の場合は全リクエストを拒否（Fail-Closed）
- タイミング安全な比較（`crypto.timingSafeEqual`）を使用

### パスのホワイトリスト

受け入れるパスは固定のホワイトリストで制限しています。リスト外のパス（パストラバーサル等）は無視されます。

```ts
const ALLOWED_PATHS = new Set([
  "/", "/top", "/notice", "/busy", "/booth", "/event", "/eat", "/map", "/digital"
]);
```

---

## FCM トピック購読のホワイトリスト

`POST /api/fcm/subscribe` で購読できるトピックを制限しています。

```ts
const ALLOWED_TOPICS = new Set(["all", "edu", "guest", "1nen", "2nen", "3nen"]);
```

> `prof`（教員向け）は意図的に除外しています。来場者が教員専用トピックを購読することを防ぐためです。

---

## お知らせのターゲットフィルタリング

`notices.target` フィールドで対象を絞ったお知らせがありますが、フィルタリングはクライアント側（`NoticeList.tsx`）で行っています。

**これは意図的な設計です。** 理由は以下の通りです:

- `user_role` Cookie は認証境界ではなく、表示分類のみを目的としています
- お知らせの内容は機密情報ではありません（学校行事のアナウンスなど）
- サーバー側フィルタリングにすると ISR キャッシュとの相性が悪くなります

---

## エラーハンドリングと情報漏洩防止

Firestore 接続エラーなど、サーバーサイドで発生した例外のスタックトレースや内部メッセージは**ユーザーに表示しません**。代わりに Sentry に送信します。

```tsx
// Server Component でのパターン
if ("error" in result) {
  Sentry.captureException(new Error(result.error));
  return (
    <p className="text-sm text-[var(--color-text-sub)]">
      データを取得できませんでした。時間をおいて再度お試しください。
    </p>
  );
}
```

**適用ページ:**

| ページ | 対応 |
|---|---|
| `/notice` | Sentry 送信 + 汎用メッセージ |
| `/booth` | Sentry 送信 + 汎用メッセージ |
| `/event` | Sentry 送信 + 汎用メッセージ |
| `/busy` | Sentry 送信 + 汎用メッセージ |

---

## 環境変数一覧（セキュリティ関連）

| 変数名 | 用途 | 必須 | 備考 |
|---|---|---|---|
| `REVALIDATE_SECRET` | ISR 無効化 API の認証 | **必須** | inuso-admin の同名変数と同一値を設定 |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Firestore サーバーサイド接続 | **必須** | サービスアカウント JSON |

### `REVALIDATE_SECRET` の生成

```bash
openssl rand -hex 32
# 例: a3f4b2c1d0e9f8a7b6c5d4e3f2a1b0c9...
```

> inuso-admin と inuso-viewer の両方に同じ値を設定してください。

---

## 新しい API エンドポイントを追加する際の注意

1. 書き込み系は inuso-admin 側に実装すること（viewer は読み取り・インフラ系のみ）
2. 認証が必要なエンドポイントは `REVALIDATE_SECRET` パターンを参考にすること
3. `/api/health` のみ認証不要（外形監視用）
4. エラーの詳細はユーザーに見せず Sentry に送ること
