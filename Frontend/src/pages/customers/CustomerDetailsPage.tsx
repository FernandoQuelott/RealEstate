import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/Button";
import { ErrorState } from "@/components/ErrorState";
import { Loading } from "@/components/Loading";
import { useRetryableQuery } from "@/hooks/useRetryableQuery";
import { customerService } from "@/services/customerService";
import { parseApiDate } from "@/utils/formatters";

export const CustomerDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const customerQuery = useRetryableQuery({
    queryKey: ["clientes", id],
    queryFn: () => customerService.getById(id ?? "")
  });

  if (!id) {
    return <ErrorState description="Identificador de cliente nao informado." />;
  }

  if (customerQuery.isLoading) {
    return <Loading label="Carregando detalhes..." />;
  }

  if (customerQuery.error || !customerQuery.data) {
    return <ErrorState description={customerQuery.error?.message ?? "Cliente nao encontrado."} />;
  }

  const customer = customerQuery.data;

  return (
    <section className="space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-title text-3xl font-bold text-ink-900">Detalhes do cliente</h1>
          <p className="text-sm text-ink-500">Informacoes completas e auditoria do cadastro.</p>
        </div>
        <Link to={`/clientes/${customer.id}/edit`}>
          <Button>Editar</Button>
        </Link>
      </header>

      <div className="grid gap-4 rounded-2xl border border-ink-900/10 bg-white p-6 shadow-soft md:grid-cols-2">
        <InfoItem label="Nome" value={customer.nome} />
        <InfoItem label="CPF" value={customer.cpf} />
        <InfoItem label="Email" value={customer.email} />
        <InfoItem label="Telefone" value={customer.telefone} />
        <InfoItem label="Data de cadastro" value={parseApiDate(customer.dataCadastro)} />
        <InfoItem label="Criado em" value={parseApiDate(customer.dataCriacao)} />
      </div>
    </section>
  );
};

const InfoItem = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="rounded-xl border border-ink-900/10 bg-ink-900/5 p-4">
      <p className="text-xs uppercase tracking-wide text-ink-500">{label}</p>
      <p className="mt-1 text-base font-semibold text-ink-900">{value}</p>
    </div>
  );
};
