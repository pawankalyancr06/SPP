import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, Clock, Edit2, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import Modal from '../common/Modal';
import { approveVenue } from '../../api/venues';

const VenueManagement = ({ onVenueUpdate }) => {
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [slotForm, setSlotForm] = useState({
    startTime: '',
    endTime: '',
    price: '',
  });

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/venues?owner=me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch venues');
      const data = await response.json();
      setVenues(data);
    } catch (error) {
      console.error('Error fetching venues:', error);
    }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/venues/${selectedVenue._id}/slots`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          startTime: slotForm.startTime,
          endTime: slotForm.endTime,
          price: slotForm.price,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add slot');
      }
      setShowSlotModal(false);
      await fetchVenues();
      if (onVenueUpdate) onVenueUpdate();
      setSlotForm({ startTime: '', endTime: '', price: '' });
    } catch (error) {
      console.error('Error adding slot:', error);
      alert(error.message || 'Failed to add slot. Please try again.');
    }
  };

  const handleDeleteSlot = async (venueId, slotId) => {
    if (!window.confirm('Are you sure you want to delete this slot?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/venues/${venueId}/slots/${slotId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete slot');
      }
      await fetchVenues();
      if (onVenueUpdate) onVenueUpdate();
    } catch (error) {
      console.error('Error deleting slot:', error);
      alert(error.message || 'Failed to delete slot. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-heading font-bold text-white mb-4">Your Venues</h2>
        {venues.length === 0 ? (
          <div className="glass rounded-xl p-12 text-center">
            <p className="text-neutral text-lg mb-2">No venues yet</p>
            <p className="text-neutral text-sm">Click "Add Venue" in the dashboard to create your first venue</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => (
            <motion.div
              key={venue._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-6"
            >
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-white">{venue.name}</h3>
                  {venue.isApproved ? (
                    <span className="flex items-center gap-1 text-xs text-primary font-bold">
                      <CheckCircle className="w-4 h-4" />
                      Approved
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-muted font-bold">
                      <AlertCircle className="w-4 h-4" />
                      Pending
                    </span>
                  )}
                </div>
                <p className="text-neutral text-sm">{venue.location}</p>
                <p className="text-xs text-primary mt-1">{venue.sport}</p>
                {!venue.isApproved && (
                  <button
                    onClick={async () => {
                      try {
                        await approveVenue(venue._id);
                        await fetchVenues();
                        if (onVenueUpdate) onVenueUpdate();
                      } catch (error) {
                        alert('Failed to approve venue. Please try again.');
                      }
                    }}
                    className="mt-2 btn-glow bg-gradient-primary text-secondary px-4 py-2 rounded-lg text-xs font-bold hover:shadow-glow"
                  >
                    Approve Venue
                  </button>
                )}
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold text-primary">Available Slots</h4>
                  <button
                    onClick={() => {
                      setSelectedVenue(venue);
                      setShowSlotModal(true);
                    }}
                    className="btn-glow glass border border-primary/50 text-primary px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 hover:border-primary"
                  >
                    <Plus className="w-4 h-4" />
                    Add Slot
                  </button>
                </div>

                <div className="space-y-3">
                  {venue.slots && venue.slots.length > 0 ? (
                    venue.slots.map((slot, index) => (
                      <div
                        key={slot._id || index}
                        className="glass rounded-lg p-3 flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-neutral" />
                            <span className="text-white text-sm font-bold">
                              {slot.startTime} - {slot.endTime}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-primary font-bold">₹{slot.price}/hr</span>
                          <button
                            onClick={() => handleDeleteSlot(venue._id, slot._id)}
                            className="p-1.5 rounded-lg hover:bg-danger/10 text-danger"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-neutral text-sm text-center py-4">No slots added yet</p>
                  )}
                </div>
              </div>
            </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add Slot Modal */}
      <Modal
        isOpen={showSlotModal}
        onClose={() => {
          setShowSlotModal(false);
          setSlotForm({ startTime: '', endTime: '', price: '' });
        }}
        title={`Add Slot - ${selectedVenue?.name}`}
      >
        <form onSubmit={handleAddSlot} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-neutral mb-2">Start Time</label>
              <input
                type="time"
                value={slotForm.startTime}
                onChange={(e) => setSlotForm({ ...slotForm, startTime: e.target.value })}
                required
                className="w-full bg-secondary/50 border border-neutral/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral mb-2">End Time</label>
              <input
                type="time"
                value={slotForm.endTime}
                onChange={(e) => setSlotForm({ ...slotForm, endTime: e.target.value })}
                required
                className="w-full bg-secondary/50 border border-neutral/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-neutral mb-2">Price (₹)</label>
            <input
              type="number"
              value={slotForm.price}
              onChange={(e) => setSlotForm({ ...slotForm, price: e.target.value })}
              required
              min="0"
              className="w-full bg-secondary/50 border border-neutral/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="Enter price per slot"
            />
          </div>

          <button
            type="submit"
            className="w-full btn-glow bg-gradient-primary text-secondary py-3 rounded-xl font-bold hover:shadow-glow"
          >
            Add Slot
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default VenueManagement;