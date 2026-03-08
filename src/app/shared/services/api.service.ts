import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Recipe } from '../models/recipe.model';
import { TokenResponse } from '../interfaces/auth.interface';

/**
 * Centralized backend API client.
 * All HTTP requests to our backend go through this service.
 * Base URL and auth header are applied by the URL and Token interceptors.
 */
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  // ─── Auth ─────────────────────────────────────────────────────────────────

  /**
   * Sign in with username and password.
   * Returns access and refresh tokens; store them for subsequent API calls.
   */
  login(payload: { username: string; password: string }): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>('auth/login', payload, { observe: 'response' })
      .pipe(map((res) => res.body!));
  }

  /**
   * Register a new user (name, surname, username, password).
   * Does not log the user in; call login after signup if needed.
   */
  signup(payload: {
    name: string;
    surname: string;
    username: string;
    password: string;
  }): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>('auth/signup', payload, { observe: 'response' })
      .pipe(map((res) => res.body!));
  }

  /**
   * Exchange a valid refresh token for a new access token (and optionally a new refresh token).
   * Use when the access token has expired and you receive 401.
   */
  refresh(refreshToken: string): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>('auth/refresh', { refresh_token: refreshToken }, { observe: 'response' })
      .pipe(map((res) => res.body!));
  }

  /**
   * Invalidate the given refresh token on the server.
   * Call before clearing local tokens on logout.
   */
  logout(refreshToken: string): Observable<void> {
    return this.http
      .post('auth/logout', { refresh_token: refreshToken }, { observe: 'response' })
      .pipe(map(() => undefined));
  }

  // ─── OAuth ─────────────────────────────────────────────────────────────────

  /**
   * Exchange OAuth authorization code (and PKCE verifier) for IdP tokens.
   * Backend calls the IdP token endpoint with client_secret; returns id_token, access_token, etc.
   */
  oauthExchangeCode(body: {
    code: string;
    code_verifier: string;
    redirect_uri: string;
  }): Observable<TokenResponse & { id_token?: string }> {
    return this.http.post<TokenResponse & { id_token?: string }>('auth/oauth/token', body);
  }

  /**
   * Exchange IdP token (e.g. Google id_token) for backend-issued access and refresh tokens.
   * Call after oauthExchangeCode; then use the returned tokens for all API calls.
   */
  oauthCreateSession(accessToken: string): Observable<TokenResponse> {
    return this.http.post<TokenResponse>('auth/oauth/session', { access_token: accessToken });
  }

  // ─── Recipes ───────────────────────────────────────────────────────────────

  /**
   * Fetch all recipes for the current user.
   */
  recipesGetAll(): Observable<Recipe[]> {
    return this.http
      .get<Recipe[]>('recipes', { observe: 'response' })
      .pipe(map((res) => res.body ?? []));
  }

  /**
   * Fetch recipes whose title contains the given string (case-insensitive).
   * Backend endpoint: GET recipes/by-titles?title=...
   */
  recipesGetByTitle(title: string): Observable<Recipe[]> {
    return this.http
      .get<Recipe[]>('recipes/by-titles', { params: { title }, observe: 'response' })
      .pipe(map((res) => res.body ?? []));
  }

  /**
   * Fetch a single recipe by id.
   */
  recipesGetById(id: string): Observable<Recipe> {
    return this.http
      .get<Recipe>(`recipes/${id}`, { observe: 'response' })
      .pipe(map((res) => res.body!));
  }

  /**
   * Create a new recipe. Returns the created recipe from the response body.
   */
  recipesCreate(recipe: Recipe): Observable<Recipe> {
    return this.http
      .post<Recipe>('recipes', recipe, { observe: 'response' })
      .pipe(map((res) => res.body!));
  }

  /**
   * Update an existing recipe by id.
   */
  recipesUpdate(id: string, recipe: Recipe): Observable<Recipe> {
    return this.http
      .put<Recipe>(`recipes/${id}`, recipe, { observe: 'response' })
      .pipe(map((res) => res.body!));
  }

  /**
   * Delete a recipe by id.
   */
  recipesDelete(id: string): Observable<void> {
    return this.http
      .delete(`recipes/${id}`, { observe: 'response' })
      .pipe(map(() => undefined));
  }
}
