const express = require('express');
const router = express.Router();
const {
  createLoad,
  getAllLoads,
  getShipperLoads,
  updateLoadStatus,
  deleteLoad,
  acceptLoad,
  startTrip,
  completeLoad,
} = require('../controllers/loadController');

// Import our middleware
const { protect, authorize } = require('../middleware/authMiddleware');

// Route: GET /api/loads
router.get('/', protect, getAllLoads);

// Route: POST /api/loads
router.post('/', protect, authorize('shipper', 'admin'), createLoad);

// Route: GET /api/loads/myloads
router.get('/myloads', protect, authorize('shipper'), getShipperLoads);

// Route: PUT /api/loads/:id/status
router.put('/:id/status', protect, updateLoadStatus);

// Route: PUT /api/loads/:id/accept (Driver accepts a load)
router.put('/:id/accept', protect, authorize('driver'), acceptLoad);

// Route: PUT /api/loads/:id/start (Driver starts the trip)
router.put('/:id/start', protect, authorize('driver'), startTrip);

// Route: PUT /api/loads/:id/complete (Driver marks as delivered)
router.put('/:id/complete', protect, authorize('driver'), completeLoad);

// Route: DELETE /api/loads/:id
router.delete('/:id', protect, authorize('shipper', 'admin'), deleteLoad);

module.exports = router;

