import { Routes } from "@angular/router";
import { SystemRoles } from "app/core/constants/app.constants";
import { hasRoleGuard } from "app/core/guards";

export default [
    {
        path: ':projectId/:companyId',
        canActivate: [hasRoleGuard],
        loadComponent: () => import('./payloads.component').then(m => m.PayloadsComponent),
        data: {
            roles: [SystemRoles.ADMIN, SystemRoles.SUPER_VISOR]
        }
    }
];