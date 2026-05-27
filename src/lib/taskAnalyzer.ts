// import { Task, AnalyzedTask, SortingStrategy } from "@/types/task";
// import { differenceInDays, isPast, parseISO } from "date-fns";

// interface ScoreComponents {
//   urgency: number;
//   importance: number;
//   effort: number;
//   dependency: number;
// }

// export class TaskAnalyzer {
//   private tasks: Task[] = [];
//   private dependencyGraph: Map<string, Set<string>> = new Map();

//   constructor(tasks: Task[]) {
//     this.tasks = tasks;
//     this.buildDependencyGraph();
//   }

//   private buildDependencyGraph() {
//     // Build forward and reverse dependency maps
//     this.tasks.forEach(task => {
//       if (!this.dependencyGraph.has(task.id)) {
//         this.dependencyGraph.set(task.id, new Set());
//       }
//       task.dependencies.forEach(depId => {
//         if (!this.dependencyGraph.has(depId)) {
//           this.dependencyGraph.set(depId, new Set());
//         }
//         this.dependencyGraph.get(depId)!.add(task.id);
//       });
//     });
//   }

//   private detectCircularDependency(taskId: string, visited = new Set<string>(), path = new Set<string>()): boolean {
//     if (path.has(taskId)) return true;
//     if (visited.has(taskId)) return false;

//     visited.add(taskId);
//     path.add(taskId);

//     const task = this.tasks.find(t => t.id === taskId);
//     if (task) {
//       for (const depId of task.dependencies) {
//         if (this.detectCircularDependency(depId, visited, path)) {
//           return true;
//         }
//       }
//     }

//     path.delete(taskId);
//     return false;
//   }

//   private calculateUrgencyScore(dueDate: string): number {
//     try {
//       const due = parseISO(dueDate);
//       const daysUntilDue = differenceInDays(due, new Date());

//       // Past due tasks get highest urgency
//       if (isPast(due)) {
//         const daysOverdue = Math.abs(daysUntilDue);
//         return Math.min(10, 10 + daysOverdue * 0.5);
//       }

//       // Score based on days remaining
//       if (daysUntilDue <= 1) return 9;
//       if (daysUntilDue <= 3) return 8;
//       if (daysUntilDue <= 7) return 6;
//       if (daysUntilDue <= 14) return 4;
//       if (daysUntilDue <= 30) return 2;
//       return 1;
//     } catch {
//       return 5; // Default mid-range score for invalid dates
//     }
//   }

//   private calculateEffortScore(estimatedHours: number): number {
//     // Inverse scoring - lower effort gets higher score (quick wins)
//     if (estimatedHours <= 1) return 10;
//     if (estimatedHours <= 2) return 8;
//     if (estimatedHours <= 4) return 6;
//     if (estimatedHours <= 8) return 4;
//     if (estimatedHours <= 16) return 2;
//     return 1;
//   }

//   private calculateDependencyScore(taskId: string): number {
//     // Tasks that block other tasks get higher scores
//     const blockedTasks = this.dependencyGraph.get(taskId)?.size || 0;
//     return Math.min(10, blockedTasks * 2);
//   }

//   private calculateSmartScore(task: Task): { score: number; components: ScoreComponents } {
//     const urgency = this.calculateUrgencyScore(task.dueDate);
//     const importance = task.importance;
//     const effort = this.calculateEffortScore(task.estimatedHours);
//     const dependency = this.calculateDependencyScore(task.id);

//     // Smart balance algorithm - weighted combination
//     const score = 
//       urgency * 0.35 +        // 35% weight on urgency
//       importance * 0.30 +     // 30% weight on importance
//       effort * 0.20 +         // 20% weight on effort (quick wins)
//       dependency * 0.15;      // 15% weight on dependencies

//     return {
//       score,
//       components: { urgency, importance, effort, dependency }
//     };
//   }

//   private calculateFastestWinsScore(task: Task): number {
//     const effort = this.calculateEffortScore(task.estimatedHours);
//     const importance = task.importance;
//     return effort * 0.7 + importance * 0.3;
//   }

//   private calculateHighImpactScore(task: Task): number {
//     const importance = task.importance;
//     const dependency = this.calculateDependencyScore(task.id);
//     return importance * 0.8 + dependency * 0.2;
//   }

//   private calculateDeadlineDrivenScore(task: Task): number {
//     const urgency = this.calculateUrgencyScore(task.dueDate);
//     const importance = task.importance;
//     return urgency * 0.8 + importance * 0.2;
//   }

