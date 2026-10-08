import { useState, useRef } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  FiUpload, FiX, FiChevronDown, FiSearch, FiCheckCircle, FiSend,
} from 'react-icons/fi';

const MAX_IMAGES = 3;
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const categories = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'wallet', label: 'Wallet' },
  { value: 'keys', label: 'Keys' },
  { value: 'bag', label: 'Bag' },
  { value: 'documents', label: 'Documents' },
  { value: 'jewelry', label: 'Jewelry' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'pets', label: 'Pets' },
  { value: 'other', label: 'Other' },
];

const cities = [
  'Colombo', 'Kandy', 'Galle', 'Jaffna',
  'Negombo', 'Matara', 'Kurunegala', 'Anuradhapura',
];

const typeOptions = [
  {
    value: 'lost',
    title: 'I lost something',
    hint: 'Let people help you find it',
    icon: FiSearch,
    activeCard: 'border-red-400 bg-red-50/60',
    activeIcon: 'bg-red-100 text-red-600',
  },
  {
    value: 'found',
    title: 'I found something',
    hint: 'Help return it to the owner',
    icon: FiCheckCircle,
    activeCard: 'border-emerald-400 bg-emerald-50/60',
    activeIcon: 'bg-emerald-100 text-emerald-600',
  },
];

const inputClass =
  'w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-primary focus:bg-white';

const Label = ({ children, hint }) => (
  <label className="mb-1.5 flex items-center justify-between text-sm font-medium text-gray-700">
    {children}
    {hint && <span className="text-xs font-normal text-gray-400">{hint}</span>}
  </label>
);

const SelectField = ({ children, ...props }) => (
  <div className="relative">
    <select {...props} className={`${inputClass} appearance-none pr-10`}>
      {children}
    </select>
    <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
  </div>
);

const CreateItem = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const submittingRef = useRef(false); // blocks double submit
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [formData, setFormData] = useState({
    type: 'lost',
    title: '',
    description: '',
    category: 'other',
    city: '',
    area: '',
    date: new Date().toISOString().split('T')[0],
  });

  if (!user) return <Navigate to="/login" replace />;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    e.target.value = ''; // lets you pick the same file again

    if (files.some((file) => file.size > MAX_SIZE)) {
      toast.error('Each image must be under 5MB');
      return;
    }
    if (images.length + files.length > MAX_IMAGES) {
      toast.error('Maximum 3 images allowed!');
      return;
    }

    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))]);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previews[index]);
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submittingRef.current) return; // already posting, ignore extra clicks
    submittingRef.current = true;
    setLoading(true);

    try {
      const data = new FormData();
      data.append('type', formData.type);
      data.append('title', formData.title.trim());
      data.append('description', formData.description.trim());
      data.append('category', formData.category);
      data.append('location', JSON.stringify({
        city: formData.city,
        area: formData.area.trim(),
      }));
      data.append('date', formData.date);
      images.forEach((image) => data.append('images', image));

      await API.post('/items', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Item posted successfully!');
      navigate('/items');
    } catch (error) {
      submittingRef.current = false; // allow retry only if it failed
      toast.error(error.response?.data?.message || 'Failed to post item');
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">

      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary">Post an Item</h1>
        <p className="mt-2 text-gray-500">Report something you lost or found</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
      >

        {/* Lost / Found */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {typeOptions.map((opt) => {
            const active = formData.type === opt.value;
            const Icon = opt.icon;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFormData({ ...formData, type: opt.value })}
                className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition ${
                  active ? opt.activeCard : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition ${
                    active ? opt.activeIcon : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <Icon size={18} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-gray-900">{opt.title}</span>
                  <span className="block text-xs text-gray-500">{opt.hint}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Title */}
        <div>
          <Label>Title</Label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Black leather wallet"
            maxLength={60}
            className={inputClass}
            required
          />
        </div>

        {/* Description */}
        <div>
          <Label hint={`${formData.description.length}/500`}>Description</Label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Colour, brand, any marks or stickers, what was inside..."
            rows={4}
            maxLength={500}
            className={`${inputClass} resize-none`}
            required
          />
        </div>

        {/* Category & Date */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>Category</Label>
            <SelectField name="category" value={formData.category} onChange={handleChange}>
              {categories.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </SelectField>
          </div>
          <div>
            <Label>Date {formData.type === 'lost' ? 'lost' : 'found'}</Label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className={inputClass}
              required
            />
          </div>
        </div>

        {/* City & Area */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>City</Label>
            <SelectField name="city" value={formData.city} onChange={handleChange} required>
              <option value="">Select city</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </SelectField>
          </div>
          <div>
            <Label hint="Optional">Area</Label>
            <input
              type="text"
              name="area"
              value={formData.area}
              onChange={handleChange}
              placeholder="e.g. Fort, Pettah"
              className={inputClass}
            />
          </div>
        </div>

        {/* Photos */}
        <div>
          <Label hint={`${images.length}/${MAX_IMAGES}`}>Photos</Label>

          {images.length < MAX_IMAGES && (
            <label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-8 text-center transition hover:border-primary hover:bg-white">
              <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                <FiUpload size={20} className="text-gray-500" />
              </span>
              <span className="text-sm font-medium text-gray-700">Click to upload photos</span>
              <span className="mt-1 text-xs text-gray-400">JPG, PNG or WEBP · up to 5MB each</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleImages}
                className="hidden"
              />
            </label>
          )}

          {previews.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-3">
              {previews.map((preview, index) => (
                <div key={preview} className="relative aspect-square overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  {index === 0 && (
                    <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white">
                      Cover
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-sm transition hover:bg-white hover:text-red-500"
                    aria-label="Remove photo"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Posting...
            </>
          ) : (
            <>
              <FiSend /> Post Item
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateItem;