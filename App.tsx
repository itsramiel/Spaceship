import { LogBox } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Navigation } from "./src/navigation";
import { Playground } from "./src/components/Playground";
import { DefaultTheme, Theme } from "@react-navigation/native";
import { COLORS } from "@/config";

// I am aware of the consequences of this issue but I pass non-serializable
// values to screens I will never deep link to so it is fine
LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

const theme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS["neutral/950"],
    card: COLORS["neutral/950"],
    text: COLORS.white,
    primary: COLORS.white,
  },
};

function App() {
  const renderGame = true;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {renderGame ? <Navigation theme={theme} /> : <Playground />}
    </GestureHandlerRootView>
  );
}

export default App;
