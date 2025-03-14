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

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
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
    <div class="register-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Register</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <mat-form-field>
              <input 
                matInput 
                placeholder="Username" 
                formControlName="username"
              >
              <mat-error *ngIf="username?.invalid && (username?.dirty || username?.touched)">
                Username is required
              </mat-error>
            </mat-form-field>

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
                Password must be at least 6 characters
              </mat-error>
            </mat-form-field>

            <button 
              mat-raised-button 
              color="primary" 
              type="submit"
              [disabled]="registerForm.invalid">
              Register
            </button>
          </form>
        </mat-card-content>
        <mat-card-actions>
          <p>
            Already have an account? 
            <a [routerLink]="['/login']">Login here</a>
          </p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
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
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get username() { return this.registerForm.get('username'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Registration successful', 'Close', { duration: 3000 });
            this.router.navigate(['/login']);
          } else {
            this.snackBar.open('Registration failed', 'Close', { duration: 3000 });
          }
        },
        error: (error) => {
          this.snackBar.open('Registration error', 'Close', { duration: 3000 });
        }
      });
    }
  }
}