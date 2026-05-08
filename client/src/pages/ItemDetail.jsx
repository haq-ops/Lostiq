import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiMapPin, FiCalendar, FiTag, FiUser, FiPhone } from 'react-icons/fi';
import AIMatches from '../components/AIMatches';

const ItemDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claimMessage, setClaimMessage] = useState('');
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data } = await API.get(`/items/${id}`);
        setItem(data);
      } catch (error) {
        toast.error('Item not found!');
        navigate('/items');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleClaim = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to claim this item!');
      navigate('/login');
      return;
    }
    setClaiming(true);
    try {
      await API.post('/claims', { itemId: id, message: claimMessage });
      toast.success('Claim submitted successfully!');
      setClaimMessage('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Claim failed!');
    } finally {
      setClaiming(false);
    }
  };

  if (loading) return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">🔍</div>
      <p className="text-gray-500">Loading...</p>
    </div>
  );

  if (!item) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="text-primary mb-6 flex items-center gap-1 hover:underline"
      >
        ← Back to Items
      </button>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* Image */}
        <div className="h-72 bg-gray-100">
          {item.images?.length > 0 ? (
            <img
              src={item.images[0]}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-8xl">
              📦
            </div>
          )}
        </div>

        <div className="p-8">

          {/* Badges */}
          <div className="flex gap-3 mb-4">
            <span className={`text-sm font-bold px-4 py-1 rounded-full ${
              item.type === 'lost'
                ? 'bg-red-100 text-red-600'
                : 'bg-green-100 text-green-600'
            }`}>
              {item.type === 'lost' ? '🔴 LOST' : '🟢 FOUND'}
            </span>
            <span className={`text-sm px-4 py-1 rounded-full ${
              item.status === 'open'
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-500'
            }`}>
              {item.status === 'open' ? '🔵 Open' : '✅ Resolved'}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-primary mb-4">{item.title}</h1>
          <p className="text-gray-600 mb-6">{item.description}</p>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-2 text-gray-600">
              <FiMapPin className="text-secondary" />
              <span>{item.location?.city} {item.location?.area && `- ${item.location.area}`}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FiCalendar className="text-secondary" />
              <span>{new Date(item.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FiTag className="text-secondary" />
              <span className="capitalize">{item.category}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FiUser className="text-secondary" />
              <span>{item.postedBy?.name}</span>
            </div>
            {item.postedBy?.phone && (
              <div className="flex items-center gap-2 text-gray-600">
                <FiPhone className="text-secondary" />
                <span>{item.postedBy?.phone}</span>
              </div>
            )}
          </div>

          {/* Chat Button */}
          {item.status === 'open' && user && user._id !== item.postedBy?._id && (
            <button
              onClick={() => navigate(`/chat/${item._id}/${item.postedBy._id}`)}
              className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition flex items-center gap-2 mb-4"
            >
              💬 Chat with Finder
            </button>
          )}

          {/* Claim Form */}
          {item.status === 'open' && user?._id !== item.postedBy?._id && (
            <div className="border-t pt-6">
              <h3 className="text-xl font-bold text-primary mb-4">
                Is this yours? Submit a Claim!
              </h3>
              <form onSubmit={handleClaim} className="space-y-4">
                <textarea
                  value={claimMessage}
                  onChange={(e) => setClaimMessage(e.target.value)}
                  placeholder="Describe why this item belongs to you... (e.g. serial number, color, what's inside)"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary resize-none"
                  required
                />
                <button
                  type="submit"
                  disabled={claiming}
                  className="bg-secondary text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
                >
                  {claiming ? 'Submitting...' : '🙋 Submit Claim'}
                </button>
              </form>
            </div>
          )}

          {/* Not logged in */}
          {!user && item.status === 'open' && (
            <div className="border-t pt-6 text-center">
              <p className="text-gray-500 mb-4">Login to claim this item</p>
              <button
                onClick={() => navigate('/login')}
                className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition"
              >
                Login to Claim
              </button>
            </div>
          )}

          {/* 🤖 AI Matches */}
          <AIMatches itemId={item._id} itemType={item.type} />

        </div>
      </div>
    </div>
  );
};

export default ItemDetail;