import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EarningsCardProps {
  title: string;
  amount: number;
  currency?: string;
  trend?: number;
  icon: LucideIcon;
  variant?: "primary" | "success" | "warning";
  className?: string;
}

const EarningsCard = ({ 
  title, 
  amount, 
  currency = "₦", 
  trend, 
  icon: Icon,
  variant = "primary",
  className 
}: EarningsCardProps) => {
  const variantStyles = {
    primary: "bg-gradient-primary text-primary-foreground shadow-primary",
    success: "bg-gradient-success text-secondary-foreground shadow-success", 
    warning: "bg-gradient-to-br from-accent to-accent/80 text-accent-foreground"
  };

  return (
    <Card className={cn(
      "p-4 border-0 animate-slide-up",
      variantStyles[variant],
      className
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-sm opacity-90 font-medium">{title}</p>
          <p className="text-2xl font-bold tracking-tight">
            {currency}{amount.toLocaleString()}
          </p>
          {trend !== undefined && (
            <p className={cn(
              "text-xs mt-1 flex items-center gap-1",
              trend >= 0 ? "text-green-200" : "text-red-200"
            )}>
              {trend >= 0 ? "↗" : "↘"} {Math.abs(trend)}%
            </p>
          )}
        </div>
        <div className="ml-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Icon size={20} className="opacity-90" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EarningsCard;