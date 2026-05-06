const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    // The user's full name
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    // The user's email, must be unique so two people can't register with the same email
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    // The user's hashed password
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
    },
    // The role of the user, which restricts what they can do in the app
    role: {
      type: String,
      enum: ['driver', 'shipper', 'admin'],
      default: 'shipper',
    },
    // Optional field: details about the driver's vehicle. 
    // This is only relevant if the user's role is 'driver'.
    vehicleDetails: {
      type: String, // E.g., "Ford Transit Van" or "18-Wheeler"
      required: false,
    },
  },
  {
    // Automatically adds 'createdAt' and 'updatedAt' fields
    timestamps: true,
  }
);

// Export the model so we can use it in other files
module.exports = mongoose.model('User', userSchema);
