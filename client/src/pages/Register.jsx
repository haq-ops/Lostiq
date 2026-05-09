import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', city: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Phone validation
    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
      toast.error('Phone number must be exactly 10 digits!');
      return;
    }

    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', formData);
      login(data);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">
            Lost<span className="text-secondary">iq</span>
          </h1>
          <p className="text-gray-500 mt-2">Create your account to get started.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min 6 characters"
              minLength={6}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone <span className="text-gray-400 text-xs">(10 digits)</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="07XXXXXXXX"
              maxLength={10}
              pattern="[0-9]{10}"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary transition"
            />
            {formData.phone && formData.phone.length !== 10 && (
              <p className="text-red-500 text-xs mt-1">
                {formData.phone.length}/10 digits
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-primary transition"
              required
            >
              <option value="">Select your city</option>
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        {/* Google Login */}
        <div className="flex items-center gap-3 my-4">
          <hr className="flex-1 border-gray-200" />
          <span className="text-gray-400 text-sm">OR</span>
          <hr className="flex-1 border-gray-200" />
        </div>

        <button
          onClick={() => window.location.href = 'http://localhost:5000/api/auth/google'}
          className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 py-3 rounded-xl font-semibold text-gray-700 hover:border-primary hover:bg-gray-50 transition"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          Continue with Google
        </button>

        <p className="text-center text-gray-500 mt-6 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-secondary font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;