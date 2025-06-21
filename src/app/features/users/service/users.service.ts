import { inject, Injectable } from '@angular/core';
import { HttpService } from 'app/core/services';
import { Observable } from 'rxjs';
import * as USERS_MODELS from '../models/users.models';
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private http: HttpService = inject(HttpService);

  create(payload: USERS_MODELS.UserPayload): Observable<any> {
    return this.http.post('/user/register', payload);
  }

  put(payload: USERS_MODELS.UserPayload, userId: number): Observable<any> {
    return this.http.put('/user/update', payload);
  }
}
