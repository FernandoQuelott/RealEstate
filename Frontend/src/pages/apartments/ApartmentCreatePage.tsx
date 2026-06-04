import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ApartmentForm } from "@/pages/apartments/ApartmentForm";
import { apartmentService } from "@/services/apartmentService";
import type { CreateApartmentRequest } from "@/types/entities";

export const ApartmentCreatePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (payload: CreateApartmentRequest) => apartmentService.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["apartamentos"] });
      navigate("/apartamentos");
    }
  });

  return (
    <section className="space-y-4">
      <header>
        <h1 className="font-title text-3xl font-bold text-ink-900">Cadastrar apartamento</h1>
        <p className="text-sm text-ink-500">Preencha os dados da unidade para incluir no portifolio.</p>
      </header>

      <ApartmentForm isSubmitting={createMutation.isPending} onSubmit={(payload) => createMutation.mutate(payload as CreateApartmentRequest)} />
    </section>
  );
};
