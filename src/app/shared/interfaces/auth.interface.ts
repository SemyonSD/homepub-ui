/** Token pair returned by auth endpoints. */
export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  id_token?: string;
}
