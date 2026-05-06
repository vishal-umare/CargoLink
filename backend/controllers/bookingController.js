const Booking = require('../models/Booking');
const Load = require('../models/Load');

// @desc    Driver requests to book a load
// @route   POST /api/bookings
// @access  Private (Drivers only)
const requestLoad = async (req, res) => {
  try {
    const { loadId } = req.body;

    // 1. Ensure the load actually exists
    const load = await Load.findById(loadId);
    if (!load) {
      return res.status(404).json({ message: 'Load not found' });
    }

    // 2. Prevent duplicate requests from the same driver for the same load
    const existingBooking = await Booking.findOne({
      loadId,
      driverId: req.user._id,
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'You have already requested this load' });
    }

    // 3. Create the booking request
    const booking = await Booking.create({
      loadId,
      driverId: req.user._id,
      status: 'requested',
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating booking request' });
  }
};

// @desc    Update a booking status (Shipper accepts or rejects)
// @route   PUT /api/bookings/:id/status
// @access  Private (Shippers only)
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body; // should be 'accepted' or 'rejected'

    // Find the booking
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update the booking status
    booking.status = status;
    await booking.save();

    // If the shipper ACCEPTED the driver, we should also update the Load's status
    if (status === 'accepted') {
      await Load.findByIdAndUpdate(booking.loadId, { status: 'assigned' });
    }

    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating booking status' });
  }
};

// @desc    Get all booking requests for a specific driver
// @route   GET /api/bookings/my-bookings
// @access  Private (Drivers only)
const getDriverBookings = async (req, res) => {
  try {
    // Find all bookings where the driver ID matches the logged-in user
    // .populate('loadId') brings in all the Load data so the driver sees what they booked
    const bookings = await Booking.find({ driverId: req.user._id }).populate('loadId');
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching bookings' });
  }
};

// @desc    Get all booking requests for a specific load (so shipper can see who applied)
// @route   GET /api/bookings/load/:loadId
// @access  Private (Shippers only)
const getLoadBookings = async (req, res) => {
  try {
    // Find all bookings for a specific load
    // .populate('driverId') brings in the driver's name and email so the shipper knows who they are
    const bookings = await Booking.find({ loadId: req.params.loadId }).populate('driverId', 'name email vehicleDetails');
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching load bookings' });
  }
};

module.exports = {
  requestLoad,
  updateBookingStatus,
  getDriverBookings,
  getLoadBookings,
};
