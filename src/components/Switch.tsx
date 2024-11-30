import { COLORS } from "@/config";
import { Pressable } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

const SWITCH_WIDTH = 65;
const SWITCH_HEIGHT = 24;

const THUMB_WIDTH = SWITCH_WIDTH / 2;
const THUMB_BORDER_WIDTH = 4;
const THUMB_HEIGHT = SWITCH_HEIGHT * 1.3;

const THUMB_TRANSLATE_X = SWITCH_WIDTH - THUMB_WIDTH;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface SwitchProps {
  value: boolean;
  onPress: () => void;
}

export function Switch({ value, onPress }: SwitchProps) {
  const progress = useDerivedValue(() => withTiming(value ? 1 : 0), [value]);

  const containerStyles = useAnimatedStyle(() => {
    return {
      width: SWITCH_WIDTH,
      height: SWITCH_HEIGHT,
      borderRadius: SWITCH_HEIGHT / 2,
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [COLORS["neutral/500"], COLORS["red/500"]],
      ),
      justifyContent: "center",
    };
  }, []);

  const thumbStyles = useAnimatedStyle(() => {
    return {
      position: "absolute",
      width: THUMB_WIDTH + THUMB_BORDER_WIDTH * 2,
      height: THUMB_HEIGHT + THUMB_BORDER_WIDTH * 2,
      transform: [
        {
          translateX: interpolate(
            progress.value,
            [0, 1],
            [0, THUMB_TRANSLATE_X],
          ),
        },
      ],
    };
  }, []);

  const animatedShadowStyles = useAnimatedStyle(() => {
    return {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: -THUMB_BORDER_WIDTH / 2,
      borderRadius: 4,
      backgroundColor: COLORS["neutral/950"],
      borderWidth: THUMB_BORDER_WIDTH,
      borderColor: interpolateColor(
        progress.value,
        [0, 1],
        [COLORS["neutral/600"], COLORS["red/600"]],
      ),
    };
  }, []);

  const animatedBackgroundStyles = useAnimatedStyle(() => {
    return {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 4,
      backgroundColor: COLORS["neutral/950"],
      borderWidth: THUMB_BORDER_WIDTH,
      borderColor: interpolateColor(
        progress.value,
        [0, 1],
        [COLORS["neutral/500"], COLORS["red/500"]],
      ),
    };
  }, []);

  return (
    <AnimatedPressable style={containerStyles} onPress={onPress}>
      <Animated.View style={thumbStyles}>
        <Animated.View style={animatedShadowStyles} />
        <Animated.View style={animatedBackgroundStyles} />
      </Animated.View>
    </AnimatedPressable>
  );
}
