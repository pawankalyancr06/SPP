import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getFavorites = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
};

export const addFavorite = async (venueId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/favorites/${venueId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding favorite:', error);
    throw error;
  }
};

export const removeFavorite = async (venueId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_URL}/favorites/${venueId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
};

export const checkFavorite = async (venueId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/favorites/check/${venueId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.isFavorited;
  } catch (error) {
    console.error('Error checking favorite:', error);
    return false;
  }
};

