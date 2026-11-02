import ProductivityHeatmap from './ProductivityHeatmap';
import ProductivityStats from './productivitystats';
import DeadlineCalendar from './Calendar';
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
    <div className="w-full max-w-none p-8 lg:p-10">
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
      <ProductivityStats tasks={tasks} />

      <ProductivityHeatmap completionByDate={{}} />

      <DeadlineCalendar tasks={tasks} />
    </div>
  );
}