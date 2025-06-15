'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Twitter } from 'lucide-react';
import Image from 'next/image';
import { artworks, members } from './data';

interface GalleryPageProps {
  onBack: () => void;
  initialTab?: 'all' | 'artworks' | 'members' | null;
}

// Fisher-Yates シャッフルアルゴリズム
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function GalleryPage({ onBack, initialTab }: GalleryPageProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'artworks' | 'members'>(initialTab || 'all');
  const [isLoaded, setIsLoaded] = useState(false);
  const [shuffledArtworks, setShuffledArtworks] = useState<typeof artworks>([]);
  const [shuffledMembers, setShuffledMembers] = useState<typeof members>([]);

  // コンポーネントマウント時にデータをシャッフル
  useEffect(() => {
    setShuffledArtworks(shuffleArray(artworks));
    setShuffledMembers(shuffleArray(members));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const filteredItems = () => {
    switch (activeTab) {
      case 'artworks':
        return shuffledArtworks.map(item => ({ type: 'artwork' as const, data: item }));
      case 'members':
        return shuffledMembers.map(item => ({ type: 'member' as const, data: item }));
      default:
        return [
          ...shuffledArtworks.map(item => ({ type: 'artwork' as const, data: item })),
          ...shuffledMembers.map(item => ({ type: 'member' as const, data: item }))
        ];
    }
  };

  return (
    <div className={`min-h-screen bg-black text-white transition-all duration-1000 ${
      isLoaded ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* 背景レイヤー */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-black"></div>
        <div className="absolute inset-0 bg-[url('/stars.png')] opacity-10 animate-twinkle"></div>
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black"></div>
      </div>

      {/* ヘッダー */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <button
              onClick={onBack}
              className="p-3 -m-3 hover:bg-gray-800/50 transition-all duration-300 rounded-lg group"
              aria-label="戻る"
            >
              <ArrowLeft size={20} className="text-gray-400 group-hover:text-purple-400 transition-colors" />
            </button>

            {/* タブナビゲーション */}
            <nav className="flex space-x-8">
              {[
                { key: 'all', label: 'All' },
                { key: 'artworks', label: 'Works' },
                { key: 'members', label: 'Artists' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => {
                    setActiveTab(key as any);
                    // URLパラメータを更新
                    const url = new URL(window.location.href);
                    if (key === 'all') {
                      url.searchParams.delete('tab');
                    } else {
                      url.searchParams.set('tab', key);
                    }
                    window.history.replaceState({}, '', url.toString());
                  }}
                  className={`text-sm font-medium tracking-wide transition-all duration-300 ${
                    activeTab === key
                      ? 'text-white border-b border-purple-400 pb-1'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>

            <div className="w-14"></div> {/* Spacer for balance */}
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="relative z-10 pt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          {/* ページタイトル */}
          <div className="mb-20 text-center">
            <h1 className={`text-5xl md:text-7xl font-light tracking-tight mb-6 transition-all duration-1000
              text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              Gallery
            </h1>
          </div>

          {/* ギャラリーグリッド - より大きく、迫力のある表示 */}
          <div className="space-y-32">
            {filteredItems().map((item, index) => {
              // タブごとに番号を計算
              let itemNumber = index + 1;
              if (activeTab === 'all') {
                // Allタブの場合、typeごとに番号をリセット
                const artworkCount = shuffledArtworks.length;
                if (item.type === 'member') {
                  itemNumber = index - artworkCount + 1;
                }
              }

              return (
                <div
                  key={`${item.type}-${item.data.id}`}
                  className={`group transition-all duration-1000 ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
                  }`}
                  style={{
                    transitionDelay: `${index * 200 + 600}ms`
                  }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-16 items-center">
                    {/* 作品画像 - 全面表示で迫力を演出 */}
                    <div className={`${
                      index % 2 === 0 ? 'lg:col-span-3' : 'lg:col-span-3 lg:order-2'
                    } relative overflow-hidden bg-gray-900/20 hover:bg-gray-800/30
                      border border-gray-800/30 hover:border-purple-500/40 transition-all duration-500 rounded-lg group-hover:scale-[1.02]`}>
                      <a
                        href={item.data.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block aspect-[4/3] lg:aspect-[16/10] relative cursor-pointer"
                      >
                        {/* 画像を全面表示 */}
                        <Image
                          src={item.data.image}
                          alt={item.type === 'artwork' ? item.data.title || '' : item.data.name || ''}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          priority={index < 3}
                        />
                        {/* 現場感を演出するオーバーレイ効果 */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent
                          opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        {/* 作品タイトルとリンクヒントをオーバーレイ */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent
                          opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <h3 className="text-xl font-light text-white mb-2">
                            {item.type === 'artwork' ? item.data.title : item.data.name}
                          </h3>
                          <p className="text-purple-300 text-sm flex items-center">
                            <span>詳細を見る</span>
                            <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </p>
                        </div>
                      </a>
                    </div>

                    {/* 作品情報 - より詳細で展示らしく */}
                    <div className={`${
                      index % 2 === 0 ? 'lg:col-span-2' : 'lg:col-span-2 lg:order-1'
                    } space-y-6`}>
                      <div className="space-y-2">
                        <span className="text-xs uppercase tracking-[0.2em] text-purple-400 font-medium">
                          {item.type === 'artwork' ? 'Work' : 'Artist'} {String(itemNumber).padStart(2, '0')}
                        </span>
                      </div>

                      <a
                        href={item.data.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group-hover:text-purple-300 transition-colors duration-500"
                      >
                        <h2 className="text-3xl lg:text-4xl font-light tracking-wide leading-tight hover:text-purple-300 transition-colors duration-300 cursor-pointer">
                          {item.type === 'artwork' ? item.data.title : item.data.name}
                        </h2>
                      </a>

                      {item.type === 'artwork' && item.data.description && (
                        <p className="text-gray-300 leading-relaxed text-lg">
                          {item.data.description}
                        </p>
                      )}

                      {item.type === 'member' && (
                        <div className="space-y-4">
                          <p className="text-lg text-purple-300 font-medium">{item.data.role}</p>
                          {item.data.bio && (
                            <p className="text-gray-400 leading-relaxed">
                              {item.data.bio}
                            </p>
                          )}
                        </div>
                      )}

                      {/* 詳細リンクボタン */}
                      <div className="pt-4">
                        <a
                          href={item.data.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors duration-300 group/link"
                        >
                          <span>{item.type === 'artwork' ? '作品ページを見る' : 'プロフィールを見る'}</span>
                          <svg className="w-4 h-4 ml-2 transition-transform group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>

                      {/* 展示風の詳細情報 */}
                      <div className="pt-6">
                        <div className="w-12 h-px bg-gradient-to-r from-purple-400 to-transparent"></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 空状態 */}
          {filteredItems().length === 0 && (
            <div className="text-center py-32">
              <p className="text-gray-500 text-xl">No items found in this category</p>
            </div>
          )}
        </div>

        {/* フッター */}
        <footer className="border-t border-gray-800/30 mt-40">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
            <div className="text-center space-y-4">
              <p className="text-xs text-gray-600 uppercase tracking-[0.2em]">
                © 2025 — Exhibition Gallery
              </p>
              <div>
                <a
                  href="https://x.com/4ZIGENGSii"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-400 transition-colors duration-300"
                  aria-label="4ZIGENのTwitterアカウント"
                >
                  <Twitter size={14} />
                  <span className="text-xs tracking-wide">@4ZIGENGSii</span>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* 星空アニメーション - より控えめに */}
      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.01); }
        }
        .animate-twinkle {
          animation: twinkle 12s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}