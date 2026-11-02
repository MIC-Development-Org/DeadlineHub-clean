
import { CheckCircle2, Clock, AlertCircle, TrendingUp, Flame } from 'lucide-react';
import './productivitystats.css';

export default function ProductivityStats({ tasks = [] }) {
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    task => task.is_completed
  ).length;

  const pendingTasks = totalTasks - completedTasks;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const overdueTasks = tasks.filter(task =>
    !task.is_completed &&
    task.due_date &&
    new Date(task.due_date + 'T00:00:00') < today
  ).length;

  const completionRate = totalTasks > 0
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  const stats = [
    {
      title: 'Total Tasks',
      value: totalTasks,
      icon: TrendingUp,
      color: 'blue'
    },
    {
      title: 'Completed',
      value: completedTasks,
      icon: CheckCircle2,
      color: 'green'
    },
    {
      title: 'Pending',
      value: pendingTasks,
      icon: Clock,
      color: 'orange'
    },
    {
      title: 'Overdue',
      value: overdueTasks,
      icon: AlertCircle,
      color: 'red'
    }
  ];

  return (
    <div className="productivity-container">
      <h2>Productivity Overview</h2>
      <p className="productivity-subtitle">
        Track your progress and stay on top of your deadlines.
      </p>

      <div className="productivity-grid">
        {stats.map(stat => {
          const Icon = stat.icon;

          return (
            <div className="productivity-card" key={stat.title}>
              <div>
                <p>{stat.title}</p>
                <h3>{stat.value}</h3>
              </div>

              <div className={`productivity-icon ${stat.color}`}>
                <Icon size={25} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="completion-card">
        <div className="completion-heading">
          <div>
            <h3>Task Completion Rate</h3>
            <p>Overall progress</p>
          </div>

          <strong>{completionRate}%</strong>
        </div>

        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      <div className="streak-card">
        <Flame size={30} />
        <div>
          <h3>Productivity Streak</h3>
          <p>
            Streak tracking will be available once task
            completion dates are recorded.
          </p>
        </div>
      </div>
    </div>
  );
}
