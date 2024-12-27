import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchHeaderProps {
  onSearch: (term: string) => void;
}

export function SearchHeader({ onSearch }: SearchHeaderProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTerm = e.target.value;
    setSearchTerm(newTerm);
    // 入力が空になった時点でクリア
    if (newTerm === '') {
      onSearch('');
    }
  };

  return (
    <header className="text-center mb-12 relative">
      <div className="flex justify-center items-center mb-4">
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-pulse">
          4ZIGEN
        </h1>
        <form
          onSubmit={handleSubmit}
          className={`absolute right-4 transition-all duration-300 ease-out
            ${isExpanded ? 'w-64' : 'w-12'}`}
        >
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="作品・メンバーを検索"
              value={searchTerm}
              onChange={handleChange}
              className={`w-full bg-gray-800/50 backdrop-blur-sm rounded-full py-2 pl-4 pr-12
                border border-gray-700 focus:border-purple-500 focus:outline-none
                transition-all duration-300 ease-out text-white
                ${isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            />
            {isExpanded && searchTerm && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-10 p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="absolute right-2 p-2 text-white hover:text-purple-400 transition-colors"
            >
              <Search size={20} />
            </button>
          </div>
        </form>
      </div>
      <p className="text-xl text-gray-400">ポケットの中</p>
    </header>
  );
}