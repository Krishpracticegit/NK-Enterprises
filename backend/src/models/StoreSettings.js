import mongoose from 'mongoose';

const openingHourSchema = new mongoose.Schema({
  day: { type: String, required: true },
  hours: { type: String, required: true }
});

const storeSettingsSchema = new mongoose.Schema({
  storeName: { type: String, default: 'NK ENTERPRISES Flagship Store' },
  address: { type: String, default: '123 Baby Care Avenue, Commercial Hub, Mumbai, Maharashtra 400001' },
  phone: { type: String, default: '+91 98765 43210' },
  whatsapp: { type: String, default: '919876543210' },
  email: { type: String, default: 'support@nkenterprises.com' },
  openingHours: {
    type: [openingHourSchema],
    default: [
      { day: 'Monday - Saturday', hours: '10:00 AM - 8:30 PM' },
      { day: 'Sunday', hours: '11:00 AM - 6:00 PM' }
    ]
  },
  latitude: { type: Number, default: 19.0760 },
  longitude: { type: Number, default: 72.8777 },
  socialLinks: {
    instagram: { type: String, default: 'https://instagram.com' },
    facebook: { type: String, default: 'https://facebook.com' },
    twitter: { type: String, default: 'https://twitter.com' }
  }
}, { timestamps: true });

const StoreSettings = mongoose.model('StoreSettings', storeSettingsSchema);
export default StoreSettings;
