import React, { useEffect, useState } from 'react';
import { FaClipboard, FaBullseye, FaCalendarAlt, FaChartBar, FaBook, FaPlus, FaList, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('Entries');
  const [isEntriesOpen, setIsEntriesOpen] = useState(false);
  const [isGoalsOpen, setIsGoalsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [user, setUser] = useState({
    fullName: 'Guest User',
    email: 'guest@example.com'
  });

  useEffect(() => {
    // Get user data from localStorage when component mounts
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const userData = JSON.parse(userString);
        setUser({
          fullName: userData.fullName || 'Guest User',
          email: userData.email || 'guest@example.com'
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
        // If fetching from localStorage fails, try to get user data from API
        fetchUserData();
      }
    } else {
      // If no user in localStorage, try to get user data from API
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }
      
      const response = await fetch('http://localhost:8080/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser({
          fullName: userData.fullName || 'Guest User',
          email: userData.email || 'guest@example.com'
        });
        
        // Save to localStorage for future use
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/entries/add')) {
      setActiveItem('Add New Entry');
      setIsEntriesOpen(true);
    } else if (path.includes('/entries/manage')) {
      setActiveItem('Manage All Entries');
      setIsEntriesOpen(true);
    } else if (path.includes('/entries')) {
      setActiveItem('Entries');
      setIsEntriesOpen(true);
    } else if (path.includes('/goal/create')) {
      setActiveItem('Create Goal');
      setIsGoalsOpen(true);
    } else if (path.includes('/goal/view')) {
      setActiveItem('View All Goals');
      setIsGoalsOpen(true);
    } else if (path.includes('/calendar')) setActiveItem('Calendar');
    else if (path.includes('/charts')) setActiveItem('Charts');
    else if (path.includes('/resources')) setActiveItem('Libraries');
    else if (path.includes('/profile')) setActiveItem('User Profile');
  }, [location]);

  const handleNavigation = (item, path) => {
    setActiveItem(item);
    navigate(path);
  };

  const toggleEntriesMenu = () => {
    setIsEntriesOpen(!isEntriesOpen);
  };

  const toggleGoalsMenu = () => {
    setIsGoalsOpen(!isGoalsOpen);
  };
  
  const openLogoutConfirm = () => {
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
    <div className="w-64 bg-white shadow-lg text-gray-800 flex flex-col h-screen">
      {/* App Brand/Logo */}
      <div className="px-6 py-4 border-b border-gray-100">
        <h1 className="text-xl font-bold text-green-600">ThriveWell</h1>
      </div>
      
      {/* Profile Section - Now clickable to navigate to profile page */}
      <div 
        className="flex items-center px-6 py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
        onClick={() => handleNavigation('User Profile', '/profile')}
      >
        <div className="relative">
          <img
            src="/assets/gojoprofile.jpg"
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-gray-200 object-cover hover:border-green-400 transition-all duration-200"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border border-white"></div>
        </div>
        <div className="ml-3">
          <p className="font-medium text-gray-900">{user.fullName}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-grow py-6 px-4">
        <ul className="space-y-1">
          {/* Entries with Submenu */}
          <li className="space-y-1">
            <button
              onClick={toggleEntriesMenu}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                activeItem === 'Entries' || activeItem === 'Add New Entry' || activeItem === 'View All Entries'
                  ? 'bg-green-50 text-green-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className={`text-lg ${
                activeItem === 'Entries' || activeItem === 'Add New Entry' || activeItem === 'View All Entries'
                  ? 'text-green-600' 
                  : 'text-gray-500'
              }`}>
                <FaClipboard />
              </span>
              <span className="ml-3">Entries</span>
              
              <span className="ml-auto">
                {isEntriesOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
              </span>
            </button>
            
            {/* Entries Submenu items */}
            {isEntriesOpen && (
              <div className="pl-10 space-y-1 mt-1">
                <button
                  onClick={() => handleNavigation('Add New Entry', '/entries/add')}
                  className={`w-full flex items-center px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
                    activeItem === 'Add New Entry'
                      ? 'bg-green-50 text-green-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className={`text-sm ${activeItem === 'Add New Entry' ? 'text-green-600' : 'text-gray-500'}`}>
                    <FaPlus />
                  </span>
                  <span className="ml-2">Add New Entry</span>
                  
                  {activeItem === 'Add New Entry' && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-green-600"></span>
                  )}
                </button>
                
                <button
                  onClick={() => handleNavigation('Manage All Entries', '/entries/manage')}
                  className={`w-full flex items-center px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
                    activeItem === 'Manage All Entries'
                      ? 'bg-green-50 text-green-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className={`text-sm ${activeItem === 'Manage All Entries' ? 'text-green-600' : 'text-gray-500'}`}>
                    <FaList />
                  </span>
                  <span className="ml-2">Manage All Entries</span>
                  
                  {activeItem === 'Manage All Entries' && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-green-600"></span>
                  )}
                </button>
              </div>
            )}
          </li>
          
          {/* Goals with Submenu */}
          <li className="space-y-1">
            <button
              onClick={toggleGoalsMenu}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                activeItem === 'Goal' || activeItem === 'Create Goal' || activeItem === 'View All Goals'
                  ? 'bg-green-50 text-green-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className={`text-lg ${
                activeItem === 'Goal' || activeItem === 'Create Goal' || activeItem === 'View All Goals'
                  ? 'text-green-600' 
                  : 'text-gray-500'
              }`}>
                <FaBullseye />
              </span>
              <span className="ml-3">Goal</span>
              
              <span className="ml-auto">
                {isGoalsOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
              </span>
            </button>
            
            {/* Goals Submenu items */}
            {isGoalsOpen && (
              <div className="pl-10 space-y-1 mt-1">
                <button
                  onClick={() => handleNavigation('Create Goal', '/goal/create')}
                  className={`w-full flex items-center px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
                    activeItem === 'Create Goal'
                      ? 'bg-green-50 text-green-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className={`text-sm ${activeItem === 'Create Goal' ? 'text-green-600' : 'text-gray-500'}`}>
                    <FaPlus />
                  </span>
                  <span className="ml-2">Create Goal</span>
                  
                  {activeItem === 'Create Goal' && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-green-600"></span>
                  )}
                </button>
                
                <button
                  onClick={() => handleNavigation('View All Goals', '/goal/view')}
                  className={`w-full flex items-center px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
                    activeItem === 'View All Goals'
                      ? 'bg-green-50 text-green-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className={`text-sm ${activeItem === 'View All Goals' ? 'text-green-600' : 'text-gray-500'}`}>
                    <FaList />
                  </span>
                  <span className="ml-2">View All Goals</span>
                  
                  {activeItem === 'View All Goals' && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-green-600"></span>
                  )}
                </button>
              </div>
            )}
          </li>
          
          {/* Other menu items */}
          {[
            { name: 'Calendar', icon: <FaCalendarAlt />, path: '/calendar' },
            { name: 'Charts', icon: <FaChartBar />, path: '/charts' },
            { name: 'Libraries', icon: <FaBook />, path: '/resources' },
          ].map((item) => (
            <li key={item.name}>
              <button
                onClick={() => handleNavigation(item.name, item.path)}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeItem === item.name
                    ? 'bg-green-50 text-green-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className={`text-lg ${activeItem === item.name ? 'text-green-600' : 'text-gray-500'}`}>
                  {item.icon}
                </span>
                <span className="ml-3">{item.name}</span>
                
                {activeItem === item.name && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-green-600"></span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Footer */}
      <div className="mt-auto p-4 border-t border-gray-100">
        <button
          onClick={openLogoutConfirm}
          className="w-full text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Log out
        </button>
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

export default Sidebar;