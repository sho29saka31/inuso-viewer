# システム構成・アーキテクチャ — inuso-viewer

## 概要

inuso-viewer は文化祭来場者向けの Next.js 16 App Router アプリです。ISR（Incremental Static Regeneration）でキャッシュしたページを配信し、inuso-admin からの `POST /api/revalidate` で即時更新します。

---

## システム構成図

```mermaid
graph TB
    subgraph 来場者
        USER[来場者ブラウザ / PWA]
    end

    subgraph Vercel["Vercel (inuso-viewer)"]
        NEXT[Next.js 16 App Router<br/>ISR キャッシュ]
        API_FCM[POST /api/fcm/subscribe]
        API_REV[POST /api/revalidate]
        API_HEALTH[GET /api/health]
        API_SW[GET /api/firebase-sw-config]
    end

    subgraph Firebase
        FS[(Firestore<br/>booths / notices / events<br/>fcmTokens / adminFcmTokens)]
        FCM[Firebase Cloud Messaging]
    end

    subgraph Admin["Vercel (inuso-admin)"]
        ADMIN[管理画面]
    end

    USER -->|ページ閲覧| NEXT
    USER -->|FCM 購読登録| API_FCM
    USER -->|SW 設定取得| API_SW
    NEXT -->|データ取得| FS
    API_FCM -->|トークン保存| FS
    API_FCM -->|トピック購読| FCM
    API_HEALTH -->|接続確認| FS
    ADMIN -->|ISR 無効化| API_REV
    API_REV -->|キャッシュパージ| NEXT
    FCM -->|プッシュ通知| USER
```

---

## データフロー

### ページ閲覧フロー（ISR）

```mermaid
sequenceDiagram
    participant User as 来場者ブラウザ
    participant Vercel as Vercel Edge
    participant Next as Next.js Server
    participant FS as Firestore

    User->>Vercel: GET /
    Vercel-->>User: キャッシュ済みHTMLを返却（ISR）
    Note over Vercel: キャッシュが無効化されている場合
    Vercel->>Next: 再生成リクエスト
    Next->>FS: booths / notices / events 取得
    FS-->>Next: データ返却
    Next-->>Vercel: 新しいHTML生成・キャッシュ更新
    Vercel-->>User: 最新HTMLを返却
```

### ISR キャッシュ無効化フロー

```mermaid
sequenceDiagram
    participant Admin as inuso-admin
    participant API as POST /api/revalidate
    participant Cache as Vercel ISRキャッシュ

    Admin->>API: { secret, paths: ["/", "/notices"] }
    API->>API: secret 検証
    API->>Cache: revalidatePath() 実行
    Cache-->>API: 無効化完了
    API-->>Admin: { ok: true, revalidated: [...] }
```

### FCM プッシュ通知フロー（来場者向け）

```mermaid
sequenceDiagram
    participant User as 来場者ブラウザ
    participant API as POST /api/fcm/subscribe
    participant FS as Firestore (fcmTokens)
    participant FCM as Firebase Cloud Messaging
    participant Admin as inuso-admin

    User->>API: { token, topics: ["all"] }
    API->>FS: fcmTokens に保存
    API->>FCM: トピック購読登録
    API-->>User: { ok: true }

    Note over Admin,FCM: お知らせ送信時
    Admin->>FCM: トピック "all" に送信
    FCM->>User: プッシュ通知配信
```

---

## 主要コンポーネント

| レイヤー | 技術 | 役割 |
|---|---|---|
| フロントエンド | Next.js 16 App Router | ページレンダリング・PWA |
| ホスティング | Vercel | ISR・エッジ配信 |
| データベース | Firebase Firestore | ブース・お知らせ・イベントデータ |
| プッシュ通知 | Firebase Cloud Messaging (FCM) | 来場者へのプッシュ通知 |
| モニタリング | Google Analytics + Sentry | アクセス解析・エラー追跡 |
| ステータス | Instatus | サービス稼働状況ページ |
