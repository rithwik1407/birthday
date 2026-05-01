import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "sm" | "md" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-rose-primary focus:ring-offset-2 focus:ring-offset-bg-primary";

    const variants = {
      default:
        "gradient-romantic text-white hover:shadow-lg hover:scale-105 active:scale-95 glow-rose",
      outline:
        "border-2 border-rose-primary text-rose-primary hover:bg-rose-primary/10 active:scale-95 hover:glow-rose",
      ghost: "text-rose-primary hover:bg-rose-primary/10 active:scale-95",
      secondary:
        "glass-medium text-text-primary hover:glass-strong active:scale-95 backdrop-blur-lg border border-glass-border hover:glow-rose",
    };

    const sizes = {
      sm: "px-3 py-2 text-sm",
      md: "px-5 py-2.5 text-base",
      lg: "px-6 py-3 text-lg",
    };

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
