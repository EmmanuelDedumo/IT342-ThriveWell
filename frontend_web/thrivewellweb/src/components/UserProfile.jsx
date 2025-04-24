import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaLock, FaCheck, FaExclamationCircle, FaCamera, FaEdit } from 'react-icons/fa';
import axios from 'axios';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const UserProfile = () => {
  const [user, setUser] = useState({
    id: '',
    fullName: '',
    email: '',
    createdAt: '',
    updatedAt: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'security'

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Not authenticated. Please login.');
          setLoading(false);
          return;
        }
        
        const response = await axios.get('http://localhost:8080/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load user data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Not authenticated. Please login.');
        setUpdating(false);
        return;
      }
      
      const response = await axios.put('http://localhost:8080/users/me', {
        fullName: user.fullName,
        email: user.email
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setUser(response.data);
      setSuccess('Profile updated successfully!');
      setUpdating(false);
      
      // Update local storage user data if you're storing it
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      userData.fullName = response.data.fullName;
      userData.email = response.data.email;
      localStorage.setItem('user', JSON.stringify(userData));
      
    } catch (err) {
      setError(err.response?.data || 'Failed to update profile. Please try again.');
      setUpdating(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }
    
    setChangingPassword(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setPasswordError('Not authenticated. Please login.');
        setChangingPassword(false);
        return;
      }
      
      await axios.post('http://localhost:8080/auth/change-password', {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setPasswordSuccess('Password changed successfully!');
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setChangingPassword(false);
    } catch (err) {
      setPasswordError(err.response?.data || 'Failed to change password. Please check your old password.');
      setChangingPassword(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar userName={user.fullName} />
          <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            <p className="mt-4 text-gray-600">Loading profile information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar userName={user.fullName} />
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header with Title and Photo */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">User Profile</h1>
                <p className="text-gray-500 mt-1">Manage your account information and settings</p>
              </div>
              <div className="mt-4 sm:mt-0 relative">
                <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-md">
                  <img
                    src="/assets/gojoprofile.jpg"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 right-0 p-1 bg-green-600 rounded-full shadow-lg cursor-pointer hover:bg-green-700 transition-colors duration-200">
                    <FaCamera className="text-white" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tabs Navigation */}
            <div className="mb-6 border-b border-gray-200">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-4 px-1 font-medium text-sm border-b-2 ${
                    activeTab === 'profile'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } transition-colors duration-200`}
                >
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`py-4 px-1 font-medium text-sm border-b-2 ${
                    activeTab === 'security'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } transition-colors duration-200`}
                >
                  Security
                </button>
              </nav>
            </div>
            
            {/* Content Based on Active Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
                    <div className="flex">
                      <FaExclamationCircle className="h-5 w-5 text-red-500 mr-2" />
                      <span>{error}</span>
                    </div>
                  </div>
                )}
                
                {success && (
                  <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-lg">
                    <div className="flex">
                      <FaCheck className="h-5 w-5 text-green-500 mr-2" />
                      <span>{success}</span>
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleProfileUpdate}>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="fullName">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <FaUser className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={user.fullName || ''}
                          onChange={handleInputChange}
                          className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 bg-white shadow-sm"
                          placeholder="Your full name"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <FaEnvelope className="text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={user.email || ''}
                          onChange={handleInputChange}
                          className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 bg-white shadow-sm"
                          placeholder="Your email address"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Account Created</h3>
                        <p className="text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">{formatDate(user.createdAt)}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Last Updated</h3>
                        <p className="text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">{formatDate(user.updatedAt)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-8">
                    <button
                      type="submit"
                      className="px-5 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition-colors duration-200 flex items-center shadow-sm"
                      disabled={updating}
                    >
                      {updating ? (
                        <>
                          <span className="animate-spin inline-block h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                          Updating...
                        </>
                      ) : (
                        <>
                          <FaEdit className="mr-2" />
                          Update Profile
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {activeTab === 'security' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                {passwordError && (
                  <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
                    <div className="flex">
                      <FaExclamationCircle className="h-5 w-5 text-red-500 mr-2" />
                      <span>{passwordError}</span>
                    </div>
                  </div>
                )}
                
                {passwordSuccess && (
                  <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-lg">
                    <div className="flex">
                      <FaCheck className="h-5 w-5 text-green-500 mr-2" />
                      <span>{passwordSuccess}</span>
                    </div>
                  </div>
                )}
                
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Change Password</h2>
                
                <form onSubmit={handlePasswordUpdate}>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="oldPassword">
                        Current Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <FaLock className="text-gray-400" />
                        </div>
                        <input
                          type="password"
                          id="oldPassword"
                          name="oldPassword"
                          value={passwordData.oldPassword}
                          onChange={handlePasswordChange}
                          className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 bg-white shadow-sm"
                          placeholder="Enter your current password"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="newPassword">
                        New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <FaLock className="text-gray-400" />
                        </div>
                        <input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 bg-white shadow-sm"
                          placeholder="Enter new password"
                          required
                          minLength="6"
                        />
                      </div>
                      <p className="mt-1 text-sm text-gray-500">Password must be at least 6 characters</p>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="confirmPassword">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <FaLock className="text-gray-400" />
                        </div>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 bg-white shadow-sm"
                          placeholder="Confirm new password"
                          required
                          minLength="6"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-8">
                    <button
                      type="submit"
                      className="px-5 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition-colors duration-200 flex items-center shadow-sm"
                      disabled={changingPassword}
                    >
                      {changingPassword ? (
                        <>
                          <span className="animate-spin inline-block h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                          Changing Password...
                        </>
                      ) : (
                        <>
                          <FaLock className="mr-2" />
                          Change Password
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;