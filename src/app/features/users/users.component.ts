import { Router } from '@angular/router';
import { Component, inject } from '@angular/core';
import { PrimeIcons } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

const imports = [
  ButtonModule
]
@Component({
  selector: 'app-users',
  imports,
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  private router: Router = inject(Router);
  createUser(): void {
    // Logic to create a new user
    this.router.navigate(['users','create'], { relativeTo: this.router.routerState.root });
  }
}
