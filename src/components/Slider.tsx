import Animated, {
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useLayoutEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

import { COLORS } from "@/config";

const SLIDER_HEIGHT = 24;

const THUMB_SIZE = SLIDER_HEIGHT * 1.4;
const THUMB_BORDER_WIDTH = 4;

interface SliderProps {
  minValue: number;
  maxValue: number;
  initialValue: number;
  onChange: (value: number) => void;
}

export function Slider({
  initialValue,
  minValue,
  maxValue,
  onChange,
}: SliderProps) {
  const containerRef = useRef<View>(null);
  const containerWidth = useSharedValue(0);
  const progress = useSharedValue(
    (initialValue - minValue) / (maxValue - minValue),
  );

  useAnimatedReaction(
    () => progress.get(),
    (value) => {
      runOnJS(onChange)(value * (maxValue - minValue) + minValue);
    },
    [],
  );

  useLayoutEffect(() => {
    containerRef.current?.measureInWindow((_, __, width) => {
      containerWidth.set(width);
    });
  }, []);

  const thumbStyles = useAnimatedStyle(() => {
    const offset = interpolate(
      progress.get(),
      [0, 1],
      [0, containerWidth.get()],
    );

    return {
      position: "absolute",
      width: THUMB_SIZE,
      height: THUMB_SIZE,
      borderRadius: THUMB_SIZE / 2,
      backgroundColor: "green",
      borderColor: "green",
      transform: [
        {
          translateX: -THUMB_SIZE / 2 + offset,
        },
      ],
    };
  });

  const animatedShadowStyles = useAnimatedStyle(() => ({
    position: "absolute",
    bottom: -THUMB_BORDER_WIDTH / 2,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: COLORS["red/600"],
  }));

  const animatedBackgroundStyles = useAnimatedStyle(() => ({
    position: "absolute",
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: COLORS["neutral/950"],
    borderWidth: THUMB_BORDER_WIDTH,
    borderColor: COLORS["red/500"],
  }));

  const gesture = Gesture.Pan()
    .minDistance(0)
    .onChange((e) => {
      progress.set(
        clamp(progress.get() + e.changeX / containerWidth.get(), 0, 1),
      );
    });

  const progressBarStyles = useAnimatedStyle(() => {
    return {
      position: "absolute",
      left: 0,
      top: 0,
      borderRadius: SLIDER_HEIGHT / 2,
      height: SLIDER_HEIGHT,
      backgroundColor: COLORS["red/500"],
      width: progress.get() * containerWidth.get(),
    };
  }, []);

  return (
    <View ref={containerRef} style={styles.container}>
      <Animated.View style={progressBarStyles} />
      <GestureDetector gesture={gesture}>
        <Animated.View style={thumbStyles}>
          <Animated.View style={animatedShadowStyles} />
          <Animated.View style={animatedBackgroundStyles} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: SLIDER_HEIGHT,
    borderRadius: SLIDER_HEIGHT / 2,
    backgroundColor: COLORS["neutral/500"],
    justifyContent: "center",
  },
});

function clamp(value: number, min: number, max: number) {
  "worklet";
  return Math.min(Math.max(value, min), max);
}
