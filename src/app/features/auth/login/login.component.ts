import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private readonly fb: FormBuilder;
  private readonly authService: AuthService;
  private readonly router: Router;

  readonly form: FormGroup;

  constructor(
    fb: FormBuilder,
    authService: AuthService,
    router: Router
  ) {
    this.fb = fb;
    this.authService = authService;
    this.router = router;
    this.form = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    this.authService.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.router.navigate(['/admin']);
      },
      error: () => {
        this.isSubmitting.set(false);
        this.errorMessage.set('Invalid email or password. Please try again.');
      },
      complete: () => {
        this.isSubmitting.set(false);
      }
    });
  }
}
