import { getDeviceId } from "@/utils";

export class NetworkManager {
  static readonly shared = new NetworkManager();

  readonly deviceId = getDeviceId();
  readonly baseUrl = process.env.EXPO_PUBLIC_API_URL;

  sendScore(score: number) {
    return fetch(`${this.baseUrl}/score`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ deviceId: this.deviceId, score }),
    });
  }
}
