import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../../interfaces/user/user';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = environment.base_api;
  private apiWebUrl = environment.base_web_api;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  //private authTokenKey = 'authToken';
  private userDataKey = 'userData';

  constructor(private http: HttpClient, private router: Router) {
    this.checkAuthStatus();
  }

  // Verifica si hay un token almacenado al iniciar el servicio
  private checkAuthStatus(): void {
    this.http
      .get<{ authenticated: boolean }>(`${this.apiUrl}/check-auth`, {
        withCredentials: true,
      })
      .subscribe({
        next: (res) => this.isAuthenticatedSubject.next(res.authenticated),
        error: () => this.isAuthenticatedSubject.next(false),
      });
  }

  getCsrfToken() {
    return this.http.get(`${this.apiWebUrl}/sanctum/csrf-cookie`, {
      responseType: 'text'
    });
  }

  login(email: string, password: string) {
    return this.getCsrfToken().pipe(
      switchMap(() => {
        return this.http.post<any>(
          `${this.apiUrl}/login`,
          { email, password },
          { observe: 'response' }
        ).pipe(
          tap(response => {
            if (response.status === 200) {
              localStorage.setItem('userData', JSON.stringify(response.body.user));
              this.router.navigate(['/home']);
              this.isAuthenticatedSubject.next(true);
            }
          })
        );
      })
    );
  }


  logout(): void {
    this.http
      .post(
        `${this.apiUrl}/logout`,
        {},
        {
          withCredentials: true,
        }
      )
      .subscribe({
        complete: () => {
          localStorage.removeItem(this.userDataKey);
          this.isAuthenticatedSubject.next(false);
          this.router.navigate(['/login']);
        },
      });
  }

  getUserData(): any {
    const userData = localStorage.getItem(this.userDataKey);
    return userData ? JSON.parse(userData) : null;
  }

  // Verificar estado de autenticación
  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }
}
