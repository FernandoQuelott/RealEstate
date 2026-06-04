import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorState } from "@/components/ErrorState";
import { Loading } from "@/components/Loading";
import { useRetryableQuery } from "@/hooks/useRetryableQuery";
import { CustomerForm } from "@/pages/customers/CustomerForm";
import { customerService } from "@/services/customerService";
import type { UpdateCustomerRequest } from "@/types/entities";

export const CustomerEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const customerQuery = useRetryableQuery({
    queryKey: ["clientes", id],
    queryFn: () => customerService.getById(id ?? "")
  });

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateCustomerRequest) => customerService.update(id ?? "", payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["clientes"] });
      navigate("/clientes");
    }
  });

  if (!id) {
    return <ErrorState description="Identificador de cliente nao informado." />;
  }

  if (customerQuery.isLoading) {
    return <Loading label="Carregando cliente..." />;
  }

  if (customerQuery.error || !customerQuery.data) {
    return <ErrorState description={customerQuery.error?.message ?? "Cliente nao encontrado."} />;
  }

  return (
    <section className="space-y-4">
      <header>
        <h1 className="font-title text-3xl font-bold text-ink-900">Editar cliente</h1>
        <p className="text-sm text-ink-500">Atualize email, telefone e nome do cliente.</p>
      </header>

      <CustomerForm
        mode="edit"
        initialData={customerQuery.data}
        isSubmitting={updateMutation.isPending}
        onSubmit={(payload) => updateMutation.mutate(payload as UpdateCustomerRequest)}
      />
    </section>
  );
};
