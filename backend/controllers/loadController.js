const Load = require('../models/Load');

// Valid status transitions map
const VALID_TRANSITIONS = {
  open: ['assigned', 'cancelled'],
  assigned: ['in_transit', 'cancelled', 'open'], // open = unassign
  in_transit: ['delivered'],
  delivered: [], // terminal state
  cancelled: ['open'], // can reopen
};

// @desc    Create a new load
// @route   POST /api/loads
// @access  Private (Shippers & Admins only)
const createLoad = async (req, res) => {
  try {
    const { pickup_city, drop_city, weight, volume, vehicle_type, pickup_date, pickup_time, description, price, contact_phone } = req.body;

    if (!pickup_city || !drop_city || !weight) {
      return res.status(400).json({ message: 'Please provide pickup_city, drop_city, and weight' });
    }

    const load = await Load.create({
      shipper_id: req.user._id,
      pickup_city,
      drop_city,
      weight,
      volume,
      vehicle_type,
      pickup_date,
      pickup_time,
      description,
      price,
      contact_phone,
      status: 'open',
    });

    console.log(`[LOAD] Created ${load._id} by shipper ${req.user._id}`);
    res.status(201).json(load);
  } catch (error) {
    console.error('[LOAD] Error creating:', error.message);
    res.status(500).json({ message: error.message || 'Server error creating load' });
  }
};

// @desc    Get all loads (available for drivers to see)
// @route   GET /api/loads
// @access  Private (Drivers, Shippers, Admins)
const getAllLoads = async (req, res) => {
  try {
    const loads = await Load.find().populate('shipper_id', 'name email').sort({ createdAt: -1 });
    res.json(loads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching loads' });
  }
};

// @desc    Get loads created by the currently logged-in shipper
// @route   GET /api/loads/myloads
// @access  Private (Shippers only)
const getShipperLoads = async (req, res) => {
  try {
    const loads = await Load.find({ shipper_id: req.user._id }).sort({ createdAt: -1 });
    res.json(loads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching your loads' });
  }
};

// @desc    Update load status (with strict transition validation)
// @route   PUT /api/loads/:id/status
// @access  Private
const updateLoadStatus = async (req, res) => {
  try {
    const { status, assigned_driver_id } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Please provide a status' });
    }

    const load = await Load.findById(req.params.id);
    if (!load) {
      return res.status(404).json({ message: 'Load not found' });
    }

    // Validate status transition
    const allowed = VALID_TRANSITIONS[load.status] || [];
    if (!allowed.includes(status)) {
      return res.status(400).json({ 
        message: `Cannot transition from '${load.status}' to '${status}'. Allowed: ${allowed.join(', ') || 'none'}` 
      });
    }

    load.status = status;
    if (assigned_driver_id) {
      load.assigned_driver_id = assigned_driver_id;
    }
    await load.save();

    console.log(`[LOAD] Status updated: ${load._id} → ${status}`);
    res.json(load);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a load
// @route   DELETE /api/loads/:id
// @access  Private (Shippers & Admins only)
const deleteLoad = async (req, res) => {
  try {
    const load = await Load.findById(req.params.id);

    if (!load) {
      return res.status(404).json({ message: 'Load not found' });
    }

    // Ensure the user deleting the load is the one who created it (or admin)
    if (load.shipper_id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this load' });
    }

    // Prevent deleting loads that are in transit
    if (load.status === 'in_transit') {
      return res.status(400).json({ message: 'Cannot delete a load that is in transit' });
    }

    await load.deleteOne();
    console.log(`[LOAD] Deleted ${load._id} by ${req.user._id}`);
    res.json({ message: 'Load removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Driver accepts a load (RACE-SAFE with findOneAndUpdate)
// @route   PUT /api/loads/:id/accept
// @access  Private (Drivers only)
const acceptLoad = async (req, res) => {
  try {
    // Atomic operation: only update if status is still 'open'
    // This prevents race conditions where two drivers accept simultaneously
    const load = await Load.findOneAndUpdate(
      { _id: req.params.id, status: 'open' },
      { status: 'assigned', assigned_driver_id: req.user._id },
      { new: true }
    );

    if (!load) {
      // Check if the load exists at all
      const exists = await Load.findById(req.params.id);
      if (!exists) {
        return res.status(404).json({ message: 'Load not found' });
      }
      return res.status(400).json({ message: 'Load is no longer available — it may have been accepted by another driver' });
    }

    console.log(`[LOAD] Accepted: ${load._id} by driver ${req.user._id}`);
    res.json(load);
  } catch (error) {
    console.error('[LOAD] Error accepting:', error.message);
    res.status(500).json({ message: 'Server error accepting load' });
  }
};

// @desc    Driver starts the trip (assigned → in_transit)
// @route   PUT /api/loads/:id/start
// @access  Private (Drivers only)
const startTrip = async (req, res) => {
  try {
    const load = await Load.findById(req.params.id);

    if (!load) {
      return res.status(404).json({ message: 'Load not found' });
    }

    // Only the assigned driver can start the trip
    if (!load.assigned_driver_id || load.assigned_driver_id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized — you are not the assigned driver' });
    }

    if (load.status !== 'assigned') {
      return res.status(400).json({ message: `Cannot start trip — load is currently '${load.status}', must be 'assigned'` });
    }

    load.status = 'in_transit';
    await load.save();

    console.log(`[LOAD] Trip started: ${load._id} by driver ${req.user._id}`);
    res.json(load);
  } catch (error) {
    console.error('[LOAD] Error starting trip:', error.message);
    res.status(500).json({ message: 'Server error starting trip' });
  }
};

// @desc    Driver marks load as delivered (in_transit → delivered)
// @route   PUT /api/loads/:id/complete
// @access  Private (Drivers only)
const completeLoad = async (req, res) => {
  try {
    const load = await Load.findById(req.params.id);

    if (!load) {
      return res.status(404).json({ message: 'Load not found' });
    }

    // Ensure only the assigned driver can complete it
    if (!load.assigned_driver_id || load.assigned_driver_id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to complete this load' });
    }

    // Must be in_transit or assigned to complete
    if (!['in_transit', 'assigned'].includes(load.status)) {
      return res.status(400).json({ message: `Cannot complete — load is currently '${load.status}'` });
    }

    load.status = 'delivered';
    await load.save();

    console.log(`[LOAD] Completed: ${load._id} by driver ${req.user._id}`);
    res.json(load);
  } catch (error) {
    console.error('[LOAD] Error completing:', error.message);
    res.status(500).json({ message: 'Server error completing load' });
  }
};

module.exports = {
  createLoad,
  getAllLoads,
  getShipperLoads,
  updateLoadStatus,
  deleteLoad,
  acceptLoad,
  startTrip,
  completeLoad,
};

