import { create } from "zustand";

import { AuthManager } from "@/managers";

type TSignedInStore = {
  state: {
    isSignedIn: boolean;
  };
  actions: {
    setIsSignedIn: (isSignedIn: boolean) => void;
  };
};

const isSignedIn = AuthManager.shared.isLoggedIn;
console.log("isSignedIn", isSignedIn);

export const useSignedInScore = create<TSignedInStore>((set) => ({
  state: {
    isSignedIn,
  },
  actions: {
    setIsSignedIn: (isSignedIn: boolean) => {
      set(() => ({ state: { isSignedIn } }));
    },
  },
}));

export const signedInStoreActions = useSignedInScore.getState().actions;
AuthManager.shared.signedInEvent.on(signedInStoreActions.setIsSignedIn);

export function useIsSignedIn() {
  return useSignedInScore((state) => state.state.isSignedIn);
}

export function useIsSignedOut() {
  return useSignedInScore((state) => !state.state.isSignedIn);
}
