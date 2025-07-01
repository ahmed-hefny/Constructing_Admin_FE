import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const hasRoleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const roles = route.data?.['roles'];
  const result = authService.hasRole(roles);
  const router: Router = inject(Router);
  if (result) {
    return true;
  } else {
    console.error('No valid roles provided in route data');
    router.navigate(['/']);
    return false;
  }
};