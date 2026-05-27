import "./BurnoutAnalyzer.css";

export default function BurnoutAnalyzer({ tasks }) {

  if (!tasks || tasks.length === 0) {
    return null;
  }

  const highPriorityTasks = tasks.filter(
    (task) => task.importance >= 8
  ).length;

  const longTasks = tasks.filter(
    (task) => task.estimatedHours >= 5
  ).length;

  const dependencyLoad = tasks.reduce(
    (acc, task) =>
      acc + (task.dependencies?.length || 0),
    0
  );

  const stressScore =
    highPriorityTasks * 20 +
    longTasks * 15 +
    dependencyLoad * 10;

  let message = "✅ Healthy workload balance";

  if (stressScore > 70) {
    message =
      "⚠️ High burnout risk detected";
  } else if (stressScore > 40) {
    message =
      "🟡 Moderate workload pressure";
  }

  return (
    <div className="burnout-card">

      <h2>Burnout Detection System</h2>

      <div className="stats">

        <div className="stat-box">
          <h3>{stressScore}%</h3>
          <p>Stress Score</p>
        </div>

        <div className="stat-box">
          <h3>{highPriorityTasks}</h3>
          <p>High Priority Tasks</p>
        </div>

        <div className="stat-box">
          <h3>{longTasks}</h3>
          <p>Heavy Tasks</p>
        </div>

      </div>

      <div className="alert-box">
        <p>{message}</p>
      </div>

    </div>
  );
}