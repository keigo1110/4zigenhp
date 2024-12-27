import React from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ExternalLink } from 'lucide-react';

// インターフェースを追加
interface CardBaseProps {
    onClick: () => void;
    children: React.ReactNode;
    isHighlighted?: boolean;
  }

  // CardBaseコンポーネントを更新
  const CardBase = ({ onClick, children, isHighlighted = false }: CardBaseProps) => (
    <div
      onClick={onClick}
      className={`h-full w-full backdrop-blur-sm rounded-lg p-4
        transition-all duration-500
        border border-gray-700
        ${isHighlighted
          ? 'bg-purple-600/80 scale-150 shadow-lg shadow-purple-500/50 z-50'
          : 'bg-gray-800/50 hover:bg-gray-700/50 hover:border-purple-500 hover:scale-105'}`}
    >
      {children}
    </div>
  );

// アートワークカード
interface Artwork {
  image: string;
  title: string;
  description: string;
  link: string;
}

export function ArtworkCard({ artwork }: { artwork: Artwork }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <CardBase onClick={() => setIsOpen(true)}>
        <div className="space-y-2">
          <Image
            src={artwork.image}
            alt={artwork.title}
            width={300}
            height={300}
            className="w-full h-32 object-cover rounded-md"
          />
          <h3 className="text-lg font-bold text-white">{artwork.title}</h3>
        </div>
      </CardBase>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-gray-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{artwork.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Image
              src={artwork.image}
              alt={artwork.title}
              width={600}
              height={400}
              className="w-full h-64 object-cover rounded-lg"
            />
            <DialogDescription className="text-gray-300 text-base">
              {artwork.description}
            </DialogDescription>
            <a
              href={artwork.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300"
            >
              <span>詳細を見る</span>
              <ExternalLink size={16} />
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// メンバーカード
interface Member {
  image: string;
  name: string;
  role: string;
  bio: string;
  link: string;
}

export function MemberCard({ member }: { member: Member }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <CardBase onClick={() => setIsOpen(true)}>
        <div className="space-y-2">
          <Image
            src={member.image}
            alt={member.name}
            width={200}
            height={200}
            className="w-24 h-24 rounded-full mx-auto object-cover"
          />
          <div className="text-center">
            <h3 className="text-lg font-bold text-white">{member.name}</h3>
            <p className="text-sm text-gray-400">{member.role}</p>
          </div>
        </div>
      </CardBase>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-gray-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{member.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Image
                src={member.image}
                alt={member.name}
                width={200}
                height={200}
                className="w-32 h-32 rounded-full object-cover"
              />
              <div>
                <h4 className="text-xl text-purple-400">{member.role}</h4>
                <DialogDescription className="text-gray-300 text-base">
                  {member.bio}
                </DialogDescription>
              </div>
            </div>
            <a
              href={member.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300"
            >
              <span>プロフィールを見る</span>
              <ExternalLink size={16} />
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ContentItemの新しいバージョン
interface EnhancedContentItemProps {
    type: 'artwork' | 'member';
    data: {
      id: number;
      title?: string;
      name?: string;
      role?: string;
      image: string;
      description: string;
      link: string;
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

    return null;
  }

  export const TitleItem = ({ title }: { title: string }) => {
    return (
      <div className="text-xl font-bold mb-4">
        {title}
      </div>
    );
  };

  export default EnhancedContentItem;