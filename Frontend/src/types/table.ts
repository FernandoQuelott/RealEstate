export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
}

export interface SortState<T> {
    field: keyof T | null;
    direction: "asc" | "desc";
}

export interface TableFilters {
    search: string;
    status?: string;
    minValue?: number;
    maxValue?: number;
}
