import type { OAuthEnvironmentConfig } from './environment.types';

/** Docker build (--configuration=docker). apiBaseUrl '' = relative /api/v1/; nginx proxies. redirectUri __APP_ORIGIN__ replaced at build by APP_ORIGIN. */
export const environment = {
  production: true,
  apiBaseUrl: '',
  oauth: {
    issuer: 'https://accounts.google.com',
    clientId: '1063796298360-pkhmqt0d2jvoa2p4iqa0oludihplrl05.apps.googleusercontent.com',
    redirectUri: '__APP_ORIGIN__/auth/callback',
    scope: 'openid profile email',
    oauthOnly: false,
  },
};

export type { OAuthEnvironmentConfig } from './environment.types';
