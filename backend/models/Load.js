const mongoose = require('mongoose');

const loadSchema = new mongoose.Schema(
  {
    // A reference to the User who created this load (must be a shipper)
    shipper_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a shipper ID'],
    },
    // Where the load needs to be picked up
    pickup_city: {
      type: String,
      required: [true, 'Please add a pickup location'],
    },
    // Where the load needs to be delivered
    drop_city: {
      type: String,
      required: [true, 'Please add a delivery location'],
    },
    // Weight of the load in kg or lbs
    weight: {
      type: Number,
      required: [true, 'Please add the weight of the load'],
    },
    volume: {
      type: Number,
      default: null,
    },
    vehicle_type: {
      type: String,
    },
    pickup_date: {
      type: String,
    },
    pickup_time: {
      type: String,
    },
    description: {
      type: String,
      default: null,
    },
    price: {
      type: Number,
      default: 0,
    },
    contact_phone: {
      type: String,
      default: null,
    },
    assigned_driver_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    // Current status of the load
    status: {
      type: String,
      enum: ['open', 'assigned', 'in_transit', 'delivered', 'cancelled'],
      default: 'open',
    },
  },
  {
    // Automatically adds 'createdAt' and 'updatedAt' fields
    timestamps: true,
  }
);

// Map frontend expectations to MongoDB fields seamlessly when converted to JSON
loadSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {   
    ret.id = ret._id;
    // Map Mongoose camelCase timestamps to snake_case (Supabase-compatible)
    if (ret.createdAt) {
      ret.created_at = ret.createdAt;
    }
    if (ret.updatedAt) {
      ret.updated_at = ret.updatedAt;
    }
  }
});

// Export the model so we can use it in other files
module.exports = mongoose.model('Load', loadSchema);
