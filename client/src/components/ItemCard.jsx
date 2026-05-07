import { Link } from 'react-router-dom';
import { FiMapPin, FiCalendar, FiTag } from 'react-icons/fi';

const ItemCard = ({ item }) => {
  return (
    <Link to={`/items/${item._id}`}>
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden">
        
        {/* Image */}
        <div className="h-48 bg-gray-100 overflow-hidden">
          {item.images?.length > 0 ? (
            <img
              src={item.images[0]}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-5xl">
              📦
            </div>
          )}
        </div>

        {/* Badge */}
        <div className="px-4 pt-3">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
            item.type === 'lost'
              ? 'bg-red-100 text-red-600'
              : 'bg-green-100 text-green-600'
          }`}>
            {item.type === 'lost' ? '🔴 LOST' : '🟢 FOUND'}
          </span>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 text-lg truncate">{item.title}</h3>
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">{item.description}</p>

          <div className="mt-3 space-y-1 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <FiMapPin size={14} className="text-secondary" />
              {item.location?.city} {item.location?.area && `- ${item.location.area}`}
            </div>
            <div className="flex items-center gap-1">
              <FiCalendar size={14} className="text-secondary" />
              {new Date(item.date).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <FiTag size={14} className="text-secondary" />
              {item.category}
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="px-4 pb-4">
          <span className={`text-xs px-2 py-1 rounded-full ${
            item.status === 'open'
              ? 'bg-blue-100 text-blue-600'
              : 'bg-gray-100 text-gray-500'
          }`}>
            {item.status === 'open' ? '🔵 Open' : '✅ Resolved'}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;