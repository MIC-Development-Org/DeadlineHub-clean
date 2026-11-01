import { useState, useEffect } from 'react';
import { LayoutDashboard, ListTodo, Timer as TimerIcon, LogOut } from 'lucide-react';
import AuthMock from './components/AuthMock';
import TaskList from './components/TaskList';
import Dashboard from './components/Dashboard';
import Timer from './components/Timer';

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('tasks');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(savedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  if (!user) {
    return <AuthMock onLogin={setUser} />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-black text-blue-600 tracking-tight">DeadlineHub</h1>
          <p className="text-xs text-gray-500 mt-1">Welcome, {user}</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('tasks')} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition ${activeTab === 'tasks' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>
            <ListTodo className="h-5 w-5" /> Tasks
          </button>
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </button>
          <button onClick={() => setActiveTab('timer')} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition ${activeTab === 'timer' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>
            <TimerIcon className="h-5 w-5" /> Study Timer
          </button>
        </nav>
        <div className="p-4 border-t">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg font-medium transition">
            <LogOut className="h-5 w-5" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'tasks' && <TaskList />}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'timer' && <Timer />}
      </div>
    </div>
  );
}

export default App;