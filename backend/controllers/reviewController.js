const HotelReview = require('../models/HotelReview');

// POST /api/reviews
exports.createReview = async (req, res) => {
  try {
    const { hotel, comment, stars, serviceRatings } = req.body;
    const user = req.user.id;

    const review = new HotelReview({
      hotel,
      user,
      comment,
      stars,
      serviceRatings
    });

    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create review' });
  }
};

// GET /api/reviews/:hotelId
exports.getReviewsByHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;

    const reviews = await HotelReview.find({ hotel: hotelId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};


// GET /api/reviews/summary/:hotelId
exports.getReviewSummary = async (req, res) => {
  try {
    const { hotelId } = req.params;

    const reviews = await HotelReview.find({ hotel: hotelId });

    const totalReviews = reviews.length;

    if (totalReviews === 0) {
      return res.json({
        totalReviews: 0,
        averages: {
          cleanliness: 0,
          location: 0,
          staff: 0,
        }
      });
    }

    const sum = {
      cleanliness: 0,
      location: 0,
      staff: 0,
    };

    reviews.forEach(review => {
      sum.cleanliness += review.serviceRatings.cleanliness || 0;
      sum.location += review.serviceRatings.location || 0;
      sum.staff += review.serviceRatings.staff || 0;
    });

    const averages = {
      cleanliness: (sum.cleanliness / totalReviews).toFixed(1),
      location: (sum.location / totalReviews).toFixed(1),
      staff: (sum.staff / totalReviews).toFixed(1),
    };

    res.json({ totalReviews, averages });
  } catch (err) {
    res.status(500).json({ error: 'Failed to summarize reviews' });
  }
};
