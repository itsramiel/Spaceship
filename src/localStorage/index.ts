import { MMKV } from "react-native-mmkv";

export const LOCAL_STORAGE = new MMKV();

export const LOCAL_STORAGE_KEYS = {
  deviceId: "deviceId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
};
