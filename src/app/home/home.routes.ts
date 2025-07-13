import { HomeComponent } from './home/home.component';
import { Routes } from "@angular/router";

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
                loadChildren: () => import('features/payloads/payloads.routes'),
            },
            {
                path: 'users',
                loadChildren: () => import('features/users/users.routes'),

            },
            {
                path: 'companies',
                loadChildren: () => import('features/companies/companies.route'),
            }
        ]
    }
] as Routes;