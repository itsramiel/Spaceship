import { mmkvZustandStorage } from "@/localstorage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type TPreferencesStore = {
  state: {
    isSoundEffectsEnabled: boolean;
    isBackgroundMusicEnabled: boolean;
    soundEffectsVolume: number;
    backgroundMusicVolume: number;
  };
  actions: {
    setSoundEffectsEnabled: (isSoundEffectsEnabled: boolean) => void;
    setBackgroundMusicEnabled: (isBackgroundMusicEnabled: boolean) => void;
    setSoundEffectsVolume: (soundEffectsVolume: number) => void;
    setBackgroundMusicVolume: (backgroundMusicVolume: number) => void;
  };
};

export const usePreferencesStore = create<TPreferencesStore>()(
  persist(
    (set) => ({
      state: {
        isSoundEffectsEnabled: true,
        isBackgroundMusicEnabled: true,
        soundEffectsVolume: 1,
        backgroundMusicVolume: 1,
      },
      actions: {
        setSoundEffectsEnabled: (isSoundEffectsEnabled) => {
          set(({ state: prevState }) => ({
            state: {
              ...prevState,
              isSoundEffectsEnabled,
            },
          }));
        },
        setBackgroundMusicEnabled: (isBackgroundMusicEnabled) => {
          set(({ state: prevState }) => ({
            state: {
              ...prevState,
              isBackgroundMusicEnabled,
            },
          }));
        },
        setSoundEffectsVolume: (soundEffectsVolume) => {
          set(({ state: prevState }) => ({
            state: {
              ...prevState,
              soundEffectsVolume,
            },
          }));
        },
        setBackgroundMusicVolume: (backgroundMusicVolume) => {
          set(({ state: prevState }) => ({
            state: {
              ...prevState,
              backgroundMusicVolume,
            },
          }));
        },
      },
    }),
    {
      name: "preferencesStore",
      storage: createJSONStorage(() => mmkvZustandStorage),
      partialize: ({ state }) => ({ state }),
    },
  ),
);

export const preferencesStoreActions = usePreferencesStore.getState().actions;
export const getPreferencesStoreState = () =>
  usePreferencesStore.getState().state;
