import { useState, useEffect } from 'react';
import api from '../utils/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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

  const pieData = [
    { name: 'Completed', value: stats?.completedProjects || 0, color: '#3b82f6' }, // Blue
    { name: 'Planning', value: stats?.planningProjects || 0, color: '#eab308' }, // Yellow
    { name: 'In Progress', value: stats?.inProgressProjects || 0, color: '#10b981' } // Green
  ];
  
  const activePieData = pieData.filter(d => d.value > 0);
  const showEmptyPie = activePieData.length === 0;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>
      
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
          <h3 className="text-sm font-semibold text-gray-600">Total Projects</h3>
          <div>
            <div className="text-4xl font-bold text-gray-900">{stats?.totalProjects || 0}</div>
            <div className="text-xs text-gray-400 mt-1">{stats?.inProgressProjects || 0} in progress</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
          <h3 className="text-sm font-semibold text-gray-600">Total Tasks</h3>
          <div>
            <div className="text-4xl font-bold text-gray-900">{stats?.totalTasks || 0}</div>
            <div className="text-xs text-gray-400 mt-1">{stats?.completedTasks || 0} completed</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
             <h3 className="text-sm font-semibold text-gray-600">To Do</h3>
             <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
          </div>
          <div>
            <div className="text-4xl font-bold text-gray-900">{stats?.todoTasks || 0}</div>
            <div className="text-xs text-gray-400 mt-1">Tasks waiting to be started</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
           <div className="flex justify-between items-start">
             <h3 className="text-sm font-semibold text-gray-600">In Progress</h3>
             <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div>
            <div className="text-4xl font-bold text-gray-900">{stats?.inProgressTasks || 0}</div>
            <div className="text-xs text-gray-400 mt-1">Tasks currently in progress</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Line Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 lg:col-span-2 hover:shadow-md transition-shadow">
          <div className="mb-6 flex justify-between items-start">
             <div>
                <h3 className="text-base font-semibold text-gray-800">Task Trends</h3>
                <p className="text-xs text-gray-400 mt-1">Daily task status changes</p>
             </div>
             <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.trendData || []} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#f3f4f6', strokeWidth: 2 }}
                />
                <Line type="monotone" dataKey="tasks" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
           <div className="mb-2 flex justify-between items-start">
             <div>
                <h3 className="text-base font-semibold text-gray-800">Project Status</h3>
                <p className="text-xs text-gray-400 mt-1">Status breakdown</p>
             </div>
             <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
          </div>

          <div className="h-56 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={showEmptyPie ? [{ value: 1, color: '#f3f4f6' }] : activePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {showEmptyPie ? (
                    <Cell fill="#f3f4f6" />
                  ) : (
                    activePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))
                  )}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [value, name === undefined ? 'Projects' : name]}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-gray-800">{stats?.totalProjects || 0}</span>
              <span className="text-xs text-gray-400">Total</span>
            </div>
          </div>
          
          {/* Custom Legend */}
          <div className="flex justify-center flex-wrap gap-4 mt-2">
            {!showEmptyPie && activePieData.map((entry, index) => (
              <div key={index} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></div>
                <span className="text-xs text-gray-500 font-medium">{entry.name} {Math.round((entry.value / stats.totalProjects) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
