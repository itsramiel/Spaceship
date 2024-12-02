import { AppState } from "react-native";
import { useEffect, useRef } from "react";

/**
 * a hook that executes a passed callback when app goes from background to foreground state.
 * @param cb callback to execute
 */
export const useCallbackOnForegrounded = (cb: () => void) => {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.current === "background" && nextAppState === "active") {
        cb();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [cb]);
};
