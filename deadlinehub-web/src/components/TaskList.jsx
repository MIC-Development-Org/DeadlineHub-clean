
import { useState, useEffect } from 'react';
import {
  ExternalLink,
  CheckCircle,
  Circle,
  Plus,
  Pencil,
  Trash2
} from 'lucide-react';
import TaskModal from './TaskModal';

export default function TaskList() {
  // Load tasks from localStorage when the component starts.
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem('deadlinehub_tasks');
      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch {
      return [];
    }
  });

  const [filter, setFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  // Automatically save tasks whenever they change.
  useEffect(() => {
    localStorage.setItem('deadlinehub_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Toggle task completion.
  const toggleTaskCompletion = (taskId) => {
    setTasks(previous =>
      previous.map(task =>
        task.id === taskId
          ? { ...task, is_completed: !task.is_completed }
          : task
      )
    );
  };

  // Request confirmation before deleting an individual task.
  const deleteTask = (taskId) => {
    setConfirmAction({
      type: 'single',
      taskId
    });
  };

  // Request confirmation before clearing all tasks.
  const clearAllTasks = () => {
    if (tasks.length === 0) return;

    setConfirmAction({
      type: 'all'
    });
  };

  // Perform the confirmed deletion.
  const handleConfirmDelete = () => {
    if (confirmAction?.type === 'single') {
      setTasks(previous =>
        previous.filter(task => task.id !== confirmAction.taskId)
      );
    }

    if (confirmAction?.type === 'all') {
      setTasks([]);
    }

    setConfirmAction(null);
  };

  // Open modal for creating a task.
  const openAddModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  // Open modal for editing a task.
  const openEditModal = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  // Add a new task or update an existing task.
  const handleTaskSaved = (savedTask) => {
    setTasks(previous => {
      const alreadyExists = previous.some(
        task => task.id === savedTask.id
      );

      if (alreadyExists) {
        return previous.map(task =>
          task.id === savedTask.id ? savedTask : task
        );
      }

      return [...previous, savedTask];
    });
  };

  // Close modal.
  const closeModal = () => {
    setIsModalOpen(false);
    setTaskToEdit(null);
  };

  // Sort by priority, then earliest due date.
  const priorityOrder = {
    High: 1,
    Medium: 2,
    Low: 3
  };

  const filteredTasks = (
    filter === 'All'
      ? tasks
      : tasks.filter(task => task.category === filter)
  ).slice().sort((a, b) => {
    const priorityDifference =
      (priorityOrder[a.priority] || 4) -
      (priorityOrder[b.priority] || 4);

    if (priorityDifference !== 0) {
      return priorityDifference;
    }

    if (!a.due_date) return 1;
    if (!b.due_date) return -1;

    return new Date(a.due_date) - new Date(b.due_date);
  });

  return (
    <div className="mx-auto max-w-4xl p-6">

      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            My Tasks
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Keep track of everything you need to get done.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={clearAllTasks}
            disabled={tasks.length === 0}
            className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Clear All Tasks
          </button>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-lg bg-[#493bb0] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#392d91]"
          >
            <Plus className="h-5 w-5" />
            Add Task
          </button>
        </div>
      </div>

      {/* Category Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {['All', 'Academic', 'Club', 'Personal'].map(category => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              filter === category
                ? 'bg-[#493bb0] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Task Cards */}
      <div className="space-y-3">
        {filteredTasks.map(task => (
          <div
            key={task.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            <div className="flex min-w-0 items-center gap-4">

              {/* Completion Button */}
              <button
                onClick={() => toggleTaskCompletion(task.id)}
                className="shrink-0 text-gray-400 transition hover:text-green-600"
                aria-label={
                  task.is_completed
                    ? 'Mark task incomplete'
                    : 'Mark task complete'
                }
              >
                {task.is_completed ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : (
                  <Circle className="h-6 w-6" />
                )}
              </button>

              {/* Task Details */}
              <div className="min-w-0">
                <h4
                  className={`truncate font-semibold ${
                    task.is_completed
                      ? 'text-gray-400 line-through'
                      : 'text-gray-800'
                  }`}
                >
                  {task.title}
                </h4>

                <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
                  <span className="rounded-md bg-gray-100 px-2 py-1">
                    {task.category}
                  </span>

                  <span
                    className={`rounded-md px-2 py-1 ${
                      task.priority === 'High'
                        ? 'bg-red-100 text-red-700'
                        : task.priority === 'Medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {task.priority} Priority
                  </span>

                  {task.due_date && (
                    <span className="rounded-md bg-purple-50 px-2 py-1 text-purple-700">
                      Due: {new Date(
                        `${task.due_date}T00:00:00`
                      ).toLocaleDateString('en-GB')}
                    </span>
                  )}

                  <span className="rounded-md bg-gray-50 px-2 py-1">
                    {task.estimated_hours || 1} hr(s)
                  </span>
                </div>
              </div>
            </div>

            {/* Task Actions */}
            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={() => openEditModal(task)}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-purple-50 hover:text-[#493bb0]"
                aria-label={`Edit ${task.title}`}
                title="Edit task"
              >
                <Pencil className="h-4 w-4" />
              </button>

              <button
                onClick={() => deleteTask(task.id)}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                aria-label={`Delete ${task.title}`}
                title="Delete task"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              {task.submission_link && (
                <a
                  href={task.submission_link}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg p-2 text-gray-400 transition hover:bg-blue-50 hover:text-blue-600"
                  aria-label="Open submission link"
                  title="Open submission link"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center">
            <p className="font-medium text-gray-600">
              No tasks found.
            </p>
            <p className="mt-1 text-sm text-gray-400">
              Add a task to get started!
            </p>
          </div>
        )}
      </div>

      {/* Custom Delete Confirmation Popup */}
      {confirmAction && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setConfirmAction(null);
            }
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>

            <h3
              id="delete-dialog-title"
              className="text-xl font-bold text-gray-800"
            >
              {confirmAction.type === 'all'
                ? 'Clear All Tasks?'
                : 'Delete Task?'}
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              {confirmAction.type === 'all'
                ? 'Are you sure you want to delete all your tasks? This action cannot be undone.'
                : 'Are you sure you want to delete this task? This action cannot be undone.'}
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setConfirmAction(null)}
                className="rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmDelete}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                {confirmAction.type === 'all'
                  ? 'Clear All'
                  : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onTaskSaved={handleTaskSaved}
        taskToEdit={taskToEdit}
      />
    </div>
  );
}
