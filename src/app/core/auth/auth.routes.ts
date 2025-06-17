import { Routes } from '@angular/router';
export default [
    {
        path: 'login',
        loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
] as Routes;