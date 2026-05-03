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
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState([]);
  const [priority, setPriority] = useState('Medium');
  const [isAssignDropdownOpen, setIsAssignDropdownOpen] = useState(false);

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
        startDate,
        dueDate,
        priority,
        assignedTo,
        project: id
      });
      setShowTaskModal(false);
      setIsAssignDropdownOpen(false);
      fetchProjectAndTasks();
      setTitle(''); setTaskDesc(''); setStartDate(''); setDueDate(''); setPriority('Medium'); setAssignedTo([]);
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
            onClick={() => {
              setShowTaskModal(true);
              setIsAssignDropdownOpen(false);
            }}
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
              <th className="py-4 px-6 font-semibold text-gray-600 text-sm">Priority</th>
              <th className="py-4 px-6 font-semibold text-gray-600 text-sm">Start Date</th>
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
                  {task.assignedTo?.length > 0 ? task.assignedTo.map(u => u.name).join(', ') : 'Unassigned'}
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold
                    ${task.priority === 'High' ? 'bg-red-100 text-red-700' : 
                      task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-blue-100 text-blue-700'}`}>
                    {task.priority || 'Medium'}
                  </span>
                </td>
                <td className="py-4 px-6 text-sm text-gray-600">
                  {task.startDate ? format(new Date(task.startDate), 'MMM dd, yyyy') : '-'}
                </td>
                <td className="py-4 px-6 text-sm text-gray-600">
                  {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                </td>
                <td className="py-4 px-6">
                  {task.assignedTo?.some(u => u._id === user?._id) ? (
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
                <td colSpan="7" className="py-8 text-center text-gray-500">No tasks in this project yet.</td>
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
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input type="date" required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Due Date</label>
                  <input type="date" required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <select required className="mt-1 w-full px-3 py-2 border border-gray-300 bg-white rounded-lg focus:ring-primary focus:border-primary" value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                  <button 
                    type="button" 
                    onClick={() => setIsAssignDropdownOpen(!isAssignDropdownOpen)}
                    className="w-full text-left px-3 py-2 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary flex justify-between items-center"
                  >
                    <span className={assignedTo.length === 0 ? "text-gray-500" : "text-gray-900"}>
                      {assignedTo.length === 0 ? "Select team member(s)" : `${assignedTo.length} member(s) selected`}
                    </span>
                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${isAssignDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </button>
                  
                  {isAssignDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto border border-gray-200 bg-white shadow-lg rounded-lg p-2 space-y-1">
                      {(allUsers.length > 0 ? allUsers : [project.createdBy, ...project.members]).map(u => (
                        <label key={u._id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                            checked={assignedTo.includes(u._id)} 
                            onChange={(e) => {
                              if (e.target.checked) {
                                setAssignedTo([...assignedTo, u._id]);
                              } else {
                                setAssignedTo(assignedTo.filter(id => id !== u._id));
                              }
                            }} 
                          />
                          <span className="text-sm font-medium text-gray-700">
                            {u.name} <span className="text-gray-500 font-normal">({u.email})</span> {u._id === project.createdBy._id && <span className="text-xs bg-primary/10 text-primary-dark px-2 py-0.5 rounded-full ml-1">Admin</span>}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                  {assignedTo.length === 0 && <p className="text-xs text-red-500 mt-1">Please select at least one assignee.</p>}
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
