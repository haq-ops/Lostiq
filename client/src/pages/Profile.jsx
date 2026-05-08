import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit, FiSave, FiX } from 'react-icons/fi';

const Profile = () => {
  const { user, login } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    city: user?.city || '',
    currentPassword: '',
    newPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.put('/auth/profile', formData);
      login({ ...user, ...data });
      toast.success('Profile updated!');
      setEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* Header */}
        <div className="bg-primary text-white p-8 text-center">
          <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-4">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-2xl font-bold">{user?.name}</h1>
          <p className="text-gray-300">{user?.email}</p>
          <span className={`mt-2 inline-block text-xs px-4 py-1 rounded-full font-semibold ${
            user?.role === 'admin'
              ? 'bg-purple-500 text-white'
              : 'bg-secondary text-white'
          }`}>
            {user?.role === 'admin' ? '👮 Admin' : '👤 User'}
          </span>
        </div>

        <div className="p-8">
          {!editing ? (
            /* View Mode */
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <FiUser className="text-secondary" size={20} />
                <div>
                  <p className="text-xs text-gray-400">Full Name</p>
                  <p className="font-medium text-gray-800">{user?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <FiMail className="text-secondary" size={20} />
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="font-medium text-gray-800">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <FiPhone className="text-secondary" size={20} />
                <div>
                  <p className="text-xs text-gray-400">Phone</p>
                  <p className="font-medium text-gray-800">{user?.phone || 'Not set'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <FiMapPin className="text-secondary" size={20} />
                <div>
                  <p className="text-xs text-gray-400">City</p>
                  <p className="font-medium text-gray-800">{user?.city || 'Not set'}</p>
                </div>
              </div>

              <button
                onClick={() => setEditing(true)}
                className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
              >
                <FiEdit /> Edit Profile
              </button>
            </div>
          ) : (
            /* Edit Mode */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary"
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

              <hr className="my-4" />
              <p className="text-sm font-medium text-gray-700">Change Password (optional)</p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <FiSave /> {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
                >
                  <FiX /> Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;