import { Button } from "@/components/Button";

interface ErrorStateProps {
  title?: string;
  description: string;
  onRetry?: () => void;
}

export const ErrorState = ({
  title = "Nao foi possivel carregar os dados",
  description,
  onRetry
}: ErrorStateProps) => {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
      <h3 className="text-lg font-bold text-red-700">{title}</h3>
      <p className="mt-2 text-sm text-red-600">{description}</p>
      {onRetry ? (
        <Button className="mt-4" variant="danger" onClick={onRetry}>
          Tentar novamente
        </Button>
      ) : null}
    </div>
  );
};
