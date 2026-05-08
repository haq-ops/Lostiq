import { Link } from 'react-router-dom';
import { FiMapPin, FiCalendar, FiTag, FiUser } from 'react-icons/fi';

const ItemCard = ({ item }) => {
  return (
    <Link to={`/items/${item._id}`} className="group">
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-primary group-hover:-translate-y-1">

        {/* Image */}
        <div className="h-48 bg-gray-100 overflow-hidden relative">
          {item.images?.length > 0 ? (
            <img
              src={item.images[0]}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-gray-50 to-gray-200">
              📦
            </div>
          )}

          {/* Type Badge — image பக்கத்துல */}
          <div className="absolute top-3 left-3">
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-md ${
              item.type === 'lost'
                ? 'bg-red-500 text-white'
                : 'bg-green-500 text-white'
            }`}>
              {item.type === 'lost' ? '🔴 LOST' : '🟢 FOUND'}
            </span>
          </div>

          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <span className={`text-xs px-2 py-1 rounded-full shadow-md ${
              item.status === 'open'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-500 text-white'
            }`}>
              {item.status === 'open' ? 'Open' : '✅ Resolved'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-gray-800 text-lg truncate mb-1 group-hover:text-primary transition">
            {item.title}
          </h3>
          <p className="text-gray-500 text-sm line-clamp-2 mb-3">
            {item.description}
          </p>

          {/* Details */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FiMapPin size={14} className="text-secondary flex-shrink-0" />
              <span className="truncate">
                {item.location?.city}{item.location?.area && ` - ${item.location.area}`}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FiCalendar size={14} className="text-secondary flex-shrink-0" />
              <span>{new Date(item.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FiTag size={14} className="text-secondary flex-shrink-0" />
              <span className="capitalize">{item.category}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 pb-4 flex items-center justify-between border-t border-gray-50 pt-3">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <FiUser size={12} />
            <span>{item.postedBy?.name || 'Anonymous'}</span>
          </div>
          <span className="text-xs text-primary font-semibold group-hover:text-secondary transition">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;