import { create } from "zustand";

type TSoundsStore = {
  state: {
    soundsCount: number;
    loadedSoundsCount: number;
    preferences: {
      isSoundEffectsEnabled: boolean;
      isBackgroundMusicEnabled: boolean;
      soundEffectsVolume: number;
      backgroundMusicVolume: number;
    };
  };
  actions: {
    setSoundsCount: (soundsCount: number) => void;
    incrementSoundsCount: () => void;
    setSoundEffectsEnabled: (isSoundEffectsEnabled: boolean) => void;
    setBackgroundMusicEnabled: (isBackgroundMusicEnabled: boolean) => void;
    setSoundEffectsVolume: (soundEffectsVolume: number) => void;
    setBackgroundMusicVolume: (backgroundMusicVolume: number) => void;
  };
};

export const useSoundsStore = create<TSoundsStore>((set) => ({
  state: {
    soundsCount: 0,
    loadedSoundsCount: 0,
    preferences: {
      isSoundEffectsEnabled: true,
      isBackgroundMusicEnabled: true,
      soundEffectsVolume: 1,
      backgroundMusicVolume: 1,
    },
  },
  actions: {
    setSoundsCount: (soundsCount) => {
      set(({ state: prevState }) => ({
        state: {
          ...prevState,
          soundsCount,
        },
      }));
    },
    incrementSoundsCount: () => {
      set(({ state: prevState }) => ({
        state: {
          ...prevState,
          loadedSoundsCount: prevState.loadedSoundsCount + 1,
        },
      }));
    },
    setSoundEffectsEnabled: (isSoundEffectsEnabled) => {
      set(({ state: prevState }) => ({
        state: {
          ...prevState,
          preferences: {
            ...prevState.preferences,
            isSoundEffectsEnabled,
          },
        },
      }));
    },
    setBackgroundMusicEnabled: (isBackgroundMusicEnabled) => {
      set(({ state: prevState }) => ({
        state: {
          ...prevState,
          preferences: {
            ...prevState.preferences,
            isBackgroundMusicEnabled,
          },
        },
      }));
    },
    setSoundEffectsVolume: (soundEffectsVolume) => {
      set(({ state: prevState }) => ({
        state: {
          ...prevState,
          preferences: {
            ...prevState.preferences,
            soundEffectsVolume,
          },
        },
      }));
    },
    setBackgroundMusicVolume: (backgroundMusicVolume) => {
      set(({ state: prevState }) => ({
        state: {
          ...prevState,
          preferences: {
            ...prevState.preferences,
            backgroundMusicVolume,
          },
        },
      }));
    },
  },
}));

export const soundsStoreActions = useSoundsStore.getState().actions;
export const getSoundsStoreState = () => useSoundsStore.getState().state;
