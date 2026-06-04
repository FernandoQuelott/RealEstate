import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { CustomerForm } from "@/pages/customers/CustomerForm";
import { customerService } from "@/services/customerService";
import type { CreateCustomerRequest } from "@/types/entities";

export const CustomerCreatePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (payload: CreateCustomerRequest) => customerService.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["clientes"] });
      navigate("/clientes");
    }
  });

  return (
    <section className="space-y-4">
      <header>
        <h1 className="font-title text-3xl font-bold text-ink-900">Cadastrar cliente</h1>
        <p className="text-sm text-ink-500">Preencha os dados para criar um novo cadastro.</p>
      </header>

      <CustomerForm mode="create" isSubmitting={createMutation.isPending} onSubmit={(payload) => createMutation.mutate(payload as CreateCustomerRequest)} />
    </section>
  );
};
