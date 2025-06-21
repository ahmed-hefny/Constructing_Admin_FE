import { Router } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { PrimeIcons } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { UsersService } from './service/users.service';
import { Pagination, PaginationRequest, PaginationResponse } from 'app/core/models';
import { Default_PAGINATION } from 'app/core/constants/app.constants';

const imports = [
  ButtonModule
]
@Component({
  selector: 'app-users',
  imports,
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  private router: Router = inject(Router);
  private usersService: UsersService = inject(UsersService);
  private pagination: PaginationRequest = Default_PAGINATION;
  ngOnInit(): void {
    this.usersService.getAllUsers(this.pagination).subscribe({
      next: (response: PaginationResponse<any>) => {
        console.log(response);

      }
    });
  }
  createUser(): void {
    this.router.navigate(['users', 'create'], { relativeTo: this.router.routerState.root });
  }
}
