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
import { useDebounce } from "@/hooks/useDebounce";
import { useRetryableQuery } from "@/hooks/useRetryableQuery";
import { useTableState } from "@/hooks/useTableState";
import { customerService } from "@/services/customerService";
import type { Customer } from "@/types/entities";
import { parseApiDate } from "@/utils/formatters";

export const CustomerListPage = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);
  const debouncedSearch = useDebounce(search);

  const customersQuery = useRetryableQuery({
    queryKey: ["clientes"],
    queryFn: customerService.list
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => customerService.remove(id),
    onSuccess: async () => {
      setDeleteTarget(null);
      await queryClient.invalidateQueries({ queryKey: ["clientes"] });
    }
  });

  const source = useMemo(() => customersQuery.data ?? [], [customersQuery.data]);

  const { paginated, setPage, sortState, setSortState } = useTableState<Customer>({
    source,
    pageSize: 8,
    searchTerm: debouncedSearch,
    searchBy: (item, normalizedSearch) => {
      return [item.nome, item.email, item.cpf].join(" ").toLowerCase().includes(normalizedSearch);
    }
  });

  const columns: DataColumn<Customer>[] = [
    { key: "nome", title: "Nome", sortable: true },
    { key: "cpf", title: "CPF", sortable: true },
    { key: "email", title: "Email", sortable: true },
    { key: "telefone", title: "Telefone", sortable: true },
    {
      key: "dataCadastro",
      title: "Cadastro",
      render: (row) => parseApiDate(row.dataCadastro)
    },
    {
      key: "actions",
      title: "Acoes",
      render: (row) => (
        <div className="flex gap-2">
          <Link to={`/clientes/${row.id}`} className="text-brand-600 hover:underline">
            Ver
          </Link>
          <Link to={`/clientes/${row.id}/edit`} className="text-ink-700 hover:underline">
            Editar
          </Link>
          <button type="button" className="text-red-600 hover:underline" onClick={() => setDeleteTarget(row)}>
            Excluir
          </button>
        </div>
      )
    }
  ];

  if (customersQuery.isLoading) {
    return <Loading label="Carregando clientes..." />;
  }

  if (customersQuery.error) {
    return <ErrorState description={customersQuery.error.message} onRetry={() => customersQuery.refetch()} />;
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-title text-3xl font-bold text-ink-900">Clientes</h1>
          <p className="text-sm text-ink-500">Cadastro completo e historico dos compradores.</p>
        </div>
        <Link to="/clientes/new">
          <Button>Novo cliente</Button>
        </Link>
      </div>

      <div className="rounded-2xl border border-ink-900/10 bg-white p-4">
        <InputText placeholder="Buscar por nome, CPF ou email" value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>

      {paginated.total === 0 ? (
        <EmptyState description="Nao existem clientes para o filtro atual." />
      ) : (
        <>
          <DataTable columns={columns} rows={paginated.data} keyExtractor={(row) => row.id} sortState={sortState} onSort={setSortState} />
          <Pagination page={paginated.page} total={paginated.total} pageSize={paginated.pageSize} onPageChange={setPage} />
        </>
      )}

      <Modal
        isOpen={Boolean(deleteTarget)}
        title="Excluir cliente"
        description="A exclusao remove o cadastro definitivamente. Deseja continuar?"
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
