import { Routes } from "@angular/router";

export default [
    {
        path: '',
        loadComponent: () => import('./projects.component').then(m => m.ProjectsComponent)
    },
    {
        path: 'create-project',
        loadComponent: () => import('./add-edit-project/add-edit-project.component').then(m => m.AddEditProjectComponent)
    }
] as Routes;