import React, { useEffect, useState } from 'react';
import API from '../../services/api.js';
import { Plus, Edit, Trash2, RefreshCw, FolderTree, X } from 'lucide-react';

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchCategories = () => {
    setLoading(true);
    API.get('/categories')
      .then((res) => {
        setCategories(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch categories:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openFormModal = (cat = null) => {
    setErrorMsg('');
    if (cat) {
      setEditingCategory(cat);
      setName(cat.name);
      setDescription(cat.description || '');
      setImage(cat.image || '');
    } else {
      setEditingCategory(null);
      setName('');
      setDescription('');
      setImage('');
    }
    setShowModal(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      if (editingCategory) {
        await API.put(`/categories/${editingCategory._id}`, { name, description, image });
      } else {
        await API.post('/categories', { name, description, image });
      }

      setShowModal(false);
      fetchCategories();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to save category');
    }
  };

  const handleDeleteCategory = async (id, catName) => {
    if (window.confirm(`Are you sure you want to delete category "${catName}"?`)) {
      try {
        await API.delete(`/categories/${id}`);
        fetchCategories();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete category');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-heading text-slate-900">Manage Categories</h2>
          <p className="text-slate-500 text-xs mt-0.5">Organize store product categories</p>
        </div>
        <button
          onClick={() => openFormModal()}
          className="bg-[#2D6A75] hover:bg-[#1F4D55] text-white px-4 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 shadow-sm"
        >
          <Plus size={16} />
          <span>Add Category</span>
        </button>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center text-slate-400 gap-2">
          <RefreshCw className="animate-spin" size={24} />
          <span>Loading categories...</span>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 font-bold uppercase text-slate-500">
                <tr>
                  <th className="py-3.5 px-4">Category Name</th>
                  <th className="py-3.5 px-4">Slug</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#2D6A75] font-bold flex items-center justify-center">
                        <FolderTree size={16} />
                      </div>
                      <span>{cat.name}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">{cat.slug}</td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{cat.description || '—'}</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => openFormModal(cat)}
                        className="p-2 rounded-xl text-slate-500 hover:text-[#2D6A75] hover:bg-slate-100"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat._id, cat.name)}
                        className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold font-heading text-slate-900">
                {editingCategory ? 'Edit Category' : 'New Category'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-full text-slate-400 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSaveCategory} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold uppercase text-slate-500 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#2D6A75]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-500 mb-1">Description</label>
                <textarea
                  rows="2"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#2D6A75]"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-full font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#2D6A75] hover:bg-[#1F4D55] text-white px-5 py-2 rounded-full font-bold text-xs shadow-sm"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
