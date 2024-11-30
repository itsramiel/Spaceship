import Animated, {
  FadeIn,
  FadeOut,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { StyleSheet, View } from "react-native";
import { Fragment, useEffect, useState } from "react";
import { playBeepSound } from "@/audio";

interface CountdownProps {
  onCountdownEnd: () => void;
}

export function Countdown({ onCountdownEnd }: CountdownProps) {
  const [countdown, setCountdown] = useState<number | null>(null);
  const progress = useSharedValue(0);

  const rStyle = useAnimatedStyle(() => {
    return {
      fontSize: 64,
      color: "white",
      fontWeight: "bold",
      transform: [{ scale: interpolate(progress.value, [0, 1], [1, 2]) }],
    };
  }, []);

  const onCountdownVisible = () => {
    playBeepSound();
  };

  const onCountdownScaled = (countdown: number) => {
    setCountdown(countdown - 1);
    if (countdown === 1) onCountdownEnd();
  };

  useEffect(() => {
    setCountdown(3);
  }, []);

  if (typeof countdown !== "number") return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {Array.from({ length: 3 }).map((_, i) => {
        const current = i + 1;
        return (
          <Fragment key={i}>
            {countdown === current ? (
              <Animated.Text
                style={rStyle}
                entering={FadeIn.delay(100).withCallback(() => {
                  runOnJS(onCountdownVisible)();
                  progress.value = withTiming(1, { duration: 500 }, () => {
                    progress.value = withTiming(0);
                    runOnJS(onCountdownScaled)(countdown);
                  });
                })}
                exiting={FadeOut}
              >
                {current}
              </Animated.Text>
            ) : null}
          </Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
