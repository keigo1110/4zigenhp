// 動作パラメータの設定
const PHYSICS_PARAMS = {
  // 速度関連
  INITIAL_MAX_SPEED: 2,          // 初期最大速度
  MAX_SPEED: 4,                  // 最大速度の制限
  MIN_SPEED: 1.5,               // 最小速度
  FRICTION: 0.998,              // 摩擦係数（1に近いほど減衰が小さい）

  // 衝突関連
  MIN_DISTANCE: 180,            // オブジェクト間の最小距離
  REPULSION_FORCE: 5,           // 反発力の強さ
  REPULSION_POWER: 1.5,         // 反発力の減衰指数

  // 壁との相互作用
  WALL_FORCE: 7,                // 壁からの反発力
  WALL_DISTANCE: 70,            // 壁からの影響距離
  WALL_BOUNCE: 1.1,             // 壁での反射時の速度倍率
  WALL_RANDOM_MIN: -2,          // 壁での反射時のランダム力（最小）
  WALL_RANDOM_MAX: 2,           // 壁での反射時のランダム力（最大）

  // ランダム動作
  BROWNIAN_FORCE: 0.50,         // ブラウン運動の強さ
  RANDOM_FORCE: 1,              // 常時働くランダム力の最大値
  GRAVITY: 0.001,                // 上向きの疑似重力（正の値で上向き）

  // カードサイズ
  CARD_SIZE: 192                // カードの大きさ（ピクセル）
};

// 以下インターフェース定義
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
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function getRandomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function getRandomVelocity(maxSpeed: number): Velocity {
  const angle = getRandomFloat(0, 2 * Math.PI);
  const speed = getRandomFloat(maxSpeed * 0.7, maxSpeed);
  return {
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed
  };
}

export function avoidCollision(position: Position, otherPositions: Position[], containerSize: ContainerSize): Position {
  const { MIN_DISTANCE, REPULSION_FORCE, REPULSION_POWER, WALL_FORCE, WALL_DISTANCE, RANDOM_FORCE, CARD_SIZE } = PHYSICS_PARAMS;
  let { x, y } = position;
  let totalForceX = 0;
  let totalForceY = 0;

  otherPositions.forEach(otherPos => {
    const dx = x - otherPos.x;
    const dy = y - otherPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < MIN_DISTANCE && distance > 0) {
      const force = Math.pow((MIN_DISTANCE - distance) / MIN_DISTANCE, REPULSION_POWER) * REPULSION_FORCE;
      totalForceX += (dx / distance) * force;
      totalForceY += (dy / distance) * force;
    }
  });

  if (x < WALL_DISTANCE) totalForceX += WALL_FORCE * (1 - x / WALL_DISTANCE);
  if (x > containerSize.width - WALL_DISTANCE - CARD_SIZE) {
    totalForceX -= WALL_FORCE * (1 - (containerSize.width - x - CARD_SIZE) / WALL_DISTANCE);
  }
  if (y < WALL_DISTANCE) totalForceY += WALL_FORCE * (1 - y / WALL_DISTANCE);
  if (y > containerSize.height - WALL_DISTANCE - CARD_SIZE) {
    totalForceY -= WALL_FORCE * (1 - (containerSize.height - y - CARD_SIZE) / WALL_DISTANCE);
  }

  totalForceX += getRandomFloat(-RANDOM_FORCE, RANDOM_FORCE);
  totalForceY += getRandomFloat(-RANDOM_FORCE, RANDOM_FORCE);

  x += totalForceX;
  y += totalForceY;

  x = Math.max(0, Math.min(x, containerSize.width - CARD_SIZE));
  y = Math.max(0, Math.min(y, containerSize.height - CARD_SIZE));

  return { x, y };
}

export function updatePosition(position: ItemPosition, containerSize: ContainerSize, deltaTime: number): ItemPosition {
  const {
    FRICTION, BROWNIAN_FORCE, GRAVITY, MAX_SPEED, MIN_SPEED,
    WALL_BOUNCE, WALL_RANDOM_MIN, WALL_RANDOM_MAX, CARD_SIZE
  } = PHYSICS_PARAMS;

  const { x, y, vx, vy } = position;
  const normalizedDelta = Math.min(deltaTime, 2);

  let newVx = vx * Math.pow(FRICTION, normalizedDelta);
  let newVy = vy * Math.pow(FRICTION, normalizedDelta);

  const brownianDelta = BROWNIAN_FORCE * normalizedDelta;
  newVx += getRandomFloat(-brownianDelta, brownianDelta);
  newVy += getRandomFloat(-brownianDelta, brownianDelta);

  newVy -= GRAVITY;

  const speed = Math.sqrt(newVx * newVx + newVy * newVy);
  if (speed > MAX_SPEED) {
    newVx = (newVx / speed) * MAX_SPEED;
    newVy = (newVy / speed) * MAX_SPEED;
  }

  if (speed < MIN_SPEED) {
    const newVelocity = getRandomVelocity(4);
    newVx = newVelocity.vx;
    newVy = newVelocity.vy;
  }

  let newX = x + newVx * normalizedDelta;
  let newY = y + newVy * normalizedDelta;

  if (newX <= 0 || newX >= containerSize.width - CARD_SIZE) {
    newVx *= -WALL_BOUNCE;
    newX = Math.max(0, Math.min(newX, containerSize.width - CARD_SIZE));
    newVy += getRandomFloat(WALL_RANDOM_MIN, WALL_RANDOM_MAX);
  }
  if (newY <= 0 || newY >= containerSize.height - CARD_SIZE) {
    newVy *= -WALL_BOUNCE;
    newY = Math.max(0, Math.min(newY, containerSize.height - CARD_SIZE));
    newVx += getRandomFloat(WALL_RANDOM_MIN, WALL_RANDOM_MAX);
  }

  return { x: newX, y: newY, vx: newVx, vy: newVy };
}