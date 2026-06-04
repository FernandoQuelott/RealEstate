interface EmptyStateProps {
  title?: string;
  description: string;
}

export const EmptyState = ({ title = "Nenhum registro encontrado", description }: EmptyStateProps) => {
  return (
    <div className="rounded-2xl border border-dashed border-ink-900/20 bg-white/60 p-10 text-center">
      <h3 className="text-lg font-bold text-ink-700">{title}</h3>
      <p className="mt-2 text-sm text-ink-500">{description}</p>
    </div>
  );
};
