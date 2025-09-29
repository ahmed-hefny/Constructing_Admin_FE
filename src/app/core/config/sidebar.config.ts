import { SystemRoles } from '../constants/app.constants';
export const MENU_ITEMS = [
    {
        label: 'المشاريع',
        icon: 'pi pi-briefcase',
        routerLink: ['/'],
        roles: [SystemRoles.ADMIN, SystemRoles.EMPLOYEE],
    },
    {
        label: 'تفاصيل المشروع',
        icon: 'pi pi-briefcase',
        routerLink: ['/view'],
        roles: [SystemRoles.Supervisor],
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
    {
        label: 'قائمة الحمولات',
        icon: 'pi pi-truck',
        routerLink: ['/payloads'],
        roles: [SystemRoles.Supervisor, SystemRoles.EMPLOYEE],
    },

]