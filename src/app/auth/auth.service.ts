import {computed, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {Observable, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";

export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
}

const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _token: WritableSignal<string | null> = signal(null);
  private _refreshToken: WritableSignal<string | null> = signal(null);

  constructor(private httpClient: HttpClient) {
  }

  public signIn(payload: { username: string, password: string }): Observable<TokenResponse> {
    return this.httpClient.post<TokenResponse>('auth/login', payload).pipe(
      tap((token: TokenResponse) => this.setTokens(token))
    );
  }

  public signUp(payload: { name: string, surname: string, username: string, password: string }): Observable<TokenResponse> {
    return this.httpClient.post<TokenResponse>('auth/signup', payload);
  }

  /**
   * Refreshes the access token using the stored refresh token.
   * Backend returns a new access_token and refresh_token (rotation).
   */
  public refresh(): Observable<TokenResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return new Observable(obs => {
        obs.error(new Error('No refresh token'));
        obs.complete();
      });
    }
    return this.httpClient.post<TokenResponse>('auth/refresh', { refresh_token: refreshToken }).pipe(
      tap((token: TokenResponse) => this.setTokens(token))
    );
  }

  /**
   * Calls backend to invalidate the refresh token, then clears local tokens.
   */
  public logout(): Observable<void> {
    const refreshToken = this.getRefreshToken();
    const req = refreshToken
      ? this.httpClient.post<void>('auth/logout', { refresh_token: refreshToken })
      : new Observable<void>(obs => { obs.next(); obs.complete(); });
    return req.pipe(
      tap(() => this.revokeToken())
    );
  }

  public get token(): Signal<string | null> {
    return computed(() => this._token() ?? localStorage.getItem(ACCESS_TOKEN));
  }

  public get refreshToken(): Signal<string | null> {
    return computed(() => this._refreshToken() ?? localStorage.getItem(REFRESH_TOKEN));
  }

  public set token(token: TokenResponse) {
    this.setTokens(token);
  }

  public setTokens(token: TokenResponse): void {
    this._token.set(token.access_token);
    this._refreshToken.set(token.refresh_token ?? null);
    localStorage.setItem(ACCESS_TOKEN, token.access_token);
    if (token.refresh_token) {
      localStorage.setItem(REFRESH_TOKEN, token.refresh_token);
    } else {
      localStorage.removeItem(REFRESH_TOKEN);
    }
  }

  public getRefreshToken(): string | null {
    return this._refreshToken() ?? localStorage.getItem(REFRESH_TOKEN);
  }

  public revokeToken(): void {
    this._token.set(null);
    this._refreshToken.set(null);
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
  }
}
