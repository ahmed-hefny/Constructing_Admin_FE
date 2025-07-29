import { AuthService } from 'app/core/services';
import { Router } from '@angular/router';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { UsersService } from './service/users.service';
import { PaginationConfig, PaginationRequest, PaginationResponse } from 'app/core/models';
import { Default_PAGINATION, SystemRoles } from 'app/core/constants/app.constants';
import { UserResponse } from './models/users.models';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ToasterService } from 'app/shared/services/toaster.service';
import { ConfirmDialogConfig } from 'app/shared/models/dialog.models';
import { DialogService } from 'app/shared/services/dialog.service';
import { PaginationComponent } from 'app/shared/components/pagination/pagination.component';
import { AccessControlDirective } from 'app/shared/directives/access-control.directive';

const imports = [
  ButtonModule,
  CardModule,
  TableModule,
  PaginationComponent,
  AccessControlDirective
]
@Component({
  imports,
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  public data: UserResponse[] = [];
  public pagination: PaginationConfig = Default_PAGINATION;
  public Role: typeof SystemRoles = SystemRoles;
  public currentRole: WritableSignal<SystemRoles> = signal<SystemRoles>(SystemRoles.SUPER_VISOR);

  private router: Router = inject(Router);
  private usersService: UsersService = inject(UsersService);
  private toaster: ToasterService = inject(ToasterService);
  private dialogService: DialogService = inject(DialogService);
  private authService: AuthService = inject(AuthService);
  ngOnInit(): void {
    this.getData();
    const role = this.authService.user()?.role;
    if (role) this.currentRole.set(role);
  }

  createUser(): void {
    this.router.navigate(['users', 'create'], { relativeTo: this.router.routerState.root });
  }

  editUser(userId: number): void {
    this.router.navigate(['users', 'edit', userId], { relativeTo: this.router.routerState.root });
  }

  deleteUser(userId: number): void {
    this.usersService.delete(userId).subscribe({
      next: () => {
        this.getData();
        this.toaster.showSuccess('تم حذف المستخدم بنجاح');
      }
    })
  }

  confirmDelete(userId: number): void {
    const config: ConfirmDialogConfig = {
      header: 'تأكيد',
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'btn btn-error',
      rejectButtonStyleClass: 'btn btn-accent mr-2',
      acceptLabel: 'حذف',
      acceptIcon: 'pi pi-check',
      rejectLabel: 'إلغاء',
      rejectIcon: 'pi pi-times',
      message: 'هل أنت متأكد من أنك تريد حذف هذا المستخدم؟',
      onAccept: () => {
        this.deleteUser(userId);
      },
    }
    this.dialogService.confirmDialog(config);
  }



  getData(): void {
    this.usersService.getAllUsers(this.pagination).subscribe({
      next: (response: PaginationResponse<UserResponse>) => {
        this.data = response.items;
        this.pagination = {
          ...this.pagination,
          totalRecords: response.count,
        };
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });
  }

  onPageChange(event: { pageNumber: number; pageSize: number }): void {
    this.pagination.pageNumber = event.pageNumber;
    this.pagination.pageSize = event.pageSize;
    this.getData();
  }

}
