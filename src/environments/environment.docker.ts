import type { OAuthEnvironmentConfig } from './environment.types';

/**
 * Used when building the UI for Docker Compose (e.g. ng build --configuration=docker).
 * apiBaseUrl is empty so the app uses relative /api/v1/; nginx in the container proxies to the backend.
 * OAuth redirectUri should match the URL the user sees (e.g. http://localhost:4200 when using port 4200).
 */
export const environment = {
  production: true,
  apiBaseUrl: '',
  oauth: {
    issuer: 'https://accounts.google.com',
    clientId: '1063796298360-ld2g54tbl3g08cvp9r8rig7i9vdrg8va.apps.googleusercontent.com',
    redirectUri: 'http://localhost:4200/auth/callback',
    scope: 'openid profile email',
    oauthOnly: false,
  },
};

export type { OAuthEnvironmentConfig } from './environment.types';
