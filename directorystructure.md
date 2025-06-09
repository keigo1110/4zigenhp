# ディレクトリ構成

```
4zigenhp/
├── public/                  # 静的ファイル
│   ├── media/              # メディア関連画像
│   ├── members/            # メンバー画像
│   ├── music/              # 音楽ファイル
│   └── works/              # 作品画像
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── favicon.ico     # ファビコン
│   │   ├── globals.css     # グローバルスタイル
│   │   ├── layout.tsx      # ルートレイアウト（メタデータ、SEO設定）
│   │   └── page.tsx        # ルートページ
│   └── components/         # Reactコンポーネント
│       ├── ui/             # UI基盤コンポーネント（Shadcn/UI）
│       ├── page.tsx        # メインページコンポーネント
│       ├── DynamicLayout.tsx      # PC版：4次元ポケット風レイアウト
│       ├── InfiniteScrollLayout.tsx # モバイル版：無限スクロールレイアウト
│       ├── DetailCards.tsx # 作品・メンバー・メディアカード
│       ├── MediaCard.tsx   # メディア専用カード
│       ├── SearchHeader.tsx # 検索ヘッダー
│       ├── ShuffleLayout.tsx # シャッフル機能
│       ├── data.ts         # 作品・メンバー・メディアデータ
│       └── utils.ts        # 物理演算・ユーティリティ関数
├── components.json         # Shadcn/UI設定
├── next.config.mjs         # Next.js設定
├── package.json            # 依存関係
├── postcss.config.js       # PostCSS設定
├── tailwind.config.ts      # Tailwind CSS設定
├── tsconfig.json           # TypeScript設定
└── README.md              # プロジェクト説明
```

## 主要コンポーネント説明

### レイアウト系

- **DynamicLayout.tsx**: PC 版の 4 次元ポケット風アニメーション
- **InfiniteScrollLayout.tsx**: モバイル版の無限スクロール

### コンテンツ系

- **DetailCards.tsx**: 統一されたカードコンポーネント
- **MediaCard.tsx**: メディア記事専用表示

### 機能系

- **SearchHeader.tsx**: 検索機能と UI
- **utils.ts**: 物理演算、衝突判定、位置計算

### データ系

- **data.ts**: 作品、メンバー、メディア記事の静的データ
