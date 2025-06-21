import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { inject } from '@angular/core';
import { ToasterService } from 'app/shared/services/toaster.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toaster = inject(ToasterService);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if(error.status === 400) {
        // Handle 400 Bad Request error
        console.error('Bad Request:', error.error);
        toaster.showError(error.error || 'Invalid request');
        return throwError(() => error)
      } 
      return throwError(() => handleError(error));
    })
  );
};

function handleError(error: HttpErrorResponse): HttpErrorResponse | Error {
  let errorMessage = 'An unknown error occurred';
  
  if (error.error instanceof ErrorEvent) {
    // Client-side error
    errorMessage = `Client Error: ${error.error.message}`;
  } else {
    // Server-side error
    errorMessage = `Server Error: ${error.status} - ${error.message}`;
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    }
  }

  // Log error if logging is enabled
  if (environment.enableLogging) {
    console.error(`[HTTP ERROR] ${error.url || 'Unknown URL'}`, {
      status: error.status,
      message: errorMessage,
      error: error.error
    });
  }

  return error;
}
