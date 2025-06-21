import { Routes } from "@angular/router";

export default [
    {
        path: '',
        loadComponent: () => import('./projects.component').then(m => m.ProjectsComponent)
    }
] as Routes;