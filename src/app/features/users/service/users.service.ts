import { inject, Injectable } from '@angular/core';
import { HttpService } from 'app/core/services';
import { map, Observable } from 'rxjs';
import * as USERS_MODELS from '../models/users.models';
import { PaginationRequest, PaginationResponse } from 'app/core/models';
import { buildQueryParams } from 'app/shared/helpers/queryParamBuilder';
import { CompanyResponse, Project } from 'app/shared/models/company.models';
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private http: HttpService = inject(HttpService);

  getAllUsers({ pageNumber, pageSize }: PaginationRequest): Observable<PaginationResponse<USERS_MODELS.UserResponse>> {
    return this.http.get(`/user/GetUsersList${buildQueryParams({ pageNumber, pageSize })}`);
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

  delete(id: number): Observable<null> {
    return this.http.delete(`/user/delete/${id}`);
  }

  getCompanies(): Observable<CompanyResponse[]> {
    const query = {
      pageNumber: 1,
      pageSize: 1000
    }
    return this.http.get<PaginationResponse<CompanyResponse>>(`/company/GetCompaniesList${buildQueryParams(query)}`).pipe(map((res: PaginationResponse<CompanyResponse>) => res.items));
  }
  getProjects(): Observable<Project[]> {
    const query = {
      pageNumber: 1,
      pageSize: 1000
    }
    return this.http.get<PaginationResponse<Project>>(`/project/GetProjects${buildQueryParams(query)}`).pipe(map((res: PaginationResponse<Project>) => res.items));
  }

}
