import { useSharedValue } from "react-native-reanimated";

export function useGameConfigSharedValues() {
  const enemySpeed = useSharedValue(1 / 16); // 1 point per 16 milliseconds
  const shotSpeed = useSharedValue(3 / 16); // 3 points per 16 milliseconds
  const starsSpeed = useSharedValue(1 / 160); // 1 point per 160 milliseconds

  const enemyCreationInterval = useSharedValue(1000); // 1 enemy per second

  return { enemySpeed, shotSpeed, starsSpeed, enemyCreationInterval };
}
