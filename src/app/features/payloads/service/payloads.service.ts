import { HttpHeaders, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { PaginationRequest, PaginationResponse } from "app/core/models";
import { HttpService } from "app/core/services";
import { buildQueryParams } from "app/shared/helpers/queryParamBuilder";
import { map, Observable, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PayloadsService {
  private http: HttpService = inject(HttpService);

  constructor() {}

  create(payload: any): Observable<any> {
    const headers = new HttpHeaders({
      Accept: "application/json",
    });

    return this.http.post(`/Payload/Create`, payload, { headers }, false);
  }

  getAll(body: any): Observable<PaginationResponse<any>> {
    return this.http.post<PaginationResponse<any>>(
      `/Payload/GetPayloadsList`,
      body
    ).pipe(
      tap(res => res.items.forEach(item =>{
        item.image = `data:image/jpeg;base64,${item?.image}`
      }))
    )
  }

  exportPayloads(body: any): Observable<Blob> {
    
    return this.http.download(
      `/Payload/ExportPayloads`,
      body
    );
  }
}
