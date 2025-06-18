import { Routes } from '@angular/router';
import { AuthGuard, NotAuthGuard } from './core/guards';

export const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        loadChildren: () => import('./home/home.routes')
    },
    {
        path: 'auth',
        canActivate: [NotAuthGuard],
        loadChildren: () => import('./core/auth/auth.routes')
    },
    {
        path: '**',
        redirectTo: 'auth',
        pathMatch: 'full'
    }
];
