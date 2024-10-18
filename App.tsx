import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Navigation } from "./src/navigation";
import { Playground } from "./src/components/Playground";

function App() {
  const renderGame = true;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {renderGame ? <Navigation /> : <Playground />}
    </GestureHandlerRootView>
  );
}

export default App;
