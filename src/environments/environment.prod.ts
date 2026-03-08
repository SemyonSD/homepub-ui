export const environment = {
  production: true,
  /** Backend API base (including /api/v1). Requests like auth/signup become {apiBaseUrl}/auth/signup */
  apiBaseUrl: 'https://homepub.onrender.com/api/v1',
  /** OAuth 2.0 / OIDC. Set to null to disable. For prod, use env at build time or set here. */
  oauth: null as import('./environment.types').OAuthEnvironmentConfig | null,
  // Example for production:
  // oauth: {
  //   issuer: 'https://your-oidc-issuer.example.com',
  //   clientId: 'your-client-id',
  //   redirectUri: 'https://your-app-domain.example.com/auth/callback',
  //   scope: 'openid profile email',
  //   oauthOnly: false,
  // },
};

export type { OAuthEnvironmentConfig } from './environment.types';
