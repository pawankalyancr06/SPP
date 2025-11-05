import React from 'react';

const Input = ({ label, type, value, onChange, placeholder, ...props }) => {
  return (
    <div>
      {label && <label>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
};

export default Input;

