import { inject, Injectable, Signal, WritableSignal, signal } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { HttpService } from './http.service';
import { LoginRequest, LoginResponse, DecodedToken, AuthUser } from '../models/auth.models';
import { TOKEN_KEY, USER_KEY } from '../constants/keys.constants';
import { Router } from '@angular/router';
import { LOGIN_URL, SystemRoles } from '../constants/app.constants';
@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private httpService: HttpService = inject(HttpService);
    private router: Router = inject(Router);
    user: WritableSignal<AuthUser | null> = signal<AuthUser | null>(null);
    /**
     * Login user with credentials
     */
    login(credentials: LoginRequest): Observable<LoginResponse> {
        return this.httpService.post<LoginResponse>('User/login', credentials).pipe(
            tap(response => {
                if (response.token) {
                    this.setToken(response.token);
                    this.setUser();
                    this.redirectToHomePage();
                }
            }),
            catchError(error => {
                this.clearAuthData();
                return throwError(() => error);
            })
        );
    }

    constructor() {
        this.setUser();
    }

    setUser(): void {
        const token = this.getStoredToken();
        if (token) {
            const decodedToken = this.decodeToken(token);
            if (decodedToken) {
                this.user.set({
                    nameid: decodedToken.nameid,
                    uniqueName: decodedToken.unique_name,
                    role: decodedToken.role,
                    companyId: decodedToken.CompanyId,
                    projectId: decodedToken.ProjectId
                });
            }
        } else {
            this.user.set(null);
        }

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
    hasRole(role: SystemRoles | SystemRoles[]): boolean {
        const decodedToken = this.decodeToken();
        if (!decodedToken || !decodedToken.role) return false;
        if (Array.isArray(role)) {
            return role.includes(decodedToken.role);
        } else {
            return decodedToken?.role === role;
        }
    }

    public redirectToHomePage(): void {
        const user = this.user();
        let returnUrl = '/';
        if (user?.role === SystemRoles.EMPLOYEE) {
            returnUrl = `/payloads/${user?.projectId}/${user?.companyId}/upload`;
        } else if (user?.role === SystemRoles.Supervisor) {
            returnUrl = `/view/${user?.projectId}`;
        }
        this.router.navigateByUrl(returnUrl);
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
