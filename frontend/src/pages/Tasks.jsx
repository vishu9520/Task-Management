import { useState, useEffect } from 'react';
import api from '../utils/api';
import { format } from 'date-fns';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      // In a real app, this might be a dedicated /tasks endpoint, but we can reuse the dashboard data or a new endpoint.
      // Since we don't have a GET /api/tasks endpoint in the backend for ALL tasks, we might need to add it, or just use this for the layout structure.
      // Wait, Admin can't easily fetch ALL tasks without a new endpoint. Let's add that to backend/routes/taskRoutes.js later if needed.
      // For now, let's assume we fetch all tasks if admin. We will need to update the backend route.
      const res = await api.get('/tasks');
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

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">All Tasks</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="py-4 px-6 font-semibold text-gray-600 text-sm">Title</th>
              <th className="py-4 px-6 font-semibold text-gray-600 text-sm">Project</th>
              <th className="py-4 px-6 font-semibold text-gray-600 text-sm">Assigned To</th>
              <th className="py-4 px-6 font-semibold text-gray-600 text-sm">Due Date</th>
              <th className="py-4 px-6 font-semibold text-gray-600 text-sm">Status</th>
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
                    onChange={(e) => handleStatusUpdate(task._id, e.target.value)}
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
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-500">No tasks found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tasks;