//   private generateExplanation(task: Task, components: ScoreComponents, strategy: SortingStrategy): string {
//     const explanations: string[] = [];

//     if (strategy === "smart-balance") {
//       if (components.urgency >= 8) {
//         explanations.push("⏰ Urgent deadline approaching");
//       }
//       if (components.importance >= 8) {
//         explanations.push("⭐ High importance rating");
//       }
//       if (components.effort >= 8) {
//         explanations.push("⚡ Quick win opportunity");
//       }
//       if (components.dependency >= 4) {
//         explanations.push("🔗 Blocks other tasks");
//       }
//     } else if (strategy === "fastest-wins") {
//       explanations.push(`⚡ Can be completed in ${task.estimatedHours}h`);
//     } else if (strategy === "high-impact") {
//       explanations.push(`⭐ Impact level: ${task.importance}/10`);
//     } else if (strategy === "deadline-driven") {
//       try {
//         const days = differenceInDays(parseISO(task.dueDate), new Date());
//         if (days < 0) {
//           explanations.push(`⏰ Overdue by ${Math.abs(days)} days`);
//         } else {
//           explanations.push(`⏰ Due in ${days} days`);
//         }
//       } catch {
//         explanations.push("⏰ Check due date");
//       }
//     }

//     return explanations.join(" • ") || "Standard priority";
//   }

//   private getPriorityLevel(score: number): "critical" | "high" | "medium" | "low" {
//     if (score >= 8) return "critical";
//     if (score >= 6) return "high";
//     if (score >= 4) return "medium";
//     return "low";
//   }

//   private validateTask(task: Task): string[] {
//     const warnings: string[] = [];

//     if (!task.title?.trim()) {
//       warnings.push("Missing title");
//     }

//     if (!task.dueDate) {
//       warnings.push("Missing due date");
//     }

//     if (task.estimatedHours === undefined || task.estimatedHours < 0) {
//       warnings.push("Invalid estimated hours");
//     }

//     if (task.importance < 1 || task.importance > 10) {
//       warnings.push("Importance must be between 1-10");
//     }

//     if (this.detectCircularDependency(task.id)) {
//       warnings.push("⚠️ Circular dependency detected");
//     }

//     return warnings;
//   }

//   analyzeTasks(strategy: SortingStrategy = "smart-balance"): AnalyzedTask[] {
//     const analyzedTasks: AnalyzedTask[] = this.tasks.map(task => {
//       const warnings = this.validateTask(task);
//       let score: number;
//       let components: ScoreComponents;

//       if (strategy === "smart-balance") {
//         const result = this.calculateSmartScore(task);
//         score = result.score;
//         components = result.components;
//       } else if (strategy === "fastest-wins") {
//         score = this.calculateFastestWinsScore(task);
//         components = {
//           urgency: 0,
//           importance: task.importance,
//           effort: this.calculateEffortScore(task.estimatedHours),
//           dependency: 0
//         };
//       } else if (strategy === "high-impact") {
//         score = this.calculateHighImpactScore(task);
//         components = {
//           urgency: 0,
//           importance: task.importance,
//           effort: 0,
//           dependency: this.calculateDependencyScore(task.id)
//         };
//       } else {
//         score = this.calculateDeadlineDrivenScore(task);
//         components = {
//           urgency: this.calculateUrgencyScore(task.dueDate),
//           importance: task.importance,
//           effort: 0,
//           dependency: 0
//         };
//       }

//       return {
//         ...task,
//         priorityScore: Number(score.toFixed(2)),
//         priorityLevel: this.getPriorityLevel(score),
//         explanation: this.generateExplanation(task, components, strategy),
//         warnings: warnings.length > 0 ? warnings : undefined
//       };
//     });

//     // Sort by priority score (highest first)
//     return analyzedTasks.sort((a, b) => b.priorityScore - a.priorityScore);
//   }

//   getTopSuggestions(count: number = 3, strategy: SortingStrategy = "smart-balance"): AnalyzedTask[] {
//     const analyzed = this.analyzeTasks(strategy);
//     return analyzed.slice(0, count);
//   }
// }



import { Task, AnalyzedTask, SortingStrategy } from "@/types/task";
import { differenceInDays, isPast, parseISO } from "date-fns";

interface ScoreComponents {
  urgency: number;
  importance: number;
  effort: number;
  dependency: number;
}

