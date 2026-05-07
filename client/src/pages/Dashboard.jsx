import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiPackage, FiCheckCircle, FiClock, FiPlus } from 'react-icons/fi';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [myItems, setMyItems] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('items');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [itemsRes, claimsRes] = await Promise.all([
        API.get('/items/myitems'),
        API.get('/claims/myclaims')
      ]);
      setMyItems(itemsRes.data);
      setMyClaims(claimsRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await API.delete(`/items/${id}`);
      toast.success('Item deleted!');
      setMyItems(myItems.filter(item => item._id !== id));
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out!');
  };

  if (loading) return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">⏳</div>
      <p className="text-gray-500">Loading dashboard...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* Profile Card */}
      <div className="bg-primary text-white rounded-2xl p-8 mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-secondary w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user?.name}</h1>
              <p className="text-gray-300">{user?.email}</p>
              <p className="text-gray-300">{user?.city}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-6 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-md text-center">
          <FiPackage size={30} className="text-primary mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-primary">{myItems.length}</h3>
          <p className="text-gray-500 text-sm">My Posts</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-md text-center">
          <FiCheckCircle size={30} className="text-green-500 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-green-500">
            {myItems.filter(i => i.status === 'resolved').length}
          </h3>
          <p className="text-gray-500 text-sm">Resolved</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-md text-center">
          <FiClock size={30} className="text-secondary mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-secondary">{myClaims.length}</h3>
          <p className="text-gray-500 text-sm">My Claims</p>
        </div>
      </div>

      {/* Post New Item Button */}
      <div className="mb-6">
        <Link
          to="/post"
          className="bg-secondary text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition flex items-center gap-2 w-fit"
        >
          <FiPlus /> Post New Item
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('items')}
          className={`px-6 py-2 rounded-xl font-semibold transition ${
            activeTab === 'items'
              ? 'bg-primary text-white'
              : 'bg-white text-gray-500 shadow'
          }`}
        >
          My Posts ({myItems.length})
        </button>
        <button
          onClick={() => setActiveTab('claims')}
          className={`px-6 py-2 rounded-xl font-semibold transition ${
            activeTab === 'claims'
              ? 'bg-primary text-white'
              : 'bg-white text-gray-500 shadow'
          }`}
        >
          My Claims ({myClaims.length})
        </button>
      </div>

      {/* My Items Tab */}
      {activeTab === 'items' && (
        <div className="space-y-4">
          {myItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-gray-500">You haven't posted anything yet!</p>
              <Link to="/post" className="text-secondary font-semibold hover:underline mt-2 block">
                Post your first item →
              </Link>
            </div>
          ) : (
            myItems.map(item => (
              <div key={item._id} className="bg-white rounded-2xl shadow p-6 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      item.type === 'lost' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {item.type === 'lost' ? '🔴 LOST' : '🟢 FOUND'}
                    </span>
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      item.status === 'open' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {item.status === 'open' ? '🔵 Open' : '✅ Resolved'}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-800 text-lg">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.location?.city} • {new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-3">
                  <Link
                    to={`/items/${item._id}`}
                    className="bg-primary text-white px-4 py-2 rounded-xl text-sm hover:opacity-90 transition"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm hover:opacity-90 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* My Claims Tab */}
      {activeTab === 'claims' && (
        <div className="space-y-4">
          {myClaims.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow">
              <div className="text-5xl mb-4">📋</div>
              <p className="text-gray-500">You haven't claimed any items yet!</p>
            </div>
          ) : (
            myClaims.map(claim => (
              <div key={claim._id} className="bg-white rounded-2xl shadow p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {claim.item?.title}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">{claim.message}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(claim.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-sm font-bold px-4 py-2 rounded-full ${
                    claim.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                    claim.status === 'approved' ? 'bg-green-100 text-green-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {claim.status === 'pending' ? '⏳ Pending' :
                     claim.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;