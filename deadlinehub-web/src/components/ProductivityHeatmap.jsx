
import { useMemo } from 'react';
import './productivityheatmap.css';

export default function ProductivityHeatmap({
  completionByDate = {}
}) {
  const weeks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Display the last 12 weeks, starting on Sunday.
    const start = new Date(today);
    start.setDate(today.getDate() - 83);
    start.setDate(start.getDate() - start.getDay());

    const result = [];
    const current = new Date(start);

    while (current <= today) {
      const week = [];

      for (let i = 0; i < 7; i++) {
        const date = new Date(current);

        if (date <= today) {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const dateKey = `${year}-${month}-${day}`;

          week.push({
            dateKey,
            completed: completionByDate[dateKey] || 0,
            date: new Date(date)
          });
        } else {
          week.push(null);
        }

        current.setDate(current.getDate() + 1);
      }

      result.push(week);
    }

    return result;
  }, [completionByDate]);

  const getLevel = (count) => {
    if (count === 0) return 'level-0';
    if (count === 1) return 'level-1';
    if (count <= 3) return 'level-2';
    if (count <= 5) return 'level-3';
    return 'level-4';
  };

  const totalCompleted = Object.values(completionByDate)
    .reduce((sum, count) => sum + count, 0);

  return (
    <section className="heatmap-container">
      <h2>Productivity Activity</h2>
      <p className="heatmap-subtitle">
        Your daily task completion over the last 12 weeks.
      </p>

      <div className="heatmap-summary">
        <strong>{totalCompleted}</strong>
        <span> recorded completed tasks</span>
      </div>

      <div className="heatmap-scroll">
        <div className="heatmap-grid">
          <div className="heatmap-days">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="heatmap-weeks">
            {weeks.map((week, weekIndex) => (
              <div className="heatmap-week" key={weekIndex}>
                {week.map((item, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={
                      item
                        ? `heatmap-square ${getLevel(item.completed)}`
                        : 'heatmap-square heatmap-empty'
                    }
                    title={
                      item
                        ? `${item.completed} completed tasks on ${item.date.toLocaleDateString('en-IN')}`
                        : ''
                    }
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="heatmap-legend">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map(level => (
          <div
            key={level}
            className={`heatmap-square level-${level}`}
          />
        ))}
        <span>More</span>
      </div>
    </section>
  );
}
