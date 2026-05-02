import { useContext } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiLogOut, FiLayout, FiFolder, FiCheckSquare } from 'react-icons/fi';

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-primary-dark">TaskMgr</h1>
          <p className="text-sm text-gray-500 mt-1">Hello, {user.name}</p>
          <span className="inline-block mt-2 px-2 py-1 bg-primary/10 text-primary-dark text-xs font-semibold rounded-full">
            {user.role}
          </span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary/5 hover:text-primary-dark rounded-lg transition-colors">
            <FiLayout /> Dashboard
          </Link>
          <Link to="/projects" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary/5 hover:text-primary-dark rounded-lg transition-colors">
            <FiFolder /> Projects
          </Link>
          {user.role === 'Admin' && (
            <Link to="/tasks" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary/5 hover:text-primary-dark rounded-lg transition-colors">
              <FiCheckSquare /> All Tasks
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
