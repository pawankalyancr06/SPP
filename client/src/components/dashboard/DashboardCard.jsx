import React from 'react';

const DashboardCard = ({ title, value, icon }) => {
  return (
    <div className="dashboard-card">
      {icon && <div className="card-icon">{icon}</div>}
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
};

export default DashboardCard;

