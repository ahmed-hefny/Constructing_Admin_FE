import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CardModule,
    MessageModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  inputForm!: UntypedFormGroup;
  isLoading = false;
  errorMessage = '';
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  ngOnInit(): void {
    this.inputForm = new UntypedFormGroup({
      username: new UntypedFormControl('', [Validators.required]),
      password: new UntypedFormControl('', [Validators.required])
    });
  }

  login(): void {
    if (this.inputForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    const credentials = this.inputForm.value;
    
    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.isLoading = false;
        this.router.navigate(['']);  // Redirect to dashboard or home page
        // Handle successful login, e.g., redirect to dashboard
      },
      error: (error) => {
        console.error('Login failed:', {error});
        this.isLoading = false;
        this.errorMessage = error.error;
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.inputForm.controls).forEach(key => {
      const control = this.inputForm.get(key);
      control?.markAsTouched();
    });
  }

  get usernameControl() {
    return this.inputForm.get('username');
  }

  get passwordControl() {
    return this.inputForm.get('password');
  }
}
