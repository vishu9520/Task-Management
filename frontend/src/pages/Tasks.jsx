import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { format } from 'date-fns';
import { AuthContext } from '../context/AuthContext';
import { Link, useSearchParams } from 'react-router-dom';

const ProcessNotesEditor = ({ task, onUpdate }) => {
  const [notes, setNotes] = useState(task.progressNotes || '');
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    setNotes(task.progressNotes || '');
  }, [task.progressNotes]);

  const handleSave = async () => {
    if (notes === task.progressNotes) return;
    setIsSaving(true);
    await onUpdate(task._id, { progressNotes: notes });
    setIsSaving(false);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Process Notes</label>
      <textarea
        placeholder={task.status === 'Completed' ? "Task is completed." : "Add progress updates here..."}
        className={`w-full flex-1 min-h-[100px] px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none outline-none ${task.status === 'Completed' ? 'bg-gray-100 opacity-70 cursor-not-allowed text-gray-500' : 'bg-gray-50 hover:bg-white'}`}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        disabled={task.status === 'Completed'}
      />
      {task.status !== 'Completed' && (
        <button
          onClick={handleSave}
          disabled={isSaving || notes === task.progressNotes}
          className="mt-3 text-xs font-medium bg-primary-dark text-white py-2 px-4 rounded-lg hover:bg-primary transition-colors self-end disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : showSaved ? 'Saved! ✓' : 'Submit Notes'}
        </button>
      )}
    </div>
  );
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter');

  const fetchTasks = async () => {
    try {
      const endpoint = user?.role === 'Admin' ? '/tasks' : '/tasks/me';
      const res = await api.get(endpoint);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleUpdate = async (taskId, updates) => {
    try {
      await api.put(`/tasks/${taskId}`, updates);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  let displayedTasks = tasks;
  if (filter === 'Completed') {
    displayedTasks = tasks.filter(t => t.status === 'Completed');
  } else if (filter === 'Pending') {
    displayedTasks = tasks.filter(t => t.status !== 'Completed');
  } else if (filter === 'Overdue') {
    displayedTasks = tasks.filter(t => t.status !== 'Completed' && new Date(t.dueDate) < new Date());
  }

  const getPageTitle = () => {
    let baseTitle = user?.role === 'Admin' ? 'All Tasks' : 'My Tasks';
    if (filter) baseTitle = `${filter} Tasks`;
    return baseTitle;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{getPageTitle()}</h1>
        {filter && (
          <Link to="/tasks" className="text-sm font-medium text-primary hover:text-primary-dark hover:underline">
            Clear Filters
          </Link>
        )}
      </div>
      
      <div className="space-y-6">
        {displayedTasks.map((task) => (
          <div key={task._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
            
            {/* Left section: Task Details */}
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{task.title}</h3>
                <p className="text-gray-600 mt-2 leading-relaxed">{task.description}</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-600 bg-gray-50 px-4 py-3 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">Project:</span>
                  <Link to={`/projects/${task.project?._id}`} className="text-primary hover:text-primary-dark font-medium hover:underline transition-colors">
                    {task.project?.name}
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">Assigned To:</span>
                  <span>{task.assignedTo?.name || 'Unassigned'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">Due:</span>
                  <span className={new Date(task.dueDate) < new Date() && task.status !== 'Completed' ? 'text-red-600 font-medium' : ''}>
                    {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>
            </div>

            {/* Right section: Interactive */}
            <div className="w-full md:w-80 flex flex-col gap-4 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Status</label>
                {task.assignedTo?._id === user?._id ? (
                  <select
                    value={task.status}
                    onChange={(e) => handleUpdate(task._id, { status: e.target.value })}
                    className={`w-full text-sm rounded-lg px-4 py-2.5 font-semibold border-0 outline-none cursor-pointer focus:ring-2 focus:ring-primary/20
                      ${task.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                        task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-gray-100 text-gray-700'}`}
                  >
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                ) : (
                  <div className={`w-full text-sm rounded-lg px-4 py-2.5 font-semibold border-0 outline-none
                      ${task.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                        task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-gray-100 text-gray-700'}`}>
                    {task.status}
                  </div>
                )}
              </div>
              
              {task.assignedTo?._id === user?._id ? (
                <ProcessNotesEditor task={task} onUpdate={handleUpdate} />
              ) : (
                <div className="flex-1 flex flex-col h-full">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Process Notes</label>
                  <div className="w-full flex-1 min-h-[100px] px-4 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-600 whitespace-pre-wrap">
                    {task.progressNotes || '-'}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {displayedTasks.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900">No tasks found</h3>
            <p className="text-gray-500 mt-2">There are no tasks matching your current view.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
