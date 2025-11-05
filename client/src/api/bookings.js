import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getBookings = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/bookings`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

export const createBooking = async (bookingData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/bookings`, bookingData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const cancelBooking = async (bookingId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_URL}/bookings/${bookingId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }
};
