export interface PaginationResponse<T> {
    count: number
    items: T[];
}

export interface PaginationRequest {
    pageNumber?: number;
    pageSize?: number;
}
