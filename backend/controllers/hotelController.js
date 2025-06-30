const Hotel = require('../models/Hotel');

// GET /api/hotels
// GET /api/hotels
exports.getAllHotels = async (req, res) => {
  try {
    const { city, minPrice, maxPrice, sortBy, start, end, guests } = req.query;

    let filter = {};

    if (city) {
  filter.city = { $regex: new RegExp(`^${city}$`, 'i') }; // no case sensitive
}


    if (minPrice || maxPrice) {
      filter.pricePerNight = {};
      if (minPrice) filter.pricePerNight.$gte = parseFloat(minPrice);
      if (maxPrice) filter.pricePerNight.$lte = parseFloat(maxPrice);
    }

    if (guests) {
      const guestCount = parseInt(guests);
      if (!isNaN(guestCount)) {
        filter.maxGuests = { $gte: guestCount };
      }
    }

    let sort = {};
    if (sortBy === 'rating') sort.rating = -1;
    if (sortBy === 'price') sort.pricePerNight = 1;

    let hotels = await Hotel.find(filter).sort(sort);

    
    if (start && end) {
      const startDate = new Date(start).toISOString().split('T')[0];
      const endDate = new Date(end).toISOString().split('T')[0];

      hotels = hotels.filter(hotel => {
        const availability = hotel.available || [];
        const current = new Date(startDate);
        const endD = new Date(endDate);

        while (current <= endD) {
          const day = current.toISOString().split('T')[0];
          if (!availability.includes(day)) return false;
          current.setDate(current.getDate() + 1);
        }

        return true;
      });
    }

    res.json(hotels);
  } catch (err) {
    console.error(err);
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
