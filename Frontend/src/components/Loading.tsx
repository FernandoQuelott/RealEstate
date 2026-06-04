export const Loading = ({ label = "Carregando..." }: { label?: string }) => {
  return (
    <div className="flex min-h-32 items-center justify-center rounded-2xl border border-ink-900/10 bg-white/80 p-6 shadow-soft">
      <div className="flex items-center gap-3">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-300 border-t-brand-600" />
        <span className="text-sm font-medium text-ink-700">{label}</span>
      </div>
    </div>
  );
};
