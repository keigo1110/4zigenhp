"use client";

import React from 'react';
import DynamicLayout from './DynamicLayout';
import { artworks, members } from './data';

const ContentItem: React.FC<{ title: string }> = ({ title }) => (
  <div className="w-full h-full flex items-center justify-center">
    <span className="text-sm text-white">{title}</span>
  </div>
);

export default function HomeComponent() {
  const layoutItems = [
    <ContentItem key="artwork-title" title="作品" />,
    <ContentItem key="member-title" title="メンバー" />,
    ...artworks.map((artwork) => <ContentItem key={artwork.id} title={artwork.title} />),
    ...members.map((member) => <ContentItem key={member.id} title={member.name} />),
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <div className="container mx-auto px-4 py-8 relative z-10">
        <header className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-pulse">
            4ZIGEN
          </h1>
          <p className="text-xl text-gray-400">4次元を超えるアート体験</p>
        </header>

        <DynamicLayout>
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
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}