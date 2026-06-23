# Changelog

## [Unreleased]

## 2026-06-23

- Docs: ドキュメント整備 — README・AGENTS.md を現在のコード構成に合わせて更新

## 2026-06-22

- Fixed: `formatDate` の月表示を復元・`notFound` を try ブロック外に移動
- Refactor: コードの共通化・不要ファイル削除（`formatDate` 共通化・`noticeConfig` 共通化・旧リダイレクトページ変換・未使用コンポーネント削除）
- Fixed: SVG の不正な `dot` タグを `circle` に修正
- Added: 通知詳細 — 削除済み専用エラーページ追加
- Fixed: TOP の通知リンクを詳細ページに修正・日時表示バグ修正
- Added: ヘルスチェックエンドポイント `GET /api/health` を追加

## 2026-06-21

- Added: ハンバーガーメニューにシステムステータスリンクを追加
- Changed: エラーページのステータスリンクを Instatus に更新

## 2026-06-20

- Added: 404 ページ追加
- Added: ダイアログの portal 化
- Added: ハンバーガーメニュー閉じるアニメーション
- Added: on-demand 再検証（ISR キャッシュ無効化）対応
- Added: カスタムダイアログ導入・Header ISF 表示・ハンバーガーアニメーション
- Changed: about / terms / faq ページ更新
- Changed: TOP ブース SVG を Footer に統一
- Fixed: 通知フィルター修正
- Changed: エラーページデザイン改善・システムステータスへのリンクを追加
- Added: 法的ページに Google Analytics・Sentry の記載を追加
- Fixed: Sentry ビルドエラー修正 — `onRequestError` 動的インポート対応・非推奨オプション削除
- Changed: Sentry 設定を Next.js 16 推奨構成に修正
- Added: Phase 6 実装 — イベント進行中強調・ブースラベル・通知フィルタ・完売表示・GA・Sentry
- Added: イベント「文化祭〇日目」を終日バナーで特別表示

## 2026-06-19

- Fixed: FCM ペイロードの `title` / `body` を `data` フィールドから取得するよう修正
- Changed: 法令ページ修正・FAQ 大幅改修
- Added: ブースフィルター機能
- Changed: Header 更新
- Changed: favicon を `logo.png` に変更
