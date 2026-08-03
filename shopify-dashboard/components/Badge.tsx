import { cn } from "@/lib/utils";

export type BadgeVariant = "warning" | "amber" | "danger" | "success" | "neutral" | "attention" | "default";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  icon?: "circle" | "ring" | "square" | "none";
  className?: string;
}

export function Badge({ children, variant = "default", icon = "none", className }: BadgeProps) {
  const baseStyles = "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[12px] font-medium leading-4 whitespace-nowrap select-none";
  
  const variants = {
    warning: "bg-[#ffd8a8] text-[#3b2000]",
    amber: "bg-[#fef08a] text-[#3d2b00]",
    attention: "bg-[#ffd8a8] text-[#5c1d00]",
    danger: "bg-[#fde8e8] text-[#8c1d18]",
    success: "bg-[#a6f4c5] text-[#064e3b]",
    neutral: "bg-[#f1f2f4] text-[#303030]",
    default: "bg-[#f1f2f4] text-[#303030]",
  };

  const dotColors = {
    warning: "bg-[#3b2000]",
    amber: "bg-[#3d2b00]",
    attention: "bg-[#4a1a00]",
    danger: "bg-[#8c1d18]",
    success: "bg-[#053818]",
    neutral: "bg-[#616161]",
    default: "bg-[#616161]",
  };

  const ringColors = {
    warning: "border-[#3b2000]",
    amber: "border-[#3d2b00]",
    attention: "border-[#4a1a00]",
    danger: "border-[#8c1d18]",
    success: "border-[#053818]",
    neutral: "border-[#616161]",
    default: "border-[#616161]",
  };

  return (
    <span className={cn(baseStyles, variants[variant], className)}>
      {icon === "ring" && (
        <span className={cn("w-2 h-2 rounded-full border-[1.5px] bg-transparent shrink-0", ringColors[variant])} />
      )}
      {icon === "circle" && (
        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColors[variant])} />
      )}
      {icon === "square" && (
        <span className={cn("w-1.5 h-1.5 rounded-[1.5px] shrink-0", dotColors[variant])} />
      )}
      {children}
    </span>
  );
}
