import { Routes } from "@angular/router";

export default [
    {
        path: '',
        loadComponent: () => import('./users.component').then(m => m.UsersComponent)
    },
    {
        path: 'create',
        loadComponent: () => import('./create-user/create-user.component').then(m => m.CreateUserComponent)
    }
] as Routes