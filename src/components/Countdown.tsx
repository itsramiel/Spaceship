import { Fragment, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface CountdownProps {
  countdown: number | null;
}

export function Countdown({ countdown }: CountdownProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = 0;
    if (typeof countdown === "number") {
      progress.value = withTiming(1, { duration: 3000 });
    }
  }, [countdown]);

  const rStyle = useAnimatedStyle(() => {
    return {
      fontSize: interpolate(progress.value, [0, 1], [64, 128]),
      color: "white",
      fontWeight: "bold",
    };
  }, []);

  return (
    <View style={styles.container} pointerEvents="none">
      {Array.from({ length: 3 }).map((_, i) => {
        const current = i + 1;
        return (
          <Fragment key={i}>
            {countdown === current ? (
              <Animated.Text style={rStyle} entering={FadeIn} exiting={FadeOut}>
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
