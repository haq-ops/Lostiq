import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { FiZap } from 'react-icons/fi';

const AIMatches = ({ itemId, itemType }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, [itemId]);

  const fetchMatches = async () => {
    try {
      const { data } = await API.get(`/ai/match/${itemId}`);
      setMatches(data.matches);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="mt-6 bg-white rounded-2xl shadow p-6">
      <div className="flex items-center gap-2 mb-4">
        <FiZap className="text-secondary" size={20} />
        <h3 className="font-bold text-primary">AI Matches</h3>
      </div>
      <p className="text-gray-400 text-sm">Finding matches...</p>
    </div>
  );

  if (matches.length === 0) return (
    <div className="mt-6 bg-white rounded-2xl shadow p-6">
      <div className="flex items-center gap-2 mb-2">
        <FiZap className="text-secondary" size={20} />
        <h3 className="font-bold text-primary">AI Matches</h3>
      </div>
      <p className="text-gray-400 text-sm">No matching items found yet.</p>
    </div>
  );

  return (
    <div className="mt-6 bg-white rounded-2xl shadow p-6">

      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <FiZap className="text-secondary" size={20} />
        <h3 className="font-bold text-primary">
          🤖 AI Suggested Matches
        </h3>
        <span className="text-xs bg-secondary text-white px-2 py-0.5 rounded-full">
          {matches.length} found
        </span>
      </div>

      <p className="text-xs text-gray-400 mb-4">
        These {itemType === 'lost' ? 'found' : 'lost'} items might match yours!
      </p>

      {/* Matches List */}
      <div className="space-y-3">
        {matches.map(({ item, percentage }) => (
          <Link
            key={item._id}
            to={`/items/${item._id}`}
            className="flex items-center gap-4 p-3 border border-gray-100 rounded-xl hover:border-primary hover:bg-blue-50 transition"
          >
            {/* Image or Placeholder */}
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
              {item.images?.[0] ? (
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">
                  📦
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 truncate">{item.title}</p>
              <p className="text-xs text-gray-500">
                {item.location?.city} • {item.category}
              </p>
              <p className="text-xs text-gray-400">
                By {item.postedBy?.name}
              </p>
            </div>

            {/* Match Score */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className={`text-sm font-bold px-2 py-1 rounded-lg ${
                percentage >= 70
                  ? 'bg-green-100 text-green-600'
                  : percentage >= 40
                  ? 'bg-yellow-100 text-yellow-600'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {percentage}%
              </div>
              <p className="text-xs text-gray-400 mt-0.5">match</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AIMatches;