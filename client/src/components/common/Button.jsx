import React from 'react';

const Button = ({ children, onClick, className = '', ...props }) => {
  // Default style: yellow background with black text, rounded and bold
  const base = 'px-4 py-2 rounded-full font-semibold transition';
  const theme = 'bg-primary text-secondary hover:shadow-glow';

  return (
    <button
      onClick={onClick}
      className={`${base} ${theme} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

