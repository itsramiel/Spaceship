import { StyleSheet, Text, View } from "react-native";
import {
  StackActions,
  StaticScreenProps,
  useNavigation,
} from "@react-navigation/native";

import { Button } from "@/components";
import { COLORS } from "@/config";

type Props = StaticScreenProps<{
  onResume: () => void;
}>;

export function GamePausedScreen({ route }: Props) {
  const navigation = useNavigation();

  const onExit = () => {
    navigation.dispatch(StackActions.popTo("Home"));
  };

  const onPlayAgain = () => {
    navigation.goBack();
    route.params.onResume();
  };

  return (
    <View style={styles.screen}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Game Paused</Text>
        <View style={styles.buttonsContainer}>
          <Button
            onPress={onExit}
            text="Main Menu"
            color={COLORS["stone/500"]}
            shadowColor={COLORS["stone/600"]}
          />
          <Button
            onPress={onPlayAgain}
            text="Resume"
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
  buttonsContainer: {
    flexDirection: "row",
    gap: 16,
  },
});
