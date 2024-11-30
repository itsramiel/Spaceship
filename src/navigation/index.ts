import {
  createStaticNavigation,
  StaticParamList,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
  GameOverScreen,
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
      },
    },
  },
  screens: {
    Loading: {
      screen: LoadngScreen,
    },
    Home: {
      screen: HomeScreen,
    },
    Game: {
      screen: GameScreen,
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
