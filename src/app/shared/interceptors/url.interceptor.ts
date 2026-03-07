import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable()
export class UrlInterceptor implements HttpInterceptor {

  constructor() {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const base = environment.apiBaseUrl
      ? `${environment.apiBaseUrl.replace(/\/$/, '')}/`
      : '/api/v1/';
    request = request.clone({
      url: base + request.url,
      withCredentials: true
    });

    return next.handle(request);
  }
}
