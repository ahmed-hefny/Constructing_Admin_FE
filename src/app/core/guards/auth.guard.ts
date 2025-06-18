import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services';
import { LOGIN_URL } from '../constants/app.constants';

export const AuthGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    // Check if token exists in localStorage
    const token = authService.getToken();
    if (token) {
        // Token exists, allow access
        return true;
    }

    // No token found, redirect to login
    router.navigate([LOGIN_URL], {
        queryParams: { returnUrl: state.url }
    });
    return false;
};
