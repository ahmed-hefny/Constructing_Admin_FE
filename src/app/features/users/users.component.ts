import { Router } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { PrimeIcons } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { UsersService } from './service/users.service';
import { PaginationRequest, PaginationResponse } from 'app/core/models';
import { Default_PAGINATION } from 'app/core/constants/app.constants';
import { UserResponse } from './models/users.models';
import { CardModule } from 'primeng/card';
import { Table, TableModule } from 'primeng/table';

const imports = [
  ButtonModule,
  CardModule,
  TableModule
]
@Component({
  selector: 'app-users',
  imports,
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  public data: UserResponse[] = [];
  private router: Router = inject(Router);
  private usersService: UsersService = inject(UsersService);
  private pagination: PaginationRequest = Default_PAGINATION;
  ngOnInit(): void {
    this.getAllUsers();
  }

  createUser(): void {
    this.router.navigate(['users', 'create'], { relativeTo: this.router.routerState.root });
  }

  editUser(userId: string): void {
    this.router.navigate(['users', 'edit', userId], { relativeTo: this.router.routerState.root });
  }

  deleteUser(userId: string): void {
    // Implement delete user logic here
    console.log(`Delete user with ID: ${userId}`);
  }

  getAllUsers(): void {
    this.usersService.getAllUsers(this.pagination).subscribe({
      next: (response: PaginationResponse<UserResponse>) => {
        this.data = response.items;

      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });
  }

}
