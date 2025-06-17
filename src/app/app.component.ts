import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from './core/services';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Constructing_Admin_FE';
  authService = inject(AuthService);

  ngOnInit(): void {
    // Test the auth service with login
    const credentials = {
      username: "hefny",
      password: "123456"
    };

    this.authService.login(credentials).subscribe();
  }
}
