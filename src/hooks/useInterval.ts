import { useCallback } from "react";
import {
  SharedValue,
  useFrameCallback,
  useSharedValue,
} from "react-native-reanimated";

export function useInterval(cb: () => void, interval: SharedValue<number>) {
  const timeSinceLastCalled = useSharedValue(0);

  useFrameCallback((frameInfo) => {
    const timeSincePreviousFrame = frameInfo.timeSincePreviousFrame;
    if (!timeSincePreviousFrame) return;

    if (timeSinceLastCalled.value >= interval.value) {
      cb();
      timeSinceLastCalled.value = 0;
    } else {
      timeSinceLastCalled.value += timeSincePreviousFrame;
    }
  });

  const reset = useCallback(() => {
    "worklet";
    timeSinceLastCalled.value = 0;
  }, []);

  return { reset };
}
