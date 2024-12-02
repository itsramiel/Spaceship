import {
  createStaticNavigation,
  StaticParamList,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
  AudioSettingsScreen,
  DevelopmentScreen,
  GameOverScreen,
  GamePausedScreen,
  GameScreen,
  HomeScreen,
  LoadngScreen,
} from "../screens";

const RootStack = createNativeStackNavigator({
  initialRouteName: "Loading",
  screenOptions: {
    headerTitleAlign: "center",
    headerBackButtonDisplayMode: "generic",
    headerShown: false,
    gestureEnabled: false,
    animation: "fade",
  },
  groups: {
    Modal: {
      screenOptions: {
        presentation: "transparentModal",
        contentStyle: {
          backgroundColor: "transparent",
        },
      },
      screens: {
        GameOver: GameOverScreen,
        GamePaused: GamePausedScreen,
      },
    },
  },
  screens: {
    Development: DevelopmentScreen,
    Loading: {
      screen: LoadngScreen,
    },
    Home: {
      screen: HomeScreen,
    },
    Game: {
      screen: GameScreen,
    },
    AudioSettings: {
      screen: AudioSettingsScreen,
      options: {
        animation: "default",
        headerShown: true,
        headerTitle: "Audio Settings",
        gestureEnabled: true,
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
