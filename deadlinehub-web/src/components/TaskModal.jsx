import { useState } from 'react';
import { Sparkles } from 'lucide-react';

export default function TaskModal({ isOpen, onClose, onTaskAdded }) {
  const [prompt, setPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '', category: 'Academic', priority: 'Medium', due_date: '', estimated_hours: 1, submission_link: ''
  });

  if (!isOpen) return null;

  const handleAiParse = async () => {
    if (!prompt) return;
    setIsAiLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/ai-parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      setFormData({ ...formData, ...data });
    } catch (err) {
      alert('AI parsing failed. Please enter manually.');
    }
    setIsAiLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const newTask = await res.json();
      onTaskAdded(newTask);
      onClose();
    } catch (err) {
      alert('Failed to save task');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-xl font-bold">Add New Task</h3>
        
        {/* AI Input Section */}
        <div className="mb-6 rounded bg-indigo-50 p-4 border border-indigo-100">
          <label className="mb-2 flex items-center text-sm font-semibold text-indigo-700">
            <Sparkles className="mr-2 h-4 w-4" /> Generate with AI
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Finish CS201 lab by Friday taking 3 hours..."
              className="flex-1 rounded border px-3 py-2 text-sm"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button
              type="button"
              onClick={handleAiParse}
              disabled={isAiLoading}
              className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {isAiLoading ? 'Parsing...' : 'Magic Fill'}
            </button>
          </div>
        </div>

        {/* Manual Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text" placeholder="Task Title" required
            className="w-full rounded border px-3 py-2"
            value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
          <div className="flex gap-4">
            <select className="w-1/2 rounded border px-3 py-2" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
              <option>Academic</option><option>Club</option><option>Personal</option>
            </select>
            <select className="w-1/2 rounded border px-3 py-2" value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})}>
              <option>High</option><option>Medium</option><option>Low</option>
            </select>
          </div>
          <div className="flex gap-4">
            <input
              type="date" className="w-1/2 rounded border px-3 py-2"
              value={formData.due_date} onChange={(e) => setFormData({...formData, due_date: e.target.value})}
            />
            <input
              type="number" placeholder="Est. Hours" className="w-1/2 rounded border px-3 py-2"
              value={formData.estimated_hours} onChange={(e) => setFormData({...formData, estimated_hours: parseInt(e.target.value) || 1})}
            />
          </div>
          <input
            type="url" placeholder="Submission Link (Optional)" className="w-full rounded border px-3 py-2"
            value={formData.submission_link} onChange={(e) => setFormData({...formData, submission_link: e.target.value})}
          />
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded px-4 py-2 text-gray-600 hover:bg-gray-100">Cancel</button>
            <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Save Task</button>
          </div>
        </form>
      </div>
    </div>
  );
}