'use client';

import { useState, useEffect } from 'react';
import { shuffleArray } from './utils';

interface ShuffleLayoutProps {
  children: React.ReactNode[];
}

export default function ShuffleLayout({ children }: ShuffleLayoutProps) {
  const [shuffledChildren, setShuffledChildren] = useState(children);

  useEffect(() => {
    setShuffledChildren(shuffleArray(children));
  }, [children]);

  return (
    <div className="space-y-8">
      {shuffledChildren.map((child, index) => (
        <div key={index}>{child}</div>
      ))}
    </div>
  );
}

