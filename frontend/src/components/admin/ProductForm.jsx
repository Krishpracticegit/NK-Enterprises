import React, { useState, useEffect } from 'react';
import API from '../../services/api.js';
import { X, Upload, Trash2, RefreshCw } from 'lucide-react';

export default function ProductForm({ productToEdit, onClose, onRefresh }) {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: productToEdit?.name || '',
    description: productToEdit?.description || '',
    price: productToEdit?.price || '',
    discountPrice: productToEdit?.discountPrice || '',
    category: productToEdit?.category?._id || productToEdit?.category || '',
    ageGroup: productToEdit?.ageGroup || '0-6m',
    brand: productToEdit?.brand || 'NK Enterprises',
    stock: productToEdit?.stock || 10,
    isFeatured: productToEdit?.isFeatured || false,
    images: productToEdit?.images || []
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    API.get('/categories')
      .then((res) => setCategories(res.data || []))
      .catch((err) => console.error('Failed to load categories for form', err));
  }, []);

  // Multi-image upload handler posting to POST /api/upload
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImage(true);
    setErrorMsg('');

    try {
      const newUploadedUrls = [];
      for (const file of files) {
        const uploadData = new FormData();
        uploadData.append('image', file);

        const res = await API.post('/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (res.data.url) {
          newUploadedUrls.push(res.data.url);
        }
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newUploadedUrls]
      }));

      setUploadingImage(false);
    } catch (err) {
      console.error('Image upload failed:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to upload image to Cloudinary.');
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      if (productToEdit?._id) {
        await API.put(`/products/${productToEdit._id}`, formData);
      } else {
        await API.post('/products', formData);
      }

      setSubmitting(false);
      onRefresh();
      onClose();
    } catch (err) {
      console.error('Product save error:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to save product.');
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-xl font-bold font-heading text-slate-900">
            {productToEdit ? 'Edit Product' : 'Add New Baby Product'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-2xl text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-bold uppercase text-slate-500 mb-1">Product Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2D6A75]"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-500 mb-1">Category</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2D6A75]"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-500 mb-1">Age Group</label>
              <select
                value={formData.ageGroup}
                onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2D6A75]"
              >
                <option value="0-6m">0 - 6 Months</option>
                <option value="6-12m">6 - 12 Months</option>
                <option value="1-3y">1 - 3 Years</option>
                <option value="3y+">3+ Years</option>
              </select>
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-500 mb-1">Price ($)</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2D6A75]"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-500 mb-1">Discount Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.discountPrice}
                onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                placeholder="Optional"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2D6A75]"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-500 mb-1">Stock Units</label>
              <input
                type="number"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2D6A75]"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-500 mb-1">Brand</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2D6A75]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold uppercase text-slate-500 mb-1">Description</label>
              <textarea
                rows="3"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#2D6A75]"
              ></textarea>
            </div>
          </div>

          {/* Cloudinary Image Uploader */}
          <div className="space-y-3 pt-2">
            <label className="block font-bold uppercase text-slate-500">Product Images (Cloudinary)</label>

            <div className="flex flex-wrap gap-3 items-center">
              {formData.images.map((imgUrl, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 group">
                  <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute inset-0 bg-slate-900/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              <label className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 hover:border-[#2D6A75] bg-slate-50 flex flex-col items-center justify-center cursor-pointer text-slate-400 hover:text-[#2D6A75] transition-colors">
                <Upload size={20} />
                <span className="text-[10px] font-bold mt-1">Upload</span>
                <input type="file" multiple accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            {uploadingImage && (
              <p className="text-xs text-teal-700 font-bold flex items-center gap-1">
                <RefreshCw size={14} className="animate-spin" /> Uploading image to Cloudinary...
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isFeatured"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="accent-[#2D6A75]"
            />
            <label htmlFor="isFeatured" className="font-bold text-slate-800 text-xs cursor-pointer">
              Feature on Storefront Homepage
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || uploadingImage}
              className="bg-[#2D6A75] hover:bg-[#1F4D55] text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-md disabled:opacity-50"
            >
              {submitting ? 'Saving Product...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
