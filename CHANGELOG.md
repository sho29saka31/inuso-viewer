# Changelog

## [Unreleased]

---

## 2026-06-23

- Docs: デプロイ手順・ISRキャッシュ設定・FCMセットアップ手順を追加 (`docs/deployment.md`)
- Docs: 当日トラブル対処法を追加 (`docs/troubleshooting.md`)
- Docs: コントリビューションガイドを追加 (`CONTRIBUTING.md`)
- Docs: PRテンプレートを追加 (`.github/PULL_REQUEST_TEMPLATE.md`)
- Docs: API仕様書を追加 (`docs/api-spec.md`)
- Docs: アーキテクチャ図（Mermaid）を追加 (`docs/architecture.md`)
- Docs: Firestoreデータモデル定義を追加 (`docs/data-model.md`)
- Docs: README・AGENTS.md をリファクタリング後の構成に合わせて更新

---

## 2026-06-22

- Fix: `formatDate()` のオプション設計を修正し、呼び出し元ごとに month/year を個別指定可能に
- Fix: `notice/[id]/page.tsx` の `notFound()` を `try/catch` の外に移動（削除済み通知で正しく 404 を表示）
- Refactor: `formatDate` を `src/lib/formatDate.ts` に共通化（3ファイルの重複解消）
- Refactor: `TYPE_CONFIG` / `resolveType()` を `src/app/notice/noticeConfig.ts` に共通化（2ファイルの重複解消）
- Refactor: 旧 `/privacy`・`/terms`・`/cookie-policy` を `/legal/*` へのリダイレクトに変換
- Refactor: 未使用の `faq/FaqAccordion.tsx`・`faq/FaqCookieReset.tsx` を削除
- Refactor: `Header.tsx` の冗長な if/else を単一式に簡略化
- Fix: SVG の不正な `dot` タグを `circle` に修正
- Fix: 通知詳細（`/notice/[id]`）に削除済み専用エラーページを追加
- Fix: TOP ページの通知リンクを詳細ページへ変更
- Fix: 通知詳細の日時表示バグを修正
- Feat: ヘルスチェックエンドポイント `/api/health` を追加

---

## 2026-06-21

- Feat: ハンバーガーメニューにシステムステータスリンクを追加
- Fix: エラーページのシステムステータスリンクを Instatus URL に更新

---

## 2026-06-20

- Feat: 404 ページを追加
- Feat: ダイアログを Portal 化
- Feat: ハンバーガーメニューの閉じるアニメーションを追加
- Feat: on-demand 再検証（`/api/revalidate`）に対応
- Feat: カスタムダイアログ導入
- Feat: ヘッダーを ISF 表示に変更
- Feat: ハンバーガーメニューのアニメーションを追加
- Feat: about / terms / faq ページを更新
- Fix: TOP ブース SVG を Footer と統一
- Fix: 通知フィルター修正（`getCookie` 使用・フォールスルー修正）
- Fix: エラーページデザインを改善
- Feat: エラーページにシステムステータスへのリンクを追加
- Docs: 法的ページ全体に Google Analytics・Sentry の記載を追加
- Fix: Sentry ビルドエラー修正（`onRequestError` 動的インポート対応・非推奨オプション削除）
- Fix: Sentry 設定を Next.js 16 推奨構成に修正（`instrumentation-client` / `global-error`）
- Feat: イベント進行中強調表示を実装
- Feat: ブースラベル表示を追加
- Feat: 通知フィルタ機能を実装
- Feat: 完売表示を追加
- Feat: Google Analytics を導入
- Feat: Sentry エラー監視を導入
- Fix: ヘッダーのリロードボタンに `useTransition` でスピナーアニメーションを追加
- Feat: お知らせページに通知許可バナーを追加
- Fix: Instagram ロゴをブランドグラデーションに変更
- Fix: イベント詳細の改行を `whitespace-pre-wrap` で保持
- Feat: イベント「文化祭〇日目」を終日バナーで特別表示

---

## 2026-06-19

- Fix: FCM ペイロードの `title`/`body` を `data` フィールドから取得するよう修正
- Fix: `force-dynamic` を ISR（`revalidate`）に戻し Firestore 読み取り制限を回避
- Feat: 法令ページを修正
- Feat: FAQ を大幅改修（アコーディオン式・6カテゴリ30項目）
- Feat: ブースフィルター機能を追加
- Feat: ヘッダーを更新
- Fix: themeColor を主カラー（`#1EA78C`）に変更
- Fix: コンタクトページを削除・favicon 修正・Firestore ページを dynamic に変更
- Feat: favicon を `logo.png` に変更
- Feat: ヘッダーに `logo.png` を適用
- Fix: ハンバーガーメニューのブース SVG を Footer と統一
- Fix: ブース Footer アイコンをストア SVG に変更
- Feat: FAQ を `support/faq` に移動・お問い合わせフォームを追加・Cookie 期限を修正
- Fix: 通知日時表示修正
- Fix: Footer アクティブ時の SVG 塗りつぶしバグを修正
- Fix: Footer タブを等間隔定位置に固定・アクティブタブを強調表示
- Design: プライマリカラーをティールグリーン（`#1EA78C`）に変更
- Chore: Claude カスタムコマンドを追加
- Fix: 通知カードを全 type で色付きバッジ・背景に統一
- Fix: 通知ページの `revalidate` 間隔を 30 秒に短縮

---

## 2026-06-18

- Feat: 通知詳細ページを実装
- Feat: type バッジを追加
- Feat: 混雑状況マップオーバーレイを実装
- Fix: ISR `revalidate` 設定・絵文字を SVG に統一
- Fix: Service Worker イベントハンドラの初期評価エラーを修正
- Fix: FCM `subscribe` 500 エラーを修正
- Feat: FCM 通知クライアント初期化・API を実装（Phase 5）
- Feat: ブース・イベント・お知らせ・混雑ページを Firestore 連携で実装
- Fix: 古い `/eat/car`・`/eat/pta` ページを削除（`/eat` に統合）
- Fix: manifest の不足アイコン参照を削除（404 エラー解消）
- Fix: `manifest.json` を `app/manifest.ts` に移行
- Fix: ヘッダーのお知らせボタン・赤丸バッジ・ハンバーガー SVG アイコンを修正
- Feat: ヘッダー右側に通知・アカウント・ハンバーガーを配置
- Feat: フッター中央にホームボタンを追加
- Feat: 全ページにパンくずリストを追加
- Feat: 飲食を 1 ページに統合
- Feat: 法令を `/legal/`・サポートを `/support/` に移動
- Feat: ハンバーガーメニューに SVG アイコンを追加
- Feat: キッチンカー・PTAバザーページを Firestore 連携で実装
- Fix: 生徒認証に学籍番号バリデーションを追加（年・組照合・01〜40 範囲チェック）
- Fix: 同意画面の法的リンクを同一タブで開くよう変更
- Fix: `InitFlow` の Hooks 順序違反を修正
- Feat: 基本骨格を実装（Phase 2）
- Feat: Firebase Messaging Service Worker を追加
- Feat: フォント・Tailwind カラー変数をセットアップ

---

## 2026-06-17

- Feat: Next.js プロジェクトを初期化

---

## 2026-06-14

- Chore: リポジトリを作成
