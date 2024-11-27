import Animated, {
  Easing,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
  WithTimingConfig,
} from "react-native-reanimated";
import {
  Canvas,
  Group,
  Image,
  Transforms3d,
  clamp,
  useImage,
} from "@shopify/react-native-skia";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

import { TEnemy, TGameInfo, TShot, TStar } from "../types";
import {
  CONSTANT_SHOOTING_INTERVAL,
  CONTINUOUS_SHOOTING_RATE as CONTINUOUS_SHOOTING_RATE,
  SPACESHIP_IMAGE_HEIGHT,
  SPACESHIP_IMAGE_WIDTH,
  SPACESHIP_START_PADDING,
} from "../config";
import { useGameConfigSharedValues, useGlobalFrameCallback } from "../hooks";
import { scoreStoreActions, useScoreStore } from "../stores";
import {
  Countdown,
  Enemies,
  Joystick,
  Score,
  SharedValuesProvider,
  ShootButton,
  Shots,
  Stars,
} from "./GameScreen/components";
import { NetworkManager } from "@/managers";
import { audioPlayers } from "@/audio";

const JOYSTICK_PADDING_HORIZONTAL = 4;
const JOYSTICK_PADDING_VERTICAL = 4;

const SHOOT_BUTTON_PADDING_RIGHT = 48;

