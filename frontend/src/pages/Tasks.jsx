import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { format } from 'date-fns';
import { AuthContext } from '../context/AuthContext';

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
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="py-4 px-6 font-semibold text-gray-600 text-sm">Title</th>
              <th className="py-4 px-6 font-semibold text-gray-600 text-sm">Project</th>
              <th className="py-4 px-6 font-semibold text-gray-600 text-sm">Assigned To</th>
              <th className="py-4 px-6 font-semibold text-gray-600 text-sm">Due Date</th>
              <th className="py-4 px-6 font-semibold text-gray-600 text-sm">Status</th>
              <th className="py-4 px-6 font-semibold text-gray-600 text-sm">Process Notes</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id} className="border-b border-gray-100 hover:bg-gray-50/50">
                <td className="py-4 px-6">
                  <div className="font-medium text-gray-900">{task.title}</div>
                </td>
                <td className="py-4 px-6 text-sm text-gray-600">
                  {task.project?.name}
                </td>
                <td className="py-4 px-6 text-sm text-gray-600">
                  {task.assignedTo?.name || 'Unassigned'}
                </td>
                <td className="py-4 px-6 text-sm text-gray-600">
                  {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                </td>
                <td className="py-4 px-6">
                  <select
                    value={task.status}
                    onChange={(e) => handleUpdate(task._id, { status: e.target.value })}
                    className={`text-sm rounded-full px-3 py-1 font-medium border-0 outline-none
                      ${task.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                        task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-gray-100 text-gray-700'}`}
                  >
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
                <td className="py-4 px-6">
                  <textarea
                    rows="2"
                    placeholder="Add progress updates here..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-primary focus:border-primary bg-white"
                    defaultValue={task.progressNotes}
                    onBlur={(e) => {
                      if (e.target.value !== task.progressNotes) {
                        handleUpdate(task._id, { progressNotes: e.target.value });
                      }
                    }}
                  />
                </td>
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr>
                <td colSpan="6" className="py-8 text-center text-gray-500">No tasks found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tasks;
