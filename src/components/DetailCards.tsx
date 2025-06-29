import React from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ExternalLink } from 'lucide-react';
import { MediaCard } from './MediaCard';
import { trackArtworkView } from '@/lib/analytics';

interface CardBaseProps {
  onClick: () => void;
  children: React.ReactNode;
  isHighlighted?: boolean;
}

const CardBase = ({ onClick, children, isHighlighted = false }: CardBaseProps) => (
  <div
    onClick={onClick}
    className={`h-full w-full backdrop-blur-sm rounded-lg p-3 md:p-4
      transition-all duration-500
      border border-gray-700
      ${isHighlighted
        ? 'bg-purple-600/80 scale-150 shadow-lg shadow-purple-500/50 z-50'
        : 'bg-gray-800/50 hover:bg-gray-700/50 hover:border-purple-500 hover:scale-105'}`}
  >
    {children}
  </div>
);

interface Artwork {
  image: string;
  title: string;
  description: string;
  link: string;
}

export function ArtworkCard({ artwork }: { artwork: Artwork }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleCardClick = () => {
    setIsOpen(true);
    trackArtworkView(artwork.title, 'artwork');
  };

  const handleLinkClick = () => {
    trackArtworkView(`${artwork.title}_external_link`, 'artwork');
  };

  return (
    <>
      <CardBase onClick={handleCardClick}>
        <div className="space-y-2">
          <Image
            src={artwork.image}
            alt={artwork.title}
            width={300}
            height={300}
            className="w-full h-24 md:h-32 object-cover rounded-md"
          />
          <h3 className="text-base md:text-lg font-bold text-white line-clamp-2">{artwork.title}</h3>
        </div>
      </CardBase>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-gray-900 text-white border-gray-800 w-[95vw] md:w-auto max-w-2xl mx-auto">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl font-bold">{artwork.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Image
              src={artwork.image}
              alt={artwork.title}
              width={600}
              height={400}
              className="w-full h-48 md:h-64 object-cover rounded-lg"
            />
            <DialogDescription className="text-sm md:text-base text-gray-300">
              {artwork.description}
            </DialogDescription>
            <a
              href={artwork.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleLinkClick}
              className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300"
            >
              <span className="text-sm md:text-base">詳細を見る</span>
              <ExternalLink size={16} />
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface Member {
  image: string;
  name: string;
  role: string;
  bio: string;
  link: string;
}

export function MemberCard({ member }: { member: Member }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleCardClick = () => {
    setIsOpen(true);
    trackArtworkView(member.name, 'member');
  };

  const handleLinkClick = () => {
    trackArtworkView(`${member.name}_profile_link`, 'member');
  };

  return (
    <>
      <CardBase onClick={handleCardClick}>
        <div className="space-y-2">
          <Image
            src={member.image}
            alt={member.name}
            width={200}
            height={200}
            className="w-20 h-20 md:w-24 md:h-24 rounded-full mx-auto object-cover"
          />
          <div className="text-center">
            <h3 className="text-base md:text-lg font-bold text-white">{member.name}</h3>
            <p className="text-xs md:text-sm text-gray-400">{member.role}</p>
          </div>
        </div>
      </CardBase>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-gray-900 text-white border-gray-800 w-[95vw] md:w-auto max-w-2xl mx-auto">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl font-bold">{member.name}</DialogTitle>
          </DialogHeader>
          <div className="md:flex items-start space-y-4 md:space-y-0 md:space-x-4">
            <Image
              src={member.image}
              alt={member.name}
              width={200}
              height={200}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover mx-auto md:mx-0"
            />
            <div>
              <h4 className="text-lg md:text-xl text-purple-400 text-center md:text-left">{member.role}</h4>
              <DialogDescription className="text-sm md:text-base text-gray-300">
                {member.bio}
              </DialogDescription>
              <a
                href={member.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLinkClick}
                className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 mt-2"
              >
                <span className="text-sm md:text-base">プロフィールを見る</span>
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface EnhancedContentItemProps {
  type: 'artwork' | 'member' | 'media';
  data: {
    id: number;
    title?: string;
    name?: string;
    role?: string;
    image: string;
    description: string;
    link: string;
    searchTerms: string[];
    source?: string;
    date?: string;
  };
  isHighlighted: boolean;
}

export function EnhancedContentItem({ type, data, isHighlighted }: EnhancedContentItemProps) {
  const containerStyle = `w-full h-full rounded-lg overflow-hidden transition-all duration-300 ${
    isHighlighted ? 'scale-110 shadow-lg ring-2 ring-white' : 'scale-100'
  }`;

  if (type === 'artwork') {
    return (
      <div className={containerStyle}>
        <ArtworkCard artwork={data as Artwork} />
      </div>
    );
  }

  if (type === 'member') {
    const memberData: Member = {
      image: data.image,
      name: data.name || '',
      role: data.role || 'Unknown Role',
      bio: data.description,
      link: data.link,
    };
    return (
      <div className={containerStyle}>
        <MemberCard member={memberData} />
      </div>
    );
  }

  if (type === 'media') {
    const mediaData = {
      id: data.id,
      title: data.title || '',
      source: data.source || '',
      date: data.date || '',
      link: data.link,
      image: data.image,
    };
    return (
      <div className={containerStyle}>
        <MediaCard article={mediaData} isHighlighted={isHighlighted} />
      </div>
    );
  }

  return null;
}

export default EnhancedContentItem;