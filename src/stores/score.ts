import { create } from "zustand";

type TScoreStore = {
  state: {
    latestScore: number;
    bestScore: number | null;
  };
  actions: {
    incrementScore: () => void;
    resetScore: () => void;
  };
};

export const useScoreStore = create<TScoreStore>((set) => ({
  state: {
    latestScore: 0,
    bestScore: null,
  },
  actions: {
    incrementScore: () => {
      set(({ state: prevState }) => {
        const score = prevState.latestScore + 1;
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
