import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ userName }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  
  const openLogoutConfirm = () => {
    setDropdownOpen(false); // Close the dropdown first
    setShowLogoutConfirm(true);
  };
  
  const closeLogoutConfirm = () => {
    setShowLogoutConfirm(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  return (
    <div className="bg-white text-gray-800 p-4 shadow-md flex justify-between items-center sticky top-0 z-40">
      <div className="text-2xl font-semibold text-gray-800">
        {/* Removed the Welcome, {userName} text */}
      </div>
      <div className="relative">
        {/* Profile Image */}
        <img
          src="/assets/gojoprofile.jpg" // Replace with your actual profile image filename
          alt="Profile"
          className="w-10 h-10 rounded-full cursor-pointer ring-2 ring-gray-100 hover:ring-green-100 transition-all duration-200"
          onClick={toggleDropdown}
        />
        {/* Modern Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden transform transition-all duration-200">
            <ul>
              <li
                onClick={openLogoutConfirm}
                className="px-4 py-3 text-gray-700 cursor-pointer hover:bg-gray-50 flex items-center transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign out
              </li>
            </ul>
          </div>
        )}
      </div>
      
      {/* Modern Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4 transform transition-all duration-300 scale-100">
            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-50 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Sign out of ThriveWell?</h3>
              <p className="text-sm text-gray-500 mt-1">You'll need to sign in again to access your account.</p>
            </div>
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
              <button
                onClick={closeLogoutConfirm}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 bg-green-600 rounded-lg text-white font-medium text-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition-colors duration-200"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;