import { COLORS } from "@/config";
import { AuthManager, NetworkManager } from "@/managers";
import { StaticScreenProps } from "@react-navigation/native";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const ORIGINAL_IMGAE_WIDTH = 257;
const ORIGINAL_IMAGE_HEIGHT = 245;

const IMAGE_HEIGHT = SCREEN_HEIGHT * 0.3;
const IMAGE_WIDTH =
  (IMAGE_HEIGHT * ORIGINAL_IMGAE_WIDTH) / ORIGINAL_IMAGE_HEIGHT;

type Props = StaticScreenProps<{
  email: string;
  password: string;
}>;

export function SignUpVerificationScreen({ route }: Props) {
  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    intervalId = setInterval(() => {
      NetworkManager.shared
        .signIn(route.params.email, route.params.password)
        .then(async (response) => {
          const parsed = await response.parsed();
          if (parsed && parsed.data) {
            AuthManager.shared.setTokens(
              parsed.data.accessToken,
              parsed.data.refreshToken,
            );
            clearInterval(intervalId);
            intervalId = undefined;
          }
        });
    }, 2000);

    return () => {
      intervalId !== undefined && clearInterval(intervalId);
    };
  }, [route.params.email, route.params.password]);

  return (
    <View style={styles.screen}>
      <View style={styles.contentContainer}>
        <Image
          source={require("./SignUpVerification/assets/email-verification.png")}
          style={styles.img}
          resizeMode="contain"
        />
        <Text style={styles.txt}>
          Please click the link sent to your email address to verify your
          account
        </Text>
      </View>
      <ActivityIndicator size={"small"} color={COLORS.white} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
  },
  contentContainer: {
    gap: 16,
    alignItems: "center",
    alignSelf: "stretch",
  },
  img: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
  },
  txt: {
    fontSize: 18,
    color: COLORS.white,
    textAlign: "center",
  },
});
