import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/Button";
import { FormField } from "@/components/FormField";
import { InputText } from "@/components/InputText";
import type {
  CreateCustomerRequest,
  Customer,
  UpdateCustomerRequest
} from "@/types/entities";
import { cpfMask, phoneMask } from "@/utils/formatters";

const createSchema = z.object({
  nome: z.string().min(3, "Nome deve ter ao menos 3 caracteres"),
  cpf: z.string().min(14, "CPF invalido"),
  email: z.string().email("Email invalido"),
  telefone: z.string().min(14, "Telefone invalido")
});

type CustomerFormValues = z.infer<typeof createSchema>;

interface CustomerFormProps {
  initialData?: Customer;
  mode: "create" | "edit";
  isSubmitting: boolean;
  onSubmit: (payload: CreateCustomerRequest | UpdateCustomerRequest) => void;
}

export const CustomerForm = ({
  initialData,
  mode,
  isSubmitting,
  onSubmit
}: CustomerFormProps) => {
  const createMode = mode === "create";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      nome: initialData?.nome ?? "",
      cpf: initialData?.cpf ?? "",
      email: initialData?.email ?? "",
      telefone: initialData?.telefone ?? ""
    }
  });

  const cpf = watch("cpf");
  const telefone = watch("telefone");

  return (
    <form
      className="grid gap-4 rounded-2xl border border-ink-900/10 bg-white p-6 shadow-soft"
      onSubmit={handleSubmit((values) => {
        if (createMode) {
          onSubmit(values);
          return;
        }

        const { nome, email, telefone } = values;
        onSubmit({ nome, email, telefone });
      })}
    >
      <FormField label="Nome" htmlFor="nome" required error={errors.nome?.message}>
        <InputText id="nome" {...register("nome")} />
      </FormField>

      {createMode ? (
        <FormField label="CPF" htmlFor="cpf" required error={errors.cpf?.message}>
          <InputText
            id="cpf"
            value={cpfMask(cpf ?? "")}
            onChange={(event) => {
              setValue("cpf", event.target.value, { shouldValidate: true });
            }}
          />
        </FormField>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Email" htmlFor="email" required error={errors.email?.message}>
          <InputText id="email" type="email" {...register("email")} />
        </FormField>

        <FormField label="Telefone" htmlFor="telefone" required error={errors.telefone?.message}>
          <InputText
            id="telefone"
            value={phoneMask(telefone ?? "")}
            onChange={(event) => {
              setValue("telefone", event.target.value, { shouldValidate: true });
            }}
          />
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
