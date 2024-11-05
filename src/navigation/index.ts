import {
  createStaticNavigation,
  StaticParamList,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useIsSignedOut } from "@/stores";

import {
  GameOverScreen,
  GameScreen,
  HomeScreen,
  SignInScreen,
  SignUpScreen,
  SignUpVerificationScreen,
} from "../screens";

const RootStack = createNativeStackNavigator({
  initialRouteName: "Home",
  screenOptions: {
    headerTitleAlign: "center",
    headerBackButtonDisplayMode: "generic",
  },
  groups: {
    Modal: {
      screenOptions: {
        headerShown: false,
        animation: "fade",
        gestureEnabled: false,
        presentation: "transparentModal",
        contentStyle: {
          backgroundColor: "transparent",
        },
      },
      screens: {
        GameOver: GameOverScreen,
      },
    },
    SignedOut: {
      if: useIsSignedOut,
      screens: {
        SignIn: {
          screen: SignInScreen,
          options: {
            title: "Sign In",
          },
        },
        SignUp: {
          screen: SignUpScreen,
          options: {
            title: "Sign Up",
          },
        },
        SignUpVerification: {
          screen: SignUpVerificationScreen,
          options: {
            title: "Verify Email",
          },
        },
      },
    },
  },
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        headerShown: false,
        animation: "fade",
        gestureEnabled: false,
      },
    },
    Game: {
      screen: GameScreen,
      options: {
        headerShown: false,
        animation: "fade",
        gestureEnabled: false,
      },
    },
  },
});

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export const Navigation = createStaticNavigation(RootStack);
