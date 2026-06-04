import { forwardRef, type InputHTMLAttributes } from "react";

export const Checkbox = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>((props, ref) => {
  return (
    <label className="inline-flex items-center gap-2 text-sm text-ink-700">
      <input ref={ref} {...props} type="checkbox" className="h-4 w-4 rounded border-ink-900/30 text-brand-600" />
      {props.title}
    </label>
  );
});

Checkbox.displayName = "Checkbox";
