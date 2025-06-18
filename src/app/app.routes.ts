import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./home/home.routes')
    },
    {
        path: 'auth',
        loadChildren: () => import('./core/auth/auth.routes')
    },
    {
        path: '**',
        redirectTo: 'auth',
        pathMatch: 'full'
    }
];
