export interface OAuthEnvironmentConfig {
  issuer: string;
  clientId: string;
  redirectUri: string;
  scope: string;
  oauthOnly?: boolean;
  /** Optional. Required by Google for "Web application" client type; omit for "Desktop app". */
  clientSecret?: string;
}
