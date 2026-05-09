import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import API from '../api/axios';
import ItemCard from '../components/ItemCard';
import { FiSearch } from 'react-icons/fi';

const Items = () => {
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [search, setSearch] = useState('');

  const fetchItems = useCallback(async (t, cat, c, s) => {
    try {
      setLoading(true);
      const params = {};
      if (s) params.search = s;
      if (t) params.type = t;
      if (cat) params.category = cat;
      if (c) params.city = c;

      const { data } = await API.get('/items', { params });
      setItems(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // URL change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const typeFromURL = params.get('type') || '';
    setType(typeFromURL);
    fetchItems(typeFromURL, category, city, search);
  }, [location.search]);

  // Filter change
  useEffect(() => {
    fetchItems(type, category, city, search);
  }, [type, category, city]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems(type, category, city, search);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Browse Items</h1>
        <p className="text-gray-500 mt-2">Search through lost and found items</p>
      </div>

      <form onSubmit={handleSearch} className="bg-white p-6 rounded-2xl shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary"
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary"
          >
            <option value="">All Types</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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

          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
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