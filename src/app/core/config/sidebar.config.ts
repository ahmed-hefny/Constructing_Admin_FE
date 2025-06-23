import { SystemRoles } from '../constants/app.constants';
export const MENU_ITEMS = [
    {
        label: 'projects',
        icon: 'pi pi-briefcase',
        routerLink: ['/'],
        roles: [SystemRoles.ADMIN, SystemRoles.EMPLOYEE],
    },
    {
        label: 'users',
        icon: 'pi pi-users',
        routerLink: ['/users'],
        roles: [SystemRoles.ADMIN],
    },
    {
        label: 'companies',
        icon: 'pi pi-building',
        routerLink: ['/companies'],
        roles: [SystemRoles.ADMIN],
    },

]