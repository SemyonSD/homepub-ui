import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {TuiAlertService, TuiNotification} from "@taiga-ui/core";
import {Router} from "@angular/router";
import {fromPromise} from "rxjs/internal/observable/innerFrom";
import {catchError, defer, map, Observable, of, switchMap, take, tap, throwError} from "rxjs";
import {AuthService} from "../../auth/auth.service";


@Injectable()
export class CatchErrorInterceptor implements HttpInterceptor {
  constructor(public router: Router,
              private alertService: TuiAlertService,
              private authService: AuthService) {
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(err => {
        const request = err?.error != null ? err : { error: err, status: 0 };
        return defer(() =>
          request.error?.error instanceof Blob
            ? fromPromise(request.error.error.text()).pipe(
                map((errorDetails) => ({
                  ...request,
                  error: { ...request.error, error: JSON.parse(errorDetails as string) },
                }))
              )
            : of(request)
        ).pipe(
          tap((response) => {
            const body = response?.error;
            const message = typeof body?.message === 'object' ? (body.message as string[]).join('; ') : body?.message;
            const errorLabel = body?.error;
            if (response?.status === 400) {
              this.showAlert(message ?? 'Bad request', errorLabel ?? 'Error');
            } else if (response?.status === 401) {
              this.showAlert(message ?? 'Unauthorized', errorLabel ?? 'Error');
              this.authService.revokeToken();
              this.router.navigate(['/auth']).then();
            } else if (response?.status === 504) {
              this.showAlert(response?.error ?? 'Gateway Timeout', response?.statusText ?? '');
            }
          }),
          switchMap((parsedError) => throwError(() => parsedError))
        );
      })
    );
  }

  private showAlert(message: string, label: string): void {
    this.alertService.open(message, {
      label: label,
      status: TuiNotification.Error,
      autoClose: false
    }).pipe(
      take(1)
    ).subscribe();
  }
}
