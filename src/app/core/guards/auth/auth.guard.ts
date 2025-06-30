import { LoginService } from 'src/app/core/services/login/login.service';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';

export const AuthGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  return loginService.isAuthenticated().pipe(
    map(isAuth => {
      if (isAuth) {
        return true;
      } else {
        router.navigate(['/']);
        return false;
      }
    })
  );
};
