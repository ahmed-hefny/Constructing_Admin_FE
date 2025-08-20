import { SystemRoles } from '../constants/app.constants';
export const MENU_ITEMS = [
    {
        label: 'المشاريع',
        icon: 'pi pi-briefcase',
        routerLink: ['/'],
        roles: [SystemRoles.ADMIN, SystemRoles.Supervisor, SystemRoles.EMPLOYEE],
    },
    {
        label: 'الشركات',
        icon: 'pi pi-building',
        routerLink: ['/companies'],
        roles: [SystemRoles.ADMIN],
    },
    {
        label: 'المستخدمين',
        icon: 'pi pi-users',
        routerLink: ['/users'],
        roles: [SystemRoles.ADMIN, SystemRoles.Supervisor],
    },

]