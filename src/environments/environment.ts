import type { OAuthEnvironmentConfig } from './environment.types';

export const environment = {
  production: false,
  /** Leave empty in dev: requests use relative /api (proxy to backend). */
  apiBaseUrl: '',
  /** OAuth 2.0 / OIDC for Google (or other IdP). Set to null to disable. */
  oauth: {
    issuer: 'https://accounts.google.com',
    clientId: '1063796298360-ld2g54tbl3g08cvp9r8rig7i9vdrg8va.apps.googleusercontent.com',
    redirectUri: 'http://localhost:4200/auth/callback',
    scope: 'openid profile email',
    oauthOnly: false,
  },
};

export type { OAuthEnvironmentConfig } from './environment.types';
