import { LoginService } from 'src/app/core/services/login/login.service';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

export const AuthGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  return loginService.checkAuth().pipe(
    map(response => {
      if (response.authenticated) {
        return true;
      } else {
        loginService.logout();
        router.navigate(['/login']);
        return false;
      }
    }),
    catchError(() => {
      loginService.logout();
      router.navigate(['/login']);
      return of(false);
    })
  );
};
