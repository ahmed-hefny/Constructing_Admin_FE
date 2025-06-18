import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services';

export const NotAuthGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    // Check if token exists in localStorage
    const token = authService.getToken();
    
    if (!token) {
        // No token found, user is not authenticated, allow access
        return true;
    }

    // Token exists, user is authenticated, redirect to home
    router.navigate(['/']);
    return false;
};
