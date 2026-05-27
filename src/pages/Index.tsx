import { useState } from "react";
import { Task, AnalyzedTask, SortingStrategy } from "@/types/task";
import { TaskAnalyzer } from "@/lib/taskAnalyzer";
import { TaskInput } from "@/components/TaskInput";
import { StrategySelector } from "@/components/StrategySelector";
import { TaskResults } from "@/components/TaskResults";
import { Brain, Sparkles } from "lucide-react";
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
      toast.success(`Switched to "${newStrategy}" strategy`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 shadow-lg">
              <Brain className="w-7 h-7 text-white" />
            </div>

            <div>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Smart Task Analyzer
              </h1>

              <p className="text-sm text-slate-300 flex items-center gap-2 mt-1">
                <Sparkles className="w-4 h-4" />
                AI-powered intelligent task prioritization
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-10 pb-4">
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-8 shadow-2xl">
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            Organize Your Work <br />
            <span className="text-violet-400">Smarter & Faster</span>
          </h2>

          <p className="text-slate-300 max-w-2xl text-lg">
            Analyze task urgency, priority, and workload using intelligent
            algorithms designed to improve productivity and focus.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4">
              <TaskInput onTasksSubmit={handleTasksSubmit} />
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">

            {analyzedTasks.length === 0 ? (
              <div className="flex items-center justify-center min-h-[400px] rounded-3xl border border-dashed border-white/10 bg-white/5 backdrop-blur-md">
                <div className="text-center max-w-md px-6">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-r from-violet-500/20 to-cyan-500/20 flex items-center justify-center">
                    <Brain className="w-12 h-12 text-violet-400" />
                  </div>

                  <h2 className="text-3xl font-bold mb-3">
                    Ready to Analyze
                  </h2>

                  <p className="text-slate-300">
                    Add your tasks and let the system intelligently prioritize
                    them based on urgency, impact, and workload balance.
                  </p>

                </div>
              </div>

            ) : (

              <>
                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4">
                  <StrategySelector
                    strategy={strategy}
                    onStrategyChange={handleStrategyChange}
                  />
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4">
                  <TaskResults tasks={analyzedTasks} strategy={strategy} />
                </div>
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
      <footer className="border-t border-white/10 bg-slate-900/70 mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-slate-400">
            Smart Task Analyzer © 2026 • Designed for productivity & intelligent
            planning
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;