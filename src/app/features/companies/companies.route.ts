import { Routes } from "@angular/router";

export default [
    {
        path: '',
        loadComponent: () => import('./company-list-page/company-list-page.component').then(m => m.CompanyListPageComponent),
    },
    {
        path: 'create',
        loadComponent: () => import('./add-edit-company/add-edit-company.component').then(m => m.AddEditCompanyComponent),
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./add-edit-company/add-edit-company.component').then(m => m.AddEditCompanyComponent),
    }
] as Routes