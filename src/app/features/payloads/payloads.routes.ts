import { Routes } from "@angular/router";
import { SystemRoles } from "app/core/constants/app.constants";
import { hasRoleGuard } from "app/core/guards";

export default [
    {
        path: ':projectId/:companyId',
        loadComponent: () => import('./payloads.component').then(m => m.PayloadsComponent),
    },
    {
        path: ':projectId/:companyId/upload',
        canActivate: [hasRoleGuard],
        loadComponent: () => import('./upload-payload/upload-payload.component').then(m => m.UploadPayloadComponent),
        data: {
            roles: [SystemRoles.ADMIN, SystemRoles.EMPLOYEE]
        }
    }
];