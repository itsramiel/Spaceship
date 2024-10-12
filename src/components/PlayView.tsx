import { StyleSheet, View } from "react-native";

import { Button } from "./Button";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

interface PlayViewProps {
  onStartGame: () => void;
}

export function PlayView({ onStartGame }: PlayViewProps) {
  return (
    <Animated.View style={styles.screen} entering={FadeIn} exiting={FadeOut}>
      <View style={styles.container}>
        <Button
          text="Start Game"
          color="#ef4444"
          shadowColor="#b91c1c"
          onPress={onStartGame}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    paddingHorizontal: 148,
  },
  container: {
    backgroundColor: "black",
    alignItems: "center",
    padding: 32,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#525252aa",
  },
});
