'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { artworks, members, events } from './data';
import EnhancedContentItem from './DetailCards';
import { EnhancedEventItem } from './EventCard';
import { X, Search, Twitter } from 'lucide-react';

interface HighlightInfo {
  id: number;
  type: 'artwork' | 'member' | 'media' | 'event';
}

interface InfiniteScrollLayoutProps {
  searchHighlightInfo?: HighlightInfo | null;
}

// アイテムをランダムにシャッフルする関数
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function InfiniteScrollLayout({ searchHighlightInfo }: InfiniteScrollLayoutProps) {
  const [displayItems, setDisplayItems] = useState<Array<{ type: 'artwork' | 'member' | 'event'; data: any; key: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [itemsLoadedCount, setItemsLoadedCount] = useState(0);

  // 検索状態かどうかを判定
  const isSearchActive = searchHighlightInfo !== null;

  // 検索ハイライト対応
  const getItemHighlight = (item: any) => {
    if (!searchHighlightInfo) return false;
    return searchHighlightInfo.id === item.data.id && searchHighlightInfo.type === item.type;
  };

  // 全アイテムをランダムに組み合わせる（無限に近いリスト作成）
  const allItems = useMemo(() => {
    const artworkItems = artworks.map(artwork => ({
      type: 'artwork' as const,
      data: artwork
    }));

    const memberItems = members.map(member => ({
      type: 'member' as const,
      data: member
    }));

    const eventItems = events.map(event => ({
      type: 'event' as const,
      data: event
    }));

    // シャッフルして無限ループ用の長いリストを作成
    const baseItems = shuffleArray([...artworkItems, ...memberItems, ...eventItems]);
    const extendedItems = [];

    // 200回繰り返してより長いループ用リストを作成
    for (let i = 0; i < 200; i++) {
      extendedItems.push(...shuffleArray([...baseItems]));
    }

    return extendedItems;
  }, []);

  // 新しいアイテムを追加する関数
  const addMoreItems = useCallback((count: number = 8) => {
    console.log(`アイテム追加中: ${count}個`);
    setDisplayItems(prev => {
      const currentLength = prev.length;
      const newItems = [];

      for (let i = 0; i < count; i++) {
        const index = (currentLength + i) % allItems.length;
        const item = allItems[index];
        newItems.push({
          ...item,
          key: `${item.type}-${item.data.id}-${currentLength + i}-${Date.now()}`
        });
      }

      console.log(`新しいアイテム追加完了: 合計${currentLength + count}個`);
      return [...prev, ...newItems];
    });

    setItemsLoadedCount(prev => prev + count);
  }, [allItems]);

  // 初期アイテムの読み込み
  useEffect(() => {
    if (!isInitialized) {
      console.log('初期アイテム読み込み開始');
      addMoreItems(20); // 初期表示アイテム数をさらに増やす
      setIsInitialized(true);

      // 初期化完了を少し遅延させる
      setTimeout(() => {
        console.log('初期化完了');
      }, 500);
    }
  }, [addMoreItems, isInitialized]);

  // スクロール検知（シンプルで確実な実装）
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      // すでにローディング中か検索中の場合は無視
      if (isLoading || isSearchActive) {
        return;
      }

      // スロットリング（連続実行を防ぐ）
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      scrollTimeout = setTimeout(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // 下から800px以内になったら新しいアイテムを読み込み（より早めに）
        const triggerPoint = documentHeight - windowHeight - 800;

        if (scrollTop >= triggerPoint) {
          console.log('スクロール検知: 新しいアイテムを事前読み込み');
          setIsLoading(true);

          // 新しいアイテムを即座に追加（遅延を短縮）
          setTimeout(() => {
            addMoreItems(12); // アイテム数を増やして余裕を持たせる
            setIsLoading(false);
          }, 100); // 遅延を200msから100msに短縮
        }
      }, 50); // デバウンスも100msから50msに短縮してより反応良く
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [addMoreItems, isLoading, isSearchActive]);

  return (
    <div className="w-full min-h-screen bg-transparent">
      {/* アイテムグリッド */}
      <div className="px-4 pt-8 pb-20">
        {isSearchActive ? (
          // 検索モード: ハイライトされたアイテムを中央に表示（重複排除）
          <div className="flex flex-col items-center justify-center min-h-[60vh] relative">
            {displayItems
              .filter(item => getItemHighlight(item))
              .reduce((unique, item) => {
                const isDuplicate = unique.some(uniqueItem =>
                  uniqueItem.data.id === item.data.id && uniqueItem.type === item.type
                );
                if (!isDuplicate) {
                  unique.push(item);
                }
                return unique;
              }, [] as typeof displayItems)
              .slice(0, 1)
              .length > 0 ? (
                // 検索結果がある場合
                <>
                  {/* 検索結果ヘッダー */}
                  <div className="mb-6 text-center">
                    <div className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-500/30">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <span className="text-blue-300 text-sm font-medium">検索結果</span>
                    </div>
                  </div>

                  {/* 検索結果アイテム */}
                  {displayItems
                    .filter(item => getItemHighlight(item))
                    .reduce((unique, item) => {
                      const isDuplicate = unique.some(uniqueItem =>
                        uniqueItem.data.id === item.data.id && uniqueItem.type === item.type
                      );
                      if (!isDuplicate) {
                        unique.push(item);
                      }
                      return unique;
                    }, [] as typeof displayItems)
                    .slice(0, 1)
                    .map((item) => (
                      <div
                        key={`search-${item.type}-${item.data.id}`}
                        className="w-72 h-72 transition-all duration-700 ease-out transform hover:scale-105 z-50
                          bg-gradient-to-br from-blue-500/10 to-red-500/10 rounded-3xl p-4 backdrop-blur-sm
                          border border-blue-500/20 shadow-2xl shadow-blue-500/20"
                      >
                        {item.type === 'event' ? (
                          <EnhancedEventItem
                            type={item.type}
                            data={item.data}
                            isHighlighted={true}
                          />
                        ) : (
                          <EnhancedContentItem
                            type={item.type}
                            data={item.data}
                            isHighlighted={true}
                          />
                        )}
                      </div>
                    ))}

                  {/* 検索をクリアするボタン */}
                  <div className="mt-6">
                    <button
                      onClick={() => window.dispatchEvent(new CustomEvent('clearSearch'))}
                      className="inline-flex items-center gap-2 bg-gray-800/80 hover:bg-gray-700/80
                        backdrop-blur-sm rounded-full px-6 py-3 border border-gray-600
                        transition-all duration-300 hover:border-gray-500 group"
                    >
                      <span className="text-gray-300 text-sm">検索をクリア</span>
                      <X size={16} className="text-gray-400 group-hover:text-gray-300 transition-colors" />
                    </button>
                  </div>
                </>
              ) : (
                // 検索結果がない場合
                <div className="text-center">
                  <div className="mb-6">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-800/50 rounded-full flex items-center justify-center">
                      <Search size={24} className="text-gray-500" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-300 mb-2">検索結果が見つかりませんでした</h3>
                    <p className="text-gray-500 text-sm mb-6">
                      別のキーワードで検索してみてください
                    </p>
                  </div>

                  {/* 検索候補の表示 */}
                  <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                    <h4 className="text-base font-medium text-gray-300 mb-4">検索のヒント</h4>
                    <div className="space-y-2 text-sm text-gray-400">
                      <p>• 作品名: 「頚香」「Protozoa」など</p>
                      <p>• 作者名: 「4ZIGEN」「collective」など</p>
                      <p>• ひらがな・カタカナでも検索できます</p>
                    </div>
                  </div>

                  {/* 検索をクリアするボタン */}
                  <div className="mt-6">
                    <button
                      onClick={() => window.dispatchEvent(new CustomEvent('clearSearch'))}
                      className="inline-flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30
                        backdrop-blur-sm rounded-full px-6 py-3 border border-blue-500/30
                        transition-all duration-300 hover:border-blue-500/50 group"
                    >
                      <span className="text-blue-300 text-sm">すべてのアイテムを見る</span>
                      <X size={16} className="text-blue-400 group-hover:text-blue-300 transition-colors" />
                    </button>
                  </div>
                </div>
              )}

            {/* 背景のぼかし効果 */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-3xl -z-10"></div>

            {/* 他のアイテムを薄く表示（検索結果がある場合のみ） */}
            {displayItems
              .filter(item => getItemHighlight(item))
              .reduce((unique, item) => {
                const isDuplicate = unique.some(uniqueItem =>
                  uniqueItem.data.id === item.data.id && uniqueItem.type === item.type
                );
                if (!isDuplicate) {
                  unique.push(item);
                }
                return unique;
              }, [] as typeof displayItems)
              .length > 0 && (
                <div className="absolute inset-0 opacity-15 pointer-events-none">
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    {displayItems
                      .filter(item => !getItemHighlight(item))
                      .reduce((unique, item) => {
                        const isDuplicate = unique.some(uniqueItem =>
                          uniqueItem.data.id === item.data.id && uniqueItem.type === item.type
                        );
                        if (!isDuplicate) {
                          unique.push(item);
                        }
                        return unique;
                      }, [] as typeof displayItems)
                      .slice(0, 6)
                      .map((item) => (
                        <div
                          key={`bg-${item.type}-${item.data.id}`}
                          className="aspect-square transition-all duration-500"
                        >
                          {item.type === 'event' ? (
                            <EnhancedEventItem
                              type={item.type}
                              data={item.data}
                              isHighlighted={false}
                            />
                          ) : (
                            <EnhancedContentItem
                              type={item.type}
                              data={item.data}
                              isHighlighted={false}
                            />
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}
          </div>
        ) : (
          // 通常モード: 無限スクロールグリッド（シンプルで確実な表示）
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {displayItems.map((item, index) => (
              <div
                key={item.key}
                className="aspect-square transition-all duration-500 opacity-100 translate-y-0"
                style={{
                  animationDelay: index < 20 ? `${(index % 4) * 80}ms` : '0ms'
                }}
              >
                {item.type === 'event' ? (
                  <EnhancedEventItem
                    type={item.type}
                    data={item.data}
                    isHighlighted={false}
                  />
                ) : (
                  <EnhancedContentItem
                    type={item.type}
                    data={item.data}
                    isHighlighted={false}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* ローディング表示 */}
        {isLoading && !isSearchActive && (
          <div className="flex justify-center items-center py-4">
            <div className="relative">
              <div className="w-6 h-6 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <span className="ml-2 text-gray-400 text-xs">読み込み中...</span>
          </div>
        )}

        {/* フッター部分 */}
        {!isSearchActive && (
          <div className="text-center py-8 text-gray-500 text-sm">
            <p>ポケットは無限に続きます... ({displayItems.length}個のアイテムを表示中)</p>
          </div>
        )}
      </div>

      {/* 固定フッター */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-gray-900/90 backdrop-blur-sm border-t border-gray-700">
        <div className="px-4 py-2">
          <div className="flex items-center justify-center gap-4">
            <p className="text-xs text-gray-500">© 2025 4ZIGEN All Rights Reserved.</p>
            <a
              href="https://x.com/4ZIGENGSii"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-400 transition-colors duration-300"
              aria-label="4ZIGENのTwitterアカウント"
            >
              <Twitter size={10} />
              <span className="text-xs">@4ZIGENGSii</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}