import { useMemo } from "react";
import {
  ColorValue,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

const SHADOW_OFFSET = 4;
const PRESSED_SHADOW_OFFSET = 0.25 * SHADOW_OFFSET;

interface ButtonProps {
  onPress?: () => void;
  text: string;
  color: ColorValue;
  shadowColor: ColorValue;
}

export function Button({ text, color, shadowColor, onPress }: ButtonProps) {
  const shadowStyles = useMemo(
    (): ViewStyle => ({
      position: "absolute",
      top: "25%",
      left: 0,
      right: 0,
      bottom: -SHADOW_OFFSET,
      borderBottomRightRadius: 4,
      borderBottomLeftRadius: 4,
      backgroundColor: shadowColor,
    }),
    [shadowColor],
  );

  const bgStyles = useMemo(
    (): ViewStyle => ({
      ...StyleSheet.absoluteFillObject,
      backgroundColor: color,
      borderRadius: 4,
    }),
    [color],
  );

  return (
    <Pressable style={styles.container} onPress={onPress}>
      {({ pressed }) => (
        <>
          <View style={shadowStyles} />
          <View style={[bgStyles, pressed ? styles.pressed : undefined]} />
          <Text style={[styles.text, pressed ? styles.pressed : undefined]}>
            {text}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 32,
    alignItems: "center",
  },
  pressed: {
    transform: [{ translateY: PRESSED_SHADOW_OFFSET }],
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
});
