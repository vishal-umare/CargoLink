const jwt = require('jsonwebtoken');

// Generate a JSON Web Token (JWT)
// It takes the user's ID as a payload and signs it with our secret key
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token will expire in 30 days
  });
};

module.exports = generateToken;
