import { Injectable, Optional, Signal, signal, WritableSignal } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { firstValueFrom } from 'rxjs';
import { getOAuthConfig } from './auth.config';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { TokenResponse } from '../shared/interfaces/auth.interface';
import { ApiService } from '../shared/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class OAuthFlowService {
  private _oauthInitialized = false;
  private _oauthLoading = signal(false);
  private _oauthError = signal<string | null>(null);

  get oauthLoading(): Signal<boolean> {
    return this._oauthLoading.asReadonly();
  }

  get oauthError(): Signal<string | null> {
    return this._oauthError.asReadonly();
  }

  constructor(
    private api: ApiService,
    private authService: AuthService,
    @Optional() private oauthService: OAuthService | null,
  ) {}

  /** Call once at app startup when OAuth is configured. Optional: preloads discovery doc. */
  initOAuth(): Promise<boolean> {
    const config = getOAuthConfig();
    if (!config || !this.oauthService) return Promise.resolve(false);
    this.oauthService.configure(config);
    return this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      this._oauthInitialized = true;
      if (this.oauthService?.hasValidAccessToken()) this.syncTokensFromOAuth();
      return true;
    }).catch(() => false);
  }

  /** Start OAuth 2.0 Authorization Code + PKCE flow (redirects to IdP). */
  loginWithOAuth(): void {
    if (!this.oauthService || !getOAuthConfig()) {
      this._oauthError.set('OAuth is not configured.');
      return;
    }
    this._oauthError.set(null);
    this._oauthLoading.set(true);
    if (!this._oauthInitialized) {
      this.oauthService.configure(getOAuthConfig()!);
      this._oauthInitialized = true;
    }
    (this.oauthService as unknown as { saveNoncesInLocalStorage: boolean }).saveNoncesInLocalStorage = true;
    this.oauthService.loadDiscoveryDocument()
      .then(() => this.oauthService!.initCodeFlow())
      .catch((err) => {
        this._oauthError.set(err?.message || err?.error?.message || 'OAuth sign-in failed.');
        this._oauthLoading.set(false);
      });
  }

  /**
   * Call from OAuth callback route after IdP redirect.
   * Uses only the backend for code→token exchange (client_secret stays on server).
   */
  handleOAuthCallback(): Promise<boolean> {
    const config = getOAuthConfig();
    if (!config) return Promise.resolve(false);

    const search = typeof window !== 'undefined' ? window.location.search : '';
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    const params = new URLSearchParams(search || hash.replace(/^#/, ''));
    const code = params.get('code');
    const codeVerifier = typeof window !== 'undefined'
      ? (localStorage.getItem('PKCE_verifier') || sessionStorage.getItem('PKCE_verifier'))
      : null;
    const redirectUri = config.redirectUri;

    const missing: string[] = [];
    if (!code) missing.push('code');
    if (!codeVerifier) missing.push('code_verifier');
    if (!redirectUri) missing.push('redirect_uri');

    if (missing.length > 0) {
      this._oauthError.set(`Missing: ${missing.join(', ')}. Try signing in again from the login page.`);
      return Promise.resolve(false);
    }

    return firstValueFrom(
      this.api.oauthExchangeCode({
        code: code!,
        code_verifier: codeVerifier!,
        redirect_uri: redirectUri!,
      }),
    )
      .then((idpToken) => {
        if (!idpToken?.access_token) return false;
        const idToken = idpToken.id_token || idpToken.access_token;
        return this.exchangeIdpTokenForBackendSession(idToken).then((backendToken) => {
          if (!backendToken) return false;
          this.authService.setTokensAndMarkOAuth(backendToken);
          return true;
        });
      })
      .catch((err) => {
        this._oauthError.set(err?.message || err?.error?.message || 'Sign-in failed. Is the backend running on port 3000?');
        return false;
      });
  }

  private exchangeIdpTokenForBackendSession(idpToken: string): Promise<TokenResponse | null> {
    return firstValueFrom(
      this.api.oauthCreateSession(idpToken),
    ).then((token) => token ?? null).catch(() => null);
  }

  private syncTokensFromOAuth(): void {
    const accessToken = this.oauthService?.getAccessToken();
    const refreshToken = this.oauthService?.getRefreshToken() ?? undefined;
    if (accessToken) {
      this.authService.setTokens({ access_token: accessToken, refresh_token: refreshToken });
    }
  }

  isOAuthEnabled(): boolean {
    return !!environment.oauth && !!getOAuthConfig();
  }
}
