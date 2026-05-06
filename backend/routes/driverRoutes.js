const express = require('express');
const router = express.Router();
const {
  requestLoad,
  updateBookingStatus,
  getDriverBookings,
  getLoadBookings,
} = require('../controllers/bookingController');

// Import middleware
const { protect, authorize } = require('../middleware/authMiddleware');

// Route: POST /api/driver/bookings
// Desc: Driver requests a load
// Access: Only Drivers
router.post('/bookings', protect, authorize('driver'), requestLoad);

// Route: GET /api/driver/bookings/my-bookings
// Desc: Driver views all loads they have requested
// Access: Only Drivers
router.get('/bookings/my-bookings', protect, authorize('driver'), getDriverBookings);

// Route: GET /api/driver/bookings/load/:loadId
// Desc: Shipper views all driver requests for a specific load
// Access: Only Shippers
router.get('/bookings/load/:loadId', protect, authorize('shipper', 'admin'), getLoadBookings);

// Route: PUT /api/driver/bookings/:id/status
// Desc: Shipper accepts or rejects a driver's request
// Access: Only Shippers
router.put('/bookings/:id/status', protect, authorize('shipper', 'admin'), updateBookingStatus);

module.exports = router;
