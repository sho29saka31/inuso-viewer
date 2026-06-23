<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# inuso-viewer 開発ガイド（Claude Code 向け）

## ブランチ運用

- **必ず `claudecode` ブランチで開発**すること
- コミットメッセージは日本語で簡潔に
- push 後は `dev` 向け draft PR を作成すること

## 共通ライブラリ

以下は必ず共通モジュールを使うこと。重複実装禁止。

| 用途 | モジュール |
|---|---|
| 日時フォーマット | `src/lib/formatDate.ts` の `formatDate()` |
| お知らせ種別・バッジ | `src/app/notice/noticeConfig.ts` の `TYPE_CONFIG` / `resolveType()` |
| Firestore 接続 | `src/lib/firebase-admin.ts` の `getDb()` |
| Cookie 操作（クライアント） | `src/lib/cookies.ts` の `getCookie()` / `setCookie()` |

## サーバーサイド vs クライアントサイド

- Firestore の読み取りは **サーバーサイド（async Server Component）** で行う
- `"use client"` コンポーネントでは Firestore に直接アクセスしない
- ISR キャッシュが必要なページには `export const revalidate = N` を設定する

## API ルールの注意

- 書き込み系は inuso-admin 側が担当。このリポジトリの API は読み取り・インフラ系のみ
- `/api/revalidate` は inuso-admin からの呼び出し専用（`REVALIDATE_SECRET` 認証）
- `/api/health` のみ認証不要（公開エンドポイント）

## Firestore コレクション

| コレクション | 主なフィールド |
|---|---|
| `notices` | `noticeId`, `title`, `body`, `authorId`, `target`, `type`, `isUrgent`, `createdAt` |
| `booths` | `boothId`, `name`, `status`, `waitCount`, `products`, `updatedAt` |
| `events` | `eventId`, `title`, `startTime`, `endTime`, `location`, `isDelayed` |
| `config/bluetooth` | Bluetooth 設定（混雑算出パラメータ） |

## お知らせターゲット仕様

`notices.target` の値と表示対象：

```
all    → 全ユーザー
guest  → ゲスト（user_role Cookie なし）
edu    → 生徒（role: "student"）
prof   → 先生（role: "teacher"）
1nen   → 1年生（role: "student", grade: "1"）
2nen   → 2年生（role: "student", grade: "2"）
3nen   → 3年生（role: "student", grade: "3"）
```

ロールは `user_role` Cookie（JSON）で管理し、クライアント側の `NoticeList.tsx` でフィルタリングする。

## よくある注意点

- `notFound()` は `try/catch` の**外**に置くこと（内部で `Error` をスローするため catch されてしまう）
- `formatDate()` に渡す Timestamp は `{ seconds?: number; _seconds?: number }` 形式（Admin SDK と Client SDK で key が異なる）
- PWA Service Worker のスコープは `/` なので、パス変更時は `manifest.ts` も確認する
