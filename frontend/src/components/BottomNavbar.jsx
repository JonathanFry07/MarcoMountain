import React, { useState } from 'react';
import { Dumbbell, Utensils, LineChart, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const BottomNavbar = () => {
  const [activeTab, setActiveTab] = useState('home');

  const navItems = [
    { id: 'workout', label: 'Workout', icon: <Dumbbell />, to: '/workout' },
    { id: 'meals', label: 'Meals', icon: <Utensils /> },
    { id: 'home', label: 'Home', icon: <Home />, to: '/' },
    { id: 'track', label: 'Track', icon: <LineChart />, to : '/tracking'},
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white text-gray-500 border-t border-gray-200 shadow-lg">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`group flex flex-col items-center justify-center w-full h-full pt-1 pb-1 transition-colors duration-200 hover:bg-gray-300 ${
              activeTab === item.id ? 'text-blue-500' : ''
            }`}
            onClick={() => setActiveTab(item.id)}
          >
            {item.to ? (
              <Link to={item.to} className="group flex flex-col items-center justify-center">
                <div
                  className={`w-6 h-6 mb-1 group-hover:text-gray-700 ${activeTab === item.id ? 'text-blue-500' : 'text-teal-400'}`}
                >
                  {item.icon}
                </div>
                <span
                  className={`text-xs font-medium group-hover:text-gray-800 ${activeTab === item.id ? 'text-blue-500' : 'text-gray-600'}`}
                >
                  {item.label}
                </span>
              </Link>
            ) : (
              <div className="group flex flex-col items-center justify-center">
                <div
                  className={`w-6 h-6 mb-1 group-hover:text-gray-700 ${activeTab === item.id ? 'text-blue-500' : 'text-teal-400'}`}
                >
                  {item.icon}
                </div>
                <span
                  className={`text-xs font-medium group-hover:text-gray-800 ${activeTab === item.id ? 'text-blue-500' : 'text-gray-600'}`}
                >
                  {item.label}
                </span>
              </div>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavbar;
