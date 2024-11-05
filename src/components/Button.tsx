import { ComponentProps, useMemo } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  ColorValue,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import {
  createStyleSheet,
  UnistylesVariants,
  useStyles,
} from "react-native-unistyles";
import { COLORS } from "@/config";

type TVariants = UnistylesVariants<typeof stylesheet>;
type TSize = NonNullable<TVariants["size"]>;

const IconSizeMap: Record<TSize, number> = {
  sm: 20,
  md: 24,
};

interface ButtonProps {
  style?: ViewStyle;
  onPress?: () => void;
  size?: TVariants["size"];
  text: string;
  color: ColorValue;
  shadowColor: ColorValue;
  trailingIcon?: ComponentProps<typeof Ionicons>["name"];
}

export function Button({
  size = "md",
  text,
  color,
  shadowColor,
  onPress,
  style,
  trailingIcon,
}: ButtonProps) {
  const { styles } = useStyles(stylesheet, { size });

  const bgStyles = useMemo(() => styles.background(color), [color]);
  const shadowStyles = useMemo(() => styles.shadow(shadowColor), [shadowColor]);

  return (
    <Pressable style={[styles.container, style]} onPress={onPress}>
      {({ pressed }) => (
        <>
          <View style={shadowStyles} />
          <View style={[bgStyles, pressed ? styles.pressed : undefined]} />
          <View style={styles.contentContainer}>
            <Text style={[styles.text, pressed ? styles.pressed : undefined]}>
              {text}
            </Text>
            {typeof trailingIcon === "string" ? (
              <Ionicons
                name={trailingIcon}
                color={COLORS.white}
                size={IconSizeMap[size]}
              />
            ) : null}
          </View>
        </>
      )}
    </Pressable>
  );
}

const stylesheet = createStyleSheet(() => ({
  container: {
    alignItems: "center",
    variants: {
      size: {
        sm: {
          paddingVertical: 4,
          paddingHorizontal: 8,
        },
        md: {
          paddingVertical: 8,
          paddingHorizontal: 32,
        },
      },
    },
  },
  contentContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  text: {
    color: "white",
    variants: {
      size: {
        sm: { fontSize: 16, fontWeight: "500" },
        md: {
          fontSize: 20,
          fontWeight: "bold",
        },
      },
    },
  },
  background: (color: ColorValue) => ({
    ...StyleSheet.absoluteFillObject,
    backgroundColor: color,
    borderRadius: 4,
  }),
  shadow: (color: ColorValue) => ({
    position: "absolute",
    top: "25%",
    left: 0,
    right: 0,
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 4,
    backgroundColor: color,
    variants: {
      size: {
        sm: { bottom: -2 },
        md: { bottom: -4 },
      },
    },
  }),
  pressed: {
    variants: {
      size: {
        sm: { transform: [{ translateY: 0.5 }] },
        md: { transform: [{ translateY: 1 }] },
      },
    },
  },
}));
