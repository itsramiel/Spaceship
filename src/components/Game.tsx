import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
} from "react-native-reanimated";
import {
  Canvas,
  Group,
  Image,
  SkRect,
  Transforms3d,
  clamp,
  useImage,
} from "@shopify/react-native-skia";
import { useSetAtom } from "jotai";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

import { Shots } from "./Shots";
import { Stars } from "./Stars";
import { Enemies } from "./Enemies";
import { Joystick } from "./Joystick";
import { ShootButton } from "./ShootButton";
import { TEnemy, TRectSize, TShot, TStar } from "../types";
import {
  CONITNUOUS_SHOOTING_RATE as CONTINUOUS_SHOOTING_RATE,
  SHOT_LENGTH,
  SHOT_STROKE_WIDTH,
  SPACESHIP_IMAGE_HEIGHT,
  SPACESHIP_IMAGE_WIDTH,
  SPACESHIP_START_PADDING,
} from "../theme";
import { Score, scoreAtom } from "./Score";
import { areRectsIntersecting } from "../utils";
import { PlayView } from "./PlayView";
import { useState } from "react";
import { Countdown } from "./Countdown";

const ENEMY_SPEED = 1 / 16; // 1 point per 16 milliseconds
const SHOT_SPEED = 3 / 16; // 3 points per 16 milliseconds

const JOYSTICK_PADDING_HORIZONTAL = 4;
const JOYSTICK_PADDING_VERTICAL = 4;

const SHOOT_BUTTON_PADDING_RIGHT = 48;
const CONSTANT_SHOOTING_INTERVAL = 100;

