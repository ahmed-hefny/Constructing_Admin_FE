import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services';
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

@Component({
  selector: 'app-home',
  imports: [
    RouterOutlet,
    ButtonModule,
    MenuModule,
    AvatarModule,
    BadgeModule,
    RippleModule,
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private authService: AuthService = inject(AuthService);

  sidebarVisible: boolean = false;
  menuItems: MenuItem[] = [];
  user: AuthUser | null = this.authService.user();
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
            // command: () => this.toggleSidebar(),
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
