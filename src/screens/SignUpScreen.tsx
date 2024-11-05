import {
  createStyleSheet,
  UnistylesRuntime,
  useStyles,
} from "react-native-unistyles";
import { Alert, Text, TextInput, View } from "react-native";
import {
  StackActions,
  StaticScreenProps,
  useNavigation,
} from "@react-navigation/native";

import { COLORS } from "@/config";
import { Button } from "@/components";
import { Controller, useForm } from "react-hook-form";
import { NetworkManager } from "@/managers";
import { StatusCodes } from "@/constants/StatusCodes";

type Props = StaticScreenProps<{
  email: string;
  password: string;
}>;

export function SignUpScreen({ route }: Props) {
  const { styles } = useStyles(stylesheet);
  const navigation = useNavigation();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    values: {
      email: route.params.email,
      password: route.params.password,
    },
  });

  const onSignUp = handleSubmit(async (formData) => {
    const response = await NetworkManager.shared.signUp(
      formData.email,
      formData.password,
    );
    if (!response) return;

    if (response.ok) {
      navigation.navigate("SignUpVerification", formData);
    } else {
      const parsed = await NetworkManager.shared.parseResponse(response);
      if (!parsed) return;
      if (typeof parsed.status !== "string") return;

      switch (parsed.status) {
        case StatusCodes.ACCOUNT_ALREADY_EXISTS_UNVERIFIED:
          NetworkManager.shared.resendEmailVerification(formData.email);
          navigation.navigate("SignUpVerification", formData);
          break;
        case StatusCodes.ACCOUNT_ALREADY_EXISTS_VERIFIED:
          Alert.alert("Account already exists");
          break;
        default:
          break;
      }
    }
  });

  const onSignIn = () => {
    navigation.dispatch(StackActions.replace("SignIn"));
  };

  return (
    <View style={styles.screen}>
      <View style={styles.contentContainer}>
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
        <View style={styles.footerContainer}>
          <Button
            style={styles.signInBtn}
            text="Sign up"
            color={COLORS["red/500"]}
            shadowColor={COLORS["red/600"]}
            onPress={onSignUp}
          />
          <Text onPress={onSignIn} style={styles.btnText}>
            Already have an account? Log in
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
