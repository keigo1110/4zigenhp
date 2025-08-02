// EventCard.tsx
import React from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ExternalLink, Calendar, Play, Star } from 'lucide-react';
import { trackArtworkView } from '@/lib/analytics';
import { YouTubeEmbed } from './YouTubeEmbed';

interface EventWork {
  title: string;
  description: string;
  image: string;
}

interface Event {
  id: number;
  title: string;
  source: string;
  date: string;
  link: string;
  image: string;
  youtubeVideoId?: string;
  description?: string;
  sparkAwardWorks?: EventWork[];
}

interface EventCardProps {
  event: Event;
  isHighlighted?: boolean;
}

export function EventCard({ event, isHighlighted = false }: EventCardProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const isSparkAward = event.title.includes('S×PARK') && !event.source.includes('EXPO 2025');

  const handleCardClick = () => {
    setIsOpen(true);
    trackArtworkView(event.title, 'event');
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
              src={event.image}
              alt={event.source}
              width={200}
              height={200}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
            />
            {event.youtubeVideoId && (
              <div className="absolute -top-1 -right-1 bg-red-600 rounded-full p-1">
                <Play size={8} className="text-white" />
              </div>
            )}
            {isSparkAward && (
              <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-1">
                <Star size={8} className="text-black" />
              </div>
            )}
          </div>
          <div className="text-center">
            <h3 className="text-xs md:text-sm font-medium text-white line-clamp-1">
              {event.source}
            </h3>
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-gray-900 text-white border-gray-800 w-[95vw] md:w-auto max-w-4xl mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl font-bold">{event.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <Image
                src={event.image}
                alt={event.source}
                width={100}
                height={100}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="text-purple-400 font-medium">{event.source}</p>
                <p className="text-sm text-gray-400">{event.date}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <a
                    href="https://d-s-festival.jp/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <span>デジタル学園祭</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  <a
                    href="https://www.spark-awards.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-yellow-400 hover:text-yellow-300 transition-colors"
                  >
                    <span>S×PARK</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {event.description && (
              <DialogDescription className="text-sm md:text-base text-gray-300">
                {event.description}
              </DialogDescription>
            )}

            {event.sparkAwardWorks && (
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-purple-400">出品作品</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {event.sparkAwardWorks.map((work, index) => (
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

            {event.youtubeVideoId && (
              <div className="space-y-2">
                <h4 className="text-lg font-semibold text-purple-400">展示記録</h4>
                <YouTubeEmbed
                  videoId={event.youtubeVideoId}
                  title={event.title}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// EnhancedContentItem に追加するためのイベント用のラッパーコンポーネント
export function EnhancedEventItem({ type, data, isHighlighted }: { type: string, data: Event, isHighlighted: boolean }) {
  return (
    <div className={`w-full h-full rounded-full overflow-hidden transition-all duration-300
      ${isHighlighted ? 'scale-110 shadow-lg ring-2 ring-white' : 'scale-100'}`}
    >
      <EventCard event={data} isHighlighted={isHighlighted} />
    </div>
  );
}