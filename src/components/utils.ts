export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  vx: number;
  vy: number;
}

export interface ItemPosition extends Position, Velocity {}

export interface ContainerSize {
  width: number;
  height: number;
}

export function shuffleArray<T>(array: T[]): T[] {
  return array.sort(() => Math.random() - 0.5);
}

export function getRandomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function getRandomVelocity(maxSpeed: number): Velocity {
  const angle = getRandomFloat(0, 2 * Math.PI);
  const speed = getRandomFloat(0.5, maxSpeed);
  return {
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed
  };
}

export function avoidCollision(position: Position, otherPositions: Position[], containerSize: ContainerSize): Position {
  const minDistance = 120; // 最小距離（ピクセル）
  let { x, y } = position;

  otherPositions.forEach(otherPos => {
    const dx = x - otherPos.x;
    const dy = y - otherPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < minDistance) {
      const angle = Math.atan2(dy, dx);
      const pushDistance = (minDistance - distance) / 2;
      x += Math.cos(angle) * pushDistance;
      y += Math.sin(angle) * pushDistance;
    }
  });

  // コンテナ内に収める
  x = Math.max(0, Math.min(x, containerSize.width - 100));
  y = Math.max(0, Math.min(y, containerSize.height - 100));

  return { x, y };
}

export function updatePosition(position: ItemPosition, containerSize: ContainerSize): ItemPosition {
  let { x, y, vx, vy } = position;

  // 位置の更新
  x += vx;
  y += vy;

  // 壁との衝突判定
  if (x <= 0 || x >= containerSize.width - 100) {
    vx *= -0.8; // 減衰を加える
    x = Math.max(0, Math.min(x, containerSize.width - 100));
  }
  if (y <= 0 || y >= containerSize.height - 100) {
    vy *= -0.8; // 減衰を加える
    y = Math.max(0, Math.min(y, containerSize.height - 100));
  }

  // 速度の減衰
  vx *= 0.99;
  vy *= 0.99;

  // 最小速度を設定
  const minSpeed = 0.1;
  if (Math.abs(vx) < minSpeed && Math.abs(vy) < minSpeed) {
    const newVelocity = getRandomVelocity(1);
    vx = newVelocity.vx;
    vy = newVelocity.vy;
  }

  return { x, y, vx, vy };
}

