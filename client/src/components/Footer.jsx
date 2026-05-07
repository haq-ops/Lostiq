import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div>
          <h2 className="text-2xl font-bold text-secondary mb-2">
            Lost<span className="text-white">iq</span>
          </h2>
          <p className="text-gray-300 text-sm">
            Sri Lanka's smart lost & found platform. Report. Search. Reunite.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li><Link to="/" className="hover:text-secondary">Home</Link></li>
            <li><Link to="/items" className="hover:text-secondary">Browse Items</Link></li>
            <li><Link to="/post" className="hover:text-secondary">Post Item</Link></li>
            <li><Link to="/dashboard" className="hover:text-secondary">Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Contact</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>📧 support@lostiq.com</li>
            <li>📍 Colombo, Sri Lanka</li>
          </ul>
        </div>
      </div>

      <div className="text-center py-4 border-t border-gray-600 text-gray-400 text-sm">
        © 2024 Lostiq. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;