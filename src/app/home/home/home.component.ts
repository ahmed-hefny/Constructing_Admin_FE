import { Component, inject } from '@angular/core';
import { AuthService, RtlService } from '../../core/services';
import { ButtonModule } from 'primeng/button';
import { RouterOutlet } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { MENU_ITEMS } from 'app/core/config/sidebar.config';
import { AuthUser } from 'app/core/models';
import { RtlDirective } from 'app/shared/directives/rtl.directive';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-home',
  imports: [
    RouterOutlet,
    ButtonModule,
    MenuModule,
    AvatarModule,
    BadgeModule,
    RippleModule,
    CommonModule,
    RtlDirective
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private authService: AuthService = inject(AuthService);

  sidebarVisible: boolean = false;
  menuItems: MenuItem[] = [];
  user: AuthUser | null = this.authService.user();
  version: string = environment?.version;
  constructor() {
    this.initializeMenuItems();
  }

  private initializeMenuItems(): void {
    this.menuItems = [
      {
        items: MENU_ITEMS?.map(item => {
          return {
            ...item,
            visible: this.authService.hasRole(item?.roles || []),
            command: () => this.toggleSidebar(),
            routerLinkActiveOptions: { exact: true }
          }
        })
      }
    ]
  }

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }

  logout(): void {
    this.authService.logout();
  }
}
