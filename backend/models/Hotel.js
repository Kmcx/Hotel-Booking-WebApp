const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: String,
  country: String,
  coordinates: { lat: Number, lng: Number },
  images: [String],
  amenities: [String],
  rating: { type: Number, default: 0 },
  pricePerNight: Number,
  discountedPrice: Number,
  isMemberOnly: { type: Boolean, default: false },
  available: {
    type: [String], // ISO date string list (e.g. '2024-07-06')
    default: [],
  },
  maxGuests: {
    type: Number,
    required: true,
    default: 2,
  },
  address: {
  type: String,
  required: false,
  default: '',
},
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Hotel', hotelSchema);
