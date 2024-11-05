import { Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  createStyleSheet,
  UnistylesRuntime,
  useStyles,
} from "react-native-unistyles";

import { COLORS } from "../config";
import { Button } from "../components";
import { useIsSignedIn } from "@/stores/signedIn";
import { AuthManager } from "@/managers";

export function HomeScreen() {
  const navigation = useNavigation();

  const onStartGamePressed = () => {
    navigation.navigate("Game");
  };

  const isSignedIn = useIsSignedIn();
  const onAuthPress = () => {
    if (isSignedIn) {
      AuthManager.shared.signOut();
    } else {
      navigation.navigate("SignIn");
    }
  };

  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.screen}>
      <Button
        size="sm"
        text={isSignedIn ? "Sign out" : "Sign in/up"}
        color={COLORS["blue/400"]}
        shadowColor={COLORS["blue/500"]}
        trailingIcon={isSignedIn ? "log-out-outline" : "log-in-outline"}
        onPress={onAuthPress}
      />
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

const stylesheet = createStyleSheet(() => ({
  screen: {
    paddingVertical: Math.max(
      UnistylesRuntime.insets.top,
      UnistylesRuntime.insets.bottom,
      48,
    ),
    paddingHorizontal: Math.max(
      UnistylesRuntime.insets.left,
      UnistylesRuntime.insets.right,
      48,
    ),
    backgroundColor: COLORS["neutral/950"],
    flex: 1,
    alignItems: "flex-end",
  },
  contentContainer: {
    flex: 1,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "space-around",
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
}));
