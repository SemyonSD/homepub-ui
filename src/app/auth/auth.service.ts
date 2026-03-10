import {computed, Injectable, Optional, Signal, signal, WritableSignal} from '@angular/core';
import {Observable, tap, map} from "rxjs";
import {OAuthService} from "angular-oauth2-oidc";
import { ApiService } from '../shared/services/api.service';
import { TokenResponse } from '../shared/interfaces/auth.interface';

export type { TokenResponse } from '../shared/interfaces/auth.interface';

const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';
const AUTH_SOURCE = 'auth_source';

export interface UserProfile {
  name: string;
  surname: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _token: WritableSignal<string | null> = signal(null);
  private _refreshToken: WritableSignal<string | null> = signal(null);
  private _profile: WritableSignal<UserProfile | null> = signal(null);

  /** Single stable signal so templates react when token changes (e.g. after logout). */
  readonly token = computed(() => this._token() ?? localStorage.getItem(ACCESS_TOKEN));
  readonly refreshTokenSignal = computed(() => this._refreshToken() ?? localStorage.getItem(REFRESH_TOKEN));

  constructor(
    private api: ApiService,
    @Optional() private oauthService: OAuthService | null
  ) {
  }

  /** Current user name and surname; load with loadProfile() when token exists. */
  get profile(): Signal<UserProfile | null> {
    return this._profile.asReadonly();
  }

  isOAuthUser(): boolean {
    return localStorage.getItem(AUTH_SOURCE) === 'oauth';
  }

  public signIn(payload: { username: string, password: string }): Observable<TokenResponse> {
    return this.api.login(payload).pipe(
      tap((token: TokenResponse) => {
        localStorage.removeItem(AUTH_SOURCE);
        this.setTokens(token);
      })
    );
  }

  public signUp(payload: { name: string, surname: string, username: string, password: string }): Observable<TokenResponse> {
    return this.api.signup(payload);
  }

  /**
   * Refreshes the access token using the stored backend refresh token.
   * Same for username/password and OAuth users – we always use backend tokens for API calls.
   */
  public refresh(): Observable<TokenResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return new Observable(obs => {
        obs.error(new Error('No refresh token'));
        obs.complete();
      });
    }
    return this.api.refresh(refreshToken).pipe(
      tap((token: TokenResponse) => this.setTokens(token))
    );
  }

  /**
   * Calls backend to invalidate the refresh token, then clears local tokens.
   * Revokes local token first so the UI updates immediately (e.g. logout button hides).
   */
  public logout(): Observable<void> {
    const refreshTokenValue = this.getRefreshToken();
    this.revokeToken();

    if (this.isOAuthUser() && this.oauthService) {
      this.oauthService.logOut();
      return new Observable(obs => { obs.next(); obs.complete(); });
    }
    const req = refreshTokenValue
      ? this.api.logout(refreshTokenValue)
      : new Observable<void>(obs => { obs.next(); obs.complete(); });
    return req;
  }

  /** Only calls backend to invalidate refresh token. Does not clear local state. */
  public logoutBackend(refreshToken: string | null): Observable<void> {
    if (this.isOAuthUser() && this.oauthService) {
      this.oauthService.logOut();
      return new Observable(obs => { obs.next(); obs.complete(); });
    }
    return refreshToken
      ? this.api.logout(refreshToken)
      : new Observable<void>(obs => { obs.next(); obs.complete(); });
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

  /** Store tokens and mark session as OAuth (used by OAuthFlowService after callback). */
  public setTokensAndMarkOAuth(token: TokenResponse): void {
    this.setTokens(token);
    localStorage.setItem(AUTH_SOURCE, 'oauth');
  }

  public getRefreshToken(): string | null {
    return this._refreshToken() ?? localStorage.getItem(REFRESH_TOKEN);
  }

  public revokeToken(): void {
    this._token.set(null);
    this._refreshToken.set(null);
    this._profile.set(null);
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem(AUTH_SOURCE);
  }

  /** Load current user profile from backend. Call when token is set (e.g. after login or on app init). */
  public loadProfile(): Observable<UserProfile> {
    return this.api.authGetMe().pipe(
      map((me) => ({ name: me.name, surname: me.surname })),
      tap((p) => this._profile.set(p))
    );
  }
}
