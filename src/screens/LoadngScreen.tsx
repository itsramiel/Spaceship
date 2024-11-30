import {
  createStyleSheet,
  UnistylesRuntime,
  useStyles,
} from "react-native-unistyles";
import { useCallback, useEffect } from "react";
import { Image, Text, View } from "react-native";

import { COLORS } from "@/config";
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import { StackActions, useNavigation } from "@react-navigation/native";
import { useSoundsStore } from "@/stores";
import {
  loadSounds,
  openAudioStream,
  playBackgroundMusic,
  setupAudipStream,
} from "@/audio";

export function LoadngScreen() {
  const navigation = useNavigation();
  const { styles } = useStyles(stylesheet);
  const progress = useSoundsStore((store) => {
    console.log("store", store);
    if (store.state.soundsCount === 0) return 0;
    return store.state.loadedSoundsCount / store.state.soundsCount;
  });

  const animatedProgress = useDerivedValue(() => {
    return withTiming(progress);
  }, [progress]);

  const onSoundsLoaded = useCallback(() => {
    openAudioStream();
    playBackgroundMusic();
    navigation.dispatch(StackActions.replace("Home"));
  }, []);

  useAnimatedReaction(
    () => animatedProgress.value === 1,
    (didLoadSounds) => {
      didLoadSounds && runOnJS(onSoundsLoaded)();
    },
    [onSoundsLoaded],
  );

  useEffect(() => {
    setupAudipStream();
    loadSounds();
  }, []);

  const innerLoadingStyle = useAnimatedStyle(() => {
    return {
      width: `${animatedProgress.value * 100}%`,
    };
  }, []);

  return (
    <View style={styles.screen}>
      <Image
        style={styles.img}
        source={require("@/assets/images/rocket.png")}
      />
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingTxt}>Loading...</Text>
        <View style={styles.loadingBar}>
          <Animated.View style={[styles.innerLoadingBar, innerLoadingStyle]} />
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
    alignItems: "center",
    justifyContent: "space-around",
  },
  img: {
    width: 134,
    height: 97,
    resizeMode: "contain",
  },
  loadingContainer: {
    width: "100%",
    gap: 24,
    alignItems: "center",
  },
  loadingTxt: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.white,
  },
  loadingBar: {
    height: 12,
    backgroundColor: COLORS["red/100"],
    borderRadius: 6,
    overflow: "hidden",
    width: "100%",
  },
  innerLoadingBar: {
    height: 12,
    backgroundColor: COLORS["red/400"],
  },
}));
