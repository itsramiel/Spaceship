import {
  createStyleSheet,
  UnistylesRuntime,
  useStyles,
} from "react-native-unistyles";
import { Alert, Text, TextInput, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { StackActions, useNavigation } from "@react-navigation/native";

import { COLORS } from "@/config";
import { Button } from "@/components";
import { AuthManager, NetworkManager } from "@/managers";
import { StatusCodes } from "@/constants";

export function SignInScreen() {
  const { styles } = useStyles(stylesheet);
  const navigation = useNavigation();

  const onSignIn = () => {
    navigation.dispatch(StackActions.replace("SignUp", getValues()));
  };

  const { control, handleSubmit, getValues } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSignInPress = handleSubmit(async (formData) => {
    const response = await NetworkManager.shared
      .signIn(formData.email, formData.password)
      .catch(() => {});
    if (!response) return;

    const parsed = await response.parsed();
    console.log("parsed", parsed);
    if (!parsed) return;

    if (parsed.data) {
      AuthManager.shared.setTokens(
        parsed.data.accessToken,
        parsed.data.refreshToken,
      );
    } else if (typeof parsed.status === "string") {
      console.log("parsed.status", parsed.status);
      switch (parsed.status) {
        case StatusCodes.ACCOUNT_ALREADY_EXISTS_UNVERIFIED:
          NetworkManager.shared.resendEmailVerification(formData.email);
          navigation.navigate("SignUpVerification", formData);
          break;
        case StatusCodes.USER_NOT_FOUND:
          Alert.alert("No user with that email");
          break;
        case StatusCodes.WRONG_PASSWORD:
          Alert.alert("Wrong password");
          break;
        default:
          break;
      }
    }
  });

  return (
    <View style={styles.screen}>
      <View style={styles.contentContainer}>
        <View style={styles.formContainer}>
          <View style={styles.inputFieldsContainer}>
            <View style={styles.inputField}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onBlur, onChange, value } }) => (
                  <TextInput
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={styles.textInputs}
                    placeholderTextColor={COLORS["neutral/300"]}
                    placeholder="Email"
                  />
                )}
              />
            </View>
            <View style={styles.inputField}>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    secureTextEntry
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={styles.textInputs}
                    placeholderTextColor={COLORS["neutral/300"]}
                    placeholder="Password"
                  />
                )}
              />
            </View>
          </View>
          <Text style={styles.btnText}>Forgot Password</Text>
        </View>
        <View style={styles.footerContainer}>
          <Button
            onPress={onSignInPress}
            style={styles.signInBtn}
            text="Log in"
            color={COLORS["red/500"]}
            shadowColor={COLORS["red/600"]}
          />
          <Text style={styles.btnText} onPress={onSignIn}>
            Don't have an account? Sign up
          </Text>
        </View>
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet(() => ({
  screen: {
    flex: 1,
    paddingTop: Math.max(16, UnistylesRuntime.insets.bottom),
    paddingBottom: Math.max(16, UnistylesRuntime.insets.bottom),
    paddingHorizontal: Math.max(
      48,
      UnistylesRuntime.insets.left,
      UnistylesRuntime.insets.right,
    ),
    alignSelf: "center",
  },
  contentContainer: {
    height: "100%",
    minWidth: "70%",
    justifyContent: "space-around",
  },
  formContainer: {
    alignItems: "flex-end",
    gap: 8,
  },
  inputFieldsContainer: {
    gap: 2,
    padding: 2,
    backgroundColor: COLORS["neutral/800"],
    borderRadius: 4,
    alignSelf: "stretch",
  },
  inputField: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS["neutral/900"],
  },
  textInputs: {
    fontWeight: "500",
    fontSize: 16,
    color: COLORS["white"],
  },
  btnText: {
    fontWeight: "semibold",
    fontSize: 16,
    color: COLORS["orange/100"],
  },
  signInBtn: {
    alignSelf: "stretch",
  },
  footerContainer: {
    alignItems: "center",
    gap: 16,
  },
}));
