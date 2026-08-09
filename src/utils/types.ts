export interface BaseListParameters {
    page: number | null;
    size: number | null;
    direction: string | null;
    sortBy: string | null;
}

export interface BaseDTO {
    [key: string]: string | number;
    id: number;
    createdAt: string;
    updatedAt: string;
}

export interface PaginatedListResponse<T extends object> {
    items: T[];
    total: number;
    page: number;
    size: number;
}
