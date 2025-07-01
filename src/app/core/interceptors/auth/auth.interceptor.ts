import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookieService);

  // Clonar la solicitud para agregar credenciales y CSRF token
  const cloned = req.clone({
    withCredentials: true,
    setHeaders: {
      'X-XSRF-TOKEN': cookieService.get('XSRF-TOKEN') || ''
    }
  });

  return next(cloned);
};
