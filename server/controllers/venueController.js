// Venue controller

const Venue = require('../models/Venue');

// Get all venues (optionally filter by approval or owner)
const getVenues = async (req, res) => {
  try {
    let filter = {};
    
    // Filter by approval status
    if (req.query.approved === 'true') {
      filter.isApproved = true;
    } else if (req.query.approved === 'false') {
      filter.isApproved = false;
    }
    
    // Filter by owner (for owner dashboard) - requires authentication
    if (req.query.owner === 'me') {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required to view your venues' });
      }
      filter.owner = req.user._id;
    }
    
    const venues = await Venue.find(filter).populate('owner', 'name email');
    res.status(200).json(venues);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch venues', error: error.message });
  }
};

// Get venue by ID
const getVenueById = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id).populate('owner', 'name email');
    if (!venue) return res.status(404).json({ message: 'Venue not found' });
    res.status(200).json(venue);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch venue', error: error.message });
  }
};

// Create a new venue (owner or admin)
const createVenue = async (req, res) => {
  try {
    const { name, location, sport, description, slots } = req.body;
    if (!name || !location || !sport) {
      return res.status(400).json({ message: 'Name, location, and sport are required.' });
    }
    
    // Handle uploaded images
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      // Construct URLs for uploaded images
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      imageUrls = req.files.map(file => `${baseUrl}/uploads/${file.filename}`);
    } else if (req.body.images) {
      // Fallback to JSON images if provided
      imageUrls = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }
    
    // Auto-approve in development mode, or if admin
    const shouldAutoApprove = req.user.role === 'admin' || 
      (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV);
    
    const venue = await Venue.create({
      name,
      location,
      images: imageUrls,
      sport,
      description,
      slots: slots ? (typeof slots === 'string' ? JSON.parse(slots) : slots) : [],
      owner: req.user._id,
      isApproved: shouldAutoApprove,
    });
    
    if (shouldAutoApprove && req.user.role !== 'admin') {
      console.log(`✅ DEV MODE: Auto-approved venue "${venue.name}" for owner`);
    }
    res.status(201).json(venue);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create venue', error: error.message });
  }
};

// Update venue (owner or admin)
const updateVenue = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) return res.status(404).json({ message: 'Venue not found' });
    // Only owner or admin can update
    if (venue.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this venue' });
    }
    const updates = req.body;
    Object.assign(venue, updates);
    await venue.save();
    res.status(200).json(venue);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update venue', error: error.message });
  }
};

// Delete venue (owner or admin)
const deleteVenue = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) return res.status(404).json({ message: 'Venue not found' });
    // Only owner or admin can delete
    if (venue.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this venue' });
    }
    await Venue.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Venue deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete venue', error: error.message });
  }
};

// Add slot to venue
const addSlot = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) return res.status(404).json({ message: 'Venue not found' });
    // Only owner or admin can add slots
    if (venue.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to add slots to this venue' });
    }
    const { startTime, endTime, price } = req.body;
    if (!startTime || !endTime || !price) {
      return res.status(400).json({ message: 'Start time, end time, and price are required' });
    }
    venue.slots.push({ startTime, endTime, price: Number(price) });
    await venue.save();
    res.status(200).json(venue);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add slot', error: error.message });
  }
};

// Approve venue (owner can approve their own, admin can approve any)
const approveVenue = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) return res.status(404).json({ message: 'Venue not found' });
    // Only owner or admin can approve
    if (venue.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to approve this venue' });
    }
    venue.isApproved = true;
    await venue.save();
    res.status(200).json(venue);
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve venue', error: error.message });
  }
};

// Reject venue (admin only)
const rejectVenue = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) return res.status(404).json({ message: 'Venue not found' });
    // Only admin can reject
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can reject venues' });
    }
    venue.isApproved = false;
    await venue.save();
    res.status(200).json(venue);
  } catch (error) {
    res.status(500).json({ message: 'Failed to reject venue', error: error.message });
  }
};

// Delete slot from venue
const deleteSlot = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) return res.status(404).json({ message: 'Venue not found' });
    // Only owner or admin can delete slots
    if (venue.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete slots from this venue' });
    }
    const slotId = req.params.slotId;
    venue.slots = venue.slots.filter(slot => slot._id.toString() !== slotId);
    await venue.save();
    res.status(200).json(venue);
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete slot', error: error.message });
  }
};

module.exports = {
  getVenues,
  getVenueById,
  createVenue,
  updateVenue,
  deleteVenue,
  approveVenue,
  rejectVenue,
  addSlot,
  deleteSlot,
};
