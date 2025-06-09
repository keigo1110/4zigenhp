"use client";

import React, { useState, useMemo, useEffect } from 'react';
import DynamicLayout from './DynamicLayout';
import InfiniteScrollLayout from './InfiniteScrollLayout';
import GalleryPage from './GalleryPage';
import { artworks, members, mediaArticles } from './data';
import EnhancedContentItem from './DetailCards';
import { SearchHeader } from './SearchHeader';
import { trackSearch, trackArtworkView, trackGalleryInteraction } from '@/lib/analytics';

interface HighlightInfo {
  id: number;
  type: 'artwork' | 'member' | 'media';
}

interface SearchableItem {
  id: number;
  type: 'artwork' | 'member' | 'media';
  searchableText: string[];
  originalData: any;
}

// 日本語のテキスト正規化関数
const normalizeJapanese = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[\u30a1-\u30f6]/g, char => String.fromCharCode(char.charCodeAt(0) - 0x60))
    .replace(/[-\s]/g, '');
};

export default function HomeComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [highlighted, setHighlighted] = useState<HighlightInfo | null>(null);
  const [audio] = useState(() => typeof Audio !== 'undefined' ? new Audio('/music/terete.mp3') : null);
  const [isMobile, setIsMobile] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  // モバイル判定とページロード状態
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    // 検索クリアイベントのリスナー
    const handleClearSearch = () => {
      setSearchTerm('');
      setHighlighted(null);
    };

    window.addEventListener('clearSearch', handleClearSearch);

    // ページロード完了を少し遅延させて自然に
    const loadTimeout = setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
      window.removeEventListener('clearSearch', handleClearSearch);
      clearTimeout(loadTimeout);
    };
  }, []);

  // SEO用のpage title更新
  useEffect(() => {
    if (searchTerm) {
      document.title = `"${searchTerm}" の検索結果 | 4ZIGEN`;
    } else if (showGallery) {
      document.title = 'ギャラリー | 4ZIGEN - 東京大学発ワクワククリエイター集団';
    } else {
      document.title = '4ZIGEN | 東京大学発 ワクワククリエイター集団 - デジタルファブリケーション・メディアアート';
    }
  }, [searchTerm, showGallery]);

  // ギャラリーページの表示切り替え
  const handleGalleryClick = () => {
    setShowGallery(true);
    trackGalleryInteraction('open', 'gallery_page');
  };

  const handleBackFromGallery = () => {
    setShowGallery(false);
    trackGalleryInteraction('close', 'gallery_page');
  };

  // 検索可能な項目のインデックスを構築
  const searchableItems = useMemo<SearchableItem[]>(() => {
    const items: SearchableItem[] = [];

    // 作品データのインデックス化
    artworks.forEach(artwork => {
      items.push({
        id: artwork.id,
        type: 'artwork',
        searchableText: [
          artwork.title,
          artwork.description,
          ...artwork.searchTerms
        ],
        originalData: artwork
      });
    });

    // メンバーデータのインデックス化
    members.forEach(member => {
      items.push({
        id: member.id,
        type: 'member',
        searchableText: [
          member.name,
          member.role,
          member.bio,
          ...member.searchTerms
        ],
        originalData: member
      });
    });

    // メディア記事データのインデックス化
    mediaArticles.forEach(article => {
      items.push({
        id: article.id,
        type: 'media',
        searchableText: [
          article.title,
          article.source,
          article.date,
          ...article.searchTerms
        ],
        originalData: article
      });
    });

    return items;
  }, []);

  const playSearchSound = () => {
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(error => console.log('Audio playback failed:', error));
    }
  };

  // 検索関数の改善版
  const handleSearch = (term: string) => {
    setSearchTerm(term);

    if (!term.trim()) {
      setHighlighted(null);
      return;
    }

    const normalizedSearch = normalizeJapanese(term.trim());

    // 検索スコアリングとマッチング
    const searchResults = searchableItems
      .map(item => {
        // 各項目にスコアを付ける
        let score = 0;
        let hasExactMatch = false;

        // 正規化されたテキストでスコアリング
        item.searchableText.forEach(text => {
          const normalizedText = normalizeJapanese(text);

          // 完全一致
          if (normalizedText === normalizedSearch) {
            score += 100;
            hasExactMatch = true;
          }
          // 前方一致（"プロト"で"プロトフィシカ"を検索など）
          else if (normalizedText.startsWith(normalizedSearch)) {
            score += 50;
          }
          // 部分一致
          else if (normalizedText.includes(normalizedSearch)) {
            score += 25;
          }
          // 逆に検索語が項目テキストに含まれる場合（キーワードが長い場合）
          else if (normalizedSearch.includes(normalizedText) && normalizedText.length > 1) {
            score += 10;
          }

          // 編集距離の近さで緩やかなファジー検索（簡易実装）
          // normalizedSearchとnormalizedTextの文字の一致度を考慮
          let commonChars = 0;
          for (let i = 0; i < normalizedSearch.length; i++) {
            if (normalizedText.includes(normalizedSearch[i])) {
              commonChars++;
            }
          }

          // 共通文字率を計算してスコアに追加
          if (normalizedSearch.length > 0) {
            const commonRatio = commonChars / normalizedSearch.length;
            if (commonRatio > 0.6) { // 60%以上の文字が一致
              score += Math.round(commonRatio * 15);
            }
          }
        });

        return { item, score, hasExactMatch };
      })
      .filter(result => result.score > 0) // スコアがある項目だけをフィルタリング
      .sort((a, b) => {
        // 完全一致があるものを優先
        if (a.hasExactMatch && !b.hasExactMatch) return -1;
        if (!a.hasExactMatch && b.hasExactMatch) return 1;
        // それ以外はスコアでソート
        return b.score - a.score;
      });

    if (searchResults.length > 0) {
      // 最も高いスコアの結果をハイライト
      const topResult = searchResults[0];
      setHighlighted({
        id: topResult.item.id,
        type: topResult.item.type
      });
      playSearchSound();
    } else {
      setHighlighted(null);
    }

    // 検索の追跡
    if (term.length >= 2) {
      trackSearch(term, searchResults.length);
    }
  };

  const layoutItems = useMemo(() => {
    if (searchResults) {
      return searchResults.map(({ type, item }) => (
        <EnhancedContentItem
          key={`${type}-${item.id}`}
          type={type}
          data={item}
          isHighlighted={highlighted?.id === item.id && highlighted?.type === type}
          onClick={() => {
            // 作品閲覧の追跡
            if (type === 'artwork') {
              trackArtworkView(item.title || '', type);
            }
          }}
        />
      ));
    }

    return [
      <div key="title" className="text-xl md:text-2xl font-light text-center mb-8 text-gray-300">
        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          ワクワク
        </span>
        と
        <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          創り出す
        </span>
      </div>,
      ...artworks.map(artwork => (
        <EnhancedContentItem
          key={`artwork-${artwork.id}`}
          type="artwork"
          data={artwork}
          isHighlighted={highlighted?.id === artwork.id && highlighted?.type === 'artwork'}
          onClick={() => trackArtworkView(artwork.title, 'artwork')}
        />
      )),
      ...members.map(member => (
        <EnhancedContentItem
          key={`member-${member.id}`}
          type="member"
          data={member}
          isHighlighted={highlighted?.id === member.id && highlighted?.type === 'member'}
          onClick={() => trackArtworkView(member.name, 'member')}
        />
      )),
      ...mediaArticles.map(article => (
        <EnhancedContentItem
          key={`media-${article.id}`}
          type="media"
          data={article}
          isHighlighted={highlighted?.id === article.id && highlighted?.type === 'media'}
          onClick={() => trackArtworkView(article.title, 'media')}
        />
      ))
    ];
  }, [searchResults, highlighted]);

  // ギャラリーページを表示する場合
  if (showGallery) {
    return <GalleryPage onBack={handleBackFromGallery} />;
  }

  // モバイル版の場合は無限スクロールレイアウトを表示
  if (isMobile) {
    return (
      <div className={`min-h-screen bg-black text-white transition-opacity duration-500 ${
        isPageLoaded ? 'opacity-100' : 'opacity-0'
      }`}>
        {/* 背景を最初から表示 */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-black"></div>
          <div className="absolute inset-0 bg-[url('/stars.png')] opacity-30 animate-twinkle"></div>
          <div className="absolute inset-0 bg-gradient-radial from-transparent to-black"></div>
        </div>

        {/* 固定ヘッダー */}
        <div className={`fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-700 transition-all duration-700 ${
          isPageLoaded ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}>
          <div className="px-2 py-6">
            <SearchHeader
              onSearch={handleSearch}
              onGalleryClick={handleGalleryClick}
            />
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="pt-36">
          <InfiniteScrollLayout searchHighlightInfo={highlighted} />
        </div>

        <style jsx global>{`
          @keyframes twinkle {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.05); }
          }
          .animate-twinkle {
            animation: twinkle 8s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  // PC版の従来レイアウト
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* SEO用の隠しコンテンツ - AIクローラー向け */}
      <div className="sr-only">
        <h1>4ZIGEN - 東京大学発ワクワククリエイター集団</h1>
        <p>デジタルファブリケーション、メディアアート、インタラクティブアートの分野で革新的な作品を制作する東京大学の学生集団です。</p>
        <nav aria-label="主要作品">
          <ul>
            {artworks.map(artwork => (
              <li key={artwork.id}>
                <a href={artwork.link}>{artwork.title} - {artwork.description}</a>
              </li>
            ))}
          </ul>
        </nav>
        <section aria-label="メンバー紹介">
          {members.map(member => (
            <article key={member.id}>
              <h3>{member.name} - {member.role}</h3>
              <p>{member.bio}</p>
              <a href={member.link}>プロフィールを見る</a>
            </article>
          ))}
        </section>
      </div>

      <div className="container mx-auto px-2 md:px-4 py-4 md:py-8 relative z-10">
        <SearchHeader
          onSearch={handleSearch}
          onGalleryClick={handleGalleryClick}
        />
        <main role="main" aria-label="作品とアーティストの展示">
          <DynamicLayout searchHighlightInfo={highlighted}>
            {layoutItems}
          </DynamicLayout>
        </main>

        <footer className="mt-16 pb-4 text-center text-xs text-gray-600 opacity-60">
          <p>© {new Date().getFullYear()} 4ZIGEN All Rights Reserved.</p>
          <address className="not-italic mt-2">
            Contact: <a href="mailto:contact@4zigen.com">contact@4zigen.com</a>
          </address>
        </footer>
      </div>

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/stars.png')] opacity-50 animate-twinkle"></div>
        <div className="absolute inset-0 bg-gradient-radial from-transparent to-black"></div>
      </div>

      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        .animate-twinkle {
          animation: twinkle 5s ease-in-out infinite;
        }
        .animate-twinkle::before,
        .animate-twinkle::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: inherit;
          animation: twinkle 7s ease-in-out infinite;
          animation-delay: -2.5s;
        }
        .animate-twinkle::after {
          animation-duration: 9s;
          animation-delay: -5s;
        }
      `}</style>
    </div>
  );
}