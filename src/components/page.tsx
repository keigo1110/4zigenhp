"use client";

import React, { useState } from 'react';
import DynamicLayout from './DynamicLayout';
import { artworks, members, mediaArticles } from './data';
import EnhancedContentItem from './DetailCards';
import { SearchHeader } from './SearchHeader';
import { EnhancedMediaItem } from './MediaCard';

interface HighlightInfo {
  id: number;
  type: 'artwork' | 'member' | 'media';
}

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

  const playSearchSound = () => {
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(error => console.log('Audio playback failed:', error));
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);

    if (!term.trim()) {
      setHighlighted(null);
      return;
    }

    const normalizedSearch = normalizeJapanese(term.trim());

    const foundArtwork = artworks.find(art => {
      const normalizedTitle = normalizeJapanese(art.title);
      const normalizedDesc = normalizeJapanese(art.description);
      const normalizedSearchTerms = art.searchTerms.map(term => normalizeJapanese(term));

      return normalizedTitle.includes(normalizedSearch) ||
             normalizedDesc.includes(normalizedSearch) ||
             normalizedSearchTerms.some(term =>
               term.includes(normalizedSearch) || normalizedSearch.includes(term)
             );
    });

    if (foundArtwork) {
      setHighlighted({ id: foundArtwork.id, type: 'artwork' });
      playSearchSound();
      return;
    }

    const foundMember = members.find(mem => {
      const normalizedName = normalizeJapanese(mem.name);
      const normalizedRole = normalizeJapanese(mem.role);
      const normalizedBio = normalizeJapanese(mem.bio);
      const normalizedSearchTerms = mem.searchTerms.map(term => normalizeJapanese(term));

      return normalizedName.includes(normalizedSearch) ||
             normalizedRole.includes(normalizedSearch) ||
             normalizedBio.includes(normalizedSearch) ||
             normalizedSearchTerms.some(term =>
               term.includes(normalizedSearch) || normalizedSearch.includes(term)
             );
    });

    if (foundMember) {
      setHighlighted({ id: foundMember.id, type: 'member' });
      playSearchSound();
      return;
    }

    const foundMedia = mediaArticles.find(media => {
      const normalizedTitle = normalizeJapanese(media.title);
      const normalizedSource = normalizeJapanese(media.source);
      const normalizedSearchTerms = media.searchTerms.map(term => normalizeJapanese(term));

      return normalizedTitle.includes(normalizedSearch) ||
             normalizedSource.includes(normalizedSearch) ||
             normalizedSearchTerms.some(term =>
               term.includes(normalizedSearch) || normalizedSearch.includes(term)
             );
    });

    if (foundMedia) {
      setHighlighted({ id: foundMedia.id, type: 'media' });
      playSearchSound();
    } else {
      setHighlighted(null);
    }
  };

  const layoutItems = [
    ...artworks.map((artwork) => (
      <EnhancedContentItem
        key={`artwork-${artwork.id}`}
        type="artwork"
        data={artwork}
        isHighlighted={highlighted?.type === 'artwork' && highlighted.id === artwork.id}
      />
    )),
    ...members.map((member) => (
      <EnhancedContentItem
        key={`member-${member.id}`}
        type="member"
        data={{ ...member, description: member.bio }}
        isHighlighted={highlighted?.type === 'member' && highlighted.id === member.id}
      />
    )),
    ...mediaArticles.map((article) => (
      <EnhancedContentItem
        key={`media-${article.id}`}
        type="media"
        data={{ ...article, description: article.title }}
        isHighlighted={highlighted?.type === 'media' && highlighted.id === article.id}
      />
    ))
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