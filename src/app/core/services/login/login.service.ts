import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../../interfaces/user/user';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = environment.base_api; // Reemplaza con tu endpoint real
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private authTokenKey = 'authToken';
  private userDataKey = 'userData';

  constructor(private http: HttpClient, private router: Router) {
    this.checkAuthStatus();
  }

  // Verifica si hay un token almacenado al iniciar el servicio
  private checkAuthStatus(): void {
    const token = localStorage.getItem(this.authTokenKey);
    this.isAuthenticatedSubject.next(!!token);
  }

  // Login
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl+'/login', { email, password }).pipe(
      tap((response) => {
        if (response.token && response.user) {
          // Almacenar token y datos de usuario
          localStorage.setItem(this.authTokenKey, response.token);
          localStorage.setItem(this.userDataKey, JSON.stringify(response.user));
          this.isAuthenticatedSubject.next(true);
        }
      })
    );
  }

  // Logout
  logout(): void {
    localStorage.removeItem(this.authTokenKey);
    localStorage.removeItem(this.userDataKey);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  // Obtener token
  getToken(): string | null {
    return localStorage.getItem(this.authTokenKey);
  }

  // Obtener datos de usuario
  getUserData(): any {
    const userData = localStorage.getItem(this.userDataKey);
    return userData ? JSON.parse(userData) : null;
  }

  // Verificar estado de autenticación
  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }
}
