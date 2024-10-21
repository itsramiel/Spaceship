import * as Crypto from "expo-crypto";
import { LOCAL_STORAGE, LOCAL_STORAGE_KEYS } from "@/localStorage";

export function getDeviceId() {
  const deviceId = LOCAL_STORAGE.getString(LOCAL_STORAGE_KEYS.deviceId);

  if (typeof deviceId === "string") {
    return deviceId;
  }

  const newDeviceId = Crypto.randomUUID();
  LOCAL_STORAGE.set(LOCAL_STORAGE_KEYS.deviceId, newDeviceId);

  return newDeviceId;
}
