import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthTokenDto, AuthUser } from '../models/auth-user.model';

const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const USER_KEY = 'auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  currentUser = signal<AuthUser | null>(this.loadStoredUser());
  isAuthenticated = computed(() => this.currentUser() !== null);

  private loadStoredUser(): AuthUser | null {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? (JSON.parse(stored) as AuthUser) : null;
    } catch {
      return null;
    }
  }

  async login(email: string, password: string): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<AuthTokenDto>(`${environment.apiUrl}/api/auth/login`, { email, password })
    );
    this.storeSession(response);
  }

  async register(email: string, password: string): Promise<void> {
    await firstValueFrom(
      this.http.post(`${environment.apiUrl}/api/auth/register`, { email, password })
    );
  }

  logout(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUser.set(null);
    this.router.navigateByUrl('/auth/login');
  }

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  private storeSession(dto: AuthTokenDto): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, dto.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, dto.refreshToken);
    const user: AuthUser = { id: dto.userId, email: dto.email };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.currentUser.set(user);
  }
}
