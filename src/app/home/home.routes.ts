import { hasRoleGuard } from 'app/core/guards';
import { HomeComponent } from './home/home.component';
import { Routes } from "@angular/router";
import { SystemRoles } from 'app/core/constants/app.constants';

export default [
    {
        path: '',
        component: HomeComponent,
        children: [
            {
                path: '',
                loadChildren: () => import('features/projects/projects.routes'),
            },
            {
                path: 'payloads',
                canActivate: [hasRoleGuard],
                data: { roles: [SystemRoles.ADMIN, SystemRoles.EMPLOYEE, SystemRoles.SUPER_VISOR] },
                loadChildren: () => import('features/payloads/payloads.routes'),
            },
            {
                path: 'users',
                loadChildren: () => import('features/users/users.routes'),
                canActivate: [hasRoleGuard],
                data: { roles: [SystemRoles.ADMIN, SystemRoles.SUPER_VISOR] },
            },
            {
                path: 'companies',
                loadChildren: () => import('features/companies/companies.route'),
                canActivate: [hasRoleGuard],
                data: { roles: [SystemRoles.ADMIN] },
            }
        ]
    }
] as Routes;