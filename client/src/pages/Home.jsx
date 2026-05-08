import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiPlusCircle, FiMapPin, FiClock } from 'react-icons/fi';
import API from '../api/axios';

const Home = () => {
  const [search, setSearch] = useState('');
  const [recentItems, setRecentItems] = useState([]);
  const [stats, setStats] = useState({ total: 0, lost: 0, found: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecentItems();
    fetchStats();
  }, []);

  const fetchRecentItems = async () => {
    try {
      const { data } = await API.get('/items?limit=6');
      setRecentItems(data.slice(0, 6));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await API.get('/items');
      const lost = data.filter(i => i.type === 'lost').length;
      const found = data.filter(i => i.type === 'found').length;
      setStats({ total: data.length, lost, found });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/items?search=${search}`);
    } else {
      navigate('/items');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-primary text-white py-24 px-4 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-800 rounded-full opacity-30"></div>
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-secondary rounded-full opacity-20"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block bg-secondary bg-opacity-20 text-secondary border border-secondary px-4 py-1 rounded-full text-sm font-semibold mb-6">
            🇱🇰 Sri Lanka's #1 Lost & Found Platform
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Lost Something? <br />
            <span className="text-secondary">We'll Help You Find It!</span>
          </h1>
          <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
            Sri Lanka's smartest lost & found platform. Report lost items, find what others discovered using AI-powered matching.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 max-w-2xl mx-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for lost or found items..."
              className="flex-1 px-5 py-4 rounded-full text-gray-800 outline-none text-base shadow-lg"
            />
            <button
              type="submit"
              className="bg-secondary px-8 py-4 rounded-full font-semibold hover:opacity-90 transition flex items-center justify-center gap-2 shadow-lg"
            >
              <FiSearch /> Search
            </button>
          </form>

          {/* Quick Links */}
          <div className="flex gap-4 justify-center mt-6 flex-wrap">
            <Link to="/items?type=lost" className="text-gray-300 hover:text-white text-sm flex items-center gap-1 transition">
              🔴 Lost Items
            </Link>
            <Link to="/items?type=found" className="text-gray-300 hover:text-white text-sm flex items-center gap-1 transition">
              🟢 Found Items
            </Link>
            <Link to="/map" className="text-gray-300 hover:text-white text-sm flex items-center gap-1 transition">
              🗺️ View Map
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-3 gap-4 text-center">
          <div className="p-4">
            <h3 className="text-3xl md:text-4xl font-bold text-primary">{stats.total || '500'}+</h3>
            <p className="text-gray-500 mt-1">Items Posted</p>
          </div>
          <div className="p-4">
            <h3 className="text-3xl md:text-4xl font-bold text-secondary">{stats.found || '200'}+</h3>
            <p className="text-gray-500 mt-1">Items Found</p>
          </div>
          <div className="p-4">
            <h3 className="text-3xl md:text-4xl font-bold text-green-500">1000+</h3>
            <p className="text-gray-500 mt-1">Happy Users</p>
          </div>
        </div>
      </section>

      {/* Recent Items */}
      {recentItems.length > 0 && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-primary">🕐 Recent Items</h2>
              <Link to="/items" className="text-secondary font-semibold hover:underline">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentItems.map(item => (
                <Link
                  key={item._id}
                  to={`/items/${item._id}`}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden group"
                >
                  {/* Image */}
                  <div className="h-48 bg-gray-100 overflow-hidden">
                    {item.images?.[0] ? (
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl">
                        📦
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        item.type === 'lost'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-green-100 text-green-600'
                      }`}>
                        {item.type === 'lost' ? '🔴 LOST' : '🟢 FOUND'}
                      </span>
                      <span className="text-xs text-gray-400 capitalize">{item.category}</span>
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2 truncate">{item.title}</h3>
                    <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
                      <FiMapPin size={12} />
                      <span>{item.location?.city}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                      <FiClock size={12} />
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-primary mb-4">
            How Lostiq Works
          </h2>
          <p className="text-center text-gray-500 mb-12">Simple 3 steps to reunite with your belongings</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-2xl text-center hover:shadow-lg transition group">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 group-hover:scale-110 transition">
                📝
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">1. Report</h3>
              <p className="text-gray-500">Post your lost or found item with photos and location details.</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl text-center hover:shadow-lg transition group">
              <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 group-hover:scale-110 transition">
                🔍
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">2. Search</h3>
              <p className="text-gray-500">Browse through reported items filtered by city, category and date.</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl text-center hover:shadow-lg transition group">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 group-hover:scale-110 transition">
                🤝
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">3. Reunite</h3>
              <p className="text-gray-500">Connect with the finder and get your item back safely.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">
            ✨ Why Choose Lostiq?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-md text-center hover:shadow-lg transition">
              <div className="text-4xl mb-3">🤖</div>
              <h3 className="font-bold text-primary mb-2">AI Matching</h3>
              <p className="text-gray-500 text-sm">Smart algorithm matches lost & found items automatically.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md text-center hover:shadow-lg transition">
              <div className="text-4xl mb-3">💬</div>
              <h3 className="font-bold text-primary mb-2">Real-time Chat</h3>
              <p className="text-gray-500 text-sm">Chat directly with finders or owners instantly.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md text-center hover:shadow-lg transition">
              <div className="text-4xl mb-3">🗺️</div>
              <h3 className="font-bold text-primary mb-2">Map View</h3>
              <p className="text-gray-500 text-sm">See items on an interactive Sri Lanka map.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md text-center hover:shadow-lg transition">
              <div className="text-4xl mb-3">🔔</div>
              <h3 className="font-bold text-primary mb-2">Notifications</h3>
              <p className="text-gray-500 text-sm">Get email alerts when matching items are found.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-secondary text-white py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Found Something? Help Someone Today!</h2>
        <p className="mb-8 text-lg opacity-90">Post a found item and make someone's day better.</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            to="/post"
            className="bg-white text-secondary px-8 py-3 rounded-full font-semibold hover:opacity-90 transition flex items-center gap-2 shadow-lg"
          >
            <FiPlusCircle /> Post an Item
          </Link>
          <Link
            to="/items"
            className="border-2 border-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-secondary transition flex items-center gap-2"
          >
            <FiSearch /> Browse Items
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;