
import { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  CalendarDays,
  Clock,
  Link as LinkIcon,
  BookOpen,
  Flag
} from 'lucide-react';

const emptyForm = {
  title: '',
  category: 'Academic',
  priority: 'Medium',
  due_date: '',
  estimated_hours: 1,
  submission_link: ''
};

export default function TaskModal({
  isOpen,
  onClose,
  onTaskSaved,
  taskToEdit
}) {
  const [error, setError] = useState('');
  const [formData, setFormData] = useState(emptyForm);

  // Populate the form when editing, or clear it when creating.
  useEffect(() => {
    if (isOpen) {
      setFormData(
        taskToEdit
          ? {
            title: taskToEdit.title || '',
            category: taskToEdit.category || 'Academic',
            priority: taskToEdit.priority || 'Medium',
            due_date: taskToEdit.due_date || '',
            estimated_hours: taskToEdit.estimated_hours || 1,
            submission_link: taskToEdit.submission_link || ''
          }
          : { ...emptyForm }
      );

      setError('');
    }
  }, [isOpen, taskToEdit]);

  if (!isOpen) return null;

  const updateField = (field, value) => {
    setFormData(previous => ({
      ...previous,
      [field]: value
    }));
  };

  // Save task locally without backend.
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Please enter a task title.');
      return;
    }

    if (Number(formData.estimated_hours) < 1) {
      setError('Estimated hours must be at least 1.');
      return;
    }

    const savedTask = {
      ...formData,
      title: formData.title.trim(),
      estimated_hours: Number(formData.estimated_hours),
      id: taskToEdit ? taskToEdit.id : Date.now(),
      is_completed: taskToEdit
        ? taskToEdit.is_completed
        : false
    };

    onTaskSaved(savedTask);
    onClose();
  };

  const inputClass =
    'w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#493bb0] focus:bg-white focus:ring-2 focus:ring-[#493bb0]/10';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">

        {/* Modal Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[2px] text-[#493bb0]">
              {taskToEdit ? 'UPDATE YOUR TASK' : 'STAY ON TRACK'}
            </p>

            <h2 className="text-2xl font-bold text-[#292943]">
              {taskToEdit ? 'Edit Task' : 'Create a Task'}
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              {taskToEdit
                ? 'Make changes to your task details.'
                : 'Add the details and keep your deadlines organised.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* AI Input Section - Placeholder */}
        <div className="mb-6 rounded-xl border border-[#e4e0ff] bg-[#f5f3ff] p-4">
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#493bb0]">
            <Sparkles size={17} />
            Generate with AI
          </label>

          <p className="mb-3 text-xs text-gray-500">
            Describe your task and let AI fill in the details.
          </p>

          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              placeholder="e.g. Finish CS201 lab by Friday..."
              disabled
              className="min-w-0 flex-1 cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-3 py-2.5 text-xs text-gray-500"
            />

            <button
              type="button"
              disabled
              className="flex items-center justify-center gap-2 rounded-lg bg-[#493bb0] px-4 py-2.5 text-xs font-semibold text-white opacity-50 cursor-not-allowed"
            >
              <Sparkles size={14} />
              Magic Fill
            </button>
          </div>

          <p className="mt-2 text-[10px] text-gray-400">
            AI task generation will be available soon.
          </p>
        </div>

        {/* Manual Task Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Task Title */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-gray-700">
              Task Title *
            </label>

            <input
              type="text"
              placeholder="What do you need to get done?"
              required
              maxLength={200}
              className={inputClass}
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
            />
          </div>

          {/* Category and Priority */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-semibold text-gray-700">
                <BookOpen size={14} className="text-[#493bb0]" />
                Category
              </label>

              <select
                className={inputClass}
                value={formData.category}
                onChange={(e) => updateField('category', e.target.value)}
              >
                <option value="Academic">Academic</option>
                <option value="Club">Club</option>
                <option value="Personal">Personal</option>
              </select>
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-semibold text-gray-700">
                <Flag size={14} className="text-[#493bb0]" />
                Priority
              </label>

              <select
                className={inputClass}
                value={formData.priority}
                onChange={(e) => updateField('priority', e.target.value)}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Due Date and Estimated Hours */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-semibold text-gray-700">
                <CalendarDays size={14} className="text-[#493bb0]" />
                Due Date
              </label>

              <input
                type="date"
                className={inputClass}
                value={formData.due_date || ''}
                onChange={(e) => updateField('due_date', e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-semibold text-gray-700">
                <Clock size={14} className="text-[#493bb0]" />
                Estimated Hours
              </label>

              <input
                type="number"
                min="1"
                max="1000"
                required
                className={inputClass}
                value={formData.estimated_hours}
                onChange={(e) =>
                  updateField('estimated_hours', e.target.value)
                }
              />
            </div>
          </div>

          {/* Submission Link */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-xs font-semibold text-gray-700">
              <LinkIcon size={14} className="text-[#493bb0]" />
              Submission Link
              <span className="font-normal text-gray-400">(Optional)</span>
            </label>

            <input
              type="url"
              placeholder="https://..."
              className={inputClass}
              value={formData.submission_link || ''}
              onChange={(e) => updateField('submission_link', e.target.value)}
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-xs text-red-600">
              {error}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-5 py-2.5 text-xs font-semibold text-gray-500 transition hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-[#493bb0] px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-[#392d91]"
            >
              {taskToEdit ? 'Update Task' : 'Save Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
