import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { errorInterceptor } from './core/interceptors/error.interceptor';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { ToasterService } from './shared/services/toaster.service';

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    ToasterService,
    ConfirmationService,
    PrimeNGConfig,
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        errorInterceptor,
        authInterceptor,
      ])
    ),
    provideAnimationsAsync()
  ]
};
