export interface PaginationResponse<T> {
    count: number
    items: T[];
}

export interface PaginationRequest {
    pageNumber: number;
    pageSize: number;
}

export interface PaginationConfig extends PaginationRequest {
    totalRecords: number;
    rowsPerPageOptions: number[];
    showCurrentPageReport: boolean;
    currentPageReportTemplate: string;
}