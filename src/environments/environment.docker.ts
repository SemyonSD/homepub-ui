import type { OAuthEnvironmentConfig } from './environment.types';

/**
 * Used when building the UI for Docker (e.g. ng build --configuration=docker).
 * apiBaseUrl is empty so the app uses relative /api/v1/; nginx proxies to the backend.
 * redirectUri: __APP_ORIGIN__ is replaced at Docker build time via APP_ORIGIN build arg
 * (default http://localhost:4200 for Compose; for Render use https://your-app.onrender.com).
 */
export const environment = {
  production: true,
  apiBaseUrl: '',
  oauth: {
    issuer: 'https://accounts.google.com',
    clientId: '1063796298360-ld2g54tbl3g08cvp9r8rig7i9vdrg8va.apps.googleusercontent.com',
    redirectUri: '__APP_ORIGIN__/auth/callback',
    scope: 'openid profile email',
    oauthOnly: false,
  },
};

export type { OAuthEnvironmentConfig } from './environment.types';
