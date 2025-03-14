import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  FormBuilder, 
  FormGroup, 
  Validators, 
  ReactiveFormsModule 
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../../../core/services/auth.service';

interface LoginErrorResponse {
  success: boolean;
  message?: string;
  error?: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  template: `
    <div class="login-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Login</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field>
              <input 
                matInput 
                placeholder="Email" 
                formControlName="email"
                type="email"
              >
              <mat-error *ngIf="email?.invalid && (email?.dirty || email?.touched)">
                Please enter a valid email
              </mat-error>
            </mat-form-field>

            <mat-form-field>
              <input 
                matInput 
                placeholder="Password" 
                formControlName="password"
                type="password"
              >
              <mat-error *ngIf="password?.invalid && (password?.dirty || password?.touched)">
                Password is required
              </mat-error>
            </mat-form-field>

            <button 
              mat-raised-button 
              color="primary" 
              type="submit"
              [disabled]="loginForm.invalid">
              Login
            </button>
          </form>
        </mat-card-content>
        <mat-card-actions>
          <p>
            Don't have an account? 
            <a [routerLink]="['/register']">Register here</a>
          </p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    mat-card {
      width: 400px;
    }
    mat-form-field {
      width: 100%;
      margin-bottom: 15px;
    }
    button {
      width: 100%;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      
      this.authService.login({ email, password }).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Login successful', 'Close', { duration: 3000 });
            this.router.navigate(['/gadgets']);
          } else {
            this.snackBar.open(
              response.message || 'Login failed', 
              'Close', 
              { duration: 3000 }
            );
          }
        },
        error: (error: HttpErrorResponse) => {
          const errorResponse = error.error as LoginErrorResponse;
          const errorMessage = errorResponse.message || 
                                errorResponse.error || 
                                'Login error';
          
          this.snackBar.open(errorMessage, 'Close', { duration: 3000 });
        }
      });
    }
  }
}