// MediaCard.tsx
import React from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ExternalLink, Calendar } from 'lucide-react';

interface MediaArticle {
  id: number;
  title: string;
  source: string;
  date: string;
  link: string;
  image: string;
}

interface MediaCardProps {
  article: MediaArticle;
  isHighlighted?: boolean;
}

export function MediaCard({ article, isHighlighted = false }: MediaCardProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className={`aspect-square h-24 md:h-32 backdrop-blur-sm rounded-full p-2 md:p-3
          transition-all duration-500 cursor-pointer
          border border-gray-700
          ${isHighlighted
            ? 'bg-purple-600/80 scale-150 shadow-lg shadow-purple-500/50 z-50'
            : 'bg-gray-800/20 hover:bg-gray-700/30 hover:border-purple-500 hover:scale-105'}`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-2">
          <Image
            src={article.image}
            alt={article.source}
            width={200}
            height={200}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
          />
          <div className="text-center">
            <h3 className="text-xs md:text-sm font-medium text-white line-clamp-1">
              {article.source}
            </h3>
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-gray-900 text-white border-gray-800 w-[95vw] md:w-auto max-w-2xl mx-auto">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl font-bold">{article.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Image
                src={article.image}
                alt={article.source}
                width={200}
                height={200}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover"
              />
              <div>
                <h4 className="text-lg text-purple-400">{article.source}</h4>
                <div className="flex items-center text-sm text-gray-400 mt-1">
                  <Calendar size={14} className="mr-1" />
                  <span>{article.date}</span>
                </div>
              </div>
            </div>
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300"
            >
              <span>記事を読む</span>
              <ExternalLink size={16} />
            </a>
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