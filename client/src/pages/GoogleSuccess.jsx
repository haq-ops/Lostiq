import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const GoogleSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');

    if (token) {
      handleGoogleLogin(token);
    } else {
      navigate('/login');
    }
  }, []);

  const handleGoogleLogin = async (token) => {
    try {
      // Token localStorage-ல் save பண்ணு
      localStorage.setItem('token', token);

      // User profile fetch பண்ணு
      const { data } = await API.get('/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // AuthContext-ல் login பண்ணு
      login({ ...data, token });

      navigate('/');
    } catch (error) {
      console.error(error);
      navigate('/login');
    }
  };

  return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">⏳</div>
      <p className="text-gray-500">Logging in with Google...</p>
    </div>
  );
};

export default GoogleSuccess;