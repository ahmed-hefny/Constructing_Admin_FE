import { inject, Injectable } from '@angular/core';
import { PaginationRequest, PaginationResponse } from 'app/core/models';
import { HttpService } from 'app/core/services/http.service';
import { buildQueryParams } from 'app/shared/helpers/queryParamBuilder';
import { Observable } from 'rxjs';
import { Project } from '../models/projects.models';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private http: HttpService = inject(HttpService);

  constructor() { }

  getAll({ pageNumber, pageSize }: PaginationRequest): Observable<PaginationResponse<Project>> {
    return this.http.get(`/project/GetProjects${buildQueryParams({ pageNumber, pageSize })}`);
  }

}
