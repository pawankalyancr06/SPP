import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, Image as ImageIcon, FileText, Tag, Upload, Trash2 } from 'lucide-react';
import { createVenue } from '../../api/venues';

const CreateVenueForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    sport: 'Badminton',
    description: '',
  });
  const [images, setImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sports = ['Badminton', 'Football', 'Cricket', 'Gym'];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== fileArray.length) {
      setError('Please select only image files');
      return;
    }

    if (images.length + imageFiles.length > 10) {
      setError('Maximum 10 images allowed');
      return;
    }

    setImages([...images, ...imageFiles]);
    setError('');
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');

      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('sport', formData.sport);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('slots', JSON.stringify([]));

      // Append images
      images.forEach((image) => {
        formDataToSend.append('images', image);
      });

      const response = await fetch(`${API_URL}/venues`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create venue');
      }

      const venue = await response.json();
      onSuccess(venue);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create venue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-heading font-bold gradient-text">Create New Venue</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-primary transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-danger/20 border border-danger rounded-xl text-danger text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-neutral mb-2">
              Venue Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full bg-secondary/50 border border-neutral/20 rounded-xl px-4 py-3 text-white placeholder-neutral focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="Elite Football Turf"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-neutral mb-2">
              Location <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral w-5 h-5" />
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                className="w-full bg-secondary/50 border border-neutral/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-neutral focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Mumbai, Maharashtra"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-neutral mb-2">
              Sport Type <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral w-5 h-5" />
              <select
                value={formData.sport}
                onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                required
                className="w-full bg-secondary/50 border border-neutral/20 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {sports.map((sport) => (
                  <option key={sport} value={sport}>
                    {sport}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-neutral mb-2">
              Description
            </label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 text-neutral w-5 h-5" />
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full bg-secondary/50 border border-neutral/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-neutral focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Describe your venue, facilities, amenities, etc."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-neutral mb-2">
              Venue Images
            </label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-6 text-center transition ${
                dragActive
                  ? 'border-primary bg-primary/10'
                  : 'border-neutral/20 hover:border-primary/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileInput}
                className="hidden"
              />
              <ImageIcon className="w-12 h-12 text-neutral mx-auto mb-3" />
              <p className="text-neutral mb-2">
                Drag & drop images here, or{' '}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-primary hover:underline font-bold"
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-muted">Supports JPG, PNG, GIF, WEBP (Max 5MB each, up to 10 images)</p>
            </div>

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-danger rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 glass border border-neutral/20 text-neutral py-3 rounded-xl font-bold hover:border-primary hover:text-primary transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-glow bg-gradient-primary text-secondary py-3 rounded-xl font-bold hover:shadow-glow disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Venue'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateVenueForm;

