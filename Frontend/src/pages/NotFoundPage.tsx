import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow-soft">
      <h1 className="font-title text-3xl font-bold text-ink-900">Pagina nao encontrada</h1>
      <p className="mt-3 text-sm text-ink-500">A rota acessada nao existe ou foi removida.</p>
      <Link to="/apartamentos" className="mt-6 inline-block rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white">
        Voltar para inicio
      </Link>
    </div>
  );
};
