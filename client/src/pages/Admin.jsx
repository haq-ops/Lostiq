import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUsers, FiPackage, FiTrash2, FiShield } from 'react-icons/fi';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#1E3A5F', '#FF6B35', '#22c55e', '#a855f7'];

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      toast.error('Admin access only!');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, itemsRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/users'),
        API.get('/admin/items')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setItems(itemsRes.data);
    } catch (error) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      toast.success('User deleted!');
      setUsers(users.filter(u => u._id !== id));
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await API.delete(`/admin/items/${id}`);
      toast.success('Item deleted!');
      setItems(items.filter(i => i._id !== id));
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  const handleMakeAdmin = async (id) => {
    if (!window.confirm('Make this user an admin?')) return;
    try {
      await API.put(`/admin/users/${id}/makeadmin`);
      toast.success('User is now admin!');
      fetchData();
    } catch (error) {
      toast.error('Failed to make admin');
    }
  };

  if (loading) return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">⏳</div>
      <p className="text-gray-500">Loading admin panel...</p>
    </div>
  );

  // Chart Data
  const barData = [
    { name: 'Lost', value: stats?.lostItems || 0 },
    { name: 'Found', value: stats?.foundItems || 0 },
    { name: 'Resolved', value: stats?.resolvedItems || 0 },
    { name: 'Claims', value: stats?.totalClaims || 0 },
  ];

  const pieData = [
    { name: 'Lost', value: stats?.lostItems || 0 },
    { name: 'Found', value: stats?.foundItems || 0 },
    { name: 'Resolved', value: stats?.resolvedItems || 0 },
    { name: 'Pending', value: stats?.pendingClaims || 0 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="bg-primary text-white rounded-2xl p-8 mb-8">
        <h1 className="text-3xl font-bold">👮 Admin Panel</h1>
        <p className="text-gray-300 mt-1">Manage Lostiq platform</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-md text-center">
            <FiUsers size={30} className="text-primary mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-primary">{stats.totalUsers}</h3>
            <p className="text-gray-500 text-sm">Total Users</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md text-center">
            <FiPackage size={30} className="text-secondary mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-secondary">{stats.totalItems}</h3>
            <p className="text-gray-500 text-sm">Total Items</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md text-center">
            <div className="text-3xl mb-2">🔴</div>
            <h3 className="text-2xl font-bold text-red-500">{stats.lostItems}</h3>
            <p className="text-gray-500 text-sm">Lost Items</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md text-center">
            <div className="text-3xl mb-2">🟢</div>
            <h3 className="text-2xl font-bold text-green-500">{stats.foundItems}</h3>
            <p className="text-gray-500 text-sm">Found Items</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md text-center">
            <div className="text-3xl mb-2">✅</div>
            <h3 className="text-2xl font-bold text-blue-500">{stats.resolvedItems}</h3>
            <p className="text-gray-500 text-sm">Resolved</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md text-center">
            <div className="text-3xl mb-2">📋</div>
            <h3 className="text-2xl font-bold text-purple-500">{stats.totalClaims}</h3>
            <p className="text-gray-500 text-sm">Total Claims</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md text-center">
            <div className="text-3xl mb-2">⏳</div>
            <h3 className="text-2xl font-bold text-yellow-500">{stats.pendingClaims}</h3>
            <p className="text-gray-500 text-sm">Pending Claims</p>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

        {/* Bar Chart */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-bold text-primary mb-4">📊 Items Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#1E3A5F" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-bold text-primary mb-4">🥧 Items Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-2 rounded-xl font-semibold transition ${
            activeTab === 'users'
              ? 'bg-primary text-white'
              : 'bg-white text-gray-500 shadow'
          }`}
        >
          👥 Users ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('items')}
          className={`px-6 py-2 rounded-xl font-semibold transition ${
            activeTab === 'items'
              ? 'bg-primary text-white'
              : 'bg-white text-gray-500 shadow'
          }`}
        >
          📦 Items ({items.length})
        </button>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">City</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(u => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{u.name}</td>
                  <td className="px-6 py-4 text-gray-500">{u.email}</td>
                  <td className="px-6 py-4 text-gray-500">{u.city}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                      u.role === 'admin'
                        ? 'bg-purple-100 text-purple-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleMakeAdmin(u._id)}
                          className="bg-purple-500 text-white px-3 py-1 rounded-lg text-xs hover:opacity-90 flex items-center gap-1"
                        >
                          <FiShield size={12} /> Admin
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs hover:opacity-90 flex items-center gap-1"
                      >
                        <FiTrash2 size={12} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Items Tab */}
      {activeTab === 'items' && (
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">City</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Posted By</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map(item => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{item.title}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                      item.type === 'lost'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-green-100 text-green-600'
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 capitalize">{item.category}</td>
                  <td className="px-6 py-4 text-gray-500">{item.location?.city}</td>
                  <td className="px-6 py-4 text-gray-500">{item.postedBy?.name}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      item.status === 'open'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDeleteItem(item._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs hover:opacity-90 flex items-center gap-1"
                    >
                      <FiTrash2 size={12} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Admin;