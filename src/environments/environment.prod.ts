import type { OAuthEnvironmentConfig } from './environment.types';

export const environment = {
  production: true,
  apiBaseUrl: 'https://homepub.onrender.com/api/v1',
  oauth: {
    issuer: 'https://accounts.google.com',
    clientId: '1063796298360-6oda4m6fggsgm1ns7a9v4jbha3a16em5.apps.googleusercontent.com',
    redirectUri: 'https://semyonsd.github.io/homepub-ui/auth/callback',
    scope: 'openid profile email',
    oauthOnly: false,
  },
};

export type { OAuthEnvironmentConfig } from './environment.types';
