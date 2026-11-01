import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
// Calendar heatmap requires some manual css tuning to look good, omitting complex heatmap logic for MVP to ensure it renders correctly on first try.

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/tasks')
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);

  const totalHours = tasks.reduce((sum, task) => sum + (task.estimated_hours || 0), 0);
  const completedTasks = tasks.filter(t => t.is_completed).length;

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="rounded-lg bg-white p-6 shadow-sm border text-center">
          <h3 className="text-sm font-medium text-gray-500">Total Tasks</h3>
          <p className="mt-2 text-3xl font-bold text-gray-800">{tasks.length}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm border text-center">
          <h3 className="text-sm font-medium text-gray-500">Completed</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">{completedTasks}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm border text-center">
          <h3 className="text-sm font-medium text-gray-500">Est. Work Hours</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">{totalHours}h</p>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm border flex justify-center">
        <div>
          <h3 className="mb-4 text-center text-lg font-semibold">Upcoming Deadlines</h3>
          <Calendar 
            className="rounded-lg border-none shadow-sm p-4"
            tileClassName={({ date }) => {
              const dateStr = date.toISOString().split('T')[0];
              return tasks.some(t => t.due_date === dateStr) ? 'bg-red-100 text-red-700 font-bold rounded-full' : null;
            }}
          />
        </div>
      </div>
    </div>
  );
}