# トラブルシューティング — inuso-viewer

当日・開発中によくある問題と対処法をまとめています。

---

## ページが更新されない（古い情報が表示される）

### 症状
admin でブース情報・お知らせを更新したのに、viewer に反映されない。

### 原因と対処

**1. ISR キャッシュが残っている**
- 通常は 30〜60 秒で自動更新されます
- admin 側の `VIEWER_REVALIDATE_URL` / `VIEWER_REVALIDATE_SECRET` が未設定の場合、on-demand 無効化が動作しません
- → admin の環境変数を確認し、正しく設定されているか確認

**2. Vercel のエッジキャッシュ**
- Vercel ダッシュボード → Deployments → 該当デプロイ → Functions で revalidate が呼ばれているか確認
- 強制更新: Vercel ダッシュボードから手動で再デプロイ

---

## プッシュ通知が届かない

### 症状
お知らせを送信したが、来場者のデバイスに通知が届かない。

### 原因と対処

**1. FCM トークンが未登録**
- 来場者が PWA をインストールしていない、または通知許可を拒否している
- → `/notice` ページで通知許可バナーが表示されているか確認

**2. Service Worker が更新されていない**
- ブラウザの Service Worker キャッシュが古い
- → ブラウザの開発者ツール → Application → Service Workers → 「Update」を実行

**3. VAPID キーの不一致**
- `NEXT_PUBLIC_FIREBASE_VAPID_KEY` が Firebase コンソールの値と一致しているか確認

**4. FCM トピックの購読漏れ**
- `fcmTokens` コレクションに対象ユーザーのトークンが保存されているか Firestore で確認

---

## お知らせのフィルタリングが正しく動作しない

### 症状
特定のユーザーにのみ表示するはずのお知らせが全員に表示される / 表示されない。

### 原因と対処

**1. `user_role` Cookie が未設定**
- ユーザーがロール選択をスキップしている
- → `user_role` Cookie がない場合は `target: "all"` のお知らせのみ表示される仕様

**2. Cookie の値が不正**
- ブラウザの開発者ツール → Application → Cookies → `user_role` の値を確認
- 正しい形式: `{"role":"student","grade":"1"}`

**3. `target` フィールドの値が未知**
- `notices` ドキュメントの `target` が定義外の値になっている
- → `all` / `guest` / `edu` / `prof` / `1nen` / `2nen` / `3nen` のいずれかであることを確認

---

## /notice/[id] で 404 が表示される

### 症状
お知らせ一覧からリンクをクリックすると 404 ページが表示される。

### 原因と対処

**1. お知らせが削除済み**
- Firestore から該当ドキュメントが削除されている → 仕様通りの動作

**2. `noticeId` の不一致**
- URL の ID と Firestore のドキュメント ID が一致しているか確認

---

## ビルドエラー（Vercel デプロイ失敗）

### 症状
Vercel のデプロイが失敗する。

### 対処

1. Vercel ダッシュボード → Deployments → 失敗したデプロイ → Build Logs を確認
2. よくある原因:
   - `FIREBASE_SERVICE_ACCOUNT_JSON` が未設定または不正な JSON
   - TypeScript の型エラー（`npm run build` をローカルで実行して確認）
   - 環境変数の `NEXT_PUBLIC_` 系が未設定（ビルド時に必要）

---

## Firestore へのアクセスエラー

### 症状
ページを開くとエラー画面が表示される。`/api/health` が 503 を返す。

### 対処

1. `FIREBASE_SERVICE_ACCOUNT_JSON` の JSON が正しいか確認
2. Firebase コンソールでサービスアカウントに Firestore の読み取り権限があるか確認
3. Firebase プロジェクトの Firestore が有効になっているか確認
4. Firestore のセキュリティルールが Admin SDK からのアクセスをブロックしていないか確認（Admin SDK はルールをバイパスするため通常問題なし）

---

## PWA がインストールできない

### 症状
「ホーム画面に追加」が表示されない。

### 対処

1. HTTPS でアクセスしているか確認（localhost は例外）
2. `manifest.ts` の設定が正しいか確認
3. Service Worker が正常に登録されているか確認（開発者ツール → Application → Service Workers）
4. Chrome の場合: アドレスバーの右端にインストールアイコンが表示されていないか確認

---

## Google Analytics / Sentry が動作しない

### 症状
GA にアクセスデータが送られない / Sentry にエラーが記録されない。

### 対処

- GA: `NEXT_PUBLIC_GA_MEASUREMENT_ID` が設定されているか確認
- Sentry: `NEXT_PUBLIC_SENTRY_DSN` / `SENTRY_AUTH_TOKEN` が設定されているか確認
- Cookie 同意が未承認の場合、GA はブロックされる仕様（意図的）
