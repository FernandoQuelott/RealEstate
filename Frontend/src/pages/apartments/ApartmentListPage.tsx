import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button } from "@/components/Button";
import { DataTable, type DataColumn } from "@/components/DataTable";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { InputText } from "@/components/InputText";
import { Loading } from "@/components/Loading";
import { Modal } from "@/components/Modal";
import { Pagination } from "@/components/Pagination";
import { SelectField } from "@/components/SelectField";
import { useDebounce } from "@/hooks/useDebounce";
import { useRetryableQuery } from "@/hooks/useRetryableQuery";
import { useTableState } from "@/hooks/useTableState";
import { apartmentService } from "@/services/apartmentService";
import { ApartmentStatus, type Apartment } from "@/types/entities";
import { apartmentStatusLabel, currencyFormatter } from "@/utils/formatters";

export const ApartmentListPage = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Apartment | null>(null);
  const debouncedSearch = useDebounce(search);

  const apartmentsQuery = useRetryableQuery({
    queryKey: ["apartamentos"],
    queryFn: apartmentService.list
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apartmentService.remove(id),
    onSuccess: async () => {
      setDeleteTarget(null);
      await queryClient.invalidateQueries({ queryKey: ["apartamentos"] });
    }
  });

  const source = useMemo(() => apartmentsQuery.data ?? [], [apartmentsQuery.data]);

  const { paginated, setPage, sortState, setSortState } = useTableState<Apartment>({
    source,
    pageSize: 8,
    searchTerm: debouncedSearch,
    statusFilter,
    searchBy: (item, normalizedSearch) => {
      return [item.numero, item.bloco].join(" ").toLowerCase().includes(normalizedSearch);
    },
    statusBy: (item) => String(item.status)
  });

  const columns: DataColumn<Apartment>[] = [
    { key: "numero", title: "Numero", sortable: true },
    { key: "bloco", title: "Bloco", sortable: true },
    { key: "andar", title: "Andar", sortable: true },
    {
      key: "valor",
      title: "Valor",
      sortable: true,
      render: (row) => currencyFormatter.format(row.valor)
    },
    {
      key: "status",
      title: "Status",
      sortable: true,
      render: (row) => apartmentStatusLabel(row.status)
    },
    {
      key: "actions",
      title: "Acoes",
      render: (row) => (
        <div className="flex gap-2">
          <Link to={`/apartamentos/${row.id}`} className="text-brand-600 hover:underline">
            Ver
          </Link>
          <Link to={`/apartamentos/${row.id}/edit`} className="text-ink-700 hover:underline">
            Editar
          </Link>
          <button type="button" className="text-red-600 hover:underline" onClick={() => setDeleteTarget(row)}>
            Excluir
          </button>
        </div>
      )
    }
  ];

  if (apartmentsQuery.isLoading) {
    return <Loading label="Carregando apartamentos..." />;
  }

  if (apartmentsQuery.error) {
    return <ErrorState description={apartmentsQuery.error.message} onRetry={() => apartmentsQuery.refetch()} />;
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-title text-3xl font-bold text-ink-900">Apartamentos</h1>
          <p className="text-sm text-ink-500">Gerencie unidades, disponibilidade e valores de venda.</p>
        </div>
        <Link to="/apartamentos/new">
          <Button>Novo apartamento</Button>
        </Link>
      </div>

      <div className="grid gap-3 rounded-2xl border border-ink-900/10 bg-white p-4 md:grid-cols-3">
        <InputText placeholder="Buscar por numero ou bloco" value={search} onChange={(event) => setSearch(event.target.value)} />
        <SelectField value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          <option value="">Todos os status</option>
          <option value={String(ApartmentStatus.Available)}>Disponivel</option>
          <option value={String(ApartmentStatus.Reserved)}>Reservado</option>
          <option value={String(ApartmentStatus.Sold)}>Vendido</option>
        </SelectField>
      </div>

      {paginated.total === 0 ? (
        <EmptyState description="Nao existem apartamentos cadastrados para os filtros atuais." />
      ) : (
        <>
          <DataTable columns={columns} rows={paginated.data} keyExtractor={(row) => row.id} sortState={sortState} onSort={setSortState} />
          <Pagination page={paginated.page} total={paginated.total} pageSize={paginated.pageSize} onPageChange={setPage} />
        </>
      )}

      <Modal
        isOpen={Boolean(deleteTarget)}
        title="Excluir apartamento"
        description="Esta acao nao pode ser desfeita. Deseja continuar?"
        confirmLabel="Excluir"
        tone="danger"
        isLoading={deleteMutation.isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteMutation.mutate(deleteTarget.id);
          }
        }}
      />
    </section>
  );
};
