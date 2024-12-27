import { HttpInterceptorFn } from '@angular/common/http';
import {catchError, throwError} from "rxjs";
import {AuthService} from "../services/auth.service";
import {inject} from "@angular/core";

export const httpAppInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService)
  if(!req.url.includes('auth/login')) {
    let token = window.localStorage.getItem("jwt-token");
    let request = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + token)
    })
    return next(request).pipe(
      catchError(err => {
          if (err.status==401){
            authService.logout()
          }
          throw err
        }
      )
    );
  }
  return next(req);
};
