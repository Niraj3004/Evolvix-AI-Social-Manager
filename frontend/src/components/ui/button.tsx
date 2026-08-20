import * as React from "react";
import { cn } from "@/lib/utils";

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' }>(
  ({ className, variant = 'primary', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2",
          {
            "bg-zinc-900 text-zinc-50 shadow hover:bg-zinc-900/90": variant === 'primary',
            "bg-zinc-100 text-zinc-900 shadow-sm hover:bg-zinc-100/80": variant === 'secondary',
            "border border-zinc-200 bg-transparent shadow-sm hover:bg-zinc-100 hover:text-zinc-900": variant === 'outline',
            "hover:bg-zinc-100 hover:text-zinc-900": variant === 'ghost',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
