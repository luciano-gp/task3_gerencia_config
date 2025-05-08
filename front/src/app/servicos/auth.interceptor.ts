import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, from, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private auth = inject(AuthService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.getToken();

    let reqClone = req;
    if (token) {
      reqClone = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
    }

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
            })
          );
        }

        return throwError(() => error);
      })
    );
  }
}
