import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { FiPlus, FiFolder } from 'react-icons/fi';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { user } = useContext(AuthContext);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [members, setMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    if (user?.role === 'Admin') {
      api.get('/auth/users').then(res => setAllUsers(res.data)).catch(err => console.error(err));
    }
  }, [user]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', { name, description, members });
      setShowModal(false);
      setName('');
      setDescription('');
      setMembers([]);
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
        {user?.role === 'Admin' && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-primary transition-colors font-medium shadow-sm"
          >
            <FiPlus /> New Project
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link
            to={`/projects/${project._id}`}
            key={project._id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/30 transition-all p-6 group block"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 text-primary-dark rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                <FiFolder size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{project.name}</h3>
                <p className="text-gray-500 text-sm line-clamp-2">{project.description}</p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
              <span className="text-gray-500">{project.members.length} members</span>
              <span className="text-primary-dark font-medium group-hover:underline">View details &rarr;</span>
            </div>
          </Link>
        ))}
        {projects.length === 0 && (
          <div className="col-span-full py-10 text-center text-gray-500">
            No projects found.
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-2xl font-bold mb-4">Create New Project</h2>
            <form onSubmit={handleCreateProject}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Project Name</label>
                  <input
                    type="text"
                    required
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    required
                    rows="3"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Members</label>
                  <select
                    multiple
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white h-32"
                    value={members}
                    onChange={(e) => {
                      const options = [...e.target.selectedOptions];
                      const values = options.map(option => option.value);
                      setMembers(values);
                    }}
                  >
                    {allUsers.filter(u => u._id !== user?._id).map(u => (
                      <option key={u._id} value={u._id} className="py-1 px-2 border-b border-gray-50">{u.name} ({u.email})</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Hold Ctrl (or Cmd on Mac) to select multiple members</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-primary transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
