import { useState, useEffect } from 'react';
import { ExternalLink, CheckCircle, Circle, Plus } from 'lucide-react';
import TaskModal from './TaskModal';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/api/tasks')
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error("Error fetching tasks:", err));
  }, []);
  const toggleTaskCompletion = async (taskId, currentStatus) => {
    try {
      const res = await fetch(`http://localhost:8000/api/tasks/${taskId}`, {
        method: 'PUT',
      });
      if (res.ok) {
        setTasks(tasks.map(t => 
          t.id === taskId ? { ...t, is_completed: !currentStatus } : t
        ));
      }
    } catch (err) {
      console.error("Failed to update task", err);
    }
  };
  const filteredTasks = filter === 'All' ? tasks : tasks.filter(t => t.category === filter);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">My Tasks</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" /> Add Task
        </button>
      </div>

      <div className="mb-6 flex gap-2">
        {['All', 'Academic', 'Club', 'Personal'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`rounded-full px-4 py-1 text-sm font-medium ${filter === cat ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredTasks.map(task => (
          <div key={task.id} className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm transition hover:shadow-md">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => toggleTaskCompletion(task.id, task.is_completed)}
                className="text-gray-400 hover:text-green-600 transition"
              >
                {task.is_completed ? <CheckCircle className="h-6 w-6 text-green-600" /> : <Circle className="h-6 w-6" />}
              </button>
              <div>
                <h4 className={`font-semibold ${task.is_completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{task.title}</h4>
                <div className="flex gap-3 text-xs text-gray-500">
                  <span className="rounded bg-gray-100 px-2 py-0.5">{task.category}</span>
                  <span className={`rounded px-2 py-0.5 ${task.priority === 'High' ? 'bg-red-100 text-red-700' : task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                    {task.priority} Priority
                  </span>
                  {task.due_date && <span>Due: {task.due_date}</span>}
                </div>
              </div>
            </div>
            {task.submission_link && (
              <a href={task.submission_link} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-700">
                <ExternalLink className="h-5 w-5" />
              </a>
            )}
          </div>
        ))}
        {filteredTasks.length === 0 && <p className="text-center text-gray-500 py-8">No tasks found.</p>}
      </div>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onTaskAdded={(newTask) => setTasks([...tasks, newTask])} 
      />
    </div>
  );
}