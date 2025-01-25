import { Loader2 } from "lucide-react";
import { cn } from "../lib/utils";

interface LoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
  fullScreen?: boolean;
}

export default function Loading({
  className,
  size = "md",
  text = "Loading...",
  fullScreen = false,
}: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const containerClasses = cn(
    "flex flex-col items-center justify-center gap-3",
    fullScreen && "fixed inset-0 bg-purple-950/80 backdrop-blur-sm z-50",
    className
  );

  const spinnerClasses = cn("animate-spin text-purple-500", sizeClasses[size]);

  const textClasses = cn("text-purple-100 animate-pulse", {
    "text-sm": size === "sm",
    "text-base": size === "md",
    "text-lg": size === "lg",
  });

  return (
    <div className={containerClasses}>
      <Loader2 className={spinnerClasses} />
      {text && <p className={textClasses}>{text}</p>}
    </div>
  );
}
