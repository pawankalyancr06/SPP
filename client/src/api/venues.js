import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getVenues = async () => {
  try {
    // Fetch only approved venues for regular users
    const response = await axios.get(`${API_URL}/venues?approved=true`);
    return response.data;
  } catch (error) {
    console.error('Error fetching venues:', error);
    throw error;
  }
};

export const getVenueById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/venues/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching venue:', error);
    throw error;
  }
};

export const createVenue = async (venueData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/venues`, venueData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating venue:', error);
    throw error;
  }
};

export const approveVenue = async (venueId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.patch(`${API_URL}/venues/${venueId}/approve`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error approving venue:', error);
    throw error;
  }
};

export const rejectVenue = async (venueId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.patch(`${API_URL}/venues/${venueId}/reject`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error rejecting venue:', error);
    throw error;
  }
};
