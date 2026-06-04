import { Button } from "@/components/Button";

interface PaginationProps {
  page: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ page, total, pageSize, onPageChange }: PaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-ink-900/10 bg-white/70 p-3">
      <span className="text-sm text-ink-500">
        Pagina {page} de {totalPages} ({total} itens)
      </span>
      <div className="flex gap-2">
        <Button variant="ghost" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
          Anterior
        </Button>
        <Button variant="ghost" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
          Proxima
        </Button>
      </div>
    </div>
  );
};
