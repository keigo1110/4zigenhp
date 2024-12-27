'use client';

import React, { useState, useEffect, useRef } from 'react';
import { shuffleArray, getRandomFloat, getRandomVelocity, avoidCollision, updatePosition, ItemPosition, ContainerSize } from './utils';

interface HighlightInfo {
  id: number;
  type: 'artwork' | 'member' | 'media';
}

interface DynamicLayoutProps {
  children: React.ReactNode[];
  searchHighlightInfo?: HighlightInfo | null;
}

export default function DynamicLayout({ children, searchHighlightInfo }: DynamicLayoutProps) {
  const [layoutItems, setLayoutItems] = useState<React.ReactNode[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const positionsRef = useRef<ItemPosition[]>([]);
  const animationRef = useRef<number>();

  const getItemInfo = (child: React.ReactNode): { id: number; type: 'artwork' | 'member' | 'title' } | null => {
    if (React.isValidElement(child)) {
      if (child.type === 'div' && child.props.className?.includes('text-xl')) {
        return { id: -1, type: 'title' };
      }
      if (child.props.type === 'artwork' || child.props.type === 'member') {
        return {
          id: child.props.data.id,
          type: child.props.type
        };
      }
    }
    return null;
  };

  useEffect(() => {
    const initializeLayout = () => {
      const shuffledChildren = shuffleArray(children);
      const containerRect = containerRef.current?.getBoundingClientRect();
      const containerWidth = containerRect?.width || 800;
      const containerHeight = containerRect?.height || 600;

      positionsRef.current = shuffledChildren.map(() => ({
        x: getRandomFloat(0, containerWidth - 150),
        y: getRandomFloat(0, containerHeight - 150),
        ...getRandomVelocity(3)
      }));

      updateLayoutItems();
    };

    const updateLayoutItems = () => {
      const newLayoutItems = children.map((child, index) => (
        <div
          key={index}
          className="absolute w-36 md:w-48 h-36 md:h-48"
          style={{
            transform: `translate(${positionsRef.current[index].x}px, ${positionsRef.current[index].y}px)`,
            transition: searchHighlightInfo !== null ? 'all 0.5s ease-out' : 'none',
          }}
        >
          {child}
        </div>
      ));
      setLayoutItems(newLayoutItems);
    };

    initializeLayout();

    const handleResize = () => {
      initializeLayout();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [children, searchHighlightInfo]);

  useEffect(() => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const centerX = containerRect.width / 2 - 75;
    const centerY = containerRect.height / 2 - 75;

    positionsRef.current = positionsRef.current.map((position, index) => {
      const itemInfo = getItemInfo(children[index]);

      if (searchHighlightInfo !== null && itemInfo) {
        const matches = searchHighlightInfo !== null && searchHighlightInfo !== undefined &&
                       itemInfo.id === searchHighlightInfo.id &&
                       itemInfo.type === searchHighlightInfo.type;
        if (matches) {
          return {
            ...position,
            x: centerX,
            y: centerY,
            vx: 0,
            vy: 0
          };
        } else if (itemInfo.type !== 'title') {
          const angle = Math.random() * Math.PI * 2;
          const distance = 1000;
          return {
            ...position,
            x: centerX + Math.cos(angle) * distance,
            y: centerY + Math.sin(angle) * distance,
            vx: 0,
            vy: 0
          };
        }
      }
      return position;
    });

    const newLayoutItems = children.map((child, index) => {
      const itemInfo = getItemInfo(child);
      const position = positionsRef.current[index];

      return (
        <div
          key={index}
          className="absolute w-36 md:w-48 h-36 md:h-48"
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            transition: 'all 0.5s ease-out',
            opacity: searchHighlightInfo === null ||
                    !itemInfo ||
                    itemInfo.type === 'title' ||
                    (itemInfo.id === (searchHighlightInfo?.id ?? -1) &&
                     itemInfo.type === (searchHighlightInfo?.type ?? '')) ? 1 : 0,
            pointerEvents: searchHighlightInfo === null ||
                          !itemInfo ||
                          itemInfo.type === 'title' ||
                          (itemInfo.id === (searchHighlightInfo?.id ?? -1) &&
                           itemInfo.type === (searchHighlightInfo?.type ?? '')) ? 'auto' : 'none',
          }}
        >
          {child}
        </div>
      );
    });

    setLayoutItems(newLayoutItems);
  }, [searchHighlightInfo, children]);

  useEffect(() => {
    if (searchHighlightInfo !== null) return;

    let lastTime = performance.now();

    const updatePositions = (currentTime: number) => {
      const container = containerRef.current;
      if (!container) return;

      const deltaTime = (currentTime - lastTime) / 16;
      lastTime = currentTime;

      const containerRect = container.getBoundingClientRect();
      const containerSize: ContainerSize = {
        width: containerRect.width,
        height: containerRect.height
      };

      positionsRef.current = positionsRef.current.map((position) => {
        const updatedPosition = updatePosition(position, containerSize, deltaTime);
        const otherPositions = positionsRef.current.filter((_, i) => i !== positionsRef.current.indexOf(position));
        const avoidedPosition = avoidCollision(updatedPosition, otherPositions, containerSize);

        return {
          ...updatedPosition,
          x: avoidedPosition.x,
          y: avoidedPosition.y
        };
      });

      setLayoutItems(children.map((child, index) => (
        <div
          key={index}
          className="absolute w-36 md:w-48 h-36 md:h-48"
          style={{
            transform: `translate(${positionsRef.current[index].x}px, ${positionsRef.current[index].y}px)`,
            transition: 'none',
          }}
        >
          {child}
        </div>
      )));

      animationRef.current = requestAnimationFrame(updatePositions);
    };

    animationRef.current = requestAnimationFrame(updatePositions);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [searchHighlightInfo, children]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[500px] md:h-[800px] overflow-hidden"
    >
      {layoutItems}
    </div>
  );
}