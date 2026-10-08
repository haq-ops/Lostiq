import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiPlusCircle, FiMapPin, FiClock, FiArrowRight } from 'react-icons/fi';
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
    <div className="bg-gray-50">

      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #1E3A5F 0%, #0f2340 50%, #1a1a2e 100%)'
      }}>
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 animate-pulse"
            style={{ background: 'radial-gradient(circle, #FF6B35, transparent)' }}></div>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-20 animate-pulse"
            style={{ background: 'radial-gradient(circle, #3b82f6, transparent)', animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
            style={{ background: 'radial-gradient(circle, #FF6B35, transparent)' }}></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-28 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 text-white px-5 py-2 rounded-full text-sm font-medium mb-8">
            <span>🇱🇰</span>
            <span>Sri Lanka's #1 Lost & Found Platform</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
            Lost Something?
            <br />
            <span style={{ 
              background: 'linear-gradient(90deg, #FF6B35, #ff9a6c)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              We'll Find It!
            </span>
          </h1>

          <p className="text-gray-300 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            AI-powered lost & found platform for Sri Lanka. 
            Report items, get matched instantly, reunite with your belongings.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-10">
            <div className="flex bg-white rounded-2xl shadow-2xl overflow-hidden p-2 gap-2">
              <div className="flex items-center pl-3 text-gray-400">
                <FiSearch size={20} />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for lost or found items..."
                className="flex-1 px-3 py-3 text-gray-800 outline-none text-base bg-transparent"
              />
              <button
                type="submit"
                className="text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 hover:opacity-90 flex items-center gap-2 whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg, #FF6B35, #ff4500)' }}
              >
                <FiSearch /> Search
              </button>
            </div>
          </form>

          {/* Quick Links */}
          <div className="flex gap-6 justify-center flex-wrap">
            <Link to="/items?type=lost"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-200 text-sm group">
              <span className="w-2 h-2 bg-red-500 rounded-full group-hover:scale-150 transition-transform"></span>
              Lost Items
            </Link>
            <Link to="/items?type=found"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-200 text-sm group">
              <span className="w-2 h-2 bg-green-500 rounded-full group-hover:scale-150 transition-transform"></span>
              Found Items
            </Link>
            <Link to="/map"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-200 text-sm group">
              <span className="w-2 h-2 bg-blue-500 rounded-full group-hover:scale-150 transition-transform"></span>
              View Map
            </Link>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H0Z" fill="#f9fafb"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ background: 'linear-gradient(135deg, #1E3A5F20, #1E3A5F10)' }}>
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="text-3xl font-black text-gray-800">{stats.total || '500'}+</h3>
              <p className="text-gray-500 text-sm mt-1 font-medium">Items Posted</p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ background: 'linear-gradient(135deg, #FF6B3520, #FF6B3510)' }}>
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-3xl font-black" style={{ color: '#FF6B35' }}>{stats.found || '200'}+</h3>
              <p className="text-gray-500 text-sm mt-1 font-medium">Items Reunited</p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ background: 'linear-gradient(135deg, #22c55e20, #22c55e10)' }}>
                <span className="text-2xl">😊</span>
              </div>
              <h3 className="text-3xl font-black text-green-500">1000+</h3>
              <p className="text-gray-500 text-sm mt-1 font-medium">Happy Users</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Items */}
      {recentItems.length > 0 && (
        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-black text-gray-800">Recent Items</h2>
                <p className="text-gray-500 text-sm mt-1">Latest lost & found reports</p>
              </div>
              <Link to="/items"
                className="flex items-center gap-2 text-sm font-semibold hover:gap-3 transition-all duration-200"
                style={{ color: '#FF6B35' }}>
                View All <FiArrowRight />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {recentItems.map(item => (
                <Link
                  key={item._id}
                  to={`/items/${item._id}`}
                  className="bg-white rounded-2xl overflow-hidden group hover:-translate-y-1 transition-all duration-300 border border-gray-100 hover:border-gray-200 hover:shadow-lg"
                >
                  <div className="h-44 bg-gray-100 overflow-hidden relative">
                    {item.images?.[0] ? (
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)' }}>
                        <span className="text-5xl opacity-50">📦</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                        item.type === 'lost'
                          ? 'bg-red-500 text-white'
                          : 'bg-green-500 text-white'
                      }`}>
                        {item.type === 'lost' ? '🔴 LOST' : '🟢 FOUND'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-400 capitalize bg-gray-100 px-2 py-1 rounded-lg">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-800 truncate mb-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <FiMapPin size={11} />
                        <span>{item.location?.city}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiClock size={11} />
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-black text-gray-800 mb-3">How Lostiq Works</h2>
            <p className="text-gray-500">Simple 3 steps to reunite with your belongings</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-primary to-secondary z-0"></div>

            {[
              { icon: '📝', step: '01', title: 'Report', desc: 'Post your lost or found item with photos and location details.', color: '#1E3A5F' },
              { icon: '🔍', step: '02', title: 'Search & Match', desc: 'Our AI automatically matches lost & found items by category and location.', color: '#FF6B35' },
              { icon: '🤝', step: '03', title: 'Reunite', desc: 'Chat with the finder and safely get your item back.', color: '#22c55e' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-7 text-center relative z-10 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="text-xs font-black px-3 py-1 rounded-full text-white"
                    style={{ background: item.color }}>
                    {item.step}
                  </span>
                </div>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 mt-2"
                  style={{ background: `${item.color}15` }}>
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4" style={{ background: 'linear-gradient(135deg, #1E3A5F08, #FF6B3508)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-black text-gray-800 mb-3">Why Choose Lostiq?</h2>
            <p className="text-gray-500">Powerful features to help you find what matters</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '🤖', title: 'AI Matching', desc: 'Smart algorithm matches items automatically', color: '#6366f1' },
              { icon: '💬', title: 'Real-time Chat', desc: 'Chat directly with finders instantly', color: '#0ea5e9' },
              { icon: '🗺️', title: 'Map View', desc: 'See items on Sri Lanka map', color: '#10b981' },
              { icon: '🔔', title: 'Notifications', desc: 'Email alerts for matching items', color: '#f59e0b' },
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 text-center hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3"
                  style={{ background: `${feature.color}15` }}>
                  {feature.icon}
                </div>
                <h3 className="font-bold text-gray-800 text-sm mb-1">{feature.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-3xl p-10 text-center text-white relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #FF6B35, #ff4500)' }}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white rounded-full opacity-5"></div>
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white rounded-full opacity-5"></div>
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-black mb-4">Found Something?</h2>
              <p className="text-orange-100 mb-8 text-lg">Help someone reunite with their belongings today!</p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Link to="/post"
                  className="bg-white font-bold px-8 py-3 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                  style={{ color: '#FF6B35' }}>
                  <FiPlusCircle /> Post an Item
                </Link>
                <Link to="/items"
                  className="border-2 border-white border-opacity-50 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white hover:text-orange-500 transition-all duration-200">
                  <FiSearch /> Browse Items
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;