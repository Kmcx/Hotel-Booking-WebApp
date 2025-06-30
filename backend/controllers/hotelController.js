const Hotel = require('../models/Hotel');

// GET /api/hotels
exports.getAllHotels = async (req, res) => {
  try {
    const { city, minPrice, maxPrice, sortBy } = req.query;

    let filter = {};
    if (city) filter.city = city;
    if (minPrice || maxPrice) {
      filter.pricePerNight = {};
      if (minPrice) filter.pricePerNight.$gte = parseFloat(minPrice);
      if (maxPrice) filter.pricePerNight.$lte = parseFloat(maxPrice);
    }

    let sort = {};
    if (sortBy === 'rating') sort.rating = -1; // en yüksek puanlıdan başla
    if (sortBy === 'price') sort.pricePerNight = 1; // fiyata göre artan sırala

    const hotels = await Hotel.find(filter).sort(sort);
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch hotels' });
  }
};


// POST /api/hotels
exports.createHotel = async (req, res) => {
  try {
    const hotel = new Hotel(req.body);
    const savedHotel = await hotel.save();
    res.status(201).json(savedHotel);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create hotel' });
  }
};


 exports.getHotelsWithMemberPrice = async (req, res) => {
  try {
    const user = req.user;

    const hotels = await Hotel.find();

    const response = hotels.map(hotel => {
      const price = user.isMember && hotel.discountedPrice
        ? hotel.discountedPrice
        : hotel.pricePerNight;

      return {
        _id: hotel._id,
        name: hotel.name,
        city: hotel.city,
        country: hotel.country,
        images: hotel.images,
        rating: hotel.rating,
        price, // gösterilecek fiyat
        isMemberOnly: hotel.isMemberOnly,
      };
    });

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch hotels with prices' });
  }
};

exports.updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedHotel = await Hotel.findByIdAndUpdate(id, req.body, {
      new: true,          // Güncellenmiş veriyi döner
      runValidators: true // Mongoose validation'ları uygular
    });

    if (!updatedHotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    res.json(updatedHotel);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update hotel' });
  }
};

// GET /api/hotels/:id
exports.getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ error: 'Hotel not found' });
    res.json(hotel);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch hotel' });
  }
};
