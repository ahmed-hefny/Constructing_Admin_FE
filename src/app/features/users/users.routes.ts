import { Routes } from "@angular/router";

export default [
    {
        path: '',
        loadComponent: () => import('./users.component').then(m => m.UsersComponent)
    },
    {
        path: 'create',
        
        loadComponent: () => import('./add-edit-user/add-edit-user.component').then(m => m.CreateUserComponent)
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./add-edit-user/add-edit-user.component').then(m => m.CreateUserComponent)
    }
] as Routes