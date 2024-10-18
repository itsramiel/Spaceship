import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { COLORS } from "../config";
import { Button } from "../components";

export function HomeScreen() {
  const navigation = useNavigation();

  const onStartGamePressed = () => {
    navigation.navigate("Game");
  };

  return (
    <View style={styles.screen}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Spaceship</Text>
        <View style={styles.buttonContainers}>
          <Button
            text="Leaderboard"
            color={COLORS["yellow/500"]}
            shadowColor={COLORS["yellow/600"]}
          />
          <Button
            text="Start Game"
            color={COLORS["red/500"]}
            shadowColor={COLORS["red/600"]}
            onPress={onStartGamePressed}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLORS["neutral/950"],
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    height: "50%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.white,
  },
  buttonContainers: {
    flexDirection: "row",
    gap: 16,
  },
});
