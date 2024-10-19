import { LogBox } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Navigation } from "./src/navigation";
import { Playground } from "./src/components/Playground";

// I am aware of the consequences of this issue but I pass non-serializable
// values to screens I will never deep link to so it is fine
LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

function App() {
  const renderGame = true;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {renderGame ? <Navigation /> : <Playground />}
    </GestureHandlerRootView>
  );
}

export default App;
