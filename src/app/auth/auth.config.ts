import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from '../../environments/environment';

/**
 * OAuth 2.0 / OIDC config for Authorization Code flow with PKCE.
 * Used only when environment.oauth is set.
 */
export function getOAuthConfig(): AuthConfig | null {
  const oauth = environment.oauth;
  if (!oauth) {
    return null;
  }
  return {
    issuer: oauth.issuer,
    clientId: oauth.clientId,
    redirectUri: oauth.redirectUri,
    scope: oauth.scope,
    responseType: 'code',
    showDebugInformation: !environment.production,
    strictDiscoveryDocumentValidation: false,
    useSilentRefresh: false,
  };
}

export const authConfig = getOAuthConfig();
