import { StyleSheet, Text, View } from "react-native";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";

import { Button } from "@/components";
import { COLORS } from "@/config";
import { useScoreStore } from "@/stores";

type Props = StaticScreenProps<{
  onPlayAgain: () => void;
}>;

export function GameOverScreen({ route }: Props) {
  const navigation = useNavigation();
  const { latestScore, bestScore } = useScoreStore((store) => store.state);

  const onExit = () => {
    navigation.navigate("Home");
  };

  const onPlayAgain = () => {
    navigation.goBack();
    route.params.onPlayAgain();
  };

  return (
    <View style={styles.screen}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Game Over!</Text>
        <View style={styles.scoresContainer}>
          <Text style={styles.score}>Score: {latestScore}</Text>
          <Text style={styles.bestScore}>
            Personal Best: {bestScore ?? latestScore}
          </Text>
        </View>
        <View style={styles.buttonsContainer}>
          <Button
            onPress={onExit}
            text="Exit"
            color={COLORS["stone/500"]}
            shadowColor={COLORS["stone/600"]}
          />
          <Button
            onPress={onPlayAgain}
            text="Play Again"
            color={COLORS["red/500"]}
            shadowColor={COLORS["red/600"]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingVertical: 48,
    paddingHorizontal: 64,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  contentContainer: {
    flex: 1,
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: COLORS["neutral/950"],
    borderRadius: 4,
    borderColor: COLORS["neutral/700"],
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS["white"],
  },
  scoresContainer: {
    alignItems: "center",
    gap: 8,
  },
  score: {
    fontSize: 24,
    color: COLORS["white"],
    fontWeight: "600",
  },
  bestScore: {
    fontSize: 20,
    color: COLORS["white"],
    fontWeight: "500",
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 16,
  },
});
