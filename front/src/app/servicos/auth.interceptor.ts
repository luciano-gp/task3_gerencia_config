import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, from, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private auth = inject(AuthService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.endsWith('/refresh-token')) {
      return next.handle(req);
    }

    const token = this.auth.getToken();

    let reqClone = req;
    reqClone = req.clone({
      ...(token && {
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      }),
      withCredentials: true,
    });

    return next.handle(reqClone).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return from(this.auth.refreshToken()).pipe(
            switchMap(novoToken => {
              const novoReq = req.clone({
                setHeaders: { Authorization: `Bearer ${novoToken}` },
                withCredentials: true,
              });
              return next.handle(novoReq);
            }),
            catchError(() => throwError(() => error))
          );
        }

        return throwError(() => error);
      })
    );
  }
}
