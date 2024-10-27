import {computed, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {Observable, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";

interface TokenResponse {
  access_token: string
}

const ACCESS_TOKEN = 'access_token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _token: WritableSignal<string | null> = signal(null);

  constructor(private httpClient: HttpClient) {
  }

  public signIn(payload: { username: string, password: string }): Observable<any> {
    return this.httpClient.post<TokenResponse>('auth/login', payload).pipe(
      tap((token: TokenResponse) => this.token = token)
    )
  }

  public signUp(payload: {name: string, surname: string, username: string, password: string }): Observable<any> {
    return this.httpClient.post<TokenResponse>('auth/signup', payload)
  }

  public get token(): Signal<any> {
    return computed(() => this._token() || localStorage.getItem(ACCESS_TOKEN));
  }

  public set token(token: TokenResponse) {
    this._token.set(token.access_token);
    localStorage.setItem(ACCESS_TOKEN, token.access_token);
  }

  public revokeToken(): void {
    this._token.set(null)
    localStorage.removeItem(ACCESS_TOKEN);
  }
}
