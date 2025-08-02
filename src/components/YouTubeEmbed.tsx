import React from 'react';

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
  className?: string;
}

export function YouTubeEmbed({ videoId, title, className = "" }: YouTubeEmbedProps) {
  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative pb-[56.25%] h-0 bg-gray-800 rounded-lg overflow-hidden">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
          title={title || "YouTube video player"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full rounded-lg border border-gray-700"
        />
      </div>
    </div>
  );
}