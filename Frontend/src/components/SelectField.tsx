import type { SelectHTMLAttributes } from "react";

export const SelectField = (props: SelectHTMLAttributes<HTMLSelectElement>) => {
  return (
    <select
      {...props}
      className={`w-full rounded-xl border border-ink-900/15 bg-white px-3 py-2 text-sm text-ink-900 outline-none ring-brand-500 transition focus:ring-2 ${props.className ?? ""}`.trim()}
    />
  );
};
