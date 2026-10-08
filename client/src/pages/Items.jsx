import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import API from '../api/axios';
import ItemCard from '../components/ItemCard';
import { FiSearch, FiChevronDown, FiX, FiInbox } from 'react-icons/fi';

const categories = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'wallet', label: 'Wallet' },
  { value: 'keys', label: 'Keys' },
  { value: 'bag', label: 'Bag' },
  { value: 'documents', label: 'Documents' },
  { value: 'jewelry', label: 'Jewelry' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'pets', label: 'Pets' },
  { value: 'other', label: 'Other' },
];

const cities = [
  'Colombo', 'Kandy', 'Galle', 'Jaffna',
  'Negombo', 'Matara', 'Kurunegala', 'Anuradhapura',
];

const types = [
  { value: '', label: 'All' },
  { value: 'lost', label: 'Lost' },
  { value: 'found', label: 'Found' },
];

// Dropdown with a clean custom arrow
const FilterSelect = ({ value, onChange, children }) => (
  <div className="relative">
    <select
      value={value}
      onChange={onChange}
      className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-3 pl-4 pr-10 text-sm text-gray-700 outline-none transition focus:border-primary focus:bg-white lg:w-44"
    >
      {children}
    </select>
    <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
  </div>
);

// Grey placeholder card while loading
const SkeletonCard = () => (
  <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
    <div className="h-44 animate-pulse bg-gray-100" />
    <div className="space-y-3 p-4">
      <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
      <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
      <div className="h-3 w-1/2 animate-pulse rounded bg-gray-100" />
    </div>
  </div>
);

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

  const hasFilters = type || category || city || search;

  const clearFilters = () => {
    setType('');
    setCategory('');
    setCity('');
    setSearch('');
    fetchItems('', '', '', '');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">

      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary">Browse Items</h1>
        <p className="mt-2 text-gray-500">Search through lost and found items</p>
      </div>

      {/* Search + filters (one row on desktop) */}
      <form
        onSubmit={handleSearch}
        className="mb-6 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm"
      >
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:bg-white"
            />
          </div>

          <FilterSelect value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </FilterSelect>

          <FilterSelect value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">All Cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </FilterSelect>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <FiSearch /> Search
          </button>
        </div>
      </form>

      {/* Toolbar: All / Lost / Found + count */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex w-fit rounded-xl bg-gray-100 p-1">
          {types.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setType(t.value)}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
                type === t.value
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500">
          {!loading && (
            <span>
              {items.length} {items.length === 1 ? 'item' : 'items'} found
            </span>
          )}
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1 font-medium text-primary hover:underline"
            >
              <FiX size={14} /> Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
            <FiInbox size={24} className="text-gray-400" />
          </div>
          <h3 className="font-semibold text-gray-800">No items found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try a different search or clear your filters.
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Items;