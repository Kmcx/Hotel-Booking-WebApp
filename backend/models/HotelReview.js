const mongoose = require('mongoose')

const hotelReviewSchema = new mongoose.Schema({
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  stars: {
    type: Number,
    min: 1,
    max: 10,
    required: true,
  },
  serviceRatings: {
    cleanliness: { type: Number, min: 1, max: 10 },
    location: { type: Number, min: 1, max: 10 },
    staff: { type: Number, min: 1, max: 10 },
    features: { type: Number, min: 1, max: 10 } 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
})

module.exports = mongoose.model('HotelReview', hotelReviewSchema)
