import Image from 'next/image';
import { artworks } from './data';

export function ArtworkItem({ artwork }: { artwork: typeof artworks[0] }) {
  return (
    <div className="h-full flex flex-col justify-between">
      <Image src={artwork.image} alt={artwork.title} width={300} height={300} className="w-full h-auto rounded-md" />
      <h3 className="text-xl font-bold mt-2 text-white">{artwork.title}</h3>
    </div>
  );
}

export default function ArtworkGrid() {
  return (
    <>
      {artworks.map((artwork) => (
        <ArtworkItem key={artwork.id} artwork={artwork} />
      ))}
    </>
  );
}