import {
  createStyleSheet,
  UnistylesRuntime,
  useStyles,
} from "react-native-unistyles";
import { Image, Text, View } from "react-native";

import { COLORS } from "@/config";

export function LoadngScreen() {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.screen}>
      <Image
        style={styles.img}
        source={require("@/assets/images/rocket.png")}
      />
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingTxt}>Loading...</Text>
        <View style={styles.loadingBar}>
          <View style={styles.innerLoadingBar} />
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
    width: "50%",
  },
}));
