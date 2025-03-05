export interface IPaginationResponse<T> {
    data: T[];
    total: number;
    limit: number;
    currentPage: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}