export class TaskAnalyzer {
  private tasks: Task[] = [];
  private dependencyGraph: Map<string, Set<string>> = new Map();

  constructor(tasks: Task[]) {
    this.tasks = tasks;
    this.buildDependencyGraph();
  }

  private buildDependencyGraph() {
    // Build forward and reverse dependency maps
    this.tasks.forEach(task => {
      if (!this.dependencyGraph.has(task.id)) {
        this.dependencyGraph.set(task.id, new Set());
      }

      task.dependencies.forEach(depId => {
        if (!this.dependencyGraph.has(depId)) {
          this.dependencyGraph.set(depId, new Set());
        }

        this.dependencyGraph.get(depId)!.add(task.id);
      });
    });
  }

  private detectCircularDependency(
    taskId: string,
    visited = new Set<string>(),
    path = new Set<string>()
  ): boolean {
    if (path.has(taskId)) return true;
    if (visited.has(taskId)) return false;

    visited.add(taskId);
    path.add(taskId);

    const task = this.tasks.find(t => t.id === taskId);

    if (task) {
      for (const depId of task.dependencies) {
        if (this.detectCircularDependency(depId, visited, path)) {
          return true;
        }
      }
    }

    path.delete(taskId);

    return false;
  }

  private calculateUrgencyScore(dueDate: string): number {
    try {
      const due = parseISO(dueDate);

      const daysUntilDue = differenceInDays(due, new Date());

      // Past due tasks get highest urgency
      if (isPast(due)) {
        const daysOverdue = Math.abs(daysUntilDue);

        return Math.min(10, 10 + daysOverdue * 0.5);
      }

      // Score based on days remaining
      if (daysUntilDue <= 1) return 9;
      if (daysUntilDue <= 3) return 8;
      if (daysUntilDue <= 7) return 6;
      if (daysUntilDue <= 14) return 4;
      if (daysUntilDue <= 30) return 2;

      return 1;
    } catch {
      return 5;
    }
  }

  private calculateEffortScore(
    estimatedHours: number
  ): number {
    // Lower effort gets higher score
    if (estimatedHours <= 1) return 10;
    if (estimatedHours <= 2) return 8;
    if (estimatedHours <= 4) return 6;
    if (estimatedHours <= 8) return 4;
    if (estimatedHours <= 16) return 2;

    return 1;
  }

  private calculateDependencyScore(taskId: string): number {
    // Tasks blocking other tasks get higher score
    const blockedTasks =
      this.dependencyGraph.get(taskId)?.size || 0;

    return Math.min(10, blockedTasks * 2);
  }

  private calculateSmartScore(
    task: Task
  ): { score: number; components: ScoreComponents } {
    const urgency = this.calculateUrgencyScore(task.dueDate);

    const importance = task.importance;

    const effort = this.calculateEffortScore(
      task.estimatedHours
    );

    const dependency = this.calculateDependencyScore(task.id);

    // Smart weighted scoring system

    const score =
      urgency * 0.35 +
      importance * 0.30 +
      effort * 0.20 +
      dependency * 0.15;

    return {
      score,
      components: {
        urgency,
        importance,
        effort,
        dependency
      }
    };
  }

  private calculateFastestWinsScore(task: Task): number {
    const effort = this.calculateEffortScore(
      task.estimatedHours
    );

    const importance = task.importance;

    return effort * 0.7 + importance * 0.3;
  }

  private calculateHighImpactScore(task: Task): number {
    const importance = task.importance;

    const dependency = this.calculateDependencyScore(
      task.id
    );

    return importance * 0.8 + dependency * 0.2;
  }

  private calculateDeadlineDrivenScore(task: Task): number {
    const urgency = this.calculateUrgencyScore(
      task.dueDate
    );

    const importance = task.importance;

    return urgency * 0.8 + importance * 0.2;
  }

