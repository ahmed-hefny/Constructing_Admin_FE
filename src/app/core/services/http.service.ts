import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { saveAs } from 'file-saver';
import { environment } from '../../../environments/environment';
import { HttpOptions, QueryParams } from '../models/http.models';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}
  /**
   * GET request
   */
  get<T>(endpoint: string, options?: HttpOptions): Observable<T> {
    const url = this.buildUrl(endpoint);
    const httpOptions = this.buildRequestOptions(options);
    return this.http.get<T>(url, httpOptions).pipe(
      tap(response => this.logIfEnabled('GET', url, response))
    );
  }

  /**
   * POST request
   */
  post<T>(endpoint: string, body: any, options?: HttpOptions, includeContentType: boolean = true): Observable<T> {
    const url = this.buildUrl(endpoint);
    const httpOptions = this.buildRequestOptions(options, includeContentType);
    return this.http.post<T>(url, body, httpOptions).pipe(
      tap(response => this.logIfEnabled('POST', url, response))
    );
  }

  /**
   * PUT request
   */
  put<T>(endpoint: string, body: any, options?: HttpOptions): Observable<T> {
    const url = this.buildUrl(endpoint);
    const httpOptions = this.buildRequestOptions(options);
    return this.http.put<T>(url, body, httpOptions).pipe(
      tap(response => this.logIfEnabled('PUT', url, response))
    );
  }

  /**
   * PATCH request
   */
  patch<T>(endpoint: string, body: any, options?: HttpOptions): Observable<T> {
    const url = this.buildUrl(endpoint);
    const httpOptions = this.buildRequestOptions(options);
    return this.http.patch<T>(url, body, httpOptions).pipe(
      tap(response => this.logIfEnabled('PATCH', url, response))
    );
  }

  /**
   * DELETE request
   */
  delete<T>(endpoint: string, options?: HttpOptions): Observable<T> {
    const url = this.buildUrl(endpoint);
    const httpOptions = this.buildRequestOptions(options);
    return this.http.delete<T>(url, httpOptions).pipe(
      tap(response => this.logIfEnabled('DELETE', url, response))
    );
  }

  /**
   * Upload file
   */
  upload<T>(endpoint: string, formData: FormData, options?: HttpOptions): Observable<T> {
    const url = this.buildUrl(endpoint);
    
    // Create options without Content-Type for file upload
    const uploadOptions = this.buildRequestOptions(options, false);
    
    return this.http.post<T>(url, formData, uploadOptions).pipe(
      tap(response => this.logIfEnabled('UPLOAD', url, response))
    );
  }
  /**
   * Download file
   */
  download(endpoint: string, body: any, options?: HttpOptions): Observable<Blob> {
    const url = this.buildUrl(endpoint);
    
    const baseOptions = this.buildRequestOptions(options);
    const downloadOptions = {
      headers: baseOptions.headers,
      params: baseOptions.params,
      withCredentials: baseOptions.withCredentials,
      responseType: 'blob' as 'blob'
    };

    return this.http.post(url, body, downloadOptions).pipe(
      tap(() => {
        
        this.logIfEnabled('DOWNLOAD', url, 'File downloaded successfully');
      })
    );
  }

  /**
   * Build full URL from endpoint
   */
  private buildUrl(endpoint: string): string {
    // Remove leading slash if present to avoid double slashes
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    return `${this.baseUrl}/${cleanEndpoint}`;
  }
  /**
   * Build request options with headers and params
   */
  private buildRequestOptions(options?: HttpOptions, includeContentType: boolean = true): {
    headers: HttpHeaders;
    params?: HttpParams;
    withCredentials?: boolean;
  } {
    const headers = this.buildHeaders(options?.headers, includeContentType);
    const params = this.buildHttpParams(options?.params);

    const requestOptions: {
      headers: HttpHeaders;
      params?: HttpParams;
      withCredentials?: boolean;
    } = {
      headers,
      withCredentials: options?.withCredentials || false
    };

    if (params) {
      requestOptions.params = params;
    }

    return requestOptions;
  }

  /**
   * Build headers with defaults
   */
  private buildHeaders(customHeaders?: HttpHeaders | { [header: string]: string | string[] }, includeContentType: boolean = true): HttpHeaders {
    let headers = new HttpHeaders();
    
    // Add default headers
    if (includeContentType) {
      headers = headers.set('Content-Type', 'application/json');
    }
    headers = headers.set('Accept', 'application/json');

    // Add custom headers
    if (customHeaders) {
      if (customHeaders instanceof HttpHeaders) {
        customHeaders.keys().forEach(key => {
          headers = headers.set(key, customHeaders.get(key) || '');
        });
      } else {
        Object.keys(customHeaders).forEach(key => {
          const value = customHeaders[key];
          if (Array.isArray(value)) {
            value.forEach(v => headers = headers.append(key, v));
          } else {
            headers = headers.set(key, value);
          }
        });
      }
    }

    return headers;
  }

  /**
   * Build HTTP params from various input types
   */
  private buildHttpParams(params?: HttpParams | QueryParams): HttpParams | undefined {
    if (!params) {
      return undefined;
    }

    if (params instanceof HttpParams) {
      return params;
    }

    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(item => {
            httpParams = httpParams.append(key, item.toString());
          });
        } else {
          httpParams = httpParams.set(key, value.toString());
        }
      }
    });

    return httpParams;
  }

  /**
   * Build query string from object
   */
  buildQueryString(params: QueryParams): string {
    const httpParams = this.buildHttpParams(params);
    return httpParams ? httpParams.toString() : '';
  }

  /**
   * Set base URL (useful for different API versions)
   */
  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  /**
   * Get current base URL
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Log requests if logging is enabled
   */
  private logIfEnabled(method: string, url: string, data: any): void {
    if (environment.enableLogging) {
      console.log(`[HTTP ${method}] ${url}`, data);
    }
  }
}
