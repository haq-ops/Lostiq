import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import API from '../api/axios';
import ItemCard from '../components/ItemCard';
import { FiSearch } from 'react-icons/fi';

const Items = () => {
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    category: '',
    city: ''
  });

  // URL query params read பண்ணு
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const typeFromURL = params.get('type') || '';
    setFilters(prev => ({ ...prev, type: typeFromURL }));
  }, [location.search]);

  // filters மாறும்போது fetch பண்ணு
  useEffect(() => {
    fetchItems();
  }, [filters.type]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.type) params.type = filters.type;
      if (filters.category) params.category = filters.category;
      if (filters.city) params.city = filters.city;

      const { data } = await API.get('/items', { params });
      setItems(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Browse Items</h1>
        <p className="text-gray-500 mt-2">Search through lost and found items</p>
      </div>

      {/* Search & Filter */}
      <form onSubmit={handleSearch} className="bg-white p-6 rounded-2xl shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* Search */}
          <div className="relative md:col-span-1">
            <input
              type="text"
              placeholder="Search items..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary"
          >
            <option value="">All Types</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary"
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="wallet">Wallet</option>
            <option value="keys">Keys</option>
            <option value="bag">Bag</option>
            <option value="documents">Documents</option>
            <option value="jewelry">Jewelry</option>
            <option value="clothing">Clothing</option>
            <option value="pets">Pets</option>
            <option value="other">Other</option>
          </select>

          {/* City Filter */}
          <select
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            className="px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary"
          >
            <option value="">All Cities</option>
            <option value="Colombo">Colombo</option>
            <option value="Kandy">Kandy</option>
            <option value="Galle">Galle</option>
            <option value="Jaffna">Jaffna</option>
            <option value="Negombo">Negombo</option>
            <option value="Matara">Matara</option>
            <option value="Kurunegala">Kurunegala</option>
            <option value="Anuradhapura">Anuradhapura</option>
          </select>
        </div>

        <button
          type="submit"
          className="mt-4 bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition flex items-center gap-2"
        >
          <FiSearch /> Search
        </button>
      </form>

      {/* Results */}
      {loading ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-500">Loading items...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-gray-500">No items found!</p>
        </div>
      ) : (
        <>
          <p className="text-gray-500 mb-4">{items.length} items found</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Items;