export function Game() {
  const [isStartGameModalDisplayed, setIsStartGameModalDisplayed] =
    useState(true);
  const [isCountdownDisplayed, setIsCountdownDisplayed] = useState(false);
  const isPlaying = useSharedValue(false);
  const setScore = useSetAtom(scoreAtom);

  function incrementScore() {
    setScore((prevScore) => prevScore + 1);
  }

  const size = useSharedValue({ width: 0, height: 0 });
  const stars = useSharedValue<Array<TStar>>([]);
  const enemies = useSharedValue<Array<TEnemy>>([]);

  const joystickSize = useDerivedValue(() => {
    return size.value.height / 3;
  }, []);

  const continuousShootingRate = useSharedValue(CONTINUOUS_SHOOTING_RATE);

  const shootButtonSize = useDerivedValue(() => {
    return size.value.height / 4;
  }, []);

  const shootButtonTransform = useDerivedValue((): Transforms3d => {
    return [
      {
        translateX:
          size.value.width -
          shootButtonSize.value / 2 -
          SHOOT_BUTTON_PADDING_RIGHT,
      },
      {
        translateY: size.value.height - joystickSize.value / 2,
      },
    ];
  }, []);

  const shootButtonViewStyle = useAnimatedStyle(() => {
    return {
      position: "absolute",
      top: -shootButtonSize.value / 2,
      left: -shootButtonSize.value / 2,
      width: shootButtonSize.value,
      height: shootButtonSize.value,
      borderRadius: shootButtonSize.value / 2,
      backgroundColor: "transparent",
      transform: [
        {
          translateX:
            size.value.width -
            shootButtonSize.value / 2 -
            SHOOT_BUTTON_PADDING_RIGHT,
        },
        {
          translateY: size.value.height - joystickSize.value / 2,
        },
      ],
    };
  }, []);

  const joystickGestureViewStyle = useAnimatedStyle(() => {
    return {
      position: "absolute",
      top: -joystickSize.value / 2,
      left: -joystickSize.value / 2,
      width: joystickSize.value,
      height: joystickSize.value,
      borderRadius: joystickSize.value / 2,
      backgroundColor: "transparent",
      transform: [
        { translateX: JOYSTICK_PADDING_HORIZONTAL + joystickSize.value / 2 },
        {
          translateY:
            size.value.height -
            joystickSize.value / 2 -
            JOYSTICK_PADDING_VERTICAL,
        },
      ],
    };
  }, []);

  const joystickTransform = useDerivedValue((): Transforms3d => {
    return [
      { translateX: JOYSTICK_PADDING_HORIZONTAL + joystickSize.value / 2 },
      {
        translateY:
          size.value.height -
          joystickSize.value / 2 -
          JOYSTICK_PADDING_VERTICAL,
      },
    ];
  }, []);

  const panValue = useSharedValue({ x: 0, y: 0 });

  const spaceshipImage = useImage(require("../../assets/rocket.png"));

  const spaceshipHeight = useDerivedValue(() => {
    return 0.1 * size.value.width;
  }, []);

  const spaceshipWidth = useDerivedValue(() => {
    const aspectRatio = SPACESHIP_IMAGE_WIDTH / SPACESHIP_IMAGE_HEIGHT;

    return aspectRatio * spaceshipHeight.value;
  }, []);

  const spaceshipX = useDerivedValue(() => {
    return SPACESHIP_START_PADDING + panValue.value.x;
  }, []);

  const spaceshipY = useDerivedValue(() => {
    return size.value.height / 2 - spaceshipHeight.value / 2 + panValue.value.y;
  }, []);

  const spaceshipPanTransform = useDerivedValue((): Transforms3d => {
    return [{ translateX: spaceshipX.value }, { translateY: spaceshipY.value }];
  }, []);

  const gesture = Gesture.Pan()
    .minDistance(0)
    .onChange((e) => {
      panValue.value = {
        x: clamp(
          panValue.value.x + e.changeX,
          -SPACESHIP_START_PADDING,
          size.value.width - spaceshipWidth.value - SPACESHIP_START_PADDING,
        ),
        y: clamp(
          panValue.value.y + e.changeY,
          -(size.value.height / 2),
          size.value.height / 2,
        ),
      };
    });

  const shots = useSharedValue<Array<TShot>>([]);
  const isLongPressShooting = useSharedValue(false);
  const msLastShotCreated = useSharedValue(0);

  function createShot() {
    "worklet";
    return {
      x: spaceshipWidth.value + SPACESHIP_START_PADDING + panValue.value.x,
      y: size.value.height / 2 + panValue.value.y,
    };
  }

  const shootButtonGesture = Gesture.Exclusive(
    Gesture.Tap()
      .maxDuration(250)
      .onStart(() => {
        shots.modify((value) => {
          value.push(createShot());

          return value;
        });
      }),
    Gesture.LongPress()
      .minDuration(250)
      .onStart(() => {
        isLongPressShooting.value = true;
        msLastShotCreated.value = CONSTANT_SHOOTING_INTERVAL;
      })
      .onEnd(() => {
        isLongPressShooting.value = false;
      }),
  );

  // Continuously move enemies, shots
  useFrameCallback((frameInfo) => {
    if (!frameInfo.timeSincePreviousFrame || !isPlaying.value) return;

    const inFrameEnemies = Array<TEnemy>();

    for (const enemy of enemies.value) {
      if (enemy.x < -enemy.size / 2) continue;
      enemy.x -= frameInfo.timeSincePreviousFrame * ENEMY_SPEED;
      inFrameEnemies.push(enemy);
    }

    const inFrameShots = Array<TShot>();

    for (const shot of shots.value) {
      if (shot.x > size.value.width) continue;
      shot.x += frameInfo.timeSincePreviousFrame * SHOT_SPEED;
      inFrameShots.push(shot);
    }

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
        runOnJS(incrementScore)();
      }
    }

    if (isLongPressShooting.value) {
      if (continuousShootingRate.value > 0) {
        if (msLastShotCreated.value >= CONSTANT_SHOOTING_INTERVAL) {
          newShots.push(createShot());
          msLastShotCreated.value = 0;
        } else {
          msLastShotCreated.value += frameInfo.timeSincePreviousFrame;
        }

        continuousShootingRate.value = Math.max(
          continuousShootingRate.value - frameInfo.timeSincePreviousFrame,
          0,
        );
      }
    } else {
      continuousShootingRate.value = Math.min(
        continuousShootingRate.value + 1.5 * frameInfo.timeSincePreviousFrame,
        CONTINUOUS_SHOOTING_RATE,
      );
    }

    enemies.value = newEnemies;
    shots.value = newShots;

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
    rects.push({ x: -1, y: 0, width: 1, height: size.value.height });

    for (const enemy of newEnemies) {
      for (const rect of rects) {
        const didEnemyHitSpaceShip = areRectsIntersecting(rect, {
          x: enemy.x,
          y: enemy.y,
          width: enemy.size,
          height: enemy.size,
        });
        if (didEnemyHitSpaceShip) {
          isPlaying.value = false;
          break;
        }
      }
    }
  });

  return (
    <View style={styles.screen}>
      <Canvas style={styles.canvas} onSize={size}>
        <Stars stars={stars} canvasSize={size} />
        <Group transform={spaceshipPanTransform}>
          <Image
            x={0}
            y={0}
            image={spaceshipImage}
            width={spaceshipWidth}
            height={spaceshipHeight}
          />
        </Group>
        <Group transform={joystickTransform}>
          <Joystick size={joystickSize} />
        </Group>
        <Enemies enemies={enemies} canvasSize={size} />
        <Group transform={shootButtonTransform}>
          <ShootButton
            size={shootButtonSize}
            continuousShootingRate={continuousShootingRate}
          />
        </Group>
        <Shots shots={shots} />
      </Canvas>
      <GestureDetector gesture={gesture}>
        <Animated.View style={joystickGestureViewStyle} />
      </GestureDetector>
      <GestureDetector gesture={shootButtonGesture}>
        <Animated.View style={shootButtonViewStyle} />
      </GestureDetector>
      <Score />
      {isStartGameModalDisplayed ? (
        <PlayView
          onStartGame={() => {
            setIsStartGameModalDisplayed(false);
            setTimeout(() => {
              setIsCountdownDisplayed(true);
            }, 200);
          }}
        />
      ) : null}
      {isCountdownDisplayed ? (
        <Countdown
          onCountdownEnd={() => {
            isPlaying.value = true;
          }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  canvas: {
    flex: 1,
  },
});
