import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  imports: [ButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private authService: AuthService = inject(AuthService);

  logout(): void {
    this.authService.logout();
    // Implement logout logic here
    console.log('User logged out');
  }
}
