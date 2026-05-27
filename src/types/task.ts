export interface Task {
  id: string;
  title: string;
  dueDate: string;
  estimatedHours: number;
  importance: number; // 1-10 scale
  dependencies: string[]; // list of task IDs
  priorityScore?: number;
  explanation?: string;
}

export type SortingStrategy = 
  | "smart-balance"
  | "fastest-wins"
  | "high-impact"
  | "deadline-driven";

export interface AnalyzedTask extends Task {
  priorityScore: number;
  priorityLevel: "critical" | "high" | "medium" | "low";
  explanation: string;
  warnings?: string[];
}
