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
                pathMatch: 'full'
            },
            {
                path: 'users',
                loadChildren: () => import('features/users/users.routes'),
                pathMatch: 'full'

            }
        ]
    }
] as Routes;