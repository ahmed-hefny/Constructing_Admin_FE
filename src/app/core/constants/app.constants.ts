import { PaginationConfig, PaginationRequest } from "../models";

export const LOGIN_URL = '/auth/login';

export enum SystemRoles {
    ADMIN = 'admin',
    SUPER_VISOR = 'supervisor',
    EMPLOYEE = 'employee',
}


export const SYSTEM_ROLES_OPTIONS = [
    { label: 'مسئول', value: SystemRoles.ADMIN },
    { label: 'مشرف', value: SystemRoles.SUPER_VISOR },
    { label: 'موظف', value: SystemRoles.EMPLOYEE },
]

export const PAGINATION_OPTIONS = [10, 20, 30, 50, 100];

export const Default_PAGINATION: PaginationConfig = {
    pageNumber: 1,
    pageSize: 10,
    totalRecords: 0,
    rowsPerPageOptions: PAGINATION_OPTIONS,
    showCurrentPageReport: true,
    showFirstLastIcon: false,
    currentPageReportTemplate: 'عرض {first} إلى {last} من أصل {totalRecords}'
}