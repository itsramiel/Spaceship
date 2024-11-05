import { jwtDecode } from "jwt-decode";

import { LiteEvent } from "@/models";
import { LOCAL_STORAGE, LOCAL_STORAGE_KEYS } from "@/localStorage";

export class AuthManager {
  public static shared = new AuthManager();

  public readonly signedInEvent = new LiteEvent<boolean>();

  private _accessToken?: string;
  private _refreshToken?: string;

  constructor() {
    this.accessToken = LOCAL_STORAGE.getString(LOCAL_STORAGE_KEYS.accessToken);
    this.refreshToken = LOCAL_STORAGE.getString(
      LOCAL_STORAGE_KEYS.refreshToken,
    );
  }

  public get accessToken() {
    return this._accessToken;
  }

  private set accessToken(value) {
    if (value) {
      LOCAL_STORAGE.set(LOCAL_STORAGE_KEYS.accessToken, value);
    } else {
      LOCAL_STORAGE.delete(LOCAL_STORAGE_KEYS.accessToken);
    }
    this._accessToken = value;
  }

  private get refreshToken() {
    const refreshToken = this._refreshToken;
    if (typeof refreshToken === "string" && this.isTokenExpired(refreshToken)) {
      this.setTokens(undefined, undefined);
    }
    return this._refreshToken;
  }

  private set refreshToken(value) {
    if (value) {
      if (this.isTokenExpired(value)) {
        this.setTokens(undefined, undefined);
        return;
      } else {
        this.signedInEvent.trigger(true);
        LOCAL_STORAGE.set(LOCAL_STORAGE_KEYS.refreshToken, value);
      }
    } else {
      this.signedInEvent.trigger(false);
      LOCAL_STORAGE.delete(LOCAL_STORAGE_KEYS.refreshToken);
    }
    this._refreshToken = value;
  }

  // Overload signatures
  setTokens(accessToken: string, refreshToken: string): void;
  setTokens(accessToken: undefined, refreshToken: undefined): void;

  // Implementation
  public setTokens(
    accessToken: string | undefined,
    refreshToken: string | undefined,
  ): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  private isTokenExpired(token: string) {
    const decodedRefreshToken = jwtDecode(token);
    if (typeof decodedRefreshToken !== "object" || decodedRefreshToken === null)
      throw new Error("Invalid token");

    const expiresAt = decodedRefreshToken.exp;
    if (typeof expiresAt !== "number") throw new Error("Invalid token");

    return new Date().valueOf() > expiresAt * 1000;
  }

  // User is logged in if:
  // 1. accessToken and refreshToken are defined
  // 2. refreshToken is not expired
  // Note: Some may argue that user should be considered logged out if accessToken is expired
  // but imo it is not good UX since accessToken are short lived and user may have no internet connection
  // to refresh it. So showing user is logged out and then when gains internet connection, back to logged in is terrible UX
  public get isLoggedIn(): boolean {
    const accessToken = this.accessToken;
    const refreshToken = this.refreshToken;

    if (typeof accessToken !== "string" || typeof refreshToken !== "string") {
      return false;
    }

    return !this.isTokenExpired(refreshToken);
  }

  public signOut() {
    this.setTokens(undefined, undefined);
  }
}
