import { create } from "zustand";

type TScoreStore = {
  state: {
    latestScore: number | null;
    bestScore: number | null;
  };
  actions: {
    incrementScore: () => void;
    resetScore: () => void;
  };
};

export const useScoreStore = create<TScoreStore>((set) => ({
  state: {
    latestScore: null,
    bestScore: null,
  },
  actions: {
    incrementScore: () => {
      set(({ state: prevState }) => {
        const score = (prevState.latestScore ?? 0) + 1;
        return {
          state: {
            ...prevState,
            latestScore: score,
            bestScore: prevState.bestScore
              ? Math.max(prevState.bestScore, score)
              : score,
          },
        };
      });
    },
    resetScore: () => {
      set(({ state: prevState }) => ({
        state: {
          ...prevState,
          latestScore: 0,
        },
      }));
    },
  },
}));

export const scoreStoreActions = useScoreStore.getState().actions;
export const selectIsFirstPlay = (store: TScoreStore) =>
  store.state.latestScore === null;