  private generateExplanation(
    task: Task,
    components: ScoreComponents,
    strategy: SortingStrategy
  ): string {
    const explanations: string[] = [];

    if (strategy === "smart-balance") {

      if (isPast(parseISO(task.dueDate))) {
        explanations.push("🚨 Task is overdue");
      }

      if (components.urgency >= 8) {
        explanations.push("⏰ Urgent deadline approaching");
      }

      if (components.importance >= 8) {
        explanations.push("⭐ High importance rating");
      }

      if (components.effort >= 8) {
        explanations.push("⚡ Quick win opportunity");
      }

      if (components.dependency >= 4) {
        explanations.push("🔗 Blocks other tasks");
      }

    } else if (strategy === "fastest-wins") {

      explanations.push(
        `⚡ Can be completed in ${task.estimatedHours}h`
      );

    } else if (strategy === "high-impact") {

      explanations.push(
        `⭐ Impact level: ${task.importance}/10`
      );

    } else if (strategy === "deadline-driven") {

      try {
        const days = differenceInDays(
          parseISO(task.dueDate),
          new Date()
        );

        if (days < 0) {
          explanations.push(
            `⏰ Overdue by ${Math.abs(days)} days`
          );
        } else {
          explanations.push(`⏰ Due in ${days} days`);
        }

      } catch {
        explanations.push("⏰ Check due date");
      }
    }

    return explanations.join(" • ") || "Standard priority";
  }

  private getPriorityLevel(
    score: number
  ): "critical" | "high" | "medium" | "low" {

    if (score >= 8) return "critical";

    if (score >= 6) return "high";

    if (score >= 4) return "medium";

    return "low";
  }

  private validateTask(task: Task): string[] {
    const warnings: string[] = [];

    if (!task.title?.trim()) {
      warnings.push("Missing title");
    }

    if (!task.dueDate) {
      warnings.push("Missing due date");
    }

    if (
      task.estimatedHours === undefined ||
      task.estimatedHours < 0
    ) {
      warnings.push("Invalid estimated hours");
    }

    if (task.importance < 1 || task.importance > 10) {
      warnings.push(
        "Importance must be between 1-10"
      );
    }

    if (this.detectCircularDependency(task.id)) {
      warnings.push(
        "⚠️ Circular dependency detected"
      );
    }

    return warnings;
  }

  analyzeTasks(
    strategy: SortingStrategy = "smart-balance"
  ): AnalyzedTask[] {

    const analyzedTasks: AnalyzedTask[] =
      this.tasks.map(task => {

        const warnings = this.validateTask(task);

        let score: number;

        let components: ScoreComponents;

        if (strategy === "smart-balance") {

          const result =
            this.calculateSmartScore(task);

          score = result.score;

          components = result.components;

        } else if (strategy === "fastest-wins") {

          score =
            this.calculateFastestWinsScore(task);

          components = {
            urgency: 0,
            importance: task.importance,
            effort: this.calculateEffortScore(
              task.estimatedHours
            ),
            dependency: 0
          };

        } else if (strategy === "high-impact") {

          score =
            this.calculateHighImpactScore(task);

          components = {
            urgency: 0,
            importance: task.importance,
            effort: 0,
            dependency:
              this.calculateDependencyScore(task.id)
          };

        } else {

          score =
            this.calculateDeadlineDrivenScore(task);

          components = {
            urgency: this.calculateUrgencyScore(
              task.dueDate
            ),
            importance: task.importance,
            effort: 0,
            dependency: 0
          };
        }

        return {
          ...task,

          priorityScore: Number(score.toFixed(2)),

          priorityLevel:
            this.getPriorityLevel(score),

          explanation: this.generateExplanation(
            task,
            components,
            strategy
          ),

          // NEW FEATURE
          isOverdue: isPast(
            parseISO(task.dueDate)
          ),

          warnings:
            warnings.length > 0
              ? warnings
              : undefined
        };
      });

    // Sort by highest priority

    return analyzedTasks.sort(
      (a, b) => b.priorityScore - a.priorityScore
    );
  }

  // NEW DASHBOARD STATS FEATURE

  getTaskStats() {

    const totalTasks = this.tasks.length;

    const overdueTasks = this.tasks.filter(task =>
      isPast(parseISO(task.dueDate))
    ).length;

    const highPriorityTasks = this.tasks.filter(
      task => task.importance >= 8
    ).length;

    const averageImportance =
      totalTasks > 0
        ? (
            this.tasks.reduce(
              (sum, task) =>
                sum + task.importance,
              0
            ) / totalTasks
          ).toFixed(1)
        : 0;

    return {
      totalTasks,
      overdueTasks,
      highPriorityTasks,
      averageImportance
    };
  }

  getTopSuggestions(
    count: number = 3,
    strategy: SortingStrategy = "smart-balance"
  ): AnalyzedTask[] {

    const analyzed =
      this.analyzeTasks(strategy);

    return analyzed.slice(0, count);
  }
}