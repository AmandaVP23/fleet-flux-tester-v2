export interface BaseListParameters {
    page: number | null;
    size: number | null;
    direction: string | null;
    sortBy: string | null;
}

export interface BaseDTO {
    id: number;
    createdAt: string;
    updatedAt: string;
}

export interface PaginatedListResponse<T extends object = Record<string, unknown>,> {
    items: T[];
    total: number;
    page: number;
    size: number;
}
