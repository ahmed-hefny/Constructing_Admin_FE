import { inject, Injectable } from '@angular/core';
import { PaginationRequest, PaginationResponse } from 'app/core/models';
import { HttpService } from 'app/core/services';
import { buildQueryParams } from 'app/shared/helpers/queryParamBuilder';
import { Observable } from 'rxjs';
import * as COMPANIES_MODELS from '../models/companies.models';
@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
  private http: HttpService = inject(HttpService);
  constructor() { }

  getAllCompanies({ pageNumber, pageSize }: PaginationRequest): Observable<PaginationResponse<COMPANIES_MODELS.Company>> {
    return this.http.get(`/company/GetCompaniesList${buildQueryParams({ pageNumber, pageSize })}`);
  }

  create(payload: COMPANIES_MODELS.Company): Observable<string> {
    return this.http.post('/company/Create', payload);
  }

  update(payload: COMPANIES_MODELS.Company): Observable<string> {
    return this.http.put('/company/Update', payload);
  }

  delete(id: number): Observable<null> {
    return this.http.delete(`/company/Delete/${id}`);
  }
}
