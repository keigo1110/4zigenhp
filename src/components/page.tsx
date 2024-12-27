"use client";

import React, { useState } from 'react';
import DynamicLayout from './DynamicLayout';
import { artworks, members } from './data';
import EnhancedContentItem, { TitleItem } from './DetailCards';
import { SearchHeader } from './SearchHeader';

interface HighlightInfo {
  id: number;
  type: 'artwork' | 'member';
}

export default function HomeComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [highlighted, setHighlighted] = useState<HighlightInfo | null>(null);

  const handleSearch = (term: string) => {
    setSearchTerm(term);

    if (!term.trim()) {
      setHighlighted(null);
      return;
    }

    const searchLower = term.trim().toLowerCase();

    // まず作品のタイトルで検索
    const foundArtwork = artworks.find(art =>
      art.title.toLowerCase().includes(searchLower)
    );

    // 作品が見つかった場合はそれを返す
    if (foundArtwork) {
      setHighlighted({ id: foundArtwork.id, type: 'artwork' });
      return;
    }

    // 作品が見つからない場合はメンバー名で検索
    const foundMember = members.find(mem =>
      mem.name.toLowerCase().includes(searchLower)
    );

    setHighlighted(foundMember ? { id: foundMember.id, type: 'member' } : null);
  };

  const layoutItems = [
    <TitleItem key="artwork-title" title="作品" />,
    ...artworks.map((artwork) => (
      <EnhancedContentItem
        key={`artwork-${artwork.id}`}
        type="artwork"
        data={artwork}
        isHighlighted={highlighted?.type === 'artwork' && highlighted.id === artwork.id}
      />
    )),
    <TitleItem key="member-title" title="メンバー" />,
    ...members.map((member) => (
      <EnhancedContentItem
        key={`member-${member.id}`}
        type="member"
        data={{ ...member, description: member.bio }}
        isHighlighted={highlighted?.type === 'member' && highlighted.id === member.id}
      />
    )),
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <div className="container mx-auto px-2 md:px-4 py-4 md:py-8 relative z-10">
        <SearchHeader onSearch={handleSearch} />
        <DynamicLayout searchHighlightInfo={highlighted}>
          {layoutItems}
        </DynamicLayout>
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