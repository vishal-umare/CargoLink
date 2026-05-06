const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    // A reference to the Load that is being booked
    loadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Load',
      required: [true, 'Please provide a load ID'],
    },
    // A reference to the Driver who accepted/booked the load
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a driver ID'],
    },
    // The status of the booking (e.g., requested, accepted by shipper, completed)
    status: {
      type: String,
      enum: ['requested', 'accepted', 'rejected', 'completed'],
      default: 'requested',
    },
  },
  {
    // Automatically adds 'createdAt' and 'updatedAt' fields
    timestamps: true,
  }
);

// Export the model so we can use it in other files
module.exports = mongoose.model('Booking', bookingSchema);
