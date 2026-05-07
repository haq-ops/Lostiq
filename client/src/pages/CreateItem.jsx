import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CreateItem = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'lost',
    title: '',
    description: '',
    category: 'other',
    city: '',
    area: '',
    date: ''
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/items', {
        type: formData.type,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: { city: formData.city, area: formData.area },
        date: formData.date
      });
      toast.success('Item posted successfully!');
      navigate('/items');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        
        <h1 className="text-3xl font-bold text-primary mb-2">Post an Item</h1>
        <p className="text-gray-500 mb-8">Report a lost or found item</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Type */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'lost' })}
              className={`flex-1 py-3 rounded-xl font-semibold border-2 transition ${
                formData.type === 'lost'
                  ? 'border-red-500 bg-red-50 text-red-600'
                  : 'border-gray-200 text-gray-500'
              }`}
            >
              🔴 I Lost Something
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'found' })}
              className={`flex-1 py-3 rounded-xl font-semibold border-2 transition ${
                formData.type === 'found'
                  ? 'border-green-500 bg-green-50 text-green-600'
                  : 'border-gray-200 text-gray-500'
              }`}
            >
              🟢 I Found Something
            </button>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Black leather wallet"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the item in detail..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary resize-none"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary"
            >
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
          </div>

          {/* City & Area */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary"
                required
              >
                <option value="">Select city</option>
                <option>Colombo</option>
                <option>Kandy</option>
                <option>Galle</option>
                <option>Jaffna</option>
                <option>Negombo</option>
                <option>Matara</option>
                <option>Kurunegala</option>
                <option>Anuradhapura</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
              <input
                type="text"
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="e.g. Fort, Pettah"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date {formData.type === 'lost' ? 'Lost' : 'Found'}
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Posting...' : '📝 Post Item'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateItem;