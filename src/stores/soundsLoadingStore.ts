import { create } from "zustand";
import { AudioManager, Player } from "react-native-audio-playback";

type TPlayerObject = {
  source: number;
  player: Player | undefined;
};

type TSoundsLoadingStore = {
  state: {
    backgroundPlayer: TPlayerObject;
    buttonClickPlayer: TPlayerObject;
    beepPlayer: TPlayerObject;
    laserShotPlayer: TPlayerObject;
  };
  actions: {
    setPlayer: (
      player: Player,
      playerKey: keyof TSoundsLoadingStore["state"],
    ) => void;
  };
};

export const useSoundsLoadingStore = create<TSoundsLoadingStore>((set) => ({
  state: {
    backgroundPlayer: {
      source: require("@/assets/sounds/bg-music1.mp3"),
      player: undefined,
    },
    buttonClickPlayer: {
      source: require("@/assets/sounds/button-click1.mp3"),
      player: undefined,
    },
    beepPlayer: {
      source: require("@/assets/sounds/beep.mp3"),
      player: undefined,
    },
    laserShotPlayer: {
      source: require("@/assets/sounds/laser-shot.mp3"),
      player: undefined,
    },
  },
  actions: {
    setPlayer: (player, playerKey) => {
      set((prev) => ({
        state: {
          ...prev.state,
          [playerKey]: {
            ...prev.state[playerKey],
            player: player,
          },
        },
      }));
    },
  },
}));

export const useSoundsLoadingProgress = () =>
  useSoundsLoadingStore((store) => {
    const length = Object.keys(store.state).length;
    const loaded = Object.values(store.state).filter(
      (player) => player.player,
    ).length;

    return loaded / length;
  });

export function loadSounds() {
  const state = useSoundsLoadingStore.getState().state;

  for (const [playerKey, playerObject] of Object.entries(state) as Array<
    [keyof TSoundsLoadingStore["state"], TPlayerObject]
  >) {
    if (!playerObject.player) {
      AudioManager.shared.loadSound(playerObject.source).then((player) => {
        if (player instanceof Player) {
          useSoundsLoadingStore.getState().actions.setPlayer(player, playerKey);
        }
      });
    }
  }
}

export const audioPlayers = {
  get backgroundPlayer() {
    return useSoundsLoadingStore.getState().state.backgroundPlayer.player;
  },
  get buttonClickPlayer() {
    return useSoundsLoadingStore.getState().state.buttonClickPlayer.player;
  },
  get beepPlayer() {
    return useSoundsLoadingStore.getState().state.beepPlayer.player;
  },
  get laserShotPlayer() {
    return useSoundsLoadingStore.getState().state.laserShotPlayer.player;
  },
};
