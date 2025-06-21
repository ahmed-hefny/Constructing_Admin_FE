import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { HttpService } from './http.service';
import { LoginRequest, LoginResponse, DecodedToken } from '../models/auth.models';
import { TOKEN_KEY, USER_KEY } from '../constants/keys.constants';
import { Router } from '@angular/router';
import { LOGIN_URL } from '../constants/app.constants';
@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private httpService: HttpService = inject(HttpService);
    private router: Router = inject(Router);
    /**
     * Login user with credentials
     */
    login(credentials: LoginRequest): Observable<LoginResponse> {
        return this.httpService.post<LoginResponse>('User/login', credentials).pipe(
            tap(response => {
                if (response.token) {
                    this.setToken(response.token);

                    const decodedToken = this.decodeToken(response.token);
                    console.log('Decoded Token:', decodedToken);
                }
            }),
            catchError(error => {
                this.clearAuthData();
                return throwError(() => error);
            })
        );
    }

    /**
     * Logout user
     */
    logout(): void {
        this.clearAuthData();
        this.router.navigate([LOGIN_URL]);
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return this.getToken() !== null;
    }

    /**
     * Get current token
     */
    getToken(): string | null {
        return this.getStoredToken();
    }

    /**
     * Decode JWT token
     */
    decodeToken(token?: string): DecodedToken | null {
        const tokenToDecoder = token || this.getStoredToken();

        if (!tokenToDecoder) {
            return null;
        }

        try {
            return jwtDecode<DecodedToken>(tokenToDecoder);
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }

    /**
     * Check if user has specific role
     */
    hasRole(role: string | string[]): boolean {
        const decodedToken = this.decodeToken();
        if (!decodedToken || !decodedToken.role) return false;
        if (Array.isArray(role)) {
            return role.includes(decodedToken.role);
        } else {
            return decodedToken?.role === role;
        }
    }

    // Private helper methods

    private setToken(token: string): void {
        localStorage.setItem(TOKEN_KEY, token);
    }

    private getStoredToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    }

    private clearAuthData(): void {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }
}
