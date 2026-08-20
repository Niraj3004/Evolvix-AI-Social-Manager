import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const Spinner = ({ className, size = 24 }: { className?: string, size?: number }) => {
  return (
    <Loader2 
      className={cn("animate-spin text-zinc-500", className)} 
      size={size} 
    />
  );
}

export { Spinner };
