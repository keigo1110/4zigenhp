'use client';

import React, { useState, useEffect, useRef } from 'react';
import { shuffleArray, getRandomFloat, getRandomVelocity, avoidCollision, updatePosition, ItemPosition, ContainerSize } from './utils';

interface DynamicLayoutProps {
  children: React.ReactNode[];
}

export default function DynamicLayout({ children }: DynamicLayoutProps) {
  const [layoutItems, setLayoutItems] = useState<React.ReactNode[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const positionsRef = useRef<ItemPosition[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const initializeLayout = () => {
      const shuffledChildren = shuffleArray(children);
      const containerRect = containerRef.current?.getBoundingClientRect();
      const containerWidth = containerRect?.width || 800;
      const containerHeight = containerRect?.height || 600;

      const newLayoutItems = shuffledChildren.map((child, index) => {
        const position: ItemPosition = {
          x: getRandomFloat(0, containerWidth - 100),
          y: getRandomFloat(0, containerHeight - 100),
          ...getRandomVelocity(1)
        };
        positionsRef.current[index] = position;

        return (
          <div
            key={index}
            className="absolute bg-gray-800 p-4 rounded-lg shadow-lg overflow-hidden"
            style={{
              width: '100px',
              height: '100px',
              transform: `translate(${position.x}px, ${position.y}px)`,
              transition: 'transform 0.5s ease-out'
            }}
          >
            {child}
          </div>
        );
      });
      setLayoutItems(newLayoutItems);
    };

    initializeLayout();
  }, [children]);

  useEffect(() => {
    const updatePositions = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const containerSize: ContainerSize = { width: containerRect.width, height: containerRect.height };
      const items = Array.from(container.children) as HTMLElement[];

      positionsRef.current = positionsRef.current.map((position, index) => {
        const updatedPosition = updatePosition(position, containerSize);
        const otherPositions = positionsRef.current.filter((_, i) => i !== index);
        const avoidedPosition = avoidCollision(updatedPosition, otherPositions, containerSize);

        items[index].style.transform = `translate(${avoidedPosition.x}px, ${avoidedPosition.y}px)`;

        return { ...updatedPosition, ...avoidedPosition };
      });

      animationRef.current = requestAnimationFrame(updatePositions);
    };

    animationRef.current = requestAnimationFrame(updatePositions);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[800px]"
    >
      {layoutItems}
    </div>
  );
}

