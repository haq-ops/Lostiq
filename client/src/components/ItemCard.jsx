import { Link } from 'react-router-dom';
import {
  FiMapPin, FiCalendar, FiArrowRight, FiPackage, FiSmartphone,
  FiFileText, FiCreditCard, FiShoppingBag, FiKey, FiWatch,
} from 'react-icons/fi';

// Icon shown when an item has no photo
const categoryIcons = {
  electronics: FiSmartphone,
  documents: FiFileText,
  wallet: FiCreditCard,
  bag: FiShoppingBag,
  keys: FiKey,
  jewelry: FiWatch,
};

// "bag" -> "Bag"
const capitalize = (text = '') => text.charAt(0).toUpperCase() + text.slice(1);

const ItemCard = ({ item }) => {
  const isLost = item.type === 'lost';
  const isResolved = item.status !== 'open';
  const CategoryIcon = categoryIcons[item.category?.toLowerCase()] || FiPackage;
  const posterName = item.postedBy?.name || 'Anonymous';
  const date = item.date
    ? new Date(item.date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '';

  return (
    <Link to={`/items/${item._id}`} className="group block h-full">
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

        {/* Image */}
        <div className="relative h-44 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          {item.images?.length > 0 ? (
            <img
              src={item.images[0]}
              alt={item.title}
              className={`h-full w-full object-contain p-4 mix-blend-multiply transition duration-500 group-hover:scale-105 ${
                isResolved ? 'grayscale opacity-60' : ''
              }`}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
                <CategoryIcon size={28} className="text-gray-400" />
              </div>
            </div>
          )}

          {/* Lost / Found badge */}
          <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-700 shadow-sm backdrop-blur">
            <span className={`h-2 w-2 rounded-full ${isLost ? 'bg-red-500' : 'bg-emerald-500'}`} />
            {isLost ? 'Lost' : 'Found'}
          </span>

          {/* Only show status when resolved */}
          {isResolved && (
            <span className="absolute right-3 top-3 z-10 rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
              Resolved
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-4">
          <div className="mb-1 flex items-start justify-between gap-2">
            <h3 className="truncate text-base font-semibold text-gray-900 transition group-hover:text-primary">
              {capitalize(item.title)}
            </h3>
            {item.category && (
              <span className="shrink-0 rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium capitalize text-gray-600">
                {item.category}
              </span>
            )}
          </div>

          <p className="mb-4 line-clamp-2 text-sm text-gray-500">
            {capitalize(item.description)}
          </p>

          <div className="mt-auto space-y-1.5 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <FiMapPin size={14} className="shrink-0 text-gray-400" />
              <span className="truncate capitalize">
                {item.location?.city}
                {item.location?.area && ` · ${item.location.area}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FiCalendar size={14} className="shrink-0 text-gray-400" />
              <span>{date}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {posterName.charAt(0).toUpperCase()}
            </span>
            <span className="truncate text-xs text-gray-500 capitalize">{posterName}</span>
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-primary">
            View
            <FiArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;