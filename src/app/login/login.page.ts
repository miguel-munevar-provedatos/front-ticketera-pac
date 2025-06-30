import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { CommonModule } from "@angular/common"
import { Router } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { LoginService } from 'src/app/core/services/login/login.service';
import { finalize } from 'rxjs';
@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  imports: [ReactiveFormsModule,CommonModule,IonicModule],
})
export class LoginPage {

  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;
  loginError: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loginService: LoginService,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {}

   get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onRegister() {
    this.router.navigate(['/register']);
  }

  onForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

    onSubmit() {
    if (this.loginForm.invalid) {
      // Marcar todos los campos como tocados para mostrar errores
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.loginError = null;

    const { email, password } = this.loginForm.value;

    this.loginService.login(email, password)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: () => {
          // Redirigir a la página principal después de iniciar sesión
          //this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Error de autenticación:', err);
          this.loginError = 'Credenciales incorrectas. Por favor, inténtalo de nuevo.';
        }
      });
  }

}
