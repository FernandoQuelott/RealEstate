import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/Button";
import { DataTable, type DataColumn } from "@/components/DataTable";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { InputNumber } from "@/components/InputNumber";
import { InputText } from "@/components/InputText";
import { Loading } from "@/components/Loading";
import { Pagination } from "@/components/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import { useRetryableQuery } from "@/hooks/useRetryableQuery";
import { useTableState } from "@/hooks/useTableState";
import { saleService } from "@/services/saleService";
import type { Sale } from "@/types/entities";
import { currencyFormatter, parseApiDate } from "@/utils/formatters";
import { customerService } from "@/services/customerService";
import { apartmentService } from "@/services/apartmentService";

export const SaleListPage = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const salesQuery = useRetryableQuery({
    queryKey: ["vendas"],
    queryFn: saleService.list
  });

  const source = useMemo(() => salesQuery.data ?? [], [salesQuery.data]);



  const { paginated, setPage, sortState, setSortState } = useTableState<Sale>({
    source,
    pageSize: 8,
    searchTerm: debouncedSearch,
    searchBy: (item, normalizedSearch) => {
      return [item.cliente?.nome ?? item.clienteId, item.apartamento?.numero ?? item.apartamentoId]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    }
  });

  const columns: DataColumn<Sale>[] = [
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
      key: "valorVenda",
      title: "Valor",
      sortable: true,
      render: (row) => currencyFormatter.format(row.valorVenda)
    },
    {
      key: "dataVenda",
      title: "Data da venda",
      sortable: true,
      render: (row) => parseApiDate(row.dataVenda)
    }
  ];

  if (salesQuery.isLoading) {
    return <Loading label="Carregando vendas..." />;
  }

  if (salesQuery.error) {
    return <ErrorState description={salesQuery.error.message} onRetry={() => salesQuery.refetch()} />;
  }

  return (
    <section className="space-y-5">
      <header>
        <h1 className="font-title text-3xl font-bold text-ink-900">Vendas</h1>
        <p className="text-sm text-ink-500">Registre novas vendas e acompanhe o historico.</p>
      </header>

      <div className="rounded-2xl border border-ink-900/10 bg-white p-4">
        <InputText placeholder="Buscar por cliente ou apartamento" value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>

      <SaleCreateInline onCreated={async () => queryClient.invalidateQueries({ queryKey: ["vendas"] })} />

      {paginated.total === 0 ? (
        <EmptyState description="Nenhuma venda registrada ainda." />
      ) : (
        <>
          <DataTable columns={columns} rows={paginated.data} keyExtractor={(row) => row.id} sortState={sortState} onSort={setSortState} />
          <Pagination page={paginated.page} total={paginated.total} pageSize={paginated.pageSize} onPageChange={setPage} />
        </>
      )}
    </section>
  );
};

const SaleCreateInline = ({ onCreated }: { onCreated: () => Promise<unknown> }) => {
  const [clienteId, setClienteId] = useState("");
  const [apartamentoId, setApartamentoId] = useState("");
  const [valorVenda, setValorVenda] = useState<number>(0);

  const createMutation = useMutation({
    mutationFn: () => saleService.create({ clienteId, apartamentoId, valorVenda }),
    onSuccess: async () => {
      setClienteId("");
      setApartamentoId("");
      setValorVenda(0);
      await onCreated();
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

  const reservedApartaments = useMemo(
    () => (apartmentsQuery.data ?? []).filter((apartamento) => apartamento.status === 2),
    [apartmentsQuery.data]
  );



  return (
    <form
      className="grid gap-3 rounded-2xl border border-ink-900/10 bg-white p-4 md:grid-cols-[1fr_1fr_180px_auto]"
      onSubmit={(event) => {
        event.preventDefault();
        createMutation.mutate();
      }}
    >
      <select value={clienteId}
        onChange={(event) => setClienteId(event.target.value)}
        required
        className="rounded-lg border border-ink-900/20 px-3 py-2">
        <option value="" disabled>Selecione um cliente</option>
        {customersQuery.data?.map(cliente => (
          <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
        ))}
      </select>
      <select
        value={apartamentoId}
        onChange={(event) => {
          const selectedApartmentId = event.target.value;

          setApartamentoId(selectedApartmentId);

          const apartment = reservedApartaments.find(
            apartment => apartment.id === selectedApartmentId
          );

          if (apartment) {
            setValorVenda(apartment.valor);
          } else {
            setValorVenda(0);
          }
        }}
        required
        className="rounded-lg border border-ink-900/20 px-3 py-2"
      >
        {reservedApartaments.length === 0 ? (
          <option value="">Nenhum apartamento reservado</option>
        ) : (
          <>
            <option value="">Selecione um apartamento</option>

            {reservedApartaments.map((apartment) => (
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
      <InputNumber
        placeholder="Valor da venda"
        min={0}
        step="0.01"
        value={valorVenda}
        type="text"
        onChange={(event) => setValorVenda(Number(event.target.value))}
        required
      />
      <Button type="submit" disabled={createMutation.isPending}>
        {createMutation.isPending ? "Salvando..." : "Registrar venda"}
      </Button>
    </form>
  );
};
