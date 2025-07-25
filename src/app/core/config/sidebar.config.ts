import { SystemRoles } from '../constants/app.constants';
export const MENU_ITEMS = [
    {
        label: 'المشروعات',
        icon: 'pi pi-briefcase',
        routerLink: ['/'],
        roles: [SystemRoles.ADMIN, SystemRoles.EMPLOYEE],
    },
    {
        label: 'المستخدمين',
        icon: 'pi pi-users',
        routerLink: ['/users'],
        roles: [SystemRoles.ADMIN],
    },
    {
        label: 'الشركات',
        icon: 'pi pi-building',
        routerLink: ['/companies'],
        roles: [SystemRoles.ADMIN],
    },

]