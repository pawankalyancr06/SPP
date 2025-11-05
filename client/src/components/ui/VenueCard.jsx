import React from 'react';

const VenueCard = ({ venue }) => {
  return (
    <div className="venue-card">
      <img src={venue.image} alt={venue.name} />
      <h3>{venue.name}</h3>
      <p>{venue.location}</p>
      <p>₹{venue.price}/hour</p>
    </div>
  );
};

export default VenueCard;

