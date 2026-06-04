import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/Button";
import { ErrorState } from "@/components/ErrorState";
import { FormField } from "@/components/FormField";
import { InputText } from "@/components/InputText";
import { authService } from "@/services/authService";
import { tokenStorage } from "@/utils/storage";

const loginSchema = z.object({
  username: z.string().min(3, "Usuario obrigatorio"),
  password: z.string().min(3, "Senha obrigatoria")
});

type LoginValues = z.infer<typeof loginSchema>;

const getLoginErrorMessage = (error: unknown) => {
  const axiosError = error as AxiosError<{ message?: string; error?: string; title?: string }>; 
  const apiMessage = axiosError.response?.data?.message
    ?? axiosError.response?.data?.error
    ?? axiosError.response?.data?.title;

  if (apiMessage) {
    return apiMessage;
  }

  if (axiosError.response?.status) {
    return `Falha no login (${axiosError.response.status}).`;
  }

  if (axiosError.message) {
    return axiosError.message;
  }

  return "Nao foi possivel autenticar.";
};

export const LoginPage = () => {
  const existingToken = tokenStorage.get();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (response) => {
      tokenStorage.set(response.token);
      window.location.href = "/apartamentos";
    }
  });

  if (existingToken) {
    return <Navigate to="/apartamentos" replace />;
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[linear-gradient(135deg,#e9fff8_0%,#f6f9ff_45%,#edf7ff_100%)] px-4">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-glass">
        <h1 className="font-title text-3xl font-bold text-ink-900">Bem-vindo</h1>
        <p className="mt-2 text-sm text-ink-500">Entre com suas credenciais para acessar o painel.</p>

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit((values) => loginMutation.mutate(values))}>
          <FormField label="Usuario" htmlFor="username" required error={errors.username?.message}>
            <InputText id="username" {...register("username")} />
          </FormField>

          <FormField label="Senha" htmlFor="password" required error={errors.password?.message}>
            <InputText id="password" type="password" {...register("password")} />
          </FormField>

          <Button type="submit" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        {loginMutation.error ? (
          <div className="mt-4">
            <ErrorState description={getLoginErrorMessage(loginMutation.error)} />
          </div>
        ) : null}
      </section>
    </div>
  );
};
