import { MMKV } from "react-native-mmkv";
import { StateStorage } from "zustand/middleware";

export const LOCAL_STORAGE = new MMKV();

export const LOCAL_STORAGE_KEYS = {
  preferences: "preferences",
} as const;

export const mmkvZustandStorage: StateStorage = {
  setItem: (name, value) => {
    return LOCAL_STORAGE.set(name, value);
  },
  getItem: (name) => {
    const value = LOCAL_STORAGE.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    return LOCAL_STORAGE.delete(name);
  },
};
