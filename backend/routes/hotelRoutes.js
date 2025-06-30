const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');
const verifyToken = require('../middlewares/authMiddleware');

router.get('/', hotelController.getAllHotels);
router.post('/', hotelController.createHotel);
router.get('/member', verifyToken, hotelController.getHotelsWithMemberPrice);
router.put('/:id', hotelController.updateHotel);
router.get('/:id', hotelController.getHotelById); 


module.exports = router;