export function GameScreen() {
  const navigation = useNavigation();

  const [isCountdownDisplayed, setIsCountdownDisplayed] = useState(false);
  const gameInfo = useSharedValue<TGameInfo>({
    isPlaying: false,
  });

  const canvasSize = useSharedValue({ width: 0, height: 0 });
  const stars = useSharedValue<Array<TStar>>([]);
  const enemies = useSharedValue<Array<TEnemy>>([]);

  const joystickSize = useDerivedValue(() => {
    return canvasSize.value.height / 3;
  }, []);

  const continuousShootingRate = useSharedValue(CONTINUOUS_SHOOTING_RATE);

  const shootButtonSize = useDerivedValue(() => {
    return canvasSize.value.height / 4;
  }, []);

  const shootButtonTransform = useDerivedValue((): Transforms3d => {
    return [
      {
        translateX:
          canvasSize.value.width -
          shootButtonSize.value / 2 -
          SHOOT_BUTTON_PADDING_RIGHT,
      },
      {
        translateY: canvasSize.value.height - joystickSize.value / 2,
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
            canvasSize.value.width -
            shootButtonSize.value / 2 -
            SHOOT_BUTTON_PADDING_RIGHT,
        },
        {
          translateY: canvasSize.value.height - joystickSize.value / 2,
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
            canvasSize.value.height -
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
          canvasSize.value.height -
          joystickSize.value / 2 -
          JOYSTICK_PADDING_VERTICAL,
      },
    ];
  }, []);

  const panValueX = useSharedValue(0);
  const panValueY = useSharedValue(0);

  const spaceshipImage = useImage(require("../../assets/rocket.png"));

  const spaceshipHeight = useDerivedValue(() => {
    return 0.1 * canvasSize.value.width;
  }, []);

  const spaceshipWidth = useDerivedValue(() => {
    const aspectRatio = SPACESHIP_IMAGE_WIDTH / SPACESHIP_IMAGE_HEIGHT;

    return aspectRatio * spaceshipHeight.value;
  }, []);

  const spaceshipX = useDerivedValue(() => {
    return SPACESHIP_START_PADDING + panValueX.value;
  }, []);

  const spaceshipY = useDerivedValue(() => {
    return (
      canvasSize.value.height / 2 - spaceshipHeight.value / 2 + panValueY.value
    );
  }, []);

  const spaceshipPanTransform = useDerivedValue((): Transforms3d => {
    return [{ translateX: spaceshipX.value }, { translateY: spaceshipY.value }];
  }, []);

  const gesture = Gesture.Pan()
    .minDistance(0)
    .onChange((e) => {
      panValueX.value = clamp(
        panValueX.value + e.changeX,
        -SPACESHIP_START_PADDING,
        canvasSize.value.width - spaceshipWidth.value - SPACESHIP_START_PADDING,
      );
      panValueY.value = clamp(
        panValueY.value + e.changeY,
        -(canvasSize.value.height / 2),
        canvasSize.value.height / 2,
      );
    });

  const shots = useSharedValue<Array<TShot>>([]);
  const isLongPressShooting = useSharedValue(false);
  const msLastShotCreated = useSharedValue(0);

  function playShotSound() {
    audioPlayers.laserShotPlayer?.playSound();
  }

  function createShot() {
    "worklet";

    return {
      x: spaceshipWidth.value + SPACESHIP_START_PADDING + panValueX.value,
      y: canvasSize.value.height / 2 + panValueY.value,
    };
  }

  const shootButtonGesture = Gesture.Exclusive(
    Gesture.Tap()
      .maxDuration(250)
      .onStart(() => {
        runOnJS(playShotSound)();

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

  function onLonPressShootingStart() {
    audioPlayers.laserShotPlayer?.loopSound(true);
    audioPlayers.laserShotPlayer?.playSound();
  }

  function onLongPressShootingEnd() {
    audioPlayers.laserShotPlayer?.loopSound(false);
  }

  useAnimatedReaction(
    () => isLongPressShooting.get(),
    (value) => {
      if (value) {
        runOnJS(onLonPressShootingStart)();
      } else {
        runOnJS(onLongPressShootingEnd)();
      }
    },
  );

  const {
    starsSpeed,
    shotSpeed,
    enemySpeed,
    enemyCreationInterval,
    onResetConfig,
  } = useGameConfigSharedValues();

  useGlobalFrameCallback({
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
    onScoreIncrement: scoreStoreActions.incrementScore,
  });

  const onStartGame = useCallback(() => {
    // clear out the score
    scoreStoreActions.resetScore();

    enemies.value = [];
    shots.value = [];
    onResetConfig();

    const displayCountdown = () => {
      setTimeout(() => {
        setIsCountdownDisplayed(true);
      }, 200);
    };
    const config: WithTimingConfig = {
      duration: 1000,
      easing: Easing.inOut(Easing.ease),
    };
    panValueY.value = withDelay(300, withTiming(0, config));
    panValueX.value = withDelay(
      300,
      withTiming(0, config, () => {
        runOnJS(displayCountdown)();
      }),
    );
  }, [onResetConfig, setIsCountdownDisplayed]);

  useEffect(() => {
    onStartGame();
  }, []);

  const onGameOver = useCallback(() => {
    const score = useScoreStore.getState().state.latestScore;
    if (typeof score === "number") {
      NetworkManager.shared.sendScore(score);
    } else {
      // TODO: SENTRY
    }
    navigation.navigate("GameOver", {
      onPlayAgain: onStartGame,
    });
  }, [onStartGame]);

  useAnimatedReaction(
    () => gameInfo.value,
    (curr, prev) => {
      if (curr && prev && !curr.isPlaying && prev.isPlaying) {
        runOnJS(onGameOver)();
      }
    },
  );

  function onCountdownEnd() {
    setIsCountdownDisplayed(false);

    gameInfo.modify((value) => {
      "worklet";
      value.isPlaying = true;
      return value;
    });
  }

  return (
    <View style={styles.screen}>
      <Canvas style={styles.canvas} onSize={canvasSize}>
        <SharedValuesProvider gameInfo={gameInfo} canvasSize={canvasSize}>
          <Stars stars={stars} />
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
          <Enemies enemies={enemies} />
          <Group transform={shootButtonTransform}>
            <ShootButton
              size={shootButtonSize}
              continuousShootingRate={continuousShootingRate}
            />
          </Group>
          <Shots shots={shots} />
        </SharedValuesProvider>
      </Canvas>
      <GestureDetector gesture={gesture}>
        <Animated.View style={joystickGestureViewStyle} />
      </GestureDetector>
      <GestureDetector gesture={shootButtonGesture}>
        <Animated.View style={shootButtonViewStyle} />
      </GestureDetector>
      <Score />
      {isCountdownDisplayed ? (
        <Countdown onCountdownEnd={onCountdownEnd} />
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
