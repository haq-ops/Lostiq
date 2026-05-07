import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiLogOut, FiPlusCircle, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="bg-primary text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-secondary">
          Lost<span className="text-white">iq</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/items?type=lost" className="hover:text-secondary transition">Lost Items</Link>
          <Link to="/items?type=found" className="hover:text-secondary transition">Found Items</Link>
          <Link to="/items" className="hover:text-secondary transition">All Items</Link>
        </div>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Link to="/post" className="flex items-center gap-1 bg-secondary px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition">
                <FiPlusCircle /> Post Item
              </Link>
              <Link to="/dashboard" className="hover:text-secondary transition">
                <FiUser size={20} />
              </Link>
              <button onClick={handleLogout} className="hover:text-secondary transition">
                <FiLogOut size={20} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-secondary transition">Login</Link>
              <Link to="/register" className="bg-secondary px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-primary border-t border-blue-800 px-4 py-4 space-y-3">
          <Link to="/items" onClick={() => setMenuOpen(false)} className="block hover:text-secondary">All Items</Link>
          <Link to="/items?type=lost" onClick={() => setMenuOpen(false)} className="block hover:text-secondary">Lost Items</Link>
          <Link to="/items?type=found" onClick={() => setMenuOpen(false)} className="block hover:text-secondary">Found Items</Link>
          {user ? (
            <>
              <Link to="/post" onClick={() => setMenuOpen(false)} className="block hover:text-secondary">Post Item</Link>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block hover:text-secondary">Dashboard</Link>
              <button onClick={handleLogout} className="block text-red-400 hover:text-red-300">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block hover:text-secondary">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="block hover:text-secondary">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;