import React, { useEffect, useState } from 'react';
import API from '../services/api.js';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Mail, 
  ShieldCheck, 
  Sparkles, 
  MessageCircle, 
  Navigation,
  RefreshCw
} from 'lucide-react';

export default function StoreInfo() {
  const [storeInfo, setStoreInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/store-info')
      .then((res) => {
        setStoreInfo(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load store info:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-400 gap-2">
        <RefreshCw className="animate-spin" size={24} />
        <span>Loading store location info...</span>
      </div>
    );
  }

  const defaultStore = {
    storeName: 'NK ENTERPRISES Flagship Store',
    address: '5/2 street-09 Geeta colony , Delhi-110031',
    phone: '+91 98765 43210',
    whatsapp: '+91 98765 43210',
    email: 'support@nkenterprises.com',
    openingHours: [
      { day: 'Monday - Friday', hours: '10:00 AM - 8:30 PM' },
      { day: 'Saturday', hours: '10:00 AM - 9:00 PM' },
      { day: 'Sunday', hours: '11:00 AM - 7:00 PM' }
    ],
    latitude: 28.6538,
    longitude: 77.2730
  };

  const store = storeInfo || defaultStore;
  const encodedAddress = encodeURIComponent(store.address || '5/2 street-09 Geeta colony , Delhi-110031');
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodedAddress}&z=16&output=embed`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#F6F0E6] via-[#FAF6EE] to-[#EBF5F7] rounded-3xl p-8 lg:p-12 border border-amber-100/80 shadow-sm text-center space-y-4">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#2D6A75]/10 text-[#2D6A75] uppercase tracking-wider">
          <Sparkles size={14} /> Visit Our Flagship Store
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900">
          {store.storeName}
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
          Experience our complete range of 100% organic baby clothing, ergonomic cribs, and dermatologist-tested skincare in person.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Contact & Hours Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-6">
          <h2 className="text-2xl font-bold font-heading text-slate-900 border-b border-slate-100 pb-4">
            Store Contact & Schedule
          </h2>

          <div className="space-y-5 text-sm text-slate-700">
            {/* Address */}
            <div className="flex items-start gap-3.5">
              <div className="p-3 bg-teal-50 text-[#2D6A75] rounded-2xl flex-shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">Store Address</h4>
                <p className="text-slate-600 mt-1 leading-relaxed">{store.address}</p>
              </div>
            </div>

            {/* Timings */}
            <div className="flex items-start gap-3.5">
              <div className="p-3 bg-amber-50 text-amber-700 rounded-2xl flex-shrink-0">
                <Clock size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">Opening Hours</h4>
                <div className="mt-1 space-y-1 text-slate-600 text-xs">
                  {store.openingHours?.map((oh, idx) => (
                    <p key={idx}><strong>{oh.day}:</strong> {oh.hours}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3.5">
              <div className="p-3 bg-rose-50 text-rose-700 rounded-2xl flex-shrink-0">
                <Mail size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">Email Support</h4>
                <p className="text-slate-600 mt-1">{store.email}</p>
              </div>
            </div>

            {/* Click to Call & Click to WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100">
              <a
                href={`tel:${store.phone}`}
                className="bg-[#2D6A75] hover:bg-[#1F4D55] text-white py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Phone size={16} />
                <span>Call Store: {store.phone}</span>
              </a>

              <a
                href={`https://wa.me/${store.whatsapp?.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <MessageCircle size={16} />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Embedded Google Map */}
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between px-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Navigation size={18} className="text-[#2D6A75]" /> Map Directions
            </h3>
            <a 
              href={`https://maps.google.com/?q=${encodedAddress}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-bold text-[#2D6A75] hover:underline"
            >
              Open Maps App
            </a>
          </div>

          <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
            <iframe
              title="NK Enterprises Store Google Map"
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
