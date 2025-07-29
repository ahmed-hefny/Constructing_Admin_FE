import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToasterService } from 'app/shared/services/toaster.service';

export const hasRoleGuard: CanActivateFn = (route, state) => {
  const toaster = inject(ToasterService);
  const authService = inject(AuthService);

  const roles = route.data?.['roles'];
  const result = authService.hasRole(roles);
  const router: Router = inject(Router);
  
  if (result) {
    return true;
  } else {
    console.error('No valid roles provided in route data');
    toaster.showError('ليس لديك صلاحية للوصول إلى هذه الصفحة');
    authService.redirectToHomePage();
    return false;
  }
};