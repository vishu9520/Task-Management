import { useState, useEffect } from 'react';
import api from '../utils/api';
import { FiCheckCircle, FiClock, FiAlertCircle, FiList } from 'react-icons/fi';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  const statCards = [
    { title: 'Total Tasks', value: stats?.totalTasks || 0, icon: <FiList size={24} className="text-blue-500" />, bg: 'bg-blue-50' },
    { title: 'Completed Tasks', value: stats?.completedTasks || 0, icon: <FiCheckCircle size={24} className="text-green-500" />, bg: 'bg-green-50' },
    { title: 'Pending Tasks', value: stats?.pendingTasks || 0, icon: <FiClock size={24} className="text-yellow-500" />, bg: 'bg-yellow-50' },
    { title: 'Overdue Tasks', value: stats?.overdueTasks || 0, icon: <FiAlertCircle size={24} className="text-red-500" />, bg: 'bg-red-50' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{card.title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
            </div>
            <div className={`p-4 rounded-full ${card.bg}`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
