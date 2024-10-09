import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {Game} from './src/components/Game';
import {Playground} from './src/components/Playground';

function App() {
  const renderGame = true;

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      {renderGame ? <Game /> : <Playground />}
    </GestureHandlerRootView>
  );
}

export default App;
