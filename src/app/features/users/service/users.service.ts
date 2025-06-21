import { inject, Injectable } from '@angular/core';
import { HttpService } from 'app/core/services';
import { Observable } from 'rxjs';
import * as USERS_MODELS from '../models/users.models';
import { PaginationRequest, PaginationResponse } from 'app/core/models';
import { buildQueryParams } from 'app/shared/helpers/queryParamBuilder';
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private http: HttpService = inject(HttpService);

  getAllUsers(pagination: PaginationRequest): Observable<PaginationResponse<USERS_MODELS.UserResponse>> {
    return this.http.get(`/user/GetUsersList${buildQueryParams(pagination)}`);
  }

  getUserById(id: string): Observable<USERS_MODELS.UserResponse> {
    return this.http.get(`/user/GetUserById/${id}`);
  }
  create(payload: USERS_MODELS.UserPayload): Observable<string> {
    return this.http.post('/user/register', payload);
  }

  update(payload: USERS_MODELS.UserPayload): Observable<any> {
    return this.http.put('/user/update', payload);
  }
}
