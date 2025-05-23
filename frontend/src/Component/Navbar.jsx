import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function Navbar() {
  const token = Cookies.get('token');
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('userEmail');
    setShowDropdown(false);
    navigate('/login');
  };

  const navItemClass = `
    h-full px-4 flex items-center transition-colors duration-200 
    hover:bg-gray-100 hover:text-blue-500 rounded
  `;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md h-16">
      <div className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center">
        <div className="h-full flex items-center">
          <Link
            to="/"
            className="text-xl font-bold text-blue-600 px-4 h-full flex items-center"
          >
            NaviTrails
          </Link>
        </div>

        <div className="h-full flex items-center space-x-2">
          <Link to="/" className={navItemClass}>Home</Link>

          {!token ? (
            <>
              <Link to="/login" className={navItemClass}>Login</Link>
              <Link to="/register" className={navItemClass}>Register</Link>
            </>
          ) : (
            <div className="relative h-full flex items-center space-x-2">
              <Link to="/following-feed" className={navItemClass}>Following Feed</Link>
              <Link to="/personalblogs" className={navItemClass}>My Blogs</Link>

              <button
                className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition duration-200 focus:outline-none"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                👤
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-40 w-40 bg-white shadow-md rounded-md py-2 z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100 text-gray-700 transition-colors duration-200"
                    onClick={() => setShowDropdown(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
