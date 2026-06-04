import { useMemo, useState } from "react";
import type { PaginatedResult, SortState } from "@/types/table";

interface UseTableStateParams<T extends object> {
  source: T[];
  pageSize?: number;
  searchTerm?: string;
  searchBy?: (item: T, normalizedSearch: string) => boolean;
  statusFilter?: string;
  statusBy?: (item: T) => string;
  sortBy?: (item: T, field: keyof T) => string | number;
}

interface UseTableStateReturn<T extends object> {
  paginated: PaginatedResult<T>;
  setPage: (page: number) => void;
  sortState: SortState<T>;
  setSortState: (sort: SortState<T>) => void;
}

export const useTableState = <T extends object>({
  source,
  pageSize = 10,
  searchTerm,
  searchBy,
  statusFilter,
  statusBy,
  sortBy
}: UseTableStateParams<T>): UseTableStateReturn<T> => {
  const [page, setPage] = useState(1);
  const [sortState, setSortState] = useState<SortState<T>>({
    field: null,
    direction: "asc"
  });

  const filtered = useMemo(() => {
    const normalizedSearch = (searchTerm ?? "").trim().toLowerCase();

    return source.filter((item) => {
      const searchMatches = normalizedSearch
        ? (searchBy ? searchBy(item, normalizedSearch) : true)
        : true;

      const statusMatches = statusFilter
        ? (statusBy ? statusBy(item) === statusFilter : true)
        : true;

      return searchMatches && statusMatches;
    });
  }, [searchBy, searchTerm, source, statusBy, statusFilter]);

  const sorted = useMemo(() => {
    const { field, direction } = sortState;
    if (!field) {
      return filtered;
    }

    return [...filtered].sort((left, right) => {
      const leftRecord = left as Record<string, unknown>;
      const rightRecord = right as Record<string, unknown>;
      const leftRaw = sortBy ? sortBy(left, field) : leftRecord[String(field)];
      const rightRaw = sortBy ? sortBy(right, field) : rightRecord[String(field)];

      const leftValue = typeof leftRaw === "number" ? leftRaw : String(leftRaw ?? "");
      const rightValue = typeof rightRaw === "number" ? rightRaw : String(rightRaw ?? "");

      if (leftValue === rightValue) {
        return 0;
      }

      const result = leftValue > rightValue ? 1 : -1;
      return direction === "asc" ? result : -result;
    });
  }, [filtered, sortBy, sortState]);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const paginatedData = sorted.slice(start, start + pageSize);

  return {
    paginated: {
      data: paginatedData,
      total,
      page: safePage,
      pageSize
    },
    setPage,
    sortState,
    setSortState
  };
};
