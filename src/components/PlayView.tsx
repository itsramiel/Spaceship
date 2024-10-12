import { StyleSheet, View } from "react-native";

import { Button } from "./Button";

interface PlayViewProps {
  onStartGame: () => void;
}

export function PlayView({ onStartGame }: PlayViewProps) {
  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <Button
          text="Start Game"
          color="#ef4444"
          shadowColor="#b91c1c"
          onPress={onStartGame}
        />
      </View>
    </View>
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
