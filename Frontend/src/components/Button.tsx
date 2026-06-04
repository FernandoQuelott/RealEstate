import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  leftIcon?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-brand-500 text-white hover:bg-brand-600",
  secondary: "bg-ink-900 text-white hover:bg-ink-700",
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost: "bg-transparent text-ink-700 hover:bg-ink-900/5"
};

export const Button = ({
  children,
  variant = "primary",
  leftIcon,
  className = "",
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`.trim()}
    >
      {leftIcon}
      <span>{children}</span>
    </button>
  );
};
