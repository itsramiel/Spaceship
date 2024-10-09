import { StyleSheet, View } from "react-native";
import { useDerivedValue, useSharedValue } from "react-native-reanimated";
import { Canvas, Group, Transforms3d } from "@shopify/react-native-skia";

import { ShootButton } from "./ShootButton";

export function Playground() {
  const size = useSharedValue({ width: 0, height: 0 });
  const transform = useDerivedValue((): Transforms3d => {
    return [
      { translateX: size.value.width / 2 },
      { translateY: size.value.height / 2 },
    ];
  }, []);

  const shootButtonSize = useDerivedValue(() => {
    return size.value.height / 2;
  }, []);

  return (
    <View style={styles.screen}>
      <Canvas style={styles.canvas} onSize={size}>
        <Group transform={transform}>
          <ShootButton size={shootButtonSize} />
        </Group>
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  canvas: {
    flex: 1,
  },
});
