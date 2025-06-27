import { Router } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { UsersService } from './service/users.service';
import { PaginationConfig, PaginationRequest, PaginationResponse } from 'app/core/models';
import { Default_PAGINATION } from 'app/core/constants/app.constants';
import { UserResponse } from './models/users.models';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ToasterService } from 'app/shared/services/toaster.service';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogConfig } from 'app/shared/models/dialog.models';
import { DialogService } from 'app/shared/services/dialog.service';
import { PaginationComponent } from 'app/shared/components/pagination/pagination.component';

const imports = [
  ButtonModule,
  CardModule,
  TableModule,
  PaginationComponent
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

  private router: Router = inject(Router);
  private usersService: UsersService = inject(UsersService);
  private toaster: ToasterService = inject(ToasterService);
  private dialogService: DialogService = inject(DialogService);
  ngOnInit(): void {
    this.getData();
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
        this.toaster.showSuccess('User deleted successfully');
      }
    })
  }

  confirmDelete(userId: number): void {
    const config: ConfirmDialogConfig = {
      header: 'Confirmation',
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'btn btn-error',
      rejectButtonStyleClass: 'btn btn-accent mr-2',
      acceptLabel: 'Delete',
      acceptIcon: 'pi pi-check',
      rejectLabel: 'Cancel',
      rejectIcon: 'pi pi-times',
      message: 'Are you sure you want to delete this user?',
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
