import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { format } from 'date-fns';
import { AuthContext } from '../context/AuthContext';
import { FiPlus, FiArrowLeft } from 'react-icons/fi';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  
  // Task form state
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [title, setTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  const fetchProjectAndTasks = async () => {
    try {
      const promises = [
        api.get(`/projects/${id}`),
        api.get(`/tasks/project/${id}`)
      ];
      if (user?.role === 'Admin') {
        promises.push(api.get('/auth/users'));
      }
      
      const [projRes, tasksRes, usersRes] = await Promise.all(promises);
      
      setProject(projRes.data);
      setTasks(tasksRes.data);
      if (usersRes) {
        setAllUsers(usersRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectAndTasks();
  }, [id]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', {
        title,
        description: taskDesc,
        dueDate,
        assignedTo,
        project: id
      });
      setShowTaskModal(false);
      fetchProjectAndTasks();
      setTitle(''); setTaskDesc(''); setDueDate(''); setAssignedTo('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (taskId, updates) => {
    try {
      await api.put(`/tasks/${taskId}`, updates);
      fetchProjectAndTasks();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!project) return <div className="text-center py-10">Project not found</div>;

  return (
    <div>
      <Link to="/projects" className="inline-flex items-center text-sm text-gray-500 hover:text-primary mb-6">
        <FiArrowLeft className="mr-2" /> Back to Projects
      </Link>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
        <p className="text-gray-600 mt-2 text-lg">{project.description}</p>
        <div className="mt-4 flex gap-4 text-sm text-gray-500">
          <span>Created by: {project.createdBy.name}</span>
          <span>•</span>
          <span>{project.members.length} members</span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
        {user?.role === 'Admin' && (
          <button
            onClick={() => setShowTaskModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-primary transition-colors font-medium shadow-sm text-sm"
          >
            <FiPlus /> Add Task
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="py-4 px-6 font-semibold text-gray-600 text-sm">Title</th>
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
                  <div className="text-sm text-gray-500">{task.description}</div>
                </td>
                <td className="py-4 px-6 text-sm text-gray-600">
                  {task.assignedTo?.name || 'Unassigned'}
                </td>
                <td className="py-4 px-6 text-sm text-gray-600">
                  {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                </td>
                <td className="py-4 px-6">
                  {task.assignedTo?._id === user?._id ? (
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
                  ) : (
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium
                        ${task.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                          task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-gray-100 text-gray-700'}`}>
                      {task.status}
                    </span>
                  )}
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm text-gray-600 whitespace-pre-wrap">{task.progressNotes || '-'}</div>
                </td>
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-500">No tasks in this project yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showTaskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-2xl font-bold mb-4">Add Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input type="text" required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea required rows="2" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)}></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Due Date</label>
                  <input type="date" required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Assign To</label>
                  <select required className="mt-1 w-full px-3 py-2 border border-gray-300 bg-white rounded-lg focus:ring-primary focus:border-primary" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
                    <option value="" disabled>Select a team member</option>
                    {allUsers.length > 0 ? (
                      allUsers.map(u => (
                        <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                      ))
                    ) : (
                      <>
                        <option value={project.createdBy._id}>{project.createdBy.name} (Admin)</option>
                        {project.members.map(member => (
                          <option key={member._id} value={member._id}>{member.name}</option>
                        ))}
                      </>
                    )}
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setShowTaskModal(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-primary transition-colors">Add Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
