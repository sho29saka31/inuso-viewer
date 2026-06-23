# コントリビューションガイド — inuso-viewer

---

## ブランチ戦略

| ブランチ | 役割 | マージ先 |
|---|---|---|
| `main` | 本番環境 | — |
| `dev` | 統合・ステージング | `main` |
| `claudecode` | Claude Code 自動開発 | `dev` |
| `feature/*` | 機能開発 | `dev` |
| `fix/*` | バグ修正 | `dev` |

**ルール:**
- `main` への直接 push は禁止
- `dev` へのマージは PR 経由で行う
- Claude Code は必ず `claudecode` ブランチを使用する

---

## 開発フロー

```bash
# 1. dev の最新を取得
git fetch origin
git checkout dev
git pull origin dev

# 2. 作業ブランチを作成
git checkout -b feature/my-feature

# 3. 変更・コミット
git add <files>
git commit -m "feat: 機能名を追加"

# 4. push して PR を作成
git push -u origin feature/my-feature
```

---

## コミットメッセージ規約

```
<種別>: <変更内容の要約>
```

| 種別 | 用途 |
|---|---|
| `feat` | 新機能追加 |
| `fix` | バグ修正 |
| `refactor` | リファクタリング（動作変更なし） |
| `docs` | ドキュメントのみの変更 |
| `style` | スタイル・デザイン変更 |
| `chore` | ビルド設定・依存関係更新 |
| `security` | セキュリティ修正 |

日本語でも可。例: `fix: 通知フィルターのフォールスルーを修正`

---

## コーディング規約

### 共通ライブラリの使用

既存の共通モジュールを積極的に使い、重複実装を避けてください。

| 用途 | 使うもの |
|---|---|
| 日時フォーマット | `src/lib/formatDate.ts` の `formatDate()` |
| お知らせ種別 | `src/app/notice/noticeConfig.ts` の `TYPE_CONFIG` / `resolveType()` |
| Firestore 接続 | `src/lib/firebase-admin.ts` の `getDb()` |
| Cookie 操作 | `src/lib/cookies.ts` の `getCookie()` / `setCookie()` |

### サーバー / クライアント分離

- Firestore の読み取りは **Server Component** で行う
- `"use client"` コンポーネントでは Firestore に直接アクセスしない
- ISR が必要なページには `export const revalidate = N` を設定する

### その他

- コメントは「なぜ」が非自明な場合のみ記述する
- TypeScript の型を正確に付ける（`any` は避ける）
- `notFound()` は `try/catch` の外に置く

---

## PR を作成する前のチェックリスト

- [ ] `npm run build` が通る
- [ ] TypeScript エラーがない（`npm run type-check`）
- [ ] 変更内容を PR の description に記載している
- [ ] 既存機能への影響を確認している

---

## Claude Code での開発

Claude Code を使う場合は `.claude/commands/` のスラッシュコマンドを活用してください。

| コマンド | 説明 |
|---|---|
| `/deploy` | 変更を `claudecode` ブランチにコミット・push |
| `/create-pr` | `claudecode` → `dev` の draft PR を作成 |
| `/sync-dev` | `dev` の最新を `claudecode` に取り込む |
