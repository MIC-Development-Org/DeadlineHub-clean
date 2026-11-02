
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendar.css';

export default function DeadlineCalendar({ tasks = [] }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const selectedDateString = formatDate(selectedDate);

  const selectedTasks = tasks.filter(
    (task) => task.due_date === selectedDateString
  );

  const getDateClass = ({ date, view }) => {
    if (view !== 'month') return null;

    const dateString = formatDate(date);

    const dayTasks = tasks.filter(
      (task) => task.due_date === dateString
    );

    if (dayTasks.length === 0) return null;

    if (dayTasks.every((task) => task.is_completed)) {
      return 'calendar-completed';
    }

    const today = formatDate(new Date());

    if (dateString < today) {
      return 'calendar-overdue';
    }

    return 'calendar-upcoming';
  };

  return (
    <div className="deadline-calendar-container">
      <h2>Deadline Calendar</h2>
      <p className="calendar-subtitle">
        Keep track of your upcoming deadlines.
      </p>

      <div className="calendar-layout">
        <div className="calendar-card">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileClassName={getDateClass}
          />

          <div className="calendar-legend">
            <span>🔴 Overdue</span>
            <span>🟡 Upcoming</span>
            <span>🟢 Completed</span>
          </div>
        </div>

        <div className="calendar-tasks">
          <h3>Tasks for this day</h3>

          <p className="selected-date">
            {selectedDate.toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>

          {selectedTasks.length > 0 ? (
            selectedTasks.map((task) => (
              <div className="calendar-task" key={task.id}>
                <strong>{task.title}</strong>
                <p>{task.category}</p>
                <span>
                  {task.is_completed ? 'Completed' : 'Pending'}
                </span>
              </div>
            ))
          ) : (
            <p className="no-calendar-tasks">
              No tasks due on this date.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
