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
    <header className="text-center mb-6 md:mb-12 relative px-4">
      <div className="flex justify-center items-center mb-4 relative">
        <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-pulse">
          4ZIGEN
        </h1>
        <form
          onSubmit={handleSubmit}
          className={`absolute right-2 md:right-4 transition-all duration-300 ease-out
            ${isExpanded ? 'w-40 md:w-64' : 'w-10 md:w-12'}`}
        >
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="検索"
              value={searchTerm}
              onChange={handleChange}
              className={`w-full bg-gray-800/50 backdrop-blur-sm rounded-full
                py-1.5 md:py-2
                pl-3 md:pl-4
                pr-8 md:pr-12
                text-sm md:text-base
                border border-gray-700 focus:border-purple-500 focus:outline-none
                transition-all duration-300 ease-out text-white
                ${isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            />
            {isExpanded && searchTerm && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-8 md:right-10 p-1.5 md:p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X size={14} className="md:w-4 md:h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="absolute right-1 md:right-2 p-1.5 md:p-2 text-white hover:text-purple-400 transition-colors"
            >
              <Search size={16} className="md:w-5 md:h-5" />
            </button>
          </div>
        </form>
      </div>
      <p className="text-base md:text-xl text-gray-400">ポケットの中</p>
    </header>
  );
}