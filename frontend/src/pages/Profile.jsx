import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { User, Mail, Plus, MapPin, CheckCircle2 } from 'lucide-react';

export default function Profile() {
  const { user, updateProfile, loading } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [newAddress, setNewAddress] = useState({ label: 'Home', line1: '', city: '', state: '', pincode: '', phone: '' });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setStatusMessage('');
    const updatePayload = { name, email };
    if (password) updatePayload.password = password;
    updatePayload.addresses = addresses;

    const res = await updateProfile(updatePayload);
    if (res.success) {
      setStatusMessage('Profile updated successfully!');
    } else {
      setStatusMessage(res.message);
    }
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddress.line1 || !newAddress.city || !newAddress.pincode || !newAddress.phone) return;
    const updated = [...addresses, newAddress];
    setAddresses(updated);
    setNewAddress({ label: 'Home', line1: '', city: '', state: '', pincode: '', phone: '' });
    setShowAddressForm(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
        <div className="w-16 h-16 rounded-full bg-teal-100 text-[#2D6A75] text-2xl font-bold flex items-center justify-center">
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div>
          <h1 className="text-2xl font-extrabold font-heading text-slate-900">{user?.name}</h1>
          <p className="text-slate-500 text-sm">{user?.email} • <span className="capitalize font-semibold text-teal-700">{user?.role}</span> Account</p>
        </div>
      </div>

      {statusMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 size={18} className="text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Account Settings Form */}
      <form onSubmit={handleProfileUpdate} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 space-y-6">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Personal Details</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2D6A75]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2D6A75]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">New Password (Optional)</label>
            <input
              type="password"
              placeholder="Leave blank to keep unchanged"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2D6A75]"
            />
          </div>
        </div>

        {/* Saved Address Book */}
        <div className="pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">Saved Shipping Addresses</h3>
            <button
              type="button"
              onClick={() => setShowAddressForm(!showAddressForm)}
              className="text-xs font-bold text-[#2D6A75] bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors"
            >
              <Plus size={14} /> Add Address
            </button>
          </div>

          {addresses.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No saved addresses yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map((addr, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1">
                  <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 text-[10px] uppercase">
                    {addr.label}
                  </span>
                  <p className="font-semibold text-slate-800 pt-1">{addr.line1}</p>
                  <p className="text-slate-500">{addr.city}, {addr.state} - {addr.pincode}</p>
                  <p className="text-slate-500">Phone: {addr.phone}</p>
                </div>
              ))}
            </div>
          )}

          {showAddressForm && (
            <div className="mt-4 p-4 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-3">
              <h4 className="text-xs font-bold uppercase text-amber-900">New Address</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <input
                  type="text"
                  placeholder="Address Line 1"
                  value={newAddress.line1}
                  onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })}
                  className="bg-white border border-amber-200 rounded-xl px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  className="bg-white border border-amber-200 rounded-xl px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  className="bg-white border border-amber-200 rounded-xl px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Pincode"
                  value={newAddress.pincode}
                  onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                  className="bg-white border border-amber-200 rounded-xl px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  className="bg-white border border-amber-200 rounded-xl px-3 py-2 sm:col-span-2"
                />
              </div>
              <button
                type="button"
                onClick={handleAddAddress}
                className="bg-[#2D6A75] text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                Save New Address
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#2D6A75] hover:bg-[#1F4D55] text-white px-6 py-3 rounded-full font-bold text-sm shadow-md"
        >
          {loading ? 'Saving Changes...' : 'Save Profile Changes'}
        </button>
      </form>
    </div>
  );
}
