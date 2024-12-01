import React, {
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { StyleSheet } from "react-native";
import Animated, { FadeOut, runOnJS, ZoomIn } from "react-native-reanimated";

import { playBeepSound } from "@/audio";

interface CountdownMethods {
  startCountdown: () => void;
}

interface CountdownProps {
  onCountdownEnd: () => void;
}

export const Countdown = React.forwardRef<CountdownMethods, CountdownProps>(
  (props, ref) => {
    const [currentCountdown, setCurrentCountdown] = useState<number | null>(
      null,
    );
    const nextCountdown = useRef<null | number>(null);

    const startCountdown = useCallback(() => {
      console.log("startCountdown called");
      setCurrentCountdown(3);
      nextCountdown.current = null;
    }, []);

    useImperativeHandle(ref, () => ({
      startCountdown: startCountdown,
    }));

    const onCountdownEntered = useCallback(() => {
      if (typeof currentCountdown !== "number") return;

      playBeepSound();
      if (currentCountdown === 1) {
        props.onCountdownEnd();
        nextCountdown.current = null;
        setCurrentCountdown(null);
        return;
      }

      nextCountdown.current = currentCountdown - 1;
      setCurrentCountdown(null);
    }, [currentCountdown, props.onCountdownEnd]);

    const onCountdownEnteredWorkletized = useCallback(() => {
      "worklet";
      runOnJS(onCountdownEntered)();
    }, [onCountdownEntered]);

    const onCountdownExited = useCallback(() => {
      if (typeof nextCountdown.current !== "number") return;

      setCurrentCountdown(nextCountdown.current);
      nextCountdown.current = null;
    }, []);

    const onCountdownExitedWorkletized = useCallback(() => {
      "worklet";
      runOnJS(onCountdownExited)();
    }, [onCountdownExited]);

    if (typeof currentCountdown !== "number") return null;

    return (
      <Animated.Text
        entering={ZoomIn.duration(600).withCallback(
          onCountdownEnteredWorkletized,
        )}
        exiting={FadeOut.withCallback(onCountdownExitedWorkletized)}
        style={styles.text}
      >
        {currentCountdown}
      </Animated.Text>
    );
  },
);

const styles = StyleSheet.create({
  text: {
    color: "white",
    fontSize: 96,
    fontWeight: "bold",
  },
});
