# 技術スタック

## フロントエンド

- **Next.js**: 14.1.0 (App Router 使用)
- **React**: ^18
- **TypeScript**: 5.8.3
- **Tailwind CSS**: ^3.3.0
- **Tailwind CSS Animate**: ^1.0.7

## UI ライブラリ

- **Radix UI**:
  - @radix-ui/react-dialog: ^1.1.4
- **Shadcn/UI**: ^0.0.4
- **Lucide React**: ^0.469.0 (アイコン)

## ユーティリティ

- **Class Variance Authority**: ^0.7.1
- **clsx**: ^2.1.1
- **Tailwind Merge**: ^2.6.0

## 開発環境

- **ESLint**: ^8
- **PostCSS**: ^8
- **Autoprefixer**: ^10.0.1

## 特徴的な実装

- **レスポンシブレイアウト**: PC 版とモバイル版で異なるレイアウト
  - PC 版: 4 次元ポケット風の DynamicLayout
  - モバイル版: 無限スクロールの InfiniteScrollLayout
- **物理演算**: カスタム物理エンジン（utils.ts）
- **検索機能**: 日本語対応のファジー検索
- **アニメーション**: CSS Animations + Tailwind Animate
