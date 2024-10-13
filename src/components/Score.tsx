import { StyleSheet, Text, View } from "react-native";
import { useScoreStore } from "../stores";

export function Score() {
  const score = useScoreStore((store) => store.state.latestScore);

  if (typeof score !== "number") return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Score: {score}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 16,
    right: 32,
    padding: 8,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 4,
  },
  text: {
    color: "white",
    fontSize: 20,
  },
});
