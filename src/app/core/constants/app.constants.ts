import { PaginationRequest } from "../models";

export const LOGIN_URL = '/auth/login';

export enum SystemRoles {
    ADMIN = 'admin',
    SUPER_VISOR = 'supervisor',
    EMPLOYEE = 'employee',
}


export const SYSTEM_ROLES_OPTIONS = [
    { label: 'Admin', value: SystemRoles.ADMIN },
    { label: 'Supervisor', value: SystemRoles.SUPER_VISOR },
    { label: 'Employee', value: SystemRoles.EMPLOYEE },
]

export const Default_PAGINATION: PaginationRequest = {
    pageNumber: 1,
    pageSize: 10,
}