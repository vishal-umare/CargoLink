const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware 1: Verify JWT token and protect routes
const protect = async (req, res, next) => {
  let token;

  // Check if the request headers have an Authorization token starting with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (Format is "Bearer <token>", so we split by space and take the second part)
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user in the database using the ID inside the token
      // We use .select('-password') so we don't accidentally attach the password to req.user
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // Move on to the next piece of middleware or the actual route controller
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Middleware 2: Grant access to specific roles
// This takes a list of roles (e.g., 'admin', 'shipper') and returns a middleware function
const authorize = (...roles) => {
  return (req, res, next) => {
    // req.user is set by the "protect" middleware. If their role isn't in the list, block them.
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role '${req.user.role}' is not authorized to access this route` 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
