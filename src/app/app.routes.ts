import { Routes } from '@angular/router';
import { AuthGuard, NotAuthGuard } from './core/guards';
import { EnhancedScannerComponent } from './shared/components/enhanced-scanner.component';

export const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        loadChildren: () => import('./home/home.routes')
    },
    {
        path: 'poc',
        loadComponent: () => EnhancedScannerComponent
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
