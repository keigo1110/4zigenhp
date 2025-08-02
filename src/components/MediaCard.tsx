// MediaCard.tsx
import React from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ExternalLink, Calendar, Play } from 'lucide-react';
import { trackArtworkView } from '@/lib/analytics';
import { YouTubeEmbed } from './YouTubeEmbed';

interface MediaArticle {
  id: number;
  title: string;
  source: string;
  date: string;
  link: string;
  image: string;
  youtubeVideoId?: string;
  description?: string;
  sparkAwardWorks?: Array<{
    title: string;
    description: string;
    image: string;
  }>;
}

interface MediaCardProps {
  article: MediaArticle;
  isHighlighted?: boolean;
}

export function MediaCard({ article, isHighlighted = false }: MediaCardProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const isSparkAward = article.title.includes('デジタル学園祭2025アワード') || article.source.includes('S×PARK');

  const handleCardClick = () => {
    setIsOpen(true);
    trackArtworkView(article.title, 'media');
  };

  const handleLinkClick = () => {
    trackArtworkView(`${article.title}_external_link`, 'media');
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className={`aspect-square w-24 md:w-32 h-24 md:h-32 backdrop-blur-sm rounded-full p-2 md:p-3
          transition-all duration-500 cursor-pointer
          border border-gray-700
          ${isHighlighted
            ? 'bg-purple-600/80 scale-150 shadow-lg shadow-purple-500/50 z-50'
            : isSparkAward
              ? 'bg-gradient-to-br from-purple-600/40 to-pink-600/40 hover:from-purple-500/50 hover:to-pink-500/50 hover:border-purple-400 hover:scale-105 shadow-lg shadow-purple-500/30'
              : 'bg-gray-800/20 hover:bg-gray-700/30 hover:border-purple-500 hover:scale-105'}`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-2">
          <div className="relative">
            <Image
              src={article.image}
              alt={article.source}
              width={200}
              height={200}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
            />
            {article.youtubeVideoId && (
              <div className="absolute -top-1 -right-1 bg-red-600 rounded-full p-1">
                <Play size={8} className="text-white" />
              </div>
            )}
            {article.youtubeVideoId && (
              <div className="absolute -bottom-1 -left-1 bg-red-600 rounded-full p-1">
                <Play size={8} className="text-white" />
              </div>
            )}
            {isSparkAward && (
              <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-1">
                <span className="text-xs text-black font-bold">★</span>
              </div>
            )}
          </div>
          <div className="text-center">
            <h3 className="text-xs md:text-sm font-medium text-white line-clamp-1">
              {article.source}
            </h3>
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-gray-900 text-white border-gray-800 w-[95vw] md:w-auto max-w-4xl mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl font-bold">{article.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <Image
                src={article.image}
                alt={article.source}
                width={100}
                height={100}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="text-purple-400 font-medium">{article.source}</p>
                <p className="text-sm text-gray-400">{article.date}</p>
                {isSparkAward && (
                  <p className="text-sm text-yellow-400 font-medium">★ S×PARKアワード出品作品</p>
                )}
              </div>
            </div>

            {article.description && (
              <DialogDescription className="text-sm md:text-base text-gray-300">
                {article.description}
              </DialogDescription>
            )}

            {article.youtubeVideoId && (
              <div className="space-y-2">
                <h4 className="text-lg font-semibold text-purple-400">作品記録動画</h4>
                <div className="text-xs text-gray-500 mb-2">Video ID: {article.youtubeVideoId}</div>
                <YouTubeEmbed
                  videoId={article.youtubeVideoId}
                  title={article.title}
                  className="w-full"
                />
              </div>
            )}

            {article.sparkAwardWorks && (
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-purple-400">出品作品</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {article.sparkAwardWorks.map((work, index) => (
                    <div key={index} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                      <div className="flex items-center space-x-3 mb-2">
                        <Image
                          src={work.image}
                          alt={work.title}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <h5 className="text-sm font-medium text-white">{work.title}</h5>
                      </div>
                      <p className="text-xs text-gray-300">{work.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 外部リンクボタン */}
            <div className="flex justify-center">
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLinkClick}
                className="inline-flex items-center gap-2 bg-purple-600/20 hover:bg-purple-600/30
                  backdrop-blur-sm rounded-full px-6 py-3 border border-purple-500/30
                  transition-all duration-300 hover:border-purple-500/50 group"
              >
                <span className="text-purple-300 text-sm">詳細を見る</span>
                <ExternalLink size={16} className="text-purple-400 group-hover:text-purple-300 transition-colors" />
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// EnhancedContentItem に追加するためのメディア用のラッパーコンポーネント
export function EnhancedMediaItem({ data, isHighlighted }: { data: MediaArticle, isHighlighted: boolean }) {
  return (
    <div className={`w-full h-full rounded-full overflow-hidden transition-all duration-300
      ${isHighlighted ? 'scale-110 shadow-lg ring-2 ring-white' : 'scale-100'}`}
    >
      <MediaCard article={data} isHighlighted={isHighlighted} />
    </div>
  );
}