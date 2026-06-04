import { useMemo } from "react";
import type { ReactNode } from "react";
import type { SortState } from "@/types/table";

export interface DataColumn<T> {
  key: keyof T | string;
  title: string;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T extends object> {
  columns: DataColumn<T>[];
  rows: T[];
  keyExtractor: (row: T) => string;
  sortState: SortState<T>;
  onSort: (state: SortState<T>) => void;
}

export const DataTable = <T extends object>({
  columns,
  rows,
  keyExtractor,
  sortState,
  onSort
}: DataTableProps<T>) => {
  const sortIcon = useMemo(() => {
    if (!sortState.field) {
      return "-";
    }

    return sortState.direction === "asc" ? "↑" : "↓";
  }, [sortState.direction, sortState.field]);

  return (
    <div className="overflow-hidden rounded-2xl border border-ink-900/10 bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-ink-900 text-white">
            <tr>
              {columns.map((column) => (
                <th key={String(column.key)} className="px-4 py-3 font-semibold">
                  <button
                    className="inline-flex items-center gap-2"
                    type="button"
                    onClick={() => {
                      if (!column.sortable) {
                        return;
                      }

                      const sameField = sortState.field === column.key;
                      onSort({
                        field: column.key as keyof T,
                        direction: sameField && sortState.direction === "asc" ? "desc" : "asc"
                      });
                    }}
                  >
                    <span>{column.title}</span>
                    {column.sortable && sortState.field === column.key ? <span>{sortIcon}</span> : null}
                  </button>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={keyExtractor(row)} className="border-t border-ink-900/10">
                {columns.map((column) => (
                  <td key={String(column.key)} className="px-4 py-3 text-ink-700">
                    {column.render
                      ? column.render(row)
                      : String((row as Record<string, unknown>)[String(column.key)] ?? "-")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
