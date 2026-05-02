import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { format } from 'date-fns';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

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

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{user?.role === 'Admin' ? 'All Tasks' : 'My Tasks'}</h1>
      
      <div className="space-y-6">
        {tasks.map((task) => (
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
              </div>
              
              <div className="flex-1 flex flex-col">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Process Notes</label>
                <textarea
                  placeholder="Add progress updates here..."
                  className="w-full flex-1 min-h-[100px] px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gray-50 hover:bg-white transition-all resize-none outline-none"
                  defaultValue={task.progressNotes}
                  onBlur={(e) => {
                    if (e.target.value !== task.progressNotes) {
                      handleUpdate(task._id, { progressNotes: e.target.value });
                    }
                  }}
                />
              </div>
            </div>
          </div>
        ))}
        
        {tasks.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900">No tasks found</h3>
            <p className="text-gray-500 mt-2">You don't have any tasks assigned to you right now.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
