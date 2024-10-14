import {
  runOnJS,
  SharedValue,
  useFrameCallback,
  useSharedValue,
} from "react-native-reanimated";
import { TEnemy, TGameInfo, TRectSize, TShot, TStar } from "../types";
import {
  CONSTANT_SHOOTING_INTERVAL,
  CONTINUOUS_SHOOTING_RATE,
  SHOT_LENGTH,
  SHOT_STROKE_WIDTH,
} from "../config";
import { SkRect } from "@shopify/react-native-skia";
import { areRectsIntersecting } from "../utils";
import { ENEMY_SIZE } from "../config";

type TUseGlobalFrameCallbackArgs = {
  // canvas
  canvasSize: SharedValue<TRectSize>;
  // stars
  stars: SharedValue<Array<TStar>>;
  starsSpeed: SharedValue<number>;
  // spaceship
  spaceshipWidth: SharedValue<number>;
  spaceshipHeight: SharedValue<number>;
  spaceshipX: SharedValue<number>;
  spaceshipY: SharedValue<number>;
  // enemies
  enemies: SharedValue<Array<TEnemy>>;
  enemySpeed: SharedValue<number>;
  enemyCreationInterval: SharedValue<number>;
  // shots
  shotSpeed: SharedValue<number>;
  shots: SharedValue<Array<TShot>>;
  isLongPressShooting: SharedValue<boolean>;
  continuousShootingRate: SharedValue<number>;
  msLastShotCreated: SharedValue<number>;
  createShot: () => TShot;
  // game state
  gameInfo: SharedValue<TGameInfo>;
  onScoreIncrement: () => void;
};
export function useGlobalFrameCallback({
  // canvas
  canvasSize,
  // stars
  stars,
  starsSpeed,
  // spaceship
  spaceshipWidth,
  spaceshipHeight,
  spaceshipX,
  spaceshipY,
  // enemies
  enemies,
  enemySpeed,
  enemyCreationInterval,
  // shots
  shotSpeed,
  shots,
  isLongPressShooting,
  continuousShootingRate,
  msLastShotCreated,
  createShot,
  // game state
  gameInfo,
  onScoreIncrement,
}: TUseGlobalFrameCallbackArgs) {
  const msLastEnemyCreated = useSharedValue(0);

  useFrameCallback((frameInfo) => {
    if (!frameInfo.timeSincePreviousFrame || !gameInfo.value.isPlaying) return;
    const timeSincePreviousFrame = frameInfo.timeSincePreviousFrame;

    // Filter out of bounds enemies
    const inFrameEnemies = Array<TEnemy>();

    for (const enemy of enemies.value) {
      if (enemy.x < -enemy.size / 2) continue;
      enemy.x -= timeSincePreviousFrame * enemySpeed.value;
      inFrameEnemies.push(enemy);
    }

    // Filter out of bounds shots
    const inFrameShots = Array<TShot>();

    for (const shot of shots.value) {
      if (shot.x > canvasSize.value.width) continue;
      shot.x += timeSincePreviousFrame * shotSpeed.value;
      inFrameShots.push(shot);
    }

    // Remove shots and enemeits that collided
    const newEnemies = Array<TEnemy>();
    let intermediateShots = Array<TShot>();
    let newShots = inFrameShots;

    for (let i = 0; i < inFrameEnemies.length; i++) {
      const enemy = inFrameEnemies[i];

      let isEnemyDead = false;
      for (const shot of newShots) {
        if (isEnemyDead) {
          intermediateShots.push(shot);
          continue;
        }

        const shotEndX = shot.x + SHOT_LENGTH + SHOT_STROKE_WIDTH / 2;
        const shotStartY = shot.y - SHOT_STROKE_WIDTH / 2;
        const shotEndY = shot.y + SHOT_STROKE_WIDTH / 2;

        const enemyStartX = enemy.x;
        const enemyEndX = enemy.x + enemy.size;
        const enemyStartY = enemy.y;
        const enemyEndY = enemy.y + enemy.size;

        const didShotHitEnemy =
          shotEndX >= enemyStartX &&
          shotEndX <= enemyEndX &&
          ((shotEndY <= enemyStartY && shotEndY >= enemyEndY) ||
            (shotStartY >= enemyStartY && shotStartY <= enemyEndY));
        isEnemyDead = didShotHitEnemy;

        if (!didShotHitEnemy) {
          intermediateShots.push(shot);
        }
      }
      newShots = intermediateShots;
      intermediateShots = [];

      if (!isEnemyDead) {
        newEnemies.push(enemy);
      } else {
        runOnJS(onScoreIncrement)();
      }
    }

    // Create shots if user is and can long press shoot
    if (isLongPressShooting.value) {
      if (continuousShootingRate.value > 0) {
        if (msLastShotCreated.value >= CONSTANT_SHOOTING_INTERVAL) {
          newShots.push(createShot());
          msLastShotCreated.value = 0;
        } else {
          msLastShotCreated.value += timeSincePreviousFrame;
        }

        continuousShootingRate.value = Math.max(
          continuousShootingRate.value - timeSincePreviousFrame,
          0,
        );
      }
    } else {
      continuousShootingRate.value = Math.min(
        continuousShootingRate.value + 1.5 * timeSincePreviousFrame,
        CONTINUOUS_SHOOTING_RATE,
      );
    }

    // update enemies and shots shared values from above operations
    enemies.value = newEnemies;
    shots.value = newShots;

    // Create rects to shape the spaceship
    const rectSizes: Array<TRectSize> = [
      { width: 0.2, height: 1 },
      { width: 0.6, height: 0.6 },
      { width: 0.2, height: 0.2 },
    ];

    const rects = new Array<SkRect>();
    for (let i = 0; i < rectSizes.length; i++) {
      const rectSize = rectSizes[i];

      const width = rectSize.width * spaceshipWidth.value;
      const height = rectSize.height * spaceshipHeight.value;

      const rect: SkRect = {
        width: width,
        height: height,
        x:
          spaceshipX.value +
          rects.slice(0, i).reduce((acc, curr) => acc + curr.width, 0),
        y: spaceshipY.value + (spaceshipHeight.value / 2 - height / 2),
      };

      rects.push(rect);
    }
    // Check if enemy reached leftmost edge of screen
    rects.push({ x: -1, y: 0, width: 1, height: canvasSize.value.height });

    // check if enemy hit collides with any of the rects(either bumpres to spaceship or reached edge)
    for (const enemy of newEnemies) {
      for (const rect of rects) {
        const didEnemyHitSpaceShip = areRectsIntersecting(rect, {
          x: enemy.x,
          y: enemy.y,
          width: enemy.size,
          height: enemy.size,
        });
        if (didEnemyHitSpaceShip) {
          gameInfo.value = { isPlaying: false, didLose: true };
          break;
        }
      }
    }

    // Move the stars forward or restart them
    stars.value = stars.value.map((star) => {
      if (isOutOfBounds(star)) {
        return {
          x: canvasSize.value.width + star.size / 2,
          y:
            star.size / 2 +
            Math.random() * (canvasSize.value.width - star.size / 2),
          size: star.size,
        };
      } else {
        star.x -= timeSincePreviousFrame * starsSpeed.value;
        return star;
      }
    });

    if (msLastEnemyCreated.value >= enemyCreationInterval.value) {
      enemies.modify((value) => {
        "worklet";
        const enemySize =
          (Math.random() * ENEMY_SIZE) / 4 + (ENEMY_SIZE * 3) / 4;

        value.push({
          x: canvasSize.value.width + enemySize / 2,
          y: Math.random() * (canvasSize.value.height - enemySize),
          size: enemySize,
          type: Math.floor(Math.random() * 4),
        });

        return value;
      });

      msLastEnemyCreated.value = 0;
    } else {
      msLastEnemyCreated.value += frameInfo.timeSincePreviousFrame;
    }
  });
}

function isOutOfBounds(star: TStar) {
  "worklet";
  return star.x < -star.size / 2;
}
