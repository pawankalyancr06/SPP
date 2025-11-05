import React from 'react';

const BookingCard = ({ booking }) => {
  return (
    <div className="booking-card">
      <h3>{booking.venueName}</h3>
      <p>Date: {booking.date}</p>
      <p>Time: {booking.time}</p>
      <p>Status: {booking.status}</p>
    </div>
  );
};

export default BookingCard;

