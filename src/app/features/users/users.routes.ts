import { Route } from "@angular/router";

export default [
    {
        path: '',
        loadComponent: () => import('./users.component').then(m => m.UsersComponent)
    }
] as Route