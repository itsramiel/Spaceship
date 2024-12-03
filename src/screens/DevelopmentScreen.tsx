import { useRef } from "react";
import { Button, StyleSheet, View } from "react-native";

import { Countdown } from "./GameScreen/components";

export function DevelopmentScreen() {
  const ref = useRef<React.ComponentRef<typeof Countdown>>(null);

  return (
    <View style={styles.screen}>
      <Countdown onCountdownEnd={() => console.log("countdown ended")} />
      <Button title="start" onPress={() => ref.current?.startCountdown()} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
