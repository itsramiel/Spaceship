import { AppState } from "react-native";
import { useEffect, useRef } from "react";

/**
 * a hook that executes a passed callback when app goes background state.
 * @param cb callback to execute
 */
export const useCallbackOnBackgrounded = (cb: () => void) => {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.current !== "background" && nextAppState === "background") {
        cb();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [cb]);
};
