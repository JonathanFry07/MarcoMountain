import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/">
      <img
        src="/logo.jpg"
        alt="Logo"
        className="fixed top-4 left-4 rounded-full w-18 h-18 object-cover border-2 border-white shadow-md"
      />
    </Link>
  );
};

export default Logo;
