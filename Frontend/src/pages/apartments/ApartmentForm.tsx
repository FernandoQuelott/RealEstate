import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/Button";
import { FormField } from "@/components/FormField";
import { InputNumber } from "@/components/InputNumber";
import { InputText } from "@/components/InputText";
import type { Apartment, CreateApartmentRequest, UpdateApartmentRequest } from "@/types/entities";

const apartmentSchema = z.object({
  numero: z.string().min(1, "Numero e obrigatorio"),
  bloco: z.string().min(1, "Bloco e obrigatorio"),
  andar: z.coerce.number().int().min(0, "Andar invalido"),
  valor: z.coerce.number().positive("Valor deve ser maior que zero")
});

type ApartmentFormValues = z.infer<typeof apartmentSchema>;

interface ApartmentFormProps {
  initialData?: Apartment;
  isSubmitting: boolean;
  onSubmit: (payload: CreateApartmentRequest | UpdateApartmentRequest) => void;
}

export const ApartmentForm = ({ initialData, isSubmitting, onSubmit }: ApartmentFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ApartmentFormValues>({
    resolver: zodResolver(apartmentSchema),
    defaultValues: {
      numero: initialData?.numero ?? "",
      bloco: initialData?.bloco ?? "",
      andar: initialData?.andar ?? 0,
      valor: initialData?.valor ?? 0
    }
  });

  return (
    <form className="grid gap-4 rounded-2xl border border-ink-900/10 bg-white p-6 shadow-soft" onSubmit={handleSubmit(onSubmit)}>
      <FormField label="Numero" htmlFor="numero" required error={errors.numero?.message}>
        <InputText id="numero" placeholder="Ex: 1201" {...register("numero")} />
      </FormField>

      <FormField label="Bloco" htmlFor="bloco" required error={errors.bloco?.message}>
        <InputText id="bloco" placeholder="Ex: Torre A" {...register("bloco")} />
      </FormField>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Andar" htmlFor="andar" required error={errors.andar?.message}>
          <InputNumber id="andar" {...register("andar", { valueAsNumber: true })} />
        </FormField>

        <FormField label="Valor" htmlFor="valor" required error={errors.valor?.message}>
          <InputNumber id="valor" step="0.01" {...register("valor", { valueAsNumber: true })} />
        </FormField>
      </div>

      <div className="mt-2 flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
};
