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
      const tasks = analyzedTasks.map(
        ({ priorityScore, priorityLevel, explanation, warnings, ...task }) => task
      );

      const analyzer = new TaskAnalyzer(tasks);
      const results = analyzer.analyzeTasks(newStrategy);

      setAnalyzedTasks(results);
      toast.success("Strategy updated successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-card/95 backdrop-blur-lg shadow-soft">
        <div className="container mx-auto px-4 py-4">

          <div className="flex items-center gap-3">

            <div className="p-3 rounded-xl bg-gradient-hero shadow-medium">
              <Brain className="w-8 h-8 text-white" />
            </div>

            <div>
              <h1 className="text-3xl font-extrabold bg-gradient-hero bg-clip-text text-transparent">
                Smart Task Analyzer
              </h1>

              <p className="text-sm text-muted-foreground">
                AI-powered intelligent task prioritization system
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Banner */}
      <section className="container mx-auto px-4 mt-6">
        <div className="rounded-2xl bg-primary/10 border border-primary/20 p-6 text-center shadow-soft">
          <h2 className="text-2xl font-bold text-primary mb-2">
            Welcome to Smart Task Analyzer 🚀
          </h2>

          <p className="text-muted-foreground">
            Organize, prioritize, and manage your tasks efficiently using smart analysis strategies.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column */}
          <div className="lg:col-span-1">
            <TaskInput onTasksSubmit={handleTasksSubmit} />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">

            {analyzedTasks.length === 0 ? (

              <div className="flex items-center justify-center min-h-[400px]">

                <div className="text-center max-w-md">

                  <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-hero/10 flex items-center justify-center">
                    <Brain className="w-12 h-12 text-primary" />
                  </div>

                  <h2 className="text-2xl font-bold text-foreground mb-3">
                    Ready to Analyze Tasks
                  </h2>

                  <p className="text-muted-foreground">
                    Add tasks manually or import JSON data and click on
                    "Analyze Tasks" to get smart prioritization results instantly.
                  </p>

                </div>
              </div>

            ) : (

              <>
                <StrategySelector
                  strategy={strategy}
                  onStrategyChange={handleStrategyChange}
                />

                <TaskResults
                  tasks={analyzedTasks}
                  strategy={strategy}
                />
              </>
            )}
          </div>
        </div>
      </main>

      {/* Contributor Section */}
      <section className="container mx-auto px-4 pb-8">
        <div className="rounded-xl border border-border bg-card p-5 shadow-soft text-center">
          <h3 className="text-lg font-semibold text-primary mb-2">
            Project Contribution
          </h3>

          <p className="text-muted-foreground">
            Enhanced and contributed by Vaishnavi Jagtap 💡
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/30 mt-10">

        <div className="container mx-auto px-4 py-6">

          <div className="text-center space-y-2">

            <p className="text-sm text-muted-foreground">
              Smart Task Analyzer - Simplifying productivity with smart automation
            </p>

            <p className="text-sm font-medium text-primary">
              Advanced AI-powered task prioritization platform 🚀
            </p>

          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;