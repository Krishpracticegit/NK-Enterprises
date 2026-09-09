import React, { useEffect, useState } from 'react';
import API from '../../services/api.js';
import ProductForm from '../../components/admin/ProductForm.jsx';
import { Plus, Edit, Trash2, RefreshCw } from 'lucide-react';

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const fetchProducts = () => {
    setLoading(true);
    API.get('/products?limit=50')
      .then((res) => {
        setProducts(res.data.products || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load products:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete product "${name}"?`)) {
      try {
        await API.delete(`/products/${id}`);
        fetchProducts();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-heading text-slate-900">Manage Products</h2>
          <p className="text-slate-500 text-xs mt-0.5">Add, update, or remove products from catalog</p>
        </div>
        <button
          onClick={() => {
            setProductToEdit(null);
            setShowModal(true);
          }}
          className="bg-[#2D6A75] hover:bg-[#1F4D55] text-white px-4 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 shadow-sm"
        >
          <Plus size={16} />
          <span>Add Product</span>
        </button>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center text-slate-400 gap-2">
          <RefreshCw className="animate-spin" size={24} />
          <span>Loading products...</span>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 font-bold uppercase text-slate-500">
                <tr>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {products.map((prod) => (
                  <tr key={prod._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold flex items-center gap-3">
                      <img src={prod.images?.[0] || '/images/hero.jpg'} alt="" className="w-10 h-10 object-cover rounded-xl border" />
                      <div>
                        <p className="line-clamp-1">{prod.name}</p>
                        <span className="text-[10px] text-slate-400 font-normal">Age: {prod.ageGroup}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{prod.category?.name || 'Uncategorized'}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      ${prod.discountPrice > 0 ? prod.discountPrice : prod.price}
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${prod.stock <= 5 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-50 text-emerald-700'}`}>
                        {prod.stock} left
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setProductToEdit(prod);
                          setShowModal(true);
                        }}
                        className="p-2 rounded-xl text-slate-500 hover:text-[#2D6A75] hover:bg-slate-100"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod._id, prod.name)}
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
        <ProductForm
          productToEdit={productToEdit}
          onClose={() => setShowModal(false)}
          onRefresh={fetchProducts}
        />
      )}
    </div>
  );
}
