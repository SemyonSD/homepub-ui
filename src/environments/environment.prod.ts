export const environment = {
  production: true,
  /** Backend API base (including /api/v1). Requests like auth/signup become {apiBaseUrl}/auth/signup */
  apiBaseUrl: 'https://homepub.onrender.com/api/v1',
  /**
   * OAuth 2.0 / OIDC. Set to null to disable.
   * To enable "Sign in with Google" (or another IdP), set the object below and ensure your
   * backend and Google Cloud Console redirect URI match this redirectUri, then rebuild.
   */
  oauth: {
    issuer: 'https://accounts.google.com',
    clientId: '1063796298360-ld2g54tbl3g08cvp9r8rig7i9vdrg8va.apps.googleusercontent.com',
    redirectUri: 'https://semyonsd.github.io/auth/callback',
    scope: 'openid profile email',
    oauthOnly: false,
  },
};

export type { OAuthEnvironmentConfig } from './environment.types';
