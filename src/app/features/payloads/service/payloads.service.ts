import { inject, Injectable } from '@angular/core';
import { PaginationRequest, PaginationResponse } from 'app/core/models';
import { HttpService } from 'app/core/services';
import { buildQueryParams } from 'app/shared/helpers/queryParamBuilder';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PayloadsService {
  private http: HttpService = inject(HttpService);

  constructor() { }

  getAll(body: any): Observable<PaginationResponse<any>> {
    return this.http.post<PaginationResponse<any>>(`/Payload/GetPayloadsList`, body);
  }
}
