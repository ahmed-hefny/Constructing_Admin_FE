import { HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { PaginationResponse } from "app/core/models";
import { HttpService } from "app/core/services";
import { buildQueryParams } from "app/shared/helpers/queryParamBuilder";
import { Project } from "app/shared/models/company.models";
import { map, Observable } from "rxjs";
import { Payload, PayloadModel } from "../models/payloads.models";
import { environment } from "environments/environment";

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

  edit(payload: any): Observable<any> {
    const headers = new HttpHeaders({
      Accept: "application/json",
    });

    return this.http.post(`/Payload/Edit`, payload, { headers }, false);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`/Payload/DeletePayload/${id}`);
  }

  getAll(body: any): Observable<PaginationResponse<Payload>> {
    return this.http
      .post<PaginationResponse<Payload>>(`/Payload/GetPayloadsList`, body)
      .pipe(
        map((res) => {
          res.items.forEach((item) => {
            if (item?.image) {
              item.image = environment.appUrl + item.image;
            }
          });
          return res;
        })
      );
  }

  exportPayloads(body: any): Observable<Blob> {
    return this.http.download(`/Payload/ExportPayloads`, body);
  }

  getProjectDetails(id: string): Observable<Project> {
    return this.http.get<Project>(
      `/project/GetById${buildQueryParams({ id })}`
    );
  }

  getPayloadDetails(id: string): Observable<PayloadModel> {
    return this.http
      .get<PayloadModel>(`/Payload/GetById${buildQueryParams({ id })}`)
      .pipe(
        map((payload) => ({
          ...payload,
          image: environment.appUrl + payload.image,
        }))
      );
  }
}
