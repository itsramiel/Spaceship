import {
  createStaticNavigation,
  StaticParamList,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { GameOverScreen, GameScreen, HomeScreen } from "../screens";
import { COLORS } from "@/config";

const RootStack = createNativeStackNavigator({
  initialRouteName: "Home",
  screenOptions: {
    headerShown: false,
    animation: "fade",
    gestureEnabled: false,
    contentStyle: {
      backgroundColor: COLORS["neutral/950"],
    },
  },
  screens: {
    Home: {
      screen: HomeScreen,
    },
    Game: {
      screen: GameScreen,
    },
    GameOver: {
      screen: GameOverScreen,
      options: {
        presentation: "transparentModal",
        contentStyle: {
          backgroundColor: "transparent",
        },
      },
      // initialParams: {
      //   score: 90,
      //   bestScore: 90,
      //   onPlayAgain: () => {},
      // },
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
