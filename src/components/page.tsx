"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
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

// 日本語の正規化関数（ひらがな・カタカナ・半角全角の統一）
const normalizeJapanese = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[ァ-ヶ]/g, (match) => String.fromCharCode(match.charCodeAt(0) - 0x60))
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
    .replace(/[‐－−]/g, '-');
};

export default function HomeComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [highlighted, setHighlighted] = useState<HighlightInfo | null>(null);
  const [audio] = useState(() => typeof Audio !== 'undefined' ? new Audio('/music/terete.mp3') : null);
  const [isMobile, setIsMobile] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  // playSearchSound関数をuseCallbackでメモ化
  const playSearchSound = useCallback(() => {
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(error => console.log('Audio playback failed:', error));
    }
  }, [audio]);

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
        originalData: {
          ...member,
          description: member.bio // bioをdescriptionとしてマッピング
        }
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
        originalData: {
          ...article,
          description: article.title // titleをdescriptionとしてマッピング
        }
      });
    });

    return items;
  }, []);

  // 検索結果の計算
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) {
      return null;
    }

    const normalizedSearch = normalizeJapanese(searchTerm.trim());

    // 検索スコアリングとマッチング
    const results = searchableItems
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

    // 検索の追跡
    if (searchTerm.length >= 2) {
      trackSearch(searchTerm, results.length);
    }

    return results;
  }, [searchTerm, searchableItems]);

  // 検索関数
  const handleSearch = (term: string) => {
    setSearchTerm(term);

    if (!term.trim()) {
      setHighlighted(null);
      return;
    }

    // searchResultsはuseMemoで計算される
    // ハイライト設定は useEffect で行う
  };

  // 検索結果に基づくハイライト設定
  useEffect(() => {
    if (searchResults && searchResults.length > 0) {
      const topResult = searchResults[0];
      setHighlighted({
        id: topResult.item.id,
        type: topResult.item.type
      });
      playSearchSound();
    } else if (searchTerm.trim() === '') {
      setHighlighted(null);
    }
  }, [searchResults, searchTerm, playSearchSound]);

  // 表示アイテムの計算
  const layoutItems = useMemo(() => {
    if (searchResults) {
      return searchResults.map(({ item }) => (
        <EnhancedContentItem
          key={`${item.type}-${item.id}`}
          type={item.type}
          data={item.originalData}
          isHighlighted={highlighted?.id === item.id && highlighted?.type === item.type}
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
        />
      )),
      ...members.map(member => (
        <EnhancedContentItem
          key={`member-${member.id}`}
          type="member"
          data={{
            ...member,
            description: member.bio // bioをdescriptionとしてマッピング
          }}
          isHighlighted={highlighted?.id === member.id && highlighted?.type === 'member'}
        />
      )),
      ...mediaArticles.map(article => (
        <EnhancedContentItem
          key={`media-${article.id}`}
          type="media"
          data={{
            ...article,
            description: article.title // titleをdescriptionとしてマッピング
          }}
          isHighlighted={highlighted?.id === article.id && highlighted?.type === 'media'}
        />
      ))
    ];
  }, [highlighted, searchResults]);

  // ギャラリーページを表示する場合
  if (showGallery) {
    return <GalleryPage onBack={handleBackFromGallery} />;
  }

  // モバイル版レイアウト
  if (isMobile) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-2 md:px-4 py-4 md:py-8">
          <SearchHeader
            onSearch={handleSearch}
            onGalleryClick={handleGalleryClick}
          />
          <InfiniteScrollLayout searchHighlightInfo={highlighted} />
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