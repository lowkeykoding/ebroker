import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import {HlmField, HlmFieldLabel} from '@spartan-ng/helm/field';
import {HlmInput} from '@spartan-ng/helm/input';
import {HlmButton} from '@spartan-ng/helm/button';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, HlmField, HlmFieldLabel, HlmInput, HlmButton, HlmButton, NgOptimizedImage],
  templateUrl: 'login.component.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set(null);

    const { email, password } = this.form.getRawValue();

    try {
      await this.authService.login(email, password);
      this.router.navigateByUrl('/listings');
    } catch {
      this.error.set('Invalid email or password.');
      this.loading.set(false);
    }
  }
}
