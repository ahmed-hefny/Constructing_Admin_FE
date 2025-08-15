import { Component, inject } from "@angular/core";
import { AuthService, RtlService } from "../../core/services";
import { ButtonModule } from "primeng/button";
import { RouterOutlet } from "@angular/router";
import { MenuModule } from "primeng/menu";
import { AvatarModule } from "primeng/avatar";
import { BadgeModule } from "primeng/badge";
import { RippleModule } from "primeng/ripple";
import { CommonModule } from "@angular/common";
import { MenuItem } from "primeng/api";
import { MENU_ITEMS } from "app/core/config/sidebar.config";
import { AuthUser } from "app/core/models";
import { RtlDirective } from "app/shared/directives/rtl.directive";
import { environment } from "environments/environment";
import { DialogService } from "app/shared/services/dialog.service";
import { ConfirmDialogConfig } from "app/shared/models/dialog.models";

@Component({
  selector: "app-home",
  imports: [
    RouterOutlet,
    ButtonModule,
    MenuModule,
    AvatarModule,
    BadgeModule,
    RippleModule,
    CommonModule,
    RtlDirective,
  ],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss",
})
export class HomeComponent {

  sidebarVisible: boolean = false;
  menuItems: MenuItem[] = [];
  user: AuthUser | null ;
  version: string = environment?.version;
  private authService: AuthService = inject(AuthService);
  private dialogService: DialogService = inject(DialogService);
  constructor() {
    this.user = this.authService.user();
    this.initializeMenuItems();
  }

  private initializeMenuItems(): void {
    this.menuItems = [
      {
        items: MENU_ITEMS?.map((item) => {
          return {
            ...item,
            visible: this.authService.hasRole(item?.roles || []),
            command: () => this.toggleSidebar(),
            routerLinkActiveOptions: { exact: true },
          };
        }),
      },
    ];
  }

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }

  logout(): void {
    const config: ConfirmDialogConfig = {
      header: "تأكيد",
      closeOnEscape: true,
      icon: "pi pi-exclamation-triangle",
      acceptButtonStyleClass: "btn btn-error",
      rejectButtonStyleClass: "btn btn-accent mr-2",
      acceptLabel: "خروج",
      acceptIcon: "pi pi-check",
      rejectLabel: "إلغاء",
      rejectIcon: "pi pi-times",
      message: "هل أنت متأكد من تسجيل الخروج؟",
      onAccept: () => {
        this.authService.logout();
      },
    };
    this.dialogService.confirmDialog(config);
  }
}
