import * as React from "react";
import { cn } from "@/lib/utils";

const EmptyState = ({ 
  title, 
  description, 
  icon: Icon, 
  action, 
  className 
}: { 
  title: string, 
  description: string, 
  icon?: React.ElementType, 
  action?: React.ReactNode, 
  className?: string 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center bg-zinc-50 rounded-lg border border-zinc-200 border-dashed", className)}>
      {Icon && <Icon className="w-10 h-10 text-zinc-400 mb-4" />}
      <h3 className="text-lg font-medium text-zinc-900">{title}</h3>
      <p className="text-sm text-zinc-500 mt-1 max-w-sm">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export { EmptyState };
