import { AnalyzedTask, SortingStrategy } from "@/types/task";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertCircle, TrendingUp, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskResultsProps {
  tasks: AnalyzedTask[];
  strategy: SortingStrategy;
}

export const TaskResults = ({ tasks, strategy }: TaskResultsProps) => {
  const topThree = tasks.slice(0, 3);

  const getPriorityColor = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-priority-critical/10 text-priority-critical border-priority-critical/20";
      case "high":
        return "bg-priority-high/10 text-priority-high border-priority-high/20";
      case "medium":
        return "bg-priority-medium/10 text-priority-medium border-priority-medium/20";
      case "low":
        return "bg-priority-low/10 text-priority-low border-priority-low/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStrategyIcon = () => {
    switch (strategy) {
      case "fastest-wins":
        return <Clock className="w-4 h-4" />;
      case "high-impact":
        return <Target className="w-4 h-4" />;
      case "deadline-driven":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <TrendingUp className="w-4 h-4" />;
    }
  };

  const getStrategyName = () => {
    switch (strategy) {
      case "fastest-wins":
        return "Fastest Wins";
      case "high-impact":
        return "High Impact";
      case "deadline-driven":
        return "Deadline Driven";
      default:
        return "Smart Balance";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-hero shadow-strong border-0">
        <div className="flex items-center gap-2 mb-4">
          {getStrategyIcon()}
          <h2 className="text-2xl font-bold text-white">Top 3 Recommendations</h2>
        </div>
        <p className="text-white/90 mb-6">
          Based on <span className="font-semibold">{getStrategyName()}</span> strategy
        </p>
        <div className="space-y-4">
          {topThree.map((task, index) => (
            <div
              key={task.id}
              className="p-5 bg-white/95 backdrop-blur rounded-xl shadow-medium border border-white/20 hover:shadow-strong transition-all"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-hero text-white font-bold text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-foreground mb-2">
                      {task.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{task.explanation}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {task.priorityScore}
                  </div>
                  <Badge
                    className={cn(
                      "text-xs font-semibold border",
                      getPriorityColor(task.priorityLevel)
                    )}
                  >
                    {task.priorityLevel.toUpperCase()}
                  </Badge>
                </div>
              </div>
              {task.warnings && task.warnings.length > 0 && (
                <div className="mt-3 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                  <div className="flex items-center gap-2 text-destructive text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{task.warnings.join(", ")}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-gradient-card shadow-medium border-border/50">
        <h2 className="text-2xl font-bold mb-6 text-foreground">All Tasks (Sorted)</h2>
        <div className="space-y-3">
          {tasks.map((task, index) => (
            <div
              key={task.id}
              className={cn(
                "p-5 rounded-lg border transition-all hover:shadow-medium",
                index < 3
                  ? "bg-card border-primary/30 shadow-soft"
                  : "bg-muted/30 border-border/50"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-foreground">{task.title}</h3>
                    <Badge
                      className={cn(
                        "text-xs font-semibold border",
                        getPriorityColor(task.priorityLevel)
                      )}
                    >
                      {task.priorityLevel}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>{task.explanation}</div>
                    <div className="flex flex-wrap gap-4 mt-2">
                      <span>📅 Due: {task.dueDate}</span>
                      <span>⏱️ {task.estimatedHours}h</span>
                      <span>⭐ Importance: {task.importance}/10</span>
                      {task.dependencies.length > 0 && (
                        <span>🔗 {task.dependencies.length} dependencies</span>
                      )}
                    </div>
                  </div>
                  {task.warnings && task.warnings.length > 0 && (
                    <div className="mt-2 flex items-center gap-2 text-destructive text-sm">
                      <AlertCircle className="w-3 h-3" />
                      <span>{task.warnings.join(", ")}</span>
                    </div>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xl font-bold text-primary">
                    {task.priorityScore}
                  </div>
                  <div className="text-xs text-muted-foreground">score</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
