import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/Button";
import { ErrorState } from "@/components/ErrorState";
import { Loading } from "@/components/Loading";
import { useRetryableQuery } from "@/hooks/useRetryableQuery";
import { apartmentService } from "@/services/apartmentService";
import { apartmentStatusLabel, currencyFormatter, parseApiDate } from "@/utils/formatters";

export const ApartmentDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const apartmentQuery = useRetryableQuery({
    queryKey: ["apartamentos", id],
    queryFn: () => apartmentService.getById(id ?? "")
  });

  if (!id) {
    return <ErrorState description="Identificador de apartamento nao informado." />;
  }

  if (apartmentQuery.isLoading) {
    return <Loading label="Carregando detalhes..." />;
  }

  if (apartmentQuery.error || !apartmentQuery.data) {
    return <ErrorState description={apartmentQuery.error?.message ?? "Apartamento nao encontrado."} />;
  }

  const apartment = apartmentQuery.data;

  return (
    <section className="space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-title text-3xl font-bold text-ink-900">Detalhes do apartamento</h1>
          <p className="text-sm text-ink-500">Visao completa da unidade e dados de auditoria.</p>
        </div>
        <Link to={`/apartamentos/${apartment.id}/edit`}>
          <Button>Editar</Button>
        </Link>
      </header>

      <div className="grid gap-4 rounded-2xl border border-ink-900/10 bg-white p-6 shadow-soft md:grid-cols-2">
        <InfoItem label="Numero" value={apartment.numero} />
        <InfoItem label="Bloco" value={apartment.bloco} />
        <InfoItem label="Andar" value={String(apartment.andar)} />
        <InfoItem label="Valor" value={currencyFormatter.format(apartment.valor)} />
        <InfoItem label="Status" value={apartmentStatusLabel(apartment.status)} />
        <InfoItem label="Criado em" value={parseApiDate(apartment.dataCriacao)} />
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
