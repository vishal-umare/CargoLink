const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, vehicleDetails } = req.body;

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // 2. Hash the password before saving to database
    // We generate a "salt" which adds random data to the hash to make it extra secure
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create the new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      vehicleDetails: role === 'driver' ? vehicleDetails : undefined,
    });

    // 4. Send back a response with the generated JWT token
    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data received' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Authenticate a user & get token (Login)
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(`[LOGIN] Attempt for email: ${email}`);

    // Validate input
    if (!email || !password) {
      console.log('[LOGIN] Failed: Missing email or password');
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // 1. Check for user email in the database
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`[LOGIN] Failed: No user found with email ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 2. Verify password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log(`[LOGIN] Failed: Wrong password for ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 3. Send back user data and token
    console.log(`[LOGIN] Success for ${email} (role: ${user.role})`);
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('[LOGIN] Server error:', error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
