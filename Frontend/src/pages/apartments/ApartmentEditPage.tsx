import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorState } from "@/components/ErrorState";
import { Loading } from "@/components/Loading";
import { useRetryableQuery } from "@/hooks/useRetryableQuery";
import { ApartmentForm } from "@/pages/apartments/ApartmentForm";
import { apartmentService } from "@/services/apartmentService";
import type { UpdateApartmentRequest } from "@/types/entities";

export const ApartmentEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const apartmentQuery = useRetryableQuery({
    queryKey: ["apartamentos", id],
    queryFn: () => apartmentService.getById(id ?? "")
  });

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateApartmentRequest) => apartmentService.update(id ?? "", payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["apartamentos"] });
      navigate("/apartamentos");
    }
  });

  if (!id) {
    return <ErrorState description="Identificador de apartamento nao informado." />;
  }

  if (apartmentQuery.isLoading) {
    return <Loading label="Carregando apartamento..." />;
  }

  if (apartmentQuery.error || !apartmentQuery.data) {
    return <ErrorState description={apartmentQuery.error?.message ?? "Apartamento nao encontrado."} />;
  }

  return (
    <section className="space-y-4">
      <header>
        <h1 className="font-title text-3xl font-bold text-ink-900">Editar apartamento</h1>
        <p className="text-sm text-ink-500">Atualize os dados de identificacao e valor da unidade.</p>
      </header>

      <ApartmentForm
        initialData={apartmentQuery.data}
        isSubmitting={updateMutation.isPending}
        onSubmit={(payload) => updateMutation.mutate(payload as UpdateApartmentRequest)}
      />
    </section>
  );
};
