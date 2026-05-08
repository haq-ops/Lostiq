import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Sri Lanka city coordinates
const cityCoords = {
  'Colombo':      [6.9271, 79.8612],
  'Kandy':        [7.2906, 80.6337],
  'Galle':        [6.0535, 80.2210],
  'Jaffna':       [9.6615, 80.0255],
  'Negombo':      [7.2083, 79.8358],
  'Matara':       [5.9549, 80.5550],
  'Kurunegala':   [7.4863, 80.3647],
  'Anuradhapura': [8.3114, 80.4037],
};

const lostIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const foundIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const MapView = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data } = await API.get('/items');
      setItems(data);
    } catch (error) {
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  // Only show items with known city coords
  const mappableItems = filteredItems.filter(
    item => cityCoords[item.location?.city]
  );

  if (loading) return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">🗺️</div>
      <p className="text-gray-500">Loading map...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-primary">🗺️ Map View</h1>
        <p className="text-gray-500 mt-2">See lost & found items across Sri Lanka</p>
      </div>

      {/* Filter */}
      <div className="flex gap-3 justify-center mb-6">
        {['all', 'lost', 'found'].map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-6 py-2 rounded-full font-semibold capitalize transition ${
              filter === type
                ? 'bg-primary text-white'
                : 'bg-white text-gray-500 shadow'
            }`}
          >
            {type === 'all' ? '🗺️ All' : type === 'lost' ? '🔴 Lost' : '🟢 Found'}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-6 justify-center mb-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-gray-600">Lost Items</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-gray-600">Found Items</span>
        </div>
      </div>

      {/* Map */}
      <div className="rounded-2xl overflow-hidden shadow-lg" style={{ height: '500px' }}>
        <MapContainer
          center={[7.8731, 80.7718]}
          zoom={7}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {mappableItems.map(item => (
            <Marker
              key={item._id}
              position={cityCoords[item.location?.city]}
              icon={item.type === 'lost' ? lostIcon : foundIcon}
            >
              <Popup>
                <div className="p-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    item.type === 'lost'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-green-100 text-green-600'
                  }`}>
                    {item.type === 'lost' ? '🔴 LOST' : '🟢 FOUND'}
                  </span>
                  <h3 className="font-bold mt-1 text-gray-800">{item.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{item.location?.city}</p>
                  <p className="text-xs text-gray-500">{item.category}</p>
                  <Link
                    to={`/items/${item._id}`}
                    className="text-xs text-blue-500 hover:underline mt-1 block"
                  >
                    View Details →
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Items Count */}
      <div className="text-center mt-4 text-gray-500">
        Showing {mappableItems.length} items on map
      </div>
    </div>
  );
};

export default MapView;