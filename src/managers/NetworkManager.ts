import * as v from "valibot";
import { getDeviceId } from "@/utils";

import {
  ResponseSchema,
  SignInResponseSchema,
  TResponse,
} from "./NetworkManager/schemas";
import { AuthManager } from "./AuthManager";

export class NetworkManager {
  public static readonly shared = new NetworkManager();

  private readonly deviceId = getDeviceId();
  private readonly baseUrl = process.env.EXPO_PUBLIC_API_URL;

  public sendScore(score: number) {
    const accessToken = AuthManager.shared.accessToken;
    const headers = new Headers({
      "Content-Type": "application/json",
    });
    if (typeof accessToken === "string") {
      headers.append("Authorization", `Bearer ${accessToken}`);
    }

    return fetch(`${this.baseUrl}/score`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ deviceId: this.deviceId, score }),
    });
  }

  public async signIn(email: string, password: string) {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, deviceId: this.deviceId }),
    });
    return {
      response,
      parsed: async () => {
        try {
          const json = await response.json();
          console.log("json", json);
          return v.parse(SignInResponseSchema, json);
        } catch (e) {
          console.log("e", e);
          return undefined;
        }
      },
    };
  }

  public async signUp(email: string, password: string) {
    return fetch(`${this.baseUrl}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
  }

  public async resendEmailVerification(email: string) {
    return fetch(`${this.baseUrl}/auth/resendEmailConfirmation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
  }

  public async parseResponse(
    response: Response,
  ): Promise<TResponse | undefined> {
    try {
      return v.parse(ResponseSchema, await response.json());
    } catch (e) {
      return undefined;
    }
  }
}
