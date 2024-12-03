import {
  SharedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useInterval } from "./useInterval";
import { useCallback } from "react";
import { GameState } from "@/screens/GameScreen/constants";

const INITIAL_STARS_SPEED = 1 / 160; // 1 point per 160 milliseconds
const INITIAL_SHOT_SPEED = 3 / 16; // 3 points per 16 milliseconds
const INITIAL_ENEMY_SPEED = 1 / 16; // 1 point per 16 milliseconds
const INITIAL_ENEMY_CREATION_INTERVAL = 1000; // 1 enemy per second

export function useGameConfigSharedValues(gameState: SharedValue<GameState>) {
  const enemySpeed = useSharedValue(INITIAL_ENEMY_SPEED);
  const shotSpeed = useSharedValue(INITIAL_SHOT_SPEED);
  const starsSpeed = useSharedValue(INITIAL_STARS_SPEED);
  const enemyCreationInterval = useSharedValue(INITIAL_ENEMY_CREATION_INTERVAL); // 1 enemy per second

  const speedUpInterval = useSharedValue(5000); // speed up every 5 seconds

  const { reset } = useInterval(() => {
    "worklet";
    if (gameState.get() !== GameState.Playing) return;

    starsSpeed.value = withTiming(starsSpeed.value * 1.1);
    enemySpeed.value = withTiming(enemySpeed.value * 1.1); // 1 point per 16 milliseconds
    enemyCreationInterval.value = enemyCreationInterval.value * 0.9;
  }, speedUpInterval);

  const onResetConfig = useCallback(() => {
    "worklet";

    enemySpeed.value = INITIAL_ENEMY_SPEED;
    shotSpeed.value = INITIAL_SHOT_SPEED;
    starsSpeed.value = INITIAL_STARS_SPEED;
    enemyCreationInterval.value = INITIAL_ENEMY_CREATION_INTERVAL;
    reset();
  }, [reset]);

  return {
    enemySpeed,
    shotSpeed,
    starsSpeed,
    enemyCreationInterval,
    onResetConfig,
  };
}
