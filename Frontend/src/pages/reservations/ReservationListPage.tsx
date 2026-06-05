import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { reservationService } from "@/services/reservationService";
import { ReservationStatus, type Reservation } from "@/types/entities";
import { parseApiDate, reservationStatusLabel } from "@/utils/formatters";
import { customerService } from "@/services/customerService";
import { apartmentService } from "@/services/apartmentService";

export const ReservationListPage = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [cancelTarget, setCancelTarget] = useState<Reservation | null>(null);
  const debouncedSearch = useDebounce(search);

  const reservationsQuery = useRetryableQuery({
    queryKey: ["reservas"],
    queryFn: reservationService.list
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => reservationService.cancel(id),
    onSuccess: async () => {
      setCancelTarget(null);
      await queryClient.invalidateQueries({ queryKey: ["reservas"] });
      await queryClient.invalidateQueries({ queryKey: ["apartamentos"] });
    }
  });

  const source = useMemo(() => reservationsQuery.data ?? [], [reservationsQuery.data]);

  const { paginated, setPage, sortState, setSortState } = useTableState<Reservation>({
    source,
    pageSize: 8,
    searchTerm: debouncedSearch,
    statusFilter,
    searchBy: (item, normalizedSearch) => {
      return [item.cliente?.nome ?? "", item.apartamento?.numero ?? "", item.id]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    },
    statusBy: (item) => String(item.status)
  });

  const columns: DataColumn<Reservation>[] = [
    {
      key: "cliente",
      title: "Cliente",
      render: (row) => row.cliente?.nome ?? row.clienteId
    },
    {
      key: "apartamento",
      title: "Apartamento",
      render: (row) => row.apartamento?.numero ?? row.apartamentoId
    },
    {
      key: "dataReserva",
      title: "Data",
      sortable: true,
      render: (row) => parseApiDate(row.dataReserva)
    },
    {
      key: "status",
      title: "Status",
      sortable: true,
      render: (row) => reservationStatusLabel(row.status)
    },
    {
      key: "actions",
      title: "Acoes",
      render: (row) => (
        <Button
          variant="danger"
          className="py-1.5"
          disabled={row.status !== ReservationStatus.Active}
          onClick={() => setCancelTarget(row)}
        >
          Cancelar
        </Button>
      )
    }
  ];

  if (reservationsQuery.isLoading) {
    return <Loading label="Carregando reservas..." />;
  }

  if (reservationsQuery.error) {
    return <ErrorState description={reservationsQuery.error.message} onRetry={() => reservationsQuery.refetch()} />;
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-title text-3xl font-bold text-ink-900">Reservas</h1>
          <p className="text-sm text-ink-500">Acompanhe reservas ativas e cancelamentos.</p>
        </div>
      </div>

      <div className="grid gap-3 rounded-2xl border border-ink-900/10 bg-white p-4 md:grid-cols-3">
        <InputText placeholder="Buscar por cliente, apartamento ou ID" value={search} onChange={(event) => setSearch(event.target.value)} />
        <select
          className="w-full rounded-xl border border-ink-900/15 bg-white px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="">Todos os status</option>
          <option value={String(ReservationStatus.Active)}>Ativa</option>
          <option value={String(ReservationStatus.Canceled)}>Cancelada</option>
          <option value={String(ReservationStatus.Closed)}>Encerrada</option>
        </select>
      </div>

      <ReservationCreateInline />

      {paginated.total === 0 ? (
        <EmptyState description="Nenhuma reserva encontrada." />
      ) : (
        <>
          <DataTable columns={columns} rows={paginated.data} keyExtractor={(row) => row.id} sortState={sortState} onSort={setSortState} />
          <Pagination page={paginated.page} total={paginated.total} pageSize={paginated.pageSize} onPageChange={setPage} />
        </>
      )}

      <Modal
        isOpen={Boolean(cancelTarget)}
        title="Cancelar reserva"
        description="Ao cancelar, o apartamento volta para disponivel. Deseja continuar?"
        confirmLabel="Cancelar reserva"
        tone="danger"
        isLoading={cancelMutation.isPending}
        onClose={() => setCancelTarget(null)}
        onConfirm={() => {
          if (cancelTarget) {
            cancelMutation.mutate(cancelTarget.id);
          }
        }}
      />
    </section>
  );
};

const ReservationCreateInline = () => {
  const queryClient = useQueryClient();
  const [clienteId, setClienteId] = useState("");
  const [apartamentoId, setApartamentoId] = useState("");

  const createMutation = useMutation({
    mutationFn: () => reservationService.create({ clienteId, apartamentoId }),
    onSuccess: async () => {
      setClienteId("");
      setApartamentoId("");
      await queryClient.invalidateQueries({ queryKey: ["reservas"] });
      await queryClient.invalidateQueries({ queryKey: ["apartamentos"] });
    }
  });

  const customersQuery = useRetryableQuery({
    queryKey: ["clientes"],
    queryFn: customerService.list
  });

  const apartmentsQuery = useRetryableQuery({
    queryKey: ["apartamentos"],
    queryFn: apartmentService.list
  });

  const availableApartments = useMemo(
    () =>
      (apartmentsQuery.data ?? []).filter(
        (apartment) => apartment.status === 1
      ),
    [apartmentsQuery.data]
  );

  return (
    <form
      className="grid gap-3 rounded-2xl border border-ink-900/10 bg-white p-4 md:grid-cols-[1fr_1fr_auto]"
      onSubmit={(event) => {
        event.preventDefault();
        createMutation.mutate();
      }}
    >
      <select
        value={clienteId}
        onChange={(event) => setClienteId(event.target.value)}
        required
        className="w-full rounded-xl border border-ink-900/15 bg-white px-3 py-2 text-sm"
      >
        <option value="">Selecione um cliente</option>

        {customersQuery.data?.map((customer) => (
          <option
            key={customer.id}
            value={customer.id}
          >
            {customer.nome}
          </option>
        ))}
      </select>
      <select
        value={apartamentoId}
        onChange={(event) => setApartamentoId(event.target.value)}
        required
        disabled={!availableApartments.length}
        className="w-full rounded-xl border border-ink-900/15 bg-white px-3 py-2 text-sm"
      >
        {availableApartments.length === 0 ? (
          <option value="">Nenhum apartamento disponível</option>
        ) : (
          <>
            <option value="">Selecione um apartamento</option>

            {availableApartments.map((apartment) => (
              <option
                key={apartment.id}
                value={apartment.id}
              >
                Apto {apartment.numero} | Bloco {apartment.bloco} | Andar {apartment.andar} | Valor: {apartment.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </option>
            ))}
          </>
        )}
      </select>
      <Button type="submit" disabled={createMutation.isPending}>
        {createMutation.isPending ? "Reservando..." : "Nova reserva"}
      </Button>
    </form>
  );
};
