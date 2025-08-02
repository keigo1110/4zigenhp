import React, { useState, useEffect } from 'react';
import { Search, X, LayoutGrid } from 'lucide-react';

interface SearchHeaderProps {
  onSearch: (term: string) => void;
  onGalleryClick?: () => void;
}

export function SearchHeader({ onSearch, onGalleryClick }: SearchHeaderProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 検索クリアイベントのリスナー
  useEffect(() => {
    const handleClearSearch = () => {
      setSearchTerm('');
      onSearch('');
      setIsExpanded(false);
    };

    window.addEventListener('clearSearch', handleClearSearch);

    return () => {
      window.removeEventListener('clearSearch', handleClearSearch);
    };
  }, [onSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
    setIsExpanded(false); // 検索をクリアしたら入力フィールドを閉じる
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTerm = e.target.value;
    setSearchTerm(newTerm);
    // 入力が空になった時点でクリア
    if (newTerm === '') {
      onSearch('');
    }
  };

  const handleSearchToggle = () => {
    if (isExpanded && searchTerm === '') {
      // 検索フィールドが空の状態で閉じる場合
      setIsExpanded(false);
    } else {
      // 検索フィールドを開く場合
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <header className="text-center mb-6 md:mb-12 relative px-4">
      <div className="flex justify-center items-center mb-4 relative">
        {/* ギャラリーボタン（左側） */}
        {onGalleryClick && (
          <button
            onClick={onGalleryClick}
            className="absolute left-2 md:left-4 p-3 md:p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50
              transition-all duration-300 hover:scale-105 group"
            aria-label="ギャラリーを開く"
          >
            <LayoutGrid size={18} className="md:w-5 md:h-5 text-white group-hover:text-purple-400 transition-colors" />
          </button>
        )}

        <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-pulse">
          4ZIGEN
        </h1>

        {/* 検索フォーム（右側） */}
        <form
          onSubmit={handleSubmit}
          className={`absolute right-2 md:right-4 transition-all duration-300 ease-out
            ${isExpanded ? 'w-48 md:w-64' : 'w-12 md:w-12'}`}
        >
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="作品名・作者名で検索"
              value={searchTerm}
              onChange={handleChange}
              autoFocus={isExpanded}
              className={`w-full bg-gray-800/80 backdrop-blur-sm rounded-full
                py-3 md:py-2
                pl-4 md:pl-4
                pr-12 md:pr-12
                text-base md:text-base
                border-2 ${searchTerm ? 'border-purple-500' : 'border-gray-600'}
                focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30
                transition-all duration-300 ease-out text-white placeholder-gray-400
                ${isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            />
            {isExpanded && searchTerm && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-10 md:right-10 p-2 text-gray-400 hover:text-white transition-colors
                  bg-gray-700/50 rounded-full hover:bg-gray-600/50"
                aria-label="検索をクリア"
              >
                <X size={16} className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={handleSearchToggle}
              className={`absolute right-1 md:right-2 p-3 md:p-2 transition-all duration-300
                ${isExpanded && searchTerm
                  ? 'text-purple-400 bg-purple-500/20'
                  : 'text-white hover:text-purple-400'
                }
                rounded-full hover:bg-gray-700/30`}
              aria-label={isExpanded ? '検索を実行' : '検索を開く'}
            >
              <Search size={18} className="md:w-5 md:h-5" />
            </button>
          </div>
        </form>
      </div>
      <p className="text-base md:text-xl text-gray-400">ポケットの中</p>

      {/* 検索状態のヒント表示 */}
      {isExpanded && (
        <div className="mt-2 text-xs text-gray-500 animate-fade-in">
          <p>💡 作品名や作者名を入力して検索できます</p>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </header>
  );
}