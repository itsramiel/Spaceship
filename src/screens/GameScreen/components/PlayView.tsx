import { StyleSheet, Text, View } from "react-native";

import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useScoreStore } from "../../../stores";
import { Button } from "../../../components";

interface PlayViewProps {
  onStartGame: () => void;
}

export function PlayView({ onStartGame }: PlayViewProps) {
  const { bestScore, latestScore } = useScoreStore((store) => store.state);

  return (
    <Animated.View style={styles.screen} entering={FadeIn} exiting={FadeOut}>
      <View style={styles.container}>
        <View style={styles.scoresContainer}>
          {typeof latestScore === "number" ? (
            <Text style={styles.currentScore}>Score: {latestScore}</Text>
          ) : null}
          {typeof bestScore === "number" ? (
            <Text style={styles.bestScore}>Personal Best: {bestScore}</Text>
          ) : null}
        </View>
        <Button
          text={typeof latestScore === "number" ? "Play Again" : "Start Game"}
          color="#ef4444"
          shadowColor="#b91c1c"
          onPress={onStartGame}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  scoresContainer: {
    alignItems: "center",
    gap: 8,
  },
  currentScore: {
    color: "white",
    fontSize: 24,
    fontWeight: "semibold",
  },
  bestScore: {
    color: "white",
    fontSize: 20,
  },
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
    gap: 16,
  },
});
