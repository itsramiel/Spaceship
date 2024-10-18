import React from "react";
import { SharedValue } from "react-native-reanimated";

type TSharedValuesContext = {
  gameInfo: SharedValue<
    { isPlaying: true } | { isPlaying: false; didLose: boolean }
  >;
  canvasSize: SharedValue<{ width: number; height: number }>;
};

const SharedValuesContext = React.createContext<TSharedValuesContext>(
  null as unknown as TSharedValuesContext,
);

interface SharedValuesProviderProps extends TSharedValuesContext {
  children: React.ReactNode;
}

export function SharedValuesProvider({
  children,
  ...props
}: SharedValuesProviderProps) {
  return (
    <SharedValuesContext.Provider value={props}>
      {children}
    </SharedValuesContext.Provider>
  );
}

export function useSharedValues() {
  const context = React.useContext(SharedValuesContext);
  if (context === null) {
    throw new Error(
      "useSharedValues must be used within a SharedValuesProvider",
    );
  }
  return context;
}
