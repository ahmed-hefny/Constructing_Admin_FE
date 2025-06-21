export interface Pagination {
    pageNumber: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    isFirstPage: boolean;
    isLastPage: boolean;
}

export interface PaginationResponse<T> extends Pagination {
    items: T[];
}

export interface PaginationRequest {
    pageNumber?: number;
    pageSize?: number;
}
