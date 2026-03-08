import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {AuthService} from "../../auth/auth.service";

const AUTH_ENDPOINTS = ['auth/login', 'auth/signup', 'auth/refresh', 'auth/logout', 'auth/oauth/token', 'auth/oauth/session'];

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public authService: AuthService) {
  }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isAuthEndpoint = AUTH_ENDPOINTS.some(ep => request.url.includes(ep));
    const token = this.authService.token();

    if (isAuthEndpoint || !token) {
      return next.handle(request);
    }

    const clonedRequest = request.clone({
      setHeaders: {
        authorization: 'Bearer ' + token
      }
    });

    return next.handle(clonedRequest);
  }
}
