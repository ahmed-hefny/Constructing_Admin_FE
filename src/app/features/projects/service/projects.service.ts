import { inject, Injectable } from '@angular/core';
import { PaginationRequest, PaginationResponse } from 'app/core/models';
import { HttpService } from 'app/core/services/http.service';
import { buildQueryParams } from 'app/shared/helpers/queryParamBuilder';
import { map, Observable } from 'rxjs';
import { Project } from '../models/projects.models';
import { CompanyResponse } from 'app/shared/models/company.models';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private http: HttpService = inject(HttpService);

  constructor() { }

  getAll({ pageNumber, pageSize }: PaginationRequest): Observable<PaginationResponse<Project>> {
    return this.http.get(`/project/GetProjects${buildQueryParams({ pageNumber, pageSize })}`);
  }

  getCompanies(): Observable<CompanyResponse[]> {
    const query = {
      pageNumber: 1,
      pageSize: 1000
    }
    return this.http.get<PaginationResponse<CompanyResponse>>(`/company/GetCompaniesList${buildQueryParams(query)}`).pipe(map((res: PaginationResponse<CompanyResponse>) => res.items));
  }

}
