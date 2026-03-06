import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {catchError, Observable, shareReplay, switchMap, take, throwError} from 'rxjs';
import {AuthService, TokenResponse} from '../../auth/auth.service';

function isRefreshRequest(req: HttpRequest<unknown>): boolean {
  return req.url.includes('auth/refresh');
}

function isUnauthorized(err: unknown): err is HttpErrorResponse {
  return err instanceof HttpErrorResponse && err.status === 401;
}

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
  /** Single in-flight refresh so concurrent 401s don't trigger multiple refresh calls (token rotation). */
  private refresh$: Observable<TokenResponse> | null = null;

  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((err: unknown) => {
        if (!isUnauthorized(err) || isRefreshRequest(req)) {
          return throwError(() => err);
        }

        const refreshToken = this.authService.getRefreshToken();
        if (!refreshToken) {
          return throwError(() => err);
        }

        if (!this.refresh$) {
          this.refresh$ = this.authService.refresh().pipe(
            shareReplay(1),
            catchError((e) => {
              this.refresh$ = null;
              return throwError(() => e);
            })
          );
        }

        return this.refresh$.pipe(
          take(1),
          switchMap(() => {
            this.refresh$ = null;
            return next.handle(req);
          }),
          catchError((refreshErr) => throwError(() => refreshErr))
        );
      })
    );
  }
}
