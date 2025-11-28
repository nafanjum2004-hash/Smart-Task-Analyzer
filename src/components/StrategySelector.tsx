import { SortingStrategy } from "@/types/task";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Clock, Target, AlertCircle, TrendingUp } from "lucide-react";

interface StrategySelectorProps {
  strategy: SortingStrategy;
  onStrategyChange: (strategy: SortingStrategy) => void;
}

export const StrategySelector = ({
  strategy,
  onStrategyChange,
}: StrategySelectorProps) => {
  const strategies = [
    {
      id: "smart-balance" as SortingStrategy,
      name: "Smart Balance",
      description: "Balances urgency, importance, effort, and dependencies",
      icon: TrendingUp,
      color: "from-primary to-primary-glow",
    },
    {
      id: "fastest-wins" as SortingStrategy,
      name: "Fastest Wins",
      description: "Prioritizes quick, low-effort tasks",
      icon: Clock,
      color: "from-secondary to-accent",
    },
    {
      id: "high-impact" as SortingStrategy,
      name: "High Impact",
      description: "Focuses on importance and blocking tasks",
      icon: Target,
      color: "from-priority-high to-priority-medium",
    },
    {
      id: "deadline-driven" as SortingStrategy,
      name: "Deadline Driven",
      description: "Prioritizes based on due dates",
      icon: AlertCircle,
      color: "from-priority-critical to-priority-high",
    },
  ];

  return (
    <Card className="p-6 bg-gradient-card shadow-medium border-border/50">
      <h2 className="text-2xl font-bold mb-4 text-foreground">
        Sorting Strategy
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {strategies.map((s) => {
          const Icon = s.icon;
          const isSelected = strategy === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onStrategyChange(s.id)}
              className={cn(
                "p-5 rounded-xl text-left transition-all border-2",
                isSelected
                  ? "border-primary shadow-medium bg-primary/5"
                  : "border-border/50 hover:border-border hover:shadow-soft bg-card"
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "p-2.5 rounded-lg bg-gradient-to-br",
                    s.color,
                    "text-white shadow-soft"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3
                    className={cn(
                      "font-semibold mb-1",
                      isSelected ? "text-primary" : "text-foreground"
                    )}
                  >
                    {s.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {s.description}
                  </p>
                </div>
                {isSelected && (
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
};
