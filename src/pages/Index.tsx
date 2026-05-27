import { useState } from "react";
import { Task, AnalyzedTask, SortingStrategy } from "@/types/task";
import { TaskAnalyzer } from "@/lib/taskAnalyzer";
import { TaskInput } from "@/components/TaskInput";
import { StrategySelector } from "@/components/StrategySelector";
import { TaskResults } from "@/components/TaskResults";
import { Brain } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [analyzedTasks, setAnalyzedTasks] = useState<AnalyzedTask[]>([]);
  const [strategy, setStrategy] = useState<SortingStrategy>("smart-balance");

  const handleTasksSubmit = (tasks: Task[]) => {
    try {
      const analyzer = new TaskAnalyzer(tasks);
      const results = analyzer.analyzeTasks(strategy);
      setAnalyzedTasks(results);
      toast.success("Tasks analyzed successfully!");
    } catch (error) {
      toast.error("Error analyzing tasks. Please check your input.");
      console.error(error);
    }
  };

  const handleStrategyChange = (newStrategy: SortingStrategy) => {
    setStrategy(newStrategy);
    if (analyzedTasks.length > 0) {
      // Re-analyze with new strategy
      const tasks = analyzedTasks.map(
        ({ priorityScore, priorityLevel, explanation, warnings, ...task }) => task
      );
      const analyzer = new TaskAnalyzer(tasks);
      const results = analyzer.analyzeTasks(newStrategy);
      setAnalyzedTasks(results);
      toast.success("Strategy changed successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-card/95 backdrop-blur-lg shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-hero shadow-medium">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                Smart Task Analyzer
              </h1>
              <p className="text-sm text-muted-foreground">
                Intelligent task prioritization system
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Input */}
          <div className="lg:col-span-1">
            <TaskInput onTasksSubmit={handleTasksSubmit} />
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2 space-y-6">
            {analyzedTasks.length === 0 ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center max-w-md">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-hero/10 flex items-center justify-center">
                    <Brain className="w-12 h-12 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-3">
                    Smart AI Task Analyzer
                  </h2>
                  <p className="text-muted-foreground">
                    Track, prioritize, and optimize your workflow with intelligent task analysis and real-time productivity insights.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <StrategySelector
                  strategy={strategy}
                  onStrategyChange={handleStrategyChange}
                />
                <TaskResults tasks={analyzedTasks} strategy={strategy} />
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/30 mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Smart Task Analyzer - Built with intelligent priority algorithms
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
