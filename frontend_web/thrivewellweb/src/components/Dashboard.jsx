/* import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const [activeItem, setActiveItem] = useState('Dashboard');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) setUserName(user.name);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {}
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      
      <div className="flex-1 flex flex-col">
        {}
        <Navbar userName={userName} />
        
        {}
        <main className="flex-1 p-6">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {}
              <div className="bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold">Card Title</h3>
                <p className="text-sm">Some content inside this card.</p>
              </div>

              {}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold">Card Title</h3>
                <p className="text-sm">Some content inside this card.</p>
              </div>

              {}
              <div className="bg-gradient-to-r from-green-500 to-lime-600 text-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold">Card Title</h3>
                <p className="text-sm">Some content inside this card.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;*/
