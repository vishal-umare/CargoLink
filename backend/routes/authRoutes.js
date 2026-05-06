const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Route: POST /api/auth/register
// Desc: Register a new user
router.post('/register', registerUser);

// Route: POST /api/auth/login
// Desc: Authenticate a user and get token
router.post('/login', loginUser);

module.exports = router;
