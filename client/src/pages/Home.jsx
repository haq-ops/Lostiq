import { Link } from 'react-router-dom';
import { FiSearch, FiPlusCircle, FiCheckCircle } from 'react-icons/fi';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Lost Something? <br />
            <span className="text-secondary">We'll Help You Find It!</span>
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            Sri Lanka's smartest lost & found platform. Report lost items, find what others discovered.
          </p>

          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-3 max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search for lost or found items..."
              className="flex-1 px-5 py-3 rounded-full text-gray-800 outline-none text-base"
            />
            <Link
              to="/items"
              className="bg-secondary px-8 py-3 rounded-full font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              <FiSearch /> Search
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <h3 className="text-3xl font-bold text-primary">500+</h3>
            <p className="text-gray-500">Items Posted</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-secondary">200+</h3>
            <p className="text-gray-500">Items Reunited</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-primary">1000+</h3>
            <p className="text-gray-500">Happy Users</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">
            How Lostiq Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-md text-center">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-primary mb-2">1. Report</h3>
              <p className="text-gray-500">Post your lost or found item with photos and location details.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-md text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-primary mb-2">2. Search</h3>
              <p className="text-gray-500">Browse through reported items filtered by city, category and date.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-md text-center">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-primary mb-2">3. Reunite</h3>
              <p className="text-gray-500">Connect with the finder and get your item back safely.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-secondary text-white py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Found Something? Help Someone Today!</h2>
        <p className="mb-8 text-lg">Post a found item and make someone's day better.</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            to="/post"
            className="bg-white text-secondary px-8 py-3 rounded-full font-semibold hover:opacity-90 transition flex items-center gap-2"
          >
            <FiPlusCircle /> Post an Item
          </Link>
          <Link
            to="/items"
            className="border-2 border-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-secondary transition flex items-center gap-2"
          >
            <FiSearch /> Browse Items
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;