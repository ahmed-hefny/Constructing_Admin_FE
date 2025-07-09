import { Routes } from "@angular/router";
import { SystemRoles } from "app/core/constants/app.constants";
import { hasRoleGuard } from "app/core/guards";

export default [
    {
        path: '',
        loadComponent: () => import('./projects.component').then(m => m.ProjectsComponent)
    },
    {
        path: 'create',
        loadComponent: () => import('./add-edit-project/add-edit-project.component').then(m => m.AddEditProjectComponent),
        canActivate: [hasRoleGuard],
        data: {
            roles: [SystemRoles.ADMIN]
        }
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./add-edit-project/add-edit-project.component').then(m => m.AddEditProjectComponent),
        canActivate: [hasRoleGuard],
        data: {
            roles: [SystemRoles.ADMIN]
        }
    },
    {
        path: 'view/:id',
        loadComponent: () => import('./project-details/project-details.component').then(m => m.ProjectDetailsComponent),
        canActivate: [hasRoleGuard],
        data: {
            roles: [SystemRoles.ADMIN]
        }
    },

] as Routes;